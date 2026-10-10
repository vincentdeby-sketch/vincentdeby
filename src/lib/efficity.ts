import { createServerFn } from "@tanstack/react-start";
import snapshot from "@/data/efficity-snapshot.json";
import type { Property } from "./domain";
import {
  EFFICITY_PAGE,
  parseDetailPage,
  parseListingsPage,
  parsePrices,
  type EfficityPrices,
  type EfficityDetail,
  type EfficityListing,
  type EfficitySold,
} from "./efficity-parse";

// Les biens affichés sur le site sont lus en direct sur la page Efficity de Vincent
// (mise en cache 15 minutes). Si Efficity ne répond pas, on sert la dernière copie enregistrée
// dans src/data/efficity-snapshot.json.

export type Listing = Property & {
  exclusive: boolean;
  dpe: string | null;
  features: string[];
  feesNote: string | null;
  sourceUrl: string;
};

export type SoldListing = EfficitySold;

const TTL = 15 * 60 * 1000;
const cache = new Map<string, { at: number; value: unknown }>();

async function cached<T>(key: string, load: () => Promise<T>): Promise<T> {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < TTL) return hit.value as T;
  const value = await load();
  cache.set(key, { at: Date.now(), value });
  return value;
}

async function fetchHtml(url: string) {
  const res = await fetch(url, {
    headers: {
      "user-agent": "Mozilla/5.0 (compatible; vincentimmo.com; +https://www.vincentimmo.com)",
      accept: "text/html",
      "accept-language": "fr-FR,fr;q=0.9",
    },
    signal: AbortSignal.timeout(6000),
  });
  if (!res.ok) throw new Error(`Efficity ${res.status}`);
  return res.text();
}

const snap = snapshot as unknown as {
  forSale: EfficityListing[];
  sold: EfficitySold[];
  details: Record<string, EfficityDetail>;
  prices: EfficityPrices | null;
};

async function loadIndex() {
  try {
    return await cached("index", async () => {
      const html = await fetchHtml(EFFICITY_PAGE);
      const parsed = { ...parseListingsPage(html), prices: parsePrices(html) ?? snap.prices };
      // Aucune annonce à vendre lue : la page a pu changer ou ne pas être servie en entier.
      // On garde alors la copie enregistrée plutôt que d'afficher une liste vide.
      if (parsed.forSale.length === 0) throw new Error("Efficity : aucune annonce à vendre lue");
      return parsed;
    });
  } catch (e) {
    console.error("[efficity] liste indisponible, copie de secours servie :", e);
    return { forSale: snap.forSale, sold: snap.sold, prices: snap.prices };
  }
}

async function loadDetail(l: EfficityListing): Promise<EfficityDetail | null> {
  try {
    return await cached(`detail:${l.id}`, async () => {
      const d = parseDetailPage(l.id, await fetchHtml(l.url));
      if (!d.description && d.photos.length === 0) throw new Error("Efficity : fiche vide");
      return d;
    });
  } catch (e) {
    console.error(`[efficity] fiche ${l.id} indisponible :`, e);
    return snap.details[l.id] ?? null;
  }
}

const TYPE_LABEL: Record<string, string> = {
  appartement: "Appartement",
  maison: "Maison",
  terrain: "Terrain",
  immeuble: "Immeuble",
  bureau: "Bureau",
  parking: "Parking",
  local_commercial: "Local commercial",
};

export function typeLabel(type: string) {
  return TYPE_LABEL[type] ?? type.charAt(0).toUpperCase() + type.slice(1);
}

function toListing(l: EfficityListing, d: EfficityDetail | null): Listing {
  const photos = d?.photos.length ? d.photos : [l.cover];
  const surface = Math.round(l.surface);
  return {
    id: l.id,
    title: `${typeLabel(l.type)}${l.rooms ? ` ${l.rooms} pièces` : ""} · ${surface} m²`,
    description: d?.description ?? "",
    address: "",
    city: l.city,
    postal_code: l.postalCode,
    price: l.price,
    surface,
    rooms: l.rooms,
    bedrooms: d?.bedrooms ?? null,
    property_type: l.type,
    cover_url: photos[0],
    photos: photos.slice(1),
    published: true,
    created_at: "",
    updated_at: "",
    exclusive: l.exclusive,
    dpe: d?.dpe ?? null,
    features: d?.features ?? [],
    feesNote: d?.feesNote ?? null,
    sourceUrl: l.url,
  };
}

// Liste : prix et statut en direct ; chambres et grande photo tirées de la copie si la fiche n'est pas encore lue.
export const getListings = createServerFn({ method: "GET" }).handler(async () => {
  const index = await loadIndex();
  const forSale = index.forSale.map((l) => toListing(l, cache.has(`detail:${l.id}`) ? (cache.get(`detail:${l.id}`)!.value as EfficityDetail) : (snap.details[l.id] ?? null)));
  return { forSale, sold: index.sold, prices: index.prices };
});

export const getListing = createServerFn({ method: "GET" })
  .inputValidator((id: string) => String(id))
  .handler(async ({ data: id }) => {
    const index = await loadIndex();
    const l = index.forSale.find((x) => x.id === id);
    if (!l) return null;
    return toListing(l, await loadDetail(l));
  });
