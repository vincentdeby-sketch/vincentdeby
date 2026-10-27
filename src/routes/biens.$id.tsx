import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { SiteShell } from "@/components/site/SiteShell";
import { DetailSkeleton } from "@/components/site/Skeletons";
import { formatEUR } from "@/lib/domain";
import { propertyByIdQuery } from "@/lib/queries";
import { Gallery } from "@/components/site/Gallery";
import { ArrowLeft, ArrowRight } from "lucide-react";
import portrait from "@/assets/vincent-deby-200.webp";

import { SITE } from "@/lib/site";

export const Route = createFileRoute("/biens/$id")({
  pendingComponent: DetailSkeleton,
  pendingMs: 200,
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(propertyByIdQuery(params.id));
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData, params }) => {
    const url = `${SITE}/biens/${params?.id ?? ""}`;
    if (!loaderData) {
      return {
        meta: [{ title: "Bien introuvable | Vincent Deby" }, { name: "robots", content: "noindex" }],
        links: [{ rel: "canonical", href: url }],
      };
    }
    const p = loaderData;
    // La ville figure souvent déjà dans le titre : on ne la répète pas.
    const city = p.city && !p.title.toLowerCase().includes(p.city.toLowerCase()) ? p.city : null;
    const head = [p.title, formatEUR(p.price), p.surface ? `${p.surface} m²` : null, city].filter(Boolean).join(" · ");
    const full = `${head}. ${(p.description ?? "").replace(/\s+/g, " ").trim()}`;
    const desc = full.length > 155 ? `${full.slice(0, 154).replace(/\s+\S*$/, "")}…` : full;
    return {
      meta: [
        { title: `${p.title}, ${formatEUR(p.price)} | Vincent Deby` },
        { name: "description", content: desc },
        { property: "og:title", content: p.title },
        { property: "og:description", content: desc },
        { property: "og:url", content: url },
        { property: "og:type", content: "website" },
        ...(p.cover_url
          ? [
              { property: "og:image", content: p.cover_url },
              { name: "twitter:image", content: p.cover_url },
            ]
          : []),
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "RealEstateListing",
            name: p.title,
            description: p.description,
            url,
            image: [p.cover_url, ...(p.photos ?? [])].filter(Boolean),
            datePosted: p.created_at?.slice(0, 10),
            about: {
              "@type": p.property_type === "maison" ? "SingleFamilyResidence" : "Apartment",
              ...(p.surface ? { floorSize: { "@type": "QuantitativeValue", value: p.surface, unitCode: "MTK" } } : {}),
              ...(p.rooms ? { numberOfRooms: p.rooms } : {}),
              address: {
                "@type": "PostalAddress",
                streetAddress: p.address || undefined,
                addressLocality: p.city || undefined,
                postalCode: p.postal_code || undefined,
                addressCountry: "FR",
              },
            },
            offers: {
              "@type": "Offer",
              price: p.price,
              priceCurrency: "EUR",
              availability: "https://schema.org/InStock",
            },
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Accueil", item: `${SITE}/` },
              { "@type": "ListItem", position: 2, name: "Nos biens", item: `${SITE}/biens` },
              { "@type": "ListItem", position: 3, name: p.title, item: url },
            ],
          }),
        },
      ],
    };
  },
  component: Detail,
  notFoundComponent: () => (
    <SiteShell>
      <div className="container-narrow py-32 text-center">
        <h1 className="font-serif text-4xl">Bien introuvable</h1>
        <Link to="/biens" className="mt-6 inline-block text-primary underline">Retour aux biens</Link>
      </div>
    </SiteShell>
  ),
  errorComponent: ({ error }) => (
    <SiteShell><div className="container-narrow py-24 text-sm text-muted-foreground">{error.message}</div></SiteShell>
  ),
});

// Les annonces Efficity commencent souvent par une ligne de mots-clés en capitales : on la sort en étiquette.
function Description({ text }: { text: string }) {
  const [first, ...rest] = text.split(/\n{2,}/);
  const letters = (first ?? "").replace(/[^A-Za-zÀ-ÿ]/g, "");
  const isTagline = letters.length > 20 && letters === letters.toUpperCase();
  return (
    <div className="mt-5 max-w-2xl">
      {isTagline && (
        <p className="mb-6 rounded-2xl bg-muted p-4 font-mono text-[11px] uppercase leading-relaxed tracking-[0.06em] text-muted-foreground">
          {first}
        </p>
      )}
      <div className="whitespace-pre-wrap text-lg leading-relaxed text-foreground/85">
        {(isTagline ? rest : [first, ...rest]).join("\n\n")}
      </div>
    </div>
  );
}

// Couleurs officielles de l'étiquette énergie.
const DPE_COLORS: Record<string, string> = {
  A: "bg-[#009c6d] text-white",
  B: "bg-[#52b153] text-white",
  C: "bg-[#78bd76] text-ink",
  D: "bg-[#f4e70f] text-ink",
  E: "bg-[#f0b40f] text-ink",
  F: "bg-[#eb8235] text-ink",
  G: "bg-[#d7221f] text-white",
};

function Detail() {
  const { id } = Route.useParams();
  const { data: p } = useSuspenseQuery(propertyByIdQuery(id));
  if (!p) throw notFound();

  const gallery = [p.cover_url, ...(p.photos ?? [])].filter(Boolean) as string[];
  const extra = "features" in p ? p : null;
  const locString = [p.address, p.city && p.postal_code ? `${p.city} (${p.postal_code})` : p.city].filter(Boolean).join(", ");

  const facts = [
    p.surface ? { k: "Surface", v: `${p.surface} m²` } : null,
    p.rooms ? { k: "Pièces", v: String(p.rooms) } : null,
    p.bedrooms ? { k: "Chambres", v: String(p.bedrooms) } : null,
    p.surface ? { k: "Prix au m²", v: formatEUR(Math.round(p.price / p.surface)) } : null,
  ].filter(Boolean) as { k: string; v: string }[];

  return (
    <SiteShell>
      <div className="container-narrow pt-8">
        <Link to="/biens" className="inline-flex items-center gap-2 rounded-full px-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Tous les biens
        </Link>
      </div>

      <section className="container-narrow mt-6">
        <Gallery photos={gallery} title={`${p.title}${locString ? `, ${locString}` : ""}`} transitionName={`bien-${p.id}`} />
      </section>

      <section className="container-narrow mt-10 grid gap-12 md:mt-14 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <p className="eyebrow">{[p.property_type, locString].filter(Boolean).join(" · ")}</p>
          <h1 className="mt-4 !text-[clamp(2.2rem,4.5vw,3.75rem)]">{p.title}</h1>
          <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-4">
            {facts.map((f) => (
              <div key={f.k} className="bg-card p-4">
                <dt className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">{f.k}</dt>
                <dd className="mt-1 font-serif text-2xl tabular-nums">{f.v}</dd>
              </div>
            ))}
          </dl>
          {extra && (extra.features.length > 0 || extra.dpe) && (
            <ul className="mt-6 flex flex-wrap gap-2">
              {extra.dpe && (
                <li className="flex items-center gap-2 rounded-full border border-foreground/15 py-1.5 pl-1.5 pr-4 text-sm">
                  <span className={`grid h-7 w-7 place-items-center rounded-full font-mono text-xs font-semibold ${DPE_COLORS[extra.dpe] ?? "bg-muted"}`}>
                    {extra.dpe}
                  </span>
                  DPE
                </li>
              )}
              {extra.features.map((f) => (
                <li key={f} className="rounded-full border border-foreground/15 px-4 py-2 text-sm">{f}</li>
              ))}
            </ul>
          )}
          <h2 className="mt-14 !text-3xl">Description</h2>
          <Description text={p.description} />
          {extra && (
            <p className="mt-6 text-sm text-muted-foreground">
              Annonce publiée sur{" "}
              <a href={extra.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">efficity.com</a>
.
            </p>
          )}

        </div>

        <aside className="lg:col-span-4">
          <div className="surface p-7 lg:sticky lg:top-28">
            <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">Prix de vente</p>
            <p className="mt-2 font-serif text-4xl tabular-nums">{formatEUR(p.price)}</p>
            {extra?.exclusive && (
              <p className="mt-3 inline-flex rounded-full bg-brand-soft px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-brand-ink">
                Exclusivité
              </p>
            )}
            {extra?.feesNote && <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{extra.feesNote}</p>}
            <div className="mt-6 grid gap-2">
              <a
                href={`mailto:vdeby@efficity.com?subject=${encodeURIComponent(`Demande de visite : ${p.title}`)}&body=${encodeURIComponent(`Bonjour Vincent,\n\nJe souhaite visiter le bien « ${p.title} » (${SITE}/biens/${p.id}).\n\nMes disponibilités :\n\nMon téléphone :\n\nMerci.`)}`}
                className="btn btn-primary w-full"
              >
                Demander une visite
              </a>
              <a href="tel:+33610022436" className="btn btn-ghost w-full">Appeler · 06 10 02 24 36</a>
            </div>
            <div className="mt-6 flex items-center gap-3 border-t border-border pt-5">
              <img src={portrait} alt="" width={44} height={44} className="h-11 w-11 rounded-full object-cover" />
              <div className="text-sm">
                <p className="font-medium">Vincent Deby</p>
                <p className="text-muted-foreground">Votre interlocuteur pour ce bien</p>
              </div>
            </div>
          </div>
        </aside>
      </section>

      <section className="container-narrow mt-20">
        <div className="grid gap-6 rounded-[1.75rem] bg-brand-soft p-7 md:grid-cols-12 md:items-center md:p-10">
          <div className="md:col-span-8">
            <p className="eyebrow !text-brand-ink">Vous êtes propriétaire dans le quartier ?</p>
            <p className="mt-3 font-serif text-[clamp(1.6rem,2.6vw,2.3rem)] leading-tight">
              Ce bien vous donne une idée du marché. Votre estimation, elle, part des ventes réelles autour de chez vous.
            </p>
          </div>
          <div className="md:col-span-4 md:text-right">
            <Link to="/estimation" className="group btn btn-primary">
              Estimer mon bien
              <span className="btn-arrow" aria-hidden="true"><ArrowRight className="h-3.5 w-3.5" /></span>
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
