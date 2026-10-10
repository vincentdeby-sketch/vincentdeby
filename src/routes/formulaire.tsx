import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { SiteShell } from "@/components/site/SiteShell";
import { PageHeader } from "@/components/site/PageHeader";
import { FormProgress, NextSteps } from "@/components/site/FormChrome";
import { Confetti } from "@/components/motion/Confetti";
import { ArrowLeft, ArrowRight, Check, Mail, Phone, CalendarClock } from "lucide-react";

import { SITE } from "@/lib/site";
import { trackLead } from "@/lib/tracking";
import { notifyLead } from "@/lib/notify";
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
  // Sens de l'animation entre étapes (glisse vers la gauche en avançant, vers la droite en revenant).
  const prevStep = useRef(step);
  const stepAnim = step === prevStep.current ? "" : step > prevStep.current ? "step-forward" : "step-back";
  useEffect(() => { prevStep.current = step; }, [step]);
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
    navigator.vibrate?.(10);
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
    void notifyLead({
      data: {
        kind: "projet",
        name: form.contactName.trim(),
        email: form.contactMethod === "email" ? form.contactValue.trim() : undefined,
        phone: form.contactMethod === "telephone" ? form.contactValue.trim() : undefined,
        fields: {
          "Localisation du bien": form.location.trim(),
          "Où en est-il": form.timeline,
          Motivation: motivation,
          Occupation: form.occupation,
          "Idée du prix": form.priceBasis,
          "Contact souhaité": form.contactMethod === "creneau" ? `Créneau : ${form.slot || form.contactValue}` : form.contactMethod,
        },
      },
    }).catch(() => {});
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <SiteShell hideActionBar>
        <section className="container-narrow pt-10 md:pt-16">
          <div className="max-w-2xl">
            <Confetti />
            <span className="grid h-14 w-14 place-items-center rounded-full bg-brand text-ink">
              <Check className="h-6 w-6" aria-hidden="true" />
            </span>
            <h1 className="mt-8">Vos réponses sont bien reçues.</h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Vous pouvez réserver un rendez-vous ci-dessous. Sinon, je vous recontacte sous 48 h ouvrées.
            </p>
          </div>
          <div className="mt-10 overflow-hidden rounded-[1.75rem] border border-border bg-card">
            <iframe src={CALENDLY_URL} title="Réserver un créneau Calendly" className="h-[720px] w-full" loading="lazy" />
          </div>
        </section>
      </SiteShell>
    );
  }

  return (
    <SiteShell hideActionBar>
      <PageHeader
        eyebrow="Projet de vente"
        title={<>Préparons <em className="text-brand-ink">votre vente.</em></>}
        lede="Cinq questions pour cadrer votre projet, puis un créneau si vous le souhaitez. Deux minutes, pas plus."
      />

      <section className="container-narrow mt-10 grid gap-6 md:mt-14 lg:grid-cols-12 lg:items-start">
        <div ref={cardRef} className="surface p-5 sm:p-7 md:p-10 lg:col-span-8">
          <FormProgress steps={STEPS} step={step} />

          <div key={step} className={`min-h-[240px] md:min-h-[340px] ${stepAnim}`}>
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
                    <div className="mb-2 text-sm font-medium">
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
              <button type="button" onClick={submit} disabled={!canNext || sending} className="group btn btn-brand">
                {sending ? "Envoi…" : "Envoyer mes réponses"}
              </button>
            )}
          </div>
        </div>

        <div className="lg:col-span-4">
          <NextSteps />
        </div>
      </section>

      {form.contactMethod === "creneau" && step === 5 && (
        <section className="container-narrow mt-6">
          <p className="eyebrow mb-3">Réserver un créneau</p>
          <div className="overflow-hidden rounded-[1.75rem] border border-border bg-card">
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

const inputCls = "field";

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
        <div className="mb-2 text-sm font-medium">
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
              className="choice flex items-center justify-between gap-4 text-[0.95rem]"
            >
              {opt}
              <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border ${selected ? "border-ink bg-ink text-brand" : "border-foreground/20"}`}>
                {selected && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
              </span>
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
  const methods: { v: Form["contactMethod"]; l: string; sub: string; Icon: typeof Phone }[] = [
    { v: "telephone", l: "Téléphone", sub: "Je vous appelle", Icon: Phone },
    { v: "email", l: "E-mail", sub: "Je vous écris", Icon: Mail },
    { v: "creneau", l: "Rendez-vous", sub: "Vous choisissez l'horaire", Icon: CalendarClock },
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
              className="choice"
            >
              <m.Icon className="h-5 w-5" aria-hidden="true" />
              <div className="mt-4 font-serif text-xl">{m.l}</div>
              <div className="mt-1 text-xs text-muted-foreground">{m.sub}</div>
            </button>
          );
        })}
      </div>

      {form.contactMethod && (
        <div className="grid gap-6 md:grid-cols-2">
          <label className="block">
            <div className="mb-2 text-sm font-medium">
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
            <div className="mb-2 text-sm font-medium">
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
