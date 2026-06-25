import { Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type ZigzagRow = {
  slug: string;
  num: string;
  title: string;
  body: string;
  bullets: string[];
  before: string;
  after: string;
};

export function ServiceZigzag({ row, reverse }: { row: ZigzagRow; reverse?: boolean }) {
  return (
    <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
      <div className={cn("order-2", reverse ? "lg:order-2" : "lg:order-1")}>
        <span className="font-mono text-xs font-semibold tracking-[0.18em] text-primary">
          {row.num} · SERVICE
        </span>
        <h3 className="mt-3 font-display text-3xl leading-tight md:text-4xl lg:text-5xl">
          {row.title}
        </h3>
        <p className="mt-4 max-w-lg text-base text-muted-foreground md:text-lg">
          {row.body}
        </p>
        <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
          {row.bullets.map((b) => (
            <li key={b} className="flex items-start gap-2.5 text-sm">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
        <Link
          to="/services/$slug"
          params={{ slug: row.slug }}
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
        >
          Read more <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className={cn("order-1 grid grid-cols-2 gap-3", reverse ? "lg:order-1" : "lg:order-2")}>
        <Thumb label="Before" src={row.before} />
        <Thumb label="After" src={row.after} />
      </div>
    </div>
  );
}

function Thumb({ label, src }: { label: string; src: string }) {
  return (
    <figure className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
      <span className="absolute left-3 top-3 z-10 rounded-full bg-background/90 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-foreground backdrop-blur">
        {label}
      </span>
      <img
        src={src}
        alt={label}
        loading="lazy"
        decoding="async"
        className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
      />
    </figure>
  );
}
