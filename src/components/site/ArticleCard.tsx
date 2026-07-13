import { Link } from "@tanstack/react-router";
import type { Article } from "@/lib/domain";
import { formatDate } from "@/lib/domain";

export function ArticleCard({ a }: { a: Article }) {
  return (
    <Link to="/actualites/$slug" params={{ slug: a.slug }} className="group block">
      <div className="aspect-[3/2] w-full overflow-hidden bg-muted">
        {a.cover_url ? (
          <img src={a.cover_url} alt={a.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]" />
        ) : (
          <div className="h-full w-full bg-sand" />
        )}
      </div>
      <div className="mt-5 text-xs uppercase tracking-widest text-muted-foreground">
        {formatDate(a.published_at ?? a.created_at)}
      </div>
      <h3 className="mt-2 font-serif text-xl leading-snug transition-colors group-hover:text-primary">
        {a.title}
      </h3>
      {a.excerpt && <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{a.excerpt}</p>}
    </Link>
  );
}
