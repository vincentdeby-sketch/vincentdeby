// Demandes de valeurs foncières (DVF) : ventes réelles publiées par l'État (data.gouv.fr, fichiers geo-dvf).
// Fonctions pures : lecture du CSV, regroupement par vente, statistiques et ventes comparables.

export type Sale = {
  id: string;
  date: string; // AAAA-MM-JJ
  price: number;
  type: "Appartement" | "Maison";
  surface: number;
  rooms: number | null;
  address: string;
  postalCode: string;
  commune: string;
  lat: number;
  lng: number;
  pricePerM2: number;
};

function parseLine(line: string): string[] {
  if (!line.includes('"')) return line.split(",");
  const out: string[] = [];
  let cur = "";
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (quoted && line[i + 1] === '"') { cur += '"'; i++; } else quoted = !quoted;
    } else if (c === "," && !quoted) { out.push(cur); cur = ""; } else cur += c;
  }
  out.push(cur);
  return out;
}

// « QUAI GEORGES GORSE » → « Quai Georges Gorse »
function titleCase(s: string) {
  return s.toLowerCase().replace(/(^|[\s'-])(\p{L})/gu, (_, a, b) => a + b.toUpperCase())
    .replace(/\b(De|Du|Des|La|Le|Les|D'|L')\b/g, (m) => m.toLowerCase())
    .replace(/^./, (c) => c.toUpperCase());
}

// Une vente DVF = plusieurs lignes (logement, cave, parking…). On ne garde que les ventes
// d'un seul logement, pour que le prix au m² ait un sens.
export function parseDvfCsv(csv: string): Sale[] {
  const lines = csv.split(/\r?\n/);
  const head = parseLine(lines[0] ?? "");
  const col = (name: string) => head.indexOf(name);
  const I = {
    id: col("id_mutation"), date: col("date_mutation"), nature: col("nature_mutation"), value: col("valeur_fonciere"),
    num: col("adresse_numero"), suffix: col("adresse_suffixe"), street: col("adresse_nom_voie"), cp: col("code_postal"),
    commune: col("nom_commune"), type: col("type_local"), surface: col("surface_reelle_bati"), carrez: col("lot1_surface_carrez"),
    rooms: col("nombre_pieces_principales"), lng: col("longitude"), lat: col("latitude"),
  };
  if (I.id < 0 || I.value < 0 || I.type < 0) return [];

  const groups = new Map<string, string[][]>();
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i]) continue;
    const r = parseLine(lines[i]);
    if (r[I.nature] !== "Vente") continue;
    const g = groups.get(r[I.id]);
    if (g) g.push(r); else groups.set(r[I.id], [r]);
  }

  const sales: Sale[] = [];
  for (const [id, rows] of groups) {
    const dwellings = rows.filter((r) => r[I.type] === "Appartement" || r[I.type] === "Maison");
    const others = rows.filter((r) => r[I.type] && r[I.type] !== "Dépendance" && !dwellings.includes(r));
    if (dwellings.length !== 1 || others.length > 0) continue;
    const d = dwellings[0];
    const price = Number(d[I.value]);
    const surface = Number(d[I.surface]) || Number((d[I.carrez] || "").replace(",", "."));
    const lat = Number(d[I.lat]);
    const lng = Number(d[I.lng]);
    if (!price || !surface || surface < 9 || !lat || !lng) continue;
    const pricePerM2 = price / surface;
    if (pricePerM2 < 1500 || pricePerM2 > 30000) continue; // ventes atypiques (lots multiples, erreurs de saisie)
    sales.push({
      id,
      date: d[I.date],
      price,
      type: d[I.type] as Sale["type"],
      surface,
      rooms: Number(d[I.rooms]) || null,
      address: titleCase([d[I.num], d[I.suffix], d[I.street]].filter(Boolean).join(" ")),
      postalCode: d[I.cp],
      commune: d[I.commune],
      lat,
      lng,
      pricePerM2,
    });
  }
  return sales.sort((a, b) => b.date.localeCompare(a.date));
}

export function quantile(sorted: number[], q: number) {
  if (!sorted.length) return 0;
  const pos = (sorted.length - 1) * q;
  const lo = Math.floor(pos);
  const hi = Math.ceil(pos);
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (pos - lo);
}

export type Stats = { count: number; median: number; p25: number; p75: number; from: string; to: string };

export function stats(sales: Sale[]): Stats | null {
  if (sales.length < 5) return null;
  const v = sales.map((s) => s.pricePerM2).sort((a, b) => a - b);
  const dates = sales.map((s) => s.date).sort();
  return {
    count: sales.length,
    median: Math.round(quantile(v, 0.5)),
    p25: Math.round(quantile(v, 0.25)),
    p75: Math.round(quantile(v, 0.75)),
    from: dates[0],
    to: dates[dates.length - 1],
  };
}

export function distanceM(aLat: number, aLng: number, bLat: number, bLng: number) {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export type Comparable = Sale & { distance: number };

// Ventes comparables : même type, surface proche, au plus près de l'adresse (rayon élargi si besoin).
export function comparables(sales: Sale[], q: { lat: number; lng: number; type: Sale["type"]; surface: number }) {
  const near = (radius: number) =>
    sales
      .filter((s) => s.type === q.type && s.surface >= q.surface * 0.65 && s.surface <= q.surface * 1.35)
      .map((s) => ({ ...s, distance: Math.round(distanceM(q.lat, q.lng, s.lat, s.lng)) }))
      .filter((s) => s.distance <= radius);
  let radius = 400;
  let found = near(radius);
  while (found.length < 6 && radius < 1500) {
    radius += 300;
    found = near(radius);
  }
  const list = found.sort((a, b) => b.date.localeCompare(a.date) || a.distance - b.distance).slice(0, 12);
  const v = list.map((s) => s.pricePerM2).sort((a, b) => a - b);
  return {
    radius,
    sales: list,
    perM2: list.length >= 4 ? { p25: Math.round(quantile(v, 0.25)), median: Math.round(quantile(v, 0.5)), p75: Math.round(quantile(v, 0.75)) } : null,
  };
}
