import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container, Section, Eyebrow } from "@/components/site/Container";
import { BeforeAfter } from "@/components/site/BeforeAfter";
import { TrialDialog } from "@/components/site/TrialDialog";
import { LogoBar } from "@/components/site/LogoBar";
import { ServiceZigzag, type ZigzagRow } from "@/components/site/ServiceZigzag";
import { WhyUsGrid } from "@/components/site/WhyUsGrid";
import { HowItWorks } from "@/components/site/HowItWorks";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BRAND, SERVICES, PORTFOLIO, TESTIMONIALS, FAQS } from "@/content/site";
import studioImg from "@/assets/studio-illustration.png";

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

const findSvc = (slug: string) => SERVICES.find((s) => s.slug === slug)!;
const findPort = (id: string) => PORTFOLIO.find((p) => p.id === id)!;

const ROWS: ZigzagRow[] = [
  { slug: "clipping-path",            num: "01", title: findSvc("clipping-path").title,            body: findSvc("clipping-path").description,            bullets: findSvc("clipping-path").features,            before: findPort("p1").before, after: findPort("p1").after },
  { slug: "background-removal",       num: "02", title: findSvc("background-removal").title,       body: findSvc("background-removal").description,       bullets: findSvc("background-removal").features,       before: findPort("p2").before, after: findPort("p2").after },
  { slug: "product-photo-retouching", num: "03", title: "Photo Retouching",                          body: findSvc("product-photo-retouching").description, bullets: findSvc("product-photo-retouching").features, before: findPort("p5").before, after: findPort("p5").after },
  { slug: "image-masking",            num: "04", title: findSvc("image-masking").title,             body: findSvc("image-masking").description,            bullets: findSvc("image-masking").features,            before: findPort("p8").before, after: findPort("p8").after },
  { slug: "shadow-creation",          num: "05", title: "Shadow Making",                             body: findSvc("shadow-creation").description,          bullets: findSvc("shadow-creation").features,          before: findPort("p6").before, after: findPort("p6").after },
  { slug: "ghost-mannequin",          num: "06", title: "Ghost Mannequin / Neck Joint",              body: findSvc("ghost-mannequin").description,          bullets: findSvc("ghost-mannequin").features,          before: findPort("p3").before, after: findPort("p3").after },
];

function Home() {
  return (
    <>
      <Hero />
      <TrustBar />
      <StudioIntro />
      <ServicesZigzagBand />
      <WhyChoose />
      <BigFileCta />
      <HowItWorksBand />
      <Stats />
      <Testimonials />
      <FaqSection />
      <FinalCta />
    </>
  );
}

/* ───────────────── Hero ───────────────── */
function Hero() {
  return (
    <Section className="relative overflow-hidden bg-[color:var(--surface-rose)] pt-14 pb-16 md:pt-20 md:pb-24">
      <Container className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
        <div className="animate-fade-up">
          <Eyebrow>Image editing studio · Est. 2014</Eyebrow>
          <h1 className="mt-5 font-display text-4xl leading-[1.05] md:text-5xl lg:text-[3.6rem]">
            Get pixel-perfect image editing service from our expert team.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            Hand-drawn clipping paths, ghost mannequin, retouching and background removal — delivered at studio quality, at ecommerce volume.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <TrialDialog>
              <Button size="lg" className="rounded-full px-7">Get a quote <ArrowRight className="ml-1 h-4 w-4" /></Button>
            </TrialDialog>
            <Button asChild size="lg" variant="outline" className="rounded-full px-7">
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
          <div className="absolute inset-0 -z-10 translate-x-6 translate-y-6 rounded-[2.5rem] bg-primary/15" />
          <BeforeAfter
            before="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=85"
            after="https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=1200&q=85"
            className="shadow-lift rounded-3xl overflow-hidden"
          />
          <div className="absolute -bottom-6 -left-6 hidden rounded-2xl border border-border bg-card p-4 shadow-soft md:block">
            <div className="font-display text-3xl">99.9%</div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Quality satisfaction</div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

function TrustBar() {
  return (
    <div className="border-y border-border bg-background py-8">
      <Container>
        <p className="text-center text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Trusted by ecommerce teams, agencies and studios worldwide
        </p>
        <div className="mt-6"><LogoBar /></div>
      </Container>
    </div>
  );
}

/* ──────────── Studio Intro Band ──────────── */
function StudioIntro() {
  return (
    <Section className="bg-[color:var(--surface-cream)]">
      <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="relative">
          <div className="absolute inset-0 -z-10 rounded-[2.5rem] bg-[color:var(--surface-blush)]" />
          <img
            src={studioImg}
            alt="Photo editing studio illustration"
            width={1024}
            height={1024}
            loading="lazy"
            className="mx-auto max-h-[420px] w-full max-w-md object-contain"
          />
        </div>
        <div>
          <Eyebrow>About the studio</Eyebrow>
          <h2 className="mt-4 font-display text-4xl md:text-5xl">We're a virtual photo editing studio.</h2>
          <p className="mt-5 max-w-xl text-muted-foreground md:text-lg">
            Pixi Retouch offers hand-drawn clipping path, retouching and ghost mannequin work to ecommerce brands, agencies and product photographers worldwide. Senior retouchers use the latest Photoshop and pen-tool craft — not AI auto-trace — to make every image catalog-ready.
          </p>
          <p className="mt-4 max-w-xl text-muted-foreground md:text-lg">
            We handle 50,000+ images per month for brands that can't accept "good enough". From a 2-image trial to a 50k-batch seasonal launch, the quality bar never moves.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <TrialDialog>
              <Button size="lg" className="rounded-full px-7">Order now <ArrowRight className="ml-1 h-4 w-4" /></Button>
            </TrialDialog>
            <Button asChild size="lg" variant="outline" className="rounded-full px-7">
              <Link to="/about">About us</Link>
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}

/* ────────── Professional Photoshop Services (zigzag) ────────── */
function ServicesZigzagBand() {
  return (
    <Section id="services" className="bg-background">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow className="justify-center">What we do</Eyebrow>
          <h2 className="mt-4 font-display text-4xl md:text-5xl">Professional Photoshop services.</h2>
          <p className="mt-4 text-muted-foreground md:text-lg">
            Six specialist services, delivered by senior retouchers and quoted per image. Click any service for full details and pricing.
          </p>
        </div>

        <div className="mt-16 space-y-20 md:space-y-24">
          {ROWS.map((row, i) => (
            <ServiceZigzag key={row.slug} row={row} reverse={i % 2 === 1} />
          ))}
        </div>

        <div className="mt-16 text-center">
          <Button asChild size="lg" variant="outline" className="rounded-full px-7">
            <Link to="/services">View all 13 services</Link>
          </Button>
        </div>
      </Container>
    </Section>
  );
}

function WhyChoose() {
  return (
    <Section className="bg-[color:var(--surface-sand)]">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow className="justify-center">Why choose us</Eyebrow>
          <h2 className="mt-4 font-display text-4xl md:text-5xl">Built for studios that can't accept "good enough".</h2>
        </div>
        <div className="mt-12">
          <WhyUsGrid />
        </div>
      </Container>
    </Section>
  );
}

function BigFileCta() {
  return (
    <Section className="bg-[color:var(--surface-rose)] py-16 md:py-20">
      <Container className="grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <Eyebrow>Large files? No problem.</Eyebrow>
          <h2 className="mt-4 font-display text-3xl md:text-4xl">No need to worry about transmitting large files.</h2>
          <p className="mt-4 max-w-2xl text-muted-foreground md:text-lg">
            File size doesn't matter to us. We'll set up a dedicated FTP account with the space you need — uploading and downloading huge batches is on us. Just request access and you're set within the hour.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 lg:justify-end">
          <TrialDialog>
            <Button size="lg" className="rounded-full px-7">Request FTP access <ArrowRight className="ml-1 h-4 w-4" /></Button>
          </TrialDialog>
          <Button asChild size="lg" variant="outline" className="rounded-full px-7">
            <Link to="/contact">Talk to us</Link>
          </Button>
        </div>
      </Container>
    </Section>
  );
}

function HowItWorksBand() {
  return (
    <Section className="bg-[color:var(--surface-cream)]">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow className="justify-center">How it works</Eyebrow>
          <h2 className="mt-4 font-display text-4xl md:text-5xl">It's very easy. Submit your order and get it done.</h2>
        </div>
        <div className="mt-12">
          <HowItWorks />
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
    <Section className="bg-background">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow className="justify-center">What clients say</Eyebrow>
          <h2 className="mt-4 font-display text-4xl md:text-5xl">Quiet, accurate, on time.</h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {TESTIMONIALS.slice(0, 4).map((t) => (
            <figure key={t.name} className="rounded-2xl border border-border bg-card p-7 shadow-soft">
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
    <Section className="bg-[color:var(--surface-cream)]">
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
    <Section ink className="py-12 md:py-16">
      <Container className="text-center">
        <h2 className="mx-auto max-w-3xl font-display text-3xl md:text-5xl">
          Send two images. Judge the work for yourself.
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-ink-foreground/70 md:text-base">
          Free trial. No card, no commitment. We deliver the edits within hours.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <TrialDialog>
            <Button size="lg" variant="secondary" className="rounded-full px-7">Start free trial <ArrowRight className="ml-1 h-4 w-4" /></Button>
          </TrialDialog>
          <Button asChild size="lg" variant="outline" className="rounded-full px-7 border-ink-foreground/30 bg-transparent text-ink-foreground hover:bg-ink-foreground/10 hover:text-ink-foreground">
            <Link to="/contact">Talk to the team</Link>
          </Button>
        </div>
      </Container>
    </Section>
  );
}
