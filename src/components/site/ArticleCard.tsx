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
      <Link
        to="/actualites/$slug"
        params={{ slug: a.slug }}
        className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
      >
        <div className="overflow-hidden border border-foreground/10 bg-background/40 transition-colors duration-300 group-hover:border-foreground/30">
          <div className="aspect-[3/2] w-full overflow-hidden bg-muted">
            {cover ? (
              <img
                src={unsplashSrc(cover, 800)}
                srcSet={srcSet}
                sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
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
