import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import frauncesTitle from "@fontsource/fraunces/files/fraunces-latin-500-normal.woff2?url";
import interText from "@fontsource/inter/files/inter-latin-400-normal.woff2?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { CookieBanner } from "@/components/site/CookieBanner";
import { Cursor } from "@/components/motion/Cursor";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page introuvable</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Cette page n'existe pas ou a été déplacée.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          La page n'a pas pu se charger
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Un problème est survenu de notre côté. Vous pouvez réessayer ou revenir à l'accueil.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Réessayer
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Retour à l'accueil
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#F6F4EE" },
      { name: "format-detection", content: "telephone=no" },
      { name: "google-site-verification", content: "ohcGpz5lQjx3mV96WTSYv34NvaBs7emZH75wjQw3YIY" },
      { property: "og:site_name", content: "Vincent Deby — Conseiller Immobilier" },
      { property: "og:locale", content: "fr_FR" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      // Polices des titres et du texte courant : chargées d'emblée pour éviter le saut d'affichage.
      { rel: "preload", href: frauncesTitle, as: "font", type: "font/woff2", crossOrigin: "anonymous" } as never,
      { rel: "preload", href: interText, as: "font", type: "font/woff2", crossOrigin: "anonymous" } as never,
      { rel: "preconnect", href: "https://d1q967606ga7w2.cloudfront.net", crossOrigin: "anonymous" } as never,
      { rel: "preconnect", href: "https://yokxbjfcpwmjzydgrwmb.supabase.co", crossOrigin: "anonymous" } as never,
      { rel: "preconnect", href: "https://images.unsplash.com", crossOrigin: "anonymous" } as never,
      { rel: "dns-prefetch", href: "https://d1q967606ga7w2.cloudfront.net" },
      { rel: "dns-prefetch", href: "https://yokxbjfcpwmjzydgrwmb.supabase.co" },
      { rel: "dns-prefetch", href: "https://images.unsplash.com" },
    ],
    scripts: [
      {
        // Active les animations d'apparition seulement quand le JavaScript tourne.
        children: `document.documentElement.classList.add('js')`,
      },
      {
        // Consent Mode v2 : tout est refusé par défaut. Le script Google Ads n'est
        // chargé que si le visiteur accepte (voir CookieBanner).
        children: `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied'});`,
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "RealEstateAgent",
          name: "Vincent Deby — Conseiller Immobilier",
          url: "https://www.vincentimmo.com",
          telephone: "+33610022436",
          email: "vdeby@efficity.com",
          areaServed: [
            "Boulogne-Billancourt",
            "Issy-les-Moulineaux",
            "Paris 15e",
            "Paris 16e",
            "Paris Ouest",
          ],
          knowsLanguage: "fr",
          brand: { "@type": "Brand", name: "Efficity" },
          sameAs: [] as string[],
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
      <CookieBanner />
      <Cursor />
    </QueryClientProvider>
  );
}
