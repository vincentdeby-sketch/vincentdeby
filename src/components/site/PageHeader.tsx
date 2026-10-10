import type { ReactNode } from "react";

// En-tête commun des pages intérieures : étiquette, grand titre, chapeau.
export function PageHeader({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="container-narrow pt-10 md:pt-16">
      <p className="eyebrow">
        <span className="live-dot" aria-hidden="true" /> {eyebrow}
      </p>
      <h1 className="mt-6 max-w-4xl">{title}</h1>
      {lede && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">{lede}</p>}
      {children}
    </section>
  );
}
