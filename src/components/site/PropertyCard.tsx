import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { Property } from "@/lib/domain";
import { formatEUR } from "@/lib/domain";
import { PhotoImg } from "./PhotoImg";

export function PropertyCard({ p }: { p: Property }) {
  const facts = [p.surface ? `${p.surface} m²` : null, p.rooms ? `${p.rooms} p.` : null, p.bedrooms ? `${p.bedrooms} ch.` : null].filter(Boolean);
  return (
    <article>
      <Link to="/biens/$id" params={{ id: p.id }} className="group block rounded-[1.5rem]">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-muted">
          {p.cover_url ? (
            <PhotoImg
              src={p.cover_url}
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
          <span className="absolute bottom-3 right-3 grid h-10 w-10 translate-y-2 place-items-center rounded-full bg-brand text-ink opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </span>
        </div>
        <div className="px-1 pt-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
            {[p.city, ...facts].filter(Boolean).join(" · ")}
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
