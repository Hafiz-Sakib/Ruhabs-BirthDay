# Ruhab turns ONE! 🎂

Birthday landing page for Ruhab's 1st birthday (15 December 2026). React + Vite + Tailwind 4 + Framer Motion.

## Run
```bash
npm install
npm run dev      # opens the site; the Congratulations intro shows on every reload in dev
npm run build    # production build in /dist (deploy to Vercel/Netlify)
```

## Change the text
Everything is in **`src/site.js`**: title, tagline, birthday date, party time/venue (empty = hidden), Mama message, footer, and the story chapters (which photo goes in which chapter).

## Photos
All photos are already resized and live in `public/photos/` (`<id>.webp` = big, `<id>-m.webp` = medium).
To add one: put both files there, add a line in `src/photos.js`, then add its id to a chapter in `src/site.js`.

## Welcome animation
`src/components/Intro.jsx`: "Congratulations!" typing + gold confetti, shown only on a visitor's first visit (add `?intro` to the URL to see it again).

## Fun parts
- **Orbit**: photos circling a big "1"
- **Photo table**: drag the polaroids around
- **Balloons**: pop one to read a wish (wishes are in `site.js`)
- **Birthday cake**: tap the flame to blow out the candle, confetti follows
- **Recap**: count-up numbers (days of love, photos)

## Parts
- Hero with tilt photo cards, rolling-digit countdown (to 15 Dec, Bangladesh time)
- Story chapters, tilt carousel (from motion-brew), Mama message, party card with "Add to calendar", day/night switch

## New in v2 (all in `src/components/sections.jsx`, text in `src/site.js`)
1. **Flip words**: "Ruhab is our little [tiger / giggler / crawler...]" flips letter by letter (`flipWords`)
2. **Then & Now**: drag-to-compare slider, newborn vs almost one (`thenLabel`, `nowLabel`)
3. **Timeline of firsts**: line fills while you scroll (`milestones`)
4. **Favourites bento**: photo grid of his favourite things (`favourites`)
5. **Memory game**: flip cards, find the matching photos (`memoryIds`)
6. **Blessings**: avatars with a filling ring, words rise out of blur (`blessings`)
7. **RSVP card**: clock sweeps to party time, yes/no pill, rolling guest counter. Set `rsvpPhone` in `site.js` so the button opens WhatsApp; empty = copies the reply.
Extras: scroll progress bar, magnetic buttons, 11 new photos (`born-*`, `play-*`) added to the story.
