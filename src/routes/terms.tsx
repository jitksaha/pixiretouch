import { createFileRoute } from "@tanstack/react-router";
import { Container, Section, Eyebrow } from "@/components/site/Container";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — Pixi Retouch" },
      { name: "description", content: "Terms governing use of the Pixi Retouch website and image editing services." },
      { property: "og:title", content: "Terms & Conditions — Pixi Retouch" },
      { property: "og:description", content: "Our service terms and conditions." },
      { property: "og:url", content: "/terms" },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: Terms,
});

function Terms() {
  return (
    <Section className="pt-20 md:pt-28">
      <Container size="narrow">
        <Eyebrow>Legal</Eyebrow>
        <h1 className="mt-5 font-display text-4xl md:text-6xl">Terms & Conditions</h1>
        <p className="mt-4 text-sm text-muted-foreground">Last updated: 1 June 2026</p>

        <div className="mt-10 space-y-8 text-base leading-relaxed">
          <Block title="Acceptance">By using our website or services you agree to these terms. If you disagree, please don't use the service.</Block>
          <Block title="Services">Pixi Retouch provides image editing and retouching services on a per-image, per-batch basis. Scope, price and turnaround are agreed per project quote.</Block>
          <Block title="Quotes & turnaround">Quotes are valid for 14 days. Turnaround times are estimates based on the agreed scope; rush jobs are quoted separately. We honour an on-time-or-free guarantee subject to client-side delays or scope changes.</Block>
          <Block title="Files & IP">You retain ownership of all source files. Full IP and usage rights in delivered files transfer to you on payment. You confirm you have the right to send any image you upload for editing.</Block>
          <Block title="Payment">New clients pay after delivery and approval of the first batch. Ongoing clients are invoiced weekly or monthly. Invoices are due within 14 days unless agreed otherwise.</Block>
          <Block title="Revisions">Free revisions until you sign off, within the agreed scope. Scope expansions are quoted separately.</Block>
          <Block title="Confidentiality">We treat client work as confidential. Portfolio examples are only published with written permission.</Block>
          <Block title="Liability">Our liability is limited to the value of the work performed. We are not liable for indirect or consequential loss.</Block>
          <Block title="Governing law">These terms are governed by the laws of Singapore.</Block>
        </div>
      </Container>
    </Section>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-2xl">{title}</h2>
      <p className="mt-3 text-muted-foreground">{children}</p>
    </section>
  );
}
