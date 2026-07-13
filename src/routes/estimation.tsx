import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { SiteShell } from "@/components/site/SiteShell";
import { LazyGlobe } from "@/components/site/LazyGlobe";
import { searchAddress, type NominatimResult } from "@/lib/nominatim";

export const Route = createFileRoute("/estimation")({
  head: () => ({
    meta: [
      { title: "Estimation gratuite — Maison & Associés" },
      { name: "description", content: "Formulaire d'estimation en cinq étapes. Retour humain, argumenté, sans engagement." },
      { property: "og:title", content: "Estimation gratuite — Maison & Associés" },
      { property: "og:description", content: "Formulaire d'estimation en cinq étapes." },
    ],
  }),
  component: Estimation,
});

type Address = { display: string; lat: number; lng: number; postcode?: string; city?: string };
type PropertyType = "appartement" | "maison" | "terrain" | "local_commercial";

type FormState = {
  address: Address | null;
  propertyType: PropertyType | null;
  surface: string;
  landSurface: string;
  rooms: string;
  bedrooms: string;
  bathrooms: string;
  floor: string;
  elevator: boolean;
  yearBuilt: string;
  condition: string;
  dpe: string;
  heating: string;
  parking: string;
  outdoor: string[];
  exposure: string;
  view: string;
  coproFees: string;
  coproSyndic: boolean;
  proximity: string[];
  nuisances: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
};

const INITIAL: FormState = {
  address: null,
  propertyType: null,
  surface: "", landSurface: "", rooms: "", bedrooms: "", bathrooms: "",
  floor: "", elevator: false, yearBuilt: "", condition: "", dpe: "", heating: "",
  parking: "", outdoor: [], exposure: "", view: "", coproFees: "", coproSyndic: false,
  proximity: [], nuisances: "",
  contactName: "", contactEmail: "", contactPhone: "",
};

const STORAGE_KEY = "estimation-draft-v1";

const STEPS = ["Adresse", "Type de bien", "Caractéristiques", "Coordonnées", "Récapitulatif"];

function Estimation() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(INITIAL);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      try { setForm({ ...INITIAL, ...JSON.parse(raw) }); } catch {}
    }
  }, []);
  useEffect(() => {
    if (typeof window === "undefined") return;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(form));
  }, [form]);

  const update = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm((f) => ({ ...f, [k]: v }));

  const canNext = useMemo(() => {
    if (step === 0) return !!form.address;
    if (step === 1) return !!form.propertyType;
    if (step === 2) return form.surface.trim().length > 0;
    if (step === 3) return z.string().trim().min(2).safeParse(form.contactName).success && z.string().trim().email().safeParse(form.contactEmail).success;
    return true;
  }, [step, form]);

  const submit = async () => {
    const { error } = await supabase.from("estimations").insert({
      address: form.address!.display,
      latitude: form.address!.lat,
      longitude: form.address!.lng,
      property_type: form.propertyType!,
      details: {
        surface: form.surface, landSurface: form.landSurface, rooms: form.rooms,
        bedrooms: form.bedrooms, bathrooms: form.bathrooms, floor: form.floor,
        elevator: form.elevator, yearBuilt: form.yearBuilt, condition: form.condition,
        dpe: form.dpe, heating: form.heating, parking: form.parking, outdoor: form.outdoor,
        exposure: form.exposure, view: form.view, coproFees: form.coproFees,
        coproSyndic: form.coproSyndic, proximity: form.proximity, nuisances: form.nuisances,
        city: form.address?.city, postcode: form.address?.postcode,
      },
      contact_name: form.contactName,
      contact_email: form.contactEmail,
      contact_phone: form.contactPhone || null,
    });
    if (error) { alert("Une erreur est survenue. Merci de réessayer."); return; }
    sessionStorage.removeItem(STORAGE_KEY);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <SiteShell>
        <section className="container-narrow py-32 text-center">
          <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Merci</div>
          <h1 className="mt-6 font-serif text-4xl md:text-5xl">Votre demande est bien enregistrée.</h1>
          <p className="mx-auto mt-6 max-w-xl text-muted-foreground">
            Un membre du cabinet étudie votre bien et vous reviendra sous 48 h ouvrées
            avec une estimation argumentée. En cas d'urgence, écrivez-nous à
            <a href="mailto:contact@maison-associes.fr" className="ml-1 text-primary underline">contact@maison-associes.fr</a>.
          </p>
        </section>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <section className="container-narrow pt-16 md:pt-24">
        <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Estimation</div>
        <h1 className="mt-6 font-serif text-4xl md:text-5xl">Estimez votre bien.</h1>
        <p className="mt-4 max-w-xl text-muted-foreground">Cinq étapes, sans compte, sans engagement.</p>
      </section>

      <section className="container-narrow mt-12 max-w-3xl">
        <ol className="mb-12 flex flex-wrap gap-x-6 gap-y-2 text-xs uppercase tracking-widest">
          {STEPS.map((s, i) => (
            <li key={s} className={i === step ? "text-foreground" : i < step ? "text-primary" : "text-muted-foreground"}>
              <span className="tabular-nums">0{i + 1}</span> · {s}
            </li>
          ))}
        </ol>

        <div className="min-h-[380px]">
          {step === 0 && <StepAddress value={form.address} onChange={(v) => update("address", v)} />}
          {step === 1 && <StepType value={form.propertyType} onChange={(v) => update("propertyType", v)} />}
          {step === 2 && <StepFeatures form={form} update={update} />}
          {step === 3 && <StepContact form={form} update={update} />}
          {step === 4 && <StepSummary form={form} />}
        </div>

        <div className="mt-12 flex items-center justify-between border-t border-border pt-6">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="text-sm text-muted-foreground disabled:opacity-30"
          >
            ← Précédent
          </button>
          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canNext}
              className="border border-foreground bg-foreground px-8 py-3 text-xs uppercase tracking-widest text-background disabled:cursor-not-allowed disabled:opacity-40"
            >
              Continuer
            </button>
          ) : (
            <button
              onClick={submit}
              className="border border-foreground bg-primary px-8 py-3 text-xs uppercase tracking-widest text-primary-foreground"
            >
              Envoyer ma demande
            </button>
          )}
        </div>
      </section>
    </SiteShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
      {children}
    </label>
  );
}
const inputCls = "w-full border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-foreground";
const selectCls = inputCls + " appearance-none";

function StepAddress({ value, onChange }: { value: Address | null; onChange: (a: Address | null) => void }) {
  const [q, setQ] = useState(value?.display ?? "");
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [busy, setBusy] = useState(false);
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    if (!q || q === value?.display) { setResults([]); return; }
    const t = setTimeout(async () => {
      setBusy(true);
      try {
        const r = await searchAddress(q);
        setResults(r);
        setShowList(true);
      } finally { setBusy(false); }
    }, 400);
    return () => clearTimeout(t);
  }, [q, value?.display]);

  return (
    <div className="space-y-6">
      <div>
        <div className="font-serif text-2xl">Où se trouve votre bien ?</div>
        <p className="mt-2 text-sm text-muted-foreground">Commencez à taper l'adresse et sélectionnez la bonne suggestion.</p>
      </div>
      <div className="relative">
        <input
          type="text"
          value={q}
          onChange={(e) => { setQ(e.target.value); if (value) onChange(null); }}
          onFocus={() => results.length > 0 && setShowList(true)}
          placeholder="12 rue de Rivoli, Paris"
          className={inputCls}
          autoComplete="off"
        />
        {busy && <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">…</div>}
        {showList && results.length > 0 && (
          <ul className="absolute z-10 mt-1 max-h-72 w-full overflow-auto border border-border bg-background shadow-md">
            {results.map((r) => (
              <li key={r.place_id}>
                <button
                  type="button"
                  onClick={() => {
                    onChange({
                      display: r.display_name,
                      lat: parseFloat(r.lat),
                      lng: parseFloat(r.lon),
                      postcode: r.address?.postcode,
                      city: r.address?.city || r.address?.town || r.address?.village,
                    });
                    setQ(r.display_name);
                    setShowList(false);
                  }}
                  className="block w-full px-4 py-3 text-left text-sm hover:bg-muted"
                >
                  {r.display_name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {value && (
        <div className="border border-border">
          <LazyGlobe lat={value.lat} lng={value.lng} className="w-full" />
        </div>
      )}
    </div>
  );
}

function StepType({ value, onChange }: { value: PropertyType | null; onChange: (v: PropertyType) => void }) {
  const types: { v: PropertyType; l: string }[] = [
    { v: "appartement", l: "Appartement" },
    { v: "maison", l: "Maison" },
    { v: "terrain", l: "Terrain" },
    { v: "local_commercial", l: "Local commercial" },
  ];
  return (
    <div className="space-y-6">
      <div>
        <div className="font-serif text-2xl">De quel type de bien s'agit-il ?</div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {types.map((t) => (
          <button
            key={t.v}
            type="button"
            onClick={() => onChange(t.v)}
            className={`border p-8 text-left transition-colors ${value === t.v ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground"}`}
          >
            <div className="font-serif text-2xl">{t.l}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-sm">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 accent-[color:var(--primary)]" />
      {label}
    </label>
  );
}

function StepFeatures({ form, update }: { form: FormState; update: <K extends keyof FormState>(k: K, v: FormState[K]) => void }) {
  const isApt = form.propertyType === "appartement";
  const isHouse = form.propertyType === "maison";
  const toggleArr = (arr: string[], v: string) => arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];

  return (
    <div className="space-y-8">
      <div>
        <div className="font-serif text-2xl">Caractéristiques du bien</div>
        <p className="mt-2 text-sm text-muted-foreground">Plus vous êtes précis, plus l'estimation est fiable.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Field label="Surface habitable (m²)"><input type="number" min="0" value={form.surface} onChange={(e) => update("surface", e.target.value)} className={inputCls} /></Field>
        {isHouse && <Field label="Surface du terrain (m²)"><input type="number" min="0" value={form.landSurface} onChange={(e) => update("landSurface", e.target.value)} className={inputCls} /></Field>}
        <Field label="Nombre de pièces"><input type="number" min="0" value={form.rooms} onChange={(e) => update("rooms", e.target.value)} className={inputCls} /></Field>
        <Field label="Chambres"><input type="number" min="0" value={form.bedrooms} onChange={(e) => update("bedrooms", e.target.value)} className={inputCls} /></Field>
        <Field label="Salles de bain"><input type="number" min="0" value={form.bathrooms} onChange={(e) => update("bathrooms", e.target.value)} className={inputCls} /></Field>
        <Field label="Année de construction"><input type="number" min="1500" max="2030" value={form.yearBuilt} onChange={(e) => update("yearBuilt", e.target.value)} className={inputCls} /></Field>
        {isApt && (
          <>
            <Field label="Étage"><input type="number" min="0" value={form.floor} onChange={(e) => update("floor", e.target.value)} className={inputCls} /></Field>
            <div className="pt-8"><Check label="Ascenseur" checked={form.elevator} onChange={(v) => update("elevator", v)} /></div>
          </>
        )}
        <Field label="État général">
          <select value={form.condition} onChange={(e) => update("condition", e.target.value)} className={selectCls}>
            <option value="">—</option>
            <option value="neuf">Neuf</option>
            <option value="bon">Bon état</option>
            <option value="rafraichir">À rafraîchir</option>
            <option value="renover">À rénover</option>
            <option value="renover_total">À rénover entièrement</option>
          </select>
        </Field>
        <Field label="Classe DPE">
          <select value={form.dpe} onChange={(e) => update("dpe", e.target.value)} className={selectCls}>
            <option value="">—</option>
            {["A", "B", "C", "D", "E", "F", "G"].map((x) => <option key={x} value={x}>{x}</option>)}
          </select>
        </Field>
        <Field label="Type de chauffage">
          <select value={form.heating} onChange={(e) => update("heating", e.target.value)} className={selectCls}>
            <option value="">—</option>
            <option value="gaz">Gaz</option>
            <option value="electrique">Électrique</option>
            <option value="fioul">Fioul</option>
            <option value="pompe_chaleur">Pompe à chaleur</option>
            <option value="bois">Bois</option>
            <option value="collectif">Collectif</option>
          </select>
        </Field>
        <Field label="Stationnement">
          <select value={form.parking} onChange={(e) => update("parking", e.target.value)} className={selectCls}>
            <option value="">—</option>
            <option value="aucun">Aucun</option>
            <option value="parking">Parking</option>
            <option value="box">Box</option>
            <option value="garage">Garage</option>
          </select>
        </Field>
        <Field label="Exposition">
          <select value={form.exposure} onChange={(e) => update("exposure", e.target.value)} className={selectCls}>
            <option value="">—</option>
            {["Nord", "Sud", "Est", "Ouest", "Nord-Est", "Nord-Ouest", "Sud-Est", "Sud-Ouest"].map((x) => <option key={x} value={x}>{x}</option>)}
          </select>
        </Field>
        <Field label="Vue">
          <select value={form.view} onChange={(e) => update("view", e.target.value)} className={selectCls}>
            <option value="">—</option>
            <option value="degagee">Dégagée</option>
            <option value="rue">Sur rue</option>
            <option value="cour">Sur cour</option>
            <option value="mer">Mer</option>
            <option value="montagne">Montagne</option>
          </select>
        </Field>
      </div>

      <div>
        <div className="mb-3 text-xs uppercase tracking-widest text-muted-foreground">Extérieur</div>
        <div className="flex flex-wrap gap-x-8 gap-y-3">
          {["Balcon", "Terrasse", "Jardin", "Piscine"].map((o) => (
            <Check key={o} label={o} checked={form.outdoor.includes(o)} onChange={() => update("outdoor", toggleArr(form.outdoor, o))} />
          ))}
        </div>
      </div>

      {isApt && (
        <div className="grid gap-6 md:grid-cols-2">
          <Field label="Charges de copropriété (€/mois)"><input type="number" min="0" value={form.coproFees} onChange={(e) => update("coproFees", e.target.value)} className={inputCls} /></Field>
          <div className="pt-8"><Check label="Syndic professionnel" checked={form.coproSyndic} onChange={(v) => update("coproSyndic", v)} /></div>
        </div>
      )}

      <div>
        <div className="mb-3 text-xs uppercase tracking-widest text-muted-foreground">Proximité</div>
        <div className="flex flex-wrap gap-x-8 gap-y-3">
          {["Transports en commun", "Commerces", "Écoles"].map((o) => (
            <Check key={o} label={o} checked={form.proximity.includes(o)} onChange={() => update("proximity", toggleArr(form.proximity, o))} />
          ))}
        </div>
      </div>

      <Field label="Nuisances éventuelles">
        <textarea value={form.nuisances} onChange={(e) => update("nuisances", e.target.value)} rows={3} placeholder="Bruit, vis-à-vis, etc." className={inputCls} />
      </Field>
    </div>
  );
}

function StepContact({ form, update }: { form: FormState; update: <K extends keyof FormState>(k: K, v: FormState[K]) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <div className="font-serif text-2xl">Comment vous joindre ?</div>
        <p className="mt-2 text-sm text-muted-foreground">Vos coordonnées restent strictement confidentielles.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Field label="Nom complet"><input type="text" value={form.contactName} onChange={(e) => update("contactName", e.target.value)} className={inputCls} required /></Field>
        <Field label="Email"><input type="email" value={form.contactEmail} onChange={(e) => update("contactEmail", e.target.value)} className={inputCls} required /></Field>
        <Field label="Téléphone (optionnel)"><input type="tel" value={form.contactPhone} onChange={(e) => update("contactPhone", e.target.value)} className={inputCls} /></Field>
      </div>
    </div>
  );
}

function StepSummary({ form }: { form: FormState }) {
  const rows: [string, string | undefined | null][] = [
    ["Adresse", form.address?.display],
    ["Type", form.propertyType ?? undefined],
    ["Surface", form.surface ? `${form.surface} m²` : undefined],
    ["Terrain", form.landSurface ? `${form.landSurface} m²` : undefined],
    ["Pièces / chambres / SdB", [form.rooms, form.bedrooms, form.bathrooms].filter(Boolean).join(" / ") || undefined],
    ["Étage / ascenseur", form.floor ? `${form.floor}${form.elevator ? " (asc.)" : ""}` : undefined],
    ["Année de construction", form.yearBuilt || undefined],
    ["État", form.condition || undefined],
    ["DPE", form.dpe || undefined],
    ["Chauffage", form.heating || undefined],
    ["Stationnement", form.parking || undefined],
    ["Extérieur", form.outdoor.join(", ") || undefined],
    ["Exposition / vue", [form.exposure, form.view].filter(Boolean).join(" · ") || undefined],
    ["Charges copro", form.coproFees ? `${form.coproFees} €/mois` : undefined],
    ["Proximité", form.proximity.join(", ") || undefined],
    ["Nuisances", form.nuisances || undefined],
    ["Contact", `${form.contactName} — ${form.contactEmail}${form.contactPhone ? ` — ${form.contactPhone}` : ""}`],
  ];
  return (
    <div className="space-y-6">
      <div>
        <div className="font-serif text-2xl">Récapitulatif</div>
        <p className="mt-2 text-sm text-muted-foreground">Vérifiez avant d'envoyer.</p>
      </div>
      <dl className="divide-y divide-border border-y border-border">
        {rows.filter(([, v]) => v).map(([k, v]) => (
          <div key={k} className="grid grid-cols-3 gap-6 py-3 text-sm">
            <dt className="text-muted-foreground">{k}</dt>
            <dd className="col-span-2">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
