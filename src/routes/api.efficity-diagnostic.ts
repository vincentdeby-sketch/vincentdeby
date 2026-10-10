import { createFileRoute } from "@tanstack/react-router";
import { EFFICITY_PAGE, parseListingsPage } from "@/lib/efficity-parse";

// Diagnostic temporaire : ce que le serveur reçoit d'Efficity (données publiques uniquement).
export const Route = createFileRoute("/api/efficity-diagnostic")({
  server: {
    handlers: {
      GET: async () => {
        const res = await fetch(EFFICITY_PAGE, {
          headers: { "user-agent": "Mozilla/5.0 (compatible; vincentimmo.com; +https://www.vincentimmo.com)", accept: "text/html" },
          signal: AbortSignal.timeout(6000),
        });
        const html = await res.text();
        const parsed = parseListingsPage(html);
        const i = html.indexOf("programs-list-item");
        return Response.json({
          status: res.status,
          length: html.length,
          forSale: parsed.forSale.length,
          sold: parsed.sold.length,
          hasMain: html.includes("main-classifieds"),
          sample: html.slice(Math.max(0, i - 100), i + 1500),
        }, { headers: { "cache-control": "no-store" } });
      },
    },
  },
});
