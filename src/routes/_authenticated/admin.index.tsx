import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Inbox,
  MessageSquare,
  FileText,
  Image as ImageIcon,
  TrendingUp,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Activity,
} from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: Dashboard,
});

type Counts = {
  quotes: number;
  quotesNew: number;
  messages: number;
  messagesNew: number;
  posts: number;
  postsPublished: number;
  portfolio: number;
  portfolioPublished: number;
};

type Quote = {
  id: string; name: string; email: string; service: string | null; status: string; created_at: string;
};
type Msg = {
  id: string; name: string; email: string; subject: string | null; status: string; created_at: string;
};

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState<Counts | null>(null);
  const [recentQuotes, setRecentQuotes] = useState<Quote[]>([]);
  const [recentMessages, setRecentMessages] = useState<Msg[]>([]);
  const [trend, setTrend] = useState<{ date: string; quotes: number; messages: number }[]>([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const since = new Date(Date.now() - 13 * 24 * 60 * 60 * 1000);
      since.setHours(0, 0, 0, 0);

      const [q, qNew, m, mNew, b, bPub, p, pPub, qList, mList, qTrend, mTrend] = await Promise.all([
        supabase.from("quote_requests").select("*", { count: "exact", head: true }),
        supabase.from("quote_requests").select("*", { count: "exact", head: true }).eq("status", "new"),
        supabase.from("contact_messages").select("*", { count: "exact", head: true }),
        supabase.from("contact_messages").select("*", { count: "exact", head: true }).eq("status", "new"),
        supabase.from("blog_posts").select("*", { count: "exact", head: true }),
        supabase.from("blog_posts").select("*", { count: "exact", head: true }).eq("published", true),
        supabase.from("portfolio_items").select("*", { count: "exact", head: true }),
        supabase.from("portfolio_items").select("*", { count: "exact", head: true }).eq("published", true),
        supabase.from("quote_requests").select("id,name,email,service,status,created_at").order("created_at", { ascending: false }).limit(5),
        supabase.from("contact_messages").select("id,name,email,subject,status,created_at").order("created_at", { ascending: false }).limit(5),
        supabase.from("quote_requests").select("created_at").gte("created_at", since.toISOString()),
        supabase.from("contact_messages").select("created_at").gte("created_at", since.toISOString()),
      ]);

      setCounts({
        quotes: q.count ?? 0,
        quotesNew: qNew.count ?? 0,
        messages: m.count ?? 0,
        messagesNew: mNew.count ?? 0,
        posts: b.count ?? 0,
        postsPublished: bPub.count ?? 0,
        portfolio: p.count ?? 0,
        portfolioPublished: pPub.count ?? 0,
      });
      setRecentQuotes((qList.data as Quote[]) ?? []);
      setRecentMessages((mList.data as Msg[]) ?? []);

      // build 14-day trend
      const days: { date: string; key: string; quotes: number; messages: number }[] = [];
      for (let i = 13; i >= 0; i--) {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() - i);
        const key = d.toISOString().slice(0, 10);
        days.push({
          key,
          date: d.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
          quotes: 0,
          messages: 0,
        });
      }
      const bucket: Record<string, { quotes: number; messages: number }> = Object.fromEntries(
        days.map((d) => [d.key, { quotes: 0, messages: 0 }])
      );
      (qTrend.data ?? []).forEach((r: { created_at: string }) => {
        const k = r.created_at.slice(0, 10);
        if (bucket[k]) bucket[k].quotes += 1;
      });
      (mTrend.data ?? []).forEach((r: { created_at: string }) => {
        const k = r.created_at.slice(0, 10);
        if (bucket[k]) bucket[k].messages += 1;
      });
      setTrend(days.map((d) => ({ date: d.date, quotes: bucket[d.key].quotes, messages: bucket[d.key].messages })));

      setLoading(false);
    })();
  }, []);

  const stats = useMemo(() => {
    if (!counts) return [];
    return [
      {
        label: "Quote requests",
        value: counts.quotes,
        sub: `${counts.quotesNew} new`,
        icon: Inbox,
        href: "/admin/quotes",
        accent: "from-amber-500/20 to-amber-500/0 text-amber-700 dark:text-amber-300",
      },
      {
        label: "Messages",
        value: counts.messages,
        sub: `${counts.messagesNew} new`,
        icon: MessageSquare,
        href: "/admin/messages",
        accent: "from-sky-500/20 to-sky-500/0 text-sky-700 dark:text-sky-300",
      },
      {
        label: "Blog posts",
        value: counts.posts,
        sub: `${counts.postsPublished} published`,
        icon: FileText,
        href: "/admin/blog",
        accent: "from-emerald-500/20 to-emerald-500/0 text-emerald-700 dark:text-emerald-300",
      },
      {
        label: "Portfolio",
        value: counts.portfolio,
        sub: `${counts.portfolioPublished} published`,
        icon: ImageIcon,
        href: "/admin/portfolio",
        accent: "from-fuchsia-500/20 to-fuchsia-500/0 text-fuchsia-700 dark:text-fuchsia-300",
      },
    ];
  }, [counts]);

  const trendTotal = useMemo(
    () => trend.reduce((acc, d) => acc + d.quotes + d.messages, 0),
    [trend]
  );

  const chartConfig = {
    quotes: { label: "Quotes", color: "hsl(var(--primary))" },
    messages: { label: "Messages", color: "hsl(var(--muted-foreground))" },
  } satisfies ChartConfig;

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading || !counts
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}><CardContent className="p-5"><Skeleton className="h-20 w-full" /></CardContent></Card>
            ))
          : stats.map((s) => {
              const Icon = s.icon;
              return (
                <Link key={s.label} to={s.href} className="group">
                  <Card className="relative overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-md">
                    <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${s.accent} opacity-60`} />
                    <CardContent className="relative p-5">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{s.label}</p>
                          <p className="mt-2 font-display text-3xl leading-none">{s.value}</p>
                          <p className="mt-2 text-xs text-muted-foreground">{s.sub}</p>
                        </div>
                        <div className="rounded-xl border border-border/60 bg-background/70 p-2 backdrop-blur">
                          <Icon className="h-4 w-4" />
                        </div>
                      </div>
                      <div className="mt-4 flex items-center gap-1 text-xs font-medium text-foreground/80 opacity-0 transition-opacity group-hover:opacity-100">
                        Manage <ArrowUpRight className="h-3 w-3" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
      </div>

      {/* Chart + Quick actions */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <div>
              <CardTitle className="flex items-center gap-2 text-base">
                <Activity className="h-4 w-4 text-muted-foreground" />
                Last 14 days
              </CardTitle>
              <CardDescription>Quotes and messages received per day</CardDescription>
            </div>
            <Badge variant="secondary" className="gap-1">
              <TrendingUp className="h-3 w-3" /> {trendTotal} total
            </Badge>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-56 w-full" />
            ) : (
              <ChartContainer config={chartConfig} className="h-56 w-full">
                <AreaChart data={trend} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
                  <defs>
                    <linearGradient id="fillQuotes" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="fillMessages" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} fontSize={11} />
                  <YAxis hide allowDecimals={false} />
                  <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
                  <Area type="monotone" dataKey="messages" stroke="hsl(var(--muted-foreground))" fill="url(#fillMessages)" strokeWidth={1.5} />
                  <Area type="monotone" dataKey="quotes" stroke="hsl(var(--primary))" fill="url(#fillQuotes)" strokeWidth={2} />
                </AreaChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick actions</CardTitle>
            <CardDescription>Jump straight into common tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild variant="outline" className="w-full justify-between">
              <Link to="/admin/blog">New blog post <ArrowUpRight className="h-4 w-4" /></Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-between">
              <Link to="/admin/portfolio">Add portfolio item <ArrowUpRight className="h-4 w-4" /></Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-between">
              <Link to="/admin/services">Edit services <ArrowUpRight className="h-4 w-4" /></Link>
            </Button>
            <Button asChild variant="default" className="w-full justify-between">
              <Link to="/admin/quotes">Review quotes <ArrowUpRight className="h-4 w-4" /></Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent activity */}
      <div className="grid gap-4 lg:grid-cols-2">
        <RecentList
          title="Recent quote requests"
          empty="No quote requests yet."
          href="/admin/quotes"
          loading={loading}
          rows={recentQuotes.map((q) => ({
            id: q.id,
            primary: q.name,
            secondary: q.service || q.email,
            status: q.status,
            time: q.created_at,
          }))}
        />
        <RecentList
          title="Recent messages"
          empty="No messages yet."
          href="/admin/messages"
          loading={loading}
          rows={recentMessages.map((m) => ({
            id: m.id,
            primary: m.name,
            secondary: m.subject || m.email,
            status: m.status,
            time: m.created_at,
          }))}
        />
      </div>
    </div>
  );
}

function statusVariant(status: string): { variant: "default" | "secondary" | "outline"; icon: typeof Clock } {
  if (status === "new") return { variant: "default", icon: Clock };
  if (status === "in_progress" || status === "replied") return { variant: "secondary", icon: Activity };
  return { variant: "outline", icon: CheckCircle2 };
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(iso).toLocaleDateString();
}

function RecentList({
  title, empty, href, loading, rows,
}: {
  title: string; empty: string; href: string; loading: boolean;
  rows: { id: string; primary: string; secondary: string; status: string; time: string }[];
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base">{title}</CardTitle>
        <Button asChild size="sm" variant="ghost" className="-mr-2 h-8">
          <Link to={href}>View all <ArrowUpRight className="ml-1 h-3.5 w-3.5" /></Link>
        </Button>
      </CardHeader>
      <CardContent className="pt-0">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        ) : rows.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">{empty}</p>
        ) : (
          <ul className="divide-y divide-border/60">
            {rows.map((r) => {
              const s = statusVariant(r.status);
              const Icon = s.icon;
              return (
                <li key={r.id} className="flex items-center gap-3 py-3 first:pt-1 last:pb-1">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
                    {r.primary.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{r.primary}</p>
                    <p className="truncate text-xs text-muted-foreground">{r.secondary}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Badge variant={s.variant} className="gap-1 text-[10px]">
                      <Icon className="h-3 w-3" />
                      {r.status.replace("_", " ")}
                    </Badge>
                    <span className="hidden text-xs text-muted-foreground sm:inline">{timeAgo(r.time)}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
