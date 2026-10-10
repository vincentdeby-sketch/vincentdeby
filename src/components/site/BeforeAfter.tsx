import { useId, useState } from "react";
import { PhotoImg } from "./PhotoImg";

// Comparateur avant / après (home staging) : on fait glisser la séparation.
export function BeforeAfter({ before, after, alt }: { before: string; after: string; alt: string }) {
  const [pos, setPos] = useState(50);
  const id = useId();
  return (
    <figure className="relative aspect-[4/3] select-none overflow-hidden rounded-[1.5rem] bg-muted">
      <PhotoImg src={after} width={1280} height={960} sizes="(min-width:1024px) 50vw, 100vw" alt={`${alt}, après`} className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <PhotoImg src={before} width={1280} height={960} sizes="(min-width:1024px) 50vw, 100vw" alt={`${alt}, avant`} className="h-full w-full object-cover" />
      </div>
      <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-paper shadow" style={{ left: `${pos}%` }}>
        <span className="absolute top-1/2 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-brand text-ink shadow-lg">⇆</span>
      </div>
      <span className="absolute left-3 top-3 rounded-full bg-ink/80 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-paper">Avant</span>
      <span className="absolute right-3 top-3 rounded-full bg-brand px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-ink">Après</span>
      <label htmlFor={id} className="sr-only">Position de la comparaison avant / après</label>
      <input id={id} type="range" min={0} max={100} value={pos} onChange={(e) => setPos(Number(e.target.value))} className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0" />
    </figure>
  );
}
