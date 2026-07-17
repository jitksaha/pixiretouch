import { createFileRoute } from "@tanstack/react-router";
import { Container } from "@/components/site/Container";
import { Button } from "@/components/ui/button";
import { Mail, Linkedin } from "lucide-react";
import ceoPhoto from "@/assets/sk-munna-ceo.jpg.asset.json";
import { BRAND } from "@/content/site";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About Pixi Retouch — Our Story & Leadership" },
      {
        name: "description",
        content:
          "Meet the team behind Pixi Retouch. Learn about our mission, craft, and the people delivering pixel-perfect retouching for brands worldwide.",
      },
      { property: "og:title", content: "About Pixi Retouch" },
      {
        property: "og:description",
        content:
          "Meet the team behind Pixi Retouch — craft, consistency, and care on every image.",
      },
    ],
  }),
});

function AboutPage() {
  return (
    <main className="bg-background">
      {/* Intro */}
      <section className="border-b border-border">
        <Container className="py-16 md:py-24">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            About us
          </p>
          <h1 className="mt-3 font-display text-4xl leading-tight md:text-6xl">
            Pixel-perfect retouching,
            <br />
            delivered by people who care.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            Pixi Retouch is a specialist post-production studio for
            ecommerce, fashion and product brands. We obsess over clean
            edges, true colour and consistent batches — so your catalog
            looks like one brand, not a hundred photographers.
          </p>
        </Container>
      </section>

      {/* Leadership */}
      <section>
        <Container className="py-16 md:py-24">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Leadership
          </p>
          <h2 className="mt-3 font-display text-3xl md:text-4xl">
            Meet the founder
          </h2>

          <div className="mt-10 grid gap-10 md:grid-cols-[320px_1fr] md:items-start">
            <div className="overflow-hidden rounded-2xl border border-border bg-muted shadow-lift">
              <img
                src={ceoPhoto.url}
                alt="Asiful Hasan Munna — CEO & Owner of Pixi Retouch"
                className="aspect-[4/5] w-full object-cover"
                loading="lazy"
              />
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                CEO &amp; Owner
              </p>
              <h3 className="mt-2 font-display text-3xl md:text-4xl">
                Asiful Hasan Munna
              </h3>
              <p className="mt-5 text-base text-muted-foreground md:text-lg">
                SK Munna founded Pixi Retouch with a simple belief: every
                product image deserves the same care a brand puts into the
                product itself. He leads the studio's craft standards,
                client relationships and the team of retouchers who
                deliver thousands of images each week.
              </p>
              <p className="mt-4 text-base text-muted-foreground md:text-lg">
                Under his direction, Pixi Retouch has grown into a trusted
                partner for ecommerce sellers, photographers and agencies
                who need consistent, on-brand visuals — fast.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Button asChild>
                  <a href={`mailto:${BRAND.email}`} className="gap-2">
                    <Mail className="h-4 w-4" /> Contact SK Munna
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a
                    href="https://www.linkedin.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="gap-2"
                  >
                    <Linkedin className="h-4 w-4" /> LinkedIn
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Values */}
      <section className="border-t border-border bg-muted/30">
        <Container className="py-16 md:py-24">
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                t: "Craft first",
                d: "Hand-done clipping paths, natural skin and true-to-life colour — no lazy automation.",
              },
              {
                t: "Consistent at scale",
                d: "Style guides per client so image 1 and image 10,000 look like they belong together.",
              },
              {
                t: "On your timeline",
                d: "24-hour turnarounds standard, rush options when launch day won't move.",
              },
            ].map((v) => (
              <div
                key={v.t}
                className="rounded-2xl border border-border bg-background p-6"
              >
                <h3 className="font-display text-xl">{v.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{v.d}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}
