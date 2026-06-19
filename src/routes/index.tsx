import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container, Section, Eyebrow } from "@/components/site/Container";
import { BeforeAfter } from "@/components/site/BeforeAfter";
import { TrialDialog } from "@/components/site/TrialDialog";
import { LogoBar } from "@/components/site/LogoBar";
import { VideoEmbed } from "@/components/site/VideoEmbed";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BRAND, SERVICES, INDUSTRIES, PROCESS, TESTIMONIALS, FAQS, PORTFOLIO, VIDEOS } from "@/content/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pixi Retouch — Premium image editing for ecommerce" },
      { name: "description", content: BRAND.description },
      { property: "og:title", content: "Pixi Retouch — Premium image editing for ecommerce" },
      { property: "og:description", content: BRAND.description },
      { property: "og:url", content: "/" },
      { property: "og:image", content: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1600&q=80" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      <Hero />
      <TrustBar />
      <ServicesGrid />
      <BeforeAfterShowcase />
      <WhyChoose />
      <ProcessSteps />
      <PortfolioTeaser />
      <Industries />
      <VideoShowcase />
      <Stats />
      <Testimonials />
      <FaqSection />
      <FinalCta />
    </>
  );
}

function Hero() {
  return (
    <Section className="relative flex min-h-[calc(100dvh-2.75rem)] flex-col justify-center overflow-hidden pt-12 pb-0 md:min-h-[calc(100dvh-3rem)] md:pt-16 md:pb-0">
      <Container className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
        <div className="animate-fade-up">
          <Eyebrow>Image editing studio · Est. since 2014</Eyebrow>
          <h1 className="mt-5 font-display text-4xl leading-[1.05] md:text-5xl lg:text-6xl">
            Pixel-perfect retouching for the brands people actually buy from.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            Hand-drawn clipping paths, ghost mannequin work, and product retouching for ecommerce teams that care how every SKU looks at 100% zoom.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <TrialDialog>
              <Button size="lg">Start free trial <ArrowRight className="ml-1 h-4 w-4" /></Button>
            </TrialDialog>
            <Button asChild size="lg" variant="outline">
              <Link to="/sample">See the work</Link>
            </Button>
          </div>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {["4-hour turnaround", "Free 2-image trial", "Pay after delivery", "NDA on request"].map((b) => (
              <li key={b} className="inline-flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" /> {b}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative">
          <BeforeAfter
            before="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=85"
            after="https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=1200&q=85"
            className="shadow-lift"
          />
          <div className="absolute -bottom-6 -left-6 hidden rounded-xl border border-border bg-card p-4 shadow-soft md:block">
            <div className="text-3xl font-display">99.9%</div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Quality satisfaction</div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

function TrustBar() {
  return (
    <div className="border-y border-border bg-muted/30 py-10">
      <Container>
        <p className="text-center text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Trusted by ecommerce teams, agencies and studios worldwide
        </p>
        <div className="mt-8">
          <LogoBar />
        </div>
      </Container>
    </div>
  );
}

function ServicesGrid() {
  return (
    <Section id="services">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <Eyebrow>What we do</Eyebrow>
            <h2 className="mt-4 font-display text-4xl md:text-5xl">A complete post-production stack for product imagery.</h2>
          </div>
          <Link to="/services" className="text-sm font-medium underline-offset-4 hover:underline">All services →</Link>
        </div>

        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.slice(0, 9).map((s, i) => (
            <Link
              key={s.slug}
              to="/services/$slug"
              params={{ slug: s.slug }}
              className="group flex flex-col gap-3 bg-background p-7 transition hover:bg-muted/40"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-muted-foreground">0{i + 1}</span>
                <ArrowRight className="h-4 w-4 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
              </div>
              <h3 className="font-display text-2xl">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.short}</p>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}

function BeforeAfterShowcase() {
  return (
    <Section ink className="relative">
      <Container className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <Eyebrow className="text-ink-foreground/60">Drag to compare</Eyebrow>
          <h2 className="mt-4 font-display text-4xl md:text-5xl">The difference is in the edges.</h2>
          <p className="mt-4 max-w-md text-ink-foreground/70">
            Every clipping path is hand-drawn with the pen tool. No AI auto-trace, no fuzzy edges, no halo at 100% zoom. Try it: drag the slider.
          </p>
          <div className="mt-8">
            <Button asChild size="lg" variant="secondary">
              <Link to="/sample">More comparisons</Link>
            </Button>
          </div>
        </div>
        <BeforeAfter
          before="https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1200&q=85"
          after="https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=1200&q=85"
        />
      </Container>
    </Section>
  );
}

function WhyChoose() {
  const items = [
    { t: "Hand-drawn precision", b: "Real retouchers using the pen tool. Edges hold up at 100% zoom — every time." },
    { t: "3-step quality control", b: "Editor, lead and account QC every image before delivery. No surprises." },
    { t: "On-time or it's free", b: "Miss your deadline, miss the invoice. We've held this guarantee for years." },
    { t: "Volume without compromise", b: "5,000 to 50,000+ images per batch with consistent quality across the run." },
  ];
  return (
    <Section>
      <Container>
        <div className="max-w-2xl">
          <Eyebrow>Why Pixi Retouch</Eyebrow>
          <h2 className="mt-4 font-display text-4xl md:text-5xl">Built for studios that can't accept "good enough".</h2>
        </div>
        <div className="mt-14 grid gap-12 md:grid-cols-2">
          {items.map((it) => (
            <div key={it.t} className="border-t border-line pt-6">
              <h3 className="font-display text-2xl">{it.t}</h3>
              <p className="mt-3 text-muted-foreground">{it.b}</p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

function ProcessSteps() {
  return (
    <Section className="bg-muted/30">
      <Container>
        <div className="max-w-2xl">
          <Eyebrow>How it works</Eyebrow>
          <h2 className="mt-4 font-display text-4xl md:text-5xl">From sample to delivery in four steps.</h2>
        </div>
        <ol className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-2 lg:grid-cols-4">
          {PROCESS.map((p) => (
            <li key={p.step} className="bg-background p-7">
              <div className="font-mono text-xs text-muted-foreground">{p.step}</div>
              <h3 className="mt-3 font-display text-2xl">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.body}</p>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}

function PortfolioTeaser() {
  return (
    <Section>
      <Container>
        <div className="flex items-end justify-between">
          <div className="max-w-2xl">
            <Eyebrow>Selected work</Eyebrow>
            <h2 className="mt-4 font-display text-4xl md:text-5xl">A small sample of recent batches.</h2>
          </div>
          <Link to="/sample" className="hidden text-sm font-medium underline-offset-4 hover:underline md:inline">Full portfolio →</Link>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PORTFOLIO.slice(0, 6).map((p) => (
            <figure key={p.id} className="group overflow-hidden rounded-xl border border-border bg-card">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={p.after} alt={p.title} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
              </div>
              <figcaption className="flex items-center justify-between p-4">
                <span className="text-sm font-medium">{p.title}</span>
                <span className="text-xs text-muted-foreground">{p.category}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </Section>
  );
}

function Industries() {
  return (
    <Section className="bg-muted/30">
      <Container>
        <div className="max-w-2xl">
          <Eyebrow>Industries we serve</Eyebrow>
          <h2 className="mt-4 font-display text-4xl md:text-5xl">Built for teams that ship product images at scale.</h2>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {INDUSTRIES.map((i) => (
            <div key={i.name} className="rounded-xl border border-border bg-background p-6">
              <h3 className="font-display text-xl">{i.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{i.desc}</p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

function VideoShowcase() {
  return (
    <Section>
      <Container>
        <div className="max-w-2xl">
          <Eyebrow>Inside the studio</Eyebrow>
          <h2 className="mt-4 font-display text-4xl md:text-5xl">Walkthroughs, technique breakdowns, client stories.</h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {VIDEOS.slice(0, 3).map((v) => (
            <VideoEmbed key={v.id} video={v} />
          ))}
        </div>
      </Container>
    </Section>
  );
}

function Stats() {
  return (
    <Section ink className="py-20 md:py-24">
      <Container>
        <div className="grid gap-10 md:grid-cols-4">
          {BRAND.stats.map((s) => (
            <div key={s.label}>
              <div className="font-display text-5xl md:text-6xl">{s.value}</div>
              <div className="mt-2 text-sm uppercase tracking-wider text-ink-foreground/60">{s.label}</div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

function Testimonials() {
  return (
    <Section>
      <Container>
        <div className="max-w-2xl">
          <Eyebrow>What clients say</Eyebrow>
          <h2 className="mt-4 font-display text-4xl md:text-5xl">Quiet, accurate, on time.</h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {TESTIMONIALS.slice(0, 4).map((t) => (
            <figure key={t.name} className="rounded-2xl border border-border bg-card p-7">
              <div className="flex gap-0.5 text-primary">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="mt-4 font-display text-xl leading-snug">"{t.quote}"</blockquote>
              <figcaption className="mt-6 text-sm">
                <div className="font-medium">{t.name}</div>
                <div className="text-muted-foreground">{t.role}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </Section>
  );
}

function FaqSection() {
  return (
    <Section className="bg-muted/30">
      <Container className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <Eyebrow>FAQ</Eyebrow>
          <h2 className="mt-4 font-display text-4xl md:text-5xl">Common questions.</h2>
          <p className="mt-4 text-muted-foreground">
            Still wondering? <Link to="/contact" className="text-foreground underline-offset-4 hover:underline">Get in touch</Link> — we answer every email.
          </p>
        </div>
        <Accordion type="single" collapsible className="rounded-2xl border border-border bg-background px-2">
          {FAQS.slice(0, 6).map((f, i) => (
            <AccordionItem key={i} value={`f-${i}`} className="px-4">
              <AccordionTrigger className="text-left font-medium">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Container>
    </Section>
  );
}

function FinalCta() {
  return (
    <Section ink className="py-24 md:py-32">
      <Container className="text-center">
        <h2 className="mx-auto max-w-3xl font-display text-4xl md:text-6xl">
          Send two images. Judge the work for yourself.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-ink-foreground/70">
          Free trial. No card, no commitment. We deliver the edits within hours.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <TrialDialog>
            <Button size="lg" variant="secondary">Start free trial <ArrowRight className="ml-1 h-4 w-4" /></Button>
          </TrialDialog>
          <Button asChild size="lg" variant="outline" className="border-ink-foreground/30 bg-transparent text-ink-foreground hover:bg-ink-foreground/10 hover:text-ink-foreground">
            <Link to="/contact">Talk to the team</Link>
          </Button>
        </div>
      </Container>
    </Section>
  );
}
