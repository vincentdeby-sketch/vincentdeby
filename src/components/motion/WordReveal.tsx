import type { ReactNode } from "react";
import { useScrollProgress } from "./useScrollProgress";

// Texte dont les mots s'éclairent un à un au rythme du défilement.
export function WordReveal({ text, highlight, className = "" }: { text: string; highlight?: string; className?: string }) {
  const [ref, p] = useScrollProgress<HTMLParagraphElement>(0.9, 0.5);
  const words = text.split(" ");
  const lit = Math.round(p * words.length);
  const hl = highlight ? highlight.split(" ") : [];
  const hlStart = highlight ? words.join(" ").indexOf(highlight) : -1;
  const hlFirst = hlStart >= 0 ? words.join(" ").slice(0, hlStart).split(" ").length - 1 : -1;
  const out: ReactNode[] = words.map((w, i) => {
    const inHl = hlFirst >= 0 && i >= hlFirst && i < hlFirst + hl.length;
    return (
      <span key={i} className={`transition-opacity duration-300 ${i < lit ? "opacity-100" : "opacity-20"} ${inHl ? `mark-draw ${p > 0.98 ? "is-drawn" : ""}` : ""}`}>
        {w}{i < words.length - 1 ? " " : ""}
      </span>
    );
  });
  return (
    <p ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{out}</span>
    </p>
  );
}
