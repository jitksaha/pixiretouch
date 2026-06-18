import { useState } from "react";
import { z } from "zod";
import { Link } from "@tanstack/react-router";
import { Check, ArrowRight, ArrowLeft, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { QUOTE_SERVICES, TURNAROUNDS } from "@/content/site";
import { cn } from "@/lib/utils";

const schema = z.object({
  service: z.string().min(1, "Pick a service"),
  quantity: z.coerce.number().int().positive().max(100000),
  turnaround: z.string().min(1),
  name: z.string().trim().min(2, "Tell us your name").max(100),
  email: z.string().trim().email("A valid email please").max(255),
  company: z.string().trim().max(120).optional(),
  notes: z.string().trim().max(2000).optional(),
});

type Form = Partial<z.infer<typeof schema>>;

const STEPS = ["Service", "Volume", "Files", "Contact", "Done"] as const;

export function QuoteWizard({ initialService }: { initialService?: string }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Form>({ service: initialService, turnaround: "standard" });
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }));

  const next = () => {
    const fieldsByStep: Record<number, (keyof Form)[]> = {
      0: ["service"],
      1: ["quantity", "turnaround"],
      2: [],
      3: ["name", "email"],
    };
    const fields = fieldsByStep[step] ?? [];
    const partial = schema.partial().safeParse(form);
    if (!partial.success) {
      const e: Record<string, string> = {};
      partial.error.issues.forEach((i) => { e[i.path[0] as string] = i.message; });
      setErrors(e);
      const has = fields.some((f) => e[f as string]);
      if (has) return;
    }
    setErrors({});
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
  };

  const back = () => setStep((s) => Math.max(0, s - 1));

  const submit = () => {
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const e: Record<string, string> = {};
      parsed.error.issues.forEach((i) => { e[i.path[0] as string] = i.message; });
      setErrors(e);
      return;
    }
    // Frontend-only for now — surface a success state. Wire to backend later.
    setSubmitted(true);
    setStep(STEPS.length - 1);
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-soft md:p-10">
      {/* Stepper */}
      <ol className="mb-8 flex flex-wrap items-center gap-3 text-xs uppercase tracking-wider">
        {STEPS.map((label, i) => (
          <li key={label} className="flex items-center gap-3">
            <span
              className={cn(
                "grid h-6 w-6 place-items-center rounded-full border text-[11px]",
                i < step && "border-primary bg-primary text-primary-foreground",
                i === step && "border-foreground bg-foreground text-background",
                i > step && "border-border text-muted-foreground"
              )}
            >
              {i < step ? <Check className="h-3 w-3" /> : i + 1}
            </span>
            <span className={cn("text-muted-foreground", i === step && "text-foreground")}>{label}</span>
            {i < STEPS.length - 1 && <span className="h-px w-6 bg-border" />}
          </li>
        ))}
      </ol>

      {step === 0 && (
        <Step title="Which service do you need?" sub="Pick the closest match — you can add notes later.">
          <div className="grid gap-2 sm:grid-cols-2">
            {QUOTE_SERVICES.map((s) => (
              <button
                key={s.value}
                onClick={() => { set("service", s.value); }}
                className={cn(
                  "rounded-lg border border-border px-4 py-3 text-left text-sm transition hover:border-foreground",
                  form.service === s.value && "border-foreground bg-muted"
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
          {errors.service && <Err>{errors.service}</Err>}
        </Step>
      )}

      {step === 1 && (
        <Step title="Volume and turnaround" sub="Rough numbers are fine — we'll firm up the quote.">
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Number of images" error={errors.quantity}>
              <Input type="number" min={1} value={form.quantity ?? ""} onChange={(e) => set("quantity", Number(e.target.value) as Form["quantity"])} />
            </Field>
            <Field label="Turnaround">
              <div className="space-y-2">
                {TURNAROUNDS.map((t) => (
                  <label key={t.value} className={cn("flex cursor-pointer items-center gap-3 rounded-lg border border-border px-3 py-2 text-sm hover:border-foreground", form.turnaround === t.value && "border-foreground bg-muted")}>
                    <input type="radio" name="turnaround" value={t.value} checked={form.turnaround === t.value} onChange={() => set("turnaround", t.value)} className="accent-foreground" />
                    <span>{t.label}</span>
                  </label>
                ))}
              </div>
            </Field>
          </div>
        </Step>
      )}

      {step === 2 && (
        <Step title="Add sample files (optional)" sub="Up to 5 images, max 20MB each. You can also send a link in the notes field.">
          <label className="block cursor-pointer rounded-xl border-2 border-dashed border-border bg-muted/30 px-6 py-10 text-center hover:border-foreground">
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const next = Array.from(e.target.files ?? []).slice(0, 5);
                setFiles(next);
              }}
            />
            <Upload className="mx-auto h-6 w-6 text-muted-foreground" />
            <div className="mt-3 text-sm font-medium">Drop images or click to browse</div>
            <div className="text-xs text-muted-foreground">JPG, PNG, TIFF, PSD</div>
          </label>
          {files.length > 0 && (
            <ul className="mt-4 space-y-2">
              {files.map((f, i) => (
                <li key={i} className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm">
                  <span className="truncate">{f.name}</span>
                  <button onClick={() => setFiles(files.filter((_, idx) => idx !== i))} aria-label={`Remove ${f.name}`} className="text-muted-foreground hover:text-foreground">
                    <X className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Step>
      )}

      {step === 3 && (
        <Step title="How can we reach you?" sub="We reply within 45 minutes during working hours.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name" error={errors.name}>
              <Input value={form.name ?? ""} onChange={(e) => set("name", e.target.value)} placeholder="Jane Doe" />
            </Field>
            <Field label="Work email" error={errors.email}>
              <Input type="email" value={form.email ?? ""} onChange={(e) => set("email", e.target.value)} placeholder="jane@brand.com" />
            </Field>
            <Field label="Company" error={errors.company}>
              <Input value={form.company ?? ""} onChange={(e) => set("company", e.target.value)} placeholder="Brand name" />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Notes (optional)">
                <Textarea rows={4} value={form.notes ?? ""} onChange={(e) => set("notes", e.target.value)} placeholder="Anything we should know about the batch, brand style or sample links." />
              </Field>
            </div>
          </div>
        </Step>
      )}

      {step === 4 && (
        <div className="py-8 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary">
            <Check className="h-6 w-6" />
          </div>
          <h3 className="mt-5 font-display text-2xl">{submitted ? "Quote requested" : "All set"}</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Thanks {form.name?.split(" ")[0] ?? ""}. We'll reply to {form.email} within 45 minutes during working hours with a per-image rate and turnaround.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button asChild variant="outline"><Link to="/">Back to home</Link></Button>
            <Button asChild><Link to="/portfolio">See our work</Link></Button>
          </div>
        </div>
      )}

      {step < 4 && (
        <div className="mt-8 flex items-center justify-between">
          <Button variant="ghost" onClick={back} disabled={step === 0}>
            <ArrowLeft className="mr-1 h-4 w-4" /> Back
          </Button>
          {step < 3 ? (
            <Button onClick={next}>Continue <ArrowRight className="ml-1 h-4 w-4" /></Button>
          ) : (
            <Button onClick={submit}>Request quote <ArrowRight className="ml-1 h-4 w-4" /></Button>
          )}
        </div>
      )}
    </div>
  );
}

function Step({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl md:text-3xl">{title}</h2>
        {sub && <p className="mt-2 text-sm text-muted-foreground">{sub}</p>}
      </div>
      {children}
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="text-xs uppercase tracking-wider text-muted-foreground">{label}</Label>
      {children}
      {error && <Err>{error}</Err>}
    </div>
  );
}

function Err({ children }: { children: React.ReactNode }) {
  return <p className="text-xs text-destructive">{children}</p>;
}
