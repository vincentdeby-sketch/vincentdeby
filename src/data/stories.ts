// Récits de vente, écrits par Vincent avec l'accord des clients.
// La page /recits et son lien dans le menu n'apparaissent qu'à partir du premier récit.
//
// Exemple de structure (à remplacer par de vrais récits) :
// {
//   slug: "trois-pieces-silly",
//   title: "Le trois-pièces que tout le monde trouvait trop cher",
//   place: "Boulogne-Billancourt, quartier Silly",
//   date: "2026-09",
//   cover: "https://…/photo.jpg",
//   situation: "Ce que voulaient les vendeurs, leurs contraintes…",
//   price: "Le prix proposé, et les ventes comparables qui le justifiaient…",
//   story: "Comment la vente s'est déroulée…",
//   outcome: "Le résultat, raconté sans chiffre de délai ni promesse…",
// },
export type Story = {
  slug: string;
  title: string;
  place: string;
  date: string;
  cover?: string;
  situation: string;
  price: string;
  story: string;
  outcome: string;
};

export const STORIES: Story[] = [];
