import { Link } from "@tanstack/react-router";
import type { Property } from "@/lib/domain";
import { formatEUR } from "@/lib/domain";

export function PropertyCard({ p }: { p: Property }) {
  return (
    <article>
      <Link
        to="/biens/$id"
        params={{ id: p.id }}
        className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        aria-label={`${p.title} — ${formatEUR(p.price)}`}
      >
        <div className="overflow-hidden border border-foreground/10 bg-background/40 transition-colors duration-300 group-hover:border-foreground/30">
          <div className="aspect-[4/3] w-full overflow-hidden bg-muted">

            {p.cover_url ? (
              <img
                src={p.cover_url}
                alt={`Photo — ${p.title}${p.city ? `, ${p.city}` : ""}`}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs uppercase tracking-widest text-muted-foreground">
                Photo à venir
              </div>
            )}
          </div>
          <div className="px-2 pb-2 pt-4">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="min-w-0 font-serif text-lg leading-snug sm:text-xl">
                <span className="line-clamp-2">{p.title}</span>
              </h3>
              <div className="shrink-0 whitespace-nowrap text-sm font-medium text-primary">{formatEUR(p.price)}</div>
            </div>
            <div className="mt-1.5 text-sm text-muted-foreground">
              {[p.city, p.surface ? `${p.surface} m²` : null, p.rooms ? `${p.rooms} pièces` : null]
                .filter(Boolean)
                .join(" · ")}
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
