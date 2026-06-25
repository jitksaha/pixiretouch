import { useRef, useState, type ReactNode } from "react";
import { z } from "zod";
import { ArrowLeft, ArrowRight, Check, HelpCircle, Loader2, Paperclip, Upload, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { QUOTE_SERVICES, TURNAROUNDS, FAQS } from "@/content/site";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Form = {
  service: string;
  turnaround: string;
  volume: string;
  notes: string;
  name: string;
  email: string;
  company: string;
};

type Attachment = {
  id: string;
  name: string;
  size: number;
  path: string;
  progress: number; // 0-100
  status: "uploading" | "done" | "error";
  error?: string;
};

const empty: Form = {
  service: "",
  turnaround: "standard",
  volume: "1-10",
  notes: "",
  name: "",
  email: "",
  company: "",
};

const VOLUMES = [
  { value: "1-10", label: "1 – 10 images" },
  { value: "10-100", label: "10 – 100" },
  { value: "100-1000", label: "100 – 1,000" },
  { value: "1000+", label: "1,000+ / ongoing" },
];

const MAX_FILE_MB = 25;
const MAX_FILES = 10;

const stepSchemas = [
  z.object({ service: z.string().min(1, "Choose a service"), turnaround: z.string().min(1) }),
  z.object({ volume: z.string().min(1), notes: z.string().max(1000).optional().default("") }),
  z.object({
    name: z.string().trim().min(2, "Your name is required").max(100),
    email: z.string().trim().email("Enter a valid email").max(255),
    company: z.string().max(120).optional().default(""),
  }),
];

const STEPS = ["Project", "Volume", "Contact"] as const;

function slugifyName(n: string) {
  return n.replace(/[^a-zA-Z0-9._-]+/g, "-").slice(-80);
}

export function TrialDialog({
  children,
  defaultService,
  defaultVolume,
  defaultTurnaround,
  defaultNotes,
  title = "Start your free trial",
  description = "Send up to 2 sample images. We'll edit them free of charge so you can judge quality.",
}: {
  children: ReactNode;
  defaultService?: string;
  defaultVolume?: string;
  defaultTurnaround?: string;
  defaultNotes?: string;
  title?: string;
  description?: string;
}) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<Form>({
    ...empty,
    service: defaultService ?? "",
    volume: defaultVolume ?? empty.volume,
    turnaround: defaultTurnaround ?? empty.turnaround,
    notes: defaultNotes ?? "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const reset = () => {
    setStep(0);
    setDone(false);
    setErrors({});
    setAttachments([]);
    setSubmitting(false);
    setUploading(false);
    setForm({
      ...empty,
      service: defaultService ?? "",
      volume: defaultVolume ?? empty.volume,
      turnaround: defaultTurnaround ?? empty.turnaround,
      notes: defaultNotes ?? "",
    });
  };

  const set = <K extends keyof Form>(k: K, v: Form[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const uploadOne = (file: File, id: string, path: string) =>
    new Promise<void>((resolve) => {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/media/${path}`;
      const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;
      const xhr = new XMLHttpRequest();
      xhr.open("POST", url, true);
      xhr.setRequestHeader("apikey", key);
      xhr.setRequestHeader("Authorization", `Bearer ${key}`);
      xhr.setRequestHeader("x-upsert", "false");
      xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");
      xhr.upload.onprogress = (e) => {
        if (!e.lengthComputable) return;
        const pct = Math.round((e.loaded / e.total) * 100);
        setAttachments((arr) =>
          arr.map((a) => (a.id === id ? { ...a, progress: pct } : a)),
        );
      };
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          setAttachments((arr) =>
            arr.map((a) =>
              a.id === id ? { ...a, progress: 100, status: "done" } : a,
            ),
          );
        } else {
          setAttachments((arr) =>
            arr.map((a) =>
              a.id === id ? { ...a, status: "error", error: `HTTP ${xhr.status}` } : a,
            ),
          );
        }
        resolve();
      };
      xhr.onerror = () => {
        setAttachments((arr) =>
          arr.map((a) =>
            a.id === id ? { ...a, status: "error", error: "Network error" } : a,
          ),
        );
        resolve();
      };
      xhr.send(file);
    });

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const incoming = Array.from(files);
    if (attachments.length + incoming.length > MAX_FILES) {
      toast.error(`Up to ${MAX_FILES} files per request.`);
      return;
    }
    setUploading(true);
    const folder = `quote-uploads/${crypto.randomUUID()}`;
    const queued: Attachment[] = [];
    for (const file of incoming) {
      if (file.size > MAX_FILE_MB * 1024 * 1024) {
        toast.error(`${file.name} exceeds ${MAX_FILE_MB} MB.`);
        continue;
      }
      queued.push({
        id: crypto.randomUUID(),
        name: file.name,
        size: file.size,
        path: `${folder}/${Date.now()}-${slugifyName(file.name)}`,
        progress: 0,
        status: "uploading",
      });
    }
    if (queued.length === 0) {
      setUploading(false);
      return;
    }
    setAttachments((a) => [...a, ...queued]);
    await Promise.all(
      queued.map((q, i) => uploadOne(incoming[i], q.id, q.path)),
    );
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeAttachment = async (id: string) => {
    const att = attachments.find((a) => a.id === id);
    if (!att) return;
    setAttachments((a) => a.filter((x) => x.id !== id));
    if (att.status === "done") {
      await supabase.storage.from("media").remove([att.path]);
    }
  };

  const submit = async () => {
    setSubmitting(true);
    const { error } = await supabase.from("quote_requests").insert({
      name: form.name,
      email: form.email,
      service: form.service,
      quantity: form.volume,
      turnaround: form.turnaround,
      message: [form.notes, form.company ? `Company: ${form.company}` : ""]
        .filter(Boolean)
        .join("\n\n"),
      attachments: attachments.map((a) => a.path),
    });
    setSubmitting(false);
    if (error) {
      toast.error("Could not submit. Please try again.");
      return;
    }
    setDone(true);
  };

  const next = () => {
    const parsed = stepSchemas[step].safeParse(form);
    if (!parsed.success) {
      const er: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        er[i.path[0] as string] = i.message;
      });
      setErrors(er);
      return;
    }
    setErrors({});
    if (step === STEPS.length - 1) {
      void submit();
    } else {
      setStep((s) => s + 1);
    }
  };

  const back = () => {
    setErrors({});
    setStep((s) => Math.max(0, s - 1));
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) setTimeout(reset, 250);
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[560px] p-0 rounded-2xl shadow-2xl border-border/60 max-h-[calc(100vh-5rem)] flex flex-col overflow-hidden">
        {done ? (
          <div className="p-8 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary">
              <Check className="h-7 w-7" />
            </div>
            <DialogHeader className="mt-5">
              <DialogTitle className="font-display text-2xl">Request received</DialogTitle>
              <DialogDescription className="mt-2">
                A producer will email <span className="text-foreground font-medium">{form.email}</span> within 45 minutes
                {attachments.length > 0 ? ` — we've received your ${attachments.length} file${attachments.length > 1 ? "s" : ""}.` : "."}
              </DialogDescription>
            </DialogHeader>
            <Button className="mt-6 w-full" onClick={() => setOpen(false)}>
              Close
            </Button>
          </div>
        ) : (
          <>
            <div className="border-b border-border px-6 pt-6 pb-4 shrink-0">
              <DialogHeader>
                <DialogTitle className="font-display text-2xl">{title}</DialogTitle>
                <DialogDescription>{description}</DialogDescription>
              </DialogHeader>

              <div className="mt-5 flex items-center w-full">
                {STEPS.map((label, i) => (
                  <div key={label} className={cn("flex items-center min-w-0", i < STEPS.length - 1 ? "flex-1" : "flex-none")}>
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className={cn(
                          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-medium",
                          i < step && "border-primary bg-primary text-primary-foreground",
                          i === step && "border-foreground bg-foreground text-background",
                          i > step && "border-border text-muted-foreground",
                        )}
                      >
                        {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
                      </div>
                      <span
                        className={cn(
                          "text-xs uppercase tracking-wider truncate",
                          i === step ? "text-foreground" : "text-muted-foreground",
                        )}
                      >
                        {label}
                      </span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className="mx-3 h-px flex-1 bg-border" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="px-6 py-5 space-y-4 overflow-y-auto flex-1 min-h-0">
              {step === 0 && (
                <>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                      Primary service
                    </Label>
                    <Select value={form.service} onValueChange={(v) => set("service", v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        {QUOTE_SERVICES.map((s) => (
                          <SelectItem key={s.value} value={s.value}>
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.service && (
                      <p className="text-xs text-destructive">{errors.service}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                      Turnaround
                    </Label>
                    <RadioGroup
                      value={form.turnaround}
                      onValueChange={(v) => set("turnaround", v)}
                      className="grid grid-cols-2 gap-2"
                    >
                      {TURNAROUNDS.map((t) => (
                        <label
                          key={t.value}
                          htmlFor={`tr-${t.value}`}
                          className={cn(
                            "flex cursor-pointer items-center gap-2 rounded-md border p-3 text-sm transition-colors",
                            form.turnaround === t.value
                              ? "border-foreground bg-muted"
                              : "border-border hover:bg-muted/50",
                          )}
                        >
                          <RadioGroupItem id={`tr-${t.value}`} value={t.value} />
                          <span>{t.label}</span>
                        </label>
                      ))}
                    </RadioGroup>
                  </div>
                </>
              )}

              {step === 1 && (
                <>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                      Monthly volume
                    </Label>
                    <RadioGroup
                      value={form.volume}
                      onValueChange={(v) => set("volume", v)}
                      className="grid grid-cols-2 gap-2"
                    >
                      {VOLUMES.map((v) => (
                        <label
                          key={v.value}
                          htmlFor={`vol-${v.value}`}
                          className={cn(
                            "flex cursor-pointer items-center gap-2 rounded-md border p-3 text-sm transition-colors",
                            form.volume === v.value
                              ? "border-foreground bg-muted"
                              : "border-border hover:bg-muted/50",
                          )}
                        >
                          <RadioGroupItem id={`vol-${v.value}`} value={v.value} />
                          <span>{v.label}</span>
                        </label>
                      ))}
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                      Project notes
                    </Label>
                    <Textarea
                      rows={4}
                      placeholder="Reference links, brand style, background preferences, deadlines…"
                      value={form.notes}
                      onChange={(e) => set("notes", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                      Attach sample images <span className="opacity-60">(optional)</span>
                    </Label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*,.psd,.tif,.tiff,.pdf,.zip"
                      className="hidden"
                      onChange={(e) => void handleFiles(e.target.files)}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading || attachments.length >= MAX_FILES}
                      className="flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-border bg-muted/40 px-3 py-4 text-sm text-muted-foreground transition-colors hover:border-foreground hover:bg-muted disabled:opacity-50"
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" /> Uploading…
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4" />
                          <span>
                            Click to upload <span className="text-foreground font-medium">single or multiple files</span>
                          </span>
                        </>
                      )}
                    </button>
                    <p className="text-[11px] text-muted-foreground">
                      Up to {MAX_FILES} files · max {MAX_FILE_MB} MB each · JPG, PNG, PSD, TIFF, PDF, ZIP
                    </p>

                    {attachments.length > 0 && (
                      <ul className="space-y-1.5">
                        {attachments.map((a, i) => (
                          <li
                            key={a.path}
                            className="flex items-center justify-between gap-2 rounded-md border border-border bg-background px-3 py-2 text-xs"
                          >
                            <div className="flex min-w-0 items-center gap-2">
                              <Paperclip className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                              <span className="truncate">{a.name}</span>
                              <span className="shrink-0 text-muted-foreground">
                                {(a.size / 1024 / 1024).toFixed(2)} MB
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => void removeAttachment(i)}
                              className="text-muted-foreground hover:text-destructive"
                              aria-label={`Remove ${a.name}`}
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="t-name" className="text-xs uppercase tracking-wider text-muted-foreground">
                        Name
                      </Label>
                      <Input
                        id="t-name"
                        placeholder="Jane Doe"
                        value={form.name}
                        onChange={(e) => set("name", e.target.value)}
                      />

                      {errors.name && (
                        <p className="text-xs text-destructive">{errors.name}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="t-company" className="text-xs uppercase tracking-wider text-muted-foreground">
                        Company <span className="opacity-60">(optional)</span>
                      </Label>
                      <Input
                        id="t-company"
                        placeholder="Acme Studio"
                        value={form.company}
                        onChange={(e) => set("company", e.target.value)}
                      />

                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="t-email" className="text-xs uppercase tracking-wider text-muted-foreground">
                      Work email
                    </Label>
                    <Input
                      id="t-email"
                      type="email"
                      placeholder="you@company.com"
                      value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                    />

                    {errors.email && (
                      <p className="text-xs text-destructive">{errors.email}</p>
                    )}
                  </div>

                  {attachments.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      <Paperclip className="mr-1 inline h-3 w-3" />
                      {attachments.length} file{attachments.length > 1 ? "s" : ""} will be sent with this request.
                    </p>
                  )}

              <p className="text-xs text-muted-foreground">
                    No card. No commitment. We reply within 45 minutes during working hours.
                  </p>
                </>
              )}

              <div className="pt-2">
                <Accordion type="single" collapsible className="rounded-xl border border-border bg-muted/30">
                  <div className="flex items-center gap-2 px-4 pt-3 pb-1">
                    <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Common questions
                    </span>
                  </div>
                  {FAQS.slice(step * 2, step * 2 + 2).map((faq, i) => (
                    <AccordionItem key={i} value={`faq-${step}-${i}`} className="px-4 border-border">
                      <AccordionTrigger className="text-xs font-medium py-2.5">{faq.q}</AccordionTrigger>
                      <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-border bg-muted/30 px-6 py-4 shrink-0">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={back}
                disabled={step === 0 || submitting}
              >
                <ArrowLeft className="mr-1 h-4 w-4" /> Back
              </Button>
              <div className="text-xs text-muted-foreground">
                Step {step + 1} of {STEPS.length}
              </div>
              <Button type="button" size="sm" onClick={next} disabled={submitting || uploading}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-1 h-4 w-4 animate-spin" /> Submitting…
                  </>
                ) : (
                  <>
                    {step === STEPS.length - 1 ? "Submit" : "Continue"}
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
