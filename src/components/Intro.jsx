import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Confetti } from "./Confetti";

// Timeline (ms). Texts are shown for 3 seconds in total, the gold confetti falls for 3 seconds in total,
// the leftover pieces finish falling over the page.
const LINES = ["Congratulations!", "Happy Birthday Ruhab!"];
const SECOND_LINE_AT = 1300; // "Congratulations!" first, then "Happy Birthday Ruhab!"
const TEXT_END = 2500;       // white screen + texts start fading here; gone by 3s total
const CONFETTI_MS = 3000;    // confetti keeps falling from the top until here
const TYPE_MS = 50;          // delay between typed letters

// Shows on EVERY page load / reload (no localStorage check any more).
export function useIntro() {
  const [show, setShow] = useState(true);
  const done = () => setShow(false);
  return [show, done];
}

export function Intro({ onDone }) {
  const [line, setLine] = useState(0);
  const [count, setCount] = useState(0);
  const [fade, setFade] = useState(false);
  const [faded, setFaded] = useState(false);   // white screen is gone: page is usable again
  const flags = useRef({ fade: false, confetti: false });
  const reduce = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const text = LINES[line];

  const mark = (k) => { flags.current[k] = true; if (flags.current.fade && flags.current.confetti) onDone(); };

  // the page can be scrolled/clicked again as soon as the white screen has faded (confetti keeps falling on top)
  useEffect(() => {
    if (faded) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [faded]);

  // type the current line
  useEffect(() => {
    if (count >= text.length) return;
    const t = setTimeout(() => setCount((c) => c + 1), reduce ? 0 : TYPE_MS);
    return () => clearTimeout(t);
  }, [count, text, reduce]);

  // switch to line 2 at 1.3s, fade everything at 2.5s
  useEffect(() => {
    const a = setTimeout(() => { setLine(1); setCount(0); }, reduce ? 600 : SECOND_LINE_AT);
    const b = setTimeout(() => setFade(true), reduce ? 1800 : TEXT_END);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, [reduce]);

  useEffect(() => { if (reduce) flags.current.confetti = true; }, [reduce]);

  return (
    <>
      <motion.div
        className={`fixed inset-0 z-[100] grid place-items-center bg-surface px-4 text-ink ${faded ? "pointer-events-none" : ""}`}
        initial={{ opacity: 1 }}
        animate={{ opacity: fade ? 0 : 1 }}
        transition={{ duration: fade ? 0.5 : 0, ease: "easeIn" }}
        onAnimationComplete={() => { if (fade) { setFaded(true); mark("fade"); } }}
        role="status"
        aria-label={text}
      >
        <p className="text-center font-display text-4xl font-extrabold tracking-tight sm:text-7xl" aria-hidden>
          <span className="bg-gradient-to-r from-sky-500 to-violet-500 bg-clip-text text-transparent">{text.slice(0, count)}</span>
          {count < text.length && <span className="ml-1 inline-block w-[0.08em] animate-pulse bg-current align-middle" style={{ height: "0.9em" }} />}
        </p>
      </motion.div>
      {!reduce && <Confetti duration={CONFETTI_MS} onDone={() => mark("confetti")} />}
    </>
  );
}
