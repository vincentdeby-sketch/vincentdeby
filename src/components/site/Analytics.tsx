import { useEffect } from "react";
import { trackEvent } from "@/lib/tracking";

// Vercel Web Analytics (sans cookie) et suivi des clics « appeler » et « écrire ».
export function Analytics() {
  useEffect(() => {
    const host = window.location.hostname;
    if (host === "localhost" || host === "127.0.0.1") return;
    window.va = window.va || ((...args: unknown[]) => { (window.vaq = window.vaq || []).push(args); });
    if (!document.getElementById("vercel-insights")) {
      const s = document.createElement("script");
      s.id = "vercel-insights";
      s.defer = true;
      s.src = "/_vercel/insights/script.js";
      document.head.appendChild(s);
    }

    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute("href") ?? "";
      const page = window.location.pathname;
      if (href.startsWith("tel:")) trackEvent("appel", { page });
      else if (href.startsWith("mailto:")) trackEvent("email", { page });
      else if (/wa\.me|whatsapp/.test(href)) trackEvent("whatsapp", { page });
      else if (/calendly\.com/.test(href)) trackEvent("rendez_vous", { page });
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);
  return null;
}
