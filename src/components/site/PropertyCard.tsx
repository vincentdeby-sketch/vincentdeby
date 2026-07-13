import { Link } from "@tanstack/react-router";
import type { Property } from "@/lib/domain";
import { formatEUR } from "@/lib/domain";

export function PropertyCard({ p }: { p: Property }) {
  return (
    <Link to="/biens/$id" params={{ id: p.id }} className="group block">
      <div className="glass overflow-hidden rounded-3xl p-3 transition-shadow duration-500 group-hover:shadow-[0_24px_60px_-30px_color-mix(in_oklch,var(--color-ink)_50%,transparent)]">
        <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-muted">
          {p.cover_url ? (
            <img
              src={p.cover_url}
              alt={p.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs uppercase tracking-widest text-muted-foreground">
              Photo à venir
            </div>
          )}
        </div>
        <div className="px-2 pb-2 pt-4">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="font-serif text-xl leading-snug">{p.title}</h3>
            <div className="whitespace-nowrap text-sm text-primary">{formatEUR(p.price)}</div>
          </div>
          <div className="mt-1 text-sm text-muted-foreground">
            {[p.city, p.surface ? `${p.surface} m²` : null, p.rooms ? `${p.rooms} pièces` : null]
              .filter(Boolean)
              .join(" · ")}
          </div>
        </div>
      </div>
    </Link>
  );
}
