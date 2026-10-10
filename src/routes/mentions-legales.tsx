import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage, Field } from "@/components/site/LegalPage";
import { LEGAL } from "@/lib/legal";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/mentions-legales")({
  head: () => ({
    meta: [
      { title: "Mentions légales | Vincent Deby" },
      { name: "description", content: "Mentions légales du site de Vincent Deby, conseiller immobilier mandataire Efficity : éditeur, carte professionnelle, hébergeur, médiation." },
      { property: "og:url", content: `${SITE}/mentions-legales` },
    ],
    links: [{ rel: "canonical", href: `${SITE}/mentions-legales` }],
  }),
  component: MentionsLegales,
});

function MentionsLegales() {
  const a = LEGAL.agency;
  return (
    <LegalPage title="Mentions légales" updated="10 octobre 2026">
      <div>
        <h2>Éditeur du site</h2>
        <p>
          {LEGAL.name}, {LEGAL.status}.<br />
          Immatriculation au RSAC : <Field value={LEGAL.rsac} /><br />
          SIRET : <Field value={LEGAL.siret} /><br />
          Adresse : <Field value={LEGAL.address} /><br />
          E-mail : <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a> · Téléphone : {LEGAL.phone}<br />
          Directeur de la publication : {LEGAL.publicationDirector}
        </p>
      </div>

      <div>
        <h2>Activité réglementée</h2>
        <p>
          Vincent Deby exerce en qualité d'agent commercial immobilier (loi n° 70-9 du 2 janvier 1970,
          dite loi Hoguet, et décret n° 72-678 du 20 juillet 1972). Il agit pour le compte de la société{" "}
          {a.name}, titulaire de la carte professionnelle, et ne peut ni recevoir ni détenir de fonds.
        </p>
        <p>
          {a.name} : <Field value={a.legalForm} /><br />
          Siège : <Field value={a.address} /><br />
          RCS : <Field value={a.rcs} /><br />
          Carte professionnelle « Transaction sur immeubles et fonds de commerce » : <Field value={a.cardT} /><br />
          Garantie financière : <Field value={a.guarantee} /><br />
          Assurance responsabilité civile professionnelle : <Field value={a.insurance} />
        </p>
      </div>

      <div>
        <h2>Honoraires</h2>
        <p>
          Le barème des honoraires applicable est celui d'{a.name}.{" "}
          {LEGAL.feesUrl ? (
            <a href={LEGAL.feesUrl} target="_blank" rel="noopener noreferrer">Consulter le barème</a>
          ) : (
            <Field value={null} />
          )}
        </p>
      </div>

      <div>
        <h2>Médiation de la consommation</h2>
        <p>
          En cas de litige non résolu à l'amiable, vous pouvez saisir gratuitement le médiateur de la
          consommation : <Field value={LEGAL.mediator} />
        </p>
      </div>

      <div>
        <h2>Hébergement</h2>
        <p>
          Site hébergé par {LEGAL.host}.<br />
          Données des formulaires : {LEGAL.dataProvider}.
        </p>
      </div>

      <div>
        <h2>Propriété intellectuelle</h2>
        <p>
          Les textes, photographies et vidéos de ce site appartiennent à Vincent Deby ou sont utilisés avec
          l'accord de leurs auteurs. Toute reproduction sans autorisation est interdite.
        </p>
      </div>

      <div>
        <h2>Données personnelles et cookies</h2>
        <p>
          Voir la <Link to="/confidentialite">politique de confidentialité</Link> et les{" "}
          <Link to="/cgu">conditions d'utilisation</Link>.
        </p>
      </div>
    </LegalPage>
  );
}
