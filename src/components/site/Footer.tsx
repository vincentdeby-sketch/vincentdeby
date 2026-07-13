import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="mt-32 border-t border-border">
      <div className="container-narrow grid gap-12 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="font-serif text-2xl">Maison &amp; Associés</div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Cabinet d'estimation et de transaction immobilière. Expertise locale,
            approche mesurée, discrétion.
          </p>
        </div>
        <div>
          <div className="mb-4 text-xs uppercase tracking-widest text-muted-foreground">Cabinet</div>
          <ul className="space-y-2 text-sm">
            <li><Link to="/biens" className="hover:text-primary">Nos biens</Link></li>
            <li><Link to="/actualites" className="hover:text-primary">Actualités</Link></li>
            <li><Link to="/estimation" className="hover:text-primary">Estimation</Link></li>
          </ul>
        </div>
        <div>
          <div className="mb-4 text-xs uppercase tracking-widest text-muted-foreground">Contact</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>contact@maison-associes.fr</li>
            <li>+33 1 00 00 00 00</li>
            <li><Link to="/auth" className="hover:text-primary">Espace pro</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-narrow flex flex-col justify-between gap-2 py-6 text-xs text-muted-foreground md:flex-row">
          <div>© {new Date().getFullYear()} Maison &amp; Associés. Tous droits réservés.</div>
          <div>Estimations réalisées avec expertise locale.</div>
        </div>
      </div>
    </footer>
  );
}
