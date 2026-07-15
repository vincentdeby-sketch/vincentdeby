import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { SiteShell } from "@/components/site/SiteShell";
import { PropertyCard } from "@/components/site/PropertyCard";
import { Reveal } from "@/components/site/Reveal";
import { propertiesListQuery } from "@/lib/queries";

const SITE = "https://vincentdeby.lovable.app";

export const Route = createFileRoute("/biens/")({
  head: () => ({
    meta: [
      { title: "Nos biens à la vente — Vincent Deby, Mandataire Efficity" },
      { name: "description", content: "Sélection de biens immobiliers à la vente : appartements, maisons et propriétés choisis avec soin par Vincent Deby." },
      { property: "og:title", content: "Nos biens à la vente — Vincent Deby" },
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

function List() {
  const { data: items } = useSuspenseQuery(propertiesListQuery);
  return (
    <SiteShell>
      <section className="container-narrow pt-12 md:pt-24">
        <div className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground sm:text-xs">Sélection</div>
        <h1 className="mt-4 font-serif text-4xl leading-[1.05] sm:text-5xl md:mt-6 md:text-6xl">Nos biens</h1>
        <p className="mt-5 max-w-xl text-muted-foreground md:mt-6">
          Des propriétés choisies avec soin, présentées sans artifice.
        </p>
      </section>
      <section className="container-narrow mt-10 md:mt-16">
        {items.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border py-20 text-center text-sm text-muted-foreground">
            Aucun bien en ligne pour le moment.
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:gap-16">
            {items.map((p) => <Reveal key={p.id}><PropertyCard p={p} /></Reveal>)}
          </div>
        )}
      </section>

      <section className="container-narrow mt-24 md:mt-32">
        <div className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground sm:text-xs">Références</div>
        <h2 className="mt-4 font-serif text-3xl leading-[1.05] sm:text-4xl md:mt-6 md:text-5xl">Biens vendus</h2>
        <p className="mt-5 max-w-xl text-muted-foreground md:mt-6">
          Quelques transactions récemment menées à bien.
        </p>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:gap-16">
          {SOLD.map((s) => (
            <Reveal key={s.id}>
              <article>
                <div className="group block">
                  <div className="overflow-hidden border border-foreground/10 bg-background/40">
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                      <img
                        src={s.cover_url}
                        alt={`Photo — ${s.type} ${s.surface} m² à ${s.city}`}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover grayscale"
                      />
                      <div className="absolute left-3 top-3 bg-foreground px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-background">
                        Vendu
                      </div>
                    </div>
                    <div className="px-4 pb-4 pt-4">
                      <h3 className="font-serif text-lg leading-snug sm:text-xl">{s.type} — {s.surface} m²</h3>
                      <div className="mt-1.5 text-sm text-muted-foreground">
                        {[s.city, s.surface ? `${s.surface} m²` : null].filter(Boolean).join(" · ")}
                      </div>
                    </div>
                  </div>
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


