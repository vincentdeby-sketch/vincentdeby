// Mesure d'audience et des demandes.
//  - Vercel Web Analytics : sans cookie, actif dès que l'option est activée dans le projet Vercel.
//  - Google Ads et Google Analytics 4 : seulement après accord cookies (voir CookieBanner).
//    GA4 n'est chargé que si la variable VITE_GA4_ID est renseignée (ex. G-XXXXXXX).

declare global {
  interface Window {
    va?: (event: "beforeSend" | "event" | "pageview", properties?: unknown) => void;
    vaq?: unknown[];
  }
}

export const GA4_ID = (import.meta.env.VITE_GA4_ID as string | undefined) || "";

export function trackEvent(name: string, props: Record<string, string> = {}) {
  if (typeof window === "undefined") return;
  window.va?.("event", { name, data: props });
  if (document.getElementById("gtag-ads")) window.gtag?.("event", name, props);
}

// Une demande envoyée (estimation, formulaire, alerte…). Dans Google Ads, créer l'action
// « generate_lead » pour en faire une conversion ; dans GA4, la marquer comme événement clé.
export function trackLead(form: string) {
  if (typeof window === "undefined") return;
  window.va?.("event", { name: "demande", data: { formulaire: form } });
  if (document.getElementById("gtag-ads")) window.gtag?.("event", "generate_lead", { form_name: form });
}
