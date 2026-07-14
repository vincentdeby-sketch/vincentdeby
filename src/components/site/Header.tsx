import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import portrait from "@/assets/vincent-deby.jpg";

const nav = [
  { to: "/", label: "Accueil" },
  { to: "/videos", label: "Vidéos" },
  { to: "/biens", label: "Nos biens" },
  { to: "/actualites", label: "Actualités" },
  { to: "/estimation", label: "Estimation" },
  { to: "/contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll & close on Escape when mobile menu is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 pt-3 md:pt-4">
      <div className="container-narrow">
        <div
          className={`glass relative flex items-center justify-between gap-4 rounded-full py-2 pl-4 pr-2 md:gap-6 md:pl-6 md:pr-3 transition-shadow duration-300 ${
            scrolled ? "shadow-[0_16px_40px_-20px_rgba(20,20,20,0.22)]" : ""
          }`}
        >
          {/* Logo — brand block */}
          <Link
            to="/"
            aria-label="Vincent Deby — Accueil"
            className="flex min-w-0 items-center gap-3 shrink-0 rounded-full"
          >
            <span className="font-serif text-base leading-none sm:text-lg md:text-xl">Vincent Deby</span>
            <span className="hidden h-4 w-px bg-foreground/20 lg:inline-block" />
            <span className="hidden text-[10px] uppercase leading-tight tracking-[0.18em] text-muted-foreground lg:inline">
              Conseiller<br />Immobilier
            </span>
            <span className="hidden h-4 w-px bg-foreground/20 xl:inline-block" />
            <span className="hidden text-[10px] uppercase leading-tight tracking-[0.18em] text-muted-foreground xl:inline">
              Mandataire<br />Efficity
            </span>
          </Link>

          {/* Nav — center */}
          <nav aria-label="Navigation principale" className="hidden items-center gap-1 text-sm md:flex">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="relative rounded-full px-3 py-2 text-foreground/70 transition-colors hover:text-foreground"
                activeProps={{ className: "text-primary font-medium after:absolute after:left-3 after:right-3 after:-bottom-0.5 after:h-px after:bg-primary" }}
                activeOptions={{ exact: n.to === "/" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          {/* Actions — right */}
          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/auth"
              className="rounded-full border border-foreground/20 px-3 py-2.5 text-[11px] uppercase tracking-[0.14em] text-foreground transition-colors hover:border-foreground hover:bg-foreground hover:text-background sm:px-4 md:px-5 md:tracking-[0.18em]"
            >
              Connexion
            </Link>
            <Link
              to="/estimation"
              className="hidden rounded-full bg-foreground px-5 py-2.5 text-[11px] uppercase tracking-[0.18em] text-background transition-opacity hover:opacity-90 md:inline-block"
            >
              Estimer
            </Link>
            <button
              type="button"
              className="grid h-11 w-11 place-items-center rounded-full border border-foreground/15 transition-colors hover:bg-foreground/5 md:hidden"
              aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div id="mobile-menu" className="container-narrow mt-2 md:hidden">
          <div className="glass-strong rounded-3xl p-2">
            <nav aria-label="Navigation mobile" className="flex flex-col text-sm">
              {nav.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setOpen(false)}
                  className="rounded-2xl px-4 py-3.5 text-foreground/80 hover:bg-foreground/5"
                  activeProps={{ className: "text-primary font-medium" }}
                  activeOptions={{ exact: n.to === "/" }}
                >
                  {n.label}
                </Link>
              ))}
              <Link
                to="/estimation"
                onClick={() => setOpen(false)}
                className="mt-2 rounded-2xl bg-foreground py-3.5 text-center text-xs uppercase tracking-[0.18em] text-background"
              >
                Estimer mon bien
              </Link>
              <Link
                to="/auth"
                onClick={() => setOpen(false)}
                className="mt-2 rounded-2xl border border-foreground/20 py-3.5 text-center text-xs uppercase tracking-[0.18em] text-foreground hover:bg-foreground hover:text-background"
              >
                Connexion
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
