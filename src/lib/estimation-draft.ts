// Brouillon du formulaire d'estimation, partagé avec la recherche d'adresse de l'accueil.
export const DRAFT_KEY = "estimation-draft-v1";

export type DraftAddress = { display: string; lat: number; lng: number; postcode?: string; city?: string };

export function saveDraftAddress(address: DraftAddress) {
  try {
    const prev = JSON.parse(sessionStorage.getItem(DRAFT_KEY) ?? "{}");
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ ...prev, address }));
  } catch {
    // Stockage indisponible : le visiteur ressaisira l'adresse.
  }
}
