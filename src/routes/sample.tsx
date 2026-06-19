import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Container, Section, Eyebrow } from "@/components/site/Container";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { PORTFOLIO, PORTFOLIO_CATEGORIES, type PortfolioItem } from "@/content/site";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — Pixi Retouch" },
      { name: "description", content: "Selected before/after retouching work for ecommerce, fashion, jewelry and product brands." },
      { property: "og:title", content: "Portfolio — Pixi Retouch" },
      { property: "og:description", content: "Selected retouching work from the Pixi Retouch studio." },
      { property: "og:url", content: "/portfolio" },
    ],
    links: [{ rel: "canonical", href: "/portfolio" }],
  }),
  component: Portfolio,
});

function Portfolio() {
  const [cat, setCat] = useState<string>("All");
  const [open, setOpen] = useState<PortfolioItem | null>(null);
  const items = cat === "All" ? PORTFOLIO : PORTFOLIO.filter((p) => p.category === cat);

  return (
    <>
      <Section className="pt-20 md:pt-28">
        <Container>
          <Eyebrow>Portfolio</Eyebrow>
          <h1 className="mt-5 max-w-4xl font-display text-5xl md:text-7xl">A small selection of recent work.</h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            Most of our work is under NDA. The pieces below are samples we're cleared to show — filter by service to see the technique.
          </p>

          <div className="mt-12 flex flex-wrap gap-2">
            {PORTFOLIO_CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm transition",
                  cat === c
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-background text-muted-foreground hover:text-foreground"
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="pt-0">
        <Container>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p) => (
              <button
                key={p.id}
                onClick={() => setOpen(p)}
                className="group overflow-hidden rounded-xl border border-border bg-card text-left"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={p.after} alt={p.title} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                </div>
                <div className="flex items-center justify-between p-4">
                  <span className="text-sm font-medium">{p.title}</span>
                  <span className="text-xs text-muted-foreground">{p.category}</span>
                </div>
              </button>
            ))}
          </div>
        </Container>
      </Section>

      <Dialog open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
        <DialogContent className="max-w-5xl">
          <DialogTitle className="font-display text-2xl">{open?.title}</DialogTitle>
          {open && (
            <div className="grid gap-3 sm:grid-cols-2">
              <Figure label="Before" src={open.before} />
              <Figure label="After" src={open.after} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function Figure({ label, src }: { label: string; src: string }) {
  return (
    <figure className="overflow-hidden rounded-lg border border-border">
      <div className="bg-muted px-3 py-2 text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <img src={src} alt={label} className="aspect-[4/3] w-full object-cover" />
    </figure>
  );
}
