import type { ReactNode, HTMLAttributes } from "react";
import { useReveal } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";

export function Reveal({ children, className, ...rest }: { children: ReactNode } & HTMLAttributes<HTMLDivElement>) {
  const ref = useReveal();
  return (
    <div ref={ref} className={cn("reveal", className)} {...rest}>
      {children}
    </div>
  );
}
