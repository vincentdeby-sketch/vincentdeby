import { lazy, Suspense, useEffect, useState } from "react";

const MapView = lazy(() => import("./MapView.client"));

export function LazyMap({ lat, lng, className }: { lat: number; lng: number; className?: string }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) {
    return <div className={className ?? "h-[320px] w-full bg-muted"} aria-hidden />;
  }
  return (
    <Suspense fallback={<div className={className ?? "h-[320px] w-full bg-muted"} />}>
      <MapView lat={lat} lng={lng} className={className} />
    </Suspense>
  );
}
