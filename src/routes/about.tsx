import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Container, Section, Eyebrow } from "@/components/site/Container";
import { BRAND, INDUSTRIES } from "@/content/site";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Pixi Retouch — A studio built for production at scale" },
      { name: "description", content: "Pixi Retouch is a global image editing studio serving ecommerce, fashion and product photographers since 2014. Meet the team and the mission." },
      { property: "og:title", content: "About Pixi Retouch" },
      { property: "og:description", content: "Image editing studio for ecommerce and fashion brands. Hand-drawn quality at production scale." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: About,
});

function About() {
  return (
    <>
      <Section className="pt-20 md:pt-28">
        <Container>
          <Eyebrow>About us</Eyebrow>
          <h1 className="mt-5 max-w-4xl font-display text-5xl md:text-7xl">
            A retouching studio quietly powering the brands you already buy from.
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-muted-foreground">
            {BRAND.name} is part of the {BRAND.parentBrand.name} family — a global creative group serving ecommerce, fashion and product photographers since 2014. We exist to give in-house teams a calmer, more reliable post-production pipeline than they could build alone.
          </p>
        </Container>
      </Section>

      <Section className="bg-muted/30">
        <Container className="grid gap-12 md:grid-cols-2">
          <Block title="Mission" body="To make pixel-perfect product imagery the default — not the luxury — for every brand selling online." />
          <Block title="Vision" body="A world where ecommerce visuals are honest, beautiful, and accessible to teams of every size." />
          <Block title="Values" body="Craft over speed. Honesty over polish. Quiet excellence over loud promises. We measure ourselves by what survives 100% zoom." />
          <Block title="Promise" body="Hand-drawn precision, three-step QC, and a delivery date you can plan a launch around. If we miss, the batch is free." />
        </Container>
      </Section>

      <Section>
        <Container>
          <Eyebrow>The team</Eyebrow>
          <h2 className="mt-4 max-w-2xl font-display text-4xl md:text-5xl">
            120 retouchers. Three time zones. One quality bar.
          </h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Our editors work in continuous shifts across Asia, Europe and the Americas. Your overnight is our working day — that's how we deliver four-hour turnaround on a real schedule.
          </p>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { n: "Ayesha R.", r: "Lead retoucher · Jewelry" },
              { n: "Marco D.", r: "Lead retoucher · Fashion" },
              { n: "Sora K.", r: "QC & color science" },
              { n: "Hadi M.", r: "Studio operations" },
            ].map((m) => (
              <div key={m.n} className="rounded-xl border border-border bg-card p-6">
                <div className="aspect-square w-full rounded-lg bg-gradient-to-br from-muted to-accent" aria-hidden />
                <div className="mt-5 font-display text-xl">{m.n}</div>
                <div className="text-sm text-muted-foreground">{m.r}</div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section ink>
        <Container className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <Eyebrow className="text-ink-foreground/60">Global reach</Eyebrow>
            <h2 className="mt-4 font-display text-4xl md:text-5xl">Working with brands in 32 countries.</h2>
            <p className="mt-4 max-w-xl text-ink-foreground/70">
              From a one-person Shopify shop in Sydney to a hundred-person fashion house in Paris — the work, the QC, the deadlines are the same.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {INDUSTRIES.slice(0, 6).map((i) => (
              <div key={i.name} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="font-display text-base">{i.name}</div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container className="rounded-3xl border border-border bg-muted/30 p-10 text-center md:p-16">
          <h2 className="mx-auto max-w-2xl font-display text-3xl md:text-5xl">Let's talk about your next batch.</h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Send two sample images. We'll edit them free and reply with a per-image rate within 45 minutes.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg"><Link to="/quote">Get a free quote</Link></Button>
            <Button asChild size="lg" variant="outline"><Link to="/contact">Contact us</Link></Button>
          </div>
        </Container>
      </Section>
    </>
  );
}

function Block({ title, body }: { title: string; body: string }) {
  return (
    <div className="border-t border-border pt-6">
      <h2 className="font-display text-3xl">{title}</h2>
      <p className="mt-3 text-muted-foreground">{body}</p>
    </div>
  );
}
