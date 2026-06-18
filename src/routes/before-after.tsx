import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Container, Section, Eyebrow } from "@/components/site/Container";
import { BeforeAfter } from "@/components/site/BeforeAfter";
import { PORTFOLIO } from "@/content/site";

export const Route = createFileRoute("/before-after")({
  head: () => ({
    meta: [
      { title: "Before & After Gallery — Pixi Retouch" },
      { name: "description", content: "Interactive before/after comparisons across clipping path, retouching, ghost mannequin and color correction." },
      { property: "og:title", content: "Before & After Gallery — Pixi Retouch" },
      { property: "og:description", content: "Drag-to-compare gallery of recent Pixi Retouch edits." },
      { property: "og:url", content: "/before-after" },
    ],
    links: [{ rel: "canonical", href: "/before-after" }],
  }),
  component: BeforeAfterPage,
});

function BeforeAfterPage() {
  return (
    <>
      <Section className="pt-20 md:pt-28">
        <Container>
          <Eyebrow>Before & after</Eyebrow>
          <h1 className="mt-5 max-w-4xl font-display text-5xl md:text-7xl">Drag the slider. See the work.</h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            Real edits, hand-finished by our retouching team. Drag any slider to compare source and final frame.
          </p>
        </Container>
      </Section>

      <Section className="pt-0">
        <Container>
          <div className="grid gap-8 md:grid-cols-2">
            {PORTFOLIO.map((p) => (
              <figure key={p.id} className="space-y-3">
                <BeforeAfter before={p.before} after={p.after} />
                <figcaption className="flex items-center justify-between text-sm">
                  <span className="font-medium">{p.title}</span>
                  <span className="text-muted-foreground">{p.category}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </Container>
      </Section>

      <Section ink>
        <Container className="text-center">
          <h2 className="mx-auto max-w-3xl font-display text-4xl md:text-5xl">Want this on your catalog?</h2>
          <p className="mx-auto mt-4 max-w-xl text-ink-foreground/70">Send two sample images. Free trial edit, no card.</p>
          <div className="mt-8"><Button asChild size="lg" variant="secondary"><Link to="/quote">Start free trial</Link></Button></div>
        </Container>
      </Section>
    </>
  );
}
