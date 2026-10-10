import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteShell";
import { Reveal } from "@/components/site/Reveal";

import { SITE } from "@/lib/site";

type Video = {
  title: string;
  description: string;
  youtubeId: string;
};

// Ajoutez ici vos vraies vidéos YouTube (youtubeId = l'ID après ?v= dans l'URL).
const videos: Video[] = [];


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
      <section className="container-narrow pt-12 md:pt-24">
        <div className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground sm:text-xs">Média</div>
        <h1 className="mt-4 font-serif text-4xl leading-[1.05] sm:text-5xl md:mt-6 md:text-6xl">Vidéos</h1>
        <p className="mt-5 max-w-xl text-muted-foreground md:mt-6">
          Présentations, conseils et analyses — l'immobilier expliqué en images.
        </p>
      </section>

      <section className="container-narrow mt-10 md:mt-16 pb-24">
        {videos.length === 0 ? (
          <Reveal>
            <div className="liquid-glass rounded-3xl px-6 py-16 text-center sm:px-10 md:py-24">
              <div className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">Bientôt</div>
              <h2 className="mt-4 font-serif text-2xl sm:text-3xl md:text-4xl">Les vidéos arrivent prochainement</h2>
              <p className="mx-auto mt-4 max-w-md text-sm text-muted-foreground md:text-base">
                Cette section accueillera bientôt des présentations, conseils et analyses de marché en vidéo.
              </p>
            </div>
          </Reveal>
        ) : (
          <div className="grid gap-10 md:gap-16">
            {videos.map((v, i) => (
              <Reveal key={i}>
                <article className="glass overflow-hidden rounded-3xl p-3">
                  <div className="aspect-video w-full overflow-hidden rounded-2xl bg-muted">
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${v.youtubeId}`}
                      title={v.title}
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                      className="h-full w-full border-0"
                    />
                  </div>
                  <div className="px-2 pb-2 pt-5">
                    <h2 className="font-serif text-xl leading-snug sm:text-2xl">{v.title}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.description}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        )}
      </section>

    </SiteShell>
  );
}
