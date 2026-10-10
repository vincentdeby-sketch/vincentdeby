// Régénère src/data/efficity-snapshot.json à partir de pages Efficity enregistrées.
// Usage : node --experimental-strip-types scripts/efficity-snapshot.mts <dossier>
//   <dossier>/list.html   = HTML de https://www.efficity.com/vdeby
//   <dossier>/<id>.html   = HTML de la fiche de chaque bien à vendre
// Les pages doivent être récupérées par un service qui passe la protection Cloudflare d'Efficity.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { parseDetailPage, parseListingsPage, parsePrices } from "../src/lib/efficity-parse.ts";

const dir = process.argv[2];
if (!dir) throw new Error("Indiquez le dossier contenant list.html et les fiches.");
const out = new URL("../src/data/efficity-snapshot.json", import.meta.url);
const html = readFileSync(join(dir, "list.html"), "utf8");
const list = parseListingsPage(html);
if (list.forSale.length === 0) throw new Error("Aucun bien lu dans list.html : page incomplète ou mise en page changée. Copie inchangée.");

const previous = existsSync(out) ? JSON.parse(readFileSync(out, "utf8")) : { details: {} };
const details: Record<string, unknown> = {};
const missing: string[] = [];
for (const l of list.forSale) {
  const file = join(dir, `${l.id}.html`);
  if (existsSync(file)) details[l.id] = parseDetailPage(l.id, readFileSync(file, "utf8"));
  else if (previous.details?.[l.id]) details[l.id] = previous.details[l.id];
  else missing.push(l.id);
}

const snapshot = {
  fetchedAt: new Date().toISOString().slice(0, 10),
  ...list,
  prices: parsePrices(html) ?? previous.prices ?? null,
  details,
};
writeFileSync(out, JSON.stringify(snapshot, null, 2) + "\n");
console.log(`${list.forSale.length} biens à vendre, ${list.sold.length} vendus.${missing.length ? ` Fiches manquantes : ${missing.join(", ")}` : ""}`);
