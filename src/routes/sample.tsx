import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Container, Section, Eyebrow } from "@/components/site/Container";
import { Button } from "@/components/ui/button";
import { TrialDialog } from "@/components/site/TrialDialog";
import { BeforeAfter } from "@/components/site/BeforeAfter";
import { cn } from "@/lib/utils";
import { PORTFOLIO, PORTFOLIO_CATEGORIES, BRAND, type PortfolioItem } from "@/content/site";
import { supabase } from "@/integrations/supabase/client";
import { useDynamicPortfolio } from "@/lib/dynamic-content";

const SITE_URL = "https://pixiretouch.lovable.app";

export const Route = createFileRoute("/sample")({
  loader: async (): Promise<PortfolioItem[]> => {
    const { data } = await supabase
      .from("portfolio_items")
      .select("id,title,category,before_image,after_image")
      .eq("published", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    const mapped: PortfolioItem[] = (data ?? []).map((r) => ({
      id: r.id,
      title: r.title,
      category: r.category ?? "Studio",
      before: r.before_image,
      after: r.after_image,
    }));
    return mapped.length ? mapped : PORTFOLIO;
  },
  head: ({ loaderData }) => {
    const items = loaderData ?? [];
    const url = `${SITE_URL}/sample`;
    const title = `Portfolio — Before & After Retouching | ${BRAND.name}`;
    const description = `Selected before/after retouching work for ecommerce, fashion, jewelry and product brands by ${BRAND.name}.`;
    const ogImage = items[0]?.after ?? `${SITE_URL}/og-default.jpg`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        { property: "og:image", content: ogImage },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: ogImage },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ImageGallery",
            name: title,
            description,
            url,
            image: items.slice(0, 24).map((p) => ({
              "@type": "ImageObject",
              contentUrl: p.after,
              name: p.title,
              caption: `${p.title} — ${p.category}`,
            })),
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
              { "@type": "ListItem", position: 2, name: "Portfolio", item: url },
            ],
          }),
        },
      ],
    };
  },
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
