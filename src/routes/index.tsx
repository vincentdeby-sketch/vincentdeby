import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { SiteShell } from "@/components/site/SiteShell";
import { Reveal } from "@/components/site/Reveal";
import { ArticleCard } from "@/components/site/ArticleCard";
import { PropertyCard } from "@/components/site/PropertyCard";
import { homeArticlesQuery, homePropertiesQuery } from "@/lib/queries";
import heroWebp1600 from "@/assets/hero-home-1600.webp";
import heroWebp960 from "@/assets/hero-home-960.webp";
import heroJpg from "@/assets/hero-home-1600.jpg";

const SITE = "https://debymo.lovable.app";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vincent Deby — Conseiller Immobilier à Boulogne-Billancourt (Efficity)" },
      { name: "description", content: "Estimation immobilière juste et accompagnement à Boulogne-Billancourt et dans l'ouest parisien. Vincent Deby, ancien journaliste devenu mandataire Efficity : rigueur, sources vérifiées, ventes réelles du quartier." },
      { property: "og:title", content: "Vincent Deby — Conseiller Immobilier à Boulogne-Billancourt" },
      { property: "og:description", content: "Estimation juste à Boulogne-Billancourt et dans l'ouest parisien. Ancien journaliste, j'applique à l'immobilier la rigueur de vérification des sources." },
      { property: "og:url", content: `${SITE}/` },
      { property: "og:image", content: `${SITE}${heroJpg}` },
      { name: "twitter:image", content: `${SITE}${heroJpg}` },
    ],
    links: [
      { rel: "canonical", href: `${SITE}/` },
      { rel: "preload", as: "image", href: heroWebp1600, imagesrcset: `${heroWebp960} 960w, ${heroWebp1600} 1600w`, imagesizes: "100vw", type: "image/webp", fetchpriority: "high" } as never,
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
          publisher: { "@type": "RealEstateAgent", name: "Vincent Deby", telephone: "+33610022436", email: "vdeby@efficity.com", areaServed: "Boulogne-Billancourt, Issy-les-Moulineaux, Sèvres, Saint-Cloud, Paris 15e, Paris 16e" },
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
            <div className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground sm:text-xs">Estimation · Boulogne-Billancourt & ouest parisien</div>
            <h1 className="mt-5 font-serif text-[clamp(2.25rem,8vw,5rem)] leading-[1.03] md:mt-6">
              Votre projet immobilier,
              <br />
              <span className="italic text-primary">sur mesure.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg md:mt-8">
              Je suis Vincent Deby, mandataire Efficity à Boulogne-Billancourt.
              Ancien journaliste, j'applique à l'estimation la rigueur du métier :
              données croisées, ventes réelles et récentes du quartier, terrain.
              Un prix argumenté — jamais gonflé pour plaire, jamais dévalué.
              Je vous accompagne avec sérieux de A à Z. Je commercialise et
              sécurise la vente jusqu'à la remise des clés.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3 md:mt-10 md:gap-4">
              <Link
                to="/estimation"
                className="inline-flex min-h-11 items-center bg-foreground px-8 py-3.5 text-[11px] uppercase tracking-[0.2em] text-background transition-colors hover:bg-primary md:px-10 md:py-4"
              >
                Estimer mon bien
              </Link>
              <Link
                to="/contact"
                className="inline-flex min-h-11 items-center border border-foreground/25 px-8 py-3.5 text-[11px] uppercase tracking-[0.2em] transition-colors hover:border-foreground md:px-10 md:py-4"
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

      {/* MON APPROCHE */}
      <section className="container-narrow mt-24 md:mt-40">
        <Reveal className="grid gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-5">
            <div className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground sm:text-xs">Mon approche</div>
            <h2 className="mt-4 font-serif text-3xl leading-tight sm:text-4xl md:mt-6 md:text-5xl">
              Vendre <span className="italic text-primary">vite, bien et au juste prix</span>
            </h2>
          </div>
          <div className="space-y-6 text-base leading-relaxed text-muted-foreground md:col-span-7 md:text-lg">
            <p>
              J'ai passé vingt-cinq ans dans le journalisme. Vérifier les sources,
              recouper les informations, distinguer un chiffre solide d'une rumeur :
              c'est le métier. J'y ai aussi appris quelque chose d'essentiel :
              la <span className="text-foreground">proximité avec ceux que l'on accompagne</span>.
              Chaque client bénéficie d'un <span className="text-foreground">suivi personnalisé</span>,
              d'une écoute réelle et d'une disponibilité sans filtre — c'est, pour moi, non négociable.
            </p>

            <p>
              Une estimation, pour moi, ce n'est pas un avis. C'est un dossier.
              Je m'appuie sur les <span className="text-foreground">ventes réelles et récentes</span> de
              votre rue, de votre immeuble, de votre quartier — Boulogne-Billancourt,
              Issy, Sèvres, Saint-Cloud, Paris 15e et 16e — et je vous les montre.
            </p>
            <p>
              Je vous dis le prix juste, même quand il ne fait pas plaisir.
              C'est la condition d'une vente qui aboutit, et d'une relation qui dure.
            </p>
            <p>
              J'applique à chaque mandat des <span className="text-foreground">stratégies éprouvées, issues du marché du luxe</span> :
              mise en scène du bien, photographies soignées, diffusion ciblée,
              sélection rigoureuse des acquéreurs et négociation menée avec méthode.
              Résultat : des biens qui se vendent vite, au bon prix, et sans concession sur la qualité du parcours.
            </p>
          </div>

        </Reveal>
      </section>


      {/* ACTUALITÉS */}
      {articles.length > 0 && (
        <section className="container-narrow mt-24 md:mt-40">
          <Reveal className="flex flex-wrap items-end justify-between gap-4 md:gap-6">
            <div className="min-w-0">
              <div className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground sm:text-xs">Journal</div>
              <h2 className="mt-3 font-serif text-3xl sm:text-4xl md:mt-4">Dernières actualités</h2>
            </div>
            <Link to="/actualites" className="text-sm text-muted-foreground hover:text-foreground">Voir tout →</Link>
          </Reveal>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 md:mt-12 md:gap-12 lg:grid-cols-3">
            {articles.map((a) => <Reveal key={a.id}><ArticleCard a={a} /></Reveal>)}
          </div>
        </section>
      )}

      {/* BIENS */}
      {properties.length > 0 && (
        <section className="container-narrow mt-24 md:mt-40">
          <Reveal className="flex flex-wrap items-end justify-between gap-4 md:gap-6">
            <div className="min-w-0">
              <div className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground sm:text-xs">Sélection</div>
              <h2 className="mt-3 font-serif text-3xl sm:text-4xl md:mt-4">Biens en ligne</h2>
            </div>
            <Link to="/biens" className="text-sm text-muted-foreground hover:text-foreground">Voir tout →</Link>
          </Reveal>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 md:mt-12 md:gap-12 lg:grid-cols-3">
            {properties.map((p) => <Reveal key={p.id}><PropertyCard p={p} /></Reveal>)}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="container-narrow mt-24 md:mt-40">
        <Reveal>
          <div className="border-t border-b border-foreground/15 bg-background/50 px-6 py-16 text-center sm:px-10 md:px-16 md:py-24">
            <div className="mx-auto max-w-2xl">
              <h2 className="font-serif text-3xl leading-tight sm:text-4xl md:text-5xl">
                Envie de connaître la valeur juste de votre bien ?
              </h2>
              <p className="mt-5 text-muted-foreground md:mt-6">
                Le formulaire prend cinq minutes. Je vous rappelle ensuite
                avec un retour humain, argumenté, sans engagement.
              </p>

              <Link
                to="/estimation"
                className="mt-8 inline-flex min-h-11 items-center bg-foreground px-10 py-3.5 text-[11px] uppercase tracking-[0.2em] text-background transition-colors hover:bg-primary md:mt-10 md:px-12 md:py-4"
              >
                Commencer l'estimation
              </Link>
            </div>
          </div>

        </Reveal>
      </section>
    </SiteShell>
  );
}

