import { useEffect, useRef } from "react";
import type * as Leaflet from "leaflet";

const TILE_LAYER_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

export default function MapView({
  lat,
  lng,
  className,
}: {
  lat: number;
  lng: number;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Leaflet.Map | null>(null);
  const markerRef = useRef<Leaflet.Marker | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function initMap() {
      if (!containerRef.current || mapRef.current) return;
      const L = await import("leaflet");
      if (cancelled || !containerRef.current) return;

      const markerIcon = L.divIcon({
        className: "estate-map-marker",
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const map = L.map(containerRef.current, {
        zoomControl: true,
        scrollWheelZoom: false,
      }).setView([lat, lng], 15);

      L.tileLayer(TILE_LAYER_URL, {
        attribution: "© OpenStreetMap",
        maxZoom: 19,
      }).addTo(map);

      markerRef.current = L.marker([lat, lng], { icon: markerIcon }).addTo(map);
      mapRef.current = map;
    }

    void initMap();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!mapRef.current || !markerRef.current) return;
    mapRef.current.setView([lat, lng], 15);
    markerRef.current.setLatLng([lat, lng]);
  }, [lat, lng]);

  return <div ref={containerRef} className={className ?? "h-[320px] w-full"} />;
}
