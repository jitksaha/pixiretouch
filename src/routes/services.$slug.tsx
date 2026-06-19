import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Container, Section, Eyebrow } from "@/components/site/Container";
import { TrialDialog } from "@/components/site/TrialDialog";
import { SERVICES } from "@/content/site";
import { serviceImage } from "@/content/serviceImages";

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    const service = SERVICES.find((s) => s.slug === params.slug);
    if (!service) throw notFound();
    return service;
  },
  head: ({ loaderData }) => {
    const s = loaderData;
    if (!s) return { meta: [] };
    const hero = serviceImage(s.slug);
    return {
      meta: [
        { title: `${s.title} — Pixi Retouch` },
        { name: "description", content: s.short },
        { property: "og:title", content: `${s.title} — Pixi Retouch` },
        { property: "og:description", content: s.short },
        { property: "og:url", content: `/services/${s.slug}` },
        { property: "og:image", content: hero },
        { name: "twitter:image", content: hero },
      ],
      links: [{ rel: "canonical", href: `/services/${s.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: s.title,
            description: s.description,
            image: hero,
            provider: { "@type": "Organization", name: "Pixi Retouch" },
          }),
        },
        ...(s.faqs.length
          ? [{
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: s.faqs.map((f) => ({
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
  const service = Route.useLoaderData();
  const related = SERVICES.filter((s) => s.slug !== service.slug).slice(0, 3);
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
                <Button asChild size="lg"><Link to="/contact">Get a quote <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
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
