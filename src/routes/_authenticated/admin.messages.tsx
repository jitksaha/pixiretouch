import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Trash2, Mail, Reply, Search, CheckCircle2, Clock, Archive, Send } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/messages")({
  component: MessagesAdmin,
});

type Msg = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  status: string;
  created_at: string;
};

const STATUS_OPTIONS = [
  { value: "new", label: "New", icon: Clock, tone: "bg-amber-500/15 text-amber-700 dark:text-amber-300" },
  { value: "replied", label: "Replied", icon: CheckCircle2, tone: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" },
  { value: "archived", label: "Archived", icon: Archive, tone: "bg-muted text-muted-foreground" },
];

function statusMeta(s: string) {
  return STATUS_OPTIONS.find((o) => o.value === s) ?? STATUS_OPTIONS[0];
}

function timeAgo(iso: string) {
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

function MessagesAdmin() {
  const [rows, setRows] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [replyBody, setReplyBody] = useState("");
  const [sending, setSending] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    const next = (data as Msg[]) ?? [];
    setRows(next);
    setLoading(false);
    if (!selectedId && next.length) setSelectedId(next[0].id);
  };
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (!query) return true;
      const q = query.toLowerCase();
      return (
        r.name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        (r.subject ?? "").toLowerCase().includes(q) ||
        r.message.toLowerCase().includes(q)
      );
    });
  }, [rows, query, statusFilter]);

  const selected = useMemo(
    () => filtered.find((r) => r.id === selectedId) ?? filtered[0] ?? null,
    [filtered, selectedId],
  );

  const setStatus = async (id: string, status: string) => {
    await supabase.from("contact_messages").update({ status }).eq("id", id);
    setRows((p) => p.map((r) => (r.id === id ? { ...r, status } : r)));
  };
  const remove = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    await supabase.from("contact_messages").delete().eq("id", id);
    setRows((p) => p.filter((r) => r.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const sendReply = () => {
    if (!selected || !replyBody.trim()) return;
    setSending(true);
    const subject = selected.subject ? `Re: ${selected.subject}` : "Re: your message";
    const body = encodeURIComponent(replyBody);
    const url = `mailto:${selected.email}?subject=${encodeURIComponent(subject)}&body=${body}`;
    window.location.href = url;
    setTimeout(async () => {
      await setStatus(selected.id, "replied");
      setReplyBody("");
      setSending(false);
    }, 400);
  };

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: rows.length, new: 0, replied: 0, archived: 0 };
    rows.forEach((r) => {
      c[r.status] = (c[r.status] ?? 0) + 1;
    });
    return c;
  }, [rows]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {(["all", "new", "replied", "archived"] as const).map((k) => (
          <button
            key={k}
            onClick={() => setStatusFilter(k)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              statusFilter === k
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-card hover:bg-muted"
            }`}
          >
            {k === "all" ? "All" : statusMeta(k).label}
            <span className="ml-1.5 opacity-70">{counts[k] ?? 0}</span>
          </button>
        ))}
        <div className="relative ml-auto w-full max-w-xs">
          <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search name, email, subject…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
        {/* Thread list */}
        <Card className="max-h-[70vh] overflow-hidden">
          <CardContent className="p-0">
            {loading ? (
              <div className="space-y-2 p-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <p className="px-4 py-10 text-center text-sm text-muted-foreground">No messages.</p>
            ) : (
              <ul className="max-h-[70vh] divide-y divide-border/60 overflow-y-auto">
                {filtered.map((r) => {
                  const meta = statusMeta(r.status);
                  const active = selected?.id === r.id;
                  return (
                    <li key={r.id}>
                      <button
                        onClick={() => setSelectedId(r.id)}
                        className={`flex w-full flex-col items-start gap-1 px-4 py-3 text-left transition-colors ${
                          active ? "bg-muted" : "hover:bg-muted/60"
                        }`}
                      >
                        <div className="flex w-full items-center gap-2">
                          <span className="truncate text-sm font-medium">{r.name}</span>
                          <span className={`ml-auto rounded-full px-1.5 py-0.5 text-[10px] font-medium ${meta.tone}`}>
                            {meta.label}
                          </span>
                        </div>
                        <p className="truncate text-xs text-muted-foreground">{r.subject || "(no subject)"}</p>
                        <p className="line-clamp-1 text-xs text-muted-foreground/80">{r.message}</p>
                        <p className="text-[10px] text-muted-foreground">{timeAgo(r.created_at)}</p>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Detail / thread */}
        <Card className="min-h-[70vh]">
          <CardContent className="p-6">
            {!selected ? (
              <p className="py-20 text-center text-sm text-muted-foreground">Select a message to view the thread.</p>
            ) : (
              <div className="flex h-full flex-col">
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border/60 pb-4">
                  <div className="min-w-0">
                    <h2 className="font-display text-xl">{selected.subject || "(no subject)"}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">{selected.name}</span>{" "}
                      <a href={`mailto:${selected.email}`} className="underline-offset-2 hover:underline">
                        &lt;{selected.email}&gt;
                      </a>
                    </p>
                    <p className="text-xs text-muted-foreground">{new Date(selected.created_at).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select value={selected.status} onValueChange={(v) => setStatus(selected.id, v)}>
                      <SelectTrigger className="h-8 w-[140px] text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map((o) => (
                          <SelectItem key={o.value} value={o.value} className="text-xs">
                            {o.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button size="icon" variant="ghost" onClick={() => remove(selected.id)} aria-label="Delete">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Thread */}
                <div className="flex-1 space-y-4 py-5">
                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
                      {selected.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 rounded-xl border border-border bg-card p-3">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-medium">{selected.name}</p>
                        <p className="text-[10px] text-muted-foreground">{timeAgo(selected.created_at)}</p>
                      </div>
                      <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">{selected.message}</p>
                    </div>
                  </div>

                  {selected.status === "replied" && (
                    <div className="flex gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-foreground text-xs font-medium text-background">
                        ME
                      </div>
                      <div className="flex-1 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3">
                        <Badge variant="secondary" className="gap-1 text-[10px]">
                          <CheckCircle2 className="h-3 w-3" /> Marked as replied
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>

                {/* Reply */}
                <div className="border-t border-border/60 pt-4">
                  <label className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <Reply className="h-3.5 w-3.5" /> Reply via email
                  </label>
                  <Textarea
                    placeholder={`Hi ${selected.name.split(" ")[0]},\n\nThanks for reaching out…`}
                    value={replyBody}
                    onChange={(e) => setReplyBody(e.target.value)}
                    rows={4}
                  />
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                    <Button asChild variant="outline" size="sm">
                      <a href={`mailto:${selected.email}`}>
                        <Mail className="mr-1.5 h-3.5 w-3.5" /> Open in mail app
                      </a>
                    </Button>
                    <Button onClick={sendReply} disabled={!replyBody.trim() || sending} size="sm">
                      <Send className="mr-1.5 h-3.5 w-3.5" />
                      {sending ? "Sending…" : "Send reply"}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
