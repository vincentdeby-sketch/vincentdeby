import { useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, MapPin } from "lucide-react";
import { searchAddress, type AddressSuggestion } from "@/lib/address";
import { saveDraftAddress } from "@/lib/estimation-draft";
import { Magnetic } from "@/components/motion/Magnetic";

// Point d'entrée de l'estimation dès l'accueil : l'adresse choisie ici pré-remplit le formulaire.
export function HeroAddress() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [results, setResults] = useState<AddressSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const boxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (q.trim().length < 3) { setResults([]); return; }
    const t = setTimeout(async () => {
      const r = await searchAddress(q);
      setResults(r);
      setActive(-1);
      setOpen(true);
    }, 250);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const go = (r?: AddressSuggestion) => {
    if (r) {
      saveDraftAddress({ display: r.label, lat: r.lat, lng: r.lng, postcode: r.postcode, city: r.city });
      navigate({ to: "/estimation", search: { depart: "accueil" } as never });
    } else {
      navigate({ to: "/estimation" });
    }
  };

  return (
    <div ref={boxRef} className="relative max-w-xl">
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          go(results[active >= 0 ? active : 0]);
        }}
        className="flex items-center gap-2 rounded-full border border-foreground/15 bg-card p-1.5 pl-5 shadow-[0_20px_50px_-30px_rgb(18_20_17/0.45)] transition-shadow focus-within:border-foreground focus-within:shadow-[0_0_0_4px_rgb(78_174_50/0.2)]"
      >
        <MapPin className="h-5 w-5 shrink-0 text-brand-ink" aria-hidden="true" />
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => results.length && setOpen(true)}
          onKeyDown={(e) => {
            if (!open || !results.length) return;
            if (e.key === "ArrowDown") { e.preventDefault(); setActive((i) => Math.min(i + 1, results.length - 1)); }
            if (e.key === "ArrowUp") { e.preventDefault(); setActive((i) => Math.max(i - 1, 0)); }
            if (e.key === "Escape") setOpen(false);
          }}
          placeholder="Adresse de votre bien"
          aria-label="Adresse du bien à estimer"
          aria-autocomplete="list"
          aria-expanded={open && results.length > 0}
          aria-controls="hero-address-list"
          autoComplete="off"
          className="w-0 min-w-0 flex-1 bg-transparent py-2.5 text-base outline-none placeholder:text-muted-foreground"
        />
        <Magnetic strength={0.18}>
        <button type="submit" className="group btn btn-primary !min-h-11 shrink-0 !px-4 sm:!px-5">
          <span className="hidden sm:inline">Estimer</span>
          <span className="btn-arrow !mr-0 sm:!-mr-2" aria-hidden="true"><ArrowRight className="h-3.5 w-3.5" /></span>
          <span className="sr-only sm:hidden">Estimer</span>
        </button>
        </Magnetic>
      </form>
      {open && results.length > 0 && (
        <ul
          id="hero-address-list"
          role="listbox"
          className="absolute inset-x-0 top-full z-20 mt-2 overflow-hidden rounded-2xl border border-border bg-card p-1.5 shadow-[0_24px_48px_-24px_rgb(18_20_17/0.45)]"
        >
          {results.map((r, i) => (
            <li key={r.id} role="option" aria-selected={i === active}>
              <button
                type="button"
                onMouseEnter={() => setActive(i)}
                onClick={() => go(r)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm ${i === active ? "bg-muted" : ""}`}
              >
                <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                {r.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
