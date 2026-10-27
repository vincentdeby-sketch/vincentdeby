import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { ListSkeleton } from "@/components/site/Skeletons";
import { PageHeader } from "@/components/site/PageHeader";
import { PropertyCard } from "@/components/site/PropertyCard";
import { Reveal } from "@/components/site/Reveal";
import { CountUp } from "@/components/site/CountUp";
import { formatEUR, formatDate } from "@/lib/domain";
import { sectorMarketQuery, listingsQuery } from "@/lib/queries";
import { SECTORS } from "@/lib/sectors";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/secteurs/$slug")({
  pendingComponent: ListSkeleton,
  pendingMs: 200,
  loader: async ({ context, params }) => {
    const sector = SECTORS.find((s) => s.slug === params.slug);
    if (!sector) throw notFound();
    await Promise.all([
      context.queryClient.ensureQueryData(sectorMarketQuery(params.slug)),
      context.queryClient.ensureQueryData(listingsQuery),
    ]);
    return sector;
  },
  head: ({ loaderData, params }) => {
    const name = loaderData?.name ?? "";
    const url = `${SITE}/secteurs/${params.slug}`;
    const base = `Prix immobilier ${name} : ventes réelles`;
    const title = base.length + 15 <= 60 ? `${base} | Vincent Deby` : base;
    const desc = `Prix au m² et dernières ventes réelles à ${name}, d'après les données publiques DVF. Analyse et estimation par Vincent Deby, conseiller Efficity.`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Accueil", item: `${SITE}/` },
              { "@type": "ListItem", position: 2, name: `Prix immobilier à ${name}`, item: url },
            ],
          }),
        },
      ],
    };
  },
  component: SectorPage,
});

function SectorPage() {
  const sector = Route.useLoaderData();
  const { data: market } = useSuspenseQuery(sectorMarketQuery(sector.slug));
  const { data: listings } = useSuspenseQuery(listingsQuery);
  const local = listings.forSale.filter((l) => l.postal_code === sector.postal);
  const apt = market?.apartments;
  const maxMedian = Math.max(...(market?.byRooms ?? []).map((r) => r.stats?.median ?? 0), 1);

  return (
    <SiteShell>
      <PageHeader
        eyebrow={`Secteur · ${sector.name}`}
        title={<>Le marché à {sector.name}, <em className="text-brand-ink">ventes réelles à l'appui.</em></>}
        lede={sector.intro}
      />

      {apt ? (
        <section className="container-narrow mt-12 md:mt-16">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Tile label="Prix médian au m² · appartements" value={<CountUp value={apt.median} format={formatEUR} />} dark />
            <Tile label="La moitié des ventes entre" value={<>{formatEUR(apt.p25)} <span className="text-muted-foreground">et</span> {formatEUR(apt.p75)}</>} small />
            <Tile label="Ventes d'appartements analysées" value={<CountUp value={apt.count} />} />
            <Tile
              label="Prix médian au m² · maisons"
              value={market?.houses ? <CountUp value={market.houses.median} format={formatEUR} /> : <span className="text-muted-foreground">Trop peu de ventes</span>}
            />
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Source : Demandes de valeurs foncières (DVF), ventes publiées par l'État sur data.gouv.fr, du{" "}
            {formatDate(apt.from)} au {formatDate(apt.to)}. Seules les ventes d'un logement unique sont retenues.
          </p>
        </section>
      ) : (
        <section className="container-narrow mt-12">
          <div className="surface p-8 text-muted-foreground">Les données de ventes sont momentanément indisponibles.</div>
        </section>
      )}

      {market && market.byRooms.some((r) => r.stats) && (
        <section className="container-narrow mt-20">
          <Reveal>
            <p className="eyebrow">Selon la taille</p>
            <h2 className="mt-4">Le prix au m² change avec le nombre de pièces</h2>
          </Reveal>
          <div className="mt-10 space-y-3">
            {market.byRooms.filter((r) => r.stats).map((r) => (
              <Reveal key={r.rooms} className="grid grid-cols-[5.5rem_1fr_auto] items-center gap-4">
                <span className="text-sm text-muted-foreground">{r.rooms === 5 ? "5 p. et +" : `${r.rooms} pièce${r.rooms > 1 ? "s" : ""}`}</span>
                <div className="h-9 overflow-hidden rounded-full bg-foreground/5">
                  <div
                    className="bar-grow flex h-full items-center rounded-full bg-brand/80 pl-4 font-mono text-[11px] text-ink"
                    style={{ width: `${((r.stats!.median) / maxMedian) * 100}%` }}
                  >
                    {r.stats!.count} ventes
                  </div>
                </div>
                <span className="w-24 text-right font-serif text-xl tabular-nums">{formatEUR(r.stats!.median)}</span>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {market && market.recent.length > 0 && (
        <section className="container-narrow mt-20">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow">Les dernières ventes publiées</p>
              <h2 className="mt-4">Ce qui s'est vraiment vendu</h2>
            </div>
            <Link to="/ventes-autour-de-chez-moi" className="group btn btn-ghost">
              Les ventes près de chez moi
              <span className="btn-arrow" aria-hidden="true"><ArrowRight className="h-3.5 w-3.5" /></span>
            </Link>
          </Reveal>
          <div className="mt-8 overflow-x-auto rounded-2xl border border-border">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-muted/60 font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-normal">Date</th>
                  <th className="px-4 py-3 font-normal">Adresse</th>
                  <th className="px-4 py-3 text-right font-normal">Surface</th>
                  <th className="px-4 py-3 text-right font-normal">Prix</th>
                  <th className="px-4 py-3 text-right font-normal">Prix au m²</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card">
                {market.recent.map((s, i) => (
                  <tr key={i}>
                    <td className="whitespace-nowrap px-4 py-3 tabular-nums">{formatDate(s.date)}</td>
                    <td className="px-4 py-3">{s.address}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{Math.round(s.surface)} m²{s.rooms ? ` · ${s.rooms} p.` : ""}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{formatEUR(s.price)}</td>
                    <td className="px-4 py-3 text-right font-medium tabular-nums">{formatEUR(s.pricePerM2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {local.length > 0 && (
        <section className="container-narrow mt-20">
          <p className="eyebrow">À vendre en ce moment</p>
          <h2 className="mt-4">Mes biens à {sector.name}</h2>
          <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {local.map((p) => <PropertyCard key={p.id} p={p} />)}
          </div>
        </section>
      )}

      <section className="container-narrow mt-20">
        <div className="grid gap-6 rounded-[2rem] bg-ink p-8 text-paper md:grid-cols-12 md:items-center md:p-12">
          <div className="md:col-span-8">
            <p className="eyebrow !text-paper/60">Votre bien à {sector.name}</p>
            <p className="mt-4 font-serif text-[clamp(1.8rem,3vw,2.6rem)] leading-tight">
              Une médiane ne dit pas le prix de votre bien. Les ventes de votre rue, si.
            </p>
          </div>
          <div className="md:col-span-4 md:text-right">
            <Link to="/estimation" className="group btn btn-brand">
              Estimer mon bien
              <span className="btn-arrow !bg-ink !text-brand" aria-hidden="true"><ArrowRight className="h-3.5 w-3.5" /></span>
            </Link>
          </div>
        </div>
        <nav aria-label="Autres secteurs" className="mt-8 flex flex-wrap gap-2">
          {SECTORS.filter((s) => s.slug !== sector.slug).map((s) => (
            <Link key={s.slug} to="/secteurs/$slug" params={{ slug: s.slug }} className="rounded-full border border-foreground/15 px-4 py-2 text-sm hover:border-foreground">
              {s.name}
            </Link>
          ))}
        </nav>
      </section>
    </SiteShell>
  );
}

function Tile({ label, value, dark = false, small = false }: { label: string; value: React.ReactNode; dark?: boolean; small?: boolean }) {
  return (
    <div className={`rounded-[1.5rem] p-6 ${dark ? "bg-ink text-paper" : "surface"}`}>
      <p className={`font-mono text-[11px] uppercase tracking-[0.08em] ${dark ? "text-paper/60" : "text-muted-foreground"}`}>{label}</p>
      <p className={`mt-6 font-serif tabular-nums ${small ? "text-2xl" : "text-4xl"} ${dark ? "text-brand" : ""}`}>{value}</p>
    </div>
  );
}
