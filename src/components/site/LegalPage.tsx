import type { ReactNode } from "react";
import { SiteShell } from "./SiteShell";

export function LegalPage({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <SiteShell>
      <section className="container-narrow pt-12 pb-24 md:pt-24">
        <div className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground sm:text-xs">Informations légales</div>
        <h1 className="mt-4 font-serif text-4xl leading-[1.05] sm:text-5xl md:mt-6">{title}</h1>
        <p className="mt-4 text-sm text-muted-foreground">Dernière mise à jour : {updated}</p>
        <div className="mt-10 max-w-2xl space-y-8 leading-relaxed text-foreground/85 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:text-foreground [&_p]:mt-3 [&_a]:underline [&_a]:underline-offset-2">
          {children}
        </div>
      </section>
    </SiteShell>
  );
}

export function Field({ value }: { value: string | null }) {
  return value ? <>{value}</> : <span className="text-muted-foreground italic">[à compléter]</span>;
}
