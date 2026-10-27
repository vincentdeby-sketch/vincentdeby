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
    const show = () => {
      el.classList.add("is-visible");
      callbacks.delete(el);
      io.unobserve(el);
    };
    // Déjà à l'écran : on l'affiche tout de suite. On revérifie après la mise en page
    // (polices et styles chargés), sinon un bloc visible au chargement pouvait rester
    // masqué tant que le visiteur ne faisait pas défiler la page.
    const inView = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      return rect.top < vh && rect.bottom > 0;
    };
    if (inView()) {
      el.classList.add("is-visible");
      return;
    }
    callbacks.set(el, show);
    io.observe(el);
    const recheck = () => { if (!el.classList.contains("is-visible") && inView()) show(); };
    const raf = requestAnimationFrame(recheck);
    const timers = [setTimeout(recheck, 300), setTimeout(recheck, 1200)];
    window.addEventListener("load", recheck, { once: true });
    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      window.removeEventListener("load", recheck);
      callbacks.delete(el);
      io.unobserve(el);
    };
  }, []);
  return ref;
}
