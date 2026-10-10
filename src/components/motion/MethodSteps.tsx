import { useScrollProgress } from "./useScrollProgress";

type Step = { n: string; title: string; text: string };

// Les étapes s'allument une à une au défilement, reliées par une ligne verte qui progresse.
export function MethodSteps({ steps }: { steps: Step[] }) {
  const [ref, p] = useScrollProgress<HTMLDivElement>(0.8, 0.45);
  const active = Math.min(steps.length - 1, Math.floor(p * steps.length));
  return (
    <div ref={ref} className="relative mt-12 md:mt-16">
      <div className="absolute left-0 right-0 top-0 hidden h-0.5 rounded-full bg-foreground/10 lg:block" aria-hidden="true">
        <div className="h-full rounded-full bg-brand transition-[width] duration-200" style={{ width: `${p * 100}%` }} />
      </div>
      <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:pt-8">
        {steps.map((m, i) => {
          const on = i <= active && p > 0;
          return (
            <li
              key={m.n}
              className={`surface group relative flex flex-col p-6 transition-all duration-500 md:p-7 ${on ? "!border-foreground/40 shadow-[0_24px_48px_-32px_rgb(18_20_17/0.4)]" : "opacity-70"}`}
            >
              <span className={`absolute -top-[2.3rem] left-7 hidden h-3 w-3 rounded-full border-2 transition-colors duration-300 lg:block ${on ? "border-brand bg-brand" : "border-foreground/20 bg-background"}`} aria-hidden="true" />
              <span className="font-mono text-xs text-muted-foreground">{m.n}</span>
              <h3 className="mt-10 flex items-center gap-2">
                {m.title}
                <span className={`h-1.5 w-1.5 rounded-full bg-brand transition-transform duration-500 ${on ? "scale-150" : "scale-100"}`} aria-hidden="true" />
              </h3>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-muted-foreground">{m.text}</p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
