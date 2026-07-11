import { auth, defineMcp } from "@lovable.dev/mcp-js";
import getStudioOverviewTool from "./tools/get-studio-overview";
import listStudioRecordsTool from "./tools/list-studio-records";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "pixi-retouch-mcp",
  title: "Pixi Retouch MCP",
  version: "0.1.0",
  instructions:
    "Admin tools for Pixi Retouch. Use these tools only after the user signs in with a Pixi Retouch admin account. Do not expose bearer tokens or private customer data beyond the user's explicit request.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [getStudioOverviewTool, listStudioRecordsTool],
});