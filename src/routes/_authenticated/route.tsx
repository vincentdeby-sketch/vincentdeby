import { createFileRoute, Outlet, Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  component: AuthedLayout,
});

function AuthedLayout() {
  const { user, isAdmin, loading } = useAuth();
  const nav = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!loading && !user) nav({ to: "/auth" });
  }, [loading, user, nav]);

  if (loading || !user) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">Chargement…</div>;
  }
  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6 text-center">
        <div>
          <div className="font-serif text-2xl">Accès réservé</div>
          <p className="mt-3 text-sm text-muted-foreground">Votre compte n'a pas les droits d'administration.</p>
          <button onClick={() => supabase.auth.signOut()} className="mt-6 border border-foreground px-6 py-2 text-xs uppercase tracking-widest">Se déconnecter</button>
        </div>
      </div>
    );
  }

  const links = [
    { to: "/_authenticated/admin", label: "Vue d'ensemble", exact: true },
    { to: "/_authenticated/admin/articles", label: "Actualités" },
    { to: "/_authenticated/admin/biens", label: "Biens" },
    { to: "/_authenticated/admin/estimations", label: "Demandes" },
  ];

  return (
    <div className="min-h-screen">
      <header className="border-b border-border">
        <div className="container-narrow flex h-16 items-center justify-between">
          <Link to="/_authenticated/admin" className="font-serif text-lg">Maison &amp; Associés · <span className="text-muted-foreground">Admin</span></Link>
          <div className="flex items-center gap-6 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-foreground">Site public →</Link>
            <button onClick={async () => { await supabase.auth.signOut(); nav({ to: "/auth" }); }} className="text-muted-foreground hover:text-foreground">Se déconnecter</button>
          </div>
        </div>
        <div className="container-narrow flex flex-wrap gap-6 border-t border-border py-3 text-sm">
          {links.map((l) => {
            const active = l.exact ? pathname === l.to : pathname.startsWith(l.to);
            return (
              <Link key={l.to} to={l.to as never} className={active ? "text-foreground" : "text-muted-foreground hover:text-foreground"}>
                {l.label}
              </Link>
            );
          })}
        </div>
      </header>
      <main className="container-narrow py-10">
        <Outlet />
      </main>
    </div>
  );
}
