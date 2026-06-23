import { useState, type ReactNode } from "react";
import { z } from "zod";
import { ArrowLeft, ArrowRight, Check, HelpCircle, Upload } from "lucide-react";
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

type Form = {
  service: string;
  turnaround: string;
  volume: string;
  notes: string;
  name: string;
  email: string;
  company: string;
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

export function TrialDialog({
  children,
  defaultService,
  title = "Start your free trial",
  description = "Send up to 2 sample images. We'll edit them free of charge so you can judge quality.",
}: {
  children: ReactNode;
  defaultService?: string;
  title?: string;
  description?: string;
}) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState<Form>({ ...empty, service: defaultService ?? "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const reset = () => {
    setStep(0);
    setDone(false);
    setErrors({});
    setForm({ ...empty, service: defaultService ?? "" });
  };

  const set = <K extends keyof Form>(k: K, v: Form[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

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
      setDone(true);
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
              <DialogTitle className="font-display text-2xl">Trial request received</DialogTitle>
              <DialogDescription className="mt-2">
                A producer will email <span className="text-foreground font-medium">{form.email}</span> within 45 minutes with upload instructions for your 2 free trial images.
              </DialogDescription>
            </DialogHeader>
            <Button className="mt-6 w-full" onClick={() => setOpen(false)}>
              Close
            </Button>
          </div>
        ) : (
          <>
            <div className="border-b border-border p-6">
              <DialogHeader>
                <DialogTitle className="font-display text-2xl">{title}</DialogTitle>
                <DialogDescription>{description}</DialogDescription>
              </DialogHeader>

              <div className="mt-5 flex items-center gap-2">
                {STEPS.map((label, i) => (
                  <div key={label} className="flex flex-1 items-center gap-2">
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
                        "text-xs uppercase tracking-wider",
                        i === step ? "text-foreground" : "text-muted-foreground",
                      )}
                    >
                      {label}
                    </span>
                    {i < STEPS.length - 1 && (
                      <div className="ml-1 h-px flex-1 bg-border" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="px-6 py-6 space-y-5">
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

                  <div className="flex items-center gap-2 rounded-md border border-dashed border-border bg-muted/40 px-3 py-3 text-xs text-muted-foreground">
                    <Upload className="h-4 w-4" />
                    You can attach the 2 trial images by reply once we email you.
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
                      value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                    />
                    {errors.email && (
                      <p className="text-xs text-destructive">{errors.email}</p>
                    )}
                  </div>

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
                  {FAQS.slice(0, 5).map((faq, i) => (
                    <AccordionItem key={i} value={`faq-${i}`} className="px-4 border-border">
                      <AccordionTrigger className="text-xs font-medium py-2.5">{faq.q}</AccordionTrigger>
                      <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-border bg-muted/30 px-6 py-4">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={back}
                disabled={step === 0}
              >
                <ArrowLeft className="mr-1 h-4 w-4" /> Back
              </Button>
              <div className="text-xs text-muted-foreground">
                Step {step + 1} of {STEPS.length}
              </div>
              <Button type="button" size="sm" onClick={next}>
                {step === STEPS.length - 1 ? "Submit" : "Continue"}
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
