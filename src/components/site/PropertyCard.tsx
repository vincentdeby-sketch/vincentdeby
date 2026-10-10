import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import type { Property } from "@/lib/domain";
import { formatEUR } from "@/lib/domain";
import { PhotoImg } from "./PhotoImg";

export function PropertyCard({ p, highlighted = false }: { p: Property & { exclusive?: boolean }; highlighted?: boolean }) {
  // Aperçu au survol : les premières photos défilent sans cliquer (souris uniquement).
  const shots = [p.cover_url, ...(p.photos ?? [])].filter(Boolean).slice(0, 5) as string[];
  const [hover, setHover] = useState(false);
  const [shot, setShot] = useState(0);
  useEffect(() => {
    if (!hover || shots.length < 2) { setShot(0); return; }
    const t = setInterval(() => setShot((s) => (s + 1) % shots.length), 1100);
    return () => clearInterval(t);
  }, [hover, shots.length]);
  const place = p.city && p.postal_code ? `${p.city} (${p.postal_code})` : p.city;
  const facts = [p.surface ? `${p.surface} m²` : null, p.rooms ? `${p.rooms} p.` : null, p.bedrooms ? `${p.bedrooms} ch.` : null].filter(Boolean);
  return (
    <article>
      <Link
        to="/biens/$id"
        params={{ id: p.id }}
        className="group block rounded-[1.5rem]"
        onPointerEnter={(e) => e.pointerType === "mouse" && setHover(true)}
        onPointerLeave={() => setHover(false)}
      >
        <div
          className={`relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-muted transition-shadow duration-300 ${highlighted ? "ring-2 ring-brand ring-offset-4 ring-offset-background" : ""}`}
          data-cursor="Voir"
        >
          {shots.length > 1 && hover && (
            <div className="absolute inset-x-3 bottom-3 z-10 flex gap-1" aria-hidden="true">
              {shots.map((_, i) => <span key={i} className={`h-0.5 flex-1 rounded-full ${i === shot ? "bg-paper" : "bg-paper/40"}`} />)}
            </div>
          )}
          {p.cover_url ? (
            <PhotoImg
              key={shots[shot]}
              style={{ viewTransitionName: shot === 0 ? `bien-${p.id}` : undefined }}
              src={shots[shot]}
              width={640}
              height={480}
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              alt={`${p.title}${p.city ? `, ${p.city}` : ""}`}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
            />
          ) : (
            <div className="grid h-full w-full place-items-center font-mono text-xs uppercase tracking-[0.08em] text-muted-foreground">
              Photos à venir
            </div>
          )}
          <span className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1.5 text-sm font-medium tabular-nums backdrop-blur">
            {formatEUR(p.price)}
          </span>
          {p.exclusive && (
            <span className="absolute right-3 top-3 rounded-full bg-brand px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-ink">
              Exclusivité
            </span>
          )}
          <span className="absolute bottom-3 right-3 grid h-10 w-10 translate-y-2 place-items-center rounded-full bg-brand text-ink opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </span>
        </div>
        <div className="px-1 pt-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
            {[place, ...facts].filter(Boolean).join(" · ")}
          </p>
          <h3 className="mt-2 text-xl leading-snug">
            <span className="line-clamp-2 bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 group-hover:bg-[length:100%_1px]">
              {p.title}
            </span>
          </h3>
        </div>
      </Link>
    </article>
  );
}
