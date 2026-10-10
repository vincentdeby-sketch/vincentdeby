import { useEffect, useRef, useState } from "react";

// Avancement (0 → 1) d'un élément pendant qu'il traverse l'écran.
export function useScrollProgress<T extends HTMLElement>(start = 0.85, end = 0.25) {
  const ref = useRef<T | null>(null);
  const [p, setP] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setP(1); return; }
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 quand le haut de l'élément atteint `start` de l'écran, 1 quand son bas atteint `end`.
      const from = vh * start;
      const to = vh * end - r.height;
      setP(Math.min(1, Math.max(0, (from - r.top) / (from - to))));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); cancelAnimationFrame(raf); };
  }, [start, end]);
  return [ref, p] as const;
}
