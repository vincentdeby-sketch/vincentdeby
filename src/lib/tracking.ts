// Signale une demande envoyée à Google Ads. Sans accord cookies, gtag n'est pas chargé
// et l'appel reste sans effet. Pour en faire une conversion Ads, créer l'action
// « generate_lead » dans Google Ads (ou ajouter send_to: "AW-18327944952/<libellé>").
export function trackLead(form: string) {
  if (typeof window === "undefined" || !document.getElementById("gtag-ads")) return;
  window.gtag?.("event", "generate_lead", { form_name: form });
}
