import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { AlertCircle, CheckCircle2, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type OAuthClient = { name?: string };
type OAuthDetails = {
  client?: OAuthClient;
  redirect_url?: string;
  redirect_to?: string;
  scopes?: string[];
};
type OAuthDecision = { redirect_url?: string; redirect_to?: string };
type OAuthApi = {
  getAuthorizationDetails: (authorizationId: string) => Promise<{ data: OAuthDetails | null; error: Error | null }>;
  approveAuthorization: (authorizationId: string) => Promise<{ data: OAuthDecision | null; error: Error | null }>;
  denyAuthorization: (authorizationId: string) => Promise<{ data: OAuthDecision | null; error: Error | null }>;
};

function oauthApi(): OAuthApi {
  return (supabase.auth as unknown as { oauth: OAuthApi }).oauth;
}

export const Route = createFileRoute("/.lovable/oauth/consent")({
  ssr: false,
  validateSearch: (search: Record<string, unknown>) => ({
    authorization_id: typeof search.authorization_id === "string" ? search.authorization_id : "",
  }),
  beforeLoad: async ({ search, location }) => {
    if (!search.authorization_id) throw new Error("Missing authorization_id");
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      const next = `${location.pathname}${location.searchStr}`;
      throw redirect({ to: "/auth", search: { next } });
    }
  },
  loader: async ({ location }) => {
    const authorizationId = new URLSearchParams(location.search).get("authorization_id") ?? "";
    const { data, error } = await oauthApi().getAuthorizationDetails(authorizationId);
    if (error) throw error;
    const immediate = data?.redirect_url ?? data?.redirect_to;
    if (immediate && !data?.client) throw redirect({ href: immediate });
    return data;
  },
  component: ConsentPage,
  errorComponent: ({ error }) => (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <Alert variant="destructive" className="max-w-lg">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Could not load this connection request</AlertTitle>
        <AlertDescription>{String((error as Error)?.message ?? error)}</AlertDescription>
      </Alert>
    </main>
  ),
});

function ConsentPage() {
  const details = Route.useLoaderData();
  const { authorization_id } = Route.useSearch();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const clientName = details?.client?.name ?? "this AI client";

  async function decide(approve: boolean) {
    setBusy(true);
    setError(null);
    const { data, error: decisionError } = approve
      ? await oauthApi().approveAuthorization(authorization_id)
      : await oauthApi().denyAuthorization(authorization_id);

    if (decisionError) {
      setBusy(false);
      setError(decisionError.message);
      return;
    }

    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(false);
      setError("No redirect was returned by the authorization server.");
      return;
    }

    window.location.href = target;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <section className="w-full max-w-lg rounded-lg border border-border bg-card p-6 shadow-soft">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-display text-3xl leading-tight">Connect {clientName}</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              This lets {clientName} use Pixi Retouch MCP tools as your signed-in admin account.
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-md border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
          <div className="flex gap-2 text-foreground">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            <p>Access is limited by your Pixi Retouch account and existing database security rules.</p>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mt-5">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Connection failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" disabled={busy} onClick={() => decide(false)}>
            Deny
          </Button>
          <Button type="button" disabled={busy} onClick={() => decide(true)}>
            {busy ? "Connecting…" : "Approve"}
          </Button>
        </div>
      </section>
    </main>
  );
}