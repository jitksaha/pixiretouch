import { createFileRoute, Link } from "@tanstack/react-router";
import { Container, Section } from "@/components/site/Container";
import { Button } from "@/components/ui/button";
import { BLOG, BRAND } from "@/content/site";
import { supabase } from "@/integrations/supabase/client";
import { useDynamicBlog, useDynamicBlogPost } from "@/lib/dynamic-content";

const SITE_URL = "https://pixiretouch.lovable.app";
const DEFAULT_COVER = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1600&q=80";

type LoaderPost = {
  slug: string;
  title: string;
  excerpt: string;
  cover: string;
  category: string;
  author: string;
  date: string;
};

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }): Promise<LoaderPost | null> => {
    const { data } = await supabase
      .from("blog_posts")
      .select("slug,title,excerpt,cover_image,published_at,created_at")
      .eq("slug", params.slug)
      .eq("published", true)
      .maybeSingle();
    if (data) {
      return {
        slug: data.slug,
        title: data.title,
        excerpt: data.excerpt ?? "",
        cover: data.cover_image || DEFAULT_COVER,
        category: "Studio",
        author: BRAND.name,
        date: data.published_at ?? data.created_at,
      };
    }
    const fallback = BLOG.find((b) => b.slug === params.slug);
    return fallback
      ? {
          slug: fallback.slug,
          title: fallback.title,
          excerpt: fallback.excerpt,
          cover: fallback.cover,
          category: fallback.category,
          author: fallback.author,
          date: fallback.date,
        }
      : null;
  },
  head: ({ params, loaderData }) => {
    const url = `${SITE_URL}/blog/${params.slug}`;
    if (!loaderData) {
      return {
        meta: [{ title: `Post — ${BRAND.name}` }],
        links: [{ rel: "canonical", href: url }],
      };
    }
    const p = loaderData;
    const title = `${p.title} — ${BRAND.name}`;
    const ogImage = p.cover.startsWith("http") ? p.cover : `${SITE_URL}${p.cover}`;
    return {
      meta: [
        { title },
        { name: "description", content: p.excerpt },
        { name: "author", content: p.author },
        { property: "article:published_time", content: p.date },
        { property: "article:section", content: p.category },
        { property: "og:title", content: p.title },
        { property: "og:description", content: p.excerpt },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { property: "og:image", content: ogImage },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: p.title },
        { name: "twitter:description", content: p.excerpt },
        { name: "twitter:image", content: ogImage },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: p.title,
            description: p.excerpt,
            image: [ogImage],
            datePublished: p.date,
            dateModified: p.date,
            author: { "@type": "Organization", name: p.author },
            publisher: {
              "@type": "Organization",
              name: BRAND.name,
              url: SITE_URL,
            },
            mainEntityOfPage: { "@type": "WebPage", "@id": url },
            articleSection: p.category,
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
              { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
              { "@type": "ListItem", position: 3, name: p.title, item: url },
            ],
          }),
        },
      ],
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
