import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { SiteShell } from "@/components/site/SiteShell";
import { PropertyCard } from "@/components/site/PropertyCard";
import { Reveal } from "@/components/site/Reveal";
import { propertiesListQuery } from "@/lib/queries";

const SITE = "https://debymo.lovable.app";

export const Route = createFileRoute("/biens")({
  head: () => ({
    meta: [
      { title: "Nos biens à la vente — Vincent Deby, Mandataire Efficity" },
      { name: "description", content: "Sélection de biens immobiliers à la vente : appartements, maisons et propriétés choisis avec soin par Vincent Deby." },
      { property: "og:title", content: "Nos biens à la vente — Vincent Deby" },
      { property: "og:description", content: "Une sélection de biens à la vente, choisis avec soin." },
      { property: "og:url", content: `${SITE}/biens` },
    ],
    links: [{ rel: "canonical", href: `${SITE}/biens` }],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(propertiesListQuery),
  component: List,
  errorComponent: ({ error }) => (
    <SiteShell><div className="container-narrow py-24 text-sm text-muted-foreground">{error.message}</div></SiteShell>
  ),
});

function List() {
  const { data: items } = useSuspenseQuery(propertiesListQuery);
  return (
    <SiteShell>
      <section className="container-narrow pt-12 md:pt-24">
        <div className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground sm:text-xs">Sélection</div>
        <h1 className="mt-4 font-serif text-4xl leading-[1.05] sm:text-5xl md:mt-6 md:text-6xl">Nos biens</h1>
        <p className="mt-5 max-w-xl text-muted-foreground md:mt-6">
          Des propriétés choisies avec soin, présentées sans artifice.
        </p>
      </section>
      <section className="container-narrow mt-10 md:mt-16">
        {items.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border py-20 text-center text-sm text-muted-foreground">
            Aucun bien en ligne pour le moment.
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:gap-16">
            {items.map((p) => <Reveal key={p.id}><PropertyCard p={p} /></Reveal>)}
          </div>
        )}
      </section>
    </SiteShell>
  );
}
