import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Container, Section } from "@/components/site/Container";
import { AlertCircle, CheckCircle2, LinkIcon } from "lucide-react";

export const Route = createFileRoute("/reset-password")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Reset Password — Pixi Retouch" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: ResetPasswordPage,
});

const schema = z
  .object({
    password: z.string().min(8, "At least 8 characters").max(200),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, { message: "Passwords don't match", path: ["confirm"] });

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const [linkError, setLinkError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Supabase parses recovery tokens from the URL hash. If the link is invalid/expired,
    // it surfaces error params in the hash (e.g. #error=access_denied&error_code=otp_expired).
    if (typeof window !== "undefined" && window.location.hash) {
      const params = new URLSearchParams(window.location.hash.replace(/^#/, ""));
      const err = params.get("error_description") || params.get("error");
      if (err) setLinkError(err.replace(/\+/g, " "));
    }

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
        setHasSession(!!session);
      }
    });
    supabase.auth.getSession().then(({ data }) => {
      setHasSession(!!data.session);
      setReady(true);
    });
    return () => { sub.subscription.unsubscribe(); };
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse({ password: fd.get("password"), confirm: fd.get("confirm") });
    if (!parsed.success) { setError(parsed.error.issues[0]?.message ?? "Invalid input"); return; }
    setLoading(true);
    const { error: upErr } = await supabase.auth.updateUser({ password: parsed.data.password });
    setLoading(false);
    if (upErr) { setError(upErr.message); return; }
    setDone(true);
    setTimeout(() => navigate({ to: "/admin" }), 1500);
  };

  const invalidLink = ready && !hasSession;

  return (
    <Section className="pt-24">
      <Container className="max-w-md">
        <h1 className="font-display text-4xl">Set a new password</h1>

        {!ready ? (
          <p className="mt-6 text-sm text-muted-foreground">Loading…</p>
        ) : done ? (
          <Alert className="mt-8 border-emerald-500/40 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200">
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Password updated</AlertTitle>
            <AlertDescription>You're signed in. Redirecting to the admin dashboard…</AlertDescription>
          </Alert>
        ) : invalidLink ? (
          <div className="mt-8 space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Invalid or expired reset link</AlertTitle>
              <AlertDescription>
                {linkError ?? "This reset link can't be used. It may have expired or already been used."}
                {" "}Request a new one and open it on this device.
              </AlertDescription>
            </Alert>
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm shadow-soft hover:bg-muted"
            >
              <LinkIcon className="h-4 w-4" />
              Request a new reset link
            </Link>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-2xl border border-border bg-card p-6 shadow-soft">
            <div className="space-y-2">
              <Label htmlFor="password">New password</Label>
              <Input id="password" name="password" type="password" autoComplete="new-password" required minLength={8} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm">Confirm password</Label>
              <Input id="confirm" name="confirm" type="password" autoComplete="new-password" required minLength={8} />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Couldn't update password</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Updating…" : "Update password"}
            </Button>
          </form>
        )}
      </Container>
    </Section>
  );
}
