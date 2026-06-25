import { useRouterState } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import NProgress from "nprogress";

NProgress.configure({ showSpinner: false, trickleSpeed: 120, minimum: 0.15 });

export function RouteProgress() {
  const status = useRouterState({ select: (s) => s.status });
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (status === "pending") {
      // small delay so instant nav doesn't flash the bar
      timer.current = setTimeout(() => NProgress.start(), 80);
    } else {
      if (timer.current) clearTimeout(timer.current);
      NProgress.done();
    }
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [status]);

  return (
    <style>{`
      #nprogress { pointer-events: none; }
      #nprogress .bar {
        background: hsl(var(--primary));
        position: fixed; z-index: 9999; top: 0; left: 0;
        width: 100%; height: 2px;
      }
      #nprogress .peg {
        display: block; position: absolute; right: 0; width: 100px; height: 100%;
        box-shadow: 0 0 10px hsl(var(--primary)), 0 0 5px hsl(var(--primary));
        opacity: 1; transform: rotate(3deg) translate(0px, -4px);
      }
    `}</style>
  );
}

