import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function Container({
  children,
  className,
  size = "default",
}: {
  children: ReactNode;
  className?: string;
  size?: "default" | "narrow" | "wide";
}) {
  const sizes = {
    default: "max-w-7xl",
    narrow: "max-w-3xl",
    wide: "max-w-[88rem]",
  };
  return (
    <div className={cn("container-px mx-auto w-full", sizes[size], className)}>
      {children}
    </div>
  );
}

export function Section({
  children,
  className,
  ink = false,
  id,
}: {
  children: ReactNode;
  className?: string;
  ink?: boolean;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "py-20 md:py-28",
        ink && "ink-section",
        className
      )}
    >
      {children}
    </section>
  );
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground", className)}>
      <span className="inline-block h-px w-6 bg-current opacity-50" />
      <span>{children}</span>
    </div>
  );
}
