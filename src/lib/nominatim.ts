export type NominatimResult = {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
  address?: Record<string, string>;
};

let inflight: AbortController | null = null;

export async function searchAddress(query: string): Promise<NominatimResult[]> {
  if (query.trim().length < 3) return [];
  inflight?.abort();
  inflight = new AbortController();
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", query);
  url.searchParams.set("format", "json");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("limit", "6");
  url.searchParams.set("countrycodes", "fr,be,lu,ch,mc");
  const res = await fetch(url.toString(), {
    signal: inflight.signal,
    headers: { Accept: "application/json" },
  });
  if (!res.ok) return [];
  return (await res.json()) as NominatimResult[];
}
