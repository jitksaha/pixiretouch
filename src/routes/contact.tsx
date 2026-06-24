import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Mail, MessageCircle, Clock, Globe, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Container, Section, Eyebrow } from "@/components/site/Container";
import { BRAND } from "@/content/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Pixi Retouch" },
      { name: "description", content: "Get in touch with the Pixi Retouch studio. Email, WhatsApp, or send a project brief — replies within 45 minutes." },
      { property: "og:title", content: "Contact — Pixi Retouch" },
      { property: "og:description", content: "Reach the Pixi Retouch studio by email, WhatsApp or web form." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Contact,
});

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  subject: z.string().trim().min(2).max(150),
  message: z.string().trim().min(10).max(2000),
});

function Contact() {
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
      name: fd.get("name"),
      email: fd.get("email"),
      subject: fd.get("subject"),
      message: fd.get("message"),
    });
    if (!parsed.success) {
      const er: Record<string, string> = {};
      parsed.error.issues.forEach((i) => { er[i.path[0] as string] = i.message; });
      setErrors(er);
      return;
    }
    setErrors({});
    setDone(true);
  };

  return (
    <>
      <Section className="pt-20 md:pt-28">
        <Container>
          <Eyebrow>Contact</Eyebrow>
          <h1 className="mt-5 max-w-4xl font-display text-5xl md:text-7xl">Talk to the studio.</h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            Send a brief, share a sample image, or just ask a question. We reply within 45 minutes during working hours.
          </p>
        </Container>
      </Section>

      <Section className="pt-0">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div className="space-y-5">
            <Info icon={<Mail className="h-5 w-5" />} title="Email" body={<a href={`mailto:${BRAND.email}`} className="hover:underline">{BRAND.email}</a>} />
            <Info icon={<MessageCircle className="h-5 w-5" />} title="WhatsApp" body={<a href={BRAND.whatsappLink} target="_blank" rel="noreferrer" className="hover:underline">{BRAND.whatsapp}</a>} />
            <Info icon={<Phone className="h-5 w-5" />} title="Phone" body={<a href={BRAND.phoneLink} className="hover:underline">{BRAND.phone}</a>} />
            <Info icon={<Clock className="h-5 w-5" />} title="Hours" body="24 / 7 production · Replies during business hours across three time zones" />
            <Info icon={<Globe className="h-5 w-5" />} title="Studios" body="Singapore · Lisbon · New York" />
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft md:p-10">
            {done ? (
              <div className="py-8 text-center">
                <h2 className="font-display text-2xl">Message sent</h2>
                <p className="mt-2 text-sm text-muted-foreground">Thanks — we'll reply shortly.</p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-5">
                <Field label="Name" name="name" error={errors.name} />
                <Field label="Email" name="email" type="email" error={errors.email} />
                <Field label="Subject" name="subject" error={errors.subject} />
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">Message</Label>
                  <Textarea name="message" rows={6} placeholder="Tell us about your project." />
                  {errors.message && <p className="text-xs text-destructive">{errors.message}</p>}
                </div>
                <Button type="submit" size="lg" className="w-full">Send message</Button>
              </form>
            )}
          </div>
        </Container>
      </Section>
    </>
  );
}

function Field({ label, name, type = "text", error }: { label: string; name: string; type?: string; error?: string }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-xs uppercase tracking-wider text-muted-foreground">{label}</Label>
      <Input id={name} name={name} type={type} />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function Info({ icon, title, body }: { icon: React.ReactNode; title: string; body: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-3 text-muted-foreground">{icon}<span className="text-xs uppercase tracking-wider">{title}</span></div>
      <div className="mt-2 font-display text-lg">{body}</div>
    </div>
  );
}
