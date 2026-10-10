import type { ImgHTMLAttributes } from "react";
import { resized, srcSet } from "@/lib/image";

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet"> & {
  src: string;
  /** Largeur servie par défaut (px), avant que le navigateur choisisse dans srcset. */
  width: number;
  height: number;
  maxWidth?: number;
};

// Image redimensionnée ; si le service de redimensionnement échoue, on retombe sur l'original.
export function PhotoImg({ src, width, maxWidth, ...rest }: Props) {
  return (
    <img
      {...rest}
      src={resized(src, width)}
      srcSet={srcSet(src, maxWidth)}
      width={width}
      onError={(e) => {
        const img = e.currentTarget;
        if (img.dataset.fallback) return;
        img.dataset.fallback = "1";
        img.removeAttribute("srcset");
        img.src = src;
      }}
    />
  );
}
