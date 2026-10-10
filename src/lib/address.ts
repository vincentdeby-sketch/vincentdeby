// Autocomplétion via la Base Adresse Nationale (api-adresse.data.gouv.fr) :
// adresses françaises officielles, libellés courts, sans clé ni quota bloquant.
export type AddressSuggestion = {
  id: string;
  label: string;
  lat: number;
  lng: number;
  postcode?: string;
  city?: string;
  citycode?: string;
};

type BanFeature = {
  geometry: { coordinates: [number, number] };
  properties: { id: string; label: string; postcode?: string; city?: string; citycode?: string };
};

let inflight: AbortController | null = null;

export async function searchAddress(query: string): Promise<AddressSuggestion[]> {
  if (query.trim().length < 3) return [];
  inflight?.abort();
  inflight = new AbortController();
  const url = new URL("https://api-adresse.data.gouv.fr/search/");
  url.searchParams.set("q", query);
  url.searchParams.set("limit", "6");
  url.searchParams.set("autocomplete", "1");
  // Favorise les résultats proches de Boulogne-Billancourt.
  url.searchParams.set("lat", "48.8356");
  url.searchParams.set("lon", "2.2410");
  try {
    const res = await fetch(url.toString(), { signal: inflight.signal });
    if (!res.ok) return [];
    const data = (await res.json()) as { features: BanFeature[] };
    return data.features.map((f) => ({
      id: f.properties.id,
      label: f.properties.label,
      lng: f.geometry.coordinates[0],
      lat: f.geometry.coordinates[1],
      postcode: f.properties.postcode,
      city: f.properties.city,
      citycode: f.properties.citycode,
    }));
  } catch {
    return [];
  }
}
