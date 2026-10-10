import { Fragment } from "react";

type Part = { text: string; className?: string; em?: boolean } | "br";

// Titre qui s'écrit lettre à lettre. Le texte complet est rendu côté serveur (référencement)
// et lu d'un bloc par les lecteurs d'écran ; l'animation est purement visuelle.
export function Typewriter({ parts }: { parts: Part[] }) {
  let i = 0;
  return (
    <span className="typewriter" aria-hidden="true">
      {parts.map((p, k) => {
        if (p === "br") return <br key={k} />;
        const words = p.text.split(" ");
        const content = words.map((w, wi) => (
          <Fragment key={wi}>
            <span className="inline-block whitespace-nowrap">
              {[...w].map((c, ci) => (
                <span key={ci} className="ch" style={{ ["--i" as string]: i++ }}>{c}</span>
              ))}
            </span>
            {wi < words.length - 1 && <span className="ch" style={{ ["--i" as string]: i++ }}> </span>}
          </Fragment>
        ));
        return p.em ? <em key={k} className={p.className}>{content}</em> : <span key={k} className={p.className}>{content}</span>;
      })}
      <span className="caret" style={{ animationDelay: `${i * 32 + 150}ms` }} />
    </span>
  );
}
