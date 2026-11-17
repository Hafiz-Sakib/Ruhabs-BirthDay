import { useSyncExternalStore } from "react";

/* PWA install state.
   Chrome/Edge/Android fire `beforeinstallprompt`, which we keep and replay when the visitor taps Install.
   Safari/iOS and Firefox never fire it, so there the button shows a short "how to install" tip instead.
   This file is imported before React starts, so the early event is never missed. */

const standalone = () =>
  typeof window !== "undefined" &&
  (window.matchMedia?.("(display-mode: standalone)").matches || window.navigator.standalone === true);

/* Remember "installed" so the button stays hidden when the page is opened in a normal browser tab later. */
const KEY = "pwa-installed";
const remembered = () => { try { return localStorage.getItem(KEY) === "1"; } catch { return false; } };
const remember = () => { try { localStorage.setItem(KEY, "1"); } catch { /* private mode */ } };
const forget = () => { try { localStorage.removeItem(KEY); } catch { /* private mode */ } };

let deferred = null;
const isIn = standalone();
if (isIn) remember();
let state = { canPrompt: false, installed: isIn || remembered() };
const listeners = new Set();
const set = (patch) => { state = { ...state, ...patch }; listeners.forEach((l) => l()); };

if (typeof window !== "undefined") {
  /* The browser only offers an install prompt when the app is NOT installed, so a prompt means "not installed" (e.g. it was uninstalled). */
  window.addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); deferred = e; forget(); set({ canPrompt: true, installed: false }); });
  window.addEventListener("appinstalled", () => { deferred = null; remember(); set({ canPrompt: false, installed: true }); });
  window.matchMedia?.("(display-mode: standalone)").addEventListener?.("change", () => {
    if (standalone()) remember();
    set({ installed: standalone() || remembered() });
  });
  /* Chrome / Edge: ask the browser if this web app is already installed (uses related_applications in the manifest). */
  navigator.getInstalledRelatedApps?.().then((apps) => {
    if (apps?.some((a) => a.platform === "webapp")) { remember(); set({ installed: true }); }
  }).catch(() => {});
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
