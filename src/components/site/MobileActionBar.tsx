import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Phone } from "lucide-react";

const PHONE = "+33610022436";

// Barre d'action fixe sur mobile : apparaît après le premier écran, se cache sur les formulaires.
export function MobileActionBar({ hidden = false }: { hidden?: boolean }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (hidden) return null;

  return (
    <div
      className={[
        "fixed inset-x-3 bottom-3 z-30 flex gap-2 rounded-full border border-foreground/10 bg-background/85 p-1.5 shadow-[0_16px_40px_-16px_rgb(18_20_17/0.45)] backdrop-blur-xl transition-all duration-300 md:hidden",
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0",
      ].join(" ")}
    >
      <a href={`tel:${PHONE}`} className="btn btn-ghost !min-h-11 flex-1 !border-foreground/15">
        <Phone className="h-4 w-4" aria-hidden="true" /> Appeler
      </a>
      <Link to="/estimation" className="btn btn-primary !min-h-11 flex-[1.4]">
        Estimer mon bien
      </Link>
    </div>
  );
}
