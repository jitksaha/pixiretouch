import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Container, Section } from "@/components/site/Container";
import { CheckCircle2, AlertCircle, MailCheck } from "lucide-react";

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>) => ({
    next: typeof search.next === "string" && isSafeNextPath(search.next) ? search.next : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Admin Sign In — Pixi Retouch" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AuthPage,
});

const signInSchema = z.object({
  email: z.string().trim().email().max(255),
  password: z.string().min(6).max(200),
});

const resetSchema = z.object({
  email: z.string().trim().email().max(255),
});

function isSafeNextPath(value: string) {
  return value.startsWith("/") && !value.startsWith("//") && !value.includes("\\");
}

function goToNextOrAdmin(next: string | undefined, navigate: ReturnType<typeof useNavigate>) {
  if (next && isSafeNextPath(next)) {
    window.location.href = next;
    return;
  }
  navigate({ to: "/admin" });
}

function AuthPage() {
  const navigate = useNavigate();
  const { next } = Route.useSearch();
  const [mode, setMode] = useState<"signin" | "forgot">("signin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) goToNextOrAdmin(next, navigate);
    });
  }, [navigate, next]);

  const switchMode = (next: "signin" | "forgot") => {
    setMode(next); setError(null); setSentTo(null);
  };

  const onSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const parsed = signInSchema.safeParse({ email: fd.get("email"), password: fd.get("password") });
    if (!parsed.success) { setError(parsed.error.issues[0]?.message ?? "Invalid input"); return; }
    setLoading(true);
    const { error: signErr } = await supabase.auth.signInWithPassword(parsed.data);
    setLoading(false);
    if (signErr) { setError(signErr.message); return; }
    goToNextOrAdmin(next, navigate);
  };

  const onForgot = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null); setSentTo(null);
    const fd = new FormData(e.currentTarget);
    const parsed = resetSchema.safeParse({ email: fd.get("email") });
    if (!parsed.success) { setError(parsed.error.issues[0]?.message ?? "Invalid email"); return; }
    setLoading(true);
    const { error: resetErr } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (resetErr) { setError(resetErr.message); return; }
    setSentTo(parsed.data.email);
  };

  return (
    <Section className="pt-24">
      <Container className="max-w-md">
        <h1 className="font-display text-4xl">{mode === "signin" ? "Admin sign in" : "Reset password"}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {mode === "signin"
            ? "Restricted area. Contact the studio to request access."
            : "Enter your email and we'll send a reset link."}
        </p>

        {mode === "signin" ? (
          <form onSubmit={onSignIn} className="mt-8 space-y-4 rounded-2xl border border-border bg-card p-6 shadow-soft">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" autoComplete="email" required />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button
                  type="button"
                  onClick={() => switchMode("forgot")}
                  className="text-xs text-muted-foreground hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <Input id="password" name="password" type="password" autoComplete="current-password" required />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Sign in failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              <Link to="/" className="hover:underline">← Back to site</Link>
            </p>
          </form>
        ) : (
          <form onSubmit={onForgot} className="mt-8 space-y-4 rounded-2xl border border-border bg-card p-6 shadow-soft">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" autoComplete="email" required defaultValue={sentTo ?? ""} />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Couldn't send reset email</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {sentTo && (
              <Alert className="border-emerald-500/40 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200">
                <MailCheck className="h-4 w-4" />
                <AlertTitle>Check your inbox</AlertTitle>
                <AlertDescription>
                  If an account exists for <strong>{sentTo}</strong>, a password reset link is on its way.
                  The link expires shortly — open it on this device.
                </AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Sending…" : sentTo ? "Resend reset link" : "Send reset link"}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              <button type="button" onClick={() => switchMode("signin")} className="hover:underline">
                ← Back to sign in
              </button>
            </p>
          </form>
        )}
      </Container>
    </Section>
  );
}
