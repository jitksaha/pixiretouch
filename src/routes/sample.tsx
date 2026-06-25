import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Container, Section, Eyebrow } from "@/components/site/Container";
import { Button } from "@/components/ui/button";
import { TrialDialog } from "@/components/site/TrialDialog";
import { BeforeAfter } from "@/components/site/BeforeAfter";
import { cn } from "@/lib/utils";
import { PORTFOLIO_CATEGORIES, type PortfolioItem } from "@/content/site";
import { useDynamicPortfolio } from "@/lib/dynamic-content";

export const Route = createFileRoute("/sample")({
  head: () => ({
    meta: [
      { title: "Sample Work — Pixi Retouch" },
      { name: "description", content: "Selected before/after retouching work for ecommerce, fashion, jewelry and product brands." },
      { property: "og:title", content: "Sample Work — Pixi Retouch" },
      { property: "og:description", content: "Selected retouching work from the Pixi Retouch studio." },
      { property: "og:url", content: "/sample" },
    ],
    links: [{ rel: "canonical", href: "/sample" }],
  }),
  component: Sample,
});

function Sample() {
  const [cat, setCat] = useState<string>("All");
  const { items: all } = useDynamicPortfolio();
  const items = useMemo(
    () => (cat === "All" ? all : all.filter((p: PortfolioItem) => p.category === cat)),
    [cat, all],
  );

  return (
    <>
      {/* Hero */}
      <Section className="bg-[color:var(--surface-rose)] pt-16 pb-12 md:pt-20 md:pb-16">
        <Container>
          <div className="grid items-end gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <Eyebrow>Portfolio</Eyebrow>
              <h1 className="mt-4 max-w-3xl font-display text-4xl leading-[1.05] md:text-6xl">
                Drag, compare, judge for yourself.
              </h1>
              <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
                Most of our work is under NDA. Below is a sample we're cleared to show — filter by service, drag any slider to see the edit.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <TrialDialog>
                <Button size="lg" className="rounded-full px-7">Get a quote <ArrowRight className="ml-1 h-4 w-4" /></Button>
              </TrialDialog>
              <Button asChild size="lg" variant="outline" className="rounded-full px-7">
                <Link to="/services">Browse services</Link>
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* Filter chips */}
      <div className="sticky top-12 z-30 border-y border-border bg-background/95 py-3 backdrop-blur">
        <Container>
          <div className="flex flex-wrap gap-2">
            {PORTFOLIO_CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-sm transition",
                  cat === c
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-muted-foreground hover:text-foreground"
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </Container>
      </div>

      {/* Grid of before/after sliders */}
      <Section className="bg-[color:var(--surface-cream)] py-14 md:py-20">
        <Container>
          <div className="grid gap-8 md:grid-cols-2">
            {items.map((p) => (
              <figure
                key={p.id}
                className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft"
              >
                <BeforeAfter before={p.before} after={p.after} className="aspect-[4/3]" />
                <figcaption className="flex items-center justify-between gap-3 p-5">
                  <div>
                    <div className="font-display text-lg">{p.title}</div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">{p.category}</div>
                  </div>
                  <span className="rounded-full bg-[color:var(--surface-rose)] px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-primary">
                    Before · After
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>

          {items.length === 0 && (
            <p className="py-16 text-center text-muted-foreground">No samples in this category yet.</p>
          )}
        </Container>
      </Section>

      {/* CTA */}
      <Section ink className="py-14 md:py-20">
        <Container className="grid items-center gap-6 text-center md:grid-cols-[1.5fr_1fr] md:text-left">
          <h2 className="font-display text-3xl md:text-5xl">Want this finish on your own catalog?</h2>
          <div className="flex flex-wrap justify-center gap-3 md:justify-end">
            <TrialDialog>
              <Button size="lg" variant="secondary" className="rounded-full px-7">Send 2 sample images</Button>
            </TrialDialog>
          </div>
        </Container>
      </Section>
    </>
  );
}
