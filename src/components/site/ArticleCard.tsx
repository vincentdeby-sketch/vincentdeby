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
        className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
      >
        <div className="overflow-hidden border border-foreground/10 bg-background/40 transition-colors duration-300 group-hover:border-foreground/30">
          <div className="aspect-[3/2] w-full overflow-hidden bg-muted">
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
          <div className="px-4 pb-5 pt-4">

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
