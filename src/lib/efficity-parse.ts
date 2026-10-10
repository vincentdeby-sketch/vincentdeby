// Lecture des annonces publiées sur la page consultant Efficity de Vincent.
// Fonctions pures (texte HTML en entrée), utilisables côté serveur et par le script de copie de secours.

export const EFFICITY_PAGE = "https://www.efficity.com/vdeby";

export type EfficityListing = {
  id: string;
  type: string; // appartement, maison…
  city: string;
  postalCode: string;
  price: number;
  surface: number;
  rooms: number | null;
  cover: string;
  url: string;
  exclusive: boolean;
};

export type EfficitySold = {
  id: string;
  type: string;
  city: string;
  postalCode: string;
  surface: number;
  rooms: number | null;
  cover: string;
};

export type EfficityPrices = {
  city: string;
  month: string; // « Octobre 2026 »
  low: number;
  mid: number;
  high: number;
};

export type EfficityDetail = {
  id: string;
  description: string;
  photos: string[];
  features: string[];
  bedrooms: number | null;
  dpe: string | null;
  feesNote: string | null;
};

const ENTITIES: Record<string, string> = {
  "&nbsp;": " ",
  "&amp;": "&",
  "&quot;": '"',
  "&#039;": "'",
  "&#39;": "'",
  "&apos;": "'",
  "&lt;": "<",
  "&gt;": ">",
  "&rsquo;": "’",
  "&lsquo;": "‘",
  "&eacute;": "é",
  "&egrave;": "è",
  "&agrave;": "à",
  "&euro;": "€",
};

export function decode(s: string) {
  return s
    .replace(/&[a-z]+;|&#0?39;/g, (m) => ENTITIES[m] ?? m)
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}

function text(html: string) {
  return decode(html.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, " "))
    .replace(/[ \t ]+/g, " ")
    .replace(/ *\n */g, "\n")
    .trim();
}

function attr(chunk: string, name: string) {
  return chunk.match(new RegExp(`${name}="([^"]*)"`))?.[1] ?? "";
}

// « appartement 4 pièces - 80,0m2 à Paris (75013) »
function parseAlt(alt: string) {
  const m = decode(alt).match(/^(\S+)\s+(?:(\d+)\s+pi[eè]ces?\s*)?-\s*([\d,.]+)\s*m2\s+à\s+(.+?)\s*\((\d{5})\)/i);
  if (!m) return null;
  return {
    type: m[1].toLowerCase(),
    rooms: m[2] ? Number(m[2]) : null,
    surface: Number(m[3].replace(",", ".")),
    city: m[4].trim(),
    postalCode: m[5],
  };
}

function splitItems(section: string) {
  return section.split(/<div class="programs-list-item[\s"]/).slice(1);
}

export function parseListingsPage(html: string): { forSale: EfficityListing[]; sold: EfficitySold[] } {
  const soldStart = html.indexOf('id="soldClassifieds"');
  const saleHtml = soldStart > 0 ? html.slice(0, soldStart) : html;
  const soldHtml = soldStart > 0 ? html.slice(soldStart, html.indexOf("</section>", soldStart)) : "";

  const forSale: EfficityListing[] = [];
  for (const chunk of splitItems(saleHtml)) {
    const id = attr(chunk, "data-id");
    const url = chunk.match(/href="(https:\/\/www\.efficity\.com\/achat-immobilier\/[^"]+)"/)?.[1];
    const cover = chunk.match(/<img[^>]+src="([^"]+)"/)?.[1];
    const alt = parseAlt(chunk.match(/<img[^>]+alt="([^"]*)"/)?.[1] ?? "");
    const price = Number(attr(chunk, "data-price"));
    if (!id || !url || !cover || !alt || !price) continue;
    forSale.push({
      id,
      type: attr(chunk, "data-type") || alt.type,
      city: alt.city,
      postalCode: alt.postalCode,
      price,
      surface: alt.surface || Number(attr(chunk, "data-surface")),
      rooms: alt.rooms,
      cover,
      url,
      exclusive: /Exclusivit/i.test(chunk),
    });
  }

  const sold: EfficitySold[] = [];
  for (const chunk of splitItems(soldHtml)) {
    const cover = chunk.match(/<img[^>]+src="([^"]+)"/)?.[1];
    const id = cover?.match(/\/house\/(\d+)\//)?.[1];
    const alt = parseAlt(chunk.match(/<img[^>]+alt="([^"]*)"/)?.[1] ?? "");
    if (!cover || !id || !alt) continue;
    sold.push({ id, type: alt.type, city: alt.city, postalCode: alt.postalCode, surface: alt.surface, rooms: alt.rooms, cover });
  }

  return { forSale, sold };
}

const euros = (s: string) => Number(decode(s).replace(/[^\d]/g, ""));

// Bloc « Notre estimation du prix au m² à … » de la page consultant.
export function parsePrices(html: string): EfficityPrices | null {
  const block = html.match(/<div class="tunnel-medium-price">([\s\S]*?)class="reliability"/)?.[1];
  if (!block) return null;
  const city = decode(block.match(/prix au m² à ([^<(]+)/)?.[1] ?? "").trim();
  const month = decode(block.match(/au mois de ([^<]+)<\/p>/)?.[1] ?? "").trim();
  const low = block.match(/Prix m2 bas\s*<strong>([^<]+)<\/strong>/)?.[1];
  const mid = block.match(/Prix m2 moyen\s*<strong>([^<]+)<\/strong>/)?.[1];
  const high = block.match(/Prix m2 haut\s*<strong>([^<]+)<\/strong>/)?.[1];
  if (!city || !low || !mid || !high) return null;
  return { city, month, low: euros(low), mid: euros(mid), high: euros(high) };
}

export function parseDetailPage(id: string, html: string): EfficityDetail {
  const descHtml = html.match(/<div class="moar-content">\s*<p>([\s\S]*?)<\/p>/)?.[1]
    ?? html.match(/<p id="default-presentation">([\s\S]*?)<\/p>/)?.[1]
    ?? "";

  // Les grandes photos apparaissent en https:// et en //, dans l'ordre de la galerie.
  const photoRe = new RegExp(`(?:https:)?//d1q967606ga7w2\\.cloudfront\\.net/common/house/${id}/photos/l/[^"'\\s),]+`, "g");
  const photos = [...new Set((html.match(photoRe) ?? []).map((u) => (u.startsWith("//") ? `https:${u}` : u)))];

  const featuresHtml = html.match(/<ul class="program-details-features">([\s\S]*?)<\/ul>/)?.[1] ?? "";
  const features = [...featuresHtml.matchAll(/<li>([\s\S]*?)<\/li>/g)]
    .map((m) => text(m[1]).replace(/\s*\n\s*/g, " "))
    .filter(Boolean);

  const bedrooms = features.map((f) => f.match(/^(\d+)\s+chambres?/i)?.[1]).find(Boolean);
  const dpe = html.match(/energy-class-item-container active">\s*<div class="dpe-item (\w)"/)?.[1]?.toUpperCase() ?? null;
  const feesNote = text(html.match(/(Le prix de vente est affiché[^<]*?honoraires[^<]*?\.)/)?.[1] ?? "") || null;

  return {
    id,
    description: text(descHtml),
    photos,
    features,
    bedrooms: bedrooms ? Number(bedrooms) : null,
    dpe,
    feesNote,
  };
}
