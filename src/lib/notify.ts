import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";

// Alertes e-mail à Vincent : le site appelle un webhook Make (scénario « vincentimmo.com — alertes
// e-mail »), qui envoie le message par Brevo à vdeby@efficity.com.
const WEBHOOK = process.env.MAKE_NOTIFY_WEBHOOK || "https://hook.eu1.make.com/h57regcd0g97c5u77jxeyy4b97f646qh";

const esc = (v: unknown) =>
  String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function card(title: string, rows: [string, unknown][], footer = "") {
  const lines = rows
    .filter(([, v]) => v !== undefined && v !== null && String(v).trim() !== "")
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px 6px 0;color:#5b5d55;white-space:nowrap;vertical-align:top">${esc(k)}</td><td style="padding:6px 0;color:#121411">${esc(v).replace(/\n/g, "<br>")}</td></tr>`,
    )
    .join("");
  return `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5;color:#121411;max-width:620px">
<p style="margin:0 0 4px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#2c6a1b">vincentimmo.com</p>
<h2 style="margin:0 0 16px;font-size:22px">${esc(title)}</h2>
<table cellpadding="0" cellspacing="0" style="border-top:2px solid #4eae32;padding-top:10px">${lines}</table>
${footer ? `<p style="margin-top:18px;color:#5b5d55;font-size:13px">${footer}</p>` : ""}
</div>`;
}

async function send(payload: { subject: string; html: string; text: string; replyTo?: string; replyName?: string }) {
  try {
    const res = await fetch(WEBHOOK, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) console.error("[notify] webhook", res.status);
    return res.ok;
  } catch (e) {
    console.error("[notify]", e);
    return false;
  }
}

// Garde-fou contre les envois en rafale (par instance serveur).
const sent: number[] = [];
function allow(max: number) {
  const now = Date.now();
  while (sent.length && now - sent[0] > 3600_000) sent.shift();
  if (sent.length >= max) return false;
  sent.push(now);
  return true;
}

type Lead = {
  kind: "estimation" | "projet" | "alerte" | "newsletter";
  name?: string;
  email?: string;
  phone?: string;
  fields: Record<string, string | number | boolean | null | undefined>;
};

const TITLES: Record<Lead["kind"], string> = {
  estimation: "Nouvelle demande d'estimation",
  projet: "Nouveau formulaire « Préparons votre vente »",
  alerte: "Nouvelle alerte acquéreur",
  newsletter: "Nouvelle inscription à la lettre du marché",
};

export const notifyLead = createServerFn({ method: "POST" })
  .inputValidator((d: Lead) => {
    if (!d || !(d.kind in TITLES)) throw new Error("Type inconnu");
    const fields = Object.fromEntries(Object.entries(d.fields ?? {}).slice(0, 40).map(([k, v]) => [String(k).slice(0, 60), String(v ?? "").slice(0, 2000)]));
    return { ...d, name: d.name?.slice(0, 120), email: d.email?.slice(0, 200), phone: d.phone?.slice(0, 40), fields };
  })
  .handler(async ({ data }) => {
    if (!allow(120)) return { ok: false };
    const title = TITLES[data.kind];
    const who = [data.name, data.phone, data.email].filter(Boolean).join(" · ");
    const rows: [string, unknown][] = [
      ["Nom", data.name],
      ["Téléphone", data.phone],
      ["E-mail", data.email],
      ...Object.entries(data.fields),
    ];
    const footer = data.email ? "Répondez directement à cet e-mail pour écrire au contact." : "";
    const ok = await send({
      subject: `${title}${who ? ` : ${who}` : ""}`,
      html: card(title, rows, footer),
      text: `${title}\n${rows.map(([k, v]) => `${k} : ${v ?? ""}`).join("\n")}`,
      replyTo: data.email && /\S+@\S+\.\S+/.test(data.email) ? data.email : undefined,
      replyName: data.name,
    });
    return { ok };
  });

const BOTS = /bot|crawl|spider|slurp|preview|lighthouse|headless|vercel|monitor|curl|wget|python|scrapy|facebookexternalhit|whatsapp/i;

export const notifyVisit = createServerFn({ method: "POST" })
  .inputValidator((d: { path: string; referrer?: string; utm?: string; screen?: string; lang?: string }) => ({
    path: String(d.path ?? "/").slice(0, 300),
    referrer: String(d.referrer ?? "").slice(0, 300),
    utm: String(d.utm ?? "").slice(0, 300),
    screen: String(d.screen ?? "").slice(0, 20),
    lang: String(d.lang ?? "").slice(0, 20),
  }))
  .handler(async ({ data }) => {
    const ua = getRequestHeader("user-agent") ?? "";
    if (!ua || BOTS.test(ua)) return { ok: false };
    if (!allow(60)) return { ok: false };
    const dec = (v?: string | null) => { try { return v ? decodeURIComponent(v) : ""; } catch { return v ?? ""; } };
    // Localisation approximative fournie par Vercel à partir de l'adresse IP (ville), l'IP n'est pas conservée.
    const city = dec(getRequestHeader("x-vercel-ip-city"));
    const country = getRequestHeader("x-vercel-ip-country") ?? "";
    const device = /iPad|Tablet/i.test(ua) ? "Tablette" : /Mobi|Android|iPhone/i.test(ua) ? "Mobile" : "Ordinateur";
    const browser = /Edg\//.test(ua) ? "Edge" : /Chrome\//.test(ua) ? "Chrome" : /Safari\//.test(ua) ? "Safari" : /Firefox\//.test(ua) ? "Firefox" : "Autre";
    let source = "Accès direct";
    if (data.referrer) { try { source = new URL(data.referrer).hostname.replace(/^www\./, ""); } catch { source = data.referrer; } }
    if (data.utm) source += ` (${data.utm})`;
    const place = [city, country].filter(Boolean).join(", ");
    const when = new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeStyle: "short", timeZone: "Europe/Paris" }).format(new Date());
    const ok = await send({
      subject: `Visite sur le site : ${data.path}${place ? ` · ${place}` : ""}`,
      html: card("Nouvelle visite", [
        ["Page d'arrivée", data.path],
        ["Provenance", source],
        ["Lieu (approximatif)", place],
        ["Appareil", `${device} · ${browser}${data.screen ? ` · ${data.screen}` : ""}`],
        ["Langue", data.lang],
        ["Heure", when],
      ], "Visite anonyme : aucune donnée personnelle n'est collectée."),
      text: `Visite : ${data.path} · ${source} · ${place} · ${device}`,
    });
    return { ok };
  });
