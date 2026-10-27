import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { SiteShell } from "@/components/site/SiteShell";
import { ContactMenu } from "@/components/site/ContactMenu";
import { formatDate } from "@/lib/domain";
import { articleBySlugQuery, articlesListQuery } from "@/lib/queries";
import { ArticleBody, articleHeadings } from "@/components/site/ArticleBody";
import { ArticleCard } from "@/components/site/ArticleCard";
import { readingMinutes } from "@/lib/articles";
import heroJpg from "@/assets/hero-home-1600.jpg";
import { PhotoImg } from "@/components/site/PhotoImg";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

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
          { title: "Article introuvable | Vincent Deby" },
          { name: "robots", content: "noindex" },
        ],
        links: [{ rel: "canonical", href: url }],
      };
    }
    const a = loaderData;
    const raw = (a.excerpt ?? a.content ?? "").replace(/[#*>\[\]]|\(\/[^)]*\)/g, "").replace(/\s+/g, " ").trim();
    const image = a.cover_url ?? `${SITE}${heroJpg}`;
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
        { property: "og:image", content: image },
        { name: "twitter:image", content: image },
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
            image,
            articleSection: a.category ?? undefined,
            wordCount: a.content.split(/\s+/).length,
            datePublished: a.published_at ?? a.created_at,
            dateModified: a.updated_at ?? a.published_at ?? a.created_at,
            mainEntityOfPage: url,
            inLanguage: "fr-FR",
            author: {
              "@type": "Person",
              name: "Vincent Deby",
              url: `${SITE}/`,
              jobTitle: "Conseiller immobilier, mandataire Efficity",
            },
            publisher: {
              "@type": "Organization",
              name: "Vincent Deby, conseiller immobilier",
              url: `${SITE}/`,
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
  const { data: all } = useQuery(articlesListQuery);
  if (!a) throw notFound();

  const date = a.published_at ?? a.created_at;
  const headings = articleHeadings(a.content);
  const others = (all ?? []).filter((x) => x.slug !== a.slug);
  const related = [
    ...others.filter((x) => a.category && x.category === a.category),
    ...others.filter((x) => !a.category || x.category !== a.category),
  ].slice(0, 3);

  return (
    <SiteShell>
      <article className="container-narrow pt-8 md:pt-12">
        <nav aria-label="Fil d'Ariane" className="text-sm text-muted-foreground">
          <Link to="/actualites" className="inline-flex items-center gap-2 hover:text-foreground">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Le journal
          </Link>
        </nav>
        <header className="mx-auto mt-10 max-w-3xl text-center">
          <p className="eyebrow justify-center">
            {a.category && <><span>{a.category}</span><span aria-hidden="true">·</span></>}
            <time dateTime={date}>{formatDate(date)}</time>
            <span aria-hidden="true">·</span> {readingMinutes(a.content)} min de lecture
          </p>
          <h1 className="mt-6 !text-[clamp(2.1rem,4.6vw,4rem)]">{a.title}</h1>
          {a.excerpt && <p className="mx-auto mt-6 max-w-2xl text-xl leading-relaxed text-muted-foreground">{a.excerpt}</p>}
          <p className="mt-6 text-sm text-muted-foreground">Par Vincent Deby, conseiller immobilier à Boulogne-Billancourt</p>
        </header>
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
        {headings.length >= 3 && (
          <nav aria-label="Sommaire" className="mx-auto mt-12 max-w-[42rem] rounded-2xl border border-border p-5 text-sm">
            <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">Dans cet article</p>
            <ol className="mt-3 space-y-1.5">
              {headings.map((h) => (
                <li key={h.id}>
                  <a href={`#${h.id}`} className="hover:text-brand-ink">{h.text}</a>
                </li>
              ))}
            </ol>
          </nav>
        )}
        <div className="mx-auto mt-8 max-w-[42rem] font-serif text-[1.22rem] leading-[1.7] text-foreground/90">
          <ArticleBody
            content={a.content}
            cta={
              <aside className="my-12 rounded-2xl border border-border bg-card p-6 font-sans text-base leading-relaxed">
                <p className="font-medium text-foreground">Ce qui s'est vendu près de chez vous</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Entrez votre adresse : l'outil affiche les ventes comparables publiées dans votre quartier.
                </p>
                <Link to="/ventes-autour-de-chez-moi" className="group btn btn-primary mt-4 !min-h-11">
                  Voir les ventes autour de chez moi
                  <span className="btn-arrow" aria-hidden="true"><ArrowUpRight className="h-3.5 w-3.5" /></span>
                </Link>
              </aside>
            }
          />
        </div>
        <aside className="mx-auto mt-20 max-w-3xl rounded-[1.75rem] bg-ink px-6 py-12 text-center text-paper md:px-12">
          <p className="font-serif text-2xl">Combien vaut votre bien, aujourd'hui ?</p>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-paper/70">
            Je vous donne un prix appuyé sur les ventes récentes de votre quartier, avec les références
            pour le vérifier. Gratuit, et sans engagement.
          </p>
          <div className="mt-6 flex flex-col items-center gap-4">
            <Link to="/estimation" className="group btn btn-brand">
              Estimer mon bien
              <span className="btn-arrow !bg-ink !text-brand" aria-hidden="true"><ArrowUpRight className="h-3.5 w-3.5" /></span>
            </Link>
            <p className="text-xs text-paper/60">Ou parlons-en directement :</p>
            <ContactMenu align="center" variant="outline" className="[&>button]:!border-paper/30 [&>button]:!text-paper" />
          </div>
        </aside>
      </article>
      {related.length > 0 && (
        <section className="container-narrow section" aria-labelledby="a-lire-aussi">
          <h2 id="a-lire-aussi" className="!text-[clamp(1.6rem,2.6vw,2.2rem)]">À lire aussi</h2>
          <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => <ArticleCard key={r.slug} a={r} />)}
          </div>
        </section>
      )}
    </SiteShell>
  );
}
