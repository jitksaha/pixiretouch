import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Container, Section, Eyebrow } from "@/components/site/Container";
import { Button } from "@/components/ui/button";
import { TrialDialog } from "@/components/site/TrialDialog";
import { ServiceZigzag, type ZigzagRow } from "@/components/site/ServiceZigzag";
import { WhyUsGrid } from "@/components/site/WhyUsGrid";
import { SERVICES, PORTFOLIO } from "@/content/site";
import heroImg from "@/assets/services-hero.jpg";

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: [
      { title: "Image Editing Services — Pixi Retouch" },
      { name: "description", content: "Clipping path, background removal, ghost mannequin, jewelry retouching and more — a full post-production stack for ecommerce." },
      { property: "og:title", content: "Image Editing Services — Pixi Retouch" },
      { property: "og:description", content: "A complete post-production stack for product imagery — clipping path, masking, ghost mannequin, retouching, color correction." },
      { property: "og:url", content: "/services" },
      { property: "og:image", content: heroImg },
      { name: "twitter:image", content: heroImg },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: ServicesIndex,
});

const svc = (slug: string) => SERVICES.find((s) => s.slug === slug)!;
const port = (id: string) => PORTFOLIO.find((p) => p.id === id)!;

const ZIGZAG: ZigzagRow[] = [
  { slug: "clipping-path",            num: "01", title: svc("clipping-path").title,            body: svc("clipping-path").description,            bullets: svc("clipping-path").features,            before: port("p1").before, after: port("p1").after },
  { slug: "background-removal",       num: "02", title: svc("background-removal").title,       body: svc("background-removal").description,       bullets: svc("background-removal").features,       before: port("p2").before, after: port("p2").after },
  { slug: "product-photo-retouching", num: "03", title: "Photo Retouching",                     body: svc("product-photo-retouching").description, bullets: svc("product-photo-retouching").features, before: port("p5").before, after: port("p5").after },
  { slug: "image-masking",            num: "04", title: svc("image-masking").title,             body: svc("image-masking").description,            bullets: svc("image-masking").features,            before: port("p8").before, after: port("p8").after },
  { slug: "shadow-creation",          num: "05", title: "Shadow Making",                        body: svc("shadow-creation").description,          bullets: svc("shadow-creation").features,          before: port("p6").before, after: port("p6").after },
  { slug: "ghost-mannequin",          num: "06", title: "Ghost Mannequin / Neck Joint",         body: svc("ghost-mannequin").description,          bullets: svc("ghost-mannequin").features,          before: port("p3").before, after: port("p3").after },
  { slug: "jewelry-retouching",       num: "07", title: svc("jewelry-retouching").title,        body: svc("jewelry-retouching").description,       bullets: svc("jewelry-retouching").features,       before: port("p4").before, after: port("p4").after },
  { slug: "ecommerce-image-editing",  num: "08", title: svc("ecommerce-image-editing").title,   body: svc("ecommerce-image-editing").description,  bullets: svc("ecommerce-image-editing").features,  before: port("p7").before, after: port("p7").after },
];

const COMPACT_SLUGS = ["color-correction", "photo-restoration", "photo-manipulation", "neck-joint", "image-enhancement"];

function ServicesIndex() {
  const compact = COMPACT_SLUGS.map(svc).filter(Boolean);

  return (
    <>
      {/* Hero */}
      <Section className="bg-[color:var(--surface-rose)] pt-16 pb-14 md:pt-20 md:pb-20">
        <Container className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <Eyebrow>Professional Photoshop services</Eyebrow>
            <h1 className="mt-5 font-display text-4xl leading-[1.05] md:text-5xl lg:text-[3.6rem]">
              Thirteen specialist services. One studio.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Every service is delivered by senior retouchers, QC'd in three passes, and priced per image. Pick one or combine them into a full post-production pipeline.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <TrialDialog>
                <Button size="lg" className="rounded-full px-7">Get a quote <ArrowRight className="ml-1 h-4 w-4" /></Button>
              </TrialDialog>
              <Button asChild size="lg" variant="outline" className="rounded-full px-7">
                <Link to="/pricing">View pricing</Link>
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 -z-10 translate-x-6 translate-y-6 rounded-[2.5rem] bg-primary/15" />
            <img
              src={heroImg}
              alt="High-end watch being edited with pen-tool vector paths"
              width={1280}
              height={896}
              className="w-full rounded-3xl border border-border object-cover shadow-lift"
            />
          </div>
        </Container>
      </Section>

      {/* Zigzag services */}
      <Section className="bg-background">
        <Container>
          <div className="space-y-20 md:space-y-24">
            {ZIGZAG.map((row, i) => (
              <ServiceZigzag key={row.slug} row={row} reverse={i % 2 === 1} />
            ))}
          </div>
        </Container>
      </Section>

      {/* Compact / additional services */}
      <Section className="bg-[color:var(--surface-cream)]">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <Eyebrow className="justify-center">Also available</Eyebrow>
            <h2 className="mt-4 font-display text-3xl md:text-4xl">More services to round out your post-production stack.</h2>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {compact.map((s, i) => (
              <Link
                key={s.slug}
                to="/services/$slug"
                params={{ slug: s.slug }}
                className="group flex flex-col gap-3 rounded-2xl border border-border bg-background p-7 transition hover:-translate-y-1 hover:shadow-lift"
              >
                <span className="font-mono text-xs font-semibold text-primary">
                  {String(i + 9).padStart(2, "0")}
                </span>
                <h3 className="font-display text-xl group-hover:text-primary">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.short}</p>
                <span className="mt-auto inline-flex items-center gap-1 pt-3 text-sm font-medium text-primary">
                  Read more <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      {/* Why us */}
      <Section className="bg-[color:var(--surface-sand)]">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <Eyebrow className="justify-center">Why Pixi Retouch</Eyebrow>
            <h2 className="mt-4 font-display text-4xl md:text-5xl">A studio you can hand the whole catalog to.</h2>
          </div>
          <div className="mt-12">
            <WhyUsGrid />
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section ink className="py-14 md:py-20">
        <Container className="text-center">
          <h2 className="mx-auto max-w-3xl font-display text-3xl md:text-5xl">Not sure which service you need?</h2>
          <p className="mx-auto mt-4 max-w-xl text-ink-foreground/70">Send a sample image. We'll recommend the right combination and quote it free.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <TrialDialog>
              <Button size="lg" variant="secondary" className="rounded-full px-7">Get a recommendation</Button>
            </TrialDialog>
            <Button asChild size="lg" variant="outline" className="rounded-full px-7 border-ink-foreground/30 bg-transparent text-ink-foreground hover:bg-ink-foreground/10 hover:text-ink-foreground">
              <Link to="/sample">See the work</Link>
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
