import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowRight, Building2, Home as HomeIcon, Loader2 } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { PageHeader } from "@/components/site/PageHeader";
import { AddressField } from "@/components/site/AddressField";
import { CountUp } from "@/components/site/CountUp";
import { formatDate, formatEUR } from "@/lib/domain";
import { getNearbySales } from "@/lib/dvf";
import type { AddressSuggestion } from "@/lib/address";
import { saveDraftAddress } from "@/lib/estimation-draft";
import { trackLead } from "@/lib/tracking";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/ventes-autour-de-chez-moi")({
  head: () => ({
    meta: [
      { title: "Les ventes réelles autour de chez vous | Vincent Deby" },
      { name: "description", content: "Entrez votre adresse : voyez les ventes réelles de biens comparables autour de chez vous, d'après les données publiques DVF. Gratuit, immédiat, sans inscription." },
      { property: "og:url", content: `${SITE}/ventes-autour-de-chez-moi` },
    ],
    links: [{ rel: "canonical", href: `${SITE}/ventes-autour-de-chez-moi` }],
  }),
  component: Tool,
});

type Kind = "Appartement" | "Maison";

function Tool() {
  const navigate = useNavigate();
  const [address, setAddress] = useState<AddressSuggestion | null>(null);
  const [kind, setKind] = useState<Kind>("Appartement");
  const [surface, setSurface] = useState("");
  const search = useMutation({
    mutationFn: () =>
      getNearbySales({
        data: { citycode: address!.citycode!, lat: address!.lat, lng: address!.lng, type: kind, surface: Number(surface) },
      }),
    onSuccess: () => trackLead("ventes-autour"),
  });
  const ready = !!address?.citycode && Number(surface) >= 9;
  const res = search.data;
  const s = Number(surface);

  const toEstimation = () => {
    if (address) saveDraftAddress({ display: address.label, lat: address.lat, lng: address.lng, postcode: address.postcode, city: address.city });
    navigate({ to: "/estimation", search: { depart: "accueil" } as never });
  };

  return (
    <SiteShell>
      <PageHeader
        eyebrow="Outil gratuit · données publiques"
        title={<>Les ventes réelles <em className="text-brand-ink">autour de chez vous.</em></>}
        lede="Les prix réellement signés chez le notaire pour des biens comparables au vôtre, à quelques rues. C'est avec ces ventes que je construis une estimation."
      />

      <section className="container-narrow mt-10 md:mt-14">
        <form
          onSubmit={(e) => { e.preventDefault(); if (ready) search.mutate(); }}
          className="surface grid gap-4 p-5 sm:p-7 md:grid-cols-12 md:items-end"
        >
          <div className="md:col-span-6">
            <p className="mb-2 text-sm font-medium">Adresse</p>
            <AddressField value={address} onSelect={setAddress} />
          </div>
          <div className="md:col-span-3">
            <p className="mb-2 text-sm font-medium">Type de bien</p>
            <div className="grid grid-cols-2 gap-2">
              {([["Appartement", Building2], ["Maison", HomeIcon]] as const).map(([k, Icon]) => (
                <button key={k} type="button" aria-pressed={kind === k} onClick={() => setKind(k)} className="choice flex min-h-12 items-center justify-center gap-2 !p-2 text-sm">
                  <Icon className="h-4 w-4" aria-hidden="true" /> {k}
                </button>
              ))}
            </div>
          </div>
          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm font-medium">Surface (m²)</span>
            <input type="number" inputMode="numeric" min={9} value={surface} onChange={(e) => setSurface(e.target.value)} className="field" placeholder="60" />
          </label>
          <button type="submit" disabled={!ready || search.isPending} className="group btn btn-primary md:col-span-1 md:!px-0">
            {search.isPending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <ArrowRight className="h-4 w-4" aria-hidden="true" />}
            <span className="md:sr-only">Voir les ventes</span>
          </button>
        </form>
        {search.isError && (
          <p role="alert" className="mt-4 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm">
            Les données de ventes n'ont pas pu être chargées. Réessayez dans un instant.
          </p>
        )}
      </section>

      {search.isPending && (
        <section className="container-narrow mt-10 grid gap-3" aria-hidden="true">
          {Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-16 rounded-2xl" />)}
        </section>
      )}

      {res && (
        <section className="container-narrow mt-10 animate-in fade-in slide-in-from-bottom-2 duration-500" aria-live="polite">
          {res.perM2 ? (
            <div className="grid gap-4 lg:grid-cols-12">
              <div className="rounded-[1.75rem] bg-ink p-7 text-paper lg:col-span-5">
                <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-paper/60">
                  {res.sales.length} ventes comparables · rayon de {res.radius} m
                </p>
                <p className="mt-6 text-sm text-paper/70">Prix médian au m² de ces ventes</p>
                <p className="mt-1 font-serif text-5xl text-brand"><CountUp value={res.perM2.median} format={formatEUR} /></p>
                <p className="mt-6 text-sm text-paper/70">Appliqué à {s} m², la moitié de ces ventes donnerait entre</p>
                <p className="mt-1 font-serif text-2xl tabular-nums">
                  {formatEUR(Math.round((res.perM2.p25 * s) / 1000) * 1000)} et {formatEUR(Math.round((res.perM2.p75 * s) / 1000) * 1000)}
                </p>
                <p className="mt-6 text-xs leading-relaxed text-paper/55">
                  Indication brute, pas une estimation : l'étage, l'état, la vue ou l'extérieur font bouger le prix,
                  parfois de plusieurs dizaines de milliers d'euros.
                </p>
                <button type="button" onClick={toEstimation} className="group btn btn-brand mt-7 w-full">
                  Recevoir mon prix juste
                  <span className="btn-arrow !bg-ink !text-brand" aria-hidden="true"><ArrowRight className="h-3.5 w-3.5" /></span>
                </button>
              </div>
              <div className="lg:col-span-7">
                <ul className="divide-y divide-border overflow-hidden rounded-[1.75rem] border border-border bg-card">
                  {res.sales.map((v, i) => (
                    <li key={i} className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 px-5 py-4 animate-in fade-in slide-in-from-bottom-1" style={{ animationDelay: `${i * 40}ms`, animationFillMode: "both" }}>
                      <span className="font-medium">{v.address}</span>
                      <span className="text-right font-serif text-lg tabular-nums">{formatEUR(v.price)}</span>
                      <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-muted-foreground">
                        {formatDate(v.date)} · {Math.round(v.surface)} m²{v.rooms ? ` · ${v.rooms} p.` : ""} · à {v.distance} m
                      </span>
                      <span className="text-right text-sm text-muted-foreground tabular-nums">{formatEUR(v.pricePerM2)}/m²</span>
                    </li>
                  ))}
                </ul>
                {res.period && (
                  <p className="mt-3 text-xs text-muted-foreground">
                    Source : DVF (data.gouv.fr), ventes du {formatDate(res.period.from)} au {formatDate(res.period.to)}.
                    Les ventes récentes apparaissent avec plusieurs mois de décalage.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="surface p-8">
              <p className="font-serif text-2xl">Pas assez de ventes comparables publiées à proximité.</p>
              <p className="mt-3 text-muted-foreground">
                C'est justement le cas où une visite fait la différence. Je regarde votre bien et je vous donne un prix argumenté.
              </p>
              <button type="button" onClick={toEstimation} className="btn btn-primary mt-6">Demander une estimation</button>
            </div>
          )}
        </section>
      )}

      <section className="container-narrow mt-16">
        <p className="text-sm text-muted-foreground">
          Envie d'une vue d'ensemble ?{" "}
          <Link to="/secteurs/$slug" params={{ slug: "boulogne-billancourt" }} className="text-foreground underline decoration-brand decoration-2 underline-offset-4">
            Le marché à Boulogne-Billancourt
          </Link>
        </p>
      </section>
    </SiteShell>
  );
}
