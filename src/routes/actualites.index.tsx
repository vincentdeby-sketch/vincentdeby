import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { SiteShell } from "@/components/site/SiteShell";
import { PageHeader } from "@/components/site/PageHeader";
import { ArticleCard } from "@/components/site/ArticleCard";
import { Reveal } from "@/components/site/Reveal";
import { articlesListQuery } from "@/lib/queries";

import { SITE } from "@/lib/site";

export const Route = createFileRoute("/actualites/")({
  head: () => ({
    meta: [
      { title: "Actualités immobilières à Boulogne-Billancourt | Vincent Deby" },
      { name: "description", content: "Prix, ventes récentes et décryptages du marché immobilier à Boulogne-Billancourt, Issy-les-Moulineaux et Paris Ouest, par Vincent Deby, mandataire Efficity." },
      { property: "og:title", content: "Actualités immobilières — Vincent Deby" },
      { property: "og:description", content: "Analyses de marché, décryptages et notes sur l'immobilier." },
      { property: "og:url", content: `${SITE}/actualites` },
    ],
    links: [{ rel: "canonical", href: `${SITE}/actualites` }],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(articlesListQuery),
  component: ArticlesList,
  errorComponent: ({ error }) => (
    <SiteShell><div className="container-narrow py-24 text-sm text-muted-foreground">{error.message}</div></SiteShell>
  ),
});

function ArticlesList() {
  const { data: items } = useSuspenseQuery(articlesListQuery);
  return (
    <SiteShell>
      <PageHeader
        eyebrow="Le journal"
        title={<>Ce que disent <em className="text-brand-ink">vraiment</em> les ventes.</>}
        lede="Analyses et décryptages du marché immobilier à Boulogne-Billancourt, Issy-les-Moulineaux et Paris Ouest. Des chiffres sourcés, sans effet d'annonce."
      />
      <section className="container-narrow mt-10 md:mt-16">
        {items.length === 0 ? (
          <div className="surface px-6 py-16 text-center text-muted-foreground">
            Aucun article publié pour le moment.
          </div>
        ) : (
          <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((a) => <Reveal key={a.id}><ArticleCard a={a} /></Reveal>)}
          </div>
        )}
      </section>
    </SiteShell>
  );
}
