import { useEffect } from "react";
import { notifyVisit } from "@/lib/notify";

// Une alerte e-mail par visite (première page vue de la session), sans cookie ni donnée personnelle.
// Pour ne pas recevoir d'alerte pour ses propres visites : ouvrir une fois le site avec ?moi=1
// (?moi=0 pour annuler).
export function VisitPing() {
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get("moi") === "1") localStorage.setItem("no-visit-alert", "1");
      if (params.get("moi") === "0") localStorage.removeItem("no-visit-alert");
      if (localStorage.getItem("no-visit-alert")) return;
      if (sessionStorage.getItem("visit-sent")) return;
      if (/^\/(admin|auth)/.test(window.location.pathname)) return;
      sessionStorage.setItem("visit-sent", "1");
      const utm = ["utm_source", "utm_medium", "utm_campaign"].map((k) => params.get(k)).filter(Boolean).join(" / ");
      void notifyVisit({
        data: {
          path: window.location.pathname,
          referrer: document.referrer && !document.referrer.includes(window.location.host) ? document.referrer : "",
          utm,
          screen: `${window.screen.width}×${window.screen.height}`,
          lang: navigator.language,
        },
      }).catch(() => {});
    } catch {
      // Stockage indisponible : pas d'alerte, la navigation n'est pas affectée.
    }
  }, []);
  return null;
}
