import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/")({ component: Dashboard });

function Dashboard() {
  const [counts, setCounts] = useState({ articles: 0, properties: 0, estimations: 0, newEst: 0 });
  useEffect(() => {
    (async () => {
      const [a, p, e, n] = await Promise.all([
        supabase.from("articles").select("*", { count: "exact", head: true }),
        supabase.from("properties").select("*", { count: "exact", head: true }),
        supabase.from("estimations").select("*", { count: "exact", head: true }),
        supabase.from("estimations").select("*", { count: "exact", head: true }).eq("status", "new"),
      ]);
      setCounts({ articles: a.count ?? 0, properties: p.count ?? 0, estimations: e.count ?? 0, newEst: n.count ?? 0 });
    })();
  }, []);

  const tiles = [
    { label: "Actualités", value: counts.articles, to: "/admin/articles" },
    { label: "Biens", value: counts.properties, to: "/admin/biens" },
    { label: "Demandes reçues", value: counts.estimations, to: "/admin/estimations" },
    { label: "Nouvelles demandes", value: counts.newEst, to: "/admin/estimations" },
  ] as const;
  return (
    <div>
      <h1 className="font-serif text-3xl">Vue d'ensemble</h1>
      <div className="mt-8 grid gap-4 md:grid-cols-4">
        {tiles.map((t) => (
          <Link key={t.label} to={t.to} className="border border-border p-6 transition-colors hover:border-foreground">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">{t.label}</div>
            <div className="mt-3 font-serif text-4xl">{t.value}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
