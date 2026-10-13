import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * Hydration-safe mounted hook using React 18/19 useSyncExternalStore.
 * Avoids cascading renders and passes React compiler ESLint rules.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}
