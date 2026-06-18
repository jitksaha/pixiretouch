import { createFileRoute } from "@tanstack/react-router";
import { Container, Section, Eyebrow } from "@/components/site/Container";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Pixi Retouch" },
      { name: "description", content: "How Pixi Retouch collects, uses and protects your data and image files." },
      { property: "og:title", content: "Privacy Policy — Pixi Retouch" },
      { property: "og:description", content: "Our data and image-file privacy practices." },
      { property: "og:url", content: "/privacy" },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <Section className="pt-20 md:pt-28">
      <Container size="narrow">
        <Eyebrow>Legal</Eyebrow>
        <h1 className="mt-5 font-display text-4xl md:text-6xl">Privacy Policy</h1>
        <p className="mt-4 text-sm text-muted-foreground">Last updated: 1 June 2026</p>

        <div className="prose-section mt-10 space-y-8 text-base leading-relaxed">
          <Block title="Overview">
            This page describes how Pixi Retouch ("we", "our") collects, uses and protects information when you visit our website or use our image-editing services.
          </Block>
          <Block title="Information we collect">
            Account and contact data you submit (name, email, company, message body) and image files you upload for editing. We also collect basic web analytics (pages viewed, referrer, anonymized device info) to improve the site.
          </Block>
          <Block title="How we use it">
            To respond to quotes and questions, deliver retouching work, send transactional emails about your project, and improve our site. We do not sell personal data.
          </Block>
          <Block title="Image files & confidentiality">
            We treat client images as confidential. Files are stored on encrypted infrastructure during the project and deleted on close, or on written request. We sign mutual NDAs on request before any sample edit.
          </Block>
          <Block title="Cookies">
            We use a small number of first-party cookies for session and analytics. You can disable cookies in your browser without losing access to the site.
          </Block>
          <Block title="Your rights">
            You can request a copy, correction or deletion of your personal data at any time by emailing hello@pixiretouch.com. We respond within 30 days.
          </Block>
          <Block title="Contact">
            Questions about this policy? Email hello@pixiretouch.com.
          </Block>
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
