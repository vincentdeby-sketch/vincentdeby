import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Article, Property } from "@/lib/domain";
import { getListing, getListings, type Listing } from "@/lib/efficity";
import { getSectorMarket } from "@/lib/dvf";

export const homeArticlesQuery = queryOptions({
  queryKey: ["articles", "home"],
  staleTime: 60_000,
  queryFn: async () => {
    const { data } = await supabase
      .from("articles")
      .select("id,slug,title,excerpt,cover_url,published_at,created_at")
      .eq("published", true)
      .order("published_at", { ascending: false, nullsFirst: false })
      .limit(3);
    return (data ?? []) as Article[];
  },
});

export const articlesListQuery = queryOptions({
  queryKey: ["articles", "list"],
  staleTime: 60_000,
  queryFn: async () => {
    const { data } = await supabase
      .from("articles")
      .select("id,slug,title,excerpt,cover_url,published_at,created_at")
      .eq("published", true)
      .order("published_at", { ascending: false, nullsFirst: false });
    return (data ?? []) as Article[];
  },
});

export const articleBySlugQuery = (slug: string) =>
  queryOptions({
    queryKey: ["article", slug],
    staleTime: 60_000,
    queryFn: async () => {
      const { data } = await supabase
        .from("articles")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      return (data as Article | null) ?? null;
    },
  });

// Biens : lus sur la page Efficity de Vincent (voir src/lib/efficity.ts).
export const listingsQuery = queryOptions({
  queryKey: ["listings"],
  staleTime: 5 * 60_000,
  queryFn: () => getListings(),
});

export const propertiesListQuery = listingsQuery;

// Identifiant numérique : annonce Efficity. Sinon : ancienne fiche saisie dans l'espace admin.
export const propertyByIdQuery = (id: string) =>
  queryOptions({
    queryKey: ["property", id],
    staleTime: 5 * 60_000,
    queryFn: async (): Promise<Listing | Property | null> => {
      if (/^\d+$/.test(id)) return getListing({ data: id });
      const { data } = await supabase
        .from("properties")
        .select("*")
        .eq("id", id)
        .eq("published", true)
        .maybeSingle();
      return (data as Property | null) ?? null;
    },
  });

// Marché d'un secteur d'après les ventes DVF (voir src/lib/dvf.ts).
export const sectorMarketQuery = (slug: string) =>
  queryOptions({
    queryKey: ["sector-market", slug],
    staleTime: 60 * 60_000,
    queryFn: () => getSectorMarket({ data: slug }),
  });
