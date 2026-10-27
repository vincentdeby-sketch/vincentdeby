import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { SiteShell } from "@/components/site/SiteShell";
import { ListSkeleton } from "@/components/site/Skeletons";
import { PageHeader } from "@/components/site/PageHeader";
import { ArticleCard } from "@/components/site/ArticleCard";
import { Reveal } from "@/components/site/Reveal";
import { articlesListQuery } from "@/lib/queries";
import { liveLocalArticles } from "@/lib/articles";

import { SITE } from "@/lib/site";

export const Route = createFileRoute("/actualites/")({
  pendingComponent: ListSkeleton,
  pendingMs: 200,
  head: () => ({
    meta: [
      { title: "Journal de l'immobilier à Boulogne | Vincent Deby" },
      { name: "description", content: "Prix, ventes récentes et décryptages du marché immobilier à Boulogne-Billancourt, Issy-les-Moulineaux et Paris Ouest, par Vincent Deby, mandataire Efficity." },
      { property: "og:title", content: "Actualités immobilières | Vincent Deby" },
      { property: "og:description", content: "Prix, ventes réelles, diagnostics, fiscalité : ce qu'il faut savoir pour vendre ou acheter à Boulogne-Billancourt et dans l'ouest parisien." },
      { property: "og:url", content: `${SITE}/actualites` },
    ],
    links: [{ rel: "canonical", href: `${SITE}/actualites` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "Le journal de Vincent Deby",
          url: `${SITE}/actualites`,
          inLanguage: "fr-FR",
          author: { "@type": "Person", name: "Vincent Deby" },
          blogPost: liveLocalArticles().map((a) => ({
            "@type": "BlogPosting",
            headline: a.title,
            url: `${SITE}/actualites/${a.slug}`,
            datePublished: a.published_at,
          })),
        }),
      },
    ],
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
        lede="Ce que je vois sur le terrain et dans les ventes publiées, à Boulogne-Billancourt, Issy-les-Moulineaux et dans l'ouest parisien. Chaque chiffre a sa source."
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
