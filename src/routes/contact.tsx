import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteShell";
import { Reveal } from "@/components/site/Reveal";
import { NewsletterForm } from "@/components/site/NewsletterForm";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Vincent Deby, Conseiller Immobilier" },
      { name: "description", content: "Contacter Vincent Deby, conseiller immobilier, mandataire Efficity. Téléphone, e-mail et prise de rendez-vous." },
      { property: "og:title", content: "Contact — Vincent Deby" },
      { property: "og:description", content: "Vincent Deby, conseiller immobilier, mandataire Efficity." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ContactPage,
});

const PHONE = "+33610022436";
const PHONE_DISPLAY = "+33 6 10 02 24 36";
const EMAIL = "vdeby@efficity.com";
const RDV_URL = `mailto:${EMAIL}?subject=Prise%20de%20rendez-vous`;

function ContactPage() {
  return (
    <SiteShell>
      <section className="container-narrow pt-16 md:pt-24">
        <Reveal>
          <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Contact</div>
          <h1 className="mt-6 font-serif text-[clamp(2.25rem,5vw,4rem)] leading-[1.05]">
            Parlons de votre projet.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Un échange direct, sans détour. Je vous réponds sous 24 heures ouvrées.
          </p>
        </Reveal>
      </section>

      <section className="container-narrow mt-16 grid gap-16 md:mt-24 md:grid-cols-2">
        <Reveal>
          <div className="border-t border-border pt-10">
            <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Interlocuteur</div>
            <div className="mt-6 font-serif text-3xl">Vincent Deby</div>
            <div className="mt-2 text-sm text-muted-foreground">
              Conseiller immobilier · Mandataire Efficity
            </div>

            <dl className="mt-10 space-y-6 text-sm">
              <div>
                <dt className="text-xs uppercase tracking-widest text-muted-foreground">Téléphone</dt>
                <dd className="mt-2">
                  <a href={`tel:${PHONE}`} className="font-serif text-2xl hover:text-primary">
                    {PHONE_DISPLAY}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-widest text-muted-foreground">E-mail</dt>
                <dd className="mt-2">
                  <a href={`mailto:${EMAIL}`} className="font-serif text-2xl hover:text-primary">
                    {EMAIL}
                  </a>
                </dd>
              </div>
            </dl>

            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href={RDV_URL}
                className="border border-foreground bg-foreground px-6 py-3 text-xs uppercase tracking-widest text-background transition-opacity hover:opacity-90"
              >
                Prendre rendez-vous
              </a>
              <a
                href={`tel:${PHONE}`}
                className="border border-foreground/20 px-6 py-3 text-xs uppercase tracking-widest transition-colors hover:border-foreground"
              >
                Appeler maintenant
              </a>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div className="border-t border-border pt-10">
            <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Newsletter</div>
            <h2 className="mt-6 font-serif text-3xl">Rester informé</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Marché, opportunités et conseils. Une lettre par mois, sans bruit.
            </p>
            <div className="mt-8">
              <NewsletterForm />
            </div>
          </div>
        </Reveal>
      </section>
    </SiteShell>
  );
}
