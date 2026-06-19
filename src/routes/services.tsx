import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Container, Section, Eyebrow } from "@/components/site/Container";
import { Button } from "@/components/ui/button";
import { SERVICES } from "@/content/site";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Image Editing Services — Pixi Retouch" },
      { name: "description", content: "Clipping path, background removal, ghost mannequin, jewelry retouching and more — a full post-production stack for ecommerce." },
      { property: "og:title", content: "Image Editing Services — Pixi Retouch" },
      { property: "og:description", content: "A complete post-production stack for product imagery — clipping path, masking, ghost mannequin, retouching, color correction." },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: ServicesIndex,
});

function ServicesIndex() {
  return (
    <>
      <Section className="pt-20 md:pt-28">
        <Container>
          <Eyebrow>Services</Eyebrow>
          <h1 className="mt-5 max-w-4xl font-display text-5xl md:text-7xl">
            Thirteen specialist services. One studio.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            Every service below is delivered by senior retouchers, QC'd in three passes, and priced per image. Pick one or combine them into a full post-production pipeline.
          </p>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-2">
            {SERVICES.map((s, i) => (
              <Link
                key={s.slug}
                to="/services/$slug"
                params={{ slug: s.slug }}
                className="group flex flex-col gap-3 bg-background p-8 transition hover:bg-muted/40"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                  <ArrowRight className="h-4 w-4 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                </div>
                <h2 className="font-display text-2xl md:text-3xl">{s.title}</h2>
                <p className="text-sm text-muted-foreground">{s.short}</p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {s.features.slice(0, 3).map((f) => (
                    <li key={f} className="rounded-full border border-border bg-muted/40 px-3 py-1 text-xs">{f}</li>
                  ))}
                </ul>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

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
