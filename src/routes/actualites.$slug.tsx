import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { SiteShell } from "@/components/site/SiteShell";
import { formatDate } from "@/lib/domain";
import { articleBySlugQuery } from "@/lib/queries";

export const Route = createFileRoute("/actualites/$slug")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(articleBySlugQuery(params.slug));
    if (!data) throw notFound();
  },
  head: ({ loaderData: _l, params }) => ({
    meta: [{ title: params ? `Article — ${params.slug}` : "Article" }],
  }),
  component: ArticleDetail,
  notFoundComponent: () => (
    <SiteShell>
      <div className="container-narrow py-32 text-center">
        <h1 className="font-serif text-4xl">Article introuvable</h1>
        <Link to="/actualites" className="mt-6 inline-block text-primary underline">Retour aux actualités</Link>
      </div>
    </SiteShell>
  ),
  errorComponent: ({ error }) => (
    <SiteShell><div className="container-narrow py-24 text-sm text-muted-foreground">{error.message}</div></SiteShell>
  ),
});

function ArticleDetail() {
  const { slug } = Route.useParams();
  const { data: a } = useSuspenseQuery(articleBySlugQuery(slug));
  if (!a) throw notFound();

  return (
    <SiteShell>
      <article className="container-narrow pt-16 md:pt-24">
        <Link to="/actualites" className="text-xs uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground">← Journal</Link>
        <h1 className="mt-8 max-w-3xl font-serif text-4xl leading-tight md:text-6xl">{a.title}</h1>
        <div className="mt-6 text-sm text-muted-foreground">{formatDate(a.published_at ?? a.created_at)}</div>
        {a.cover_url && (
          <div className="mt-12 aspect-[16/9] w-full overflow-hidden bg-muted">
            <img src={a.cover_url} alt={a.title} loading="lazy" decoding="async" className="h-full w-full object-cover" />
          </div>
        )}
        <div className="prose prose-neutral mx-auto mt-12 max-w-2xl whitespace-pre-wrap text-lg leading-relaxed text-foreground/90">
          {a.content}
        </div>
      </article>
    </SiteShell>
  );
}
