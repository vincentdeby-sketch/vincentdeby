import { Link } from "@tanstack/react-router";
import { NewsletterForm } from "./NewsletterForm";

const PHONE = "+33610022436";
const PHONE_DISPLAY = "+33 6 10 02 24 36";
const EMAIL = "vincentdeby@gmail.com";

export function Footer() {
  return (
    <footer className="mt-24 md:mt-32">
      <div className="container-narrow pb-8 md:pb-10">
        <div className="glass grid gap-10 rounded-[2rem] p-8 sm:grid-cols-2 md:grid-cols-4 md:gap-12 md:p-14">
          <div className="sm:col-span-2 md:col-span-2">
            <div className="font-serif text-2xl">Vincent Deby</div>
            <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
              Conseiller Immobilier · Mandataire Efficity
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Estimation et transaction immobilière à Boulogne-Billancourt,
              Issy-les-Moulineaux, Sèvres, Saint-Cloud, Paris 15e et 16e.
              Ancien journaliste, j'applique à l'immobilier la rigueur du métier.
            </p>

            <div className="mt-6 max-w-sm">
              <div className="mb-3 text-xs uppercase tracking-widest text-muted-foreground">
                Newsletter
              </div>
              <NewsletterForm />
            </div>
          </div>
          <nav aria-label="Liens de pied de page">
            <div className="mb-4 text-xs uppercase tracking-widest text-muted-foreground">Navigation</div>
            <ul className="space-y-2 text-sm">
              <li><Link to="/biens" className="hover:text-primary">Nos biens</Link></li>
              <li><Link to="/actualites" className="hover:text-primary">Actualités</Link></li>
              <li><Link to="/estimation" className="hover:text-primary">Estimation</Link></li>
              <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
            </ul>
          </nav>
          <div>
            <div className="mb-4 text-xs uppercase tracking-widest text-muted-foreground">Contact</div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href={`mailto:${EMAIL}`} className="hover:text-foreground break-all">{EMAIL}</a></li>
              <li><a href={`tel:${PHONE}`} className="hover:text-foreground">{PHONE_DISPLAY}</a></li>
              <li><Link to="/auth" className="hover:text-foreground">Espace pro</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-6 flex flex-col justify-between gap-2 px-2 text-xs text-muted-foreground sm:px-4 md:flex-row">
          <div>© {new Date().getFullYear()} Vincent Deby — Mandataire Efficity. Tous droits réservés.</div>
          <div>Boulogne-Billancourt & ouest parisien.</div>
        </div>
      </div>
    </footer>
  );
}
