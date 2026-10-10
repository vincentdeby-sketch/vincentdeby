import { useEffect, useRef, useState } from "react";

// Nombre qui défile jusqu'à sa valeur quand il entre à l'écran (ou change).
// Le rendu serveur affiche directement la valeur finale.
export function CountUp({ value, format = (n: number) => n.toLocaleString("fr-FR"), duration = 900 }: {
  value: number;
  format?: (n: number) => string;
  duration?: number;
}) {
  const [shown, setShown] = useState(value);
  const ref = useRef<HTMLSpanElement | null>(null);
  const from = useRef(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setShown(value); return; }
    let raf = 0;
    const run = () => {
      const start = performance.now();
      const a = from.current;
      const tick = (t: number) => {
        const k = Math.min(1, (t - start) / duration);
        const eased = 1 - Math.pow(1 - k, 3);
        setShown(Math.round(a + (value - a) * eased));
        if (k < 1) raf = requestAnimationFrame(tick); else from.current = value;
      };
      raf = requestAnimationFrame(tick);
    };
    if (started.current) { run(); return () => cancelAnimationFrame(raf); }
    // Déjà à l'écran au montage : on anime tout de suite, sans repasser par zéro.
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) {
      started.current = true;
      from.current = Math.round(value * 0.6);
      run();
      return () => cancelAnimationFrame(raf);
    }
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      started.current = true;
      io.disconnect();
      run();
    }, { threshold: 0.4 });
    setShown(0);
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [value, duration]);

  return <span ref={ref} className="tabular-nums">{format(shown)}</span>;
}
