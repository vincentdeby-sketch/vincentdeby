// Informations légales affichées sur /mentions-legales, /confidentialite et /cgu.
// Source : bloc « Informations légales » de efficity.com/vdeby (relevé le 10/10/2026).
// Les valeurs null s'affichent « à compléter ».
export const LEGAL = {
  name: "Vincent Deby",
  status: "entrepreneur individuel (EI), agent commercial mandataire en immobilier du réseau Efficity",
  rsac: "n° 524 616 448, Registre spécial des agents commerciaux du tribunal de commerce de Nanterre" as string | null,
  siret: null as string | null,
  address: "231 boulevard Jean Jaurès, 92100 Boulogne-Billancourt" as string | null, // adresse de la signature e-mail de Vincent
  email: "vdeby@efficity.com",
  phone: "+33 6 10 02 24 36",
  publicationDirector: "Vincent Deby",

  // Société mandante (titulaire de la carte professionnelle)
  agency: {
    name: "Efficity",
    legalForm: "EFFICITY SAS au capital de 132 373,05 €" as string | null,
    address: "48 avenue de Villiers, 75017 Paris" as string | null,
    rcs: "Paris 497 617 746" as string | null,
    cardT: "CPI 7501 2015 000 002 025, délivrée par la CCI Paris Île-de-France" as string | null,
    guarantee: "500 000 €, GALIAN Assurances, 89 rue de la Boétie, 75008 Paris" as string | null,
    insurance: null as string | null, // assureur RCP
  },

  mediator: null as string | null, // médiateur de la consommation : nom, adresse, site
  feesUrl: "https://diszln7ft1ccx.cloudfront.net/pdf/BAREME_NATIONAL.pdf" as string | null,

  host: "Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis (vercel.com)",
  dataProvider: "Supabase Inc. (base de données des formulaires)",
};
