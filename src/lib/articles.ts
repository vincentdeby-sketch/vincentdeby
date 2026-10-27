import type { Article } from "@/lib/domain";
import { LOCAL_ARTICLES } from "@/data/articles";

const date = (a: Article) => a.published_at ?? a.created_at;

// Un article du fichier n'apparaît qu'à partir de sa date de publication.
const isLive = (a: Article) => a.published && new Date(date(a)).getTime() <= Date.now();

export function withLocalArticles(remote: Article[]): Article[] {
  const slugs = new Set(remote.map((a) => a.slug));
  return [...remote, ...LOCAL_ARTICLES.filter((a) => isLive(a) && !slugs.has(a.slug))].sort(
    (x, y) => new Date(date(y)).getTime() - new Date(date(x)).getTime(),
  );
}

export function localArticle(slug: string): Article | null {
  const a = LOCAL_ARTICLES.find((x) => x.slug === slug);
  return a && isLive(a) ? a : null;
}

export function liveLocalArticles(): Article[] {
  return LOCAL_ARTICLES.filter(isLive);
}

export function readingMinutes(text: string) {
  return Math.max(1, Math.round(text.split(/\s+/).filter(Boolean).length / 220));
}
