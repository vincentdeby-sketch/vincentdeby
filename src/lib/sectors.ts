// Pages secteur : une par commune ou arrondissement du secteur de Vincent.
// `code` = code commune INSEE utilisé par DVF et la Base Adresse Nationale.
export type Sector = {
  slug: string;
  name: string;
  code: string;
  postal: string;
  intro: string;
  lat: number;
  lng: number;
};

export const SECTORS: Sector[] = [
  {
    slug: "boulogne-billancourt",
    name: "Boulogne-Billancourt",
    code: "92012",
    postal: "92100",
    lat: 48.8356,
    lng: 2.241,
    intro:
      "Mon secteur premier. Entre Boulogne Nord et ses rues résidentielles, le centre autour de Jean-Jaurès et les programmes récents du Trapèze, une même commune recouvre des marchés très différents. C'est pour cela que je raisonne rue par rue.",
  },
  {
    slug: "issy-les-moulineaux",
    name: "Issy-les-Moulineaux",
    code: "92040",
    postal: "92130",
    lat: 48.8245,
    lng: 2.2700,
    intro:
      "Voisine directe de Boulogne, Issy mêle ancien de centre-ville, immeubles récents des bords de Seine et quartiers plus calmes sur les hauteurs. Les écarts de prix y suivent souvent l'époque de construction plus que l'adresse.",
  },
  {
    slug: "paris-15e",
    name: "Paris 15e",
    code: "75115",
    postal: "75015",
    lat: 48.8412,
    lng: 2.3003,
    intro:
      "Le plus peuplé des arrondissements parisiens, et l'un des plus variés : haussmannien autour de Commerce et Cambronne, immeubles des années 70 vers Beaugrenelle. Deux appartements de même surface peuvent y être séparés par un écart de prix important.",
  },
  {
    slug: "paris-16e",
    name: "Paris 16e",
    code: "75116",
    postal: "75016",
    lat: 48.8637,
    lng: 2.2769,
    intro:
      "Du Point-du-Jour à Passy, le 16e est un marché exigeant où l'étage, la vue et l'état de l'immeuble pèsent lourd. Les moyennes y cachent beaucoup : seules les ventes comparables disent la vérité d'un bien.",
  },
];
