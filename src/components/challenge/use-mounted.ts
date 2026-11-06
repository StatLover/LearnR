import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

/**
 * False during server rendering and hydration, true afterwards. Use it to
 * render things that depend on the visitor's clock or time zone (dates,
 * countdowns, today's challenge) without hydration mismatches.
 */
export function useMounted() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}
