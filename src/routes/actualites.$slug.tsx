import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SiteShell } from "@/components/site/SiteShell";
import { formatDate, type Article } from "@/lib/domain";

export const Route = createFileRoute("/actualites/$slug")({
  component: ArticleDetail,
  notFoundComponent: () => (
    <SiteShell>
      <div className="container-narrow py-32 text-center">
        <h1 className="font-serif text-4xl">Article introuvable</h1>
        <Link to="/actualites" className="mt-6 inline-block text-primary underline">Retour aux actualités</Link>
      </div>
    </SiteShell>
  ),
});

function ArticleDetail() {
  const { slug } = Route.useParams();
  const [a, setA] = useState<Article | null | undefined>(undefined);
  useEffect(() => {
    supabase.from("articles").select("*").eq("slug", slug).eq("published", true).maybeSingle()
      .then(({ data }) => setA((data as Article | null) ?? null));
  }, [slug]);

  if (a === undefined) return <SiteShell><div className="container-narrow py-32 text-sm text-muted-foreground">Chargement…</div></SiteShell>;
  if (a === null) throw notFound();

  return (
    <SiteShell>
      <article className="container-narrow pt-16 md:pt-24">
        <Link to="/actualites" className="text-xs uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground">← Journal</Link>
        <h1 className="mt-8 max-w-3xl font-serif text-4xl leading-tight md:text-6xl">{a.title}</h1>
        <div className="mt-6 text-sm text-muted-foreground">{formatDate(a.published_at ?? a.created_at)}</div>
        {a.cover_url && (
          <div className="mt-12 aspect-[16/9] w-full overflow-hidden bg-muted">
            <img src={a.cover_url} alt={a.title} className="h-full w-full object-cover" />
          </div>
        )}
        <div className="prose prose-neutral mx-auto mt-12 max-w-2xl whitespace-pre-wrap text-lg leading-relaxed text-foreground/90">
          {a.content}
        </div>
      </article>
    </SiteShell>
  );
}
