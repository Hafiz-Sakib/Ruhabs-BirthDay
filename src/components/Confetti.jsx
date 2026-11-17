import { useEffect, useRef } from "react";

// Gold confetti (paper bits, curly ribbons, dots) that falls from the top of the screen.
// Pieces are spawned for `duration` ms, then the ones still on screen keep falling until they leave. Then onDone() is called.
const GOLDS = ["#f7d54a", "#e8b923", "#d4a017", "#f2c94c", "#c99a1c", "#ffe27a", "#b8860b"];
const rand = (a, b) => a + Math.random() * (b - a);
const pick = (list) => list[Math.floor(Math.random() * list.length)];

export function Confetti({ duration = 4000, onDone }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    let W = 0, H = 0, raf = 0, last = performance.now(), start = last, finished = false;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const pieces = [];
    const spawn = (n) => {
      for (let i = 0; i < n; i++) {
        const kind = Math.random() < 0.55 ? "paper" : Math.random() < 0.6 ? "ribbon" : "dot";
        pieces.push({
          kind, color: pick(GOLDS),
          x: rand(0, W), y: rand(-60, -10),
          vy: rand(90, 230),            // px / second
          sway: rand(15, 55), swaySpeed: rand(1.2, 3.2), phase: rand(0, 6.28),
          rot: rand(0, 6.28), vr: rand(-4, 4),
          flip: rand(0, 6.28), vf: rand(3, 9),
          size: kind === "dot" ? rand(2, 4.5) : kind === "ribbon" ? rand(26, 60) : rand(6, 13),
          age: 0,
        });
      }
    };

    const draw = (p) => {
      const x = p.x + Math.sin(p.phase + p.age * p.swaySpeed) * p.sway;
      ctx.save();
      ctx.translate(x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color; ctx.strokeStyle = p.color;
      if (p.kind === "dot") {
        ctx.beginPath(); ctx.arc(0, 0, p.size, 0, 6.283); ctx.fill();
      } else if (p.kind === "paper") {
        ctx.scale(1, Math.cos(p.flip));
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      } else {
        const s = p.size, k = Math.sin(p.flip) * s * 0.35;
        ctx.lineWidth = 2.6; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(-s / 2, 0);
        ctx.bezierCurveTo(-s / 4, k, s / 4, -k, s / 2, 0);
        ctx.stroke();
      }
      ctx.restore();
    };

    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      const t = now - start;
      if (t < duration) spawn(Math.round(rand(1.5, 3) * (dt * 60)));
      ctx.clearRect(0, 0, W, H);
      for (let i = pieces.length - 1; i >= 0; i--) {
        const p = pieces[i];
        p.age += dt; p.y += p.vy * dt; p.rot += p.vr * dt; p.flip += p.vf * dt;
        if (p.y > H + 40) { pieces.splice(i, 1); continue; }
        draw(p);
      }
      if (t >= duration && pieces.length === 0) { if (!finished) { finished = true; onDone?.(); } return; }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [duration]); // eslint-disable-line react-hooks/exhaustive-deps

  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-[110] h-full w-full" />;
}
