import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteShell";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { VideoCard } from "@/components/site/VideoCard";

import { SITE } from "@/lib/site";

type Video = {
  title: string;
  description: string;
  youtubeId: string;
};

// Vidéos de la chaîne YouTube @vincent_immo (youtubeId = l'identifiant après ?v= dans l'URL).
// Pour en ajouter une : copier une ligne et changer le titre, la description et l'identifiant.
const CHANNEL_URL = "https://www.youtube.com/@vincent_immo";
const videos: Video[] = [
  {
    title: "Podcast OFF MARKET, épisode 1 : les pires erreurs de vente révélées par une notaire",
    description: "Le premier épisode du podcast OFF MARKET.",
    youtubeId: "miHkcL2_TFc",
  },
  {
    title: "La pire erreur en immobilier : le prix de départ",
    description: "",
    youtubeId: "PkiRUILlzgo",
  },
  {
    title: "Prêt immobilier : ce que voit votre banquier et que vous ne voyez pas",
    description: "",
    youtubeId: "_1znolIGdXI",
  },
];


export const Route = createFileRoute("/videos")({
  head: () => ({
    meta: [
      { title: "Vidéos — Vincent Deby, conseiller immobilier" },
      { name: "description", content: "Retrouvez toutes les vidéos de Vincent Deby : présentation, conseils immobiliers, analyses de marché et visites de biens." },
      { property: "og:title", content: "Vidéos — Vincent Deby" },
      { property: "og:description", content: "Présentations, conseils et analyses en vidéo par Vincent Deby, conseiller immobilier mandataire Efficity." },
      { property: "og:url", content: `${SITE}/videos` },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: `${SITE}/videos` }],
  }),
  component: VideosPage,
});

function VideosPage() {
  return (
    <SiteShell>
      <PageHeader
        eyebrow="Vidéos"
        title={<>L'immobilier, <em className="text-brand-ink">raconté en images.</em></>}
        lede="Le podcast OFF MARKET et mes vidéos sur le marché : ce que les vendeurs et les acheteurs devraient savoir, expliqué simplement."
      />

      <section className="container-narrow mt-10 md:mt-16 pb-24">
        {videos.length === 0 ? (
          <Reveal>
            <div className="surface px-6 py-16 text-center sm:px-10 md:py-24">
              <p className="eyebrow">Bientôt</p>
              <h2 className="mt-4">Les vidéos arrivent prochainement</h2>
              <p className="mx-auto mt-4 max-w-md text-sm text-muted-foreground md:text-base">
                Cette section accueillera bientôt des présentations, conseils et analyses de marché en vidéo.
              </p>
            </div>
          </Reveal>
        ) : (
          <div className="grid gap-x-6 gap-y-12 md:grid-cols-2">
            {videos.map((v, i) => (
              <Reveal key={v.youtubeId} className={i === 0 ? "md:col-span-2" : ""}>
                <VideoCard id={v.youtubeId} title={v.title} description={v.description} featured={i === 0} />
              </Reveal>
            ))}
            <div className="md:col-span-2">
              <a href={CHANNEL_URL} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                Toutes les vidéos sur YouTube
              </a>
            </div>
          </div>
        )}
      </section>

    </SiteShell>
  );
}
