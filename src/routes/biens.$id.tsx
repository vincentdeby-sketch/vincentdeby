import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { SiteShell } from "@/components/site/SiteShell";
import { ContactMenu } from "@/components/site/ContactMenu";
import { formatEUR } from "@/lib/domain";
import { propertyByIdQuery } from "@/lib/queries";

const SITE = "https://debymo.lovable.app";

export const Route = createFileRoute("/biens/$id")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(propertyByIdQuery(params.id));
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData, params }) => {
    const url = `${SITE}/biens/${params?.id ?? ""}`;
    if (!loaderData) {
      return {
        meta: [{ title: "Bien introuvable — Vincent Deby" }, { name: "robots", content: "noindex" }],
        links: [{ rel: "canonical", href: url }],
      };
    }
    const p = loaderData;
    const loc = [p.city, p.address].filter(Boolean).join(", ");
    const desc = `${p.title} · ${formatEUR(p.price)}${p.surface ? ` · ${p.surface} m²` : ""}${loc ? ` · ${loc}` : ""}. ${(p.description ?? "").slice(0, 120)}`;
    return {
      meta: [
        { title: `${p.title} — ${formatEUR(p.price)}` },
        { name: "description", content: desc },
        { property: "og:title", content: p.title },
        { property: "og:description", content: desc },
        { property: "og:url", content: url },
        { property: "og:type", content: "product" },
        ...(p.cover_url
          ? [
              { property: "og:image", content: p.cover_url },
              { name: "twitter:image", content: p.cover_url },
            ]
          : []),
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: p.title,
            description: p.description,
            image: p.cover_url ?? undefined,
            category: p.property_type,
            offers: {
              "@type": "Offer",
              price: p.price,
              priceCurrency: "EUR",
              availability: "https://schema.org/InStock",
              url,
            },
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Accueil", item: `${SITE}/` },
              { "@type": "ListItem", position: 2, name: "Nos biens", item: `${SITE}/biens` },
              { "@type": "ListItem", position: 3, name: p.title, item: url },
            ],
          }),
        },
      ],
    };
  },
  component: Detail,
  notFoundComponent: () => (
    <SiteShell>
      <div className="container-narrow py-32 text-center">
        <h1 className="font-serif text-4xl">Bien introuvable</h1>
        <Link to="/biens" className="mt-6 inline-block text-primary underline">Retour aux biens</Link>
      </div>
    </SiteShell>
  ),
  errorComponent: ({ error }) => (
    <SiteShell><div className="container-narrow py-24 text-sm text-muted-foreground">{error.message}</div></SiteShell>
  ),
});

function Detail() {
  const { id } = Route.useParams();
  const { data: p } = useSuspenseQuery(propertyByIdQuery(id));
  if (!p) throw notFound();

  const gallery = [p.cover_url, ...(p.photos ?? [])].filter(Boolean) as string[];
  const locString = [p.address, p.city].filter(Boolean).join(", ");

  return (
    <SiteShell>
      <div className="container-narrow pt-10">
        <Link to="/biens" className="text-xs uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground">← Nos biens</Link>
      </div>
      <section className="container-narrow mt-8 grid gap-12 md:grid-cols-[2fr_1fr]">
        <div>
          {gallery[0] ? (
            <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
              <img
                src={gallery[0]}
                alt={`${p.title} — photo principale${locString ? ` (${locString})` : ""}`}
                fetchPriority="high"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="aspect-[4/3] w-full bg-muted" />
          )}
          {gallery.length > 1 && (
            <div className="mt-4 grid grid-cols-3 gap-4">
              {gallery.slice(1, 7).map((src, i) => (
                <div key={i} className="aspect-square overflow-hidden bg-muted">
                  <img
                    src={src}
                    alt={`${p.title} — photo ${i + 2}`}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        <aside className="md:pt-4">
          <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{p.property_type}</div>
          <h1 className="mt-3 font-serif text-3xl leading-tight md:text-4xl">{p.title}</h1>
          <div className="mt-2 text-muted-foreground">{locString}</div>
          <div className="mt-6 font-serif text-3xl text-primary">{formatEUR(p.price)}</div>
          <dl className="mt-8 grid grid-cols-2 gap-y-4 border-t border-border pt-6 text-sm">
            {p.surface && <><dt className="text-muted-foreground">Surface</dt><dd className="text-right">{p.surface} m²</dd></>}
            {p.rooms && <><dt className="text-muted-foreground">Pièces</dt><dd className="text-right">{p.rooms}</dd></>}
            {p.bedrooms && <><dt className="text-muted-foreground">Chambres</dt><dd className="text-right">{p.bedrooms}</dd></>}
          </dl>
          <div className="mt-8">
            <ContactMenu align="center" className="w-full" />
          </div>
        </aside>
      </section>
      <section className="container-narrow mt-16 max-w-3xl">
        <h2 className="font-serif text-2xl">Description</h2>
        <div className="mt-6 whitespace-pre-wrap leading-relaxed text-foreground/85">{p.description}</div>
      </section>
    </SiteShell>
  );
}
