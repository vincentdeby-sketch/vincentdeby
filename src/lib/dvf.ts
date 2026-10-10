import { createServerFn } from "@tanstack/react-start";
import { comparables, parseDvfCsv, stats, type Sale } from "./dvf-parse";
import { SECTORS } from "./sectors";

// Ventes DVF lues sur data.gouv.fr (fichiers geo-dvf par commune), gardées 24 h en mémoire.
// DVF_BASE_URL permet de pointer vers une copie locale pour les tests.
const BASE = process.env.DVF_BASE_URL || "https://files.data.gouv.fr/geo-dvf/latest/csv";
const TTL = 24 * 60 * 60 * 1000;
const cache = new Map<string, { at: number; value: Promise<Sale[]> }>();

async function fetchYear(code: string, year: number): Promise<Sale[] | null> {
  const res = await fetch(`${BASE}/${year}/communes/${code.slice(0, 2)}/${code}.csv`, { signal: AbortSignal.timeout(15000) });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`DVF ${code} ${year} : ${res.status}`);
  return parseDvfCsv(await res.text());
}

// Les deux dernières années publiées (DVF paraît avec plusieurs mois de décalage).
async function loadCommune(code: string): Promise<Sale[]> {
  const hit = cache.get(code);
  if (hit && Date.now() - hit.at < TTL) return hit.value;
  const value = (async () => {
    const out: Sale[] = [];
    let found = 0;
    for (let y = new Date().getFullYear(); y >= 2021 && found < 2; y--) {
      const sales = await fetchYear(code, y);
      if (sales) { out.push(...sales); found++; }
    }
    return out.sort((a, b) => b.date.localeCompare(a.date));
  })();
  cache.set(code, { at: Date.now(), value });
  value.catch(() => cache.delete(code));
  return value;
}

const lite = (s: Sale) => ({
  date: s.date,
  price: s.price,
  type: s.type,
  surface: s.surface,
  rooms: s.rooms,
  address: s.address,
  pricePerM2: Math.round(s.pricePerM2),
});
export type SaleLite = ReturnType<typeof lite>;

export const getSectorMarket = createServerFn({ method: "GET" })
  .inputValidator((slug: string) => String(slug))
  .handler(async ({ data: slug }) => {
    const sector = SECTORS.find((s) => s.slug === slug);
    if (!sector) return null;
    try {
      const sales = await loadCommune(sector.code);
      const apts = sales.filter((s) => s.type === "Appartement");
      const houses = sales.filter((s) => s.type === "Maison");
      const byRooms = [1, 2, 3, 4, 5].map((r) => ({
        rooms: r,
        stats: stats(apts.filter((s) => (r === 5 ? (s.rooms ?? 0) >= 5 : s.rooms === r))),
      }));
      return {
        apartments: stats(apts),
        houses: stats(houses),
        byRooms,
        recent: apts.slice(0, 12).map(lite),
      };
    } catch (e) {
      console.error(`[dvf] ${sector.code} indisponible :`, e);
      return { apartments: null, houses: null, byRooms: [], recent: [] };
    }
  });

export const getNearbySales = createServerFn({ method: "GET" })
  .inputValidator((d: { citycode: string; lat: number; lng: number; type: "Appartement" | "Maison"; surface: number }) => {
    if (!/^\d{5}$|^2[AB]\d{3}$/.test(d.citycode)) throw new Error("Code commune invalide");
    return { ...d, surface: Math.min(Math.max(Number(d.surface) || 0, 9), 1000) };
  })
  .handler(async ({ data }) => {
    // Paris : DVF publie par arrondissement (75101 à 75120), comme la Base Adresse Nationale.
    const sales = await loadCommune(data.citycode);
    const res = comparables(sales, data);
    return {
      radius: res.radius,
      perM2: res.perM2,
      sales: res.sales.map((s) => ({ ...lite(s), distance: s.distance })),
      period: sales.length ? { from: sales[sales.length - 1].date, to: sales[0].date } : null,
    };
  });
