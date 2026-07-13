import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SiteShell } from "@/components/site/SiteShell";
import { PropertyCard } from "@/components/site/PropertyCard";
import { Reveal } from "@/components/site/Reveal";
import type { Property } from "@/lib/domain";

export const Route = createFileRoute("/biens")({
  head: () => ({
    meta: [
      { title: "Nos biens — Maison & Associés" },
      { name: "description", content: "Une sélection de biens à la vente, choisis avec soin." },
      { property: "og:title", content: "Nos biens — Maison & Associés" },
      { property: "og:description", content: "Une sélection de biens à la vente." },
    ],
  }),
  component: List,
});

function List() {
  const [items, setItems] = useState<Property[] | null>(null);
  useEffect(() => {
    supabase.from("properties").select("*").eq("published", true).order("created_at", { ascending: false })
      .then(({ data }) => setItems((data ?? []) as Property[]));
  }, []);
  return (
    <SiteShell>
      <section className="container-narrow pt-16 md:pt-24">
        <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Sélection</div>
        <h1 className="mt-6 font-serif text-5xl md:text-6xl">Nos biens</h1>
        <p className="mt-6 max-w-xl text-muted-foreground">
          Des propriétés choisies avec soin, présentées sans artifice.
        </p>
      </section>
      <section className="container-narrow mt-16">
        {items === null ? (
          <div className="text-sm text-muted-foreground">Chargement…</div>
        ) : items.length === 0 ? (
          <div className="border border-dashed border-border py-24 text-center text-sm text-muted-foreground">
            Aucun bien en ligne pour le moment.
          </div>
        ) : (
          <div className="grid gap-16 md:grid-cols-2 lg:grid-cols-3">
            {items.map((p) => <Reveal key={p.id}><PropertyCard p={p} /></Reveal>)}
          </div>
        )}
      </section>
    </SiteShell>
  );
}
