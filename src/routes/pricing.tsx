import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container, Section, Eyebrow } from "@/components/site/Container";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Pixi Retouch" },
      { name: "description", content: "Transparent per-image pricing scaled by complexity and volume. Free trial, free quote within 45 minutes." },
      { property: "og:title", content: "Pricing — Pixi Retouch" },
      { property: "og:description", content: "Transparent per-image pricing, free trial, free quote in 45 minutes." },
      { property: "og:url", content: "/pricing" },
    ],
    links: [{ rel: "canonical", href: "/pricing" }],
  }),
  component: Pricing,
});

const TIERS = [
  {
    name: "Starter",
    from: "$0.25",
    sub: "per image",
    desc: "Basic clipping path and background removal for small catalogs.",
    features: ["Up to 500 images / month", "24-hour turnaround", "Basic clipping path", "Pure white or transparent background", "Email support"],
    cta: "Start free trial",
  },
  {
    name: "Studio",
    from: "$0.59",
    sub: "per image",
    desc: "Most ecommerce teams. Medium complexity, faster turnaround, mixed services.",
    features: ["500 – 5,000 images / month", "12-hour turnaround", "Medium-complex paths & masking", "Shadow, retouching, color correction", "Dedicated account manager", "Priority support"],
    featured: true,
    cta: "Get a quote",
  },
  {
    name: "Enterprise",
    from: "Custom",
    sub: "volume pricing",
    desc: "High-volume catalogs, complex composites and dedicated capacity.",
    features: ["5,000+ images / month", "4-hour turnaround", "Ghost mannequin, jewelry, composites", "Reserved retouchers", "SLA + NDA", "Slack / Teams integration"],
    cta: "Talk to sales",
  },
];

function Pricing() {
  return (
    <>
      <Section className="pt-20 md:pt-28">
        <Container>
          <Eyebrow>Pricing</Eyebrow>
          <h1 className="mt-5 max-w-4xl font-display text-5xl md:text-7xl">
            Per-image pricing. Honest, transparent, volume-aware.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            Every quote is custom because every batch is different. The tiers below are starting points — send a sample image and we'll come back with a firm per-image rate within 45 minutes.
          </p>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-6 lg:grid-cols-3">
            {TIERS.map((t) => (
              <div
                key={t.name}
                className={`relative flex flex-col rounded-2xl border p-8 ${t.featured ? "border-foreground bg-foreground text-background shadow-lift" : "border-border bg-card"}`}
              >
                {t.featured && (
                  <span className="absolute -top-3 left-8 rounded-full bg-primary px-3 py-1 text-[10px] uppercase tracking-wider text-primary-foreground">Most popular</span>
                )}
                <h2 className="font-display text-2xl">{t.name}</h2>
                <p className={`mt-2 text-sm ${t.featured ? "text-background/70" : "text-muted-foreground"}`}>{t.desc}</p>
                <div className="mt-6 flex items-baseline gap-2">
                  <span className="font-display text-5xl">{t.from}</span>
                  <span className={`text-sm ${t.featured ? "text-background/60" : "text-muted-foreground"}`}>{t.sub}</span>
                </div>
                <ul className="mt-8 flex-1 space-y-3 text-sm">
                  {t.features.map((f) => (
                    <li key={f} className="flex gap-3">
                      <Check className={`mt-0.5 h-4 w-4 shrink-0 ${t.featured ? "text-primary" : "text-primary"}`} />
                      <span className={t.featured ? "text-background/90" : ""}>{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-10">
                  <Button asChild className="w-full" variant={t.featured ? "secondary" : "default"}>
                    <Link to="/quote">{t.cta}</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-muted/30">
        <Container className="grid gap-12 md:grid-cols-2">
          <div>
            <Eyebrow>What affects price</Eyebrow>
            <h2 className="mt-4 font-display text-3xl md:text-4xl">Four variables. No hidden line items.</h2>
          </div>
          <ul className="space-y-5">
            {[
              { t: "Complexity", b: "Basic, simple, medium, complex, super-complex paths and masks." },
              { t: "Volume", b: "More images = lower per-image rate. We scale aggressively past 1,000." },
              { t: "Turnaround", b: "Standard, rush, or scheduled. Rush is a small premium, not a multiplier." },
              { t: "Service mix", b: "Multiple services on the same image are bundled, not stacked." },
            ].map((x) => (
              <li key={x.t} className="border-t border-border pt-5">
                <div className="font-display text-xl">{x.t}</div>
                <div className="mt-1 text-sm text-muted-foreground">{x.b}</div>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section ink>
        <Container className="text-center">
          <h2 className="mx-auto max-w-3xl font-display text-4xl md:text-5xl">Get an exact per-image rate in 45 minutes.</h2>
          <div className="mt-8"><Button asChild size="lg" variant="secondary"><Link to="/quote">Get a quote</Link></Button></div>
        </Container>
      </Section>
    </>
  );
}
