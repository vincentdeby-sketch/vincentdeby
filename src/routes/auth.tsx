import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SiteShell } from "@/components/site/SiteShell";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Espace pro — Vincent Deby" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: Auth,
});

function Auth() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"in" | "up">("in");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) nav({ to: "/_authenticated/admin" as never });
    });
  }, [nav]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = mode === "in"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin + "/auth" } });
      if (res.error) throw res.error;
      if (mode === "up" && !res.data.session) {
        setError("Compte créé. Vérifiez votre email pour confirmer, puis reconnectez-vous.");
      } else {
        nav({ to: "/_authenticated/admin" as never });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally { setBusy(false); }
  };

  return (
    <SiteShell>
      <section className="container-narrow mx-auto max-w-md py-24">
        <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Espace pro</div>
        <h1 className="mt-4 font-serif text-3xl">{mode === "in" ? "Connexion" : "Créer un compte"}</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {mode === "in" ? "Réservé à l'équipe du cabinet." : "Le premier compte créé devient automatiquement administrateur."}
        </p>
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <label className="block">
            <div className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">Email</div>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-foreground" />
          </label>
          <label className="block">
            <div className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">Mot de passe</div>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-foreground" />
          </label>
          {error && <div className="text-sm text-destructive">{error}</div>}
          <button type="submit" disabled={busy} className="w-full border border-foreground bg-foreground px-8 py-3 text-xs uppercase tracking-widest text-background disabled:opacity-50">
            {busy ? "…" : mode === "in" ? "Se connecter" : "Créer le compte"}
          </button>
        </form>
        <div className="mt-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">ou</span>
          <div className="h-px flex-1 bg-border" />
        </div>
        <button
          type="button"
          onClick={() => setMode(mode === "in" ? "up" : "in")}
          className="mt-4 w-full border border-foreground bg-background px-8 py-3 text-xs uppercase tracking-widest text-foreground transition-colors hover:bg-foreground hover:text-background"
        >
          {mode === "in" ? "Créer un compte" : "J'ai déjà un compte"}
        </button>
        <div className="mt-8"><Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← Retour au site</Link></div>
      </section>
    </SiteShell>
  );
}
