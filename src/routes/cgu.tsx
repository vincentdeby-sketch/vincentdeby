import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/cgu")({
  head: () => ({
    meta: [
      { title: "Conditions d'utilisation | Vincent Deby" },
      { name: "description", content: "Conditions d'utilisation du site de Vincent Deby, conseiller immobilier à Boulogne-Billancourt : estimations, annonces, responsabilité." },
      { property: "og:url", content: `${SITE}/cgu` },
    ],
    links: [{ rel: "canonical", href: `${SITE}/cgu` }],
  }),
  component: Cgu,
});

function Cgu() {
  return (
    <LegalPage title="Conditions d'utilisation" updated="10 octobre 2026">
      <div>
        <h2>Objet</h2>
        <p>
          Ce site présente l'activité de Vincent Deby, conseiller immobilier, et permet de demander une
          estimation, de décrire un projet de vente ou de prendre contact. Son utilisation est gratuite.
        </p>
      </div>

      <div>
        <h2>Estimations</h2>
        <p>
          Une demande d'estimation en ligne n'est pas un avis de valeur. Le prix proposé après étude
          s'appuie sur les ventes récentes et comparables du quartier, mais il ne vaut ni engagement de
          vente ni garantie de résultat.
        </p>
      </div>

      <div>
        <h2>Annonces</h2>
        <p>
          Les annonces sont publiées avec soin et mises à jour dès que possible. Prix, surfaces et
          disponibilité restent à confirmer lors d'un échange ou d'une visite. Les honoraires sont indiqués
          selon le barème en vigueur, consultable dans les{" "}
          <Link to="/mentions-legales">mentions légales</Link>.
        </p>
      </div>

      <div>
        <h2>Responsabilité</h2>
        <p>
          Les articles donnent une information générale sur le marché et ne remplacent pas un conseil
          juridique ou fiscal personnalisé. Les liens vers d'autres sites sont fournis à titre pratique.
        </p>
      </div>

      <div>
        <h2>Droit applicable</h2>
        <p>Ces conditions relèvent du droit français.</p>
      </div>
    </LegalPage>
  );
}
