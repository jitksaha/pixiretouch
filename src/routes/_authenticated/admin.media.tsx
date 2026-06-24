import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Upload,
  Search,
  Trash2,
  Copy,
  Check,
  Image as ImageIcon,
  Film,
  X,
  Tag as TagIcon,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/media")({
  component: MediaLibrary,
});

type MediaAsset = {
  id: string;
  name: string;
  storage_path: string;
  kind: "image" | "video";
  mime_type: string;
  size_bytes: number;
  width: number | null;
  height: number | null;
  tags: string[];
  created_at: string;
};

const BUCKET = "media";
const SIGNED_TTL = 60 * 60 * 24 * 365; // 1 year

function formatBytes(b: number) {
  if (!b) return "0 B";
  const u = ["B", "KB", "MB", "GB"];
  const i = Math.min(u.length - 1, Math.floor(Math.log(b) / Math.log(1024)));
  return `${(b / Math.pow(1024, i)).toFixed(i ? 1 : 0)} ${u[i]}`;
}

function MediaLibrary() {
  const [items, setItems] = useState<MediaAsset[]>([]);
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [q, setQ] = useState("");
  const [kindFilter, setKindFilter] = useState<"all" | "image" | "video">("all");
  const [selected, setSelected] = useState<MediaAsset | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("media_assets")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    const rows = (data ?? []) as MediaAsset[];
    setItems(rows);
    // Sign URLs in batch
    if (rows.length) {
      const { data: signed } = await supabase.storage
        .from(BUCKET)
        .createSignedUrls(rows.map((r) => r.storage_path), SIGNED_TTL);
      const map: Record<string, string> = {};
      signed?.forEach((s, i) => {
        if (s.signedUrl) map[rows[i].id] = s.signedUrl;
      });
      setUrls(map);
    } else {
      setUrls({});
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const onUpload = async (files: FileList | null) => {
    if (!files || !files.length) return;
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    setUploading(true);
    setProgress({ done: 0, total: files.length });
    let done = 0;
    for (const file of Array.from(files)) {
      const kind: "image" | "video" = file.type.startsWith("video/")
        ? "video"
        : "image";
      const ext = file.name.split(".").pop() || "bin";
      const path = `${u.user.id}/${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}.${ext}`;
      // dimensions for images
      let width: number | null = null;
      let height: number | null = null;
      if (kind === "image" && file.type !== "image/svg+xml") {
        try {
          const dims = await new Promise<{ w: number; h: number }>((res, rej) => {
            const img = new Image();
            img.onload = () => res({ w: img.naturalWidth, h: img.naturalHeight });
            img.onerror = rej;
            img.src = URL.createObjectURL(file);
          });
          width = dims.w;
          height = dims.h;
        } catch {}
      }
      const up = await supabase.storage.from(BUCKET).upload(path, file, {
        cacheControl: "31536000",
        contentType: file.type || undefined,
      });
      if (up.error) {
        toast.error(`${file.name}: ${up.error.message}`);
        done++;
        setProgress({ done, total: files.length });
        continue;
      }
      const ins = await supabase.from("media_assets").insert({
        name: file.name,
        storage_path: path,
        kind,
        mime_type: file.type || "application/octet-stream",
        size_bytes: file.size,
        width,
        height,
        uploaded_by: u.user.id,
      });
      if (ins.error) toast.error(`${file.name}: ${ins.error.message}`);
      done++;
      setProgress({ done, total: files.length });
    }
    setUploading(false);
    setProgress(null);
    if (fileRef.current) fileRef.current.value = "";
    toast.success("Upload complete");
    load();
  };

  const remove = async (item: MediaAsset) => {
    if (!confirm(`Delete "${item.name}"? This cannot be undone.`)) return;
    const { error: sErr } = await supabase.storage
      .from(BUCKET)
      .remove([item.storage_path]);
    if (sErr) toast.error(sErr.message);
    const { error } = await supabase.from("media_assets").delete().eq("id", item.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Deleted");
    setSelected(null);
    load();
  };

  const copyUrl = async (item: MediaAsset) => {
    const url = urls[item.id];
    if (!url) return;
    await navigator.clipboard.writeText(url);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 1200);
    toast.success("URL copied — paste into a blog post or portfolio item");
  };

  const addTag = async () => {
    if (!selected || !tagInput.trim()) return;
    const t = tagInput.trim().toLowerCase();
    if (selected.tags.includes(t)) {
      setTagInput("");
      return;
    }
    const newTags = [...selected.tags, t];
    const { error } = await supabase
      .from("media_assets")
      .update({ tags: newTags })
      .eq("id", selected.id);
    if (error) return toast.error(error.message);
    setSelected({ ...selected, tags: newTags });
    setItems((prev) =>
      prev.map((i) => (i.id === selected.id ? { ...i, tags: newTags } : i)),
    );
    setTagInput("");
  };

  const removeTag = async (t: string) => {
    if (!selected) return;
    const newTags = selected.tags.filter((x) => x !== t);
    const { error } = await supabase
      .from("media_assets")
      .update({ tags: newTags })
      .eq("id", selected.id);
    if (error) return toast.error(error.message);
    setSelected({ ...selected, tags: newTags });
    setItems((prev) =>
      prev.map((i) => (i.id === selected.id ? { ...i, tags: newTags } : i)),
    );
  };

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return items.filter((i) => {
      if (kindFilter !== "all" && i.kind !== kindFilter) return false;
      if (!needle) return true;
      return (
        i.name.toLowerCase().includes(needle) ||
        i.tags.some((t) => t.includes(needle))
      );
    });
  }, [items, q, kindFilter]);

  const counts = useMemo(() => {
    const total = items.length;
    const images = items.filter((i) => i.kind === "image").length;
    const videos = total - images;
    const size = items.reduce((acc, i) => acc + (i.size_bytes || 0), 0);
    return { total, images, videos, size };
  }, [items]);

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="grid grid-cols-2 gap-3 md:flex md:gap-6">
          <Stat label="Files" value={counts.total} />
          <Stat label="Images" value={counts.images} />
          <Stat label="Videos" value={counts.videos} />
          <Stat label="Storage" value={formatBytes(counts.size)} />
        </div>
        <div className="flex items-center gap-2">
          <input
            ref={fileRef}
            type="file"
            multiple
            accept="image/*,video/*"
            className="hidden"
            onChange={(e) => onUpload(e.target.files)}
          />
          <Button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="gap-2"
          >
            <Upload className="h-4 w-4" />
            {uploading
              ? `Uploading ${progress?.done}/${progress?.total}…`
              : "Upload media"}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="flex flex-col gap-3 p-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name or tag…"
            className="pl-9"
          />
        </div>
        <Select value={kindFilter} onValueChange={(v) => setKindFilter(v as typeof kindFilter)}>
          <SelectTrigger className="md:w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="image">Images</SelectItem>
            <SelectItem value="video">Videos</SelectItem>
          </SelectContent>
        </Select>
      </Card>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="aspect-square animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="flex flex-col items-center justify-center gap-3 p-12 text-center">
          <ImageIcon className="h-10 w-10 text-muted-foreground" />
          <p className="font-display text-lg">No media yet</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Upload images and videos here, then copy their URLs into portfolio
            items and blog posts.
          </p>
          <Button onClick={() => fileRef.current?.click()} className="gap-2">
            <Upload className="h-4 w-4" /> Upload your first file
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {filtered.map((item) => {
            const url = urls[item.id];
            return (
              <button
                key={item.id}
                onClick={() => setSelected(item)}
                className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-muted text-left transition-shadow hover:shadow-lg"
              >
                {item.kind === "image" && url ? (
                  <img
                    src={url}
                    alt={item.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : item.kind === "video" && url ? (
                  <video
                    src={url}
                    className="h-full w-full object-cover"
                    muted
                    playsInline
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    {item.kind === "image" ? (
                      <ImageIcon className="h-8 w-8" />
                    ) : (
                      <Film className="h-8 w-8" />
                    )}
                  </div>
                )}
                <div className="absolute left-2 top-2 flex gap-1">
                  <Badge variant="secondary" className="h-5 px-1.5 text-[10px] uppercase">
                    {item.kind}
                  </Badge>
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <p className="truncate text-xs text-white">{item.name}</p>
                  <p className="text-[10px] text-white/70">
                    {formatBytes(item.size_bytes)}
                    {item.width ? ` · ${item.width}×${item.height}` : ""}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Detail dialog */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-4xl">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="truncate">{selected.name}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 md:grid-cols-[1fr_280px]">
                <div className="flex items-center justify-center overflow-hidden rounded-lg bg-muted">
                  {selected.kind === "image" ? (
                    <img
                      src={urls[selected.id]}
                      alt={selected.name}
                      className="max-h-[60vh] w-full object-contain"
                    />
                  ) : (
                    <video
                      src={urls[selected.id]}
                      controls
                      className="max-h-[60vh] w-full"
                    />
                  )}
                </div>
                <div className="space-y-4">
                  <div className="space-y-1 text-sm">
                    <Row label="Type" value={selected.mime_type} />
                    <Row label="Size" value={formatBytes(selected.size_bytes)} />
                    {selected.width && (
                      <Row
                        label="Dimensions"
                        value={`${selected.width} × ${selected.height}`}
                      />
                    )}
                    <Row
                      label="Uploaded"
                      value={new Date(selected.created_at).toLocaleString()}
                    />
                  </div>

                  <div>
                    <p className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      <TagIcon className="h-3 w-3" /> Tags
                    </p>
                    <div className="mb-2 flex flex-wrap gap-1">
                      {selected.tags.length === 0 && (
                        <span className="text-xs text-muted-foreground">
                          No tags yet
                        </span>
                      )}
                      {selected.tags.map((t) => (
                        <Badge key={t} variant="secondary" className="gap-1">
                          {t}
                          <button
                            onClick={() => removeTag(t)}
                            className="ml-0.5 rounded-full hover:bg-background"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addTag();
                          }
                        }}
                        placeholder="Add tag…"
                        className="h-9"
                      />
                      <Button size="sm" onClick={addTag} variant="outline">
                        Add
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button
                      onClick={() => copyUrl(selected)}
                      variant="default"
                      className="w-full gap-2"
                    >
                      {copiedId === selected.id ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                      Copy URL
                    </Button>
                    <Button
                      onClick={() => remove(selected)}
                      variant="destructive"
                      className="w-full gap-2"
                    >
                      <Trash2 className="h-4 w-4" /> Delete
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="font-display text-xl">{value}</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="truncate text-right">{value}</span>
    </div>
  );
}
