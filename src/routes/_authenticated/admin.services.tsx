import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/services")({
  component: ServicesAdmin,
});

type Row = {
  slug: string;
  title: string | null;
  description: string | null;
  pricing: string | null;
  features: string[] | null;
};

const emptyRow: Row = { slug: "", title: "", description: "", pricing: "", features: [] };

function ServicesAdmin() {
  const [rows, setRows] = useState<Row[]>([]);
  const [draft, setDraft] = useState<Row>(emptyRow);
  const [editing, setEditing] = useState<Row | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("services_content").select("*").order("slug");
    setRows((data ?? []).map((r: any) => ({ ...r, features: r.features ?? [] })));
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const save = async (row: Row) => {
    if (!row.slug.trim()) { alert("Slug required"); return; }
    const payload = {
      slug: row.slug.trim(),
      title: row.title || null,
      description: row.description || null,
      pricing: row.pricing || null,
      features: row.features ?? [],
    };
    const res = await supabase.from("services_content").upsert(payload, { onConflict: "slug" });
    if (res.error) { alert(res.error.message); return; }
    setEditing(null); setDraft(emptyRow); load();
  };

  const remove = async (slug: string) => {
    if (!confirm("Delete this override?")) return;
    await supabase.from("services_content").delete().eq("slug", slug);
    load();
  };

  const RowForm = ({ value, onChange, onSave, isNew }: {
    value: Row; onChange: (r: Row) => void; onSave: () => void; isNew?: boolean;
  }) => (
    <div className="space-y-3 rounded-xl border border-border bg-card p-4">
      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-1"><Label>Slug</Label><Input value={value.slug} disabled={!isNew} onChange={(e) => onChange({ ...value, slug: e.target.value })} placeholder="product-photo-retouching" /></div>
        <div className="space-y-1"><Label>Title</Label><Input value={value.title ?? ""} onChange={(e) => onChange({ ...value, title: e.target.value })} /></div>
      </div>
      <div className="space-y-1"><Label>Description</Label><Textarea rows={3} value={value.description ?? ""} onChange={(e) => onChange({ ...value, description: e.target.value })} /></div>
      <div className="space-y-1"><Label>Pricing</Label><Input value={value.pricing ?? ""} onChange={(e) => onChange({ ...value, pricing: e.target.value })} placeholder="From $0.39 / image" /></div>
      <div className="space-y-1"><Label>Features (one per line)</Label>
        <Textarea rows={4} value={(value.features ?? []).join("\n")} onChange={(e) => onChange({ ...value, features: e.target.value.split("\n").map(s => s.trim()).filter(Boolean) })} />
      </div>
      <Button onClick={onSave}><Save className="mr-1 h-4 w-4" /> Save</Button>
    </div>
  );

  return (
    <div>
      <h1 className="font-display text-3xl">Services content</h1>
      <p className="mt-1 text-sm text-muted-foreground">Override service page copy. The slug must match the service route.</p>

      <h2 className="mt-6 mb-2 text-sm font-medium uppercase tracking-wider text-muted-foreground">Add override</h2>
      <RowForm value={draft} onChange={setDraft} onSave={() => save(draft)} isNew />

      <h2 className="mt-8 mb-2 text-sm font-medium uppercase tracking-wider text-muted-foreground">Existing</h2>
      {loading ? <p className="text-sm text-muted-foreground">Loading…</p> :
        rows.length === 0 ? <p className="text-sm text-muted-foreground">No overrides yet.</p> :
        <div className="space-y-3">
          {rows.map((r) => editing?.slug === r.slug ? (
            <RowForm key={r.slug} value={editing} onChange={setEditing} onSave={() => save(editing)} />
          ) : (
            <div key={r.slug} className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
              <div>
                <p className="font-medium">{r.title || r.slug}</p>
                <p className="text-xs text-muted-foreground">/{r.slug}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setEditing(r)}>Edit</Button>
                <Button size="sm" variant="ghost" onClick={() => remove(r.slug)}>Delete</Button>
              </div>
            </div>
          ))}
        </div>
      }
    </div>
  );
}
