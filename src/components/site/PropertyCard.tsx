import { Link } from "@tanstack/react-router";
import type { Property } from "@/lib/domain";
import { formatEUR } from "@/lib/domain";

export function PropertyCard({ p }: { p: Property }) {
  return (
    <Link to="/biens/$id" params={{ id: p.id }} className="group block">
      <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
        {p.cover_url ? (
          <img
            src={p.cover_url}
            alt={p.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs uppercase tracking-widest text-muted-foreground">
            Photo à venir
          </div>
        )}
      </div>
      <div className="mt-5 flex items-baseline justify-between gap-4">
        <h3 className="font-serif text-xl leading-snug">{p.title}</h3>
        <div className="whitespace-nowrap text-sm text-primary">{formatEUR(p.price)}</div>
      </div>
      <div className="mt-1 text-sm text-muted-foreground">
        {[p.city, p.surface ? `${p.surface} m²` : null, p.rooms ? `${p.rooms} pièces` : null]
          .filter(Boolean)
          .join(" · ")}
      </div>
    </Link>
  );
}
