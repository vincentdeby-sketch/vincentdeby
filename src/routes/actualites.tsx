import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SiteShell } from "@/components/site/SiteShell";
import { ArticleCard } from "@/components/site/ArticleCard";
import { Reveal } from "@/components/site/Reveal";
import type { Article } from "@/lib/domain";

export const Route = createFileRoute("/actualites")({
  head: () => ({
    meta: [
      { title: "Actualités — Maison & Associés" },
      { name: "description", content: "Analyses de marché, décryptages et notes du cabinet." },
      { property: "og:title", content: "Actualités — Maison & Associés" },
      { property: "og:description", content: "Analyses de marché, décryptages et notes du cabinet." },
    ],
  }),
  component: ArticlesList,
});

function ArticlesList() {
  const [items, setItems] = useState<Article[] | null>(null);
  useEffect(() => {
    supabase.from("articles").select("*").eq("published", true).order("published_at", { ascending: false, nullsFirst: false })
      .then(({ data }) => setItems((data ?? []) as Article[]));
  }, []);
  return (
    <SiteShell>
      <section className="container-narrow pt-16 md:pt-24">
        <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Journal</div>
        <h1 className="mt-6 font-serif text-5xl md:text-6xl">Actualités</h1>
        <p className="mt-6 max-w-xl text-muted-foreground">
          Nos analyses, décryptages et notes autour du marché immobilier.
        </p>
      </section>
      <section className="container-narrow mt-16">
        {items === null ? (
          <div className="text-sm text-muted-foreground">Chargement…</div>
        ) : items.length === 0 ? (
          <div className="border border-dashed border-border py-24 text-center text-sm text-muted-foreground">
            Aucun article publié pour le moment.
          </div>
        ) : (
          <div className="grid gap-16 md:grid-cols-2 lg:grid-cols-3">
            {items.map((a) => <Reveal key={a.id}><ArticleCard a={a} /></Reveal>)}
          </div>
        )}
      </section>
    </SiteShell>
  );
}
