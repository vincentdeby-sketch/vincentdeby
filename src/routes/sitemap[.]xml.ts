import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { getListings } from "@/lib/efficity";
import { SECTORS } from "@/lib/sectors";
import { STORIES } from "@/data/stories";

import { SITE as BASE_URL } from "@/lib/site";

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/biens", changefreq: "daily", priority: "0.9" },
          { path: "/actualites", changefreq: "weekly", priority: "0.8" },
          { path: "/estimation", changefreq: "monthly", priority: "0.9" },
          { path: "/formulaire", changefreq: "monthly", priority: "0.7" },
          { path: "/contact", changefreq: "monthly", priority: "0.6" },
          { path: "/videos", changefreq: "monthly", priority: "0.5" },
          { path: "/ventes-autour-de-chez-moi", changefreq: "monthly", priority: "0.8" },
          ...SECTORS.map((x) => ({ path: `/secteurs/${x.slug}`, changefreq: "monthly" as const, priority: "0.8" })),
          ...(STORIES.length ? [{ path: "/recits", changefreq: "monthly" as const, priority: "0.6" }] : []),
          { path: "/mentions-legales", changefreq: "yearly", priority: "0.2" },
          { path: "/confidentialite", changefreq: "yearly", priority: "0.2" },
          { path: "/cgu", changefreq: "yearly", priority: "0.2" },
        ];

        try {
          const { data: articles } = await supabase
            .from("articles")
            .select("slug, updated_at, published_at")
            .eq("published", true);
          for (const a of articles ?? []) {
            entries.push({
              path: `/actualites/${a.slug}`,
              lastmod: (a.updated_at ?? a.published_at ?? undefined)?.slice(0, 10),
              changefreq: "monthly",
              priority: "0.7",
            });
          }

          const { forSale } = await getListings();
          for (const p of forSale) {
            entries.push({ path: `/biens/${p.id}`, changefreq: "weekly", priority: "0.7" });
          }
        } catch {
          // If the database is unreachable, still serve static routes.
        }

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
