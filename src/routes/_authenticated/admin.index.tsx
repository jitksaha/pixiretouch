import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: Dashboard,
});

function Dashboard() {
  const [counts, setCounts] = useState({ quotes: 0, messages: 0, posts: 0, portfolio: 0 });

  useEffect(() => {
    (async () => {
      const [q, m, b, p] = await Promise.all([
        supabase.from("quote_requests").select("*", { count: "exact", head: true }),
        supabase.from("contact_messages").select("*", { count: "exact", head: true }),
        supabase.from("blog_posts").select("*", { count: "exact", head: true }),
        supabase.from("portfolio_items").select("*", { count: "exact", head: true }),
      ]);
      setCounts({
        quotes: q.count ?? 0,
        messages: m.count ?? 0,
        posts: b.count ?? 0,
        portfolio: p.count ?? 0,
      });
    })();
  }, []);

  const cards = [
    { label: "Quote requests", value: counts.quotes },
    { label: "Contact messages", value: counts.messages },
    { label: "Blog posts", value: counts.posts },
    { label: "Portfolio items", value: counts.portfolio },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">Overview of content and submissions.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">{c.label}</p>
            <p className="mt-2 font-display text-3xl">{c.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
