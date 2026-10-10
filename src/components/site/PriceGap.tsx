import { Link } from "@tanstack/react-router";
import { useId, useState } from "react";
import { ArrowRight } from "lucide-react";
import { formatEUR } from "@/lib/domain";
import type { EfficityPrices } from "@/lib/efficity-parse";

// Outil « le piège des moyennes » : multiplie la surface par les prix au m² bas et haut
// publiés par Efficity, pour montrer l'écart qu'une moyenne laisse ouvert.
export function PriceGap({ prices }: { prices: EfficityPrices }) {
  const [surface, setSurface] = useState(60);
  const id = useId();
  const low = surface * prices.low;
  const mid = surface * prices.mid;
  const high = surface * prices.high;
  const midPos = ((prices.mid - prices.low) / (prices.high - prices.low)) * 100;

  return (
    <div className="grid gap-10 rounded-[2rem] border border-border bg-card p-6 sm:p-8 md:p-12 lg:grid-cols-12 lg:gap-12">
      <div className="lg:col-span-5">
        <p className="eyebrow">Le piège des moyennes</p>
        <h2 className="mt-5 !text-[clamp(1.9rem,3.2vw,3rem)]">
          La moyenne du quartier <em className="text-brand-ink">ne dit pas</em> le prix de votre bien.
        </h2>
        <p className="mt-5 text-muted-foreground">
          Indiquez la surface de votre bien. Vous verrez l'écart que laissent les prix moyens publiés à{" "}
          {prices.city}. Ce qui le resserre : les ventes comparables, adresse par adresse.
        </p>
      </div>

      <div className="lg:col-span-7">
        <div className="flex items-end justify-between gap-4">
          <label htmlFor={id} className="text-sm font-medium">Surface de votre bien</label>
          <p className="font-serif text-4xl tabular-nums">
            {surface}
            <span className="ml-1 text-xl text-muted-foreground">m²</span>
          </p>
        </div>
        <input
          id={id}
          type="range"
          min={15}
          max={200}
          step={1}
          value={surface}
          onChange={(e) => setSurface(Number(e.target.value))}
          className="range mt-4 w-full"
          style={{ ["--fill" as string]: `${((surface - 15) / 185) * 100}%` }}
        />

        <div className="mt-10">
          <div className="relative h-3 rounded-full bg-[linear-gradient(90deg,var(--color-brand-soft),var(--color-brand),var(--color-brand-ink))]">
            <span className="absolute top-1/2 h-6 w-1 -translate-y-1/2 rounded-full bg-ink" style={{ left: `${midPos}%` }} aria-hidden="true" />
          </div>
          <dl className="mt-4 grid grid-cols-3 gap-2 text-sm">
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">Bas</dt>
              <dd className="mt-1 font-serif text-xl tabular-nums sm:text-2xl">{formatEUR(low)}</dd>
            </div>
            <div className="text-center">
              <dt className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">Moyen</dt>
              <dd className="mt-1 font-serif text-xl tabular-nums sm:text-2xl">{formatEUR(mid)}</dd>
            </div>
            <div className="text-right">
              <dt className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">Haut</dt>
              <dd className="mt-1 font-serif text-xl tabular-nums sm:text-2xl">{formatEUR(high)}</dd>
            </div>
          </dl>
        </div>

        <div className="mt-8 flex flex-col gap-5 rounded-2xl bg-ink p-5 text-paper sm:flex-row sm:items-center sm:justify-between md:p-6">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-paper/60">Écart entre le bas et le haut</p>
            <p className="mt-1 font-serif text-3xl tabular-nums text-brand" aria-live="polite">{formatEUR(high - low)}</p>
          </div>
          <Link to="/estimation" className="group btn btn-brand shrink-0">
            Trouver mon prix juste
            <span className="btn-arrow !bg-ink !text-brand" aria-hidden="true"><ArrowRight className="h-3.5 w-3.5" /></span>
          </Link>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
          Prix au m² publiés par Efficity pour {prices.city}{prices.month ? `, ${prices.month.toLowerCase()}` : ""} : bas{" "}
          {formatEUR(prices.low)}, moyen {formatEUR(prices.mid)}, haut {formatEUR(prices.high)}. Simple multiplication,
          ce n'est pas une estimation.
        </p>
      </div>
    </div>
  );
}
