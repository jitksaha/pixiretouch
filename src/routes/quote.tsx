import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { Container, Section, Eyebrow } from "@/components/site/Container";
import { QuoteWizard } from "@/components/site/QuoteWizard";

const search = z.object({ service: z.string().optional() });

export const Route = createFileRoute("/quote")({
  validateSearch: search,
  head: () => ({
    meta: [
      { title: "Get a Free Quote — Pixi Retouch" },
      { name: "description", content: "Multi-step quote form. Tell us about your batch and get a per-image rate within 45 minutes — free trial included." },
      { property: "og:title", content: "Get a Free Quote — Pixi Retouch" },
      { property: "og:description", content: "Free quote in 45 minutes, free trial included." },
      { property: "og:url", content: "/quote" },
    ],
    links: [{ rel: "canonical", href: "/quote" }],
  }),
  component: Quote,
});

function Quote() {
  const { service } = Route.useSearch();
  return (
    <Section className="pt-20 md:pt-28">
      <Container size="narrow">
        <Eyebrow>Free quote</Eyebrow>
        <h1 className="mt-5 font-display text-4xl md:text-6xl">Tell us about your batch.</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Four short steps. We reply within 45 minutes with a per-image rate and turnaround. Free trial included for new clients.
        </p>
        <div className="mt-12">
          <QuoteWizard initialService={service} />
        </div>
      </Container>
    </Section>
  );
}
