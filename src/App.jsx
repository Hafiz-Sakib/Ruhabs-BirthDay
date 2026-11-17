import { useCallback, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { site, chapters, milestones, favourites, reel, panels, blessings } from "./site";
import { photos, allPhotos } from "./photos";
import ThemeToggle from "./components/ThemeToggle";
import { Intro, useIntro } from "./components/Intro";
import { BlurText, Countdown, Lightbox, Reveal, TiltCard } from "./components/fx";
import { TiltCarousel } from "./components/tilt-carousel";
import { Balloons, Cake, Orbit, PolaroidTable, Recap } from "./components/party";
import { Blessings, FlipWords, Favourites, MagneticButton, PanelGallery, ScrollProgress, StoryReel, ThenNow, Timeline } from "./components/sections";

const TARGET = new Date(`${site.birthday}T00:00:00+06:00`).getTime(); // Bangladesh time
const gradient = "bg-gradient-to-r from-sky-500 via-violet-500 to-amber-400 bg-clip-text text-transparent";
const ymd = (d) => d.toISOString().slice(0, 10).replace(/-/g, "");
const calendarUrl = () => {
  const start = new Date(`${site.birthday}T00:00:00Z`), end = new Date(start.getTime() + 864e5);
  const q = new URLSearchParams({ action: "TEMPLATE", text: site.calendarTitle, dates: `${ymd(start)}/${ymd(end)}`, details: site.partyNote, location: site.venue });
  return `https://calendar.google.com/calendar/render?${q}`;
};
const daysOld = () => Math.max(0, Math.floor((Date.now() - new Date(`${site.birthDate}T00:00:00+06:00`).getTime()) / 864e5));
const useWidth = () => {
  const [w, setW] = useState(() => window.innerWidth);
  useEffect(() => { const f = () => setW(window.innerWidth); window.addEventListener("resize", f); return () => window.removeEventListener("resize", f); }, []);
  return w;
};

function Photo({ p, onOpen, eager }) {
  return (
    <TiltCard onClick={onOpen} label={`Open photo: ${p.alt}`}>
      <img src={p.src} alt={p.alt} width={p.w} height={p.h} loading={eager ? "eager" : "lazy"} decoding="async" className="block h-auto w-full" />
    </TiltCard>
  );
}

export default function App() {
  const [intro, introDone] = useIntro();
  const [open, setOpen] = useState(null);
  const still = !!useReducedMotion();
  const w = useWidth();
  const close = useCallback(() => setOpen(null), []);
  const openId = (id) => setOpen(allPhotos.findIndex((p) => p.id === id));
  const cw = Math.max(210, Math.min(360, Math.round(w * 0.5)));
  const stats = [
    { value: daysOld(), label: "days of love", color: "#f59e0b" },
    { value: allPhotos.length, label: "photos in this story", color: "#38bdf8" },
    { text: "1", label: "very loved boy", color: "#8b5cf6" },
  ];
  const orbitIds = ["newborn-awake", "newborn-yawn", "berry-face", "n-crawl", "n-outdoor-blue", "play-highchair", "n-tummy-yellow", "n-tummy-vest", "red-curtain-stand", "born-yellow-hood"];
  const tableIds = ["n-flower-ear", "newborn-sleep", "n-grandpa", "eid-salami", "n-green-mama", "train-window", "n-family-floor", "play-plush", "n-sherwani", "smile-pink", "n-garden-couple"];
  const hero = ["newborn-awake", "berry-face", "red-curtain-stand"].map((id) => photos[id]);
  const miles = milestones.map((m) => ({ ...m, photo: photos[m.photo] }));
  const favs = favourites.map((f) => ({ ...f, photo: photos[f.photo] }));
  const reelItems = reel.map((r) => ({ ...r, photo: photos[r.photo] }));
  const panelItems = panels.map((r) => ({ ...r, photo: photos[r.photo] }));
  const rot = ["-rotate-6 translate-y-4", "z-10 scale-110", "rotate-6 translate-y-4"];

  return (
    <>
      {intro && <Intro onDone={introDone} />}

      <ScrollProgress />
      <header className="sticky top-0 z-40 border-b border-ink/5 bg-mist/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <a href="#top" className="flex items-center gap-2.5 font-display text-lg font-bold">
            <img src="/favicon.svg" alt="" width="32" height="32" className="h-8 w-8 rounded-[22%]" />
            {site.name} <span className={gradient}>· 1</span>
          </a>
          <nav className="flex items-center gap-4 text-sm font-semibold">
            <a href="#firsts" className="hidden text-ink/70 hover:text-ink md:inline">Firsts</a>
            <a href="#story" className="hidden text-ink/70 hover:text-ink sm:inline">Story</a>
            <a href="#play" className="hidden text-ink/70 hover:text-ink sm:inline">Play</a>
            <a href="#party" className="hidden text-ink/70 hover:text-ink sm:inline">Party</a>
            <a href="#reel" className="hidden text-ink/70 hover:text-ink md:inline">Reel</a>
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <main id="top">
        {/* HERO */}
        <section className="relative mx-auto max-w-6xl px-5 pb-10 pt-12 text-center sm:pt-16">
          {!still && [["8%", "18%", 0], ["88%", "10%", 1.2], ["16%", "62%", 2.4], ["84%", "58%", 0.6]].map(([l, t, d], i) => (
            <span key={i} aria-hidden className="floaty absolute -z-0 h-3 w-3 rounded-full bg-amber-400/80" style={{ left: l, top: t, animationDelay: `${d}s` }} />
          ))}
          <motion.p initial={still ? false : { opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: intro ? 6.2 : 0.1 }}
            className="mx-auto inline-block rounded-full bg-amber-300/40 px-4 py-1.5 text-sm font-bold tracking-wide text-ink ring-1 ring-amber-500/30">
            🎂 {site.badge}
          </motion.p>
          <h1 className="mx-auto mt-5 max-w-3xl text-5xl font-extrabold leading-[1.02] sm:text-7xl">
            <BlurText text={site.heroLine} accent="ONE" accentClass={gradient} delay={intro ? 6.3 : 0.2} />
          </h1>
          <Reveal delay={0.3}><p className="mx-auto mt-5 max-w-xl text-base text-ink/70 sm:text-xl">{site.tagline}</p></Reveal>

          <div className="mx-auto mt-12 flex max-w-2xl items-end justify-center -space-x-5 sm:-space-x-8">
            {hero.map((p, i) => (
              <div key={p.id} className={`w-[34vw] max-w-[15rem] transition-transform sm:w-56 ${rot[i]} ${i === 1 ? "w-[42vw] max-w-[18rem] sm:w-72" : ""}`}>
                <Photo p={p} eager onOpen={() => openId(p.id)} />
              </div>
            ))}
          </div>

          <MagneticButton onClick={() => document.getElementById("countdown")?.scrollIntoView({ behavior: "smooth" })} className="mt-10 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-bold text-mist shadow-lg">
            See the countdown <span aria-hidden>↓</span>
          </MagneticButton>
        </section>

        {/* NEW 1: FLIP WORDS */}
        <section className="mx-auto max-w-5xl px-5 py-8">
          <Reveal><FlipWords prefix={site.flipPrefix} words={site.flipWords} /></Reveal>
        </section>

        {/* COUNTDOWN */}
        <section id="countdown" className="mx-auto max-w-4xl scroll-mt-20 px-5 py-14">
          <Reveal className="rounded-[2rem] bg-gradient-to-br from-amber-200/60 via-sky-200/50 to-violet-200/60 p-6 text-center ring-1 ring-ink/10 sm:p-12 dark:from-amber-400/10 dark:via-sky-400/10 dark:to-violet-400/15">
            <h2 className="mb-7 text-2xl font-extrabold sm:text-4xl">{site.countdownTitle}</h2>
            <Countdown target={TARGET} done={site.countdownDone} />
          </Reveal>
        </section>

        {/* RECAP */}
        <section className="mx-auto max-w-6xl px-5 py-16">
          <div className="mb-10 text-center">
            <h2 className="text-4xl font-extrabold sm:text-6xl"><BlurText text={site.recapTitle} /></h2>
            
          </div>
          <Recap stats={stats} />
        </section>

        {/* NEW 3: TIMELINE */}
        <section id="firsts" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-16">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-extrabold sm:text-6xl"><BlurText text={site.firstsTitle} accent="firsts" accentClass={gradient} /></h2>
            <Reveal delay={0.2}><p className="mx-auto mt-3 max-w-lg text-ink/70 sm:text-lg">{site.firstsNote}</p></Reveal>
          </div>
          <Timeline items={miles} onOpen={openId} />
        </section>

        {/* STORY */}
        <section id="story" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-10">
          <div className="mb-14 text-center">
            <h2 className="text-4xl font-extrabold sm:text-6xl"><BlurText text={site.journeyTitle} accent="year," accentClass={gradient} /></h2>
            <Reveal delay={0.2}><p className="mx-auto mt-4 max-w-lg text-ink/70 sm:text-lg">{site.journeyNote}</p></Reveal>
          </div>
          <div className="space-y-20">
            {chapters.map((c, ci) => (
              <div key={c.title} className="grid gap-8 lg:grid-cols-[minmax(0,17rem)_1fr] lg:gap-12">
                <Reveal className="lg:sticky lg:top-28 lg:self-start">
                  <p className="text-sm font-bold uppercase tracking-widest text-amber-600 dark:text-amber-300">Chapter {ci + 1}</p>
                  <h3 className="mt-1 text-3xl font-extrabold sm:text-4xl">{c.title}</h3>
                  <p className="mt-2 text-ink/70">{c.note}</p>
                </Reveal>
                <div className="columns-2 gap-4 sm:columns-3 lg:columns-2 xl:columns-3 [&>*]:mb-4">
                  {c.photos.map((id, i) => (
                    <Reveal key={id} delay={(i % 3) * 0.08} className="break-inside-avoid"><Photo p={photos[id]} onOpen={() => openId(id)} /></Reveal>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* NEW 2: THEN & NOW */}
        <section className="mx-auto max-w-6xl px-5 py-16">
          <div className="mb-10 text-center">
            <h2 className="text-4xl font-extrabold sm:text-6xl"><BlurText text={site.thenNowTitle} /></h2>
            <Reveal delay={0.2}><p className="mx-auto mt-3 max-w-lg text-ink/70 sm:text-lg">{site.thenNowNote}</p></Reveal>
          </div>
          <Reveal><ThenNow before={photos["born-yellow-hood"]} after={photos["play-tummy-floor"]} beforeLabel={site.thenLabel} afterLabel={site.nowLabel} onOpen={openId} /></Reveal>
        </section>

        {/* ORBIT */}
        <section className="mx-auto max-w-6xl px-5 py-16">
          <div className="mb-10 text-center">
            <h2 className="text-4xl font-extrabold sm:text-6xl"><BlurText text={site.orbitTitle} /></h2>
            <Reveal delay={0.2}><p className="mx-auto mt-3 max-w-lg text-ink/70 sm:text-lg">{site.orbitNote}</p></Reveal>
          </div>
          <Reveal><Orbit items={orbitIds.map((id) => photos[id])} onOpen={openId} /></Reveal>
        </section>

        {/* TABLE */}
        <section className="mx-auto max-w-6xl px-5 py-16">
          <div className="mb-10 text-center">
            <h2 className="text-4xl font-extrabold sm:text-6xl"><BlurText text={site.tableTitle} /></h2>
            <Reveal delay={0.2}><p className="mx-auto mt-3 max-w-lg text-ink/70 sm:text-lg">{site.tableNote}</p></Reveal>
          </div>
          <PolaroidTable items={tableIds.map((id) => photos[id])} onOpen={openId} />
        </section>

        {/* NEW 4: FAVOURITES (bento) */}
        <section className="mx-auto max-w-6xl px-5 py-16">
          <div className="mb-10 text-center">
            <h2 className="text-4xl font-extrabold sm:text-6xl"><BlurText text={site.favTitle} /></h2>
            <Reveal delay={0.2}><p className="mx-auto mt-3 max-w-lg text-ink/70 sm:text-lg">{site.favNote}</p></Reveal>
          </div>
          <Favourites items={favs} onOpen={openId} />
        </section>

        {/* MOMENTS (tilt carousel from motion-brew) */}
        <section className="py-16">
          <h2 className="mb-6 px-5 text-center text-3xl font-extrabold sm:text-5xl">{site.momentsTitle}</h2>
          <TiltCarousel items={allPhotos.map((p) => ({ src: p.src, title: p.alt, alt: p.alt }))} cardWidth={cw} cardHeight={Math.round(cw * 1.25)} label="Photos of Ruhab" />
        </section>

        {/* NEW 5: PANEL GALLERY */}
        <section className="mx-auto max-w-6xl px-5 py-16">
          <div className="mb-10 text-center">
            <h2 className="text-4xl font-extrabold sm:text-6xl"><BlurText text={site.panelTitle} /></h2>
            <Reveal delay={0.2}><p className="mx-auto mt-3 max-w-lg text-ink/70 sm:text-lg">{site.panelNote}</p></Reveal>
          </div>
          <PanelGallery items={panelItems} onOpen={openId} />
        </section>

        {/* BALLOONS */}
        <section id="play" className="mx-auto scroll-mt-20 max-w-6xl px-5 py-16">
          <div className="mb-10 text-center">
            <h2 className="text-4xl font-extrabold sm:text-6xl"><BlurText text={site.balloonTitle} /></h2>
            <Reveal delay={0.2}><p className="mx-auto mt-3 max-w-lg text-ink/70 sm:text-lg">{site.balloonNote}</p></Reveal>
          </div>
          <Balloons wishes={site.wishes} />
        </section>

        {/* CAKE */}
        <section className="mx-auto max-w-6xl px-5 py-16">
          <div className="mb-10 text-center">
            <h2 className="text-4xl font-extrabold sm:text-6xl"><BlurText text={site.cakeTitle} /></h2>
            <Reveal delay={0.2}><p className="mx-auto mt-3 max-w-lg text-ink/70 sm:text-lg">{site.cakeNote}</p></Reveal>
          </div>
          <Cake />
        </section>

        {/* NEW 6: BLESSINGS */}
        <section className="mx-auto max-w-5xl px-5 py-16">
          <div className="mb-10 text-center">
            <h2 className="text-4xl font-extrabold sm:text-6xl"><BlurText text={site.blessingsTitle} /></h2>
            <Reveal delay={0.2}><p className="mx-auto mt-3 max-w-lg text-ink/70 sm:text-lg">{site.blessingsNote}</p></Reveal>
          </div>
          <Blessings items={blessings} />
        </section>

        {/* MAMA */}
        <section className="mx-auto max-w-5xl px-5 py-14">
          <Reveal className="grid items-center gap-8 overflow-hidden rounded-[2rem] bg-surface p-6 shadow-[0_30px_80px_-40px_rgba(60,40,120,.5)] ring-1 ring-ink/10 sm:p-10 md:grid-cols-[1fr_16rem]">
            <div>
              <h2 className="text-3xl font-extrabold leading-tight sm:text-5xl"><span className={gradient}>{site.mamaTitle}</span></h2>
              <p className="mt-4 text-lg text-ink/70">{site.mamaNote}</p>
            </div>
            <div className="mx-auto w-52 rotate-3 md:w-full"><Photo p={photos["mama-hug"]} onOpen={() => openId("mama-hug")} /></div>
          </Reveal>
        </section>

        {/* PARTY */}
        <section id="party" className="mx-auto max-w-3xl scroll-mt-20 px-5 py-14">
          <Reveal className="rounded-[2rem] bg-surface p-8 text-center text-ink shadow-[0_30px_80px_-40px_rgba(60,40,120,.5)] ring-1 ring-ink/10 sm:p-12">
            <p className="text-sm font-bold uppercase tracking-widest text-amber-600 dark:text-amber-300">You are invited</p>
            <h2 className="mt-2 text-4xl font-extrabold sm:text-6xl">{site.partyTitle}</h2>
            <p className="mt-3 text-lg opacity-80">{site.partyNote}</p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3 text-base font-semibold">
              <span className="rounded-full bg-ink/5 px-5 py-2.5">📅 {site.badge}</span>
              {site.time && <span className="rounded-full bg-ink/5 px-5 py-2.5">🕕 {site.time}</span>}
              {site.venue && <span className="rounded-full bg-ink/5 px-5 py-2.5">📍 {site.venue}</span>}
            </div>
            <a href={calendarUrl()} target="_blank" rel="noreferrer" className="mt-8 inline-flex rounded-full bg-amber-300 px-7 py-3.5 font-bold text-[#2b2108] transition hover:scale-105">Add to calendar</a>
          </Reveal>
        </section>

        {/* NEW 7: STORY REEL */}
        <section id="reel" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-16">
          <div className="mb-10 text-center">
            <h2 className="text-4xl font-extrabold sm:text-6xl"><BlurText text={site.reelTitle} /></h2>
            <Reveal delay={0.2}><p className="mx-auto mt-3 max-w-lg text-ink/70 sm:text-lg">{site.reelNote}</p></Reveal>
          </div>
          <StoryReel items={reelItems} onOpen={openId} />
        </section>
      </main>

      <footer className="px-5 pb-10 pt-12 text-center">
        <h2 className="text-3xl font-extrabold sm:text-5xl"><span className={gradient}>{site.footerTitle}</span></h2>
        <p className="mx-auto mt-3 max-w-md text-ink/70">{site.footerNote}</p>
        <p className="mt-6 text-xs text-ink/50">© {new Date().getFullYear()} · {site.madeBy}</p>
      </footer>

      <Lightbox list={allPhotos} index={open} onClose={close} onIndex={setOpen} />
    </>
  );
}
