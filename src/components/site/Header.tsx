import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Menu, X, ChevronDown, Phone, Mail, CalendarClock } from "lucide-react";
import portrait from "@/assets/vincent-deby-200.webp";
import { useIsDesktop } from "@/hooks/use-is-desktop";
import { QrLinkDialog } from "./QrLinkDialog";

const CALENDLY_URL = "https://calendly.com/vdeby-efficity/30min";
const PHONE = "+33610022436";
const PHONE_DISPLAY = "+33 6 10 02 24 36";
const EMAIL = "vdeby@efficity.com";

const nav = [
  { to: "/", label: "Accueil" },
  { to: "/videos", label: "Vidéos" },
  { to: "/biens", label: "Nos biens" },
  { to: "/actualites", label: "Actualités" },
  { to: "/estimation", label: "Estimation" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [qr, setQr] = useState<{ url: string; title: string; description?: string } | null>(null);
  const contactRef = useRef<HTMLDivElement | null>(null);
  const isDesktop = useIsDesktop();

  const handleDesktopContact = (
    e: React.MouseEvent<HTMLAnchorElement>,
    target: { url: string; title: string; description?: string },
  ) => {
    if (!isDesktop) return;
    e.preventDefault();
    setContactOpen(false);
    setQr(target);
  };

  useEffect(() => {
    if (!contactOpen) return;
    const onClick = (e: MouseEvent) => {
      if (contactRef.current && !contactRef.current.contains(e.target as Node)) setContactOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setContactOpen(false); };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [contactOpen]);

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
    <header
      className={[
        "sticky top-0 z-40 border-b transition-[background-color,border-color,backdrop-filter] duration-300",
        scrolled
          ? "border-foreground/10 bg-background/60 backdrop-blur-2xl backdrop-saturate-150"
          : "border-transparent bg-background/40 backdrop-blur-xl backdrop-saturate-150",
      ].join(" ")}
    >
      <div className="container-narrow">
        <div className="flex items-center justify-between gap-6 py-3 md:py-4">
          {/* Brand */}
          <Link
            to="/"
            aria-label="Vincent Deby — Accueil"
            className="group/logo flex min-w-0 items-center gap-3 shrink-0"
          >
            <img
              src={portrait}
              alt="Portrait de Vincent Deby"
              width={44}
              height={44}
              loading="eager"
              decoding="async"
              className="h-10 w-10 rounded-full object-cover ring-1 ring-foreground/15 transition-transform duration-300 group-hover/logo:scale-[1.03] sm:h-11 sm:w-11"
            />
            <span className="flex flex-col leading-tight">
              <span className="font-serif text-lg tracking-tight text-foreground md:text-xl">
                Vincent Deby
              </span>
              <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                Conseiller immobilier · Efficity
              </span>
            </span>
          </Link>

          {/* Nav */}
          <nav aria-label="Navigation principale" className="hidden items-center gap-7 text-sm md:flex">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="relative py-1 text-foreground/65 transition-colors duration-200 hover:text-foreground"
                activeProps={{ className: "text-foreground [&_.underline-bar]:scale-x-100" }}
                activeOptions={{ exact: n.to === "/" }}
              >
                {n.label}
                <span
                  aria-hidden="true"
                  className="underline-bar absolute left-0 right-0 -bottom-0.5 h-px origin-left scale-x-0 bg-primary transition-transform duration-300"
                />
              </Link>
            ))}

            {/* Contact dropdown */}
            <div ref={contactRef} className="relative">
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={contactOpen}
                onClick={() => setContactOpen((v) => !v)}
                className="relative flex items-center gap-1 py-1 text-foreground/65 transition-colors duration-200 hover:text-foreground"
              >
                Contact
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${contactOpen ? "rotate-180" : ""}`} aria-hidden="true" />
              </button>
              {contactOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-full mt-3 w-56 border border-foreground/10 bg-background shadow-lg animate-fade-in"
                >
                  <a
                    role="menuitem"
                    href={`tel:${PHONE}`}
                    onClick={(e) => {
                      handleDesktopContact(e, { url: `tel:${PHONE}`, title: "Nous appeler", description: PHONE_DISPLAY });
                      setContactOpen(false);
                    }}
                    className="flex items-center gap-3 border-b border-foreground/5 px-4 py-3 text-sm text-foreground/80 transition-colors hover:bg-foreground/5 hover:text-foreground"
                  >
                    <Phone className="h-4 w-4" aria-hidden="true" />
                    Nous appeler
                  </a>
                  <a
                    role="menuitem"
                    href={`mailto:${EMAIL}`}
                    onClick={(e) => {
                      handleDesktopContact(e, { url: `mailto:${EMAIL}`, title: "Nous écrire", description: EMAIL });
                      setContactOpen(false);
                    }}
                    className="flex items-center gap-3 border-b border-foreground/5 px-4 py-3 text-sm text-foreground/80 transition-colors hover:bg-foreground/5 hover:text-foreground"
                  >
                    <Mail className="h-4 w-4" aria-hidden="true" />
                    Nous écrire
                  </a>
                  <a
                    role="menuitem"
                    href={CALENDLY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      handleDesktopContact(e, { url: CALENDLY_URL, title: "Prendre rendez-vous", description: "Calendly" });
                      setContactOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-foreground/80 transition-colors hover:bg-foreground/5 hover:text-foreground"
                  >
                    <CalendarClock className="h-4 w-4" aria-hidden="true" />
                    Prendre rendez-vous
                  </a>
                </div>
              )}
            </div>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/auth"
              className="hidden text-[11px] uppercase tracking-[0.2em] text-foreground/70 transition-colors hover:text-foreground sm:inline-block"
            >
              Connexion
            </Link>
            <Link
              to="/estimation"
              className="hidden bg-foreground px-5 py-2.5 text-[11px] uppercase tracking-[0.2em] text-background transition-colors duration-200 hover:bg-primary md:inline-block"
            >
              Estimer
            </Link>
            <button
              type="button"
              className="grid h-10 w-10 place-items-center border border-foreground/20 transition-colors hover:bg-foreground/5 md:hidden"
              aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((v) => !v)}
            >
              <span className="relative inline-block h-5 w-5">
                <Menu
                  className={`absolute inset-0 h-5 w-5 transition-all duration-300 ${
                    open ? "opacity-0 rotate-90" : "opacity-100 rotate-0"
                  }`}
                  aria-hidden="true"
                />
                <X
                  className={`absolute inset-0 h-5 w-5 transition-all duration-300 ${
                    open ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"
                  }`}
                  aria-hidden="true"
                />
              </span>
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div id="mobile-menu" className="border-t border-foreground/10 bg-background/60 backdrop-blur-2xl backdrop-saturate-150 md:hidden animate-fade-in">
          <nav aria-label="Navigation mobile" className="container-narrow flex flex-col py-3 text-sm">
            {nav.map((n, i) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                style={{ animationDelay: `${i * 30}ms` }}
                className="animate-fade-in border-b border-foreground/5 py-3.5 text-foreground/80 transition-colors hover:text-foreground"
                activeProps={{ className: "text-primary font-medium" }}
                activeOptions={{ exact: n.to === "/" }}
              >
                {n.label}
              </Link>
            ))}
            <div className="mt-4 border-t border-foreground/5 pt-3">
              <div className="px-1 py-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Contact</div>
              <a
                href={`tel:${PHONE}`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 border-b border-foreground/5 py-3.5 text-foreground/80 transition-colors hover:text-foreground"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                Nous appeler
              </a>
              <a
                href={`mailto:${EMAIL}`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 border-b border-foreground/5 py-3.5 text-foreground/80 transition-colors hover:text-foreground"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                Nous écrire
              </a>
              <a
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 py-3.5 text-foreground/80 transition-colors hover:text-foreground"
              >
                <CalendarClock className="h-4 w-4" aria-hidden="true" />
                Prendre rendez-vous
              </a>
            </div>
            <div className="mt-5 flex flex-col gap-2">
              <Link
                to="/estimation"
                onClick={() => setOpen(false)}
                className="bg-foreground py-3.5 text-center text-xs uppercase tracking-[0.2em] text-background"
              >
                Estimer mon bien
              </Link>
              <Link
                to="/auth"
                onClick={() => setOpen(false)}
                className="border border-foreground/20 py-3.5 text-center text-xs uppercase tracking-[0.2em] text-foreground/80"
              >
                Connexion
              </Link>
            </div>
          </nav>
        </div>
      )}
      <QrLinkDialog
        open={!!qr}
        onClose={() => setQr(null)}
        url={qr?.url ?? ""}
        title={qr?.title ?? ""}
        description={qr?.description}
      />
    </header>
  );
}
