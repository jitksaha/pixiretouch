import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BLOG, PORTFOLIO, SERVICES, type PortfolioItem, type Service } from "@/content/site";

export type ServiceOverride = {
  slug: string;
  title?: string | null;
  description?: string | null;
  pricing?: string | null;
  features?: string[] | null;
};

export function useServiceOverrides(): {
  overrides: Record<string, ServiceOverride>;
  ready: boolean;
} {
  const [overrides, setOverrides] = useState<Record<string, ServiceOverride>>({});
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let cancel = false;
    (async () => {
      const { data } = await supabase
        .from("services_content")
        .select("slug,title,description,pricing,features");
      if (cancel) return;
      const map: Record<string, ServiceOverride> = {};
      (data ?? []).forEach((r: any) => {
        map[r.slug] = {
          slug: r.slug,
          title: r.title,
          description: r.description,
          pricing: r.pricing,
          features: r.features,
        };
      });
      setOverrides(map);
      setReady(true);
    })();
    return () => { cancel = true; };
  }, []);
  return { overrides, ready };
}

export function applyServiceOverride(base: Service, ov?: ServiceOverride): Service {
  if (!ov) return base;
  return {
    ...base,
    title: ov.title || base.title,
    description: ov.description || base.description,
    short: ov.description || base.short,
    pricing: ov.pricing || base.pricing,
    features: ov.features && ov.features.length ? ov.features : base.features,
  };
}

export function useDynamicServices(): { services: Service[]; ready: boolean } {
  const { overrides, ready } = useServiceOverrides();
  const services = SERVICES.map((s) => applyServiceOverride(s, overrides[s.slug]));
  return { services, ready };
}

export type DynamicBlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  cover: string;
  category: string;
  author: string;
  date: string;
};

const DEFAULT_COVER =
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1600&q=80";

function mapDbPost(r: {
  slug: string;
  title: string;
  excerpt: string | null;
  body: string | null;
  cover_image: string | null;
  published_at: string | null;
  created_at: string;
}): DynamicBlogPost {
  return {
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt ?? "",
    body: r.body ?? "",
    cover: r.cover_image || DEFAULT_COVER,
    category: "Studio",
    author: "Pixi Retouch",
    date: r.published_at ?? r.created_at,
  };
}

export function useDynamicBlog(): { posts: DynamicBlogPost[]; ready: boolean } {
  const [posts, setPosts] = useState<DynamicBlogPost[]>(BLOG as DynamicBlogPost[]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancel = false;
    (async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("slug,title,excerpt,body,cover_image,published_at,created_at")
        .eq("published", true)
        .order("published_at", { ascending: false, nullsFirst: false })
        .order("created_at", { ascending: false });
      if (cancel) return;
      const mapped = (data ?? []).map(mapDbPost);
      if (mapped.length > 0) setPosts(mapped);
      setReady(true);
    })();
    return () => {
      cancel = true;
    };
  }, []);

  return { posts, ready };
}

export function useDynamicBlogPost(slug: string): {
  post: DynamicBlogPost | null;
  ready: boolean;
} {
  const fallback = (BLOG as DynamicBlogPost[]).find((p) => p.slug === slug) ?? null;
  const [post, setPost] = useState<DynamicBlogPost | null>(fallback);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancel = false;
    (async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("slug,title,excerpt,body,cover_image,published_at,created_at,published")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      if (cancel) return;
      if (data) setPost(mapDbPost(data));
      setReady(true);
    })();
    return () => {
      cancel = true;
    };
  }, [slug]);

  return { post, ready };
}

export function useDynamicPortfolio(): {
  items: PortfolioItem[];
  ready: boolean;
} {
  const [items, setItems] = useState<PortfolioItem[]>(PORTFOLIO);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancel = false;
    (async () => {
      const { data } = await supabase
        .from("portfolio_items")
        .select("id,title,category,before_image,after_image,sort_order")
        .eq("published", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (cancel) return;
      const mapped: PortfolioItem[] = (data ?? []).map((r) => ({
        id: r.id,
        title: r.title,
        category: r.category ?? "Studio",
        before: r.before_image,
        after: r.after_image,
      }));
      if (mapped.length > 0) setItems(mapped);
      setReady(true);
    })();
    return () => {
      cancel = true;
    };
  }, []);

  return { items, ready };
}
