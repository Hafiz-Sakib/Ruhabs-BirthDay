import { useSyncExternalStore } from "react";

/* PWA install state.
   Chrome/Edge/Android fire `beforeinstallprompt`, which we keep and replay when the visitor taps Install.
   Safari/iOS and Firefox never fire it, so there the button shows a short "how to install" tip instead.
   This file is imported before React starts, so the early event is never missed. */

const standalone = () =>
  typeof window !== "undefined" &&
  (window.matchMedia?.("(display-mode: standalone)").matches || window.navigator.standalone === true);

let deferred = null;
let state = { canPrompt: false, installed: standalone() };
const listeners = new Set();
const set = (patch) => { state = { ...state, ...patch }; listeners.forEach((l) => l()); };

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); deferred = e; set({ canPrompt: true }); });
  window.addEventListener("appinstalled", () => { deferred = null; set({ canPrompt: false, installed: true }); });
  window.matchMedia?.("(display-mode: standalone)").addEventListener?.("change", () => set({ installed: standalone() }));
}

const subscribe = (cb) => { listeners.add(cb); return () => listeners.delete(cb); };
export const usePwa = () => useSyncExternalStore(subscribe, () => state, () => state);

/** "accepted" | "dismissed" when the browser showed its install dialog, "manual" when the visitor has to use the browser menu. */
export async function install() {
  if (!deferred) return "manual";
  const ev = deferred;
  deferred = null;
  set({ canPrompt: false });
  ev.prompt();
  const { outcome } = await ev.userChoice;
  return outcome;
}

export const isIOS = () =>
  typeof navigator !== "undefined" &&
  (/iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1));
