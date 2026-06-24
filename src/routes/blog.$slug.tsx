import { createFileRoute, Link } from "@tanstack/react-router";
import { Container, Section } from "@/components/site/Container";
import { Button } from "@/components/ui/button";
import { BLOG } from "@/content/site";
import { useDynamicBlog, useDynamicBlogPost } from "@/lib/dynamic-content";

export const Route = createFileRoute("/blog/$slug")({
  head: ({ params }) => {
    const p = BLOG.find((b) => b.slug === params.slug);
    if (!p) {
      return {
        meta: [{ title: "Post — Pixi Retouch" }],
        links: [{ rel: "canonical", href: `/blog/${params.slug}` }],
      };
    }
    return {
      meta: [
        { title: `${p.title} — Pixi Retouch` },
        { name: "description", content: p.excerpt },
        { property: "og:title", content: p.title },
        { property: "og:description", content: p.excerpt },
        { property: "og:type", content: "article" },
        { property: "og:image", content: p.cover },
        { property: "og:url", content: `/blog/${params.slug}` },
      ],
      links: [{ rel: "canonical", href: `/blog/${params.slug}` }],
    };
  },
  component: Post,
});

function Post() {
  const { slug } = Route.useParams();
  const { post: p, ready } = useDynamicBlogPost(slug);
  const { posts } = useDynamicBlog();

  if (!p) {
    if (!ready) {
      return (
        <Section>
          <Container>
            <p className="text-sm text-muted-foreground">Loading…</p>
          </Container>
        </Section>
      );
    }
    return (
      <Section>
        <Container>
          <h1 className="font-display text-4xl">Post not found</h1>
          <Link to="/blog" className="mt-4 inline-block underline">Back to blog</Link>
        </Container>
      </Section>
    );
  }

  const related = posts.filter((b) => b.slug !== p.slug).slice(0, 3);

  return (
    <>
      <Section className="pt-20 md:pt-28">
        <Container size="narrow">
          <Link to="/blog" className="text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground">← All posts</Link>
          <div className="mt-6 text-xs uppercase tracking-wider text-muted-foreground">
            {p.category} · <time>{new Date(p.date).toLocaleDateString("en", { year: "numeric", month: "long", day: "numeric" })}</time>
          </div>
          <h1 className="mt-4 font-display text-4xl md:text-6xl">{p.title}</h1>
          {p.excerpt && <p className="mt-5 text-lg text-muted-foreground">{p.excerpt}</p>}
        </Container>
      </Section>

      <Container size="narrow" className="pb-10">
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <img src={p.cover} alt="" className="aspect-[16/9] w-full object-cover" />
        </div>
      </Container>

      <Container size="narrow" className="pb-20">
        <article className="space-y-5 text-lg leading-relaxed">
          {p.body.split("\n\n").map((para: string, i: number) => (
            <p key={i}>{para}</p>
          ))}
        </article>

        <aside className="mt-12 rounded-xl border border-border bg-muted/40 p-6 text-sm">
          Looking for retouching that matches what you read here? Start with a{" "}
          <Link to="/contact" className="font-medium underline-offset-4 hover:underline">free trial edit</Link>,
          or explore our parent network at{" "}
          <a href="https://pixiraw.com" target="_blank" rel="noreferrer" className="font-medium underline-offset-4 hover:underline">Pixiraw.com</a>.
        </aside>
      </Container>

      {related.length > 0 && (
        <Section className="bg-muted/30">
          <Container>
            <h2 className="font-display text-3xl">More from the studio</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <Link key={r.slug} to="/blog/$slug" params={{ slug: r.slug }} className="group block">
                  <div className="overflow-hidden rounded-xl border border-border bg-card">
                    <img src={r.cover} alt="" loading="lazy" decoding="async" className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                  </div>
                  <h3 className="mt-4 font-display text-xl group-hover:underline underline-offset-4">{r.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{r.excerpt}</p>
                </Link>
              ))}
            </div>
            <div className="mt-12 text-center">
              <Button asChild><Link to="/blog">All articles</Link></Button>
            </div>
          </Container>
        </Section>
      )}
    </>
  );
}

