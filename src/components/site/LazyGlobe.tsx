import { lazy, Suspense, useEffect, useState } from "react";

const Globe = lazy(() => import("./Globe"));

export function LazyGlobe({
  lat,
  lng,
  className,
}: {
  lat: number;
  lng: number;
  className?: string;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) {
    return <div className={className ?? "aspect-square w-full"} aria-hidden />;
  }
  return (
    <Suspense fallback={<div className={className ?? "aspect-square w-full"} />}>
      <Globe lat={lat} lng={lng} className={className} />
    </Suspense>
  );
}
