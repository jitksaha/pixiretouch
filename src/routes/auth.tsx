import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Container, Section } from "@/components/site/Container";

export const Route = createFileRoute("/auth")({
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

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "forgot">("signin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/admin" });
    });
  }, [navigate]);

  const onSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null); setInfo(null);
    const fd = new FormData(e.currentTarget);
    const parsed = signInSchema.safeParse({ email: fd.get("email"), password: fd.get("password") });
    if (!parsed.success) { setError(parsed.error.issues[0]?.message ?? "Invalid input"); return; }
    setLoading(true);
    const { error: signErr } = await supabase.auth.signInWithPassword(parsed.data);
    setLoading(false);
    if (signErr) { setError(signErr.message); return; }
    navigate({ to: "/admin" });
  };

  const onForgot = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null); setInfo(null);
    const fd = new FormData(e.currentTarget);
    const parsed = resetSchema.safeParse({ email: fd.get("email") });
    if (!parsed.success) { setError(parsed.error.issues[0]?.message ?? "Invalid email"); return; }
    setLoading(true);
    const { error: resetErr } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (resetErr) { setError(resetErr.message); return; }
    setInfo("If an account exists for that email, a password reset link has been sent.");
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
                  onClick={() => { setMode("forgot"); setError(null); setInfo(null); }}
                  className="text-xs text-muted-foreground hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <Input id="password" name="password" type="password" autoComplete="current-password" required />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            {info && <p className="text-sm text-muted-foreground">{info}</p>}
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
              <Input id="email" name="email" type="email" autoComplete="email" required />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            {info && <p className="text-sm text-foreground">{info}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Sending…" : "Send reset link"}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              <button type="button" onClick={() => { setMode("signin"); setError(null); setInfo(null); }} className="hover:underline">
                ← Back to sign in
              </button>
            </p>
          </form>
        )}
      </Container>
    </Section>
  );
}
