import { Link } from "@tanstack/react-router";
import type { Article } from "@/lib/domain";
import { formatDate } from "@/lib/domain";

export function ArticleCard({ a }: { a: Article }) {
  const date = a.published_at ?? a.created_at;
  return (
    <article>
      <Link
        to="/actualites/$slug"
        params={{ slug: a.slug }}
        className="group block rounded-3xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
      >
        <div className="glass overflow-hidden rounded-3xl p-3 transition-shadow duration-500 group-hover:shadow-[0_24px_60px_-30px_color-mix(in_oklch,var(--color-ink)_50%,transparent)]">
          <div className="aspect-[3/2] w-full overflow-hidden rounded-2xl bg-muted">
            {a.cover_url ? (
              <img
                src={a.cover_url}
                alt={`Illustration — ${a.title}`}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
              />
            ) : (
              <div className="h-full w-full bg-sand" />
            )}
          </div>
          <div className="px-2 pb-2 pt-4">
            {date && (
              <time dateTime={date} className="text-xs uppercase tracking-widest text-muted-foreground">
                {formatDate(date)}
              </time>
            )}
            <h3 className="mt-2 font-serif text-lg leading-snug transition-colors group-hover:text-primary sm:text-xl">
              <span className="line-clamp-2">{a.title}</span>
            </h3>
            {a.excerpt && (
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-3">{a.excerpt}</p>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
