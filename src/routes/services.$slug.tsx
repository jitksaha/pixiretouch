import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, Check, Clock, Shield, Zap, Layers, FileImage, Sparkles, Quote, Star, Upload, FileCheck, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Container, Section, Eyebrow } from "@/components/site/Container";
import { TrialDialog } from "@/components/site/TrialDialog";
import { SERVICES, PROCESS, TESTIMONIALS, PORTFOLIO, BRAND, type PortfolioItem } from "@/content/site";
import { serviceImage } from "@/content/serviceImages";
import { BeforeAfter } from "@/components/site/BeforeAfter";
import { useServiceOverrides, applyServiceOverride } from "@/lib/dynamic-content";
import { supabase } from "@/integrations/supabase/client";

const SITE_URL = "https://pixiretouch.lovable.app";

const PROCESS_ICONS = [Send, Sparkles, Upload, FileCheck];
const FORMATS = ["JPG", "PNG", "TIFF", "PSD", "WEBP", "RAW"];
const DELIVERABLES = [
  { icon: Layers, title: "Layered PSD", body: "Non-destructive layers, named groups, masks intact for further edits." },
  { icon: FileImage, title: "Any format, any size", body: "Web-ready JPG/PNG/WebP or press-ready TIFF/PSD at your spec." },
  { icon: Shield, title: "Transparent or matte", body: "Clean alpha cutouts, pure-white #FFFFFF, or your branded background." },
  { icon: Sparkles, title: "Color-managed output", body: "sRGB, Adobe RGB or CMYK — soft-proofed for the destination." },
];

// Map service slug → portfolio categories that best illustrate it.
const SLUG_TO_CATEGORIES: Record<string, string[]> = {
  "clipping-path": ["Clipping Path", "Background Removal"],
  "background-removal": ["Background Removal", "Clipping Path"],
  "image-masking": ["Background Removal", "Clipping Path"],
  "shadow-creation": ["Background Removal", "Clipping Path"],
  "ghost-mannequin": ["Ghost Mannequin"],
  "product-photo-retouching": ["Retouching", "Background Removal"],
  "jewelry-retouching": ["Jewelry", "Retouching"],
  "ecommerce-image-editing": ["Background Removal", "Clipping Path", "Retouching"],
  "color-correction": ["Color Correction"],
  "photo-restoration": ["Retouching"],
  "photo-manipulation": ["Retouching", "Color Correction"],
  "neck-joint": ["Ghost Mannequin"],
  "image-enhancement": ["Retouching", "Color Correction"],
};

function pairsForService(slug: string): PortfolioItem[] {
  const cats = SLUG_TO_CATEGORIES[slug] ?? [];
  const matches = PORTFOLIO.filter((p) => cats.includes(p.category));
  return (matches.length ? matches : PORTFOLIO).slice(0, 3);
}

export const Route = createFileRoute("/services/$slug")({
  loader: async ({ params }) => {
    const base = SERVICES.find((s) => s.slug === params.slug);
    if (!base) throw notFound();
    const { data } = await supabase
      .from("services_content")
      .select("title,description,features")
      .eq("slug", params.slug)
      .maybeSingle();
    const dbFeatures = Array.isArray(data?.features)
      ? (data!.features as unknown[]).filter((x): x is string => typeof x === "string")
      : null;
    return {
      ...base,
      title: data?.title || base.title,
      description: data?.description || base.description,
      short: data?.description || base.short,
      features: dbFeatures && dbFeatures.length ? dbFeatures : base.features,
    };
  },
  head: ({ loaderData, params }) => {
    const s = loaderData;
    if (!s) return { meta: [] };
    const hero = serviceImage(params.slug);
    const url = `${SITE_URL}/services/${params.slug}`;
    const ogImage = hero.startsWith("http") ? hero : `${SITE_URL}${hero}`;
    const title = `${s.title} — ${BRAND.name}`;
    return {
      meta: [
        { title },
        { name: "description", content: s.description },
        { property: "og:title", content: title },
        { property: "og:description", content: s.description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { property: "og:image", content: ogImage },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: s.description },
        { name: "twitter:image", content: ogImage },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: s.title,
            description: s.description,
            image: ogImage,
            url,
            serviceType: s.title,
            areaServed: "Worldwide",
            provider: {
              "@type": "Organization",
              name: BRAND.name,
              url: SITE_URL,
              email: BRAND.email,
            },
            hasOfferCatalog: s.features?.length
              ? {
                  "@type": "OfferCatalog",
                  name: `${s.title} deliverables`,
                  itemListElement: s.features.map((f: string) => ({
                    "@type": "Offer",
                    itemOffered: { "@type": "Service", name: f },
                  })),
                }
              : undefined,
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
              { "@type": "ListItem", position: 2, name: "Services", item: `${SITE_URL}/services` },
              { "@type": "ListItem", position: 3, name: s.title, item: url },
            ],
          }),
        },
        ...(s.faqs.length
          ? [{
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: s.faqs.map((f: { q: string; a: string }) => ({
                  "@type": "Question",
                  name: f.q,
                  acceptedAnswer: { "@type": "Answer", text: f.a },
                })),
              }),
            }]
          : []),
      ],
    };
  },
  component: ServiceDetail,
  notFoundComponent: () => (
    <Section><Container><h1 className="font-display text-4xl">Service not found</h1><Link to="/services" className="mt-4 inline-block underline">Back to services</Link></Container></Section>
  ),
});

function ServiceDetail() {
  const baseService = Route.useLoaderData();
  const { overrides } = useServiceOverrides();
  const service = applyServiceOverride(baseService, overrides[baseService.slug]);
  const related = SERVICES.filter((s) => s.slug !== service.slug)
    .slice(0, 3)
    .map((s) => applyServiceOverride(s, overrides[s.slug]));
  const hero = serviceImage(service.slug);
  const idx = SERVICES.findIndex((s) => s.slug === service.slug);
  const num = String(idx + 1).padStart(2, "0");

  return (
    <>
      {/* Hero */}
      <Section className="pt-16 md:pt-20">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
            <div>
              <Link to="/services" className="font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground">
                ← All services
              </Link>
              <div className="mt-6 flex items-center gap-3">
                <span className="font-mono text-xs font-semibold text-primary">{num}</span>
                <span className="h-px w-8 bg-border" />
                <Eyebrow className="!mt-0">Service</Eyebrow>
              </div>
              <h1 className="mt-5 font-display text-5xl leading-[1.05] md:text-6xl">{service.title}</h1>
              <p className="mt-5 max-w-xl text-lg text-muted-foreground">{service.description}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <TrialDialog defaultService={service.slug} title={`${service.title} — Get a quote`} description="Tell us about your project — we reply within 45 minutes with a firm rate and a free trial edit.">
                  <Button size="lg">Get a quote <ArrowRight className="ml-1 h-4 w-4" /></Button>
                </TrialDialog>
                <Button asChild size="lg" variant="outline"><Link to="/sample">See examples</Link></Button>
              </div>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-muted/40">
              <img
                src={hero}
                alt={service.title}
                width={1024}
                height={768}
                className="h-full w-full object-cover"
              />
              <svg
                aria-hidden
                className="pointer-events-none absolute inset-0 h-full w-full p-6 opacity-40"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <path d="M6,6 L94,6 L94,94 L6,94 Z" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.3" strokeDasharray="1.5" />
                <circle cx="6" cy="6" r="0.9" fill="hsl(var(--primary))" />
                <circle cx="94" cy="6" r="0.9" fill="hsl(var(--primary))" />
                <circle cx="94" cy="94" r="0.9" fill="hsl(var(--primary))" />
                <circle cx="6" cy="94" r="0.9" fill="hsl(var(--primary))" />
              </svg>
              <span className="absolute bottom-4 right-4 bg-ink px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-tighter text-ink-foreground">
                {service.title}
              </span>
            </div>
          </div>
        </Container>
      </Section>

      {/* Stats strip */}
      <Section className="!py-10 border-y border-line bg-muted/20">
        <Container>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              { icon: Clock, k: "45 min", v: "Avg. quote response" },
              { icon: Zap, k: "6–24 h", v: "Standard turnaround" },
              { icon: Shield, k: "3-step", v: "Quality control" },
              { icon: Sparkles, k: "100%", v: "Hand-edited, no AI traces" },
            ].map(({ icon: Icon, k, v }) => (
              <div key={k} className="flex items-start gap-3">
                <Icon className="mt-1 h-5 w-5 text-primary" />
                <div>
                  <div className="font-display text-2xl">{k}</div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">{v}</div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Before / After */}
      <Section>
        <Container>
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <Eyebrow>See the difference</Eyebrow>
              <h2 className="mt-4 max-w-2xl font-display text-3xl md:text-4xl">{service.title} — before & after.</h2>
              <p className="mt-3 max-w-xl text-muted-foreground">Drag the handle, swipe on mobile, or tap the icon to open the full image.</p>
            </div>
            <div className="hidden items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground md:flex">
              <span className="inline-block h-2 w-2 rounded-full bg-primary" />
              Interactive slider
            </div>
          </div>
          {(() => {
            const pairs = pairsForService(service.slug);
            const [hero, ...rest] = pairs;
            return (
              <div className="mt-10 grid gap-6 lg:grid-cols-2">
                <BeforeAfter before={hero.before} after={hero.after} title={hero.title} className="lg:row-span-2" />
                <div className="grid gap-6">
                  {rest.map((p) => (
                    <BeforeAfter key={p.id} before={p.before} after={p.after} title={p.title} />
                  ))}
                </div>
              </div>
            );
          })()}
        </Container>
      </Section>

      {/* Included + Industries */}
      <Section>
        <Container className="grid gap-12 lg:grid-cols-2">
          <div>
            <Eyebrow>What's included</Eyebrow>
            <h2 className="mt-4 font-display text-3xl md:text-4xl">Every {service.title.toLowerCase()} edit delivers:</h2>
            <ul className="mt-8 space-y-4">
              {service.features.map((f: string) => (
                <li key={f} className="flex gap-3 border-t border-line pt-4">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Eyebrow>Industries</Eyebrow>
            <h2 className="mt-4 font-display text-3xl md:text-4xl">Where it fits best.</h2>
            <div className="mt-8 grid gap-3">
              {service.industries.map((i: string) => (
                <div key={i} className="rounded-xl border border-border bg-card px-5 py-4">{i}</div>
              ))}
            </div>
            <p className="mt-8 text-sm text-muted-foreground">
              Also part of our family at{" "}
              <a href="https://pixiraw.com" target="_blank" rel="noreferrer" className="underline-offset-4 hover:underline">Pixiraw.com</a> — explore the wider creative network.
            </p>
          </div>
        </Container>
      </Section>

      {/* Process */}
      <Section className="bg-muted/20 border-y border-line">
        <Container>
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <Eyebrow>How it works</Eyebrow>
              <h2 className="mt-4 max-w-2xl font-display text-3xl md:text-4xl">From quote to delivery in four quiet steps.</h2>
            </div>
            <p className="max-w-sm text-sm text-muted-foreground">A repeatable workflow that's been delivering {service.title.toLowerCase()} batches to studios and brands for over a decade.</p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {PROCESS.map((p, i) => {
              const Icon = PROCESS_ICONS[i] ?? Send;
              return (
                <div key={p.step} className="relative rounded-2xl border border-border bg-background p-6">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold text-primary">{p.step}</span>
                    <Icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <h3 className="mt-5 font-display text-xl">{p.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{p.body}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* Deliverables + formats */}
      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
            <div>
              <Eyebrow>Deliverables</Eyebrow>
              <h2 className="mt-4 font-display text-3xl md:text-4xl">What lands in your inbox.</h2>
              <p className="mt-5 text-muted-foreground">Files arrive named to your spec, organized by SKU or shoot, and ready to drop straight into your CMS, PIM or print pipeline.</p>
              <div className="mt-8">
                <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Supported formats</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {FORMATS.map((f) => (
                    <span key={f} className="rounded-md border border-border bg-muted/40 px-3 py-1.5 font-mono text-xs">{f}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {DELIVERABLES.map(({ icon: Icon, title, body }) => (
                <div key={title} className="rounded-2xl border border-border bg-card p-6">
                  <Icon className="h-6 w-6 text-primary" />
                  <h3 className="mt-4 font-display text-lg">{title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Testimonial */}
      <Section className="bg-muted/30 border-y border-line">
        <Container>
          {(() => {
            const t = TESTIMONIALS[idx % TESTIMONIALS.length];
            return (
              <figure className="mx-auto max-w-3xl text-center">
                <Quote className="mx-auto h-8 w-8 text-primary" />
                <div className="mt-4 flex justify-center gap-1">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <blockquote className="mt-6 font-display text-2xl leading-snug md:text-3xl">
                  "{t.quote}"
                </blockquote>
                <figcaption className="mt-6 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{t.name}</span> — {t.role}
                </figcaption>
              </figure>
            );
          })()}
        </Container>
      </Section>

      {/* FAQ */}
      {service.faqs.length > 0 && (
        <Section className="bg-muted/30">
          <Container className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
            <div>
              <Eyebrow>FAQ</Eyebrow>
              <h2 className="mt-4 font-display text-3xl md:text-4xl">Common questions about {service.title.toLowerCase()}.</h2>
            </div>
            <Accordion type="single" collapsible className="rounded-2xl border border-border bg-background px-2">
              {service.faqs.map((f: { q: string; a: string }, i: number) => (
                <AccordionItem key={i} value={`f-${i}`} className="px-4">
                  <AccordionTrigger className="text-left font-medium">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Container>
        </Section>
      )}

      {/* Related — image cards */}
      <Section>
        <Container>
          <Eyebrow>Related services</Eyebrow>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {related.map((s) => (
              <Link
                key={s.slug}
                to="/services/$slug"
                params={{ slug: s.slug }}
                className="group overflow-hidden rounded-2xl border border-border bg-background transition hover:shadow-lift"
              >
                <div className="aspect-[4/3] overflow-hidden bg-muted/40">
                  <img
                    src={serviceImage(s.slug)}
                    alt={s.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-2xl">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.short}</p>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      <Section ink>
        <Container className="text-center">
          <h2 className="mx-auto max-w-3xl font-display text-4xl md:text-5xl">Try {service.title.toLowerCase()} on two free images.</h2>
          <div className="mt-8">
            <TrialDialog defaultService={service.slug} title={`Try ${service.title.toLowerCase()}`} description="Send up to 2 sample images — we'll edit them free of charge so you can judge the quality.">
              <Button size="lg" variant="secondary">Start free trial</Button>
            </TrialDialog>
          </div>
        </Container>
      </Section>
    </>
  );
}
