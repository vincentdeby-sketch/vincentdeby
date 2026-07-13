import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Article, Property } from "@/lib/domain";

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

export const homePropertiesQuery = queryOptions({
  queryKey: ["properties", "home"],
  staleTime: 60_000,
  queryFn: async () => {
    const { data } = await supabase
      .from("properties")
      .select("id,title,price,address,city,cover_url,property_type,surface,rooms,bedrooms,created_at")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(3);
    return (data ?? []) as Property[];
  },
});

export const propertiesListQuery = queryOptions({
  queryKey: ["properties", "list"],
  staleTime: 60_000,
  queryFn: async () => {
    const { data } = await supabase
      .from("properties")
      .select("id,title,price,address,city,cover_url,property_type,surface,rooms,bedrooms,created_at")
      .eq("published", true)
      .order("created_at", { ascending: false });
    return (data ?? []) as Property[];
  },
});

export const propertyByIdQuery = (id: string) =>
  queryOptions({
    queryKey: ["property", id],
    staleTime: 60_000,
    queryFn: async () => {
      const { data } = await supabase
        .from("properties")
        .select("*")
        .eq("id", id)
        .eq("published", true)
        .maybeSingle();
      return (data as Property | null) ?? null;
    },
  });
