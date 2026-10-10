import { SiteShell } from "./SiteShell";

// Squelettes affichés pendant le chargement d'une page (navigation côté navigateur).
export function ListSkeleton() {
  return (
    <SiteShell>
      <div className="container-narrow pt-10 md:pt-16" aria-busy="true" aria-label="Chargement">
        <div className="skeleton h-4 w-40 rounded-full" />
        <div className="skeleton mt-6 h-16 w-3/4 rounded-2xl" />
        <div className="skeleton mt-4 h-6 w-1/2 rounded-full" />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i}>
              <div className="skeleton aspect-[4/3] rounded-[1.5rem]" />
              <div className="skeleton mt-4 h-3 w-1/2 rounded-full" />
              <div className="skeleton mt-3 h-5 w-3/4 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </SiteShell>
  );
}

export function DetailSkeleton() {
  return (
    <SiteShell>
      <div className="container-narrow pt-8" aria-busy="true" aria-label="Chargement">
        <div className="grid gap-2 md:grid-cols-4 md:grid-rows-2">
          <div className="skeleton aspect-[4/3] rounded-[1.5rem] md:col-span-2 md:row-span-2 md:aspect-auto md:h-[min(64vh,600px)]" />
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton hidden rounded-[1.25rem] md:block" />)}
        </div>
        <div className="mt-10 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="skeleton h-4 w-48 rounded-full" />
            <div className="skeleton mt-5 h-14 w-3/4 rounded-2xl" />
            <div className="skeleton mt-8 h-24 rounded-2xl" />
          </div>
          <div className="skeleton h-64 rounded-[1.5rem] lg:col-span-4" />
        </div>
      </div>
    </SiteShell>
  );
}
