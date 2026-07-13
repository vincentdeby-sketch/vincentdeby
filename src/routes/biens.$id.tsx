import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SiteShell } from "@/components/site/SiteShell";
import { formatEUR, type Property } from "@/lib/domain";

export const Route = createFileRoute("/biens/$id")({
  component: Detail,
  notFoundComponent: () => (
    <SiteShell>
      <div className="container-narrow py-32 text-center">
        <h1 className="font-serif text-4xl">Bien introuvable</h1>
        <Link to="/biens" className="mt-6 inline-block text-primary underline">Retour aux biens</Link>
      </div>
    </SiteShell>
  ),
});

function Detail() {
  const { id } = Route.useParams();
  const [p, setP] = useState<Property | null | undefined>(undefined);
  useEffect(() => {
    supabase.from("properties").select("*").eq("id", id).eq("published", true).maybeSingle()
      .then(({ data }) => setP((data as Property | null) ?? null));
  }, [id]);
  if (p === undefined) return <SiteShell><div className="container-narrow py-32 text-sm text-muted-foreground">Chargement…</div></SiteShell>;
  if (p === null) throw notFound();

  const gallery = [p.cover_url, ...(p.photos ?? [])].filter(Boolean) as string[];

  return (
    <SiteShell>
      <div className="container-narrow pt-10">
        <Link to="/biens" className="text-xs uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground">← Nos biens</Link>
      </div>
      <section className="container-narrow mt-8 grid gap-12 md:grid-cols-[2fr_1fr]">
        <div>
          {gallery[0] ? (
            <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
              <img src={gallery[0]} alt={p.title} className="h-full w-full object-cover" />
            </div>
          ) : (
            <div className="aspect-[4/3] w-full bg-muted" />
          )}
          {gallery.length > 1 && (
            <div className="mt-4 grid grid-cols-3 gap-4">
              {gallery.slice(1, 7).map((src, i) => (
                <div key={i} className="aspect-square overflow-hidden bg-muted">
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>
        <aside className="md:pt-4">
          <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{p.property_type}</div>
          <h1 className="mt-3 font-serif text-3xl leading-tight md:text-4xl">{p.title}</h1>
          <div className="mt-2 text-muted-foreground">{[p.address, p.city].filter(Boolean).join(", ")}</div>
          <div className="mt-6 font-serif text-3xl text-primary">{formatEUR(p.price)}</div>
          <dl className="mt-8 grid grid-cols-2 gap-y-4 border-t border-border pt-6 text-sm">
            {p.surface && <><dt className="text-muted-foreground">Surface</dt><dd className="text-right">{p.surface} m²</dd></>}
            {p.rooms && <><dt className="text-muted-foreground">Pièces</dt><dd className="text-right">{p.rooms}</dd></>}
            {p.bedrooms && <><dt className="text-muted-foreground">Chambres</dt><dd className="text-right">{p.bedrooms}</dd></>}
          </dl>
          <a href="mailto:contact@maison-associes.fr" className="mt-8 block border border-foreground bg-foreground px-6 py-4 text-center text-xs uppercase tracking-widest text-background">
            Nous contacter
          </a>
        </aside>
      </section>
      <section className="container-narrow mt-16 max-w-3xl">
        <h2 className="font-serif text-2xl">Description</h2>
        <div className="mt-6 whitespace-pre-wrap leading-relaxed text-foreground/85">{p.description}</div>
      </section>
    </SiteShell>
  );
}
