import { useEffect, useRef, useState } from "react";
import { ChevronDown, Phone, Mail, CalendarClock } from "lucide-react";

const CALENDLY_URL = "https://calendly.com/vdeby-efficity/30min";
const PHONE = "+33610022436";
const EMAIL = "vdeby@efficity.com";

type Props = {
  label?: string;
  variant?: "solid" | "outline";
  align?: "left" | "right" | "center";
  className?: string;
};

export function ContactMenu({
  label = "Me contacter",
  variant = "solid",
  align = "left",
  className = "",
}: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const btn =
    variant === "solid"
      ? "bg-foreground text-background hover:bg-primary"
      : "border border-foreground/30 text-foreground hover:bg-foreground/5";

  const menuPos =
    align === "right" ? "right-0" : align === "center" ? "left-1/2 -translate-x-1/2" : "left-0";

  return (
    <div ref={ref} className={`relative inline-block ${className}`}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`flex w-full items-center justify-center gap-2 px-6 py-3.5 text-xs uppercase tracking-widest transition-colors ${btn}`}
      >
        {label}
        <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>
      {open && (
        <div
          role="menu"
          className={`absolute top-full z-30 mt-2 w-60 border border-foreground/10 bg-background shadow-lg animate-fade-in ${menuPos}`}
        >
          <a
            role="menuitem"
            href={`tel:${PHONE}`}
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 border-b border-foreground/5 px-4 py-3 text-sm text-foreground/80 transition-colors hover:bg-foreground/5 hover:text-foreground"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            Nous appeler
          </a>
          <a
            role="menuitem"
            href={`mailto:${EMAIL}`}
            onClick={() => setOpen(false)}
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
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-sm text-foreground/80 transition-colors hover:bg-foreground/5 hover:text-foreground"
          >
            <CalendarClock className="h-4 w-4" aria-hidden="true" />
            Prendre rendez-vous
          </a>
        </div>
      )}
    </div>
  );
}
