import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Check, Plus } from "lucide-react";
import portrait from "@/assets/vincent-deby-200.webp";
import { FAQ } from "@/lib/faq";
import { HeroAddress } from "@/components/site/HeroAddress";
import { MethodSteps } from "@/components/motion/MethodSteps";
import { BeforeAfter } from "@/components/site/BeforeAfter";
import { STAGINGS } from "@/data/home-staging";
import { SECTORS } from "@/lib/sectors";
import { useSuspenseQuery } from "@tanstack/react-query";
import { SiteShell } from "@/components/site/SiteShell";
import { Reveal } from "@/components/site/Reveal";
import { ArticleCard } from "@/components/site/ArticleCard";
import { PropertyCard } from "@/components/site/PropertyCard";
import { homeArticlesQuery, listingsQuery, sectorMarketQuery } from "@/lib/queries";
import { useQuery } from "@tanstack/react-query";
import { formatDate, formatEUR } from "@/lib/domain";
import { PriceGap } from "@/components/site/PriceGap";
import heroWebp1600 from "@/assets/hero-home-1600.webp";
import heroWebp960 from "@/assets/hero-home-960.webp";
import heroWebp640 from "@/assets/hero-home-640.webp";
import heroJpg from "@/assets/hero-home-1600.jpg";

import { SITE } from "@/lib/site";
import { ZONES } from "@/lib/zones";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vincent Deby, conseiller immobilier à Boulogne-Billancourt" },
      { name: "description", content: "Le prix juste, preuves à l'appui. Estimation immobilière gratuite à Boulogne-Billancourt, Issy-les-Moulineaux, Paris 15e, 16e et Paris Ouest par Vincent Deby, mandataire Efficity." },
      { property: "og:title", content: "Vincent Deby, conseiller immobilier à Boulogne-Billancourt" },
      { property: "og:description", content: "Estimation immobilière et accompagnement à Boulogne-Billancourt par Vincent Deby, mandataire Efficity. Rigueur, données réelles et suivi de A à Z." },
      { name: "twitter:title", content: "Vincent Deby, conseiller immobilier à Boulogne-Billancourt" },
      { name: "twitter:description", content: "Estimation immobilière et accompagnement à Boulogne-Billancourt par Vincent Deby, mandataire Efficity." },
      { property: "og:url", content: `${SITE}/` },
      { property: "og:image", content: `${SITE}${heroJpg}` },
      { name: "twitter:image", content: `${SITE}${heroJpg}` },
    ],
    links: [
      { rel: "canonical", href: `${SITE}/` },
      { rel: "preload", as: "image", href: heroWebp960, imageSrcSet: `${heroWebp640} 640w, ${heroWebp960} 960w, ${heroWebp1600} 1600w`, imageSizes: "(min-width: 1024px) 40vw, 100vw", type: "image/webp", fetchPriority: "high" } as never,
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Vincent Deby, conseiller immobilier",
          url: `${SITE}/`,
          inLanguage: "fr-FR",
          publisher: { "@type": "RealEstateAgent", name: "Vincent Deby", telephone: "+33610022436", email: "vdeby@efficity.com", areaServed: ZONES },
        }),
      },
    ],
  }),

  loader: ({ context }) => {
    void context.queryClient.ensureQueryData(homeArticlesQuery);
    void context.queryClient.ensureQueryData(listingsQuery);
  },
  component: Home,
});


// Vidéo du haut de page (boucle muette de quelques secondes). Laisser vide pour afficher la photo.
const HERO_VIDEO = "";

const METHOD = [
  {
    n: "01",
    title: "Écouter",
    text: "Je commence par vous écouter : vos délais, vos contraintes, la raison de la vente. C'est ce qui décide de la stratégie, avant même les mètres carrés.",
  },
  {
    n: "02",
    title: "Vérifier",
    text: "Je recoupe les ventes signées chez le notaire dans votre rue et votre quartier, et non les prix affichés en vitrine. Chaque référence vous est montrée avec sa date et son adresse.",
  },
  {
    n: "03",
    title: "Raconter",
    text: "J'écris l'annonce moi-même et je soigne les photos. Une annonce précise attire des acheteurs qui savent déjà ce qu'ils viennent voir, et les visites sont plus utiles.",
  },
  {
    n: "04",
    title: "Accompagner",
    text: "Visites, sélection des acquéreurs, négociation, compromis. Je reste votre seul interlocuteur jusqu'à la remise des clés.",
  },
];

const DOSSIER = [
  "Les ventes comparables récentes, avec adresse, date et prix signé",
  "Le prix au mètre carré de votre micro-quartier, pas de la ville entière",
  "Les points forts et les points faibles du bien, dits franchement",
  "Une stratégie de mise en vente adaptée à votre calendrier",
];



function Home() {
  const { data: articles } = useSuspenseQuery(homeArticlesQuery);
  const { data: listings } = useSuspenseQuery(listingsQuery);
  const properties = listings.forSale.slice(0, 3);

  return (
    <SiteShell>
      {/* HERO */}
      <section className="container-narrow pt-8 md:pt-14">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="min-w-0 lg:col-span-7">
            <p className="eyebrow">
              Conseiller immobilier · Boulogne-Billancourt
            </p>
            <h1 className="mt-6">
              Le prix juste,<br />
              <em className="text-brand-ink">preuves à l'appui.</em>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              Vingt-cinq ans de journalisme m'ont appris à vérifier avant d'affirmer. Pour votre bien,
              c'est pareil : un prix adossé aux ventes réelles et récentes du quartier, que je vous
              montre une par une.
            </p>
            <div className="mt-9">
              <HeroAddress />
              <p className="mt-4 text-sm text-muted-foreground">
                <Link to="/ventes-autour-de-chez-moi" className="font-medium text-foreground underline decoration-brand decoration-2 underline-offset-4">
                  Voir les ventes autour de chez moi
                </Link>
                <span className="mx-2" aria-hidden="true">·</span>
                Ou parlons-en :{" "}
                <a href="tel:+33610022436" className="whitespace-nowrap font-medium text-foreground underline decoration-brand decoration-2 underline-offset-4">
                  06 10 02 24 36
                </a>
              </p>
            </div>
            <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
              <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-brand-ink" aria-hidden="true" />Gratuit, sans engagement</li>
              <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-brand-ink" aria-hidden="true" />Réponse sous 48 h ouvrées</li>
              <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-brand-ink" aria-hidden="true" />Réseau Efficity</li>
            </ul>
          </div>

          <div className="relative lg:col-span-5">
            <div className="aspect-[4/3] overflow-hidden rounded-[2rem] bg-muted lg:aspect-[4/5]">
              {HERO_VIDEO ? (
                <video
                  className="h-full w-full object-cover"
                  src={HERO_VIDEO}
                  poster={heroJpg}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  aria-label="Vincent Deby dans les rues de Boulogne-Billancourt"
                />
              ) : (
              <picture className="parallax block h-full">
                <source
                  type="image/webp"
                  srcSet={`${heroWebp640} 640w, ${heroWebp960} 960w, ${heroWebp1600} 1600w`}
                  sizes="(min-width: 1024px) 40vw, 100vw"
                />
                <img
                  src={heroJpg}
                  alt="Façade d'immeuble haussmannien aux balcons en fer forgé"
                  width={1600}
                  height={1067}
                  fetchPriority="high"
                  decoding="async"
                  className="scroll-zoom h-full w-full object-cover"
                />
              </picture>
              )}
            </div>
            <div className="absolute -bottom-6 left-4 right-4 flex items-center gap-3 rounded-2xl border border-foreground/10 bg-background/90 p-3 pr-4 shadow-[0_20px_50px_-24px_rgb(18_20_17/0.5)] backdrop-blur-xl sm:left-6 sm:right-auto">
              <img src={portrait} alt="Vincent Deby" width={48} height={48} className="h-12 w-12 rounded-full object-cover" />
              <div className="min-w-0">
                <p className="font-serif text-lg leading-tight">Vincent Deby</p>
                <p className="text-xs text-muted-foreground">Ancien journaliste, 25 ans de métier</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMMUNES */}
      <section aria-label="Secteur couvert" className="marquee mt-20 overflow-hidden border-y border-foreground/10 py-5 md:mt-28">
        <div className="marquee-track gap-10 pr-10 font-serif text-2xl md:text-3xl">
          {[...ZONES, ...ZONES].map((z, i) => {
            const sector = SECTORS.find((x) => x.name === z);
            const hidden = i >= ZONES.length;
            return (
              <span key={i} className="flex items-center gap-10" aria-hidden={hidden || undefined}>
                {sector ? (
                  <Link to="/secteurs/$slug" params={{ slug: sector.slug }} tabIndex={hidden ? -1 : undefined} className="text-foreground/70 transition-colors hover:text-brand-ink">
                    {z}
                  </Link>
                ) : (
                  <span className="text-foreground/70">{z}</span>
                )}
                <span className="h-2 w-2 rounded-full bg-brand" aria-hidden="true" />
              </span>
            );
          })}
        </div>
      </section>

      {/* MÉTHODE */}
      <section className="container-narrow section">
        <Reveal className="grid gap-6 md:grid-cols-12">
          <p className="eyebrow md:col-span-3">01 · La méthode</p>
          <h2 className="md:col-span-9">
            Un métier de journaliste, <em className="text-brand-ink">appliqué à votre vente.</em>
          </h2>
        </Reveal>
        <MethodSteps steps={METHOD} />
      </section>

      {/* LE PIÈGE DES MOYENNES */}
      {listings.prices && (
        <section className="container-narrow pb-[clamp(4rem,9vw,8rem)]">
          <Reveal>
            <PriceGap prices={listings.prices} />
          </Reveal>
        </section>
      )}

      {/* LE DOSSIER */}
      <section className="px-3 sm:px-5">
        <div className="grain overflow-hidden rounded-[2rem] bg-ink text-paper">
          <div className="container-narrow section grid gap-14 lg:grid-cols-2 lg:items-center">
            <Reveal>
              <p className="eyebrow !text-paper/60">02 · Ce que vous recevez</p>
              <h2 className="mt-6">
                Une estimation, c'est un dossier <em className="text-brand">que vous pouvez vérifier.</em>
              </h2>
              <ul className="mt-10 space-y-4">
                {DOSSIER.map((d) => (
                  <li key={d} className="flex gap-4 text-paper/85">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand text-ink">
                      <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                    {d}
                  </li>
                ))}
              </ul>
              <Link to="/estimation" className="group btn btn-brand mt-10">
                Recevoir mon dossier
                <span className="btn-arrow !bg-ink !text-brand" aria-hidden="true"><ArrowUpRight className="h-3.5 w-3.5" /></span>
              </Link>
            </Reveal>

            <Reveal>
              <DossierSample />
            </Reveal>
          </div>
        </div>
      </section>

      {/* HOME STAGING AVANT / APRÈS */}
      {STAGINGS.length > 0 && (
        <section className="container-narrow section">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow">Mise en valeur</p>
              <h2 className="mt-4">Le même bien, <em className="text-brand-ink">mieux raconté.</em></h2>
            </div>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {STAGINGS.map((st, i) => (
              <Reveal key={i}>
                <BeforeAfter before={st.before} after={st.after} alt={st.caption} />
                <p className="mt-3 text-sm text-muted-foreground">{st.caption}</p>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* QUI JE SUIS */}
      <section className="container-narrow section">
        <div className="grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <p className="eyebrow">03 · Qui je suis</p>
            <blockquote className="mt-6">
              <p className="font-serif text-[clamp(1.8rem,3.2vw,2.9rem)] leading-[1.1] tracking-[-0.03em]">
                « J'ai passé vingt-cinq ans à écouter des gens avant d'écrire une ligne. Je fais pareil avant de donner un prix. »
              </p>
            </blockquote>
            <div className="mt-8 flex items-center gap-4">
              <img src={portrait} alt="" width={56} height={56} className="h-14 w-14 rounded-full object-cover" />
              <div>
                <p className="font-medium">Vincent Deby</p>
                <p className="text-sm text-muted-foreground">Conseiller immobilier, mandataire Efficity</p>
              </div>
            </div>
          </Reveal>
          <Reveal className="space-y-5 text-muted-foreground lg:col-span-5 lg:pt-12">
            <p>
              Journaliste pendant vingt-cinq ans : mon
              travail a été de vérifier les faits et de comprendre les gens avant de raconter quoi que
              ce soit.
            </p>
            <p>
              Je fais la même chose avec votre vente. Je recoupe les chiffres, je vous dis le prix juste
              même quand il ne fait pas plaisir, et je raconte votre bien de façon à ce que les bons
              acquéreurs s'y reconnaissent.
            </p>
            <dl className="grid grid-cols-2 gap-4 border-t border-foreground/10 pt-6">
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-[0.08em]">Avant</dt>
                <dd className="mt-1 text-foreground">25 ans de journalisme</dd>
              </div>
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-[0.08em]">Depuis 2025</dt>
                <dd className="mt-1 text-foreground">Conseiller immobilier Efficity</dd>
              </div>
            </dl>
          </Reveal>
        </div>
      </section>

      {/* BIENS */}
      {properties.length > 0 && (
        <section className="container-narrow">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow">04 · À vendre</p>
              <h2 className="mt-4">Biens en ce moment</h2>
            </div>
            <Link to="/biens" className="group btn btn-ghost">
              Tous les biens
              <span className="btn-arrow" aria-hidden="true"><ArrowUpRight className="h-3.5 w-3.5" /></span>
            </Link>
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 md:mt-14">
            {properties.map((p) => <Reveal key={p.id}><PropertyCard p={p} /></Reveal>)}
          </div>
        </section>
      )}

      {/* JOURNAL */}
      {articles.length > 0 && (
        <section className="container-narrow section">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow">05 · Le journal</p>
              <h2 className="mt-4">Ce que disent les ventes</h2>
            </div>
            <Link to="/actualites" className="group btn btn-ghost">
              Tous les articles
              <span className="btn-arrow" aria-hidden="true"><ArrowUpRight className="h-3.5 w-3.5" /></span>
            </Link>
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 md:mt-14">
            {articles.map((a) => <Reveal key={a.id}><ArticleCard a={a} /></Reveal>)}
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className={`container-narrow ${articles.length > 0 ? "" : "section"}`}>
        <div className="grid gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <p className="eyebrow">06 · Questions fréquentes</p>
            <h2 className="mt-4">Avant de se parler</h2>
            <p className="mt-5 text-muted-foreground">
              Une autre question ? Appelez-moi au{" "}
              <a href="tel:+33610022436" className="whitespace-nowrap text-foreground underline decoration-brand decoration-2 underline-offset-4">06 10 02 24 36</a>.
            </p>
          </Reveal>
          <Reveal className="lg:col-span-8">
            <div className="divide-y divide-foreground/10 border-y border-foreground/10">
              {FAQ.map((f) => (
                <details key={f.q} className="group py-1">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-lg font-medium [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-foreground/15 transition-transform duration-300 group-open:rotate-45 group-open:bg-brand group-open:border-brand">
                      <Plus className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </summary>
                  <p className="max-w-2xl pb-6 pr-14 text-muted-foreground">{f.a}</p>
                </details>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </SiteShell>
  );
}

// Extrait réel : les dernières ventes d'appartements publiées à Boulogne-Billancourt (DVF).
function DossierSample() {
  const { data, isPending } = useQuery(sectorMarketQuery("boulogne-billancourt"));
  const sales = data?.recent.slice(0, 4) ?? [];
  return (
    <figure>
      <div className="rounded-3xl bg-paper p-6 text-ink shadow-[0_40px_80px_-30px_rgb(0_0_0/0.6)] md:p-8">
        <div className="flex items-center justify-between gap-4 border-b border-ink/10 pb-4">
          <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink/60">Extrait d'un dossier</span>
          <span className="rounded-md border-2 border-brand-ink px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-brand-ink">Source : DVF</span>
        </div>
        <p className="mt-5 font-serif text-2xl leading-tight">Dernières ventes publiées à Boulogne-Billancourt</p>
        {sales.length > 0 ? (
          <ul className="mt-5 divide-y divide-ink/10">
            {sales.map((v, i) => (
              <li key={i} className="grid grid-cols-[1fr_auto] gap-x-4 py-3 text-sm">
                <span className="font-medium">{v.address}</span>
                <span className="text-right font-semibold tabular-nums">{formatEUR(v.pricePerM2)}/m²</span>
                <span className="text-ink/60">{formatDate(v.date)} · {Math.round(v.surface)} m²{v.rooms ? ` · ${v.rooms} p.` : ""}</span>
                <span className="text-right text-ink/60 tabular-nums">{formatEUR(v.price)}</span>
              </li>
            ))}
          </ul>
        ) : isPending ? (
          <div className="mt-5 space-y-3" aria-hidden="true">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-12 rounded-xl" />)}
          </div>
        ) : (
          <p className="mt-5 text-sm leading-relaxed text-ink/70">
            Pour chaque vente retenue : l'adresse, la date de signature, la surface, le prix payé et le
            prix au m². Ce sont les données publiques DVF, issues des actes notariés.
          </p>
        )}
      </div>
      <figcaption className="mt-6 text-center text-sm text-paper/60">
        Pour votre bien, je retiens les ventes les plus proches et les plus comparables, rue par rue.{" "}
        <Link to="/secteurs/$slug" params={{ slug: "boulogne-billancourt" }} className="text-paper underline decoration-brand decoration-2 underline-offset-4">
          Voir le marché de Boulogne
        </Link>
      </figcaption>
    </figure>
  );
}
