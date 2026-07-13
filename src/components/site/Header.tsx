import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

const nav = [
  { to: "/", label: "Accueil" },
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
  return (
    <header className="sticky top-0 z-40 pt-3 md:pt-4">
      <div className="container-narrow">
        <div
          className={`relative flex items-center justify-between gap-6 rounded-full border px-3 py-2 pl-5 md:pl-6 transition-all duration-300 ${
            scrolled
              ? "border-white/40 bg-background/55 shadow-[0_8px_32px_-12px_rgba(20,20,20,0.18)]"
              : "border-white/30 bg-background/35 shadow-[0_4px_24px_-16px_rgba(20,20,20,0.12)]"
          }`}
          style={{
            backdropFilter: "blur(20px) saturate(180%)",
          }}
        >
          {/* Logo — brand block */}
          <Link to="/" className="flex min-w-0 items-center gap-3 shrink-0">
            <span className="font-serif text-lg leading-none md:text-xl">Vincent Deby</span>
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
          <nav className="hidden items-center gap-1 text-sm md:flex">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="rounded-full px-3 py-2 text-foreground/70 transition-colors hover:bg-foreground/5 hover:text-foreground"
                activeProps={{ className: "rounded-full px-3 py-2 bg-foreground text-background hover:bg-foreground hover:text-background" }}
                activeOptions={{ exact: n.to === "/" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          {/* Actions — right */}
          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/estimation"
              className="hidden rounded-full bg-foreground px-5 py-2.5 text-[11px] uppercase tracking-[0.18em] text-background transition-opacity hover:opacity-90 md:inline-block"
            >
              Estimer
            </Link>
            <button
              className="grid h-10 w-10 place-items-center rounded-full border border-foreground/15 md:hidden"
              aria-label="Menu"
              onClick={() => setOpen((v) => !v)}
            >
              <div className="flex flex-col gap-1.5">
                <span className="h-px w-5 bg-foreground" />
                <span className="h-px w-5 bg-foreground" />
              </div>
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="container-narrow mt-2 md:hidden">
          <div
            className="rounded-3xl border border-white/40 bg-background/70 p-2"
            style={{ backdropFilter: "blur(20px) saturate(180%)" }}
          >
            <nav className="flex flex-col text-sm">
              {nav.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setOpen(false)}
                  className="rounded-2xl px-4 py-3 text-foreground/80 hover:bg-foreground/5"
                >
                  {n.label}
                </Link>
              ))}
              <Link
                to="/estimation"
                onClick={() => setOpen(false)}
                className="mt-2 rounded-2xl bg-foreground py-3 text-center text-xs uppercase tracking-[0.18em] text-background"
              >
                Estimer mon bien
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
