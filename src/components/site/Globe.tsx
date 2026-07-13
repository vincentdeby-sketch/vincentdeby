import { useEffect, useRef } from "react";
import createGlobe from "cobe";

export default function Globe({
  lat,
  lng,
  className,
}: {
  lat: number;
  lng: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const phiRef = useRef(0);
  const targetPhiRef = useRef(0);

  useEffect(() => {
    // Cobe: phi is horizontal rotation (radians). Center marker at front:
    // phi = -lng * PI/180 puts longitude 0 at front; adjust so marker lands center.
    targetPhiRef.current = -(lng * Math.PI) / 180;
  }, [lng]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const size = canvas.clientWidth || 400;
    let width = size;

    const theta = (lat * Math.PI) / 180;

    const globe = createGlobe(canvas, {
      devicePixelRatio: 2,
      width: size * 2,
      height: size * 2,
      phi: targetPhiRef.current,
      theta: theta * 0.6,
      dark: 0,
      diffuse: 1.15,
      mapSamples: 18000,
      mapBrightness: 5.5,
      baseColor: [0.92, 0.9, 0.85], // sand
      markerColor: [0.16, 0.29, 0.24], // bottle green
      glowColor: [0.9, 0.86, 0.78],
      markers: [{ location: [lat, lng], size: 0.08 }],
      onRender: (state) => {
        // Smooth interpolate phi toward target while drifting slowly
        phiRef.current += (targetPhiRef.current - phiRef.current) * 0.06;
        // Add subtle continuous rotation for life
        targetPhiRef.current += 0.0015;
        state.phi = phiRef.current;
        state.width = width * 2;
        state.height = width * 2;
      },
    });

    const onResize = () => {
      width = canvas.clientWidth || 400;
    };
    window.addEventListener("resize", onResize);

    // Fade-in
    canvas.style.opacity = "0";
    requestAnimationFrame(() => {
      canvas.style.transition = "opacity 600ms ease";
      canvas.style.opacity = "1";
    });

    return () => {
      window.removeEventListener("resize", onResize);
      globe.destroy();
    };
  }, [lat, lng]);

  return (
    <div className={className}>
      <div className="relative mx-auto flex aspect-square w-full max-w-[420px] items-center justify-center">
        {/* Ambient halo */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, color-mix(in oklch, var(--color-primary) 22%, transparent), transparent 65%)",
            filter: "blur(30px)",
          }}
        />
        <canvas
          ref={canvasRef}
          style={{ width: "100%", height: "100%", contain: "layout paint size" }}
          className="relative"
        />
      </div>
    </div>
  );
}
