import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

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

function MessagesAdmin() {
  const [rows, setRows] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
    setRows((data as Msg[]) ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const setStatus = async (id: string, status: string) => {
    await supabase.from("contact_messages").update({ status }).eq("id", id);
    load();
  };
  const remove = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    await supabase.from("contact_messages").delete().eq("id", id);
    load();
  };

  return (
    <div>
      <h1 className="font-display text-3xl">Contact messages</h1>
      {loading ? (
        <p className="mt-6 text-sm text-muted-foreground">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">No messages yet.</p>
      ) : (
        <div className="mt-6 space-y-3">
          {rows.map((r) => (
            <div key={r.id} className="rounded-xl border border-border bg-card p-4 shadow-soft">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{r.name} <span className="text-xs text-muted-foreground">· {r.email}</span></p>
                  <p className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString()}</p>
                  {r.subject && <p className="mt-1 text-sm font-medium">{r.subject}</p>}
                  <p className="mt-2 whitespace-pre-wrap text-sm">{r.message}</p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={r.status}
                    onChange={(e) => setStatus(r.id, e.target.value)}
                    className="rounded-md border border-border bg-background px-2 py-1 text-xs"
                  >
                    <option value="new">New</option>
                    <option value="replied">Replied</option>
                    <option value="archived">Archived</option>
                  </select>
                  <Button size="icon" variant="ghost" onClick={() => remove(r.id)} aria-label="Delete">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
