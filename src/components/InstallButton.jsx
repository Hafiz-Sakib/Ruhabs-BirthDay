import { useEffect, useRef, useState } from "react";
import { install, isIOS, usePwa } from "../pwa";

const Download = () => (
  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M12 3v12m0 0-4.5-4.5M12 15l4.5-4.5" />
    <path d="M4 17v1.5A2.5 2.5 0 0 0 6.5 21h11a2.5 2.5 0 0 0 2.5-2.5V17" />
  </svg>
);

/* Install button, sits next to the day / night switch.
   Chrome / Edge / Android: opens the browser's own install dialog.
   Safari / iOS / Firefox: shows a small "how to install" tip, because those browsers have no install API.
   Hidden once the app is installed (or when it is opened from the home screen). */
export default function InstallButton() {
  const { installed } = usePwa();
  const [tip, setTip] = useState(false);
  const box = useRef(null);
  const ios = isIOS();

  useEffect(() => {
    if (!tip) return;
    const away = (e) => { if (!box.current?.contains(e.target)) setTip(false); };
    const esc = (e) => { if (e.key === "Escape") setTip(false); };
    document.addEventListener("pointerdown", away);
    document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("pointerdown", away); document.removeEventListener("keydown", esc); };
  }, [tip]);

  if (installed) return null;

  const click = async () => { if ((await install()) === "manual") setTip((t) => !t); };

  return (
    <div ref={box} className="relative shrink-0">
      <button
        type="button"
        onClick={click}
        aria-label="Install app"
        aria-expanded={tip}
        title="Install this page as an app"
        className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full border border-ink/15 bg-surface px-2.5 text-sm font-bold text-ink shadow-[0_8px_30px_-8px_rgba(20,21,26,.25)] outline-none transition hover:scale-105 focus-visible:ring-2 focus-visible:ring-violet-500/60 active:scale-95 sm:px-3"
      >
        <Download />
        <span className="hidden sm:inline">Install</span>
      </button>
      {tip && (
        <div role="dialog" aria-label="How to install" className="absolute right-0 top-full z-50 mt-3 w-64 rounded-2xl bg-surface p-4 text-left text-sm font-medium leading-relaxed text-ink shadow-[0_30px_80px_-30px_rgba(60,40,120,.55)] ring-1 ring-ink/10">
          <p className="font-display text-base font-extrabold">Install Ruhab's First Birthday</p>
          <p className="mt-1.5 text-ink/70">
            {ios
              ? <>Tap the <b>Share</b> button in Safari, then choose <b>Add to Home Screen</b>.</>
              : <>Open your browser menu (<b>⋮</b> or <b>⋯</b>) and choose <b>Install app</b> or <b>Add to Home screen</b>.</>}
          </p>
        </div>
      )}
    </div>
  );
}
