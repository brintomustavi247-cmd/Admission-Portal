import { useEffect } from "react";

/**
 * Escape key দিয়ে modal/panel close করার shared hook.
 * - `active` false হলে listener register হয় না (খোলা না থাকলে কোনো cost নেই)
 * - onClose টা stable হলে (useCallback) unnecessary re-subscribe হবে না
 */
export function useEscapeClose(active: boolean, onClose: () => void) {
  useEffect(() => {
    if (!active) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [active, onClose]);
}
