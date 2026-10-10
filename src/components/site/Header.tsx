import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Phone, ArrowUpRight } from "lucide-react";
import portrait from "@/assets/vincent-deby-200.webp";
import { useIsDesktop } from "@/hooks/use-is-desktop";
import { QrLinkDialog } from "./QrLinkDialog";

const CALENDLY_URL = "https://calendly.com/vdeby-efficity/rdv-estimation-immobiliere";
const PHONE = "+33610022436";
const PHONE_DISPLAY = "06 10 02 24 36";
const EMAIL = "vdeby@efficity.com";

const nav = [
  { to: "/", label: "Accueil" },
  { to: "/biens", label: "Biens" },
  { to: "/actualites", label: "Journal" },
  { to: "/videos", label: "Vidéos" },
  { to: "/contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [qr, setQr] = useState<{ url: string; title: string; description?: string } | null>(null);
  const isDesktop = useIsDesktop();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
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

  // Sur ordinateur, un lien tel: ne mène nulle part : on affiche un QR code à scanner.
  const onPhoneClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isDesktop) return;
    e.preventDefault();
    setQr({ url: `tel:${PHONE}`, title: "Appeler Vincent Deby", description: PHONE_DISPLAY });
  };

  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-5 sm:pt-4">
      <div
        className={[
          "mx-auto flex max-w-[76rem] items-center justify-between gap-3 rounded-full border py-2 pl-2 pr-2 transition-[background-color,border-color,box-shadow] duration-300 sm:pr-2.5",
          scrolled || open
            ? "border-foreground/10 bg-background/80 shadow-[0_12px_32px_-20px_rgb(18_20_17/0.35)] backdrop-blur-xl backdrop-saturate-150"
            : "border-transparent bg-transparent",
        ].join(" ")}
      >
        <Link to="/" aria-label="Vincent Deby, accueil" className="group flex min-w-0 items-center gap-2.5 rounded-full pr-2">
          <img
            src={portrait}
            alt=""
            width={40}
            height={40}
            loading="eager"
            decoding="async"
            className="h-10 w-10 shrink-0 rounded-full object-cover"
          />
          <span className="flex min-w-0 flex-col leading-none">
            <span className="font-serif text-[1.15rem] tracking-tight">Vincent Deby</span>
            <span className="mt-1 truncate font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
              Conseiller Efficity
            </span>
          </span>
        </Link>

        <nav aria-label="Navigation principale" className="hidden items-center gap-1 lg:flex">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="relative rounded-full px-3.5 py-2 text-[0.92rem] text-foreground/70 transition-colors hover:bg-foreground/5 hover:text-foreground"
              activeProps={{ className: "!text-foreground" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {({ isActive }: { isActive: boolean }) => (
                <>
                  {n.label}
                  {isActive && (
                    <span aria-hidden="true" className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-brand" />
                  )}
                </>
              )}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <a
            href={`tel:${PHONE}`}
            onClick={onPhoneClick}
            aria-label={`Appeler Vincent Deby au ${PHONE_DISPLAY}`}
            className="grid h-11 w-11 place-items-center rounded-full border border-foreground/15 transition-colors hover:border-foreground xl:flex xl:w-auto xl:gap-2 xl:px-4 xl:text-sm"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            <span className="hidden tabular-nums xl:inline">{PHONE_DISPLAY}</span>
          </a>
          <Link to="/estimation" className="group btn btn-primary hidden !min-h-11 !py-2 sm:inline-flex">
            Estimer mon bien
            <span className="btn-arrow" aria-hidden="true"><ArrowUpRight className="h-3.5 w-3.5" /></span>
          </Link>
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-full bg-foreground text-background lg:hidden"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {open && (
        <div
          id="mobile-menu"
          className="fixed inset-x-3 bottom-3 top-[4.75rem] z-40 flex flex-col overflow-y-auto rounded-[1.75rem] border border-foreground/10 bg-background p-6 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200 sm:inset-x-5 lg:hidden"
        >
          <nav aria-label="Navigation mobile" className="flex flex-col">
            {[...nav, { to: "/estimation", label: "Estimation" }].map((n, i) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="flex items-baseline justify-between border-b border-foreground/10 py-4 font-serif text-[2rem] leading-none tracking-tight"
                activeProps={{ className: "text-brand-ink" }}
                activeOptions={{ exact: n.to === "/" }}
              >
                {n.label}
                <span className="font-mono text-xs text-muted-foreground">0{i + 1}</span>
              </Link>
            ))}
          </nav>
          <div className="mt-auto grid gap-2 pt-8">
            <Link to="/estimation" onClick={() => setOpen(false)} className="group btn btn-primary">
              Estimer mon bien
              <span className="btn-arrow" aria-hidden="true"><ArrowUpRight className="h-3.5 w-3.5" /></span>
            </Link>
            <div className="grid grid-cols-2 gap-2">
              <a href={`tel:${PHONE}`} className="btn btn-ghost">Appeler</a>
              <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">Rendez-vous</a>
            </div>
            <a href={`mailto:${EMAIL}`} className="mt-2 text-center text-sm text-muted-foreground">{EMAIL}</a>
          </div>
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
