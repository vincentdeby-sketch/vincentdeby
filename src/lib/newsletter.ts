import { createServerFn } from "@tanstack/react-start";

// Inscription à la lettre du marché dans Brevo. Nécessite, dans les variables d'environnement Vercel,
// BREVO_API_KEY (clé API Brevo) et BREVO_LIST_ID (numéro de la liste). Sans elles, le formulaire
// retombe sur l'envoi d'un e-mail à Vincent.
export const subscribeNewsletter = createServerFn({ method: "POST" })
  .inputValidator((email: string) => {
    const e = String(email).trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e) || e.length > 200) throw new Error("Adresse e-mail invalide");
    return e;
  })
  .handler(async ({ data: email }) => {
    const key = process.env.BREVO_API_KEY;
    const list = Number(process.env.BREVO_LIST_ID);
    if (!key || !list) return { ok: false as const, reason: "not-configured" as const };
    const res = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: { "api-key": key, "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({ email, listIds: [list], updateEnabled: true, attributes: { SOURCE: "vincentimmo.com" } }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok && res.status !== 204) {
      console.error("[brevo]", res.status, await res.text().catch(() => ""));
      return { ok: false as const, reason: "error" as const };
    }
    return { ok: true as const };
  });
