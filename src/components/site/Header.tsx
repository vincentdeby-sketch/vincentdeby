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
          className={[
            "liquid-glass sheen-ambient relative flex items-center justify-between gap-4 rounded-full",
            "transition-[padding,box-shadow,transform] duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
            scrolled
              ? "py-1.5 pl-3 pr-1.5 md:pl-5 md:pr-2 liquid-glass-lift"
              : "py-2 pl-4 pr-2 md:pl-6 md:pr-3",
          ].join(" ")}
        >
          {/* Logo — brand block */}
          <Link
            to="/"
            aria-label="Vincent Deby — Accueil"
            className="group/logo flex min-w-0 items-center gap-3 shrink-0 rounded-full transition-transform duration-300 hover:-translate-y-[1px]"
          >
            <span
              className={[
                "portrait-ring relative inline-block shrink-0 rounded-full",
                "transition-[height,width] duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
                scrolled ? "h-9 w-9 sm:h-10 sm:w-10" : "h-10 w-10 sm:h-11 sm:w-11",
              ].join(" ")}
            >
              <img
                src={portrait}
                alt="Portrait de Vincent Deby"
                loading="eager"
                decoding="async"
                className="relative h-full w-full rounded-full object-cover ring-1 ring-foreground/10 shadow-[0_4px_18px_-6px_rgba(20,20,20,0.35)] transition-transform duration-500 group-hover/logo:scale-[1.04]"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(ellipse_at_30%_20%,rgba(255,255,255,0.55),transparent_55%)]"
              />
            </span>
            <span className="font-serif text-base leading-none sm:text-lg md:text-xl bg-gradient-to-b from-foreground to-foreground/75 bg-clip-text text-transparent">
              Vincent Deby
            </span>
            <span className="hidden h-4 w-px bg-gradient-to-b from-transparent via-foreground/25 to-transparent lg:inline-block" />
            <span className="hidden text-[10px] uppercase leading-tight tracking-[0.18em] text-muted-foreground lg:inline">
              Conseiller<br />Immobilier
            </span>
            <span className="hidden h-4 w-px bg-gradient-to-b from-transparent via-foreground/25 to-transparent xl:inline-block" />
            <span className="hidden text-[10px] uppercase leading-tight tracking-[0.18em] text-muted-foreground xl:inline">
              Mandataire<br />Efficity
            </span>
          </Link>

          {/* Nav — center */}
          <nav aria-label="Navigation principale" className="hidden items-center gap-0.5 text-sm md:flex">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="nav-pill relative rounded-full px-3 py-2 text-foreground/70 transition-colors duration-200 hover:text-foreground"
                activeProps={{
                  className:
                    "text-foreground font-medium [&_.dot]:opacity-100 [&_.dot]:scale-100",
                }}
                activeOptions={{ exact: n.to === "/" }}
              >
                <span className="relative z-[1]">{n.label}</span>
                <span
                  aria-hidden="true"
                  className="dot pointer-events-none absolute left-1/2 -bottom-0.5 h-1 w-1 -translate-x-1/2 rounded-full bg-primary opacity-0 scale-50 shadow-[0_0_8px_rgba(0,80,60,0.55)] transition-all duration-300"
                />
              </Link>
            ))}
          </nav>

          {/* Actions — right */}
          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/auth"
              className="hidden rounded-full border border-foreground/15 bg-background/40 px-4 py-2.5 text-[11px] uppercase tracking-[0.14em] text-foreground/80 backdrop-blur-md transition-all duration-300 hover:border-foreground/40 hover:text-foreground hover:bg-background/70 sm:inline-block md:px-5 md:tracking-[0.18em]"
            >
              Connexion
            </Link>
            <Link
              to="/estimation"
              className="sheen-on-hover group/cta relative hidden overflow-hidden rounded-full px-5 py-2.5 text-[11px] uppercase tracking-[0.18em] text-background transition-transform duration-300 hover:-translate-y-[1px] md:inline-flex md:items-center"
              style={{
                background:
                  "linear-gradient(180deg, color-mix(in oklch, var(--color-foreground) 88%, white) 0%, var(--color-foreground) 100%)",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.22), 0 8px 22px -10px rgba(20,20,20,0.55), 0 2px 6px -2px rgba(20,20,20,0.35)",
              }}
            >
              <span className="relative z-[1]">Estimer</span>
            </Link>
            <button
              type="button"
              className="grid h-11 w-11 place-items-center rounded-full border border-foreground/15 bg-background/40 backdrop-blur-md transition-all duration-300 hover:bg-foreground/5 hover:border-foreground/30 md:hidden"
              aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((v) => !v)}
            >
              <span className="relative inline-block h-5 w-5">
                <Menu
                  className={`absolute inset-0 h-5 w-5 transition-all duration-300 ${
                    open ? "opacity-0 rotate-90 scale-75" : "opacity-100 rotate-0 scale-100"
                  }`}
                  aria-hidden="true"
                />
                <X
                  className={`absolute inset-0 h-5 w-5 transition-all duration-300 ${
                    open ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-75"
                  }`}
                  aria-hidden="true"
                />
              </span>
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div id="mobile-menu" className="container-narrow mt-2 md:hidden animate-fade-in">
          <div className="liquid-glass liquid-glass-lift rounded-3xl p-2">
            <nav aria-label="Navigation mobile" className="flex flex-col text-sm">
              {nav.map((n, i) => (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setOpen(false)}
                  style={{ animationDelay: `${i * 40}ms` }}
                  className="animate-fade-in rounded-2xl px-4 py-3.5 text-foreground/80 transition-colors hover:bg-foreground/5 hover:text-foreground"
                  activeProps={{ className: "text-primary font-medium bg-foreground/[0.04]" }}
                  activeOptions={{ exact: n.to === "/" }}
                >
                  {n.label}
                </Link>
              ))}
              <Link
                to="/estimation"
                onClick={() => setOpen(false)}
                className="sheen-on-hover mt-2 overflow-hidden rounded-2xl py-3.5 text-center text-xs uppercase tracking-[0.18em] text-background"
                style={{
                  background:
                    "linear-gradient(180deg, color-mix(in oklch, var(--color-foreground) 88%, white) 0%, var(--color-foreground) 100%)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.22), 0 6px 18px -8px rgba(20,20,20,0.5)",
                }}
              >
                Estimer mon bien
              </Link>
              <Link
                to="/auth"
                onClick={() => setOpen(false)}
                className="mt-2 rounded-2xl border border-foreground/15 py-3.5 text-center text-xs uppercase tracking-[0.18em] text-foreground/80 transition-colors hover:bg-foreground hover:text-background"
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
