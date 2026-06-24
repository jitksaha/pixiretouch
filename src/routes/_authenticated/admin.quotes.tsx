import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Search, Mail, Phone, Calendar, Package, Clock, Activity, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/quotes")({
  component: QuotesAdmin,
});

type Quote = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  service: string | null;
  quantity: string | null;
  turnaround: string | null;
  message: string | null;
  status: string;
  created_at: string;
};

const STATUS = [
  { value: "new", label: "New", icon: Clock, tone: "bg-amber-500/15 text-amber-700 dark:text-amber-300" },
  { value: "in_progress", label: "In progress", icon: Activity, tone: "bg-sky-500/15 text-sky-700 dark:text-sky-300" },
  { value: "closed", label: "Closed", icon: CheckCircle2, tone: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" },
];
const statusMeta = (s: string) => STATUS.find((x) => x.value === s) ?? STATUS[0];

const DATE_RANGES = [
  { value: "all", label: "All time" },
  { value: "7", label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
  { value: "90", label: "Last 90 days" },
];

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(iso).toLocaleDateString();
}

function QuotesAdmin() {
  const [rows, setRows] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("quote_requests")
      .select("*")
      .order("created_at", { ascending: false });
    const next = (data as Quote[]) ?? [];
    setRows(next);
    setLoading(false);
    if (!selectedId && next.length) setSelectedId(next[0].id);
  };
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const services = useMemo(() => {
    const s = new Set<string>();
    rows.forEach((r) => r.service && s.add(r.service));
    return Array.from(s).sort();
  }, [rows]);

  const filtered = useMemo(() => {
    const sinceMs =
      dateFilter === "all" ? 0 : Date.now() - parseInt(dateFilter, 10) * 24 * 60 * 60 * 1000;
    return rows.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (serviceFilter !== "all" && r.service !== serviceFilter) return false;
      if (sinceMs && new Date(r.created_at).getTime() < sinceMs) return false;
      if (!query) return true;
      const q = query.toLowerCase();
      return (
        r.name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        (r.service ?? "").toLowerCase().includes(q) ||
        (r.message ?? "").toLowerCase().includes(q)
      );
    });
  }, [rows, query, statusFilter, serviceFilter, dateFilter]);

  const selected = useMemo(
    () => filtered.find((r) => r.id === selectedId) ?? filtered[0] ?? null,
    [filtered, selectedId],
  );

  const setStatus = async (id: string, status: string) => {
    await supabase.from("quote_requests").update({ status }).eq("id", id);
    setRows((p) => p.map((r) => (r.id === id ? { ...r, status } : r)));
  };
  const remove = async (id: string) => {
    if (!confirm("Delete this quote?")) return;
    await supabase.from("quote_requests").delete().eq("id", id);
    setRows((p) => p.filter((r) => r.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <Card>
        <CardContent className="flex flex-wrap items-center gap-2 p-3">
          <div className="relative w-full max-w-xs">
            <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search name, email, service…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {STATUS.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={serviceFilter} onValueChange={setServiceFilter}>
            <SelectTrigger className="h-9 w-[160px]"><SelectValue placeholder="Service" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All services</SelectItem>
              {services.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="h-9 w-[140px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {DATE_RANGES.map((d) => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <span className="ml-auto text-xs text-muted-foreground">
            {filtered.length} of {rows.length}
          </span>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[380px_1fr]">
        {/* List */}
        <Card className="max-h-[72vh] overflow-hidden">
          <CardContent className="p-0">
            {loading ? (
              <div className="space-y-2 p-3">
                {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
              </div>
            ) : filtered.length === 0 ? (
              <p className="px-4 py-10 text-center text-sm text-muted-foreground">No quotes match your filters.</p>
            ) : (
              <ul className="max-h-[72vh] divide-y divide-border/60 overflow-y-auto">
                {filtered.map((r) => {
                  const meta = statusMeta(r.status);
                  const active = selected?.id === r.id;
                  return (
                    <li key={r.id}>
                      <button
                        onClick={() => setSelectedId(r.id)}
                        className={`flex w-full flex-col gap-1 px-4 py-3 text-left transition-colors ${
                          active ? "bg-muted" : "hover:bg-muted/60"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="truncate text-sm font-medium">{r.name}</span>
                          <span className={`ml-auto rounded-full px-1.5 py-0.5 text-[10px] font-medium ${meta.tone}`}>
                            {meta.label}
                          </span>
                        </div>
                        <p className="truncate text-xs text-muted-foreground">{r.service || "—"}</p>
                        <p className="text-[10px] text-muted-foreground">{timeAgo(r.created_at)}</p>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Detail */}
        <Card className="min-h-[72vh]">
          <CardContent className="p-6">
            {!selected ? (
              <p className="py-20 text-center text-sm text-muted-foreground">Select a quote to view details.</p>
            ) : (
              <div className="space-y-5">
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border/60 pb-4">
                  <div>
                    <h2 className="font-display text-xl">{selected.name}</h2>
                    <p className="text-xs text-muted-foreground">{new Date(selected.created_at).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select value={selected.status} onValueChange={(v) => setStatus(selected.id, v)}>
                      <SelectTrigger className="h-8 w-[150px] text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {STATUS.map((o) => <SelectItem key={o.value} value={o.value} className="text-xs">{o.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Button size="icon" variant="ghost" onClick={() => remove(selected.id)} aria-label="Delete">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <Field icon={Mail} label="Email" value={<a className="hover:underline" href={`mailto:${selected.email}`}>{selected.email}</a>} />
                  {selected.phone && <Field icon={Phone} label="Phone" value={<a className="hover:underline" href={`tel:${selected.phone}`}>{selected.phone}</a>} />}
                  {selected.service && <Field icon={Package} label="Service" value={selected.service} />}
                  {selected.quantity && <Field icon={Package} label="Quantity" value={selected.quantity} />}
                  {selected.turnaround && <Field icon={Calendar} label="Turnaround" value={selected.turnaround} />}
                </div>

                {selected.message && (
                  <div>
                    <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Brief</p>
                    <div className="rounded-xl border border-border bg-card p-4 text-sm leading-relaxed whitespace-pre-wrap">
                      {selected.message}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 border-t border-border/60 pt-4">
                  <Button asChild size="sm">
                    <a href={`mailto:${selected.email}?subject=${encodeURIComponent("Your quote request")}`}>
                      <Mail className="mr-1.5 h-3.5 w-3.5" /> Reply via email
                    </a>
                  </Button>
                  {selected.status === "new" && (
                    <Button size="sm" variant="outline" onClick={() => setStatus(selected.id, "in_progress")}>
                      Mark in progress
                    </Button>
                  )}
                  {selected.status !== "closed" && (
                    <Button size="sm" variant="outline" onClick={() => setStatus(selected.id, "closed")}>
                      <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" /> Close
                    </Button>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Field({ icon: Icon, label, value }: { icon: typeof Mail; label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-card/60 p-3">
      <p className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3 w-3" /> {label}
      </p>
      <p className="mt-1 text-sm">{value}</p>
    </div>
  );
}
