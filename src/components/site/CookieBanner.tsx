import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

const STORAGE_KEY = "cookie-consent";
const ADS_ID = "AW-18327944952";

type Choice = "granted" | "denied";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function readChoice(): Choice | null {
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

// Google Ads n'est chargé qu'après un accord explicite (Consent Mode v2, refus par défaut dans <head>).
function loadAds() {
  if (document.getElementById("gtag-ads")) return;
  window.gtag?.("consent", "update", {
    ad_storage: "granted",
    ad_user_data: "granted",
    ad_personalization: "granted",
    analytics_storage: "granted",
  });
  const s = document.createElement("script");
  s.id = "gtag-ads";
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${ADS_ID}`;
  document.head.appendChild(s);
  window.gtag?.("js", new Date());
  window.gtag?.("config", ADS_ID);
}

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const choice = readChoice();
    if (choice === "granted") loadAds();
    else if (choice === null) setVisible(true);

    const reopen = () => setVisible(true);
    window.addEventListener("open-cookie-banner", reopen);
    return () => window.removeEventListener("open-cookie-banner", reopen);
  }, []);

  const decide = (choice: Choice) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, choice);
    } catch {
      // Stockage indisponible : le choix vaut pour la visite en cours.
    }
    if (choice === "granted") loadAds();
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Gestion des cookies"
      className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-xl border border-foreground/15 bg-background p-5 text-sm shadow-xl sm:inset-x-6 sm:bottom-6"
    >
      <p className="leading-relaxed text-foreground/85">
        Ce site n'utilise des cookies publicitaires (Google Ads) qu'avec votre accord, pour mesurer
        l'efficacité de mes annonces. Refuser ne change rien à votre navigation.{" "}
        <Link to="/confidentialite" className="underline underline-offset-2 hover:text-primary">
          En savoir plus
        </Link>
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => decide("denied")}
          className="flex-1 border border-foreground/25 px-4 py-2.5 text-xs uppercase tracking-[0.18em] hover:bg-foreground/5"
        >
          Refuser
        </button>
        <button
          type="button"
          onClick={() => decide("granted")}
          className="flex-1 bg-foreground px-4 py-2.5 text-xs uppercase tracking-[0.18em] text-background hover:bg-primary"
        >
          Accepter
        </button>
      </div>
    </div>
  );
}
