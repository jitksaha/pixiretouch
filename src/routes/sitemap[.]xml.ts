import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { SERVICES, BLOG } from "@/content/site";
import { supabase } from "@/integrations/supabase/client";

const BASE_URL = "https://pixiretouch.lovable.app";

interface Entry { path: string; lastmod?: string; changefreq?: string; priority?: string; }

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        // Pull dynamic content from the DB so admin-edited posts/portfolio land in the sitemap.
        const [blogRes, svcRes] = await Promise.all([
          supabase
            .from("blog_posts")
            .select("slug,published_at,updated_at,created_at")
            .eq("published", true),
          supabase.from("services_content").select("slug,updated_at"),
        ]);

        const dbBlogSlugs = new Set((blogRes.data ?? []).map((r) => r.slug));
        const svcUpdated = new Map((svcRes.data ?? []).map((r) => [r.slug, r.updated_at as string]));

        const blogEntries: Entry[] = [
          ...(blogRes.data ?? []).map((r) => ({
            path: `/blog/${r.slug}`,
            lastmod: (r.updated_at ?? r.published_at ?? r.created_at) as string | undefined,
            changefreq: "monthly",
            priority: "0.6",
          })),
          ...BLOG.filter((b) => !dbBlogSlugs.has(b.slug)).map((b) => ({
            path: `/blog/${b.slug}`,
            lastmod: b.date,
            changefreq: "monthly",
            priority: "0.6",
          })),
        ];

        const entries: Entry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/services", changefreq: "monthly", priority: "0.9" },
          { path: "/sample", changefreq: "weekly", priority: "0.8" },
          { path: "/about", changefreq: "monthly", priority: "0.7" },
          { path: "/contact", changefreq: "monthly", priority: "0.7" },
          { path: "/pricing", changefreq: "monthly", priority: "0.8" },
          { path: "/blog", changefreq: "weekly", priority: "0.8" },
          ...SERVICES.map((s) => ({
            path: `/services/${s.slug}`,
            lastmod: svcUpdated.get(s.slug),
            changefreq: "monthly",
            priority: "0.8",
          })),
          ...blogEntries,
        ];

        const urls = entries.map((e) =>
          [
            "  <url>",
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            "  </url>",
          ].filter(Boolean).join("\n")
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
