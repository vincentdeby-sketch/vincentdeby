import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { SiteShell } from "@/components/site/SiteShell";
import { ArticleCard } from "@/components/site/ArticleCard";
import { Reveal } from "@/components/site/Reveal";
import { articlesListQuery } from "@/lib/queries";

export const Route = createFileRoute("/actualites")({
  head: () => ({
    meta: [
      { title: "Actualités — Maison & Associés" },
      { name: "description", content: "Analyses de marché, décryptages et notes du cabinet." },
      { property: "og:title", content: "Actualités — Maison & Associés" },
      { property: "og:description", content: "Analyses de marché, décryptages et notes du cabinet." },
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
      <section className="container-narrow pt-16 md:pt-24">
        <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Journal</div>
        <h1 className="mt-6 font-serif text-5xl md:text-6xl">Actualités</h1>
        <p className="mt-6 max-w-xl text-muted-foreground">
          Nos analyses, décryptages et notes autour du marché immobilier.
        </p>
      </section>
      <section className="container-narrow mt-16">
        {items.length === 0 ? (
          <div className="border border-dashed border-border py-24 text-center text-sm text-muted-foreground">
            Aucun article publié pour le moment.
          </div>
        ) : (
          <div className="grid gap-16 md:grid-cols-2 lg:grid-cols-3">
            {items.map((a) => <Reveal key={a.id}><ArticleCard a={a} /></Reveal>)}
          </div>
        )}
      </section>
    </SiteShell>
  );
}
