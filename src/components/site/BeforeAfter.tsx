import { useCallback, useEffect, useRef, useState } from "react";
import { Maximize2, MoveHorizontal, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export type BeforeAfterPair = {
  before: string;
  after: string;
  title?: string;
};

type Props = Partial<BeforeAfterPair> & {
  pair?: BeforeAfterPair;
  before?: string;
  after?: string;
  title?: string;
  className?: string;
  initial?: number; // 0-100
};

export function BeforeAfter({ pair, before, after, title, className, initial = 50 }: Props) {
  const resolved: BeforeAfterPair = pair ?? { before: before!, after: after!, title };
  const [pos, setPos] = useState(initial);
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className={cn("group relative overflow-hidden rounded-2xl border border-border bg-muted/40", className)}>
        <Slider pos={pos} setPos={setPos} pair={resolved} />
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open full image"
          className="absolute right-3 top-3 z-30 inline-flex h-9 w-9 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm backdrop-blur transition hover:bg-background"
        >
          <Maximize2 className="h-4 w-4" />
        </button>
        <div className="pointer-events-none absolute left-3 top-3 z-20 rounded-md bg-background/85 px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-tighter backdrop-blur">
          Before
        </div>
        <div className="pointer-events-none absolute right-3 bottom-3 z-20 rounded-md bg-ink px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-tighter text-ink-foreground">
          After
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[96vw] border-0 bg-transparent p-0 shadow-none sm:max-w-[92vw]">
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="absolute -top-12 right-0 z-50 inline-flex h-10 w-10 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="overflow-hidden rounded-xl bg-background">
            <Slider pos={pos} setPos={setPos} pair={pair} tall />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function Slider({
  pos,
  setPos,
  pair,
  tall = false,
}: {
  pos: number;
  setPos: (n: number) => void;
  pair: BeforeAfterPair;
  tall?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const update = useCallback(
    (clientX: number) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width) * 100;
      setPos(Math.max(0, Math.min(100, x)));
    },
    [setPos]
  );

  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (!dragging.current) return;
      update(e.clientX);
    };
    const up = () => (dragging.current = false);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [update]);

  return (
    <div
      ref={ref}
      className={cn(
        "relative w-full select-none touch-none",
        tall ? "aspect-[4/3] max-h-[85vh]" : "aspect-[4/3]"
      )}
      onPointerDown={(e) => {
        dragging.current = true;
        (e.target as Element).setPointerCapture?.(e.pointerId);
        update(e.clientX);
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") setPos(Math.max(0, pos - 4));
        if (e.key === "ArrowRight") setPos(Math.min(100, pos + 4));
      }}
      role="slider"
      aria-label={`Before and after comparison${pair.title ? `: ${pair.title}` : ""}`}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pos)}
      tabIndex={0}
    >
      <img
        src={pair.after}
        alt={pair.title ? `${pair.title} — after` : "After"}
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        <img
          src={pair.before}
          alt={pair.title ? `${pair.title} — before` : "Before"}
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
      <div
        className="pointer-events-none absolute inset-y-0 z-10"
        style={{ left: `${pos}%`, transform: "translateX(-50%)" }}
      >
        <div className="h-full w-px bg-white/90 shadow-[0_0_0_1px_rgba(0,0,0,0.25)]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink shadow-lift ring-1 ring-black/10">
          <MoveHorizontal className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}
