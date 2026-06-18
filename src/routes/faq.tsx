import { createFileRoute, Link } from "@tanstack/react-router";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Container, Section, Eyebrow } from "@/components/site/Container";
import { Button } from "@/components/ui/button";
import { FAQS } from "@/content/site";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Pixi Retouch" },
      { name: "description", content: "Answers to common questions about turnaround, pricing, NDAs, file formats and revisions at Pixi Retouch." },
      { property: "og:title", content: "FAQ — Pixi Retouch" },
      { property: "og:description", content: "Common questions about working with the Pixi Retouch studio." },
      { property: "og:url", content: "/faq" },
    ],
    links: [{ rel: "canonical", href: "/faq" }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: FAQS.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }),
    }],
  }),
  component: FaqPage,
});

function FaqPage() {
  return (
    <>
      <Section className="pt-20 md:pt-28">
        <Container>
          <Eyebrow>FAQ</Eyebrow>
          <h1 className="mt-5 max-w-4xl font-display text-5xl md:text-7xl">Everything you might want to ask before sending us an image.</h1>
        </Container>
      </Section>

      <Section className="pt-0">
        <Container size="narrow">
          <Accordion type="single" collapsible className="rounded-2xl border border-border bg-background px-2">
            {FAQS.map((f, i) => (
              <AccordionItem key={i} value={`f-${i}`} className="px-4">
                <AccordionTrigger className="text-left font-medium">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-12 rounded-2xl border border-border bg-muted/40 p-8 text-center">
            <h2 className="font-display text-2xl">Didn't find your answer?</h2>
            <p className="mt-2 text-muted-foreground">Email the team — we reply within working hours.</p>
            <div className="mt-5 flex justify-center gap-3">
              <Button asChild><Link to="/contact">Contact us</Link></Button>
              <Button asChild variant="outline"><Link to="/quote">Get a quote</Link></Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
