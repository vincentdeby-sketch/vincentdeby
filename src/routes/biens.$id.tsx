import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { SiteShell } from "@/components/site/SiteShell";
import { formatEUR } from "@/lib/domain";
import { propertyByIdQuery } from "@/lib/queries";
import { PhotoImg } from "@/components/site/PhotoImg";
import { ArrowLeft, ArrowRight } from "lucide-react";
import portrait from "@/assets/vincent-deby-200.webp";

import { SITE } from "@/lib/site";

export const Route = createFileRoute("/biens/$id")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(propertyByIdQuery(params.id));
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData, params }) => {
    const url = `${SITE}/biens/${params?.id ?? ""}`;
    if (!loaderData) {
      return {
        meta: [{ title: "Bien introuvable — Vincent Deby" }, { name: "robots", content: "noindex" }],
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
        { title: `${p.title} — ${formatEUR(p.price)} | Vincent Deby` },
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

function Detail() {
  const { id } = Route.useParams();
  const { data: p } = useSuspenseQuery(propertyByIdQuery(id));
  if (!p) throw notFound();

  const gallery = [p.cover_url, ...(p.photos ?? [])].filter(Boolean) as string[];
  const locString = [p.address, p.city].filter(Boolean).join(", ");

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
        {gallery[0] ? (
          <div className="grid gap-2 md:grid-cols-4 md:grid-rows-2">
            <div className="aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-muted md:col-span-3 md:row-span-2 md:aspect-auto md:h-[min(68vh,640px)]">
              <PhotoImg
                src={gallery[0]}
                width={1280}
                height={960}
                sizes="(min-width: 768px) 75vw, 100vw"
                alt={`${p.title}, photo principale${locString ? ` (${locString})` : ""}`}
                fetchPriority="high"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </div>
            {gallery.slice(1, 3).map((src, i) => (
              <div key={i} className="hidden overflow-hidden rounded-[1.5rem] bg-muted md:block">
                <PhotoImg src={src} width={640} height={480} maxWidth={960} sizes="25vw" alt={`${p.title}, photo ${i + 2}`} loading="lazy" decoding="async" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        ) : (
          <div className="aspect-[16/9] rounded-[1.5rem] bg-muted" />
        )}
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
          <h2 className="mt-14 !text-3xl">Description</h2>
          <div className="mt-5 max-w-2xl whitespace-pre-wrap text-lg leading-relaxed text-foreground/85">{p.description}</div>
          {gallery.length > 3 && (
            <div className="mt-12 grid grid-cols-2 gap-2 md:grid-cols-3">
              {gallery.slice(3, 12).map((src, i) => (
                <div key={i} className="aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
                  <PhotoImg src={src} width={400} height={300} maxWidth={640} sizes="(min-width: 768px) 22vw, 50vw" alt={`${p.title}, photo ${i + 4}`} loading="lazy" decoding="async" className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        <aside className="lg:col-span-4">
          <div className="surface p-7 lg:sticky lg:top-28">
            <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">Prix de vente</p>
            <p className="mt-2 font-serif text-4xl tabular-nums">{formatEUR(p.price)}</p>
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
