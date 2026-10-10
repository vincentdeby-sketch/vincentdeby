import { useEffect, useState } from "react";

const COLORS = ["#4eae32", "#2c6a1b", "#e3f1dc", "#121411", "#86d06a"];

// Pluie de confettis discrète, une seule fois, pour saluer un envoi de formulaire.
export function Confetti({ count = 46 }: { count?: number }) {
  const [pieces, setPieces] = useState<React.CSSProperties[]>([]);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setPieces(
      Array.from({ length: count }, () => ({
        ["--x" as string]: `${Math.random() * 100}%`,
        ["--dx" as string]: `${(Math.random() - 0.5) * 30}vw`,
        ["--r" as string]: `${Math.random() * 360}deg`,
        ["--d" as string]: `${1.8 + Math.random() * 1.6}s`,
        ["--delay" as string]: `${Math.random() * 0.4}s`,
        ["--c" as string]: COLORS[Math.floor(Math.random() * COLORS.length)],
      })),
    );
    const t = setTimeout(() => setPieces([]), 4000);
    return () => clearTimeout(t);
  }, [count]);
  if (!pieces.length) return null;
  return (
    <div className="confetti" aria-hidden="true">
      {pieces.map((style, i) => <i key={i} style={style} />)}
    </div>
  );
}
