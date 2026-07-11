import { createClient } from "@supabase/supabase-js";
import type { ToolContext, ToolHandlerResult } from "@lovable.dev/mcp-js";
import type { Database } from "@/integrations/supabase/types";

export function toolError(message: string): ToolHandlerResult {
  return { content: [{ type: "text", text: message }], isError: true };
}

export function supabaseForUser(ctx: ToolContext) {
  const token = ctx.getToken();
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!token) throw new Error("Missing authenticated MCP bearer token.");
  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    throw new Error("Supabase is not configured for MCP tools.");
  }

  return createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
  });
}

export async function requireAdmin(ctx: ToolContext) {
  if (!ctx.isAuthenticated() || !ctx.getUserId()) {
    return { error: toolError("Sign in to Pixi Retouch before using this tool.") };
  }

  const supabase = supabaseForUser(ctx);
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", ctx.getUserId()!)
    .eq("role", "admin")
    .maybeSingle();

  if (error) return { error: toolError(`Could not verify admin access: ${error.message}`) };
  if (!data) return { error: toolError("This MCP tool requires a Pixi Retouch admin account.") };

  return { supabase, userId: ctx.getUserId()! };
}

export function clampLimit(value: number | undefined, fallback = 10, max = 50) {
  if (!Number.isFinite(value ?? Number.NaN)) return fallback;
  return Math.max(1, Math.min(max, Math.floor(value!)));
}