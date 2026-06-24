import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, TrendingUp, Target } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/_authenticated/admin/analytics")({
  component: Analytics,
});

type Quote = {
  id: string; name: string; email: string; phone: string | null; service: string | null;
  quantity: string | null; turnaround: string | null; message: string | null; status: string; created_at: string;
};
type Msg = {
  id: string; name: string; email: string; subject: string | null; message: string; status: string; created_at: string;
};

const RANGES = [
  { value: "7", label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
  { value: "90", label: "Last 90 days" },
];

function csvEscape(v: unknown) {
  if (v === null || v === undefined) return "";
  const s = String(v).replace(/"/g, '""');
  return /[",\n]/.test(s) ? `"${s}"` : s;
}
function downloadCsv(filename: string, headers: string[], rows: (string | number | null)[][]) {
  const csv = [headers.join(","), ...rows.map((r) => r.map(csvEscape).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function Analytics() {
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState("30");
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [messages, setMessages] = useState<Msg[]>([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [q, m] = await Promise.all([
        supabase.from("quote_requests").select("*").order("created_at", { ascending: false }),
        supabase.from("contact_messages").select("*").order("created_at", { ascending: false }),
      ]);
      setQuotes((q.data as Quote[]) ?? []);
      setMessages((m.data as Msg[]) ?? []);
      setLoading(false);
    })();
  }, []);

  const n = parseInt(days, 10);
  const since = useMemo(() => Date.now() - n * 24 * 60 * 60 * 1000, [n]);

  const inRangeQuotes = useMemo(() => quotes.filter((q) => new Date(q.created_at).getTime() >= since), [quotes, since]);
  const inRangeMsgs = useMemo(() => messages.filter((m) => new Date(m.created_at).getTime() >= since), [messages, since]);

  // Funnel: contact_messages + quote_requests -> in_progress -> closed
  const funnel = useMemo(() => {
    const totalLeads = inRangeQuotes.length + inRangeMsgs.length;
    const qInProgress = inRangeQuotes.filter((q) => q.status === "in_progress" || q.status === "closed").length;
    const qClosed = inRangeQuotes.filter((q) => q.status === "closed").length;
    return [
      { stage: "Leads", value: totalLeads, color: "var(--primary)" },
      { stage: "Quotes opened", value: inRangeQuotes.length, color: "var(--primary)" },
      { stage: "In progress", value: qInProgress, color: "var(--primary)" },
      { stage: "Closed (won)", value: qClosed, color: "var(--primary)" },
    ];
  }, [inRangeQuotes, inRangeMsgs]);

  const convRate = funnel[0].value ? Math.round((funnel[3].value / funnel[0].value) * 100) : 0;
  const quoteCloseRate = inRangeQuotes.length ? Math.round((funnel[3].value / inRangeQuotes.length) * 100) : 0;

  // Growth chart
  const growth = useMemo(() => {
    const buckets: { key: string; date: string; quotes: number; messages: number }[] = [];
    const map: Record<string, { quotes: number; messages: number }> = {};
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      buckets.push({
        key,
        date: d.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
        quotes: 0,
        messages: 0,
      });
      map[key] = { quotes: 0, messages: 0 };
    }
    inRangeQuotes.forEach((q) => {
      const k = q.created_at.slice(0, 10);
      if (map[k]) map[k].quotes += 1;
    });
    inRangeMsgs.forEach((m) => {
      const k = m.created_at.slice(0, 10);
      if (map[k]) map[k].messages += 1;
    });
    return buckets.map((b) => ({ date: b.date, quotes: map[b.key].quotes, messages: map[b.key].messages }));
  }, [inRangeQuotes, inRangeMsgs, n]);

  // Top services
  const topServices = useMemo(() => {
    const counts: Record<string, number> = {};
    inRangeQuotes.forEach((q) => {
      const s = q.service || "Unspecified";
      counts[s] = (counts[s] ?? 0) + 1;
    });
    return Object.entries(counts)
      .map(([service, count]) => ({ service, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [inRangeQuotes]);

  const exportQuotes = () => {
    downloadCsv(
      `quotes-${new Date().toISOString().slice(0, 10)}.csv`,
      ["id", "created_at", "name", "email", "phone", "service", "quantity", "turnaround", "status", "message"],
      quotes.map((q) => [q.id, q.created_at, q.name, q.email, q.phone, q.service, q.quantity, q.turnaround, q.status, q.message]),
    );
  };
  const exportMessages = () => {
    downloadCsv(
      `messages-${new Date().toISOString().slice(0, 10)}.csv`,
      ["id", "created_at", "name", "email", "subject", "status", "message"],
      messages.map((m) => [m.id, m.created_at, m.name, m.email, m.subject, m.status, m.message]),
    );
  };

  const growthConfig = {
    quotes: { label: "Quotes", color: "var(--primary)" },
    messages: { label: "Messages", color: "var(--muted-foreground)" },
  } satisfies ChartConfig;

  const funnelConfig = {
    value: { label: "Count", color: "var(--primary)" },
  } satisfies ChartConfig;

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <Select value={days} onValueChange={setDays}>
          <SelectTrigger className="h-9 w-[160px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            {RANGES.map((r) => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
          </SelectContent>
        </Select>
        <div className="ml-auto flex gap-2">
          <Button variant="outline" size="sm" onClick={exportQuotes}>
            <Download className="mr-1.5 h-3.5 w-3.5" /> Export quotes CSV
          </Button>
          <Button variant="outline" size="sm" onClick={exportMessages}>
            <Download className="mr-1.5 h-3.5 w-3.5" /> Export messages CSV
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPI label="Total leads" value={funnel[0].value} sub={`${inRangeQuotes.length} quotes · ${inRangeMsgs.length} messages`} loading={loading} />
        <KPI label="Quotes closed" value={funnel[3].value} sub={`${quoteCloseRate}% close rate`} loading={loading} />
        <KPI label="Conversion rate" value={`${convRate}%`} sub="Leads → closed quotes" loading={loading} />
        <KPI label="Avg / day" value={(funnel[0].value / n).toFixed(1)} sub={`Over ${n} days`} loading={loading} />
      </div>

      {/* Funnel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Target className="h-4 w-4 text-muted-foreground" /> Conversion funnel
          </CardTitle>
          <CardDescription>From first touch to closed quote</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <Skeleton className="h-48 w-full" />
          ) : (
            <>
              <ChartContainer config={funnelConfig} className="h-48 w-full">
                <BarChart data={funnel} layout="vertical" margin={{ left: 8, right: 24 }}>
                  <CartesianGrid horizontal={false} strokeDasharray="3 3" className="stroke-border" />
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="stage" tickLine={false} axisLine={false} width={110} fontSize={12} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill="var(--primary)" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ChartContainer>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {funnel.map((f, i) => {
                  const pct = funnel[0].value ? Math.round((f.value / funnel[0].value) * 100) : 0;
                  return (
                    <div key={f.stage} className="rounded-lg border border-border bg-card/60 p-3">
                      <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{f.stage}</p>
                      <p className="mt-1 font-display text-2xl">{f.value}</p>
                      {i > 0 && <p className="text-xs text-muted-foreground">{pct}% of leads</p>}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Growth + Top services */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <div>
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="h-4 w-4 text-muted-foreground" /> Growth
              </CardTitle>
              <CardDescription>Daily volume over the selected range</CardDescription>
            </div>
            <Badge variant="secondary">{funnel[0].value} total</Badge>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <ChartContainer config={growthConfig} className="h-64 w-full">
                <AreaChart data={growth} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
                  <defs>
                    <linearGradient id="aQuotes" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="aMsgs" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--muted-foreground)" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="var(--muted-foreground)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} fontSize={11} />
                  <YAxis hide allowDecimals={false} />
                  <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
                  <Area type="monotone" dataKey="messages" stroke="var(--muted-foreground)" fill="url(#aMsgs)" strokeWidth={1.5} />
                  <Area type="monotone" dataKey="quotes" stroke="var(--primary)" fill="url(#aQuotes)" strokeWidth={2} />
                </AreaChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top services</CardTitle>
            <CardDescription>Most requested in range</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}</div>
            ) : topServices.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">No data yet.</p>
            ) : (
              <ul className="space-y-2">
                {topServices.map((s) => {
                  const max = topServices[0].count;
                  const pct = Math.round((s.count / max) * 100);
                  return (
                    <li key={s.service}>
                      <div className="mb-1 flex items-center justify-between text-xs">
                        <span className="truncate font-medium">{s.service}</span>
                        <span className="text-muted-foreground">{s.count}</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function KPI({ label, value, sub, loading }: { label: string; value: string | number; sub: string; loading: boolean }) {
  return (
    <Card>
      <CardContent className="p-5">
        {loading ? (
          <Skeleton className="h-16 w-full" />
        ) : (
          <>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
            <p className="mt-2 font-display text-3xl leading-none">{value}</p>
            <p className="mt-2 text-xs text-muted-foreground">{sub}</p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
