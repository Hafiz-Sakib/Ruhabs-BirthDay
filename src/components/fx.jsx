import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";

/* Words rise out of a soft blur one after another (idea: motion-brew "Blur text"). Wrap a word in {{ }} style by passing `accent`. */
export function BlurText({ text, accent = "", className = "", accentClass = "", delay = 0 }) {
  const still = !!useReducedMotion();
  return (
    <span className={className} aria-label={text}>
      {text.split(" ").map((w, i) => (
        <motion.span
          key={i} aria-hidden
          className={`inline-block ${w.replace(/[^A-Za-z]/g, "") === accent ? accentClass : ""}`}
          initial={still ? false : { opacity: 0, y: 26, filter: "blur(12px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.7, delay: delay + i * 0.09, ease: [0.2, 0.7, 0.2, 1] }}
        >
          {w}&nbsp;
        </motion.span>
      ))}
    </span>
  );
}

/* Fade + rise when scrolled into view */
export function Reveal({ children, className = "", delay = 0 }) {
  const still = !!useReducedMotion();
  return (
    <motion.div className={className} initial={still ? false : { opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8%" }} transition={{ duration: 0.7, delay, ease: [0.2, 0.7, 0.2, 1] }}>
      {children}
    </motion.div>
  );
}

/* A card that tips toward the pointer (no glare, idea: motion-brew "Tilt card"). */
export function TiltCard({ children, className = "", max = 9, onClick, label }) {
  const still = !!useReducedMotion();
  const ref = useRef(null);
  const px = useMotionValue(0.5), py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 220, damping: 20 }), sy = useSpring(py, { stiffness: 220, damping: 20 });
  const rx = useTransform(sy, [0, 1], [max, -max]), ry = useTransform(sx, [0, 1], [-max, max]);
  const move = (e) => {
    if (still || e.pointerType === "touch") return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width); py.set((e.clientY - r.top) / r.height);
  };
  const leave = () => { px.set(0.5); py.set(0.5); };
  return (
    <div style={{ perspective: 900 }} className={className}>
      <motion.div
        ref={ref} onPointerMove={move} onPointerLeave={leave} onClick={onClick}
        role={onClick ? "button" : undefined} tabIndex={onClick ? 0 : undefined} aria-label={label}
        onKeyDown={onClick ? (e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onClick()) : undefined}
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        whileHover={still ? undefined : { scale: 1.02 }} whileTap={still ? undefined : { scale: 0.98 }}
        className={`relative overflow-hidden rounded-3xl shadow-[0_18px_50px_-18px_rgba(40,30,70,.45)] ring-1 ring-ink/10 ${onClick ? "cursor-zoom-in" : ""}`}
      >
        {children}
      </motion.div>
    </div>
  );
}

/* Countdown with rolling digits */
const pad = (n) => String(n).padStart(2, "0");
function Digit({ value, label }) {
  const still = !!useReducedMotion();
  return (
    <div className="flex flex-col items-center">
      <div className="relative grid h-20 w-[4.2rem] place-items-center overflow-hidden rounded-2xl bg-surface shadow-[0_10px_30px_-12px_rgba(40,30,70,.35)] ring-1 ring-ink/10 sm:h-28 sm:w-28">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span key={value} className="font-display text-4xl font-extrabold tabular-nums sm:text-6xl"
            initial={still ? false : { y: -34, opacity: 0, filter: "blur(6px)" }} animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            exit={still ? undefined : { y: 34, opacity: 0, filter: "blur(6px)" }} transition={{ type: "spring", stiffness: 380, damping: 32 }}>
            {value}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="mt-2 text-[11px] font-semibold uppercase tracking-widest text-ink/60 sm:text-xs">{label}</span>
    </div>
  );
}

export function Countdown({ target, done }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  const left = Math.max(0, target - now);
  if (left === 0) return <p className="text-center font-display text-2xl font-extrabold sm:text-4xl">{done}</p>;
  const s = Math.floor(left / 1000);
  return (
    <div className="flex items-start justify-center gap-2.5 sm:gap-5" role="timer" aria-live="off">
      <Digit value={String(Math.floor(s / 86400))} label="Days" />
      <Digit value={pad(Math.floor((s % 86400) / 3600))} label="Hours" />
      <Digit value={pad(Math.floor((s % 3600) / 60))} label="Minutes" />
      <Digit value={pad(s % 60)} label="Seconds" />
    </div>
  );
}

/* Full-size photo viewer: Esc closes, arrows (or swipe buttons) move on */
export function Lightbox({ list, index, onClose, onIndex }) {
  const p = list[index];
  useEffect(() => {
    if (index == null) return;
    const k = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onIndex((index + 1) % list.length);
      if (e.key === "ArrowLeft") onIndex((index - 1 + list.length) % list.length);
    };
    window.addEventListener("keydown", k);
    const prev = document.body.style.overflow; document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", k); document.body.style.overflow = prev; };
  }, [index, list.length, onClose, onIndex]);
  const btn = "absolute top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-2xl text-white backdrop-blur hover:bg-white/25";
  return (
    <AnimatePresence>
      {p && (
        <motion.div className="fixed inset-0 z-[90] grid place-items-center bg-black/85 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} role="dialog" aria-modal="true" aria-label={p.alt}>
          <motion.img key={p.id} src={p.full} alt={p.alt} width={p.w} height={p.h} className="max-h-[88svh] max-w-full rounded-2xl object-contain" initial={{ scale: 0.94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} onClick={(e) => e.stopPropagation()} />
          <button className={`${btn} left-3`} aria-label="Previous photo" onClick={(e) => { e.stopPropagation(); onIndex((index - 1 + list.length) % list.length); }}>‹</button>
          <button className={`${btn} right-3`} aria-label="Next photo" onClick={(e) => { e.stopPropagation(); onIndex((index + 1) % list.length); }}>›</button>
          <button className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-white/15 text-xl text-white backdrop-blur hover:bg-white/25" aria-label="Close" onClick={onClose}>✕</button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
