import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";
import { LEGAL } from "@/lib/legal";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/confidentialite")({
  head: () => ({
    meta: [
      { title: "Politique de confidentialité | Vincent Deby" },
      { name: "description", content: "Quelles données le site de Vincent Deby collecte, pourquoi, combien de temps elles sont gardées et comment exercer vos droits." },
      { property: "og:url", content: `${SITE}/confidentialite` },
    ],
    links: [{ rel: "canonical", href: `${SITE}/confidentialite` }],
  }),
  component: Confidentialite,
});

function Confidentialite() {
  return (
    <LegalPage title="Politique de confidentialité" updated="10 octobre 2026">
      <div>
        <h2>Qui traite vos données</h2>
        <p>
          {LEGAL.name}, agent commercial mandataire du réseau Efficity. Contact :{" "}
          <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>.
        </p>
      </div>

      <div>
        <h2>Ce qui est collecté</h2>
        <p>
          Uniquement ce que vous saisissez dans les formulaires d'estimation, de projet de vente ou de
          contact : nom, e-mail, téléphone, adresse et caractéristiques du bien, calendrier de votre projet.
          Rien d'autre n'est demandé.
        </p>
      </div>

      <div>
        <h2>Pourquoi</h2>
        <p>
          Pour vous répondre, préparer l'estimation de votre bien et vous recontacter au sujet de votre
          projet. La base légale est votre demande (mesures précontractuelles). Vos données ne sont ni
          vendues ni louées. Elles peuvent être partagées avec Efficity, dans le cadre du mandat.
        </p>
      </div>

      <div>
        <h2>Combien de temps</h2>
        <p>
          Trois ans après le dernier échange, sauf si un mandat est signé : les durées légales de
          conservation des documents de transaction s'appliquent alors.
        </p>
      </div>

      <div>
        <h2>Où</h2>
        <p>
          Les formulaires sont enregistrés chez {LEGAL.dataProvider}. Le site est hébergé par Vercel Inc.
          Ces prestataires peuvent traiter des données hors de l'Union européenne, avec les clauses
          contractuelles types de la Commission européenne.
        </p>
      </div>

      <div>
        <h2>Cookies</h2>
        <p>
          Aucun cookie publicitaire n'est déposé sans votre accord. Si vous acceptez, Google Ads mesure
          les visites issues de mes annonces. Vous pouvez changer d'avis à tout moment via le lien
          « Cookies » en bas de chaque page. Le site garde votre choix dans votre navigateur.
        </p>
      </div>

      <div>
        <h2>Vos droits</h2>
        <p>
          Vous pouvez accéder à vos données, les corriger, les effacer, vous opposer à leur traitement ou
          en demander la portabilité en écrivant à <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>.
          Réponse sous un mois. Vous pouvez aussi saisir la CNIL (cnil.fr).
        </p>
      </div>
    </LegalPage>
  );
}
