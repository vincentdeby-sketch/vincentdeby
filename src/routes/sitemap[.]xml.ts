import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";

const BASE_URL = "https://debymo.lovable.app";

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
          { path: "/contact", changefreq: "monthly", priority: "0.6" },
          { path: "/videos", changefreq: "monthly", priority: "0.5" },
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

          const { data: props } = await supabase
            .from("properties")
            .select("id, updated_at")
            .eq("published", true);
          for (const p of props ?? []) {
            entries.push({
              path: `/biens/${p.id}`,
              lastmod: p.updated_at?.slice(0, 10),
              changefreq: "weekly",
              priority: "0.7",
            });
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
