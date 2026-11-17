import { useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useInView, useMotionValue, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { Confetti } from "./Confetti";

/* New pieces, same spring-and-glide style as the rest of the site (ideas from motion-brew.com).
   1 FlipWords   2 ThenNow   3 Timeline   4 Favourites   5 MemoryGame   6 Blessings   7 RsvpCard
   + ScrollProgress and MagneticButton helpers. Only framer-motion is used, no new packages. */

const SPRING = { type: "spring", stiffness: 380, damping: 30 };
const EASE = [0.2, 0.7, 0.2, 1];

/* ---------- helper: thin colour bar at the top that fills while you scroll ---------- */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const x = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.4 });
  return <motion.div aria-hidden style={{ scaleX: x }} className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-1 origin-left bg-gradient-to-r from-sky-400 via-violet-500 to-amber-400" />;
}

/* ---------- helper: button that leans toward the cursor (motion-brew "Magnetic button") ---------- */
export function MagneticButton({ children, className = "", strength = 0.3, ...rest }) {
  const still = !!useReducedMotion();
  const ref = useRef(null);
  const mx = useMotionValue(0), my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 220, damping: 16 }), y = useSpring(my, { stiffness: 220, damping: 16 });
  const move = (e) => {
    if (still || e.pointerType === "touch") return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - (r.left + r.width / 2)) * strength);
    my.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const leave = () => { mx.set(0); my.set(0); };
  return (
    <motion.button ref={ref} type="button" onPointerMove={move} onPointerLeave={leave} style={{ x, y }} whileTap={still ? undefined : { scale: 0.95 }} className={className} {...rest}>
      {children}
    </motion.button>
  );
}

/* ================= 1. FLIP WORDS: one word flips to the next, letter by letter ================= */
const FLIP_COLORS = ["#f59e0b", "#38bdf8", "#8b5cf6", "#ec4899", "#10b981", "#f97316"];
export function FlipWords({ prefix, words, interval = 2300 }) {
  const still = !!useReducedMotion();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (still) return;
    const t = setInterval(() => setI((x) => (x + 1) % words.length), interval);
    return () => clearInterval(t);
  }, [still, words.length, interval]);
  const word = words[i];
  return (
    <p className="text-center font-display text-3xl font-extrabold leading-tight sm:text-6xl" style={{ perspective: 700 }}>
      <span className="sr-only">{prefix} {words.join(", ")}</span>
      <span aria-hidden>
        {prefix}{" "}
        <motion.span layout transition={SPRING} className="relative inline-flex align-bottom" style={{ color: FLIP_COLORS[i % FLIP_COLORS.length] }}>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span key={word} className="inline-flex whitespace-nowrap">
              {[...word].map((c, k) => (
                <motion.span key={k} className="inline-block"
                  initial={still ? false : { rotateX: -90, opacity: 0, y: 12 }} animate={{ rotateX: 0, opacity: 1, y: 0 }}
                  exit={still ? undefined : { rotateX: 90, opacity: 0, y: -12 }} transition={{ duration: 0.35, delay: k * 0.04, ease: EASE }}>
                  {c === " " ? "\u00a0" : c}
                </motion.span>
              ))}
            </motion.span>
          </AnimatePresence>
        </motion.span>
      </span>
    </p>
  );
}

/* ================= 2. THEN & NOW: drag the handle to compare two photos ================= */
export function ThenNow({ before, after, beforeLabel = "Then", afterLabel = "Now", onOpen }) {
  const still = !!useReducedMotion();
  const box = useRef(null);
  const dragging = useRef(false);
  const touched = useRef(false);
  const inView = useInView(box, { once: true, margin: "-20%" });
  const [pos, setPos] = useState(50);
  const set = (cx) => {
    const r = box.current.getBoundingClientRect();
    setPos(Math.min(100, Math.max(0, ((cx - r.left) / r.width) * 100)));
  };
  useEffect(() => {
    if (!inView || still) return;
    let stop = false;
    (async () => {
      for (const [a, b] of [[50, 18], [18, 82], [82, 50]]) {
        if (stop || touched.current) return;
        await animate(a, b, { duration: 0.9, ease: "easeInOut", onUpdate: (v) => !touched.current && setPos(v) });
      }
    })();
    return () => { stop = true; };
  }, [inView, still]);
  const chip = "absolute top-3 rounded-full bg-black/55 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white backdrop-blur";
  return (
    <div className="mx-auto w-full max-w-sm">
      <div ref={box} className="relative aspect-[3/4] select-none overflow-hidden rounded-[2rem] shadow-[0_30px_70px_-30px_rgba(40,30,70,.6)] ring-1 ring-ink/10"
        style={{ touchAction: "pan-y" }}
        onPointerDown={(e) => { dragging.current = true; touched.current = true; e.currentTarget.setPointerCapture(e.pointerId); set(e.clientX); }}
        onPointerMove={(e) => dragging.current && set(e.clientX)}
        onPointerUp={() => { dragging.current = false; }} onPointerCancel={() => { dragging.current = false; }}>
        <img src={after.src} alt={after.alt} draggable={false} className="absolute inset-0 h-full w-full object-cover" />
        <img src={before.src} alt={before.alt} draggable={false} className="absolute inset-0 h-full w-full object-cover" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }} />
        <span className={`${chip} left-3`}>{beforeLabel}</span>
        <span className={`${chip} right-3`}>{afterLabel}</span>
        <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-white shadow-[0_0_12px_rgba(0,0,0,.4)]" style={{ left: `${pos}%` }} />
        <div role="slider" tabIndex={0} aria-label="Compare then and now" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pos)}
          onKeyDown={(e) => { if (e.key === "ArrowLeft") { touched.current = true; setPos((p) => Math.max(0, p - 5)); } if (e.key === "ArrowRight") { touched.current = true; setPos((p) => Math.min(100, p + 5)); } }}
          className="absolute top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize place-items-center rounded-full bg-white text-lg font-bold text-neutral-700 shadow-[0_8px_24px_rgba(0,0,0,.35)]" style={{ left: `${pos}%` }}>
          ⇆
        </div>
      </div>
      {onOpen && (
        <div className="mt-4 flex justify-center gap-3 text-sm font-semibold">
          <button type="button" onClick={() => onOpen(before.id)} className="rounded-full bg-surface px-4 py-2 ring-1 ring-ink/10 hover:scale-105">See {beforeLabel.toLowerCase()} big</button>
          <button type="button" onClick={() => onOpen(after.id)} className="rounded-full bg-surface px-4 py-2 ring-1 ring-ink/10 hover:scale-105">See {afterLabel.toLowerCase()} big</button>
        </div>
      )}
    </div>
  );
}

/* ================= 3. TIMELINE: the line fills with scroll, every "first" checks in ================= */
export function Timeline({ items, onOpen }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 55%"] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 26 });
  return (
    <div ref={ref} className="relative mx-auto max-w-4xl">
      <div aria-hidden className="absolute bottom-0 left-4 top-0 w-1 rounded-full bg-ink/10 md:left-1/2 md:-translate-x-1/2" />
      <motion.div aria-hidden style={{ scaleY: fill }} className="absolute bottom-0 left-4 top-0 w-1 origin-top rounded-full bg-gradient-to-b from-sky-400 via-violet-500 to-amber-400 md:left-1/2 md:-translate-x-1/2" />
      <ol className="space-y-12">
        {items.map((m, i) => (
          <li key={m.title} className="relative pl-14 md:grid md:grid-cols-2 md:gap-20 md:pl-0">
            <motion.span aria-hidden initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true, margin: "-30% 0px -30% 0px" }} transition={{ type: "spring", stiffness: 300, damping: 14 }}
              className="absolute left-4 top-6 grid h-9 w-9 -translate-x-1/2 place-items-center rounded-full bg-surface text-lg shadow-[0_8px_20px_-6px_rgba(40,30,70,.5)] ring-4 ring-amber-300 md:left-1/2">
              {m.emoji}
            </motion.span>
            <motion.article
              initial={{ opacity: 0, x: i % 2 ? 40 : -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-10%" }} transition={{ duration: 0.7, ease: EASE }}
              className={`overflow-hidden rounded-3xl bg-surface shadow-[0_20px_50px_-28px_rgba(40,30,70,.5)] ring-1 ring-ink/10 ${i % 2 ? "md:col-start-2" : "md:col-start-1 md:row-start-1"}`}>
              {m.photo && (
                <button type="button" onClick={() => onOpen(m.photo.id)} aria-label={`Open photo: ${m.photo.alt}`} className="block aspect-[4/3] w-full cursor-zoom-in overflow-hidden">
                  <img src={m.photo.src} alt={m.photo.alt} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" style={{ objectPosition: m.pos || "50% 30%" }} />
                </button>
              )}
              <div className="p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-300">{m.when}</p>
                <h3 className="mt-1 text-2xl font-extrabold">{m.title}</h3>
                <p className="mt-1.5 text-ink/70">{m.note}</p>
              </div>
            </motion.article>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ================= 4. FAVOURITES: bento grid of his favourite things ================= */
const BENTO = ["col-span-2 row-span-2", "", "", "", "", "col-span-2", "col-span-2"];
export function Favourites({ items, onOpen }) {
  return (
    <div className="grid auto-rows-[10.5rem] grid-cols-2 gap-3 sm:auto-rows-[13rem] sm:gap-4 md:grid-cols-4">
      {items.map((f, i) => (
        <motion.button key={f.title} type="button" onClick={() => onOpen(f.photo.id)} aria-label={`${f.title}: open photo`}
          initial={{ opacity: 0, y: 30, scale: 0.96 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, margin: "-6%" }} transition={{ duration: 0.6, delay: (i % 3) * 0.08, ease: EASE }}
          whileHover={{ y: -4 }} className={`group relative cursor-zoom-in overflow-hidden rounded-3xl text-left shadow-[0_18px_40px_-22px_rgba(40,30,70,.55)] ring-1 ring-ink/10 ${BENTO[i] ?? ""}`}>
          <img src={f.photo.src} alt={f.photo.alt} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" style={{ objectPosition: f.pos || "50% 35%" }} />
          <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <span className="absolute left-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-xl shadow-md transition-transform group-hover:rotate-12 group-hover:scale-110">{f.emoji}</span>
          <span className="absolute inset-x-0 bottom-0 p-4 text-white">
            <span className="block font-display text-lg font-extrabold leading-tight sm:text-2xl">{f.title}</span>
            <span className="mt-0.5 block text-xs text-white/85 sm:text-sm">{f.note}</span>
          </span>
        </motion.button>
      ))}
    </div>
  );
}

/* ================= 5. MEMORY GAME: flip the cards, find the matching photos ================= */
const shuffle = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const makeDeck = (items) => shuffle(items.flatMap((p) => [{ k: `${p.id}-a`, p }, { k: `${p.id}-b`, p }]));

function MemoryCard({ card, up, matched, onFlip }) {
  const still = !!useReducedMotion();
  const face = "absolute inset-0 overflow-hidden rounded-2xl [backface-visibility:hidden]";
  return (
    <div style={{ perspective: 800 }} className="aspect-[3/4]">
      <motion.button type="button" onClick={onFlip} aria-label={up ? card.p.alt : "Hidden card, tap to flip"} aria-pressed={up}
        className={`relative block h-full w-full cursor-pointer rounded-2xl outline-none ${matched ? "ring-4 ring-amber-300" : ""}`} style={{ transformStyle: "preserve-3d" }}
        initial={false} animate={{ rotateY: up ? 180 : 0, scale: matched ? 1.03 : 1 }} transition={still ? { duration: 0 } : { type: "spring", stiffness: 220, damping: 22 }} whileTap={still ? undefined : { scale: 0.96 }}>
        <span className={`${face} grid place-items-center bg-gradient-to-br from-violet-500 via-sky-500 to-amber-400 shadow-[0_12px_28px_-12px_rgba(40,30,70,.6)]`}>
          <span aria-hidden className="font-display text-5xl font-extrabold text-white/90 sm:text-6xl">1</span>
          <span aria-hidden className="absolute inset-2 rounded-xl border-2 border-dashed border-white/50" />
        </span>
        <span className={face} style={{ transform: "rotateY(180deg)" }}>
          <img src={card.p.src} alt="" draggable={false} loading="lazy" className="h-full w-full object-cover" style={{ objectPosition: "50% 30%" }} />
        </span>
      </motion.button>
    </div>
  );
}

export function MemoryGame({ items }) {
  const [deck, setDeck] = useState(() => makeDeck(items));
  const [open, setOpen] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [best, setBest] = useState(null);
  const [round, setRound] = useState(0);
  const lock = useRef(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const won = matched.length === items.length;
  const flip = (i) => {
    if (lock.current || open.includes(i) || matched.includes(deck[i].p.id) || won) return;
    const next = [...open, i];
    setOpen(next);
    if (next.length < 2) return;
    const m = moves + 1;
    setMoves(m);
    const [a, b] = next.map((x) => deck[x].p.id);
    if (a === b) {
      setMatched((x) => [...x, a]); setOpen([]);
      if (matched.length + 1 === items.length) setBest((v) => (v == null ? m : Math.min(v, m)));
    } else {
      lock.current = true;
      timer.current = setTimeout(() => { setOpen([]); lock.current = false; }, 850);
    }
  };
  const restart = () => { clearTimeout(timer.current); lock.current = false; setDeck(makeDeck(items)); setOpen([]); setMatched([]); setMoves(0); setRound((r) => r + 1); };
  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-5 flex items-center justify-center gap-3 text-sm font-bold">
        <span className="rounded-full bg-surface px-4 py-2 ring-1 ring-ink/10">Moves: <span className="tabular-nums">{moves}</span></span>
        <span className="rounded-full bg-surface px-4 py-2 ring-1 ring-ink/10">Found: <span className="tabular-nums">{matched.length}/{items.length}</span></span>
        {best != null && <span className="rounded-full bg-amber-300/50 px-4 py-2 ring-1 ring-amber-500/30">Best: {best}</span>}
      </div>
      <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 sm:gap-4">
        {deck.map((c, i) => <MemoryCard key={`${round}-${c.k}`} card={c} up={open.includes(i) || matched.includes(c.p.id)} matched={matched.includes(c.p.id)} onFlip={() => flip(i)} />)}
      </div>
      <div className="mt-6 min-h-[4.5rem] text-center" aria-live="polite">
        <AnimatePresence mode="wait">
          {won ? (
            <motion.p key="won" initial={{ opacity: 0, y: 16, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} className="font-display text-2xl font-extrabold">
              🎉 You found them all in {moves} moves!
            </motion.p>
          ) : (
            <motion.p key="play" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-ink/60">Tap two cards. Match the same photo.</motion.p>
          )}
        </AnimatePresence>
        <button type="button" onClick={restart} className="mt-3 rounded-full bg-ink px-6 py-2.5 text-sm font-bold text-mist transition hover:scale-105">{won ? "Play again" : "Shuffle"}</button>
      </div>
      {won && <Confetti key={`c${round}`} duration={3200} />}
    </div>
  );
}

/* ================= 6. BLESSINGS: avatars with a filling ring, quotes rise out of a blur ================= */
const RING_R = 26, RING_C = 2 * Math.PI * RING_R;
export function Blessings({ items, seconds = 7 }) {
  const still = !!useReducedMotion();
  const [i, setI] = useState(0);
  const cur = items[i];
  const next = () => setI((x) => (x + 1) % items.length);
  return (
    <div className="mx-auto max-w-2xl text-center">
      <div className="flex items-center justify-center gap-3 sm:gap-5" role="tablist" aria-label="Who is wishing">
        {items.map((b, k) => (
          <button key={b.name} type="button" role="tab" aria-selected={k === i} aria-label={b.name} onClick={() => setI(k)} className="relative h-16 w-16 rounded-full outline-none transition-transform hover:scale-105 sm:h-[4.5rem] sm:w-[4.5rem]">
            <svg viewBox="0 0 56 56" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden>
              <circle cx="28" cy="28" r={RING_R} fill="none" strokeWidth="3" className="stroke-ink/10" />
              {k === i && (
                <motion.circle key={`ring-${i}`} cx="28" cy="28" r={RING_R} fill="none" strokeWidth="3" strokeLinecap="round" stroke={b.color} strokeDasharray={RING_C}
                  initial={{ strokeDashoffset: still ? 0 : RING_C }} animate={{ strokeDashoffset: 0 }} transition={{ duration: seconds, ease: "linear" }} onAnimationComplete={still ? undefined : next} />
              )}
            </svg>
            <motion.span animate={{ scale: k === i ? 1 : 0.82, opacity: k === i ? 1 : 0.6 }} transition={SPRING}
              className="absolute inset-[7px] grid place-items-center rounded-full font-display text-xl font-extrabold text-white" style={{ background: b.color }}>
              {b.name[0]}
            </motion.span>
          </button>
        ))}
      </div>
      <div className="mt-8 min-h-[11rem] sm:min-h-[9rem]" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.div key={i} exit={{ opacity: 0, y: -8, transition: { duration: 0.18 } }}>
            <p className="font-display text-2xl font-bold leading-snug sm:text-3xl">
              <span className="sr-only">{cur.text}</span>
              <span aria-hidden>
                “{cur.text.split(" ").map((w, k) => (
                  <motion.span key={k} className="inline-block" initial={still ? false : { opacity: 0, y: 14, filter: "blur(10px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 0.55, delay: k * 0.045, ease: EASE }}>
                    {w}&nbsp;
                  </motion.span>
                ))}”
              </span>
            </p>
            <p className="mt-4 text-sm font-bold uppercase tracking-widest text-ink/60">{cur.name} <span className="font-medium normal-case tracking-normal">· {cur.role}</span></p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ================= 7. RSVP: clock sweeps to the party time, gliding yes/no pill, rolling guest counter ================= */
const parseTime = (t) => {
  const m = /(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i.exec(t || "");
  if (!m) return { h: 6, min: 0, known: false };
  let h = Number(m[1]) % 12; const min = Number(m[2] || 0);
  if ((m[3] || "").toLowerCase() === "pm") h += 12;
  return { h, min, known: true };
};

function Clock({ time }) {
  const still = !!useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  const { h, min } = parseTime(time);
  const hourDeg = (h % 12) * 30 + min * 0.5, minDeg = min * 6;
  const hand = (deg, len, w, color) => (
    <motion.line x1="50" y1="50" x2="50" y2={50 - len} stroke={color} strokeWidth={w} strokeLinecap="round" style={{ originX: 0.5, originY: 1 }}
      initial={{ rotate: still ? deg : 0 }} animate={{ rotate: inView ? deg + 360 : 0 }} transition={still ? { duration: 0 } : { duration: 2.2, ease: [0.3, 0.7, 0.2, 1] }} />
  );
  return (
    <svg ref={ref} viewBox="0 0 100 100" className="h-28 w-28 shrink-0" role="img" aria-label={time ? `Party starts at ${time}` : "Party time coming soon"}>
      <circle cx="50" cy="50" r="46" className="fill-surface stroke-ink/15" strokeWidth="3" />
      {Array.from({ length: 12 }).map((_, k) => <line key={k} x1="50" y1="9" x2="50" y2={k % 3 === 0 ? 16 : 13} className="stroke-ink/40" strokeWidth={k % 3 === 0 ? 2.5 : 1.5} strokeLinecap="round" transform={`rotate(${k * 30} 50 50)`} />)}
      {hand(hourDeg, 22, 4, "#f59e0b")}
      {hand(minDeg, 32, 3, "#8b5cf6")}
      <circle cx="50" cy="50" r="3.5" className="fill-ink" />
    </svg>
  );
}

function Stepper({ value, onChange, min = 1, max = 10 }) {
  const dir = useRef(1);
  const go = (d) => { dir.current = d; onChange(Math.min(max, Math.max(min, value + d))); };
  const b = "grid h-11 w-11 place-items-center rounded-full bg-ink text-xl font-bold text-mist transition hover:scale-110 disabled:opacity-30 disabled:hover:scale-100";
  return (
    <div className="inline-flex items-center gap-4">
      <button type="button" className={b} onClick={() => go(-1)} disabled={value <= min} aria-label="Fewer guests">−</button>
      <div className="relative grid h-14 w-16 place-items-center overflow-hidden rounded-2xl bg-surface ring-1 ring-ink/10" aria-live="polite" aria-label={`${value} guests`}>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span key={value} className="font-display text-3xl font-extrabold tabular-nums" initial={{ y: 28 * dir.current, opacity: 0, filter: "blur(4px)" }} animate={{ y: 0, opacity: 1, filter: "blur(0px)" }} exit={{ y: -28 * dir.current, opacity: 0, filter: "blur(4px)" }} transition={SPRING}>
            {value}
          </motion.span>
        </AnimatePresence>
      </div>
      <button type="button" className={b} onClick={() => go(1)} disabled={value >= max} aria-label="More guests">+</button>
    </div>
  );
}

export function RsvpCard({ title, note, date, time, venue, phone, childName = "Ruhab" }) {
  const [name, setName] = useState("");
  const [going, setGoing] = useState(true);
  const [guests, setGuests] = useState(2);
  const [state, setState] = useState("form"); // form | sent
  const [copied, setCopied] = useState(false);
  const msg = going
    ? `Hi! This is ${name.trim()}. We will be at ${childName}'s 1st birthday on ${date} (${guests} ${guests === 1 ? "guest" : "guests"}) 🎉`
    : `Hi! This is ${name.trim()}. Sorry, we can't make it to ${childName}'s birthday, but sending lots of love 💛`;
  const send = async () => {
    if (!name.trim()) return;
    const num = (phone || "").replace(/\D/g, "");
    if (num) window.open(`https://wa.me/${num}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
    else { try { await navigator.clipboard.writeText(msg); setCopied(true); } catch { /* clipboard blocked */ } }
    setState("sent");
  };
  const seg = "relative z-10 flex-1 rounded-full px-5 py-2.5 text-sm font-bold transition-colors";
  return (
    <div className="mx-auto max-w-2xl overflow-hidden rounded-[2rem] bg-surface p-6 shadow-[0_30px_80px_-40px_rgba(60,40,120,.55)] ring-1 ring-ink/10 sm:p-10">
      <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
        <Clock time={time} />
        <div>
          <h3 className="text-3xl font-extrabold sm:text-4xl">{title}</h3>
          <p className="mt-1 text-ink/70">{note}</p>
          <p className="mt-2 flex flex-wrap justify-center gap-2 text-sm font-semibold sm:justify-start">
            <span className="rounded-full bg-ink/5 px-3 py-1">📅 {date}</span>
            <span className="rounded-full bg-ink/5 px-3 py-1">🕕 {time || "Time coming soon"}</span>
            {venue && <span className="rounded-full bg-ink/5 px-3 py-1">📍 {venue}</span>}
          </p>
        </div>
      </div>
      <AnimatePresence mode="wait" initial={false}>
        {state === "form" ? (
          <motion.div key="form" exit={{ opacity: 0, y: -12 }} className="mt-8 space-y-6">
            <label className="block text-left">
              <span className="text-sm font-bold text-ink/70">Your name</span>
              <input value={name} onChange={(e) => setName(e.target.value)} maxLength={40} placeholder="e.g. Rahim Uncle" autoComplete="name"
                className="mt-1.5 w-full rounded-2xl bg-mist px-4 py-3 text-base outline-none ring-1 ring-ink/15 transition focus:ring-2 focus:ring-violet-500" />
            </label>
            <div role="radiogroup" aria-label="Will you come?" className="relative mx-auto flex max-w-xs rounded-full bg-mist p-1 ring-1 ring-ink/10">
              {[[true, "Yes, I'll come 🎈"], [false, "Can't make it"]].map(([v, l]) => (
                <button key={l} type="button" role="radio" aria-checked={going === v} onClick={() => setGoing(v)} className={`${seg} ${going === v ? "text-[#2b2108]" : "text-ink/60"}`}>
                  {going === v && <motion.span layoutId="rsvp-pill" transition={SPRING} className="absolute inset-0 -z-10 rounded-full bg-amber-300 shadow-md" />}
                  {l}
                </button>
              ))}
            </div>
            <AnimatePresence initial={false}>
              {going && (
                <motion.div key="g" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden text-center">
                  <p className="mb-3 text-sm font-bold text-ink/70">How many of you?</p>
                  <Stepper value={guests} onChange={setGuests} />
                </motion.div>
              )}
            </AnimatePresence>
            <div className="text-center">
              <MagneticButton onClick={send} disabled={!name.trim()} className="rounded-full bg-gradient-to-r from-sky-500 via-violet-500 to-amber-400 px-8 py-3.5 text-base font-bold text-white shadow-lg transition-opacity disabled:cursor-not-allowed disabled:opacity-40">
                {phone ? "Send on WhatsApp" : "Copy my reply"}
              </MagneticButton>
              <p className="mt-2 text-xs text-ink/50">{phone ? "Opens WhatsApp with your reply ready to send." : "Your reply is copied. Paste it to Mama Sakib, Abbu or Ammu."}</p>
            </div>
          </motion.div>
        ) : (
          <motion.div key="sent" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={SPRING} className="mt-8 text-center">
            <svg viewBox="0 0 52 52" className="mx-auto h-20 w-20" aria-hidden>
              <circle cx="26" cy="26" r="24" fill="#10b981" />
              <motion.path d="M14 27l8 8 16-17" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2, duration: 0.5 }} />
            </svg>
            <p className="mt-4 font-display text-2xl font-extrabold">{going ? "See you at the party!" : "Thank you for the love!"}</p>
            <p className="mt-1 text-ink/70">{phone ? "Your message is ready in WhatsApp." : copied ? "Reply copied. Paste it to the family." : "Copy this reply and send it to the family:"}</p>
            {!phone && !copied && <p className="mx-auto mt-3 max-w-sm rounded-2xl bg-mist p-3 text-sm ring-1 ring-ink/10">{msg}</p>}
            <button type="button" onClick={() => { setState("form"); setCopied(false); }} className="mt-5 text-sm font-bold underline underline-offset-4">Edit my reply</button>
          </motion.div>
        )}
      </AnimatePresence>
      {state === "sent" && going && <Confetti duration={2800} />}
    </div>
  );
}
