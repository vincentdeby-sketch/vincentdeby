import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import QRCode from "qrcode";

type Props = {
  open: boolean;
  onClose: () => void;
  url: string;
  title: string;
  description?: string;
};

export function QrLinkDialog({ open, onClose, url, title, description }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open || !canvasRef.current) return;
    QRCode.toCanvas(canvasRef.current, url, {
      width: 240,
      margin: 1,
      color: { dark: "#111111", light: "#ffffff" },
    }).catch(() => {});
  }, [open, url]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  const displayUrl = url.replace(/^tel:/, "").replace(/^mailto:/, "");

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 grid place-items-center bg-foreground/30 p-4 backdrop-blur-xl animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm bg-background p-8 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Fermer"
          onClick={onClose}
          className="absolute right-3 top-3 grid h-8 w-8 place-items-center text-foreground/60 transition-colors hover:text-foreground"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>

        <div className="text-center">
          <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Scannez avec votre téléphone
          </div>
          <h3 className="mt-3 font-serif text-2xl">{title}</h3>
          {description ? (
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          ) : null}

          <div className="mt-6 flex justify-center">
            <div className="border border-foreground/10 bg-white p-3">
              <canvas ref={canvasRef} />
            </div>
          </div>

          <div className="mt-6 break-all font-mono text-xs text-foreground/80">
            {displayUrl}
          </div>

          <button
            type="button"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(displayUrl);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              } catch { /* noop */ }
            }}
            className="mt-4 border border-foreground/20 px-4 py-2 text-[11px] uppercase tracking-widest transition-colors hover:border-foreground"
          >
            {copied ? "Copié" : "Copier"}
          </button>
        </div>
      </div>
    </div>
  );
}
