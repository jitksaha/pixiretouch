import { cn } from "@/lib/utils";
import { BRAND } from "@/content/site";

type Variant = "light" | "dark";
type Size = "sm" | "md" | "lg";

const SIZE = {
  sm: { mark: "h-7 w-7", dot: "h-1.5 w-1.5", text: "text-base", gap: "gap-2" },
  md: { mark: "h-9 w-9", dot: "h-2 w-2", text: "text-lg", gap: "gap-2.5" },
  lg: { mark: "h-11 w-11", dot: "h-2.5 w-2.5", text: "text-2xl", gap: "gap-3" },
} as const;

export function Logo({
  variant = "light",
  size = "md",
  withWordmark = true,
  className,
}: {
  variant?: Variant;
  size?: Size;
  withWordmark?: boolean;
  className?: string;
}) {
  const s = SIZE[size];
  const isDark = variant === "dark";

  return (
    <span className={cn("inline-flex items-center", s.gap, className)} aria-label={BRAND.name}>
      <span
        className={cn(
          "relative grid place-items-center rounded-[10px] ring-1 transition-colors",
          s.mark,
          isDark
            ? "bg-ink-foreground text-ink ring-white/15"
            : "bg-foreground text-background ring-black/5"
        )}
      >
        <span
          className={cn(
            "font-display font-medium leading-none",
            size === "lg" ? "text-xl" : size === "md" ? "text-base" : "text-sm"
          )}
        >
          P
        </span>
        <span
          className={cn(
            "absolute -right-0.5 -top-0.5 rounded-full ring-2",
            s.dot,
            "bg-primary",
            isDark ? "ring-ink" : "ring-background"
          )}
          aria-hidden
        />
      </span>
      {withWordmark && (
        <span
          className={cn(
            "font-display tracking-tight leading-none",
            s.text,
            isDark ? "text-ink-foreground" : "text-foreground"
          )}
        >
          Pixi<span className="text-primary">.</span>
          <span className="font-sans font-medium tracking-tight ml-0.5">Retouch</span>
        </span>
      )}
    </span>
  );
}
