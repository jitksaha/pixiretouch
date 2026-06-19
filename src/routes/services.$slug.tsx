import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Container, Section, Eyebrow } from "@/components/site/Container";
import { BeforeAfter } from "@/components/site/BeforeAfter";
import { SERVICES, PORTFOLIO } from "@/content/site";

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    const service = SERVICES.find((s) => s.slug === params.slug);
    if (!service) throw notFound();
    return service;
  },
  head: ({ loaderData }) => {
    const s = loaderData;
    if (!s) return { meta: [] };
    return {
      meta: [
        { title: `${s.title} — Pixi Retouch` },
        { name: "description", content: s.short },
        { property: "og:title", content: `${s.title} — Pixi Retouch` },
        { property: "og:description", content: s.short },
        { property: "og:url", content: `/services/${s.slug}` },
      ],
      links: [{ rel: "canonical", href: `/services/${s.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: s.title,
            description: s.description,
            provider: { "@type": "Organization", name: "Pixi Retouch" },
          }),
        },
        ...(s.faqs.length
          ? [{
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: s.faqs.map((f) => ({
                  "@type": "Question",
                  name: f.q,
                  acceptedAnswer: { "@type": "Answer", text: f.a },
                })),
              }),
            }]
          : []),
      ],
    };
  },
  component: ServiceDetail,
  notFoundComponent: () => (
    <Section><Container><h1 className="font-display text-4xl">Service not found</h1><Link to="/services" className="mt-4 inline-block underline">Back to services</Link></Container></Section>
  ),
});

function ServiceDetail() {
  const service = Route.useLoaderData();
  const related = SERVICES.filter((s) => s.slug !== service.slug).slice(0, 3);
  const samples = PORTFOLIO.slice(0, 3);

  return (
    <>
      <Section className="pt-20 md:pt-28">
        <Container className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div>
            <Link to="/services" className="text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground">← All services</Link>
            <h1 className="mt-5 font-display text-5xl md:text-6xl">{service.title}</h1>
            <p className="mt-5 text-lg text-muted-foreground">{service.description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg"><Link to="/contact" search={{ service: service.slug } as never}>Get a quote <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
              <Button asChild size="lg" variant="outline"><Link to="/sample">See examples</Link></Button>
            </div>
          </div>
          <BeforeAfter
            before={samples[0].before}
            after={samples[0].after}
            className="shadow-lift"
          />
        </Container>
      </Section>

      <Section>
        <Container className="grid gap-12 lg:grid-cols-2">
          <div>
            <Eyebrow>What's included</Eyebrow>
            <h2 className="mt-4 font-display text-3xl md:text-4xl">Every {service.title.toLowerCase()} edit delivers:</h2>
            <ul className="mt-8 space-y-4">
              {service.features.map((f: string) => (
                <li key={f} className="flex gap-3 border-t border-line pt-4">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Eyebrow>Industries</Eyebrow>
            <h2 className="mt-4 font-display text-3xl md:text-4xl">Where it fits best.</h2>
            <div className="mt-8 grid gap-3">
              {service.industries.map((i: string) => (
                <div key={i} className="rounded-xl border border-border bg-card px-5 py-4">{i}</div>
              ))}
            </div>
            <p className="mt-8 text-sm text-muted-foreground">
              Also part of our family at{" "}
              <a href="https://pixiraw.com" target="_blank" rel="noreferrer" className="underline-offset-4 hover:underline">Pixiraw.com</a> — explore the wider creative network.
            </p>
          </div>
        </Container>
      </Section>

      {service.faqs.length > 0 && (
        <Section className="bg-muted/30">
          <Container className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
            <div>
              <Eyebrow>FAQ</Eyebrow>
              <h2 className="mt-4 font-display text-3xl md:text-4xl">Common questions about {service.title.toLowerCase()}.</h2>
            </div>
            <Accordion type="single" collapsible className="rounded-2xl border border-border bg-background px-2">
              {service.faqs.map((f: { q: string; a: string }, i: number) => (
                <AccordionItem key={i} value={`f-${i}`} className="px-4">
                  <AccordionTrigger className="text-left font-medium">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Container>
        </Section>
      )}

      <Section>
        <Container>
          <Eyebrow>Related services</Eyebrow>
          <div className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-3">
            {related.map((s) => (
              <Link key={s.slug} to="/services/$slug" params={{ slug: s.slug }} className="bg-background p-7 transition hover:bg-muted/40">
                <h3 className="font-display text-2xl">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.short}</p>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      <Section ink>
        <Container className="text-center">
          <h2 className="mx-auto max-w-3xl font-display text-4xl md:text-5xl">Try {service.title.toLowerCase()} on two free images.</h2>
          <div className="mt-8">
            <Button asChild size="lg" variant="secondary"><Link to="/contact">Start free trial</Link></Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
