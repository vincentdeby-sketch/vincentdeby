import { useEffect, useId, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import { searchAddress, type AddressSuggestion } from "@/lib/address";

// Champ d'adresse avec suggestions de la Base Adresse Nationale (clavier : flèches, Entrée, Échap).
export function AddressField({
  value,
  onSelect,
  placeholder = "Adresse du bien",
}: {
  value: AddressSuggestion | null;
  onSelect: (a: AddressSuggestion | null) => void;
  placeholder?: string;
}) {
  const [q, setQ] = useState(value?.label ?? "");
  const [results, setResults] = useState<AddressSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const listId = useId();

  useEffect(() => {
    if (q.trim().length < 3 || q === value?.label) { setResults([]); return; }
    const t = setTimeout(async () => {
      setResults(await searchAddress(q));
      setActive(0);
      setOpen(true);
    }, 250);
    return () => clearTimeout(t);
  }, [q, value?.label]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const pick = (r: AddressSuggestion) => {
    onSelect(r);
    setQ(r.label);
    setOpen(false);
  };

  return (
    <div ref={boxRef} className="relative">
      <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-ink" aria-hidden="true" />
      <input
        type="text"
        value={q}
        onChange={(e) => { setQ(e.target.value); if (value) onSelect(null); }}
        onFocus={() => results.length && setOpen(true)}
        onKeyDown={(e) => {
          if (!open || !results.length) return;
          if (e.key === "ArrowDown") { e.preventDefault(); setActive((i) => Math.min(i + 1, results.length - 1)); }
          if (e.key === "ArrowUp") { e.preventDefault(); setActive((i) => Math.max(i - 1, 0)); }
          if (e.key === "Enter") { e.preventDefault(); pick(results[active]); }
          if (e.key === "Escape") setOpen(false);
        }}
        placeholder={placeholder}
        aria-label={placeholder}
        aria-autocomplete="list"
        aria-expanded={open && results.length > 0}
        aria-controls={listId}
        autoComplete="off"
        className="field !pl-11"
      />
      {open && results.length > 0 && (
        <ul id={listId} role="listbox" className="absolute inset-x-0 top-full z-20 mt-2 overflow-hidden rounded-2xl border border-border bg-card p-1.5 shadow-[0_24px_48px_-24px_rgb(18_20_17/0.45)]">
          {results.map((r, i) => (
            <li key={r.id} role="option" aria-selected={i === active}>
              <button
                type="button"
                onMouseEnter={() => setActive(i)}
                onClick={() => pick(r)}
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
