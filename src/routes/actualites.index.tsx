import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { SiteShell } from "@/components/site/SiteShell";
import { ArticleCard } from "@/components/site/ArticleCard";
import { Reveal } from "@/components/site/Reveal";
import { articlesListQuery } from "@/lib/queries";

import { SITE } from "@/lib/site";

export const Route = createFileRoute("/actualites/")({
  head: () => ({
    meta: [
      { title: "Actualités immobilières à Boulogne-Billancourt | Vincent Deby" },
      { name: "description", content: "Prix, ventes récentes et décryptages du marché immobilier à Boulogne-Billancourt et dans l'ouest parisien, par Vincent Deby, mandataire Efficity." },
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
      <section className="container-narrow pt-12 md:pt-24">
        <div className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground sm:text-xs">Journal</div>
        <h1 className="mt-4 font-serif text-4xl leading-[1.05] sm:text-5xl md:mt-6 md:text-6xl">Actualités</h1>
        <p className="mt-5 max-w-xl text-muted-foreground md:mt-6">
          Mes analyses et décryptages du marché immobilier et, plus particulièrement à Boulogne-Billancourt et dans l’ouest parisien.
        </p>
      </section>
      <section className="container-narrow mt-10 md:mt-16">
        {items.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border py-20 text-center text-sm text-muted-foreground">
            Aucun article publié pour le moment.
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:gap-16">
            {items.map((a) => <Reveal key={a.id}><ArticleCard a={a} /></Reveal>)}
          </div>
        )}
      </section>
    </SiteShell>
  );
}
