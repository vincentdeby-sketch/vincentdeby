import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { SiteShell } from "@/components/site/SiteShell";
import { Reveal } from "@/components/site/Reveal";
import { ArticleCard } from "@/components/site/ArticleCard";
import { PropertyCard } from "@/components/site/PropertyCard";
import { homeArticlesQuery, homePropertiesQuery } from "@/lib/queries";
import hero from "@/assets/hero-home.jpg";

const SITE = "https://debymo.lovable.app";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vincent Deby — Conseiller Immobilier, Mandataire Efficity" },
      { name: "description", content: "Estimation immobilière gratuite et accompagnement transaction. Vincent Deby, mandataire Efficity : lecture précise de votre bien, ancrée dans son marché local." },
      { property: "og:title", content: "Vincent Deby — Conseiller Immobilier, Mandataire Efficity" },
      { property: "og:description", content: "Estimation immobilière gratuite et accompagnement transaction. Une lecture précise de votre bien, ancrée dans son marché local." },
      { property: "og:url", content: `${SITE}/` },
      { property: "og:image", content: `${SITE}${hero}` },
      { name: "twitter:image", content: `${SITE}${hero}` },
    ],
    links: [
      { rel: "canonical", href: `${SITE}/` },
      { rel: "preload", as: "image", href: hero, fetchpriority: "high" } as never,
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Vincent Deby — Conseiller Immobilier",
          url: `${SITE}/`,
          inLanguage: "fr-FR",
          publisher: { "@type": "RealEstateAgent", name: "Vincent Deby", telephone: "+33610022436", email: "vdeby@efficity.com" },
        }),
      },
    ],
  }),
  loader: ({ context }) => {
    void context.queryClient.ensureQueryData(homeArticlesQuery);
    void context.queryClient.ensureQueryData(homePropertiesQuery);
  },
  component: Home,
});

function Home() {
  const { data: articles } = useSuspenseQuery(homeArticlesQuery);
  const { data: properties } = useSuspenseQuery(homePropertiesQuery);

  return (
    <SiteShell>
      {/* HERO */}
      <section className="relative">
        <div className="container-narrow pt-10 md:pt-20">
          <div className="max-w-3xl">
            <div className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground sm:text-xs">Estimation immobilière</div>
            <h1 className="mt-5 font-serif text-[clamp(2.25rem,8vw,5rem)] leading-[1.03] md:mt-6">
              Votre projet immobilier,
              <br />
              <span className="italic text-primary">au plus près.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg md:mt-8">
              Une lecture précise de votre bien, ancrée dans son marché local.
              Nous conjuguons données, terrain et discrétion pour vous proposer
              une estimation crédible — jamais gonflée, jamais dévaluée.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3 md:mt-10 md:gap-4">
              <Link
                to="/estimation"
                className="inline-flex min-h-11 items-center rounded-full bg-foreground px-7 py-3.5 text-[11px] uppercase tracking-[0.18em] text-background transition-opacity hover:opacity-90 md:px-8 md:py-4"
              >
                Estimer mon bien
              </Link>
              <Link
                to="/contact"
                className="inline-flex min-h-11 items-center rounded-full border border-foreground/20 px-7 py-3.5 text-[11px] uppercase tracking-[0.18em] transition-colors hover:border-foreground md:px-8 md:py-4"
              >
                Prendre rendez-vous
              </Link>
            </div>
          </div>
        </div>
        <Reveal className="container-narrow mt-16 md:mt-24">
          <div className="aspect-[16/9] w-full overflow-hidden bg-muted md:aspect-[21/9]">
            <img
              src={hero}
              alt="Immeubles haussmanniens parisiens au coucher du soleil"
              width={1920}
              height={1280}
              fetchPriority="high"
              decoding="async"
              className="h-full w-full object-cover"
            />
          </div>
        </Reveal>
      </section>

      {/* RÉASSURANCE */}
      <section className="container-narrow mt-32 md:mt-48">
        <Reveal className="grid gap-16 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">L'approche</div>
            <h2 className="mt-6 font-serif text-4xl leading-tight">
              Une approche mesurée,
              <br />un regard indépendant.
            </h2>
            <p className="mt-6 max-w-md leading-relaxed text-muted-foreground">
              Depuis douze ans, nous accompagnons propriétaires et acquéreurs
              dans leurs décisions les plus engageantes. Sans surenchère,
              sans procédure impersonnelle.
            </p>
          </div>
          <Metric value="1 240" label="Estimations réalisées" />
          <Metric value="12 ans" label="d'expertise locale" />
        </Reveal>
      </section>

      {/* ACTUALITÉS */}
      {articles.length > 0 && (
        <section className="container-narrow mt-32 md:mt-48">
          <Reveal className="flex items-end justify-between gap-6">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Journal</div>
              <h2 className="mt-4 font-serif text-4xl">Dernières actualités</h2>
            </div>
            <Link to="/actualites" className="hidden text-sm text-muted-foreground hover:text-foreground md:inline">Voir tout →</Link>
          </Reveal>
          <div className="mt-12 grid gap-12 md:grid-cols-3">
            {articles.map((a) => <Reveal key={a.id}><ArticleCard a={a} /></Reveal>)}
          </div>
        </section>
      )}

      {/* BIENS */}
      {properties.length > 0 && (
        <section className="container-narrow mt-32 md:mt-48">
          <Reveal className="flex items-end justify-between gap-6">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Sélection</div>
              <h2 className="mt-4 font-serif text-4xl">Biens en ligne</h2>
            </div>
            <Link to="/biens" className="hidden text-sm text-muted-foreground hover:text-foreground md:inline">Voir tout →</Link>
          </Reveal>
          <div className="mt-12 grid gap-12 md:grid-cols-3">
            {properties.map((p) => <Reveal key={p.id}><PropertyCard p={p} /></Reveal>)}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="container-narrow mt-32 md:mt-48">
        <Reveal>
          <div className="glass-strong rounded-[2rem] px-8 py-20 text-center md:px-16 md:py-24">
            <div className="mx-auto max-w-2xl">
              <h2 className="font-serif text-4xl leading-tight md:text-5xl">
                Prêt à connaître la valeur juste de votre bien ?
              </h2>
              <p className="mt-6 text-muted-foreground">
                Notre formulaire prend cinq minutes. Vous recevez ensuite un
                retour humain, argumenté, sans engagement.
              </p>
              <Link to="/estimation" className="mt-10 inline-block rounded-full bg-foreground px-10 py-4 text-xs uppercase tracking-widest text-background transition-opacity hover:opacity-90">
                Commencer l'estimation
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </SiteShell>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-serif text-5xl text-primary">{value}</div>
      <div className="mt-3 text-sm text-muted-foreground">{label}</div>
    </div>
  );
}
