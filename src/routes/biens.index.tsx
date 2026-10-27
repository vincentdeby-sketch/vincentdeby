import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";
import { Map as MapIcon } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { SiteShell } from "@/components/site/SiteShell";
import { ListSkeleton } from "@/components/site/Skeletons";
import { PageHeader } from "@/components/site/PageHeader";
import { PropertyCard } from "@/components/site/PropertyCard";
import { Reveal } from "@/components/site/Reveal";
import { propertiesListQuery } from "@/lib/queries";
import { PhotoImg } from "@/components/site/PhotoImg";
import { BuyerAlert } from "@/components/site/BuyerAlert";

import { SITE } from "@/lib/site";

export const Route = createFileRoute("/biens/")({
  pendingComponent: ListSkeleton,
  pendingMs: 200,
  head: () => ({
    meta: [
      { title: "Biens à vendre à Boulogne-Billancourt | Vincent Deby" },
      { name: "description", content: "Appartements et maisons à vendre à Boulogne-Billancourt, Issy-les-Moulineaux, Paris 15e et 16e, et les biens déjà vendus par Vincent Deby, mandataire Efficity." },
      { property: "og:title", content: "Nos biens à la vente | Vincent Deby" },
      { property: "og:description", content: "Une sélection de biens à la vente, choisis avec soin." },
      { property: "og:url", content: `${SITE}/biens` },
    ],
    links: [{ rel: "canonical", href: `${SITE}/biens` }],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(propertiesListQuery),
  component: List,
  errorComponent: ({ error }) => (
    <SiteShell><div className="container-narrow py-24 text-sm text-muted-foreground">{error.message}</div></SiteShell>
  ),
});

const PropertyMap = lazy(() => import("@/components/site/PropertyMap"));

function List() {
  const { data } = useSuspenseQuery(propertiesListQuery);
  const [active, setActive] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const items = data.forSale;
  // Ventes récentes lues sur Efficity, puis références plus anciennes (sans doublon).
  const sold = [
    ...data.sold.map((s) => ({
      id: `s-${s.id}`,
      type: s.type.charAt(0).toUpperCase() + s.type.slice(1),
      city: `${s.city} (${s.postalCode})`,
      surface: s.surface,
      cover_url: s.cover,
    })),
    ...SOLD,
  ].filter((s, i, all) => all.findIndex((x) => x.id === s.id) === i);
  return (
    <SiteShell>
      <PageHeader
        eyebrow="Biens à vendre"
        title={<>Des biens présentés <em className="text-brand-ink">tels qu'ils sont.</em></>}
        lede="Les biens que j'ai en vente, décrits tels qu'ils sont. Si une annonce vous intéresse, appelez-moi : je réponds à vos questions avant la visite."
      />
      <section className="container-narrow mt-10 md:mt-16" aria-labelledby="a-vendre">
        <h2 id="a-vendre" className="sr-only">Biens à vendre</h2>
        {items.length === 0 ? (
          <div className="surface px-6 py-16 text-center">
            <p className="font-serif text-2xl">Aucun bien en ligne pour le moment.</p>
            <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
              Certains biens se vendent avant d'être publiés. Dites-moi ce que vous cherchez, je vous préviens.
            </p>
            <a href="/contact" className="btn btn-primary mt-6">Me dire ce que je cherche</a>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="grid content-start gap-x-6 gap-y-12 sm:grid-cols-2 lg:col-span-7">
              {items.map((p) => (
                <Reveal key={p.id} onMouseEnter={() => setActive(p.id)} onMouseLeave={() => setActive(null)}>
                  <PropertyCard p={p} highlighted={active === p.id} />
                </Reveal>
              ))}
            </div>
            <div className="order-first lg:order-none lg:col-span-5">
              <button type="button" onClick={() => setShowMap((v) => !v)} className="btn btn-ghost w-full lg:hidden" aria-expanded={showMap}>
                <MapIcon className="h-4 w-4" aria-hidden="true" /> {showMap ? "Masquer la carte" : "Voir la carte"}
              </button>
              <div className={`${showMap ? "mt-4 block" : "hidden"} h-[360px] lg:sticky lg:top-28 lg:mt-0 lg:block lg:h-[calc(100dvh-9rem)]`}>
                {mounted && (
                  <Suspense fallback={<div className="skeleton h-full w-full rounded-[1.5rem]" />}>
                    <PropertyMap pins={items} activeId={active} onHover={setActive} />
                  </Suspense>
                )}
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="container-narrow mt-20 md:mt-28">
        <Reveal>
          <BuyerAlert />
        </Reveal>
      </section>

      <section className="container-narrow mt-24 md:mt-36">
        <p className="eyebrow">Références</p>
        <h2 className="mt-4">Biens vendus</h2>
        <p className="mt-5 max-w-xl text-muted-foreground">
          Quelques transactions menées à bien.
        </p>
        <div className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 md:mt-14">
          {sold.map((s) => (
            <Reveal key={s.id}>
              <article>
                <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-muted">
                  <PhotoImg
                    src={s.cover_url}
                    width={640}
                    height={480}
                    maxWidth={960}
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    alt={`${s.type} de ${s.surface} m² à ${s.city}`}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover grayscale-[0.6]"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-ink px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-paper">
                    Vendu
                  </span>
                </div>
                <div className="px-1 pt-4">
                  <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">{s.city}</p>
                  <h3 className="mt-1.5 text-xl">{s.type} · {s.surface} m²</h3>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}

const SOLD = [
  { id: "s-28584879", type: "Appartement", city: "Saint-Ouen-sur-Seine (93400)", surface: 52, cover_url: "https://d1q967606ga7w2.cloudfront.net/common/house/28584879/photos/s/img-20251217-wa0064.jpg" },
  { id: "s-29023519", type: "Appartement", city: "Montrouge (92120)", surface: 61, cover_url: "https://d1q967606ga7w2.cloudfront.net/common/house/29023519/photos/s/salon-3d-mars-2026.jpg" },
  { id: "s-29041986", type: "Appartement", city: "Paris (75015)", surface: 51, cover_url: "https://d1q967606ga7w2.cloudfront.net/common/house/29041986/photos/s/dsc09318.jpg" },
  { id: "s-28075588", type: "Appartement", city: "Paris (75016)", surface: 10, cover_url: "https://d1q967606ga7w2.cloudfront.net/common/house/28075588/photos/s/photo_12_bb39.jpg" },
  { id: "s-28727193", type: "Appartement", city: "Vélizy-Villacoublay (78140)", surface: 75, cover_url: "https://d1q967606ga7w2.cloudfront.net/common/house/28727193/photos/s/aaaa-photo_27_0434.jpg" },
  { id: "s-27975846", type: "Appartement", city: "Paris (75015)", surface: 85, cover_url: "https://d1q967606ga7w2.cloudfront.net/common/house/27975846/photos/s/francois-villon-3d-nov-2025-sejour.jpg" },
  { id: "s-27939866", type: "Appartement", city: "Paris (75016)", surface: 55, cover_url: "https://d1q967606ga7w2.cloudfront.net/common/house/27939866/photos/s/parent-de-rosan-ia-photo-241.jpg" },
  
  { id: "s-27458697", type: "Appartement", city: "Paris (75016)", surface: 26, cover_url: "https://d1q967606ga7w2.cloudfront.net/common/house/27458697/photos/s/watermark-photo_3_0061.jpg" },
  { id: "s-27484209", type: "Appartement", city: "Paris (75016)", surface: 41, cover_url: "https://d1q967606ga7w2.cloudfront.net/common/house/27484209/photos/s/watermark-alphonse-xiii-3d.jpg" },
  { id: "s-27060135", type: "Appartement", city: "Paris (75016)", surface: 35, cover_url: "https://d1q967606ga7w2.cloudfront.net/common/house/27060135/photos/s/photo_1_a1fa.jpg" },
  { id: "s-22537020", type: "Appartement", city: "Paris (75016)", surface: 155, cover_url: "https://d1q967606ga7w2.cloudfront.net/common/house/22537020/photos/s/dsc02351.jpg" },
  { id: "s-25106047", type: "Appartement", city: "Boulogne-Billancourt (92100)", surface: 137, cover_url: "https://d1q967606ga7w2.cloudfront.net/common/house/25106047/photos/s/img_1361.jpeg" },
  { id: "s-21386688", type: "Appartement", city: "Paris (75016)", surface: 90, cover_url: "https://d1q967606ga7w2.cloudfront.net/common/house/21386688/photos/s/dsc08047.jpg" },
  { id: "s-20546748", type: "Appartement", city: "Paris (75015)", surface: 80, cover_url: "https://d1q967606ga7w2.cloudfront.net/common/house/20546748/photos/s/img-3576.JPG" },
  { id: "s-26188382", type: "Appartement", city: "Boulogne-Billancourt (92100)", surface: 68, cover_url: "https://d1q967606ga7w2.cloudfront.net/common/house/26188382/photos/s/photo_1_5.jpg" },
  { id: "s-25226642", type: "Maison", city: "Saint-Sauveur-sur-École (77930)", surface: 250, cover_url: "https://d1q967606ga7w2.cloudfront.net/common/house/25226642/photos/s/dsc06914-modifier.jpg" },
  { id: "s-24461780", type: "Appartement", city: "Boulogne-Billancourt (92100)", surface: 50, cover_url: "https://d1q967606ga7w2.cloudfront.net/common/house/24461780/photos/s/a-sejour-cuisine-entree-31.jpg" },
  { id: "s-19852579", type: "Appartement", city: "Paris (75116)", surface: 56, cover_url: "https://d1q967606ga7w2.cloudfront.net/common/house/19852579/photos/s/aimg-1165.JPG" },
  { id: "s-19615324", type: "Appartement", city: "Paris (75015)", surface: 111, cover_url: "https://d1q967606ga7w2.cloudfront.net/common/house/19615324/photos/s/4b28dd18-153c-461b-8159-2571a43b67e4.JPG" },
  { id: "s-24408814", type: "Appartement", city: "Puteaux (92800)", surface: 100, cover_url: "https://d1q967606ga7w2.cloudfront.net/common/house/24408814/photos/s/3d-boieldieu.jpg" },
  { id: "s-23357131", type: "Appartement", city: "Paris (75015)", surface: 21, cover_url: "https://d1q967606ga7w2.cloudfront.net/common/house/23357131/photos/s/visuel3d_1-fondary.jpg" },
  { id: "s-21617554", type: "Appartement", city: "Paris (75010)", surface: 50, cover_url: "https://d1q967606ga7w2.cloudfront.net/common/house/21617554/photos/s/photo-sejour.JPG" },
  { id: "s-18999152", type: "Appartement", city: "Paris (75015)", surface: 82, cover_url: "https://d1q967606ga7w2.cloudfront.net/common/house/18999152/photos/s/dsc00169.jpg" },
  { id: "s-21647166", type: "Appartement", city: "Paris (75010)", surface: 85, cover_url: "https://d1q967606ga7w2.cloudfront.net/common/house/21647166/photos/s/dsc04619.jpg" },
  { id: "s-23674644", type: "Appartement", city: "Persan (95340)", surface: 50, cover_url: "https://d1q967606ga7w2.cloudfront.net/common/house/23674644/photos/s/photo-3d-rhinov.jpg" },
  { id: "s-21320821", type: "Appartement", city: "Paris (75017)", surface: 30, cover_url: "https://d1q967606ga7w2.cloudfront.net/common/house/21320821/photos/s/hardane-1.jpg" },
  { id: "s-20435960", type: "Appartement", city: "Paris (75015)", surface: 75, cover_url: "https://d1q967606ga7w2.cloudfront.net/common/house/20435960/photos/s/img-5995.JPG" },
  { id: "s-19049512", type: "Appartement", city: "Boulogne-Billancourt (92100)", surface: 52, cover_url: "https://d1q967606ga7w2.cloudfront.net/common/house/19049512/photos/s/122353726_785895751968069_97094608025031490_n.jpg" },
  { id: "s-19217701", type: "Appartement", city: "Paris (75002)", surface: 30, cover_url: "https://d1q967606ga7w2.cloudfront.net/common/house/19217701/photos/s/img-296811.jpg" },
  { id: "s-17338481", type: "Maison", city: "Saint-Maur-des-Fossés (94210)", surface: 295, cover_url: "https://d1q967606ga7w2.cloudfront.net/common/house/17338481/photos/s/_lavarennesthilaire_24102019_27.jpg" },
  { id: "s-26553885", type: "Appartement", city: "Paris (75015)", surface: 10, cover_url: "https://d1q967606ga7w2.cloudfront.net/common/house/26553885/photos/s/photo_7.jpg" },
  { id: "s-24431585", type: "Appartement", city: "Dijon (21000)", surface: 47, cover_url: "https://d1q967606ga7w2.cloudfront.net/common/house/24431585/photos/s/img_4208_dxo-copie.jpg" },
  { id: "s-22513610", type: "Appartement", city: "Paris (75018)", surface: 19, cover_url: "https://d1q967606ga7w2.cloudfront.net/common/house/22513610/photos/s/1.jpg" },
  { id: "s-19728144", type: "Appartement", city: "Paris (75017)", surface: 9, cover_url: "https://d1q967606ga7w2.cloudfront.net/common/house/19728144/photos/s/unnamed1.jpg" },
  { id: "s-24969229", type: "Appartement", city: "Paris (75015)", surface: 10, cover_url: "https://d1q967606ga7w2.cloudfront.net/common/house/24969229/photos/s/photo_7.jpg" },
  { id: "s-24249948", type: "Appartement", city: "Menton (06500)", surface: 25, cover_url: "https://d1q967606ga7w2.cloudfront.net/common/house/24249948/photos/s/menton-112.jpg" },
];


