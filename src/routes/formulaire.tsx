import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { SiteShell } from "@/components/site/SiteShell";

import { SITE } from "@/lib/site";
import { trackLead } from "@/lib/tracking";
const CALENDLY_URL = "https://calendly.com/vdeby-efficity/rdv-estimation-immobiliere";

export const Route = createFileRoute("/formulaire")({
  head: () => ({
    meta: [
      { title: "Formulaire de qualification — Vincent Deby" },
      {
        name: "description",
        content:
          "Cinq questions rapides pour préparer votre projet de vente et un créneau Calendly pour en parler avec Vincent Deby.",
      },
      { property: "og:title", content: "Formulaire de qualification — Vincent Deby" },
      {
        property: "og:description",
        content: "Préparez votre projet de vente en cinq questions et réservez un échange.",
      },
      { property: "og:url", content: `${SITE}/formulaire` },
      { name: "robots", content: "noindex,follow" },
    ],
    links: [{ rel: "canonical", href: `${SITE}/formulaire` }],
  }),
  component: FormulairePage,
});

type Form = {
  location: string;
  timeline: string;
  motivation: string;
  motivationOther: string;
  occupation: string;
  priceBasis: string;
  contactMethod: "telephone" | "email" | "creneau" | "";
  contactName: string;
  contactValue: string;
  slot: string;
};

const INITIAL: Form = {
  location: "",
  timeline: "",
  motivation: "",
  motivationOther: "",
  occupation: "",
  priceBasis: "",
  contactMethod: "",
  contactName: "",
  contactValue: "",
  slot: "",
};

const STEPS = [
  "Localisation",
  "Horizon",
  "Motivation",
  "Occupation",
  "Prix",
  "Contact",
] as const;

const timelineOptions = [
  "Je veux vendre, je cherche le bon interlocuteur",
  "J'y pense sérieusement pour les 6 prochains mois",
  "C'est une réflexion à horizon 1 an ou plus",
  "Je veux surtout connaître la valeur, sans projet de vente immédiat",
];

const motivationOptions = [
  "Déménagement / mutation",
  "Achat d'un autre bien",
  "Succession, transmission, séparation",
  "Besoin de trésorerie",
  "Simple curiosité sur le prix",
  "Autre",
];

const occupationOptions = [
  "Je l'habite",
  "Il est loué",
  "Il est vacant",
  "Ce n'est pas encore le mien (succession en cours)",
];

const priceBasisOptions = [
  "J'ai une estimation d'un professionnel",
  "Je me suis basé sur des annonces du quartier",
  "J'ai utilisé un estimateur en ligne",
  "Aucune idée, c'est justement ce que je cherche",
];

function FormulairePage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Form>(INITIAL);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const firstRender = useRef(true);

  // À chaque étape, on remonte en haut de la carte (utile sur mobile).
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    const el = cardRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 90;
    if (window.scrollY > top) window.scrollTo({ top, behavior: "smooth" });
  }, [step]);

  // Questions à choix unique : la réponse fait passer à l'étape suivante.
  const choose = <K extends "timeline" | "occupation" | "priceBasis">(k: K, v: string) => {
    update(k, v);
    setTimeout(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 250);
  };

  const update = <K extends keyof Form>(k: K, v: Form[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const canNext = useMemo(() => {
    if (step === 0) return form.location.trim().length >= 2;
    if (step === 1) return !!form.timeline;
    if (step === 2)
      return (
        !!form.motivation &&
        (form.motivation !== "Autre" || form.motivationOther.trim().length > 1)
      );
    if (step === 3) return !!form.occupation;
    if (step === 4) return !!form.priceBasis;
    if (step === 5) {
      if (!form.contactMethod || form.contactName.trim().length < 2) return false;
      if (form.contactMethod === "email")
        return z.string().trim().email().safeParse(form.contactValue).success;
      if (form.contactMethod === "telephone")
        return form.contactValue.trim().length >= 6;
      if (form.contactMethod === "creneau") return form.contactValue.trim().length >= 2;
    }
    return true;
  }, [step, form]);

  const submit = async () => {
    setError(null);
    setSending(true);
    const motivation =
      form.motivation === "Autre" ? form.motivationOther.trim() : form.motivation;
    const { error } = await (supabase as any).from("leads").insert({
      location: form.location.trim(),
      timeline: form.timeline,
      motivation,
      occupation: form.occupation,
      price_basis: form.priceBasis,
      contact_method: form.contactMethod,
      contact_name: form.contactName.trim(),
      contact_value: form.contactValue.trim(),
      slot: form.contactMethod === "creneau" ? form.slot || form.contactValue : null,
    });
    setSending(false);
    if (error) {
      setError("L'envoi n'a pas abouti. Réessayez dans un instant, ou appelez-moi au 06 10 02 24 36.");
      return;
    }
    trackLead("qualification");
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <SiteShell>
        <section className="container-narrow py-24 md:py-32">
          <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Merci
          </div>
          <h1 className="mt-6 font-serif text-4xl md:text-5xl">
            Vos réponses sont bien reçues.
          </h1>
          <p className="mt-6 max-w-xl text-muted-foreground">
            Vous pouvez réserver un rendez-vous ci-dessous. Sinon, je vous
            recontacte sous 48 h ouvrées.
          </p>
          <div className="mt-10 overflow-hidden rounded-2xl border border-border">
            <iframe
              src={CALENDLY_URL}
              title="Réserver un créneau Calendly"
              className="h-[720px] w-full"
              loading="lazy"
            />
          </div>
        </section>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <section className="container-narrow pt-12 md:pt-24">
        <div className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground sm:text-xs">
          Formulaire
        </div>
        <h1 className="mt-4 font-serif text-4xl leading-[1.05] sm:text-5xl md:mt-6">
          Préparons votre vente.
        </h1>
        <p className="mt-4 max-w-xl text-muted-foreground">
          Cinq questions pour cadrer votre projet, puis un créneau si vous le
          souhaitez.
        </p>
      </section>

      <section className="container-narrow mt-8 max-w-3xl md:mt-12">
        <div ref={cardRef} className="glass rounded-3xl p-5 sm:p-6 md:p-10">
          <div className="mb-8 md:mb-12" aria-label="Progression du formulaire">
            <div className="flex items-center justify-between text-[11px] uppercase tracking-widest md:hidden">
              <span className="text-foreground">
                <span className="tabular-nums">0{step + 1}</span> · {STEPS[step]}
              </span>
              <span className="text-muted-foreground tabular-nums">
                {step + 1} / {STEPS.length}
              </span>
            </div>
            <div
              className="mt-3 h-1 w-full overflow-hidden rounded-full bg-muted md:hidden"
              role="progressbar"
              aria-label={`Étape ${step + 1} sur ${STEPS.length}`}
              aria-valuenow={step + 1}
              aria-valuemin={1}
              aria-valuemax={STEPS.length}
            >
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
              />
            </div>
            <ol className="hidden flex-wrap gap-x-6 gap-y-2 text-xs uppercase tracking-widest md:flex">
              {STEPS.map((s, i) => (
                <li
                  key={s}
                  className={
                    i === step
                      ? "text-foreground"
                      : i < step
                      ? "text-primary"
                      : "text-muted-foreground"
                  }
                >
                  <span className="tabular-nums">0{i + 1}</span> · {s}
                </li>
              ))}
            </ol>
          </div>

          <div className="min-h-[380px]">
            {step === 0 && (
              <StepText
                title="Où se situe le bien que vous envisagez de vendre ?"
                hint="Rue ou quartier + ville. Plus c'est précis, mieux c'est."
                label="Adresse ou quartier"
                value={form.location}
                onChange={(v) => update("location", v)}
                placeholder="12 rue de Silly, Boulogne — ou quartier Point-du-Jour"
              />
            )}
            {step === 1 && (
              <StepChoice
                title="Où en êtes-vous dans votre réflexion ?"
                options={timelineOptions}
                value={form.timeline}
                onChange={(v) => choose("timeline", v)}
              />
            )}
            {step === 2 && (
              <div className="space-y-6">
                <StepChoice
                  title="Qu'est-ce qui motive ce projet ?"
                  options={motivationOptions}
                  value={form.motivation}
                  onChange={(v) => update("motivation", v)}
                />
                {form.motivation === "Autre" && (
                  <label className="block">
                    <div className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">
                      Précisez
                    </div>
                    <input
                      type="text"
                      value={form.motivationOther}
                      onChange={(e) => update("motivationOther", e.target.value)}
                      className={inputCls}
                    />
                  </label>
                )}
              </div>
            )}
            {step === 3 && (
              <StepChoice
                title="Le bien est-il occupé ?"
                options={occupationOptions}
                value={form.occupation}
                onChange={(v) => choose("occupation", v)}
              />
            )}
            {step === 4 && (
              <StepChoice
                title="Avez-vous déjà une idée du prix, et sur quoi repose-t-elle ?"
                options={priceBasisOptions}
                value={form.priceBasis}
                onChange={(v) => choose("priceBasis", v)}
              />
            )}
            {step === 5 && (
              <StepContact form={form} update={update} />
            )}
          </div>

          {error && (
            <p role="alert" className="mt-8 border-l-2 border-destructive pl-4 text-sm text-foreground">
              {error}
            </p>
          )}

          <div className="mt-10 flex items-center justify-between gap-3 border-t border-border pt-6 md:mt-12">
            {step > 0 ? (
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                className="inline-flex min-h-11 items-center rounded-full px-4 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                ← Précédent
              </button>
            ) : (
              <span />
            )}
            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                disabled={!canNext}
                className="inline-flex min-h-11 items-center rounded-full bg-foreground px-6 py-3 text-[11px] uppercase tracking-[0.18em] text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 sm:px-8"
              >
                Continuer
              </button>
            ) : (
              <button
                type="button"
                onClick={submit}
                disabled={!canNext || sending}
                className="inline-flex min-h-11 items-center rounded-full bg-primary px-6 py-3 text-[11px] uppercase tracking-[0.18em] text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40 sm:px-8"
              >
                {sending ? "Envoi…" : "Envoyer mes réponses"}
              </button>
            )}
          </div>
        </div>
      </section>

      {form.contactMethod === "creneau" && step === 5 && (
        <section className="container-narrow mt-12 max-w-3xl">
          <div className="mb-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Réserver un créneau
          </div>
          <div className="overflow-hidden rounded-2xl border border-border">
            <iframe
              src={CALENDLY_URL}
              title="Réserver un créneau Calendly"
              className="h-[720px] w-full"
              loading="lazy"
            />
          </div>
        </section>
      )}
    </SiteShell>
  );
}

const inputCls =
  "w-full border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-foreground";

function StepText({
  title,
  hint,
  label,
  value,
  onChange,
  placeholder,
}: {
  title: string;
  hint?: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl">{title}</h2>
        {hint && <p className="mt-2 text-sm text-muted-foreground">{hint}</p>}
      </div>
      <label className="block">
        <div className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">
          {label}
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={inputCls}
          autoFocus
        />
      </label>
    </div>
  );
}

function StepChoice({
  title,
  options,
  value,
  onChange,
}: {
  title: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-6">
      <h2 className="font-serif text-2xl">{title}</h2>
      <div className="grid gap-3">
        {options.map((opt) => {
          const selected = value === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              aria-pressed={selected}
              className={`w-full rounded-2xl border px-5 py-4 text-left text-sm transition-colors ${
                selected
                  ? "border-foreground bg-foreground text-background"
                  : "border-border hover:border-foreground"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepContact({
  form,
  update,
}: {
  form: Form;
  update: <K extends keyof Form>(k: K, v: Form[K]) => void;
}) {
  const methods: { v: Form["contactMethod"]; l: string; sub: string }[] = [
    { v: "telephone", l: "Téléphone", sub: "Nom + numéro" },
    { v: "email", l: "Email", sub: "Nom + adresse" },
    { v: "creneau", l: "Créneau", sub: "Je choisis un horaire" },
  ];
  return (
    <div className="space-y-6">
      <div>
        <div className="font-serif text-2xl">
          Comment préférez-vous qu'on prenne contact ?
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {methods.map((m) => {
          const selected = form.contactMethod === m.v;
          return (
            <button
              key={m.v}
              type="button"
              onClick={() => update("contactMethod", m.v)}
              aria-pressed={selected}
              className={`rounded-2xl border p-5 text-left transition-colors ${
                selected
                  ? "border-foreground bg-foreground text-background"
                  : "border-border hover:border-foreground"
              }`}
            >
              <div className="font-serif text-lg">{m.l}</div>
              <div className="mt-1 text-xs opacity-70">{m.sub}</div>
            </button>
          );
        })}
      </div>

      {form.contactMethod && (
        <div className="grid gap-6 md:grid-cols-2">
          <label className="block">
            <div className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">
              Votre nom
            </div>
            <input
              type="text"
              autoComplete="name"
              value={form.contactName}
              onChange={(e) => update("contactName", e.target.value)}
              className={inputCls}
            />
          </label>
          <label className="block">
            <div className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">
              {form.contactMethod === "email"
                ? "Adresse email"
                : form.contactMethod === "telephone"
                ? "Numéro de téléphone"
                : "Créneau souhaité"}
            </div>
            <input
              type={
                form.contactMethod === "email"
                  ? "email"
                  : form.contactMethod === "telephone"
                  ? "tel"
                  : "text"
              }
              value={form.contactValue}
              onChange={(e) => update("contactValue", e.target.value)}
              placeholder={
                form.contactMethod === "creneau"
                  ? "Ex. mardi 10 h — ou choisissez ci-dessous"
                  : undefined
              }
              className={inputCls}
            />
          </label>
        </div>
      )}
      {form.contactMethod && (
        <p className="text-xs leading-relaxed text-muted-foreground">
          Vos réponses servent uniquement à préparer notre échange. Elles ne sont ni vendues ni cédées.{" "}
          <Link to="/confidentialite" className="underline underline-offset-2">Politique de confidentialité</Link>
        </p>
      )}
    </div>
  );
}
