import { useMemo, useState } from "react";
import { Calculator, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { TrialDialog } from "./TrialDialog";

type ServiceOpt = { slug: string; title: string; price: number };

const SERVICE_OPTS: ServiceOpt[] = [
  { slug: "clipping-path", title: "Clipping Path Service", price: 0.39 },
  { slug: "product-photo-retouching", title: "Retouching Service", price: 0.69 },
  { slug: "background-removal", title: "Background Remove", price: 0.39 },
  { slug: "shadow-creation", title: "Shadow Making", price: 0.39 },
  { slug: "ghost-mannequin", title: "Ghost Mannequin", price: 0.79 },
  { slug: "ecommerce-image-editing", title: "Ecommerce Image Edit", price: 0.39 },
];

// Map TrialDialog volume buckets from quantity
function volumeBucket(qty: number): string {
  if (qty <= 10) return "1-10";
  if (qty <= 100) return "10-100";
  if (qty <= 1000) return "100-1000";
  return "1000+";
}

// Volume discount tiers (multiplier on per-image price)
const VOLUME_TIERS: { min: number; mult: number; label: string }[] = [
  { min: 0, mult: 1.0, label: "Standard rate" },
  { min: 100, mult: 0.9, label: "10% off (100+)" },
  { min: 500, mult: 0.82, label: "18% off (500+)" },
  { min: 1000, mult: 0.72, label: "28% off (1,000+)" },
  { min: 5000, mult: 0.6, label: "40% off (5,000+)" },
];

const TURNAROUND_OPTS: {
  value: string;
  label: string;
  multiplier: number;
  trialValue: string;
}[] = [
  { value: "rush", label: "Rush — under 4 hours", multiplier: 1.35, trialValue: "rush" },
  { value: "standard", label: "Standard — 12–24 hours", multiplier: 1.0, trialValue: "standard" },
  { value: "bulk", label: "Bulk — 2–5 days", multiplier: 0.92, trialValue: "bulk" },
  { value: "flexible", label: "Flexible — best price", multiplier: 0.85, trialValue: "flexible" },
];

export function PricingCalculator() {
  const [serviceSlug, setServiceSlug] = useState(SERVICE_OPTS[0].slug);
  const [qty, setQty] = useState(50);
  const [turnaround, setTurnaround] = useState("standard");

  const service = SERVICE_OPTS.find((s) => s.slug === serviceSlug) ?? SERVICE_OPTS[0];
  const ta = TURNAROUND_OPTS.find((t) => t.value === turnaround) ?? TURNAROUND_OPTS[1];
  const tier = useMemo(
    () => [...VOLUME_TIERS].reverse().find((t) => qty >= t.min) ?? VOLUME_TIERS[0],
    [qty]
  );

  const perImage = service.price * tier.mult * ta.multiplier;
  const total = perImage * qty;
  const baseTotal = service.price * qty;
  const savings = Math.max(0, baseTotal - total);

  const fmt = (n: number) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD" });

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-lift">
      <div className="grid gap-0 md:grid-cols-[1.4fr_1fr]">
        {/* Inputs */}
        <div className="border-b border-border p-6 md:border-b-0 md:border-r md:p-8">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-primary/10 text-primary">
              <Calculator className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-display text-xl">Estimate your project</h3>
              <p className="text-xs text-muted-foreground">
                Instant per-image and total cost based on quantity + delivery.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-5">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                Service
              </Label>
              <Select value={serviceSlug} onValueChange={setServiceSlug}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SERVICE_OPTS.map((s) => (
                    <SelectItem key={s.slug} value={s.slug}>
                      {s.title} — from ${s.price.toFixed(2)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                  Quantity
                </Label>
                <Input
                  type="number"
                  min={1}
                  max={50000}
                  value={qty}
                  onChange={(e) =>
                    setQty(Math.max(1, Math.min(50000, Number(e.target.value) || 1)))
                  }
                  className="h-8 w-28 text-right"
                />
              </div>
              <Slider
                value={[qty]}
                min={1}
                max={5000}
                step={qty < 100 ? 1 : 10}
                onValueChange={(v) => setQty(v[0])}
              />
              <div className="flex justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
                <span>1</span>
                <span>500</span>
                <span>5,000+</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                Delivery time
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {TURNAROUND_OPTS.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setTurnaround(t.value)}
                    className={`rounded-md border p-2.5 text-left text-xs transition-colors ${
                      turnaround === t.value
                        ? "border-foreground bg-muted"
                        : "border-border hover:bg-muted/50"
                    }`}
                  >
                    <div className="font-medium">{t.label.split(" — ")[0]}</div>
                    <div className="text-[11px] text-muted-foreground">
                      {t.label.split(" — ")[1]}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Output */}
        <div className="bg-foreground p-6 text-background md:p-8">
          <p className="text-xs uppercase tracking-[0.18em] text-background/60">
            Estimated total
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-5xl md:text-6xl">{fmt(total)}</span>
          </div>
          <p className="mt-1 text-sm text-background/70">
            {fmt(perImage)} per image · {qty.toLocaleString()} images
          </p>

          <div className="mt-6 space-y-3 text-sm">
            <Row label="Base rate" value={`${fmt(service.price)} / image`} />
            <Row label="Volume tier" value={tier.label} />
            <Row label="Delivery" value={ta.label.split(" — ")[0]} />
            {savings > 0 && (
              <Row
                label="You save"
                value={fmt(savings)}
                accent
              />
            )}
          </div>

          <div className="mt-7 flex flex-col gap-2">
            <TrialDialog
              defaultService={service.slug}
              defaultVolume={volumeBucket(qty)}
              defaultTurnaround={ta.trialValue}
              defaultNotes={`Estimate: ${qty} × ${service.title} @ ${fmt(
                perImage
              )} = ${fmt(total)} (${ta.label}).`}
              title={`${service.title} — Get a firm quote`}
              description="We'll confirm this estimate in writing within 45 minutes."
            >
              <Button variant="secondary" className="w-full">
                <Sparkles className="mr-1.5 h-4 w-4" />
                Get this quote
              </Button>
            </TrialDialog>
            <p className="text-center text-[11px] text-background/60">
              Estimates only — final price depends on complexity. No card needed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-t border-background/15 pt-3">
      <span className="text-background/60">{label}</span>
      <span className={accent ? "font-medium text-primary" : "font-medium"}>
        {value}
      </span>
    </div>
  );
}
