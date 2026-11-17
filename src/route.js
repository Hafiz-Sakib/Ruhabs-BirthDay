/* Clean path URLs for the page sections: /firsts, /story, /play, /party, /reel (and / for the top).
   No router library: the page is one long scroll, so a path just means "scroll to that section".
   vercel.json rewrites every path to index.html, and `npm run dev` does the same by default. */

export const SECTIONS = ["firsts", "story", "play", "party", "reel"];

export const sectionFromPath = (path = window.location.pathname) => {
  const id = path.replace(/^\/+|\/+$/g, "");
  return SECTIONS.includes(id) ? id : null;
};

export function scrollToSection(id, behavior = "smooth") {
  const el = id && document.getElementById(id);
  if (el) el.scrollIntoView({ behavior, block: "start" });
  else window.scrollTo({ top: 0, behavior });
}

/** Change the URL to /<id> (or / for the top) and scroll there. */
export function goTo(id) {
  const path = id ? `/${id}` : "/";
  if (window.location.pathname !== path) window.history.pushState({}, "", path);
  scrollToSection(id);
}

/** onClick for <a href="/firsts">: keep the normal browser behaviour for ctrl/cmd/middle clicks. */
export const navClick = (id) => (e) => {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  e.preventDefault();
  goTo(id);
};

/** Call once on mount: opens /firsts etc. at the right place, upgrades old #firsts links, handles back/forward. */
export function startSectionRouting() {
  const old = window.location.hash.slice(1);
  if (SECTIONS.includes(old)) window.history.replaceState(null, "", `/${old}${window.location.search}`);

  const id = sectionFromPath();
  const cleanups = [];
  if (id) {
    // images and animations settle after first paint and shift the layout, so jump again a few times,
    // but stop the moment the visitor scrolls on their own
    let moved = false;
    const stop = () => { moved = true; };
    ["wheel", "touchstart", "keydown", "pointerdown"].forEach((ev) => window.addEventListener(ev, stop, { passive: true, once: true }));
    const jump = () => { if (!moved) scrollToSection(id, "instant"); };
    jump();
    const timers = [200, 700, 1500].map((ms) => setTimeout(jump, ms));
    window.addEventListener("load", jump, { once: true });
    cleanups.push(() => timers.forEach(clearTimeout), () => window.removeEventListener("load", jump));
  }

  const onPop = () => scrollToSection(sectionFromPath());
  window.addEventListener("popstate", onPop);
  cleanups.push(() => window.removeEventListener("popstate", onPop));
  return () => cleanups.forEach((c) => c());
}
