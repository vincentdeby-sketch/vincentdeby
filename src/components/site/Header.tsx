import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

const nav = [
  { to: "/", label: "Accueil" },
  { to: "/biens", label: "Nos biens" },
  { to: "/actualites", label: "Actualités" },
  { to: "/estimation", label: "Estimation" },
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
    <header
      className={`sticky top-0 z-40 transition-colors ${
        scrolled ? "border-b border-border/60 bg-background/85 backdrop-blur" : "bg-transparent"
      }`}
    >
      <div className="container-narrow flex h-20 items-center justify-between">
        <Link to="/" className="font-serif text-xl tracking-tight">
          Maison <span className="text-primary">&amp;</span> Associés
        </Link>
        <nav className="hidden items-center gap-10 text-sm md:flex">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-foreground/70 transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <Link
            to="/estimation"
            className="hidden rounded-none border border-foreground px-5 py-2.5 text-xs uppercase tracking-widest transition-colors hover:bg-foreground hover:text-background md:inline-block"
          >
            Estimer mon bien
          </Link>
          <button
            className="md:hidden"
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
          >
            <div className="flex flex-col gap-1.5">
              <span className="h-px w-6 bg-foreground" />
              <span className="h-px w-6 bg-foreground" />
            </div>
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="container-narrow flex flex-col py-4 text-sm">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="py-3 text-foreground/80"
              >
                {n.label}
              </Link>
            ))}
            <Link
              to="/estimation"
              onClick={() => setOpen(false)}
              className="mt-2 border border-foreground py-3 text-center text-xs uppercase tracking-widest"
            >
              Estimer mon bien
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
