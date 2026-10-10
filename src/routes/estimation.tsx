import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { SiteShell } from "@/components/site/SiteShell";
import { PageHeader } from "@/components/site/PageHeader";
import { FormProgress, NextSteps } from "@/components/site/FormChrome";
import { ArrowLeft, ArrowRight, Building2, Home as HomeIcon, LandPlot, Store, Check as CheckIcon } from "lucide-react";
import { LazyGlobe } from "@/components/site/LazyGlobe";
import { searchAddress, type AddressSuggestion } from "@/lib/address";
import { trackLead } from "@/lib/tracking";

import { SITE } from "@/lib/site";

export const Route = createFileRoute("/estimation")({
  head: () => ({
    meta: [
      { title: "Estimation immobilière gratuite en ligne — Vincent Deby" },
      { name: "description", content: "Formulaire d'estimation immobilière en cinq étapes. Retour humain, argumenté, sans engagement — appartement, maison, terrain ou local." },
      { property: "og:title", content: "Estimation immobilière gratuite — Vincent Deby" },
      { property: "og:description", content: "Formulaire d'estimation en cinq étapes. Retour humain, sans engagement." },
      { property: "og:url", content: `${SITE}/estimation` },
    ],
    links: [{ rel: "canonical", href: `${SITE}/estimation` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          serviceType: "Estimation immobilière",
          provider: { "@type": "RealEstateAgent", name: "Vincent Deby" },
          areaServed: ["Boulogne-Billancourt", "Issy-les-Moulineaux", "Sèvres", "Saint-Cloud", "Paris 15e", "Paris 16e"],
          offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
        }),
      },
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
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const firstRender = useRef(true);

  // À chaque étape, on remonte en haut de la carte : sur mobile, le bouton « Continuer » est loin en bas.
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    const el = cardRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 90;
    if (window.scrollY > top) window.scrollTo({ top, behavior: "smooth" });
  }, [step]);

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
    setError(null);
    setSending(true);
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
    setSending(false);
    if (error) {
      setError("L'envoi n'a pas abouti. Réessayez dans un instant, ou écrivez-moi directement à vdeby@efficity.com.");
      return;
    }
    trackLead("estimation");
    sessionStorage.removeItem(STORAGE_KEY);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <SiteShell hideActionBar>
        <section className="container-narrow pt-10 md:pt-16">
          <div className="mx-auto max-w-2xl text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-brand text-ink">
              <CheckIcon className="h-6 w-6" aria-hidden="true" />
            </span>
            <h1 className="mt-8">Demande bien reçue.</h1>
            <p className="mt-6 text-lg text-muted-foreground">
              J'étudie votre bien et je vous rappelle sous 48 heures ouvrées pour organiser la visite.
              Une urgence ? Écrivez-moi à{" "}
              <a href="mailto:vdeby@efficity.com" className="text-foreground underline decoration-brand decoration-2 underline-offset-4">vdeby@efficity.com</a>.
            </p>
            <div className="mt-10 surface p-7 text-left">
              <p className="eyebrow">Facultatif · 2 minutes</p>
              <p className="mt-3 font-serif text-2xl">Pour gagner du temps lors de notre appel</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Cinq questions sur votre calendrier et votre projet. Je préparerai notre échange en conséquence.
              </p>
              <Link to="/formulaire" className="group btn btn-primary mt-6">
                Répondre aux 5 questions
                <span className="btn-arrow" aria-hidden="true"><ArrowRight className="h-3.5 w-3.5" /></span>
              </Link>
            </div>
          </div>
        </section>
      </SiteShell>
    );
  }

  return (
    <SiteShell hideActionBar>
      <PageHeader
        eyebrow="Estimation gratuite"
        title={<>Estimez votre bien, <em className="text-brand-ink">pour de vrai.</em></>}
        lede="Cinq étapes, sans compte, sans engagement. Je reviens vers vous avec un prix appuyé sur des ventes réelles, pas sur un algorithme."
      />

      <section className="container-narrow mt-10 grid gap-6 md:mt-14 lg:grid-cols-12 lg:items-start">
        <div ref={cardRef} className="surface p-5 sm:p-7 md:p-10 lg:col-span-8">
          <FormProgress steps={STEPS} step={step} />

          <div className="min-h-[240px] md:min-h-[340px]">
            {step === 0 && <StepAddress value={form.address} onChange={(v) => update("address", v)} />}
            {step === 1 && (
              <StepType
                value={form.propertyType}
                onChange={(v) => {
                  update("propertyType", v);
                  // Un seul choix possible : on passe à l'étape suivante sans clic supplémentaire.
                  setTimeout(() => setStep(2), 250);
                }}
              />
            )}
            {step === 2 && <StepFeatures form={form} update={update} />}
            {step === 3 && <StepContact form={form} update={update} />}
            {step === 4 && <StepSummary form={form} />}
          </div>

          {error && (
            <p role="alert" className="mt-8 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-foreground">
              {error}
            </p>
          )}

          <div className="mt-10 flex items-center justify-between gap-3 border-t border-border pt-6">
            {step > 0 ? (
              <button type="button" onClick={() => setStep((s) => Math.max(0, s - 1))} className="btn btn-ghost !border-transparent !px-3">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Retour
              </button>
            ) : (
              <span />
            )}
            {step < STEPS.length - 1 ? (
              <button type="button" onClick={() => setStep((s) => s + 1)} disabled={!canNext} className="group btn btn-primary">
                Continuer
                <span className="btn-arrow" aria-hidden="true"><ArrowRight className="h-3.5 w-3.5" /></span>
              </button>
            ) : (
              <button type="button" onClick={submit} disabled={sending} className="group btn btn-brand">
                {sending ? "Envoi…" : "Envoyer ma demande"}
                {!sending && <span className="btn-arrow !bg-ink !text-brand" aria-hidden="true"><ArrowRight className="h-3.5 w-3.5" /></span>}
              </button>
            )}
          </div>
        </div>

        <div className="lg:col-span-4">
          <NextSteps />
        </div>
      </section>
    </SiteShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-2 text-sm font-medium">{label}</div>
      {children}
    </label>
  );
}
const inputCls = "field";
const selectCls = "field pr-10";

function StepAddress({ value, onChange }: { value: Address | null; onChange: (a: Address | null) => void }) {
  const [q, setQ] = useState(value?.display ?? "");
  const [results, setResults] = useState<AddressSuggestion[]>([]);
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
        <h2 className="font-serif text-2xl">Où se trouve votre bien ?</h2>
        <p className="mt-2 text-sm text-muted-foreground">Commencez à taper l'adresse et sélectionnez la bonne suggestion.</p>
      </div>
      <div className="relative">
        <input
          type="text"
          aria-label="Adresse du bien"
          value={q}
          onChange={(e) => { setQ(e.target.value); if (value) onChange(null); }}
          onFocus={() => results.length > 0 && setShowList(true)}
          placeholder="12 rue de Silly, Boulogne-Billancourt"
          className={inputCls}
          autoComplete="off"
        />
        {busy && <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">…</div>}
        {showList && results.length > 0 && (
          <ul className="absolute z-10 mt-2 max-h-72 w-full overflow-auto rounded-2xl border border-border bg-card p-1.5 shadow-[0_24px_48px_-24px_rgb(18_20_17/0.4)]">
            {results.map((r) => (
              <li key={r.id}>
                <button
                  type="button"
                  onClick={() => {
                    onChange({ display: r.label, lat: r.lat, lng: r.lng, postcode: r.postcode, city: r.city });
                    setQ(r.label);
                    setShowList(false);
                  }}
                  className="block w-full rounded-xl px-4 py-3 text-left text-sm hover:bg-muted"
                >
                  {r.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {value && (
        <div className="overflow-hidden rounded-2xl border border-border">
          <LazyGlobe lat={value.lat} lng={value.lng} className="w-full" />
        </div>
      )}
    </div>
  );
}

function StepType({ value, onChange }: { value: PropertyType | null; onChange: (v: PropertyType) => void }) {
  const types: { v: PropertyType; l: string; Icon: typeof Building2 }[] = [
    { v: "appartement", l: "Appartement", Icon: Building2 },
    { v: "maison", l: "Maison", Icon: HomeIcon },
    { v: "terrain", l: "Terrain", Icon: LandPlot },
    { v: "local_commercial", l: "Local commercial", Icon: Store },
  ];
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl">De quel type de bien s'agit-il ?</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {types.map((t) => (
          <button
            key={t.v}
            type="button"
            onClick={() => onChange(t.v)}
            aria-pressed={value === t.v}
            className="choice flex items-center gap-4 !p-5"
          >
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-foreground/5">
              <t.Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="font-serif text-2xl">{t.l}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-sm">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-5 w-5 rounded accent-[#2c6a1b]" />
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
        <h2 className="font-serif text-2xl">Caractéristiques du bien</h2>
        <p className="mt-2 text-sm text-muted-foreground">Seule la surface est obligatoire. Le reste m'aide à affiner, mais on peut le voir ensemble.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Field label="Surface habitable (m²)"><input type="number" min="0" value={form.surface} onChange={(e) => update("surface", e.target.value)} className={inputCls} /></Field>
        {isHouse && <Field label="Surface du terrain (m²) (facultatif)"><input type="number" min="0" value={form.landSurface} onChange={(e) => update("landSurface", e.target.value)} className={inputCls} /></Field>}
        <Field label="Nombre de pièces (facultatif)"><input type="number" min="0" value={form.rooms} onChange={(e) => update("rooms", e.target.value)} className={inputCls} /></Field>
        <Field label="Chambres (facultatif)"><input type="number" min="0" value={form.bedrooms} onChange={(e) => update("bedrooms", e.target.value)} className={inputCls} /></Field>
        <Field label="Salles de bain (facultatif)"><input type="number" min="0" value={form.bathrooms} onChange={(e) => update("bathrooms", e.target.value)} className={inputCls} /></Field>
        <Field label="Année de construction (facultatif)"><input type="number" min="1500" max="2030" value={form.yearBuilt} onChange={(e) => update("yearBuilt", e.target.value)} className={inputCls} /></Field>
        {isApt && (
          <>
            <Field label="Étage (facultatif)"><input type="number" min="0" value={form.floor} onChange={(e) => update("floor", e.target.value)} className={inputCls} /></Field>
            <div className="pt-8"><Check label="Ascenseur" checked={form.elevator} onChange={(v) => update("elevator", v)} /></div>
          </>
        )}
        <Field label="État général (facultatif)">
          <select value={form.condition} onChange={(e) => update("condition", e.target.value)} className={selectCls}>
            <option value="">—</option>
            <option value="neuf">Neuf</option>
            <option value="bon">Bon état</option>
            <option value="rafraichir">À rafraîchir</option>
            <option value="renover">À rénover</option>
            <option value="renover_total">À rénover entièrement</option>
          </select>
        </Field>
        <Field label="Classe DPE (facultatif)">
          <select value={form.dpe} onChange={(e) => update("dpe", e.target.value)} className={selectCls}>
            <option value="">—</option>
            {["A", "B", "C", "D", "E", "F", "G"].map((x) => <option key={x} value={x}>{x}</option>)}
          </select>
        </Field>
        <Field label="Type de chauffage (facultatif)">
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
        <Field label="Stationnement (facultatif)">
          <select value={form.parking} onChange={(e) => update("parking", e.target.value)} className={selectCls}>
            <option value="">—</option>
            <option value="aucun">Aucun</option>
            <option value="parking">Parking</option>
            <option value="box">Box</option>
            <option value="garage">Garage</option>
          </select>
        </Field>
        <Field label="Exposition (facultatif)">
          <select value={form.exposure} onChange={(e) => update("exposure", e.target.value)} className={selectCls}>
            <option value="">—</option>
            {["Nord", "Sud", "Est", "Ouest", "Nord-Est", "Nord-Ouest", "Sud-Est", "Sud-Ouest"].map((x) => <option key={x} value={x}>{x}</option>)}
          </select>
        </Field>
        <Field label="Vue (facultatif)">
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
        <div className="mb-3 text-sm font-medium">Extérieur (facultatif)</div>
        <div className="flex flex-wrap gap-x-8 gap-y-3">
          {["Balcon", "Terrasse", "Jardin", "Piscine"].map((o) => (
            <Check key={o} label={o} checked={form.outdoor.includes(o)} onChange={() => update("outdoor", toggleArr(form.outdoor, o))} />
          ))}
        </div>
      </div>

      {isApt && (
        <div className="grid gap-6 md:grid-cols-2">
          <Field label="Charges de copropriété (€/mois) (facultatif)"><input type="number" min="0" value={form.coproFees} onChange={(e) => update("coproFees", e.target.value)} className={inputCls} /></Field>
          <div className="pt-8"><Check label="Syndic professionnel" checked={form.coproSyndic} onChange={(v) => update("coproSyndic", v)} /></div>
        </div>
      )}

      <div>
        <div className="mb-3 text-sm font-medium">Proximité (facultatif)</div>
        <div className="flex flex-wrap gap-x-8 gap-y-3">
          {["Transports en commun", "Commerces", "Écoles"].map((o) => (
            <Check key={o} label={o} checked={form.proximity.includes(o)} onChange={() => update("proximity", toggleArr(form.proximity, o))} />
          ))}
        </div>
      </div>

      <Field label="Nuisances éventuelles (facultatif)">
        <textarea value={form.nuisances} onChange={(e) => update("nuisances", e.target.value)} rows={3} placeholder="Bruit, vis-à-vis, etc." className={inputCls} />
      </Field>
    </div>
  );
}

function StepContact({ form, update }: { form: FormState; update: <K extends keyof FormState>(k: K, v: FormState[K]) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl">Comment vous joindre ?</h2>
        <p className="mt-2 text-sm text-muted-foreground">Vos coordonnées restent strictement confidentielles.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Field label="Nom complet"><input type="text" autoComplete="name" value={form.contactName} onChange={(e) => update("contactName", e.target.value)} className={inputCls} required /></Field>
        <Field label="Email"><input type="email" autoComplete="email" value={form.contactEmail} onChange={(e) => update("contactEmail", e.target.value)} className={inputCls} required /></Field>
        <Field label="Téléphone (facultatif)"><input type="tel" autoComplete="tel" value={form.contactPhone} onChange={(e) => update("contactPhone", e.target.value)} className={inputCls} /></Field>
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground">
        Ces informations servent uniquement à préparer votre estimation et à vous recontacter.
        Elles ne sont ni vendues ni cédées.{" "}
        <Link to="/confidentialite" className="underline underline-offset-2">Politique de confidentialité</Link>
      </p>
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
        <h2 className="font-serif text-2xl">Récapitulatif</h2>
        <p className="mt-2 text-sm text-muted-foreground">Vérifiez avant d'envoyer.</p>
      </div>
      <dl className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-background/50 px-5">
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
