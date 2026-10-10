import { useRef, type ReactNode } from "react";

// Effet magnétique : l'élément se décale légèrement vers le pointeur quand il approche (souris uniquement).
export function Magnetic({ children, strength = 0.25, className = "" }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const move = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current!;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * strength;
    const y = (e.clientY - (r.top + r.height / 2)) * strength;
    el.style.transform = `translate(${x}px, ${y}px)`;
  };
  const reset = () => { if (ref.current) ref.current.style.transform = ""; };
  return (
    <span
      ref={ref}
      onPointerMove={move}
      onPointerLeave={reset}
      // La classe d'affichage (ex. « hidden sm:inline-block ») vient de l'appelant s'il en fournit une.
      className={`${/\b(hidden|block|inline-block|flex|inline-flex)\b/.test(className) ? "" : "inline-block"} transition-transform duration-300 ease-out ${className}`}
    >
      {children}
    </span>
  );
}
