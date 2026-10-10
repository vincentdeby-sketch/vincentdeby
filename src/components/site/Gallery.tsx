import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Images, X } from "lucide-react";
import { PhotoImg } from "./PhotoImg";

// Galerie de fiche bien : mosaïque sur ordinateur, défilement au doigt sur mobile,
// visionneuse plein écran (clavier, glisser) au clic sur une photo.
export function Gallery({ photos, title, transitionName }: { photos: string[]; title: string; transitionName?: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const [mobileIndex, setMobileIndex] = useState(0);
  const stripRef = useRef<HTMLDivElement | null>(null);

  if (photos.length === 0) return <div className="aspect-[16/9] rounded-[1.5rem] bg-muted" />;

  return (
    <>
      {/* Mobile : carrousel */}
      <div className="relative md:hidden">
        <div
          ref={stripRef}
          onScroll={(e) => {
            const el = e.currentTarget;
            setMobileIndex(Math.round(el.scrollLeft / el.clientWidth));
          }}
          className="flex snap-x snap-mandatory overflow-x-auto rounded-[1.5rem] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {photos.map((src, i) => (
            <button key={src} type="button" onClick={() => setOpen(i)} className="aspect-[4/3] w-full shrink-0 snap-center bg-muted">
              <PhotoImg
                src={src}
                width={960}
                height={720}
                sizes="100vw"
                alt={`${title}, photo ${i + 1} sur ${photos.length}`}
                loading={i === 0 ? "eager" : "lazy"}
                fetchPriority={i === 0 ? "high" : undefined}
                decoding="async"
                style={{ viewTransitionName: i === 0 ? transitionName : undefined }}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
        <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-ink/80 px-3 py-1 font-mono text-[11px] text-paper backdrop-blur">
          {mobileIndex + 1} / {photos.length}
        </span>
      </div>

      {/* Ordinateur : mosaïque */}
      <div className="hidden gap-2 md:grid md:grid-cols-4 md:grid-rows-2">
        {photos.slice(0, 5).map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setOpen(i)}
            data-cursor="Voir"
            className={`group relative overflow-hidden rounded-[1.25rem] bg-muted ${i === 0 ? "col-span-2 row-span-2 h-[min(64vh,600px)]" : ""}`}
          >
            <PhotoImg
              src={src}
              width={i === 0 ? 1280 : 640}
              height={i === 0 ? 960 : 480}
              maxWidth={i === 0 ? 1600 : 960}
              sizes={i === 0 ? "50vw" : "25vw"}
              alt={`${title}, photo ${i + 1}`}
              loading={i === 0 ? "eager" : "lazy"}
              fetchPriority={i === 0 ? "high" : undefined}
              decoding="async"
              style={{ viewTransitionName: i === 0 ? transitionName : undefined }}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
            {i === 4 && photos.length > 5 && (
              <span className="absolute inset-0 grid place-items-center bg-ink/45 font-medium text-paper">
                + {photos.length - 5} photos
              </span>
            )}
          </button>
        ))}
      </div>
      <div className="mt-3 flex justify-end">
        <button type="button" onClick={() => setOpen(0)} className="btn btn-ghost !min-h-10 !py-2 text-sm">
          <Images className="h-4 w-4" aria-hidden="true" /> Voir les {photos.length} photos
        </button>
      </div>

      {open !== null && <Viewer photos={photos} title={title} start={open} onClose={() => setOpen(null)} />}
    </>
  );
}

function Viewer({ photos, title, start, onClose }: { photos: string[]; title: string; start: number; onClose: () => void }) {
  const [i, setI] = useState(start);
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const touchX = useRef<number | null>(null);
  const go = (d: number) => setI((v) => (v + d + photos.length) % photos.length);

  useEffect(() => {
    const dlg = dialogRef.current;
    dlg?.showModal();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      aria-label={`Photos : ${title}`}
      className="m-0 h-dvh max-h-none w-screen max-w-none bg-ink p-0 text-paper backdrop:bg-ink/90"
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
        touchX.current = null;
      }}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between p-4">
          <span className="font-mono text-xs text-paper/70">{i + 1} / {photos.length}</span>
          <button type="button" onClick={() => dialogRef.current?.close()} className="grid h-11 w-11 place-items-center rounded-full bg-paper/10 hover:bg-paper/20" aria-label="Fermer">
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 pb-4 md:px-20">
          <PhotoImg
            key={photos[i]}
            src={photos[i]}
            width={1600}
            height={1200}
            sizes="100vw"
            alt={`${title}, photo ${i + 1}`}
            className="max-h-full max-w-full rounded-xl object-contain animate-in fade-in duration-200"
          />
          {photos.length > 1 && (
            <>
              <button type="button" onClick={() => go(-1)} className="absolute left-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-paper/10 hover:bg-paper/20 md:grid" aria-label="Photo précédente">
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <button type="button" onClick={() => go(1)} className="absolute right-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-paper/10 hover:bg-paper/20 md:grid" aria-label="Photo suivante">
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </>
          )}
        </div>
      </div>
    </dialog>
  );
}
