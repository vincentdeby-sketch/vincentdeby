import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    // Précharge la page au survol d'un lien et fond les pages entre elles (navigateurs compatibles).
    defaultPreload: "intent",
    defaultViewTransition: true,
  });

  return router;
};
