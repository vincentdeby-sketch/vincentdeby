import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { SiteShell } from "@/components/site/SiteShell";
import { ContactMenu } from "@/components/site/ContactMenu";
import { formatDate } from "@/lib/domain";
import { articleBySlugQuery } from "@/lib/queries";
import { PhotoImg } from "@/components/site/PhotoImg";
import { ArrowLeft } from "lucide-react";

import { SITE } from "@/lib/site";

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
    const raw = (a.excerpt ?? a.content ?? "").replace(/\s+/g, " ").trim();
    const desc = raw.length > 155 ? `${raw.slice(0, 154).replace(/\s+\S*$/, "")}…` : raw;
    // Google coupe vers 60 caractères : la signature n'est ajoutée que si elle tient.
    const suffix = " | Vincent Deby";
    const title = a.title.length + suffix.length <= 60 ? a.title + suffix : a.title;
    return {
      meta: [
        { title },
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
      <article className="container-narrow pt-8 md:pt-12">
        <Link to="/actualites" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Le journal
        </Link>
        <div className="mx-auto mt-10 max-w-3xl text-center">
          <p className="eyebrow justify-center">
            <time dateTime={a.published_at ?? a.created_at}>{formatDate(a.published_at ?? a.created_at)}</time>
            <span aria-hidden="true">·</span> Par Vincent Deby
          </p>
          <h1 className="mt-6 !text-[clamp(2.3rem,5vw,4.5rem)]">{a.title}</h1>
          {a.excerpt && <p className="mx-auto mt-6 max-w-2xl text-xl leading-relaxed text-muted-foreground">{a.excerpt}</p>}
        </div>
        {a.cover_url && (
          <div className="mt-12 aspect-[16/9] w-full overflow-hidden rounded-[1.75rem] bg-muted">
            <PhotoImg
              src={a.cover_url}
              width={1280}
              height={720}
              sizes="(min-width: 1024px) 1100px, 100vw"
              alt={a.title}
              fetchPriority="high"
              decoding="async"
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <div className="mx-auto mt-14 max-w-[42rem] whitespace-pre-wrap font-serif text-[1.3rem] leading-[1.7] text-foreground/90 first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-[4.2rem] first-letter:leading-[0.8] first-letter:text-brand-ink">
          {a.content}
        </div>
        <aside className="mx-auto mt-20 max-w-3xl rounded-[1.75rem] bg-ink px-6 py-12 text-center text-paper md:px-12">
          <p className="font-serif text-2xl">Vous envisagez de vendre ?</p>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-paper/70">
            Je vous donne un prix appuyé sur les ventes récentes de votre quartier, avec les références
            pour le vérifier.
          </p>
          <div className="mt-6 flex flex-col items-center gap-4">
            <Link
              to="/estimation"
              className="btn btn-brand"
            >
              Estimer mon bien
            </Link>
            <p className="text-xs text-paper/60">Ou parlons-en directement :</p>
            <ContactMenu align="center" variant="outline" className="[&>button]:!border-paper/30 [&>button]:!text-paper" />
          </div>
        </aside>
      </article>
    </SiteShell>
  );
}
