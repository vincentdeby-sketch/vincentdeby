import { useEffect, useRef } from "react";
import type * as Leaflet from "leaflet";
import { useNavigate } from "@tanstack/react-router";

// Centre approximatif de chaque code postal : la carte situe les biens par commune,
// jamais à l'adresse exacte (confidentialité des vendeurs).
const CENTERS: Record<string, [number, number]> = {
  "75007": [48.856, 2.312],
  "75013": [48.829, 2.362],
  "75015": [48.8412, 2.3003],
  "75016": [48.8637, 2.2769],
  "75116": [48.8637, 2.2769],
  "92100": [48.8356, 2.241],
  "92130": [48.8245, 2.27],
  "92170": [48.8178, 2.2894],
  "92190": [48.8128, 2.2385],
  "92210": [48.844, 2.2195],
  "92310": [48.8241, 2.2086],
  "92370": [48.8086, 2.1886],
};

type Pin = { id: string; price: number; postal_code: string | null; title: string };

function jitter(id: string, n: number) {
  let h = 0;
  for (const c of id + n) h = (h * 31 + c.charCodeAt(0)) | 0;
  return ((h % 1000) / 1000) * 0.008 - 0.004;
}

const short = (p: number) => (p >= 1_000_000 ? `${(p / 1_000_000).toFixed(2).replace(".", ",")} M€` : `${Math.round(p / 1000)} k€`);

export default function PropertyMap({ pins, activeId, onHover }: { pins: Pin[]; activeId: string | null; onHover: (id: string | null) => void }) {
  const box = useRef<HTMLDivElement | null>(null);
  const markers = useRef(new Map<string, Leaflet.Marker>());
  const navigate = useNavigate();

  useEffect(() => {
    let map: Leaflet.Map | null = null;
    let cancelled = false;
    (async () => {
      const L = await import("leaflet");
      if (cancelled || !box.current) return;
      map = L.map(box.current, { zoomControl: true, scrollWheelZoom: false, attributionControl: true });
      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        attribution: "© OpenStreetMap, © CARTO",
        maxZoom: 18,
      }).addTo(map);
      const pts: [number, number][] = [];
      for (const p of pins) {
        const c = p.postal_code ? CENTERS[p.postal_code] : undefined;
        if (!c) continue;
        const ll: [number, number] = [c[0] + jitter(p.id, 1), c[1] + jitter(p.id, 2)];
        pts.push(ll);
        const icon = L.divIcon({ className: "", html: `<span class="map-pin">${short(p.price)}</span>`, iconSize: [0, 0] });
        const m = L.marker(ll, { icon, title: p.title, keyboard: true })
          .on("mouseover", () => onHover(p.id))
          .on("mouseout", () => onHover(null))
          .on("click", () => navigate({ to: "/biens/$id", params: { id: p.id } }))
          .addTo(map);
        markers.current.set(p.id, m);
      }
      if (pts.length) map.fitBounds(L.latLngBounds(pts).pad(0.25), { maxZoom: 14 });
      else map.setView([48.8356, 2.241], 13);
    })();
    return () => {
      cancelled = true;
      markers.current.clear();
      map?.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pins.map((p) => p.id).join(",")]);

  useEffect(() => {
    for (const [id, m] of markers.current) {
      const el = m.getElement()?.querySelector(".map-pin");
      el?.classList.toggle("is-active", id === activeId);
      if (id === activeId) m.setZIndexOffset(1000); else m.setZIndexOffset(0);
    }
  }, [activeId]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-[1.5rem] border border-border">
      <div ref={box} className="h-full w-full" />
      <p className="pointer-events-none absolute bottom-2 left-3 z-[400] rounded-full bg-background/85 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.06em] text-muted-foreground backdrop-blur">
        Position approximative, par commune
      </p>
    </div>
  );
}
