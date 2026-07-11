import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { clampLimit, requireAdmin } from "../supabase";

const tables = [
  "quote_requests",
  "contact_messages",
  "blog_posts",
  "portfolio_items",
  "media_assets",
  "services_content",
] as const;

type StudioTable = (typeof tables)[number];

const columnsByTable: Record<StudioTable, string> = {
  quote_requests: "id,created_at,updated_at,status,name,email,phone,service,quantity,turnaround,message,attachments",
  contact_messages: "id,created_at,updated_at,status,name,email,subject,message",
  blog_posts: "id,created_at,updated_at,slug,title,excerpt,cover_image,published,published_at",
  portfolio_items: "id,created_at,updated_at,title,category,before_image,after_image,published,sort_order",
  media_assets: "id,created_at,updated_at,name,kind,mime_type,size_bytes,storage_path,tags,width,height,uploaded_by",
  services_content: "slug,updated_at,title,description,pricing,features",
};

export default defineTool({
  name: "list_studio_records",
  title: "List studio records",
  description: "List recent admin-only Pixi Retouch records from quotes, messages, blog, portfolio, media, or services.",
  inputSchema: {
    table: z.enum(tables).describe("Which studio table to list."),
    status: z.string().optional().describe("Optional status filter for quote_requests or contact_messages."),
    published: z.boolean().optional().describe("Optional published filter for blog_posts or portfolio_items."),
    query: z.string().optional().describe("Optional text search for names, emails, titles, slugs, categories, or service names."),
    limit: z.number().optional().describe("Maximum rows to return. The server clamps this to a safe range."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: true },
  handler: async ({ table, status, published, query, limit }, ctx) => {
    const auth = await requireAdmin(ctx);
    if (auth.error) return auth.error;
    const { supabase } = auth;
    const rowLimit = clampLimit(limit);

    let request = (supabase.from(table) as any).select(columnsByTable[table]).limit(rowLimit);

    if ((table === "quote_requests" || table === "contact_messages") && status) {
      request = request.eq("status", status);
    }

    if ((table === "blog_posts" || table === "portfolio_items") && typeof published === "boolean") {
      request = request.eq("published", published);
    }

    if (query) {
      const term = query.replace(/[%(),]/g, " ").trim();
      if (term) {
        if (table === "quote_requests") request = request.or(`name.ilike.%${term}%,email.ilike.%${term}%,service.ilike.%${term}%`);
        if (table === "contact_messages") request = request.or(`name.ilike.%${term}%,email.ilike.%${term}%,subject.ilike.%${term}%`);
        if (table === "blog_posts") request = request.or(`title.ilike.%${term}%,slug.ilike.%${term}%,excerpt.ilike.%${term}%`);
        if (table === "portfolio_items") request = request.or(`title.ilike.%${term}%,category.ilike.%${term}%`);
        if (table === "media_assets") request = request.or(`name.ilike.%${term}%,kind.ilike.%${term}%`);
        if (table === "services_content") request = request.or(`slug.ilike.%${term}%,title.ilike.%${term}%,description.ilike.%${term}%`);
      }
    }

    if (table === "services_content") {
      request = request.order("updated_at", { ascending: false });
    } else if (table === "portfolio_items") {
      request = request.order("sort_order", { ascending: true }).order("created_at", { ascending: false });
    } else {
      request = request.order("created_at", { ascending: false });
    }

    const { data, error } = await request;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };

    const result = { table, count: data?.length ?? 0, rows: data ?? [] };
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      structuredContent: result,
    };
  },
});