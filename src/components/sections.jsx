import { useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useInView, useMotionValue, useReducedMotion, useScroll, useSpring } from "framer-motion";

/* New pieces, same spring-and-glide style as the rest of the site (ideas from motion-brew.com).
   FlipWords, ThenNow, Timeline, Favourites, Blessings, StoryReel, PanelGallery
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

/* ================= STORY REEL: tap through photos like Instagram stories (tap sides, hold to pause) ================= */
export function StoryReel({ items, seconds = 4.5, onOpen }) {
  const still = !!useReducedMotion();
  const box = useRef(null);
  const inView = useInView(box, { margin: "-15%" });
  const [i, setI] = useState(0);
  const [p, setP] = useState(0);
  const [hold, setHold] = useState(false);
  const n = items.length;
  const go = (d) => { setI((x) => (x + d + n) % n); setP(0); };
  useEffect(() => {
    if (still || hold || !inView) return;
    let raf, last = performance.now();
    const tick = (t) => {
      const dt = (t - last) / 1000; last = t;
      setP((v) => {
        const nv = v + dt / seconds;
        if (nv >= 1) { setI((x) => (x + 1) % n); return 0; }
        return nv;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [still, hold, inView, n, seconds]);
  const cur = items[i];
  return (
    <div ref={box} className="mx-auto w-full max-w-xs sm:max-w-sm">
      <div className="relative aspect-[9/16] select-none overflow-hidden rounded-[2rem] bg-black shadow-[0_30px_80px_-30px_rgba(40,30,70,.7)] ring-1 ring-ink/10"
        onPointerDown={() => setHold(true)} onPointerUp={() => setHold(false)} onPointerLeave={() => setHold(false)} onPointerCancel={() => setHold(false)}>
        <AnimatePresence initial={false}>
          <motion.img key={cur.photo.id} src={cur.photo.src} alt={cur.photo.alt} draggable={false}
            initial={{ opacity: 0, scale: 1.12 }} animate={{ opacity: 1, scale: still ? 1 : 1.0 }} exit={{ opacity: 0 }} transition={{ duration: 0.6, ease: EASE }}
            className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: cur.pos || "50% 35%" }} />
        </AnimatePresence>
        <span aria-hidden className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/70" />
        <div className="absolute inset-x-3 top-3 flex gap-1.5" aria-hidden>
          {items.map((_, k) => (
            <span key={k} className="h-1 flex-1 overflow-hidden rounded-full bg-white/30">
              <span className="block h-full origin-left rounded-full bg-white" style={{ transform: `scaleX(${k < i ? 1 : k === i ? p : 0})` }} />
            </span>
          ))}
        </div>
        <div className="absolute inset-x-0 top-7 flex items-center gap-2 px-4 text-white">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-amber-300 to-violet-500 font-display text-sm font-extrabold">R</span>
          <span className="text-sm font-bold">Ruhab</span>
          <span className="text-xs text-white/70">{i + 1} / {n}</span>
        </div>
        <button type="button" aria-label="Previous story" onClick={() => go(-1)} className="absolute inset-y-16 left-0 w-1/3 cursor-w-resize outline-none" />
        <button type="button" aria-label="Next story" onClick={() => go(1)} className="absolute inset-y-16 right-0 w-2/3 cursor-e-resize outline-none" />
        <AnimatePresence mode="wait">
          <motion.div key={cur.photo.id} initial={{ opacity: 0, y: 18, filter: "blur(8px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
            className="pointer-events-none absolute inset-x-0 bottom-0 p-5 text-white">
            <p className="font-display text-3xl font-extrabold leading-tight">{cur.title}</p>
            <p className="mt-1 text-sm text-white/85">{cur.note}</p>
          </motion.div>
        </AnimatePresence>
      </div>
      <p className="mt-4 text-center text-sm text-ink/60">Tap the sides to move. Hold to pause.{onOpen && <> <button type="button" onClick={() => onOpen(cur.photo.id)} className="font-bold underline underline-offset-4">Open big</button></>}</p>
    </div>
  );
}

/* ================= PANEL GALLERY: hover or tap a panel and it opens wide ================= */
export function PanelGallery({ items, onOpen }) {
  const still = !!useReducedMotion();
  const [a, setA] = useState(0);
  return (
    <div className="mx-auto flex h-[34rem] max-w-5xl flex-col gap-2 sm:h-[30rem] sm:flex-row sm:gap-3" onPointerLeave={() => {}}>
      {items.map((it, k) => {
        const on = k === a;
        return (
          <motion.div key={it.photo.id} layout role="button" tabIndex={0} aria-label={`${it.title}${on ? ": open photo" : ""}`}
            onPointerEnter={(e) => e.pointerType === "mouse" && setA(k)} onFocus={() => setA(k)}
            onClick={() => (on ? onOpen(it.photo.id) : setA(k))} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), on ? onOpen(it.photo.id) : setA(k))}
            animate={{ flexGrow: on ? 5 : 1 }} transition={still ? { duration: 0 } : { type: "spring", stiffness: 180, damping: 26 }}
            className={`relative min-h-0 min-w-0 basis-0 overflow-hidden rounded-3xl shadow-[0_18px_40px_-22px_rgba(40,30,70,.55)] ring-1 ring-ink/10 ${on ? "cursor-zoom-in" : "cursor-pointer"}`}>
            <img src={it.photo.src} alt={it.photo.alt} loading="lazy" decoding="async" draggable={false} className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: it.pos || "50% 35%" }} />
            <motion.span aria-hidden animate={{ opacity: on ? 0.9 : 0.55 }} className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-black/20" />
            <span className="absolute left-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-lg shadow">{it.emoji}</span>
            <motion.span animate={{ opacity: on ? 1 : 0, y: on ? 0 : 12 }} transition={{ duration: 0.35, delay: on ? 0.12 : 0 }} className="pointer-events-none absolute inset-x-0 bottom-0 p-4 text-white sm:p-5">
              <span className="block font-display text-2xl font-extrabold leading-tight sm:text-3xl">{it.title}</span>
              <span className="mt-0.5 block text-sm text-white/85">{it.note}</span>
            </motion.span>
          </motion.div>
        );
      })}
    </div>
  );
}
