import { useState } from "react";
import { Play } from "lucide-react";

// Vignette YouTube légère : la vidéo (et ses cookies) ne se charge qu'au clic.
export function VideoCard({ id, title, description, featured = false }: { id: string; title: string; description?: string; featured?: boolean }) {
  const [playing, setPlaying] = useState(false);
  return (
    <article>
      <div className="group relative aspect-video overflow-hidden rounded-[1.5rem] bg-ink" data-cursor={playing ? undefined : "Lire"}>
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="h-full w-full border-0"
          />
        ) : (
          <button type="button" onClick={() => setPlaying(true)} className="absolute inset-0 h-full w-full" aria-label={`Lire la vidéo : ${title}`}>
            <img
              src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover opacity-90 transition duration-700 group-hover:scale-[1.03] group-hover:opacity-100"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
            <span className={`absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-brand text-ink shadow-xl transition-transform duration-300 group-hover:scale-110 ${featured ? "h-20 w-20" : "h-14 w-14"}`}>
              <Play className={featured ? "h-8 w-8 translate-x-0.5" : "h-6 w-6 translate-x-0.5"} fill="currentColor" aria-hidden="true" />
            </span>
          </button>
        )}
      </div>
      <h2 className={`mt-4 leading-snug ${featured ? "!text-[clamp(1.6rem,2.6vw,2.3rem)]" : "!text-xl"}`}>{title}</h2>
      {description && <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>}
    </article>
  );
}
