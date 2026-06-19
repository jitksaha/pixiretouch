import { createFileRoute, Link } from "@tanstack/react-router";
import { Container, Section, Eyebrow } from "@/components/site/Container";
import { Button } from "@/components/ui/button";
import { SERVICES } from "@/content/site";
import heroImg from "@/assets/services-hero.jpg";
import clippingImg from "@/assets/service-clipping.jpg";
import ghostImg from "@/assets/service-ghost.jpg";
import jewelryImg from "@/assets/service-jewelry.jpg";

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

const indexOf = (slug: string) => SERVICES.findIndex((s) => s.slug === slug);
const num = (slug: string) => String(indexOf(slug) + 1).padStart(2, "0");
const get = (slug: string) => SERVICES.find((s) => s.slug === slug)!;

const FEATURED = ["clipping-path", "background-removal", "ghost-mannequin", "jewelry-retouching"];
const STRIP = ["shadow-creation", "product-photo-retouching", "color-correction", "photo-restoration"];

function ServicesIndex() {
  const clipping = get("clipping-path");
  const bg = get("background-removal");
  const ghost = get("ghost-mannequin");
  const jewelry = get("jewelry-retouching");
  const strip = STRIP.map(get).filter(Boolean);
  const rest = SERVICES.filter((s) => !FEATURED.includes(s.slug) && !STRIP.includes(s.slug));

  return (
    <>
      {/* Hero */}
      <Section className="pt-16 md:pt-20">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <Eyebrow>Services</Eyebrow>
              <h1 className="mt-5 font-display text-5xl leading-[1.05] md:text-6xl lg:text-7xl">
                Thirteen specialist services. One studio.
              </h1>
              <p className="mt-6 max-w-xl text-lg text-muted-foreground">
                Every service below is delivered by senior retouchers, QC'd in three passes, and priced per image. Pick one or combine them into a full post-production pipeline.
              </p>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-background">
              <img
                src={heroImg}
                alt="High-end watch being edited with pen-tool vector paths"
                width={1280}
                height={896}
                className="h-full w-full object-cover"
              />
              <svg
                aria-hidden
                className="pointer-events-none absolute inset-0 h-full w-full p-8 opacity-40"
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
                High-end post production
              </span>
            </div>
          </div>
        </Container>
      </Section>

      {/* Architectural grid */}
      <Section>
        <Container>
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-12">
            {/* Clipping Path — wide feature */}
            <Link
              to="/services/$slug"
              params={{ slug: clipping.slug }}
              className="group flex flex-col gap-8 bg-background p-8 transition hover:bg-muted/30 md:col-span-8 lg:p-12 lg:flex-row"
            >
              <div className="flex-1">
                <span className="mb-3 block font-mono text-xs font-semibold text-primary">{num(clipping.slug)}</span>
                <h2 className="font-display text-3xl md:text-4xl">{clipping.title}</h2>
                <p className="mt-4 max-w-lg text-base text-muted-foreground md:text-lg">{clipping.description}</p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {clipping.features.slice(0, 3).map((f) => (
                    <li key={f} className="rounded-full border border-border px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{f}</li>
                  ))}
                </ul>
              </div>
              <div className="aspect-square w-full overflow-hidden rounded-lg bg-muted/40 lg:w-2/5">
                <img src={clippingImg} alt={clipping.title} width={800} height={800} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
            </Link>

            {/* Background Removal — small swatch */}
            <Link
              to="/services/$slug"
              params={{ slug: bg.slug }}
              className="group flex flex-col bg-background p-8 transition hover:bg-muted/30 md:col-span-4 lg:p-10"
            >
              <span className="mb-3 block font-mono text-xs font-semibold text-primary">{num(bg.slug)}</span>
              <h2 className="font-display text-2xl md:text-3xl">{bg.title}</h2>
              <p className="mt-3 text-sm text-muted-foreground">{bg.short}</p>
              <div className="mt-6 grid grid-cols-2 gap-2">
                <div className="flex aspect-square items-center justify-center rounded-md border border-border bg-background font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  White
                </div>
                <div
                  className="flex aspect-square items-center justify-center rounded-md border border-border font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"
                  style={{
                    backgroundImage:
                      "linear-gradient(45deg, hsl(var(--muted)) 25%, transparent 25%), linear-gradient(-45deg, hsl(var(--muted)) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, hsl(var(--muted)) 75%), linear-gradient(-45deg, transparent 75%, hsl(var(--muted)) 75%)",
                    backgroundSize: "12px 12px",
                    backgroundPosition: "0 0, 0 6px, 6px -6px, -6px 0",
                  }}
                >
                  Transparent
                </div>
              </div>
            </Link>

            {/* Ghost Mannequin — portrait card */}
            <Link
              to="/services/$slug"
              params={{ slug: ghost.slug }}
              className="group flex flex-col bg-background p-8 transition hover:bg-muted/30 md:col-span-4 lg:p-10"
            >
              <div className="mb-6 aspect-[3/4] overflow-hidden rounded-lg bg-muted/40">
                <img src={ghostImg} alt={ghost.title} width={768} height={1024} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <span className="mb-3 block font-mono text-xs font-semibold text-primary">{num(ghost.slug)}</span>
              <h2 className="font-display text-2xl md:text-3xl">{ghost.title}</h2>
              <p className="mt-3 text-sm text-muted-foreground">{ghost.short}</p>
            </Link>

            {/* Jewelry — wide reversed */}
            <Link
              to="/services/$slug"
              params={{ slug: jewelry.slug }}
              className="group flex flex-col gap-8 bg-background p-8 transition hover:bg-muted/30 md:col-span-8 lg:p-12 lg:flex-row-reverse lg:items-center"
            >
              <div className="aspect-square w-full overflow-hidden rounded-lg bg-muted/40 lg:w-1/2">
                <img src={jewelryImg} alt={jewelry.title} width={1024} height={1024} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="flex-1">
                <span className="mb-3 block font-mono text-xs font-semibold text-primary">{num(jewelry.slug)}</span>
                <h2 className="font-display text-3xl md:text-4xl">{jewelry.title}</h2>
                <p className="mt-4 max-w-md text-base text-muted-foreground md:text-lg">{jewelry.description}</p>
                <span className="mt-8 inline-flex items-center gap-2 bg-ink px-5 py-2.5 font-mono text-[10px] font-bold uppercase tracking-widest text-ink-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  View details
                </span>
              </div>
            </Link>

            {/* Strip row */}
            <div className="grid gap-10 bg-background p-8 md:col-span-12 md:grid-cols-2 lg:grid-cols-4 lg:p-12">
              {strip.map((s) => (
                <Link
                  key={s.slug}
                  to="/services/$slug"
                  params={{ slug: s.slug }}
                  className="group flex flex-col"
                >
                  <span className="mb-3 font-mono text-xs font-semibold text-primary">{num(s.slug)}</span>
                  <h3 className="font-display text-xl group-hover:text-primary">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.short}</p>
                </Link>
              ))}
            </div>

            {/* Remaining services — same compact strip pattern */}
            {rest.length > 0 && (
              <div className="grid gap-10 bg-background p-8 md:col-span-12 md:grid-cols-2 lg:grid-cols-4 lg:p-12">
                {rest.map((s) => (
                  <Link
                    key={s.slug}
                    to="/services/$slug"
                    params={{ slug: s.slug }}
                    className="group flex flex-col"
                  >
                    <span className="mb-3 font-mono text-xs font-semibold text-primary">{num(s.slug)}</span>
                    <h3 className="font-display text-xl group-hover:text-primary">{s.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{s.short}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section ink>
        <Container className="text-center">
          <h2 className="mx-auto max-w-3xl font-display text-4xl md:text-6xl">Not sure which service you need?</h2>
          <p className="mx-auto mt-4 max-w-xl text-ink-foreground/70">Send a sample image. We'll recommend the right combination and quote it free.</p>
          <div className="mt-8">
            <Button asChild size="lg" variant="secondary"><Link to="/contact">Get a recommendation</Link></Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
