import { defineTool } from "@lovable.dev/mcp-js";
import { requireAdmin } from "../supabase";

export default defineTool({
  name: "get_studio_overview",
  title: "Get studio overview",
  description: "Return admin-only counts for quote requests, contact messages, content, portfolio, and media in Pixi Retouch.",
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: true },
  handler: async (_args, ctx) => {
    const auth = await requireAdmin(ctx);
    if (auth.error) return auth.error;
    const { supabase } = auth;

    const [quotesNew, quotesAll, messagesNew, messagesAll, posts, portfolio, media, services] = await Promise.all([
      supabase.from("quote_requests").select("*", { count: "exact", head: true }).eq("status", "new"),
      supabase.from("quote_requests").select("*", { count: "exact", head: true }),
      supabase.from("contact_messages").select("*", { count: "exact", head: true }).eq("status", "new"),
      supabase.from("contact_messages").select("*", { count: "exact", head: true }),
      supabase.from("blog_posts").select("*", { count: "exact", head: true }),
      supabase.from("portfolio_items").select("*", { count: "exact", head: true }),
      supabase.from("media_assets").select("*", { count: "exact", head: true }),
      supabase.from("services_content").select("*", { count: "exact", head: true }),
    ]);

    const errors = [quotesNew, quotesAll, messagesNew, messagesAll, posts, portfolio, media, services]
      .map((result) => result.error?.message)
      .filter(Boolean);
    if (errors.length) {
      return { content: [{ type: "text", text: errors.join("\n") }], isError: true };
    }

    const overview = {
      quoteRequests: { new: quotesNew.count ?? 0, total: quotesAll.count ?? 0 },
      contactMessages: { new: messagesNew.count ?? 0, total: messagesAll.count ?? 0 },
      blogPosts: posts.count ?? 0,
      portfolioItems: portfolio.count ?? 0,
      mediaAssets: media.count ?? 0,
      services: services.count ?? 0,
    };

    return {
      content: [{ type: "text", text: JSON.stringify(overview, null, 2) }],
      structuredContent: overview,
    };
  },
});