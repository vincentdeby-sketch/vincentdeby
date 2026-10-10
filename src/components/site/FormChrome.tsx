import type { ReactNode } from "react";
import portrait from "@/assets/vincent-deby-200.webp";

// Progression segmentée, commune aux formulaires d'estimation et de qualification.
export function FormProgress({ steps, step }: { steps: readonly string[]; step: number }) {
  return (
    <div className="mb-8 md:mb-10">
      <div className="flex items-baseline justify-between gap-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.08em]">
          <span className="text-brand-ink">Étape {step + 1}</span>
          <span className="text-muted-foreground"> / {steps.length} · {steps[step]}</span>
        </p>
      </div>
      <ol
        className="mt-3 grid gap-1.5"
        style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}
        aria-label={`Étape ${step + 1} sur ${steps.length} : ${steps[step]}`}
      >
        {steps.map((s, i) => (
          <li key={s} aria-current={i === step ? "step" : undefined} className="h-1.5 overflow-hidden rounded-full bg-foreground/10">
            <span
              className={`block h-full rounded-full transition-all duration-500 ${i < step ? "w-full bg-ink" : i === step ? "w-full bg-brand" : "w-0"}`}
            />
            <span className="sr-only">{s}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

const NEXT = [
  { t: "Je lis votre demande", d: "Personnellement, pas un robot." },
  { t: "Je vous appelle", d: "Sous 48 heures ouvrées, pour faire connaissance." },
  { t: "Je visite le bien", d: "Avec vous, pour voir ce que les chiffres ne disent pas." },
  { t: "Je vous remets le dossier", d: "Le prix juste et toutes les ventes qui le justifient." },
];

// Colonne latérale : ce qui se passe après l'envoi. Rassure sans rien promettre de plus.
export function NextSteps({ children }: { children?: ReactNode }) {
  return (
    <aside className="lg:sticky lg:top-28">
      <div className="rounded-[1.75rem] bg-ink p-7 text-paper">
        <p className="eyebrow !text-paper/60">Et ensuite ?</p>
        <ol className="mt-6 space-y-5">
          {NEXT.map((n, i) => (
            <li key={n.t} className="flex gap-4">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-paper/20 font-mono text-[11px]">
                {i + 1}
              </span>
              <div>
                <p className="font-medium">{n.t}</p>
                <p className="mt-0.5 text-sm text-paper/60">{n.d}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-7 flex items-center gap-3 border-t border-paper/15 pt-6">
          <img src={portrait} alt="" width={44} height={44} className="h-11 w-11 rounded-full object-cover" />
          <div className="text-sm">
            <p className="font-medium">Vincent Deby</p>
            <p className="text-paper/60">Gratuit et sans engagement</p>
          </div>
        </div>
      </div>
      {children}
    </aside>
  );
}
