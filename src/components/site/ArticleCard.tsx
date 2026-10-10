import { Link } from "@tanstack/react-router";
import type { Article } from "@/lib/domain";
import { formatDate } from "@/lib/domain";

function unsplashSrc(url: string, w: number) {
  if (!url.includes("images.unsplash.com")) return url;
  return url.replace(/([?&])w=\d+/, `$1w=${w}`).replace(/([?&])q=\d+/, `$1q=75`);
}

export function ArticleCard({ a }: { a: Article }) {
  const date = a.published_at ?? a.created_at;
  const cover = a.cover_url;
  const srcSet = cover
    ? `${unsplashSrc(cover, 480)} 480w, ${unsplashSrc(cover, 800)} 800w, ${unsplashSrc(cover, 1200)} 1200w`
    : undefined;
  return (
    <article>
      <Link to="/actualites/$slug" params={{ slug: a.slug }} className="group block rounded-[1.5rem]">
        <div className="aspect-[3/2] overflow-hidden rounded-[1.5rem] bg-muted">
          {cover ? (
            <img
              src={unsplashSrc(cover, 800)}
              srcSet={srcSet}
              sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
              alt=""
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
            />
          ) : (
            <div className="h-full w-full bg-sand" />
          )}
        </div>
        <div className="px-1 pt-4">
          {date && (
            <time dateTime={date} className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
              {formatDate(date)}
            </time>
          )}
          <h3 className="mt-2 text-xl leading-snug">
            <span className="line-clamp-2 transition-colors group-hover:text-brand-ink">{a.title}</span>
          </h3>
          {a.excerpt && <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{a.excerpt}</p>}
        </div>
      </Link>
    </article>
  );
}
