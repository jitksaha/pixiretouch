import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Plus, Save, X } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/blog")({
  component: BlogAdmin,
});

type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string | null;
  cover_image: string | null;
  published: boolean;
  created_at: string;
};

const empty = { slug: "", title: "", excerpt: "", body: "", cover_image: "", published: false };

function BlogAdmin() {
  const [rows, setRows] = useState<Post[]>([]);
  const [editing, setEditing] = useState<(typeof empty & { id?: string }) | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
    setRows((data as Post[]) ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    if (!editing.slug.trim() || !editing.title.trim()) { alert("Slug and title are required"); return; }
    const payload = {
      slug: editing.slug.trim(),
      title: editing.title.trim(),
      excerpt: editing.excerpt || null,
      body: editing.body || null,
      cover_image: editing.cover_image || null,
      published: editing.published,
    };
    const res = editing.id
      ? await supabase.from("blog_posts").update(payload).eq("id", editing.id)
      : await supabase.from("blog_posts").insert(payload);
    if (res.error) { alert(res.error.message); return; }
    setEditing(null);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    await supabase.from("blog_posts").delete().eq("id", id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl">Blog posts</h1>
        {!editing && (
          <Button onClick={() => setEditing({ ...empty })}>
            <Plus className="mr-1 h-4 w-4" /> New post
          </Button>
        )}
      </div>

      {editing && (
        <div className="mt-6 space-y-4 rounded-2xl border border-border bg-card p-6 shadow-soft">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} placeholder="my-post-slug" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Cover image URL</Label>
            <Input value={editing.cover_image ?? ""} onChange={(e) => setEditing({ ...editing, cover_image: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Excerpt</Label>
            <Textarea rows={2} value={editing.excerpt ?? ""} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Body (Markdown)</Label>
            <Textarea rows={10} value={editing.body ?? ""} onChange={(e) => setEditing({ ...editing, body: e.target.value })} />
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

      <div className="mt-6 space-y-2">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">No posts yet.</p>
        ) : rows.map((r) => (
          <div key={r.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
            <div className="min-w-0">
              <p className="truncate font-medium">{r.title}</p>
              <p className="truncate text-xs text-muted-foreground">/{r.slug} · {r.published ? "Published" : "Draft"}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => setEditing({
                id: r.id, slug: r.slug, title: r.title,
                excerpt: r.excerpt ?? "", body: r.body ?? "",
                cover_image: r.cover_image ?? "", published: r.published,
              })}>Edit</Button>
              <Button size="icon" variant="ghost" onClick={() => remove(r.id)} aria-label="Delete">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
