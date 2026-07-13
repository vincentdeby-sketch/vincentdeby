import { useEffect, useRef } from "react";

let sharedIO: IntersectionObserver | null = null;
const callbacks = new WeakMap<Element, () => void>();

function getIO() {
  if (typeof window === "undefined") return null;
  if (sharedIO) return sharedIO;
  sharedIO = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          const cb = callbacks.get(e.target);
          if (cb) cb();
          callbacks.delete(e.target);
          sharedIO?.unobserve(e.target);
        }
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -5% 0px" },
  );
  return sharedIO;
}

export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = getIO();
    if (!io) {
      el.classList.add("is-visible");
      return;
    }
    callbacks.set(el, () => el.classList.add("is-visible"));
    io.observe(el);
    return () => {
      callbacks.delete(el);
      io.unobserve(el);
    };
  }, []);
  return ref;
}
