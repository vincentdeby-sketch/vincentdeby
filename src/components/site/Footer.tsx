import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { NewsletterForm } from "./NewsletterForm";
import { ZONES } from "@/lib/zones";
import { SECTORS } from "@/lib/sectors";
import { STORIES } from "@/data/stories";

const PHONE = "+33610022436";
const PHONE_DISPLAY = "06 10 02 24 36";
const EMAIL = "vdeby@efficity.com";
const CALENDLY_URL = "https://calendly.com/vdeby-efficity/rdv-estimation-immobiliere";


export function Footer() {
  return (
    <footer className="mt-24 px-3 pb-3 sm:px-5 sm:pb-5 md:mt-32">
      <div className="grain overflow-hidden rounded-[2rem] bg-ink text-paper">
        <div className="container-narrow relative pt-16 md:pt-24">
          <div className="grid gap-12 md:grid-cols-12">
            <div className="md:col-span-7">
              <p className="eyebrow !text-paper/60">
                Boulogne-Billancourt &amp; Paris Ouest
              </p>
              <p className="mt-6 max-w-xl font-serif text-[clamp(2rem,4vw,3.4rem)] leading-[1.02] tracking-[-0.035em]">
                Un projet de vente ? Commençons par{" "}
                <em className="text-brand">le prix juste.</em>
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/estimation" className="group btn btn-brand">
                  Estimer mon bien
                  <span className="btn-arrow !bg-ink !text-brand" aria-hidden="true"><ArrowUpRight className="h-3.5 w-3.5" /></span>
                </Link>
                <a href={`tel:${PHONE}`} className="btn border border-paper/25 text-paper hover:border-paper">
                  {PHONE_DISPLAY}
                </a>
              </div>
            </div>

            <div className="md:col-span-5 md:pl-8">
              <p className="eyebrow !text-paper/60">La lettre du marché</p>
              <p className="mt-4 text-sm leading-relaxed text-paper/70">
                Une fois par mois : les ventes qui comptent dans le quartier, et ce qu'elles disent des prix.
              </p>
              <div className="mt-5 [&_input]:!border-paper/20 [&_input]:!bg-paper/5 [&_input]:!text-paper [&_button]:!bg-brand [&_button]:!text-ink [&_a]:text-paper">
                <NewsletterForm />
              </div>
            </div>
          </div>

          <div className="mt-16 grid gap-10 border-t border-paper/15 pt-10 text-sm sm:grid-cols-3 md:mt-20">
            <nav aria-label="Liens de pied de page">
              <p className="eyebrow !text-paper/50">Le site</p>
              <ul className="mt-4 space-y-2.5">
                <li><Link to="/estimation" className="text-paper/80 hover:text-paper">Estimation</Link></li>
                <li><Link to="/biens" className="text-paper/80 hover:text-paper">Biens à vendre</Link></li>
                <li><Link to="/actualites" className="text-paper/80 hover:text-paper">Journal</Link></li>
                <li><Link to="/videos" className="text-paper/80 hover:text-paper">Vidéos</Link></li>
                {STORIES.length > 0 && <li><Link to="/recits" className="text-paper/80 hover:text-paper">Histoires de ventes</Link></li>}
                <li><Link to="/contact" className="text-paper/80 hover:text-paper">Contact</Link></li>
              </ul>
            </nav>
            <div>
              <p className="eyebrow !text-paper/50">Contact direct</p>
              <ul className="mt-4 space-y-2.5">
                <li><a href={`tel:${PHONE}`} className="tabular-nums text-paper/80 hover:text-paper">{PHONE_DISPLAY}</a></li>
                <li><a href={`mailto:${EMAIL}`} className="break-all text-paper/80 hover:text-paper">{EMAIL}</a></li>
                <li>
                  <a href="https://www.immodvisor.com/pro/efficity-immobilier-vincent-deby-boulogne-billancourt-92100-92460.html" target="_blank" rel="noopener noreferrer" className="text-paper/80 hover:text-paper">
                    Avis clients vérifiés (Immodvisor)
                  </a>
                </li>
                <li>
                  <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="text-paper/80 hover:text-paper">
                    Réserver un rendez-vous
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="eyebrow !text-paper/50">Secteur</p>
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {ZONES.map((z) => {
                  const sector = SECTORS.find((x) => x.name === z);
                  return (
                    <li key={z}>
                      {sector ? (
                        <Link to="/secteurs/$slug" params={{ slug: sector.slug }} className="block rounded-full border border-paper/15 px-3 py-1 text-xs text-paper/75 hover:border-paper hover:text-paper">
                          {z}
                        </Link>
                      ) : (
                        <span className="block rounded-full border border-paper/15 px-3 py-1 text-xs text-paper/75">{z}</span>
                      )}
                    </li>
                  );
                })}
              </ul>
              <Link to="/ventes-autour-de-chez-moi" className="mt-4 inline-block text-sm text-brand hover:underline">
                Les ventes autour de chez moi →
              </Link>
            </div>
          </div>

          <p
            aria-hidden="true"
            className="pointer-events-none mt-14 select-none whitespace-nowrap font-serif text-[clamp(4rem,15.5vw,13.5rem)] leading-[0.8] tracking-[-0.06em] text-paper/[0.07]"
          >
            Vincent Deby
          </p>

          <div className="flex flex-col gap-3 border-t border-paper/15 py-6 text-xs text-paper/55 md:flex-row md:items-center md:justify-between">
            <p>© {new Date().getFullYear()} Vincent Deby, agent commercial mandataire du réseau Efficity.</p>
            <nav aria-label="Informations légales" className="flex flex-wrap gap-x-4 gap-y-1">
              <Link to="/mentions-legales" className="hover:text-paper">Mentions légales</Link>
              <Link to="/confidentialite" className="hover:text-paper">Confidentialité</Link>
              <Link to="/cgu" className="hover:text-paper">CGU</Link>
              <button
                type="button"
                onClick={() => window.dispatchEvent(new Event("open-cookie-banner"))}
                className="hover:text-paper"
              >
                Cookies
              </button>
              <Link to="/auth" className="hover:text-paper">Espace pro</Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
