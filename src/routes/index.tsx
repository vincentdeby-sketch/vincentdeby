import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SiteShell } from "@/components/site/SiteShell";
import { Reveal } from "@/components/site/Reveal";
import { ArticleCard } from "@/components/site/ArticleCard";
import { PropertyCard } from "@/components/site/PropertyCard";
import type { Article, Property } from "@/lib/domain";
import hero from "@/assets/hero-home.jpg";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  useEffect(() => {
    supabase.from("articles").select("*").eq("published", true).order("published_at", { ascending: false, nullsFirst: false }).limit(3).then(({ data }) => setArticles((data ?? []) as Article[]));
    supabase.from("properties").select("*").eq("published", true).order("created_at", { ascending: false }).limit(3).then(({ data }) => setProperties((data ?? []) as Property[]));
  }, []);

  return (
    <SiteShell>
      {/* HERO */}
      <section className="relative">
        <div className="container-narrow pt-10 md:pt-20">
          <div className="max-w-3xl">
            <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Estimation immobilière</div>
            <h1 className="mt-6 font-serif text-[clamp(2.5rem,6vw,5rem)] leading-[1.02]">
              Votre projet immobilier,
              <br />
              <span className="italic text-primary">au plus près.</span>
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Une lecture précise de votre bien, ancrée dans son marché local.
              Nous conjuguons données, terrain et discrétion pour vous proposer
              une estimation crédible — jamais gonflée, jamais dévaluée.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link to="/estimation" className="border border-foreground bg-foreground px-8 py-4 text-xs uppercase tracking-widest text-background transition-opacity hover:opacity-90">
                Estimer mon bien
              </Link>
              <Link to="/contact" className="border border-foreground/20 px-8 py-4 text-xs uppercase tracking-widest transition-colors hover:border-foreground">
                Prendre rendez-vous
              </Link>
            </div>
          </div>
        </div>
        <Reveal className="container-narrow mt-16 md:mt-24">
          <div className="aspect-[16/9] w-full overflow-hidden bg-muted md:aspect-[21/9]">
            <img src={hero} alt="Immeubles haussmanniens parisiens au coucher du soleil" width={1920} height={1280} className="h-full w-full object-cover" />
          </div>
        </Reveal>
      </section>

      {/* RÉASSURANCE */}
      <section className="container-narrow mt-32 md:mt-48">
        <Reveal className="grid gap-16 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">L'approche</div>
            <h2 className="mt-6 font-serif text-4xl leading-tight">
              Une approche mesurée,
              <br />un regard indépendant.
            </h2>
            <p className="mt-6 max-w-md leading-relaxed text-muted-foreground">
              Depuis douze ans, nous accompagnons propriétaires et acquéreurs
              dans leurs décisions les plus engageantes. Sans surenchère,
              sans procédure impersonnelle.
            </p>
          </div>
          <Metric value="1 240" label="Estimations réalisées" />
          <Metric value="12 ans" label="d'expertise locale" />
        </Reveal>
      </section>

      {/* ACTUALITÉS */}
      {articles.length > 0 && (
        <section className="container-narrow mt-32 md:mt-48">
          <Reveal className="flex items-end justify-between gap-6">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Journal</div>
              <h2 className="mt-4 font-serif text-4xl">Dernières actualités</h2>
            </div>
            <Link to="/actualites" className="hidden text-sm text-muted-foreground hover:text-foreground md:inline">Voir tout →</Link>
          </Reveal>
          <div className="mt-12 grid gap-12 md:grid-cols-3">
            {articles.map((a) => <Reveal key={a.id}><ArticleCard a={a} /></Reveal>)}
          </div>
        </section>
      )}

      {/* BIENS */}
      {properties.length > 0 && (
        <section className="container-narrow mt-32 md:mt-48">
          <Reveal className="flex items-end justify-between gap-6">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Sélection</div>
              <h2 className="mt-4 font-serif text-4xl">Biens en ligne</h2>
            </div>
            <Link to="/biens" className="hidden text-sm text-muted-foreground hover:text-foreground md:inline">Voir tout →</Link>
          </Reveal>
          <div className="mt-12 grid gap-12 md:grid-cols-3">
            {properties.map((p) => <Reveal key={p.id}><PropertyCard p={p} /></Reveal>)}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="container-narrow mt-32 md:mt-48">
        <Reveal className="border-y border-border py-24 text-center">
          <div className="mx-auto max-w-2xl">
            <h2 className="font-serif text-4xl leading-tight md:text-5xl">
              Prêt à connaître la valeur juste de votre bien ?
            </h2>
            <p className="mt-6 text-muted-foreground">
              Notre formulaire prend cinq minutes. Vous recevez ensuite un
              retour humain, argumenté, sans engagement.
            </p>
            <Link to="/estimation" className="mt-10 inline-block border border-foreground bg-foreground px-10 py-4 text-xs uppercase tracking-widest text-background transition-opacity hover:opacity-90">
              Commencer l'estimation
            </Link>
          </div>
        </Reveal>
      </section>
    </SiteShell>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-serif text-5xl text-primary">{value}</div>
      <div className="mt-3 text-sm text-muted-foreground">{label}</div>
    </div>
  );
}
