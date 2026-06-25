import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Container, Section, Eyebrow } from "@/components/site/Container";
import { TrialDialog } from "@/components/site/TrialDialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { serviceImage } from "@/content/serviceImages";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Pixi Retouch" },
      {
        name: "description",
        content:
          "Simple per-image pricing for clipping path, retouching, background removal, shadow, ghost mannequin and ecommerce edits. Free trial, quote in 45 minutes.",
      },
      { property: "og:title", content: "Pricing — Pixi Retouch" },
      {
        property: "og:description",
        content:
          "Stress-less pricing for pixel-perfect photo editing. Per-image rates start at $0.39.",
      },
      { property: "og:url", content: "/pricing" },
    ],
    links: [{ rel: "canonical", href: "/pricing" }],
  }),
  component: Pricing,
});

const PRICE_CARDS: {
  slug: string;
  title: string;
  price: string;
}[] = [
  { slug: "clipping-path", title: "Clipping Path Service", price: "0.39" },
  { slug: "product-photo-retouching", title: "Retouching Service", price: "0.69" },
  { slug: "background-removal", title: "Background Remove", price: "0.39" },
  { slug: "shadow-creation", title: "Shadow Making", price: "0.39" },
  { slug: "ghost-mannequin", title: "Ghost Mannequin", price: "0.79" },
  { slug: "ecommerce-image-editing", title: "Ecommerce Image Edit", price: "0.39" },
];

const FAQS = [
  {
    q: "How can I send you the files?",
    a: "Upload via WeTransfer, Dropbox, Google Drive or our own upload form — whatever is easiest. For very large batches we'll set up a shared folder for you.",
  },
  {
    q: "What's your turnaround time?",
    a: "Standard turnaround is 24 hours. Rush orders (4–8 hours) and overnight deliveries are available — tell us the deadline and we'll confirm.",
  },
  {
    q: "Do you offer discount on bulk orders?",
    a: "Yes. Volume pricing kicks in automatically past 500 images/month and scales aggressively at 1,000+. Send your monthly volume and we'll come back with a custom rate.",
  },
  {
    q: "How to pay?",
    a: "We accept bank transfer, PayPal, Wise, Payoneer and major credit cards. Net-15 terms available for monthly clients.",
  },
  {
    q: "Do you offer a money-back guarantee?",
    a: "Yes. If an image doesn't meet your brief we'll revise it free of charge or refund that image — no questions.",
  },
  {
    q: "Is there a free trial?",
    a: "Absolutely. Send 2 sample images and we'll edit them free so you can judge our quality before placing a paid order.",
  },
];

function Pricing() {
  return (
    <>
      {/* Hero */}
      <Section className="pt-16 md:pt-24">
        <Container className="text-center">
          <Eyebrow>Pricing</Eyebrow>
          <h1 className="mx-auto mt-5 max-w-4xl font-display text-4xl leading-tight md:text-6xl">
            Stress less with simple pricing
            <br />
            and pixel-perfect photo edits.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground md:text-lg">
            Per-image rates that scale with volume. Send a sample and we'll
            confirm an exact price within 45 minutes.
          </p>
        </Container>
      </Section>

      {/* Service price grid */}
      <Section className="pt-4 md:pt-6">
        <Container>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PRICE_CARDS.map((c) => (
              <div
                key={c.slug}
                className="group flex flex-col items-center rounded-2xl border border-border bg-card p-6 text-center transition-all hover:-translate-y-1 hover:shadow-lift"
              >
                <div className="relative w-full overflow-hidden rounded-xl bg-muted">
                  <div className="grid aspect-[2/1] grid-cols-2">
                    <div className="relative overflow-hidden">
                      <img
                        src={serviceImage(c.slug)}
                        alt={`${c.title} before`}
                        loading="lazy"
                        className="h-full w-full object-cover grayscale"
                      />
                      <span className="absolute left-2 top-2 rounded-full bg-background/85 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-foreground">
                        Before
                      </span>
                    </div>
                    <div className="relative overflow-hidden border-l-2 border-background">
                      <img
                        src={serviceImage(c.slug)}
                        alt={`${c.title} after`}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className="absolute right-2 top-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-primary-foreground">
                        After
                      </span>
                    </div>
                  </div>
                </div>

                <h3 className="mt-6 font-display text-lg uppercase tracking-wide text-primary">
                  {c.title}
                </h3>
                <p className="mt-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Start at
                </p>
                <div className="mt-2 flex items-start justify-center gap-1">
                  <span className="mt-2 text-xl text-foreground">$</span>
                  <span className="font-display text-5xl leading-none text-foreground">
                    {c.price}
                  </span>
                </div>

                <div className="mt-6 flex w-full flex-col gap-2">
                  <TrialDialog
                    defaultService={c.slug}
                    defaultVolume="1-10"
                    defaultTurnaround="standard"
                    defaultNotes={`Interested in ${c.title} (from $${c.price}/image).`}
                    title={`${c.title} — Get started`}
                    description="Send a sample image. We reply within 45 minutes with a firm per-image rate and a free trial edit."
                  >
                    <Button className="w-full rounded-full" size="sm">
                      Buy Now
                    </Button>
                  </TrialDialog>
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="rounded-full text-xs text-muted-foreground"
                  >
                    <Link to="/services/$slug" params={{ slug: c.slug }}>
                      View details →
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-muted-foreground">
            Prices shown are starting per-image rates for basic complexity.
            Final pricing depends on complexity, volume and turnaround.{" "}
            <TrialDialog
              title="Get a custom quote"
              description="Tell us about your batch — we'll come back in 45 minutes with a firm rate."
            >
              <button className="font-medium text-foreground underline underline-offset-4 hover:text-primary">
                Request a custom quote
              </button>
            </TrialDialog>
          </p>
        </Container>
      </Section>

      {/* FAQ */}
      <Section className="bg-muted/30">
        <Container className="grid gap-10 md:grid-cols-[1fr_1.6fr] md:items-start">
          <div>
            <p className="text-sm text-muted-foreground">Have Any Questions?</p>
            <h2 className="mt-2 font-display text-4xl text-primary md:text-5xl">
              FAQ's
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Let's check our frequently asked questions.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-3">
            {FAQS.map((f, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="rounded-xl border border-border bg-background px-5"
              >
                <AccordionTrigger className="text-left text-sm font-medium md:text-base">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Container>
      </Section>

      {/* CTA */}
      <Section ink>
        <Container className="text-center">
          <h2 className="mx-auto max-w-3xl font-display text-3xl md:text-5xl">
            Get an exact per-image rate in 45 minutes.
          </h2>
          <div className="mt-8">
            <TrialDialog
              title="Get a quote"
              description="Tell us about your project — we reply within 45 minutes with a firm rate and a free trial edit."
            >
              <Button size="lg" variant="secondary">
                Get a quote
              </Button>
            </TrialDialog>
          </div>
        </Container>
      </Section>
    </>
  );
}
