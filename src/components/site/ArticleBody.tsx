import { Fragment, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";

// Mise en forme légère du texte des articles :
//   ## Titre, ### Sous-titre, lignes « - » en liste, « > » en citation,
//   **gras** et [lien](/page) dans le texte. Un texte brut reste lisible tel quel.

function inline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1]) {
      out.push(<strong key={m.index} className="font-semibold text-foreground">{m[1]}</strong>);
    } else if (m[3].startsWith("/")) {
      out.push(
        <Link key={m.index} to={m[3] as never} className="text-foreground underline decoration-brand decoration-2 underline-offset-4 hover:text-brand-ink">
          {m[2]}
        </Link>,
      );
    } else {
      out.push(
        <a key={m.index} href={m[3]} target="_blank" rel="noopener" className="text-foreground underline decoration-brand decoration-2 underline-offset-4 hover:text-brand-ink">
          {m[2]}
        </a>,
      );
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export const slugify = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export function articleHeadings(content: string) {
  return content
    .split(/\n/)
    .filter((l) => l.startsWith("## "))
    .map((l) => ({ id: slugify(l.slice(3)), text: l.slice(3).trim() }));
}

// `cta` s'insère avant le deuxième intertitre (milieu de lecture), s'il y en a un.
export function ArticleBody({ content, cta }: { content: string; cta?: ReactNode }) {
  const blocks = content.replace(/\r\n/g, "\n").trim().split(/\n{2,}/);
  let firstParagraph = true;
  let h2Count = 0;
  return (
    <>
      {blocks.map((block, i) => {
        const b = block.trim();
        if (b.startsWith("## ") && ++h2Count === 2 && cta) {
          return (
            <Fragment key={i}>
              {cta}
              <h2 id={slugify(b.slice(3))} className="mt-14 scroll-mt-28 !text-[clamp(1.6rem,2.6vw,2.1rem)]">
                {inline(b.slice(3))}
              </h2>
            </Fragment>
          );
        }
        if (b.startsWith("### ")) {
          return <h3 key={i} className="mt-10 font-serif text-[1.5rem] leading-snug">{inline(b.slice(4))}</h3>;
        }
        if (b.startsWith("## ")) {
          return (
            <h2 key={i} id={slugify(b.slice(3))} className="mt-14 scroll-mt-28 !text-[clamp(1.6rem,2.6vw,2.1rem)]">
              {inline(b.slice(3))}
            </h2>
          );
        }
        const lines = b.split("\n");
        if (lines.every((l) => /^- /.test(l))) {
          return (
            <ul key={i} className="mt-6 space-y-3 pl-1">
              {lines.map((l, j) => (
                <li key={j} className="flex gap-3">
                  <span className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-brand" aria-hidden="true" />
                  <span>{inline(l.slice(2))}</span>
                </li>
              ))}
            </ul>
          );
        }
        if (lines.every((l) => l.startsWith("> "))) {
          return (
            <blockquote key={i} className="mt-8 border-l-2 border-brand pl-6 italic text-foreground">
              {lines.map((l, j) => <Fragment key={j}>{j > 0 && <br />}{inline(l.slice(2))}</Fragment>)}
            </blockquote>
          );
        }
        const drop = firstParagraph;
        firstParagraph = false;
        return (
          <p
            key={i}
            className={`mt-6 ${drop ? "first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-serif first-letter:text-[4.2rem] first-letter:leading-[0.8] first-letter:text-brand-ink" : ""}`}
          >
            {lines.map((l, j) => <Fragment key={j}>{j > 0 && <br />}{inline(l)}</Fragment>)}
          </p>
        );
      })}
    </>
  );
}
