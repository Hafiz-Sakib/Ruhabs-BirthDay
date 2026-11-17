import { useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useInView, useReducedMotion } from "framer-motion";
import { Confetti } from "./Confetti";

/* ---------- Orbit: photos circling a big "1" (idea: motion-brew "Orbit card") ---------- */
export function Orbit({ items, onOpen, centre = "1" }) {
  const n = items.length;
  return (
    <div className="orbit relative mx-auto aspect-square" style={{ "--s": "min(92vw, 34rem)", width: "var(--s)" }}>
      <div className="absolute inset-[18%] rounded-full bg-gradient-to-br from-amber-300/50 via-sky-300/40 to-violet-300/50 blur-2xl" aria-hidden />
      <div className="absolute inset-[12%] rounded-full border border-dashed border-ink/20" aria-hidden />
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          <p className="bg-gradient-to-br from-amber-400 via-orange-400 to-violet-500 bg-clip-text font-display text-[clamp(6rem,30vw,12rem)] font-extrabold leading-none text-transparent">{centre}</p>
          <p className="-mt-2 text-xs font-bold uppercase tracking-[0.3em] text-ink/60">year old</p>
        </div>
      </div>
      <div className="orbit-ring absolute inset-0">
        {items.map((p, i) => {
          const a = (360 / n) * i;
          return (
            <div key={p.id} className="absolute left-1/2 top-1/2" style={{ transform: `rotate(${a}deg) translateY(calc(var(--s) * -0.39))` }}>
              <div style={{ transform: `rotate(${-a}deg)` }}>
                <div className="-translate-x-1/2 -translate-y-1/2">
                  <div className="orbit-card">
                    <button type="button" onClick={() => onOpen(p.id)} aria-label={`Open photo: ${p.alt}`}
                      className="block cursor-zoom-in overflow-hidden rounded-full shadow-[0_10px_30px_-8px_rgba(40,30,70,.5)] ring-4 ring-surface transition-transform hover:scale-110"
                      style={{ width: "calc(var(--s) * 0.2)", height: "calc(var(--s) * 0.2)" }}>
                      <img src={p.src} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" style={{ objectPosition: "50% 30%" }} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Birthday cake: blow out the candle ---------- */
export function Cake() {
  const still = !!useReducedMotion();
  const [lit, setLit] = useState(true);
  const [burst, setBurst] = useState(0);
  const blow = () => { if (!lit) return; setLit(false); setBurst((b) => b + 1); };
  return (
    <div className="mx-auto flex max-w-sm flex-col items-center">
      <svg viewBox="0 0 300 270" className="w-full max-w-[22rem]" role="img" aria-label="Birthday cake with one candle">
        <ellipse cx="150" cy="248" rx="132" ry="14" fill="rgba(0,0,0,.12)" />
        <ellipse cx="150" cy="238" rx="128" ry="16" fill="#e9e4f5" />
        <rect x="42" y="168" width="216" height="68" rx="14" fill="#7c6cf6" />
        <rect x="42" y="168" width="216" height="22" rx="11" fill="#ffffff" />
        {[62, 92, 128, 168, 204, 238].map((x, i) => <rect key={x} x={x - 7} y="176" width="14" height={22 + (i % 3) * 8} rx="7" fill="#fff" />)}
        <rect x="78" y="112" width="144" height="62" rx="12" fill="#38bdf8" />
        <rect x="78" y="112" width="144" height="20" rx="10" fill="#fff" />
        {[96, 124, 150, 178, 204].map((x, i) => <rect key={x} x={x - 6} y="120" width="12" height={18 + (i % 2) * 8} rx="6" fill="#fff" />)}
        {[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={104 + i * 23} cy={152} r="4" fill="#f7d54a" />)}
        <rect x="140" y="70" width="20" height="46" rx="5" fill="#f7d54a" />
        <path d="M140 84h20M140 98h20" stroke="#e8b923" strokeWidth="4" />
        <AnimatePresence>
          {lit && (
            <motion.g key="flame" style={{ originX: "150px", originY: "68px", cursor: "pointer" }} onClick={blow} role="button" tabIndex={0} aria-label="Blow out the candle"
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && blow()}
              initial={{ opacity: 0, scale: 0.5 }} animate={still ? { opacity: 1, scale: 1 } : { opacity: 1, scale: [1, 1.12, 0.95, 1.08, 1], rotate: [0, -3, 2, -2, 0] }}
              exit={{ opacity: 0, scale: 0.2, y: -8 }} transition={lit ? { duration: 1.2, repeat: Infinity } : { duration: 0.3 }}>
              <circle cx="150" cy="48" r="30" fill="rgba(247,213,74,.28)" />
              <path d="M150 20c14 16 16 28 0 46-16-18-14-30 0-46z" fill="#fb923c" />
              <path d="M150 34c7 9 8 16 0 26-8-10-7-17 0-26z" fill="#fde68a" />
              <rect x="120" y="14" width="60" height="62" fill="transparent" />
            </motion.g>
          )}
        </AnimatePresence>
        {!lit && [0, 1, 2].map((i) => (
          <motion.path key={`${burst}-${i}`} d={`M${146 + i * 4} 66c-6-10 6-14 0-24`} stroke="rgba(120,120,140,.55)" strokeWidth="3" fill="none" strokeLinecap="round"
            initial={{ opacity: 0.9, y: 0 }} animate={{ opacity: 0, y: -26 }} transition={{ duration: 1.6, delay: i * 0.2 }} />
        ))}
      </svg>
      <p className="mt-2 text-center text-lg font-bold" aria-live="polite">{lit ? "Hurry, the flame is dancing! 🔥" : "Wish made! Happy birthday Ruhab 🎉"}</p>
      <button type="button" onClick={lit ? blow : () => setLit(true)} className="mt-4 rounded-full bg-ink px-6 py-2.5 text-sm font-bold text-mist transition hover:scale-105">
        {lit ? "Blow out the candle" : "Light it again"}
      </button>
      {burst > 0 && <Confetti key={burst} duration={3500} />}
    </div>
  );
}

/* ---------- Balloons: pop one, read a wish ---------- */
const COLORS = ["#f87171", "#fbbf24", "#34d399", "#38bdf8", "#a78bfa", "#f472b6"];
function Balloon({ color, popped, onPop, delay }) {
  const still = !!useReducedMotion();
  return (
    <div className="relative grid h-40 w-20 place-items-start sm:h-48 sm:w-24">
      <AnimatePresence>
        {!popped && (
          <motion.button type="button" aria-label="Pop this balloon" onClick={onPop} className="bob absolute inset-x-0 top-0 cursor-pointer outline-none" style={{ animationDelay: `${delay}s` }}
            initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.6, opacity: 0 }} transition={{ type: "spring", stiffness: 260, damping: 16 }} whileTap={still ? undefined : { scale: 0.9 }}>
            <span className="relative mx-auto block h-24 w-[4.6rem] rounded-[50%_50%_50%_50%/58%_58%_42%_42%] shadow-[inset_-8px_-10px_18px_rgba(0,0,0,.18)] sm:h-28 sm:w-20" style={{ background: color }}>
              <span className="absolute left-3 top-3 h-6 w-3 rotate-[20deg] rounded-full bg-white/60 blur-[1px]" />
            </span>
            <span className="mx-auto block h-0 w-0 border-x-[5px] border-b-[8px] border-x-transparent" style={{ borderBottomColor: color }} />
            <span className="mx-auto block h-14 w-px bg-ink/30" />
          </motion.button>
        )}
      </AnimatePresence>
      {popped && !still && Array.from({ length: 12 }).map((_, i) => (
        <motion.span key={i} aria-hidden className="absolute left-1/2 top-12 h-2 w-2 rounded-full" style={{ background: color }}
          initial={{ x: 0, y: 0, opacity: 1 }} animate={{ x: Math.cos((i / 12) * 6.28) * 60, y: Math.sin((i / 12) * 6.28) * 60 + 12, opacity: 0 }} transition={{ duration: 0.7, ease: "easeOut" }} />
      ))}
    </div>
  );
}

export function Balloons({ wishes }) {
  const [popped, setPopped] = useState([]);
  const [wish, setWish] = useState(null);
  const [n, setN] = useState(0);
  const pop = (i) => {
    setPopped((p) => [...p, i]); setWish(wishes[i % wishes.length]); setN((x) => x + 1);
    setTimeout(() => setPopped((p) => p.filter((x) => x !== i)), 4500); // the balloon floats back
  };
  return (
    <div>
      <div className="flex flex-wrap items-start justify-center gap-x-3 gap-y-2 sm:gap-x-6">
        {wishes.map((_, i) => <Balloon key={i} color={COLORS[i % COLORS.length]} delay={i * 0.45} popped={popped.includes(i)} onPop={() => pop(i)} />)}
      </div>
      <div className="mx-auto mt-6 min-h-[7.5rem] max-w-md" aria-live="polite">
        <AnimatePresence mode="wait">
          {wish && (
            <motion.div key={n} initial={{ opacity: 0, y: 24, rotate: -3, scale: 0.9 }} animate={{ opacity: 1, y: 0, rotate: -1.5, scale: 1 }} exit={{ opacity: 0, y: -10 }}
              transition={{ type: "spring", stiffness: 240, damping: 18 }}
              className="rounded-2xl bg-amber-200 p-6 text-center font-display text-xl font-bold leading-snug text-[#3b2a05] shadow-[0_18px_40px_-18px_rgba(120,80,0,.6)]">
              “{wish}”
            </motion.div>
          )}
        </AnimatePresence>
        {!wish && <p className="pt-8 text-center text-ink/50">Pop one to find a wish…</p>}
      </div>
    </div>
  );
}

/* ---------- Polaroid table: drag the photos around ---------- */
const SPOTS = [[2, 3, -8], [30, 8, 5], [56, 2, -3], [78, 9, 7], [6, 38, 4], [32, 44, -6], [58, 36, 8], [80, 44, -4], [42, 72, 2], [10, 74, -7], [72, 76, 6]];
export function PolaroidTable({ items, onOpen }) {
  const box = useRef(null);
  const [top, setTop] = useState(null);
  return (
    <div ref={box} className="relative mx-auto h-[36rem] max-w-5xl overflow-hidden rounded-[2rem] bg-amber-100/70 shadow-inner ring-1 ring-ink/10 sm:h-[44rem] dark:bg-white/5"
      style={{ "--pw": "min(9rem, 36vw)", backgroundImage: "radial-gradient(rgba(120,90,30,.14) 1px, transparent 1.2px)", backgroundSize: "18px 18px" }}>
      {items.slice(0, SPOTS.length).map((p, i) => {
        const [x, y, r] = SPOTS[i];
        return (
          <motion.figure key={p.id} drag dragConstraints={box} dragElastic={0.12} dragMomentum={false}
            onPointerDown={() => setTop(p.id)} onTap={() => onOpen(p.id)}
            initial={{ rotate: r }} whileHover={{ scale: 1.05 }} whileDrag={{ scale: 1.1, rotate: 0, cursor: "grabbing" }}
            className="absolute m-0 cursor-grab bg-white p-2 pb-7 shadow-[0_14px_30px_-10px_rgba(40,30,10,.55)] [touch-action:none]"
            style={{ width: "var(--pw)", left: `calc((100% - var(--pw)) * ${x / 100})`, top: `calc((100% - var(--pw) * 1.35) * ${y / 100})`, zIndex: top === p.id ? 30 : i }}>
            <span aria-hidden className="absolute -top-2 left-1/2 h-4 w-12 -translate-x-1/2 rotate-2 bg-amber-200/80" />
            <img src={p.src} alt={p.alt} draggable={false} loading="lazy" decoding="async" className="aspect-[4/5] w-full select-none object-cover" style={{ objectPosition: "50% 30%" }} />
            <figcaption className="absolute inset-x-0 bottom-1.5 text-center font-display text-[11px] font-bold text-neutral-500">Ruhab · {i + 1}</figcaption>
          </motion.figure>
        );
      })}
    </div>
  );
}

/* ---------- Recap: numbers that count up (idea: motion-brew "Recap card") ---------- */
function CountUp({ to }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 2, ease: "easeOut", onUpdate: (x) => setV(Math.round(x)) });
    return () => c.stop();
  }, [inView, to]);
  return <span ref={ref} className="tabular-nums">{v}</span>;
}
export function Recap({ stats }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {stats.map((s, i) => (
        <motion.div key={s.label} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12, duration: 0.6 }}
          className="rounded-3xl bg-surface p-6 text-center shadow-[0_20px_50px_-28px_rgba(40,30,70,.5)] ring-1 ring-ink/10">
          <p className="font-display text-6xl font-extrabold sm:text-7xl" style={{ color: s.color }}>{s.text ?? <CountUp to={s.value} />}</p>
          <p className="mt-2 text-sm font-semibold uppercase tracking-widest text-ink/60">{s.label}</p>
        </motion.div>
      ))}
    </div>
  );
}
