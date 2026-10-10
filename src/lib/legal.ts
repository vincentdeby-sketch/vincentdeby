// Informations légales affichées sur /mentions-legales, /confidentialite et /cgu.
// Les valeurs null s'affichent « à compléter » : à remplir avec les documents de Vincent et d'Efficity.
export const LEGAL = {
  name: "Vincent Deby",
  status: "Agent commercial immobilier indépendant, mandataire du réseau Efficity",
  rsac: null as string | null, // ex. « 123 456 789 RSAC Nanterre »
  siret: null as string | null,
  address: null as string | null, // adresse postale professionnelle
  email: "vdeby@efficity.com",
  phone: "+33 6 10 02 24 36",
  publicationDirector: "Vincent Deby",

  // Société mandante (titulaire de la carte professionnelle)
  agency: {
    name: "Efficity",
    legalForm: null as string | null, // forme sociale et capital
    address: null as string | null,
    rcs: null as string | null,
    cardT: null as string | null, // n° de carte professionnelle « Transaction » et CCI de délivrance
    guarantee: null as string | null, // garant financier et montant
    insurance: null as string | null, // assureur RCP
  },

  mediator: null as string | null, // médiateur de la consommation : nom, adresse, site
  feesUrl: null as string | null, // lien vers le barème d'honoraires Efficity

  host: "Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis — vercel.com",
  dataProvider: "Supabase Inc. (base de données des formulaires)",
};
