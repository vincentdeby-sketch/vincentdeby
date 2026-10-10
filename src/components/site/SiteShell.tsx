import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { MobileActionBar } from "./MobileActionBar";

export function SiteShell({ children, hideActionBar = false }: { children: ReactNode; hideActionBar?: boolean }) {
  return (
    <div className={`flex min-h-dvh flex-col ${hideActionBar ? "" : "pb-20 md:pb-0"}`}>
      <a href="#main-content" className="skip-link">Aller au contenu</a>
      <Header />
      <main id="main-content" className="flex-1 focus:outline-none" tabIndex={-1}>
        {children}
      </main>
      <Footer />
      <MobileActionBar hidden={hideActionBar} />
    </div>
  );
}
