import { cn } from "@/lib/utils";
import { BRAND } from "@/content/site";

type Variant = "light" | "dark";
type Size = "sm" | "md" | "lg";

const SIZE = {
  sm: { mark: "h-7 w-7", text: "text-base", gap: "gap-2" },
  md: { mark: "h-9 w-9", text: "text-lg", gap: "gap-2.5" },
  lg: { mark: "h-11 w-11", text: "text-2xl", gap: "gap-3" },
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
  const fg = isDark ? "text-ink-foreground" : "text-foreground";
  const subtle = isDark ? "text-ink-foreground/60" : "text-foreground/55";

  return (
    <span
      className={cn("inline-flex items-center", s.gap, className)}
      aria-label={BRAND.name}
    >
      <span className={cn("relative inline-block", s.mark, fg)} aria-hidden>
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full"
        >
          {/* aperture ring */}
          <circle
            cx="20"
            cy="20"
            r="17"
            stroke="currentColor"
            strokeWidth="2"
            strokeOpacity="0.9"
          />
          {/* inner geometric blades */}
          <path
            d="M20 6 L31 13 L31 27 L20 34 L9 27 L9 13 Z"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeOpacity="0.35"
            strokeLinejoin="round"
          />
          {/* center dot accent */}
          <circle cx="20" cy="20" r="3.5" fill="var(--primary)" />
          <circle cx="20" cy="20" r="1.25" fill="currentColor" />
        </svg>
      </span>
      {withWordmark && (
        <span
          className={cn(
            "font-display leading-none tracking-tight inline-flex items-baseline",
            s.text
          )}
        >
          <span className={cn("font-semibold", fg)}>pixi</span>
          <span className={cn("font-normal ml-1", subtle)}>retouch</span>
        </span>
      )}
    </span>
  );
}
