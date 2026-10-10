import { createFileRoute, notFound } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteShell";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { PhotoImg } from "@/components/site/PhotoImg";
import { STORIES } from "@/data/stories";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/recits")({
  loader: () => {
    if (STORIES.length === 0) throw notFound();
    return STORIES;
  },
  head: () => ({
    meta: [
      { title: "Histoires de ventes | Vincent Deby" },
      { name: "description", content: "Des ventes racontées de l'intérieur : la situation de départ, le prix proposé et pourquoi, le déroulé. Par Vincent Deby, conseiller Efficity." },
    ],
    links: [{ rel: "canonical", href: `${SITE}/recits` }],
  }),
  component: Stories,
});

const PARTS = [
  ["La situation", "situation"],
  ["Le prix, et pourquoi", "price"],
  ["Le déroulé", "story"],
  ["L'issue", "outcome"],
] as const;

function Stories() {
  const stories = Route.useLoaderData();
  return (
    <SiteShell>
      <PageHeader
        eyebrow="Histoires de ventes"
        title={<>Chaque vente <em className="text-brand-ink">a son histoire.</em></>}
        lede="Je les raconte comme je l'ai fait pendant vingt-cinq ans : les faits, les choix, et ce qu'on en retient."
      />
      <div className="container-narrow mt-14 space-y-24">
        {stories.map((s) => (
          <Reveal key={s.slug}>
            <article id={s.slug} className="grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-5">
                {s.cover && (
                  <div className="aspect-[4/3] overflow-hidden rounded-[1.75rem] bg-muted">
                    <PhotoImg src={s.cover} width={960} height={720} sizes="(min-width:1024px) 40vw, 100vw" alt="" loading="lazy" className="h-full w-full object-cover" />
                  </div>
                )}
                <p className="eyebrow mt-6">{s.place} · {s.date}</p>
                <h2 className="mt-3 !text-[clamp(1.8rem,3vw,2.6rem)]">{s.title}</h2>
              </div>
              <div className="space-y-8 lg:col-span-7">
                {PARTS.map(([label, key]) => (
                  <section key={key}>
                    <h3 className="font-mono text-[11px] uppercase tracking-[0.08em] text-brand-ink">{label}</h3>
                    <p className="mt-2 whitespace-pre-wrap text-lg leading-relaxed text-foreground/85">{s[key]}</p>
                  </section>
                ))}
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </SiteShell>
  );
}
