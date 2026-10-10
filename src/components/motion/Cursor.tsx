import { useEffect, useRef, useState } from "react";

// Point vert qui suit le pointeur, grossit sur les liens et affiche « Voir » sur les photos.
// Le curseur système reste visible ; rien sur écran tactile ni si les animations sont réduites.
export function Cursor() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<"" | "is-hover" | "is-label">("");
  const [label, setLabel] = useState("");

  useEffect(() => {
    const ok = window.matchMedia("(hover: hover) and (pointer: fine)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(ok);
    if (!ok) return;
    let x = -100, y = -100, cx = -100, cy = -100, raf = 0;
    const onMove = (e: PointerEvent) => {
      x = e.clientX; y = e.clientY;
      const t = e.target as HTMLElement;
      const labelled = t.closest<HTMLElement>("[data-cursor]");
      if (labelled) { setMode("is-label"); setLabel(labelled.dataset.cursor ?? ""); }
      else if (t.closest("a, button, [role=button], input, select, textarea, label")) setMode("is-hover");
      else setMode("");
    };
    const loop = () => {
      cx += (x - cx) * 0.22; cy += (y - cy) * 0.22;
      if (ref.current) ref.current.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    const onLeave = () => { x = -100; y = -100; };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(loop);
    return () => { window.removeEventListener("pointermove", onMove); document.removeEventListener("pointerleave", onLeave); cancelAnimationFrame(raf); };
  }, []);

  if (!enabled) return null;
  return (
    <div ref={ref} className={`cursor-dot ${mode}`} aria-hidden="true">
      <span>{label}</span>
    </div>
  );
}
