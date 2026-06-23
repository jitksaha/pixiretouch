import { cn } from "@/lib/utils";
import { BRAND } from "@/content/site";
import logoAsset from "@/assets/pixi-retouch-logo.png.asset.json";

type Variant = "light" | "dark";
type Size = "sm" | "md" | "lg";

const SIZE = {
  sm: "h-7",
  md: "h-9",
  lg: "h-12",
} as const;

export function Logo({
  variant = "light",
  size = "md",
  className,
}: {
  variant?: Variant;
  size?: Size;
  withWordmark?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn("inline-flex items-center", className)}
      aria-label={BRAND.name}
    >
      <img
        src={logoAsset.url}
        alt={BRAND.name}
        className={cn(
          SIZE[size],
          "w-auto object-contain",
          variant === "dark" && "brightness-110"
        )}
      />
    </span>
  );
}
