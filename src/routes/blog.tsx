import { createFileRoute, Link } from "@tanstack/react-router";
import { Container, Section, Eyebrow } from "@/components/site/Container";
import { useDynamicBlog } from "@/lib/dynamic-content";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — Pixi Retouch" },
      { name: "description", content: "Image editing, ecommerce visuals, color correction and post-production craft, from the Pixi Retouch studio." },
      { property: "og:title", content: "Blog — Pixi Retouch" },
      { property: "og:description", content: "Field notes from a working retouching studio." },
      { property: "og:url", content: "/blog" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  const { posts } = useDynamicBlog();
  const [hero, ...rest] = posts;
  return (
    <>
      <Section className="pt-20 md:pt-28">
        <Container>
          <Eyebrow>Blog</Eyebrow>
          <h1 className="mt-5 max-w-4xl font-display text-5xl md:text-7xl">Field notes from a working studio.</h1>
        </Container>
      </Section>

      <Section className="pt-0">
        <Container>
          {hero && (
            <Link to="/blog/$slug" params={{ slug: hero.slug }} className="group block overflow-hidden rounded-2xl border border-border bg-card">
              <div className="grid lg:grid-cols-2">
                <div className="aspect-[16/10] overflow-hidden lg:aspect-auto">
                  <img src={hero.cover} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                </div>
                <div className="flex flex-col justify-center p-8 md:p-12">
                  <div className="flex items-center gap-3 text-xs uppercase tracking-wider text-muted-foreground">
                    <span>{hero.category}</span>
                    <span>·</span>
                    <time>{new Date(hero.date).toLocaleDateString("en", { year: "numeric", month: "long", day: "numeric" })}</time>
                  </div>
                  <h2 className="mt-4 font-display text-3xl md:text-4xl">{hero.title}</h2>
                  <p className="mt-3 text-muted-foreground">{hero.excerpt}</p>
                </div>
              </div>
            </Link>
          )}

          {rest.length > 0 && (
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((p) => (
                <Link key={p.slug} to="/blog/$slug" params={{ slug: p.slug }} className="group block">
                  <div className="overflow-hidden rounded-xl border border-border bg-card">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img src={p.cover} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                    </div>
                  </div>
                  <div className="mt-5">
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">{p.category} · {new Date(p.date).toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" })}</div>
                    <h3 className="mt-2 font-display text-2xl group-hover:underline underline-offset-4">{p.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{p.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}

