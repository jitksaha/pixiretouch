import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, Save, X } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/portfolio")({
  component: PortfolioAdmin,
});

type Item = {
  id: string;
  title: string;
  category: string | null;
  before_image: string;
  after_image: string;
  sort_order: number;
  published: boolean;
};

const empty = { title: "", category: "", before_image: "", after_image: "", sort_order: 0, published: true };

function PortfolioAdmin() {
  const [rows, setRows] = useState<Item[]>([]);
  const [editing, setEditing] = useState<(typeof empty & { id?: string }) | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("portfolio_items").select("*").order("sort_order").order("created_at");
    setRows((data as Item[]) ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    if (!editing.title.trim() || !editing.before_image || !editing.after_image) {
      alert("Title, before image, and after image are required"); return;
    }
    const payload = {
      title: editing.title.trim(),
      category: editing.category || null,
      before_image: editing.before_image,
      after_image: editing.after_image,
      sort_order: Number(editing.sort_order) || 0,
      published: editing.published,
    };
    const res = editing.id
      ? await supabase.from("portfolio_items").update(payload).eq("id", editing.id)
      : await supabase.from("portfolio_items").insert(payload);
    if (res.error) { alert(res.error.message); return; }
    setEditing(null); load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    await supabase.from("portfolio_items").delete().eq("id", id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl">Portfolio items</h1>
        {!editing && <Button onClick={() => setEditing({ ...empty })}><Plus className="mr-1 h-4 w-4" /> New item</Button>}
      </div>

      {editing && (
        <div className="mt-6 space-y-4 rounded-2xl border border-border bg-card p-6 shadow-soft">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2"><Label>Title</Label><Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></div>
            <div className="space-y-2"><Label>Category</Label><Input value={editing.category ?? ""} onChange={(e) => setEditing({ ...editing, category: e.target.value })} /></div>
            <div className="space-y-2"><Label>Before image URL</Label><Input value={editing.before_image} onChange={(e) => setEditing({ ...editing, before_image: e.target.value })} /></div>
            <div className="space-y-2"><Label>After image URL</Label><Input value={editing.after_image} onChange={(e) => setEditing({ ...editing, after_image: e.target.value })} /></div>
            <div className="space-y-2"><Label>Sort order</Label><Input type="number" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} /></div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={editing.published} onChange={(e) => setEditing({ ...editing, published: e.target.checked })} />
            Published
          </label>
          <div className="flex gap-2">
            <Button onClick={save}><Save className="mr-1 h-4 w-4" /> Save</Button>
            <Button variant="outline" onClick={() => setEditing(null)}><X className="mr-1 h-4 w-4" /> Cancel</Button>
          </div>
        </div>
      )}

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">No items yet.</p>
        ) : rows.map((r) => (
          <div key={r.id} className="rounded-xl border border-border bg-card p-3">
            <div className="grid grid-cols-2 gap-2">
              <img src={r.before_image} alt="" className="aspect-square w-full rounded object-cover" />
              <img src={r.after_image} alt="" className="aspect-square w-full rounded object-cover" />
            </div>
            <div className="mt-3 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate font-medium">{r.title}</p>
                <p className="truncate text-xs text-muted-foreground">{r.category ?? "—"} · {r.published ? "Live" : "Hidden"}</p>
              </div>
              <div className="flex items-center gap-1">
                <Button size="sm" variant="outline" onClick={() => setEditing({
                  id: r.id, title: r.title, category: r.category ?? "",
                  before_image: r.before_image, after_image: r.after_image,
                  sort_order: r.sort_order, published: r.published,
                })}>Edit</Button>
                <Button size="icon" variant="ghost" onClick={() => remove(r.id)} aria-label="Delete">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
