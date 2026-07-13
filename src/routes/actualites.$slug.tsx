import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { SiteShell } from "@/components/site/SiteShell";
import { formatDate } from "@/lib/domain";
import { articleBySlugQuery } from "@/lib/queries";

const SITE = "https://debymo.lovable.app";

export const Route = createFileRoute("/actualites/$slug")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(articleBySlugQuery(params.slug));
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData, params }) => {
    const url = `${SITE}/actualites/${params?.slug ?? ""}`;
    if (!loaderData) {
      return {
        meta: [
          { title: "Article introuvable — Vincent Deby" },
          { name: "robots", content: "noindex" },
        ],
        links: [{ rel: "canonical", href: url }],
      };
    }
    const a = loaderData;
    const desc = (a.excerpt ?? a.content ?? "").slice(0, 160);
    return {
      meta: [
        { title: `${a.title} — Journal Vincent Deby` },
        { name: "description", content: desc },
        { property: "og:title", content: a.title },
        { property: "og:description", content: desc },
        { property: "og:url", content: url },
        { property: "og:type", content: "article" },
        ...(a.cover_url
          ? [
              { property: "og:image", content: a.cover_url },
              { name: "twitter:image", content: a.cover_url },
            ]
          : []),
        ...(a.published_at ? [{ property: "article:published_time", content: a.published_at }] : []),
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: a.title,
            description: desc,
            image: a.cover_url ?? undefined,
            datePublished: a.published_at ?? a.created_at,
            dateModified: a.updated_at ?? a.published_at ?? a.created_at,
            mainEntityOfPage: url,
            inLanguage: "fr-FR",
            author: { "@type": "Person", name: "Vincent Deby" },
            publisher: {
              "@type": "Organization",
              name: "Vincent Deby — Conseiller Immobilier",
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
              { "@type": "ListItem", position: 2, name: "Actualités", item: `${SITE}/actualites` },
              { "@type": "ListItem", position: 3, name: a.title, item: url },
            ],
          }),
        },
      ],
    };
  },
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
        <div className="mt-6 text-sm text-muted-foreground">
          <time dateTime={a.published_at ?? a.created_at}>{formatDate(a.published_at ?? a.created_at)}</time>
        </div>
        {a.cover_url && (
          <div className="mt-12 aspect-[16/9] w-full overflow-hidden bg-muted">
            <img
              src={a.cover_url}
              alt={a.title}
              fetchPriority="high"
              decoding="async"
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <div className="prose prose-neutral mx-auto mt-12 max-w-2xl whitespace-pre-wrap text-lg leading-relaxed text-foreground/90">
          {a.content}
        </div>
      </article>
    </SiteShell>
  );
}
