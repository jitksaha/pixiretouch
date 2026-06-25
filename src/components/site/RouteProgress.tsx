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

  return null;
}
