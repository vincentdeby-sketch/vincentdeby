import { useState } from "react";
import { BellRing, Check, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ZONES } from "@/lib/zones";
import { trackLead } from "@/lib/tracking";

// Alerte acquéreurs : enregistrée dans la table des leads, visible dans l'espace pro.
export function BuyerAlert() {
  const [zones, setZones] = useState<string[]>([]);
  const [kind, setKind] = useState("Appartement");
  const [budget, setBudget] = useState("");
  const [surface, setSurface] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  const ready = zones.length > 0 && name.trim().length > 1 && /\S+@\S+\.\S+/.test(email) && Number(budget) > 0;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ready) return;
    setState("sending");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any).from("leads").insert({
      location: zones.join(", "),
      timeline: "Alerte acquéreur",
      motivation: `${kind}${surface ? `, ${surface} m² minimum` : ""}`,
      occupation: "Acquéreur",
      price_basis: `Budget maximum : ${Number(budget).toLocaleString("fr-FR")} €`,
      contact_method: "email",
      contact_name: name.trim(),
      contact_value: email.trim(),
    });
    if (error) { setState("error"); return; }
    trackLead("alerte-acquereur");
    setState("done");
  };

  if (state === "done") {
    return (
      <div className="flex items-start gap-4 rounded-[1.75rem] bg-brand-soft p-7">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand text-ink"><Check className="h-5 w-5" aria-hidden="true" /></span>
        <div>
          <p className="font-serif text-2xl">Votre recherche est enregistrée.</p>
          <p className="mt-2 text-muted-foreground">Je vous écris dès qu'un bien correspond à vos critères.</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-8 rounded-[1.75rem] border border-border bg-card p-6 md:grid-cols-12 md:p-10">
      <div className="md:col-span-4">
        <span className="grid h-11 w-11 place-items-center rounded-full bg-brand text-ink"><BellRing className="h-5 w-5" aria-hidden="true" /></span>
        <h2 className="mt-6 !text-[clamp(1.8rem,3vw,2.6rem)]">Vous cherchez à acheter ?</h2>
        <p className="mt-3 text-muted-foreground">
          Dites-moi ce que vous cherchez. Je vous préviens dès qu'un bien correspond à vos critères.
        </p>
      </div>
      <div className="grid gap-5 md:col-span-8">
        <fieldset>
          <legend className="mb-2 text-sm font-medium">Secteurs</legend>
          <div className="flex flex-wrap gap-2">
            {ZONES.map((z) => (
              <button
                key={z}
                type="button"
                aria-pressed={zones.includes(z)}
                onClick={() => { setZones((cur) => (cur.includes(z) ? cur.filter((x) => x !== z) : [...cur, z])); navigator.vibrate?.(8); }}
                className="choice !w-auto rounded-full !px-4 !py-2 text-sm"
              >
                {z}
              </button>
            ))}
          </div>
        </fieldset>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block">
            <span className="mb-2 block text-sm font-medium">Type</span>
            <select value={kind} onChange={(e) => setKind(e.target.value)} className="field pr-10">
              <option>Appartement</option>
              <option>Maison</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium">Budget max (€)</span>
            <input type="number" inputMode="numeric" min={0} step={10000} value={budget} onChange={(e) => setBudget(e.target.value)} className="field" placeholder="600000" />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium">Surface min (facultatif)</span>
            <input type="number" inputMode="numeric" min={0} value={surface} onChange={(e) => setSurface(e.target.value)} className="field" placeholder="50" />
          </label>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-medium">Nom</span>
            <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className="field" />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium">E-mail</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className="field" />
          </label>
        </div>
        {state === "error" && <p role="alert" className="text-sm text-destructive">L'enregistrement n'a pas abouti. Réessayez, ou écrivez-moi à vdeby@efficity.com.</p>}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">Vos critères servent uniquement à vous prévenir. Désinscription sur simple demande.</p>
          <button type="submit" disabled={!ready || state === "sending"} className="btn btn-primary">
            {state === "sending" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : "Créer mon alerte"}
          </button>
        </div>
      </div>
    </form>
  );
}
