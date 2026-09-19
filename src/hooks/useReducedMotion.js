import { useEffect, useState } from "react";

/**
 * Shared prefers-reduced-motion flag. Several existing V2 components
 * (LightspeedTransition, StarfieldCrawl) each check this inline with their
 * own useState/useEffect pair — this hook is only used by the new Phase 2
 * screens, so it doesn't touch or refactor any of that existing, working
 * code. Also listens for the setting changing mid-session, not just its
 * value at mount.
 */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e) => setReduced(e.matches);
    if (mq.addEventListener) mq.addEventListener("change", handler);
    else mq.addListener(handler);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", handler);
      else mq.removeListener(handler);
    };
  }, []);

  return reduced;
}
