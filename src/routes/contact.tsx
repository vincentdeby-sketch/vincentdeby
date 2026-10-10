import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteShell } from "@/components/site/SiteShell";
import { PageHeader } from "@/components/site/PageHeader";
import { ArrowUpRight, CalendarClock, Mail, Phone } from "lucide-react";
import { QrLinkDialog } from "@/components/site/QrLinkDialog";
import { useIsDesktop } from "@/hooks/use-is-desktop";

import { SITE } from "@/lib/site";
import { ZONES } from "@/lib/zones";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Vincent Deby, Conseiller Immobilier Efficity" },
      { name: "description", content: "Contacter Vincent Deby, conseiller immobilier mandataire Efficity. Téléphone, e-mail et prise de rendez-vous, réponse sous 48 h ouvrées." },
      { property: "og:title", content: "Contact — Vincent Deby" },
      { property: "og:description", content: "Vincent Deby, conseiller immobilier, mandataire Efficity. Réponse sous 48 h ouvrées." },
      { property: "og:url", content: `${SITE}/contact` },
    ],
    links: [{ rel: "canonical", href: `${SITE}/contact` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ContactPage",
          url: `${SITE}/contact`,
          mainEntity: {
            "@type": "Person",
            name: "Vincent Deby",
            jobTitle: "Conseiller Immobilier",
            worksFor: { "@type": "Organization", name: "Efficity" },
            telephone: "+33610022436",
            email: "vdeby@efficity.com",
          },
        }),
      },
    ],
  }),
  component: ContactPage,
});

const PHONE = "+33610022436";
const PHONE_DISPLAY = "06 10 02 24 36";
const EMAIL = "vdeby@efficity.com";
const RDV_URL = "https://calendly.com/vdeby-efficity/rdv-estimation-immobiliere";

function ContactPage() {
  const isDesktop = useIsDesktop();
  const [qr, setQr] = useState<{ url: string; title: string; description?: string } | null>(null);
  const openQr = (target: { url: string; title: string; description?: string }) =>
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (!isDesktop) return;
      e.preventDefault();
      setQr(target);
    };

  return (
    <SiteShell>
      <PageHeader
        eyebrow="Contact"
        title={<>Contactez <em className="text-brand-ink">Vincent Deby.</em></>}
        lede="Un échange direct, sans détour, à Boulogne-Billancourt et à Paris Ouest. Je vous réponds sous 48 heures ouvrées."
      />

      <section className="container-narrow mt-12 grid gap-4 md:mt-16 md:grid-cols-3">
        <a
          href={`tel:${PHONE}`}
          onClick={openQr({ url: `tel:${PHONE}`, title: "Appeler Vincent Deby", description: PHONE_DISPLAY })}
          className="surface group flex flex-col p-7 transition-colors hover:border-foreground/40"
        >
          <span className="grid h-11 w-11 place-items-center rounded-full bg-brand text-ink"><Phone className="h-4 w-4" aria-hidden="true" /></span>
          <span className="mt-10 font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">Téléphone</span>
          <span className="mt-2 font-serif text-2xl tabular-nums">{PHONE_DISPLAY}</span>
          <span className="mt-1 text-sm text-muted-foreground">Le plus simple pour une première question.</span>
        </a>
        <a
          href={`mailto:${EMAIL}`}
          onClick={openQr({ url: `mailto:${EMAIL}`, title: "Écrire à Vincent Deby", description: EMAIL })}
          className="surface group flex flex-col p-7 transition-colors hover:border-foreground/40"
        >
          <span className="grid h-11 w-11 place-items-center rounded-full bg-brand text-ink"><Mail className="h-4 w-4" aria-hidden="true" /></span>
          <span className="mt-10 font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">E-mail</span>
          <span className="mt-2 break-all font-serif text-2xl">{EMAIL}</span>
          <span className="mt-1 text-sm text-muted-foreground">Pour envoyer des documents ou des photos.</span>
        </a>
        <a
          href={RDV_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col rounded-[1.5rem] bg-ink p-7 text-paper"
        >
          <span className="grid h-11 w-11 place-items-center rounded-full bg-brand text-ink"><CalendarClock className="h-4 w-4" aria-hidden="true" /></span>
          <span className="mt-10 font-mono text-[11px] uppercase tracking-[0.08em] text-paper/60">Rendez-vous</span>
          <span className="mt-2 flex items-center gap-2 font-serif text-2xl">
            Réserver un créneau
            <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
          </span>
          <span className="mt-1 text-sm text-paper/60">45 minutes chez vous, pour estimer votre bien.</span>
        </a>
      </section>

      <section className="container-narrow mt-4">
        <div className="surface grid gap-6 p-7 md:grid-cols-12 md:items-center md:p-10">
          <div className="md:col-span-5">
            <p className="eyebrow">Secteur</p>
            <h2 className="mt-4 !text-3xl md:!text-4xl">Là où je travaille</h2>
            <p className="mt-3 text-muted-foreground">
              Boulogne-Billancourt d'abord, et les communes voisines quand le projet s'y prête.
            </p>
          </div>
          <ul className="flex flex-wrap gap-2 md:col-span-7 md:justify-end">
            {ZONES.map((z) => (
              <li key={z} className="rounded-full border border-foreground/15 px-4 py-2 text-sm">{z}</li>
            ))}
          </ul>
        </div>
      </section>

      <QrLinkDialog
        open={!!qr}
        onClose={() => setQr(null)}
        url={qr?.url ?? ""}
        title={qr?.title ?? ""}
        description={qr?.description}
      />
    </SiteShell>
  );
}
