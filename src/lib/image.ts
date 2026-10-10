// Les photos des biens viennent du CDN Efficity en pleine résolution (souvent 1 Mo et plus).
// wsrv.nl les redimensionne et les convertit en WebP à la volée, avec mise en cache.
const RESIZABLE = /^https:\/\/(d1q967606ga7w2\.cloudfront\.net|[a-z0-9]+\.supabase\.co)\//;
const WIDTHS = [400, 640, 960, 1280, 1600];

export function resized(src: string, width: number) {
  if (!RESIZABLE.test(src)) return src;
  return `https://wsrv.nl/?url=${encodeURIComponent(src)}&w=${width}&output=webp&q=72&we`;
}

export function srcSet(src: string, maxWidth = 1600) {
  if (!RESIZABLE.test(src)) return undefined;
  return WIDTHS.filter((w) => w <= maxWidth)
    .map((w) => `${resized(src, w)} ${w}w`)
    .join(", ");
}
