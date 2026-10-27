import type { Article } from "@/lib/domain";

// Articles du journal publiés depuis le code (en plus de ceux de l'espace admin).
// Mise en forme : « ## » titre, « ### » sous-titre, « - » liste, « > » citation,
// **gras**, [lien](/page). Un article n'apparaît qu'à partir de sa date de publication.
// Si un article de l'espace admin a le même slug, c'est lui qui est affiché.

type Draft = Pick<Article, "slug" | "title" | "excerpt" | "content"> & { category: string; date: string };

const DRAFTS: Draft[] = [
  {
    slug: "prix-m2-boulogne-billancourt-lire-les-chiffres",
    category: "Marché",
    date: "2026-10-27T05:14:00Z",
    title: "Prix au m² à Boulogne-Billancourt : bien lire les chiffres",
    excerpt:
      "Entre 6 560 et 10 020 € le m² selon l'estimation publiée par Efficity en octobre 2026. Sur un 60 m², l'écart dépasse 200 000 €. Voici comment le lire.",
    content: `Quand un propriétaire m'appelle, la première question porte presque toujours sur un chiffre : combien vaut le mètre carré à Boulogne ? Je comprends la question. La réponse, elle, tient rarement en un seul nombre.

En octobre 2026, Efficity estimait le prix au m² à Boulogne-Billancourt à 8 040 € en moyenne, avec une fourchette basse à 6 560 € et une fourchette haute à 10 020 €. Entre le bas et le haut, il y a près de 3 500 € par mètre carré. Sur un 60 m², cela représente plus de 200 000 €.

## Pourquoi une moyenne ne suffit pas

Une moyenne mélange tout. Le studio en rez-de-chaussée sur rue et le cinq pièces au dernier étage avec terrasse. L'immeuble des années 1970 et la pierre de taille de Boulogne Nord. L'appartement refait l'an dernier et celui qui n'a pas bougé depuis trente ans. Appliquer la moyenne à votre bien revient à supposer qu'il ressemble à tous les autres à la fois.

C'est pour cela que je parle peu de la ville entière. Je regarde la rue, l'immeuble, l'étage.

## Ce qui place un bien en haut ou en bas de la fourchette

Les mêmes questions reviennent à chaque visite :

- à quel étage, et avec ou sans ascenseur ;
- combien d'heures de soleil, et sur quoi donnent les fenêtres ;
- quels travaux un acheteur devra prévoir ;
- s'il y a un extérieur, même un petit balcon ;
- dans quel état est la copropriété, et ce qu'elle a voté récemment ;
- à combien de minutes se trouvent le métro et les écoles.

Aucune de ces réponses ne se lit dans une moyenne. Elles se voient sur place.

## Les chiffres sur lesquels je m'appuie

Pour estimer un appartement, je pars des ventes réellement signées chez le notaire, publiées par l'administration fiscale dans la base DVF. Je retiens celles qui ressemblent le plus au bien : même secteur, surface proche, vente récente. Puis je corrige avec ce que j'ai vu pendant la visite.

Vous pouvez faire une partie de ce travail vous-même. La page [le marché à Boulogne-Billancourt](/secteurs/boulogne-billancourt) rassemble les dernières ventes publiées dans la commune. L'outil [les ventes autour de chez moi](/ventes-autour-de-chez-moi) affiche celles qui se sont faites à quelques rues de votre adresse.

## Et votre appartement ?

Le prix moyen sert à se situer, pas à fixer un prix de vente. Si vous voulez savoir où se place votre bien dans la fourchette, je viens le voir et je vous montre une à une les ventes sur lesquelles je m'appuie. [Demander une estimation](/estimation).`,
  },
  {
    slug: "dvf-prix-reel-ventes-immobilieres",
    category: "Méthode",
    date: "2026-10-27T05:13:00Z",
    title: "DVF : où trouver le prix réel des ventes près de chez vous",
    excerpt:
      "Les prix signés chez le notaire sont publics depuis 2019. Ce que la base DVF contient, ce qu'elle ne dit pas, et comment je m'en sers pour estimer un bien.",
    content: `Pendant vingt-cinq ans de journalisme, j'ai appris une règle simple : une affirmation vaut ce que vaut sa source. En immobilier, la meilleure source sur les prix s'appelle DVF.

## Ce que contient DVF

DVF signifie « Demandes de valeurs foncières ». C'est la base des ventes immobilières enregistrées par l'administration fiscale à partir des actes signés chez les notaires. Elle est en accès libre sur data.gouv.fr depuis 2019 et couvre les cinq dernières années.

Pour chaque vente, on y trouve la date, le prix, l'adresse, le type de bien, la surface et le nombre de pièces principales. C'est le prix réellement payé par l'acheteur, et non le prix affiché dans une annonce.

## Ce que DVF ne dit pas

La base a des limites, et il faut les connaître avant d'en tirer une conclusion :

- elle n'indique ni l'étage, ni l'état du bien, ni la présence d'un balcon ;
- elle est publiée avec plusieurs mois de décalage et mise à jour deux fois par an ;
- certaines ventes regroupent plusieurs lots, par exemple deux appartements vendus ensemble, ce qui fausse le prix au m² si on ne les écarte pas ;
- l'Alsace, la Moselle et Mayotte n'y figurent pas.

Une vente à 5 000 € le m² dans votre rue peut correspondre à un appartement entièrement à refaire. Une vente à 12 000 € peut être un dernier étage avec terrasse. Sans connaître le bien, un chiffre isolé peut tromper autant qu'il informe.

## Comment je m'en sers

Pour une estimation, je ne garde que les ventes d'un seul logement, proches du bien et récentes. J'écarte les valeurs aberrantes. Puis je confronte ces références à ce que je vois pendant la visite, et à l'état du marché aujourd'hui, qui a pu bouger depuis les dernières ventes publiées.

Sur ce site, l'outil [les ventes autour de chez moi](/ventes-autour-de-chez-moi) fait ce premier tri pour vous. Vous entrez une adresse et une surface, il affiche les ventes comparables publiées dans le quartier. C'est un bon point de départ.

Pour aller plus loin, je vous montre une à une les références que je retiens pour votre bien, avec leur adresse et leur date. [Demander une estimation](/estimation).`,
  },
  {
    slug: "estimer-appartement-criteres-prix",
    category: "Méthode",
    date: "2026-10-27T05:12:00Z",
    title: "Estimer un appartement : ce qui fait bouger le prix",
    excerpt:
      "Deux appartements de même surface, dans la même rue, peuvent se vendre à des prix très différents. Voici ce que je regarde pendant une visite, et pourquoi.",
    content: `Deux appartements de 60 m², dans la même rue, vendus le même mois : il n'est pas rare de voir un écart de prix important entre les deux. Ce n'est pas un hasard. Voici ce que je regarde, dans l'ordre où je le regarde en général.

## L'étage et l'ascenseur

Un troisième étage sans ascenseur n'intéresse pas les mêmes acheteurs qu'un troisième avec ascenseur. Le rez-de-chaussée sur rue est souvent décoté, sauf s'il donne sur un jardin. Le dernier étage plaît, à condition que la toiture soit en bon état et que l'été reste supportable.

## La lumière

C'est le critère que les acheteurs mentionnent le plus en visite, et celui qu'aucune annonce ne rend vraiment. Je note l'exposition, la hauteur sous plafond, le vis-à-vis. Je viens si possible à l'heure où l'appartement est le plus beau, et je le dis honnêtement s'il est sombre.

## L'état et les travaux à prévoir

Un acheteur fait toujours le calcul des travaux, et il le fait rarement à la baisse. Une cuisine à refaire, une électricité ancienne, des fenêtres en simple vitrage : chaque poste pèse dans la négociation. Je préfère l'intégrer dans le prix dès le départ plutôt que de le découvrir en contre-offre.

## Le plan

Une entrée qui distribue bien les pièces, une cuisine qui peut s'ouvrir, une chambre qui ne donne pas sur le séjour. Deux appartements de même surface ne se vivent pas de la même façon. Les acheteurs le sentent en dix minutes de visite.

## L'extérieur

À Boulogne comme à Paris, un balcon ou une terrasse change la perception du bien. Je ne donne pas de pourcentage fixe : l'effet dépend de la taille, de l'exposition et du quartier.

## La copropriété

Je demande les procès-verbaux des dernières assemblées générales. Un ravalement voté, des charges élevées, une procédure en cours : tout cela compte pour l'acheteur et pour sa banque. À l'inverse, une copropriété bien tenue, avec des travaux déjà faits, rassure.

## L'étiquette énergie

Le DPE figure dans l'annonce et il est regardé. Une étiquette F ou G inquiète les acheteurs, surtout ceux qui veulent louer, car ces logements sont progressivement interdits à la location. J'en parle plus en détail dans [cet article sur le DPE](/actualites/dpe-vente-ce-que-change-etiquette-energie).

## Ce que je fais de tout ça

Je pars des ventes comparables publiées dans le quartier, puis j'ajuste critère par critère, en vous expliquant chaque ajustement. Vous pouvez commencer par regarder [les ventes autour de chez vous](/ventes-autour-de-chez-moi), et me demander ensuite [une estimation sur place](/estimation).`,
  },
  {
    slug: "vendre-au-bon-prix-pourquoi-surestimer-coute-cher",
    category: "Vendre",
    date: "2026-10-27T05:11:00Z",
    title: "Pourquoi un prix trop haut finit souvent par coûter cher",
    excerpt:
      "Afficher un prix ambitieux « pour voir » paraît sans risque. En pratique, une annonce trop chère perd ses meilleurs acheteurs dès les premières semaines.",
    content: `« On peut toujours essayer plus haut, on baissera si besoin. » J'entends cette phrase souvent. Elle paraît prudente. Elle l'est rarement.

## Les premières semaines comptent plus que les autres

Quand une annonce paraît, elle tombe dans les alertes de tous les acheteurs qui cherchent ce type de bien dans ce secteur. Ce sont les plus motivés : ils ont souvent un financement prêt et ont déjà visité plusieurs appartements. Ils connaissent les prix.

Si le prix est juste, ils appellent. S'il est trop haut, ils passent à l'annonce suivante. Et ils ne reviennent pas forcément quand le prix baisse, parce qu'entre-temps ils ont peut-être acheté ailleurs.

## Une annonce qui dure devient suspecte

Au bout de quelques semaines sans vente, les acheteurs se posent des questions. Qu'est-ce qui cloche ? Les visiteurs arrivent méfiants et cherchent le défaut. Et quand le prix finit par baisser, la baisse se voit : les portails gardent souvent la trace des annonces, et les acheteurs attentifs la remarquent.

La négociation qui suit part alors d'une position plus faible pour le vendeur. C'est ainsi qu'un bien affiché trop cher peut finir vendu moins cher que s'il avait été bien placé dès le départ.

## Pourquoi certains annoncent quand même des prix élevés

Je vais être franc sur un point que la profession évoque peu. Quand un propriétaire consulte plusieurs agents, la tentation existe d'annoncer le prix le plus élevé pour obtenir le mandat. Le propriétaire est content, l'agent a son mandat, et la baisse viendra plus tard.

Je ne travaille pas comme ça. Je vous donne le prix que je peux défendre devant un acheteur, avec les ventes comparables qui le justifient. Il est parfois moins agréable à entendre. Il fait gagner du temps, et souvent de l'argent.

## Comment vérifier le prix proposé

Demandez à celui qui estime votre bien sur quelles ventes il s'appuie. Des adresses, des dates, des surfaces. Si la réponse reste vague, méfiez-vous. Vous pouvez aussi regarder vous-même [les ventes publiées autour de chez vous](/ventes-autour-de-chez-moi).

Et si vous voulez un deuxième avis argumenté, [je peux venir voir votre bien](/estimation).`,
  },
  {
    slug: "diagnostics-obligatoires-vente-appartement",
    category: "Vendre",
    date: "2026-10-27T05:10:00Z",
    title: "Diagnostics obligatoires pour vendre un appartement",
    excerpt:
      "DPE, amiante, plomb, électricité, Carrez… Quels diagnostics sont exigés selon l'âge et la situation du bien, et combien de temps ils restent valables.",
    content: `Avant de signer un compromis, le vendeur doit fournir un dossier de diagnostic technique. Il est à sa charge. Mieux vaut le commander dès la mise en vente : le DPE doit de toute façon figurer dans l'annonce, et un diagnostic qui arrive tard peut retarder la signature.

Voici la liste, avec les conditions dans lesquelles chaque diagnostic est exigé.

## Ceux qui concernent presque tous les biens

- **DPE (diagnostic de performance énergétique)** : obligatoire pour la quasi-totalité des logements. Valable dix ans, mais les DPE réalisés avant le 1er juillet 2021 ne sont plus valables aujourd'hui.
- **État des risques et pollutions** : il indique si le bien se trouve dans une zone exposée à certains risques naturels, miniers ou technologiques. Il doit dater de moins de six mois.
- **Mesurage loi Carrez** : pour un lot de copropriété. Il reste valable tant qu'aucun travaux ne modifie la surface. J'y consacre [un article à part](/actualites/loi-carrez-mesurer-avant-de-vendre).

## Ceux qui dépendent de l'âge du bien

- **Amiante** : si le permis de construire a été délivré avant le 1er juillet 1997. Un résultat négatif établi depuis avril 2013 n'a pas de limite de validité.
- **Plomb (CREP)** : si le logement a été construit avant le 1er janvier 1949. Sans plomb détecté, il reste valable sans limite. Sinon, il doit avoir moins d'un an.
- **Électricité** : si l'installation a plus de quinze ans. Valable trois ans.
- **Gaz** : si l'installation a plus de quinze ans. Valable trois ans.

## Ceux qui dépendent de la localisation

- **Termites** : dans les zones délimitées par arrêté préfectoral. Valable six mois.
- **Mérule** : dans les zones déclarées par arrêté.
- **Bruit** : si le bien se trouve dans une zone d'exposition au bruit d'un aérodrome.
- **Assainissement non collectif** : pour une maison non raccordée au tout-à-l'égout. Valable trois ans.

## Mon conseil

Commandez tout au même diagnostiqueur, au même moment, en lui donnant l'année de construction et les éventuels travaux réalisés. Relisez ensuite le DPE avec attention : c'est celui qui pèsera le plus sur l'avis des acheteurs. Si vous vendez en copropriété, préparez aussi [les documents à réunir](/actualites/vendre-en-copropriete-documents-a-reunir).

Si vous avez un doute sur ce qui s'applique à votre bien, [appelez-moi](/contact) : je vous dirai lesquels commander.`,
  },
  {
    slug: "dpe-vente-ce-que-change-etiquette-energie",
    category: "Vendre",
    date: "2026-10-27T05:09:00Z",
    title: "DPE et vente : ce que l'étiquette énergie change",
    excerpt:
      "Interdiction progressive de louer les passoires thermiques, audit obligatoire pour certaines ventes, nouveau calcul pour l'électricité : ce qu'un vendeur doit savoir.",
    content: `Le DPE n'est plus un simple document annexé au compromis. Depuis qu'il a une valeur juridique et qu'il conditionne la location, les acheteurs le lisent de près. Voici ce qui compte quand on vend.

## Ce qui a changé ces dernières années

Depuis le 1er juillet 2021, le DPE est opposable : un acheteur peut se retourner contre le vendeur si l'étiquette est fausse. Il doit figurer dans l'annonce, avec une estimation des dépenses annuelles d'énergie.

Pour la location, le calendrier est fixé par la loi Climat et résilience. Les logements classés G ne peuvent plus être proposés à la location depuis le 1er janvier 2025 pour un nouveau bail. Ce sera le cas des logements F en 2028, puis des logements E en 2034. Les loyers des logements F et G sont par ailleurs gelés depuis août 2022.

## Ce que cela change pour le prix

Un acheteur qui veut louer ne peut pas ignorer ce calendrier. Il intègre le coût des travaux nécessaires, et parfois renonce. Un acheteur qui veut habiter le bien regarde surtout les factures et le confort, mais il fait lui aussi le calcul.

Dans la pratique, une mauvaise étiquette se traduit le plus souvent par une négociation plus serrée. Elle ne rend pas un bien invendable. Il faut simplement en tenir compte dans le prix affiché, plutôt que de le découvrir en contre-offre.

## L'audit énergétique

Pour une maison individuelle ou un immeuble vendu en entier (monopropriété), un audit énergétique est obligatoire lorsque l'étiquette est F ou G, depuis avril 2023, et E, depuis janvier 2025. Il propose des scénarios de travaux chiffrés. Il ne concerne pas les appartements vendus en copropriété.

## Le nouveau calcul pour l'électricité

Depuis le 1er janvier 2026, le coefficient appliqué à l'électricité dans le calcul du DPE est passé de 2,3 à 1,9. Concrètement, de nombreux logements chauffés à l'électricité gagnent une classe, parfois davantage. Si votre DPE date d'avant 2026 et que votre logement est chauffé à l'électricité, demandez à un diagnostiqueur s'il vaut la peine de le refaire avant la mise en vente.

## Avant de vendre

Je regarde toujours le DPE avec le vendeur avant de fixer un prix. Parfois, une petite intervention ou un DPE refait améliore la note. Parfois non, et il vaut mieux l'assumer clairement dans l'annonce. Dans les deux cas, je préfère que vous le sachiez avant les acheteurs. [Parlons de votre bien](/estimation).`,
  },
  {
    slug: "loi-carrez-mesurer-avant-de-vendre",
    category: "Juridique",
    date: "2026-10-27T05:08:00Z",
    title: "Loi Carrez : mesurer sans erreur avant de vendre",
    excerpt:
      "Une erreur de plus de 5 % sur la surface Carrez peut coûter cher au vendeur, même après la signature. Ce qui est compté, ce qui ne l'est pas, et les délais.",
    content: `La surface Carrez est le chiffre le plus regardé d'une annonce en copropriété, après le prix. Elle engage aussi le vendeur. Voici l'essentiel.

## Ce qui est compté

La loi Carrez s'applique aux lots de copropriété. Elle mesure la surface privative : celle des pièces closes et couvertes, après déduction des murs, des cloisons, des marches et cages d'escalier, des gaines et des embrasures de portes et de fenêtres.

## Ce qui n'est pas compté

- les parties dont la hauteur sous plafond est inférieure à 1,80 m, ce qui pèse lourd sous les combles ;
- les lots de moins de 8 m² ;
- les caves, les garages et les places de parking ;
- les balcons, terrasses et loggias non fermés.

C'est pour cela qu'un appartement sous les toits peut avoir une surface « au sol » bien supérieure à sa surface Carrez. L'annonce doit indiquer la seconde.

## Ce que risque le vendeur en cas d'erreur

Si la surface réelle est inférieure de plus de 5 % à celle indiquée dans l'acte, l'acheteur peut demander une baisse du prix proportionnelle à la surface manquante. Il dispose d'un an à compter de la signature de l'acte authentique.

Prenons un exemple. Un appartement vendu 600 000 € pour 60 m² qui n'en mesure en réalité que 56 : l'écart est d'environ 6,7 %. L'acheteur peut réclamer 40 000 €.

Si la surface n'est pas mentionnée du tout dans la promesse, l'acheteur peut demander l'annulation de la vente, dans le mois qui suit la signature de l'acte.

## Mon conseil

Faites mesurer le bien par un diagnostiqueur, et ne reprenez pas un vieux métrage hérité de l'achat sans vérifier qu'aucun travaux n'a modifié la surface. Une cloison déplacée, une mezzanine ajoutée, un placard créé : tout cela peut changer le chiffre.

Le mesurage fait partie des [diagnostics obligatoires](/actualites/diagnostics-obligatoires-vente-appartement). Je le demande toujours avant de mettre un bien en ligne, pour que le prix au m² affiché soit juste.`,
  },
  {
    slug: "calendrier-vente-immobiliere-compromis-acte",
    category: "Vendre",
    date: "2026-10-27T05:07:00Z",
    title: "De l'offre à l'acte : le calendrier d'une vente",
    excerpt:
      "Offre d'achat, compromis, délai de rétractation, prêt, droit de préemption, acte authentique : combien de temps prend une vente et qui fait quoi.",
    content: `Entre le moment où un acheteur dit oui et celui où vous remettez les clés, il se passe en général plusieurs mois. Voici les étapes, dans l'ordre, avec les délais fixés par la loi.

## 1. L'offre d'achat

L'acheteur fait une offre écrite, avec un prix et une durée de validité. Si vous l'acceptez par écrit, vous êtes d'accord sur la chose et sur le prix. En pratique, la vente se formalise ensuite par un avant-contrat.

Avant d'accepter, je vérifie avec vous le profil de l'acheteur : son apport, son plan de financement, l'accord de principe de sa banque s'il en a un. Une offre au prix avec un financement fragile vaut parfois moins qu'une offre un peu plus basse et solide.

## 2. Le compromis ou la promesse de vente

C'est l'avant-contrat, signé chez le notaire ou sous seing privé. Le compromis engage les deux parties. La promesse unilatérale engage le vendeur, l'acheteur disposant d'une option qu'il lève ou non.

Le dossier doit être complet à ce stade : titre de propriété, diagnostics, documents de copropriété. Plus il est prêt tôt, moins la signature traîne.

## 3. Le délai de rétractation

L'acheteur particulier dispose de dix jours pour se rétracter, sans motif ni pénalité. Le délai court à partir du lendemain de la remise ou de la notification de l'avant-contrat signé.

## 4. Le prêt

Si l'acheteur emprunte, le compromis comporte une condition suspensive d'obtention du prêt. Sa durée ne peut pas être inférieure à un mois. Si le prêt est refusé dans ce délai malgré des démarches sérieuses, la vente tombe et l'acheteur récupère son dépôt.

## 5. Le droit de préemption de la commune

Dans la plupart des villes, comme à Paris, la commune peut acheter le bien à la place de l'acquéreur. Le notaire lui adresse une déclaration d'intention d'aliéner. Elle a deux mois pour répondre. En pratique, elle renonce dans la grande majorité des cas, mais il faut attendre sa réponse ou l'expiration du délai.

## 6. L'acte authentique

Le notaire signe l'acte définitif une fois toutes les conditions levées. L'acheteur paie, vous remettez les clés. Entre le compromis et l'acte, il faut compter le plus souvent autour de trois mois.

## Pendant tout ce temps

Mon rôle ne s'arrête pas à la signature du compromis. Je suis le dossier avec le notaire, je relance la banque de l'acheteur si besoin, et je vous tiens au courant à chaque étape. Si vous préparez une vente, [parlons de votre calendrier](/formulaire).`,
  },
  {
    slug: "frais-de-notaire-qui-paie-quoi",
    category: "Fiscalité",
    date: "2026-10-27T05:06:00Z",
    title: "Frais de notaire : qui paie quoi lors d'une vente",
    excerpt:
      "Les « frais de notaire » sont surtout des taxes, et c'est l'acheteur qui les règle. Ce que le vendeur paie de son côté, et ce qui a changé en 2025.",
    content: `L'expression « frais de notaire » prête à confusion. La plus grande partie de la somme ne revient pas au notaire. Et dans une vente classique, ce n'est pas le vendeur qui la paie.

## Ce que paie l'acheteur

Les frais d'acquisition sont à la charge de l'acheteur, sauf accord contraire. Ils se composent :

- des droits de mutation, qui sont des taxes perçues par le département, la commune et l'État. C'est la part principale ;
- des émoluments du notaire, fixés par un barème réglementé et dégressif ;
- des débours, c'est-à-dire les frais avancés par le notaire pour obtenir les documents nécessaires ;
- de la contribution de sécurité immobilière.

Dans l'ancien, l'ensemble représente en général entre 7 et 8 % du prix. Dans le neuf, les frais sont réduits, autour de 2 à 3 %.

## Ce qui a changé en 2025

La loi de finances pour 2025 a permis aux départements de relever leur taux de droits de mutation de 4,5 % à 5 %, pour les ventes signées à partir du 1er avril 2025. Les primo-accédants qui achètent leur résidence principale sont exonérés de cette hausse. De nombreux départements l'ont appliquée. Le notaire vous donnera le montant exact pour votre bien.

## Ce que paie le vendeur

Le vendeur a lui aussi des frais, plus modestes :

- les diagnostics obligatoires ;
- l'état daté demandé au syndic en copropriété, dont le prix est plafonné à 380 € TTC ;
- la mainlevée de l'hypothèque si un prêt est encore en cours sur le bien ;
- l'impôt sur la plus-value, s'il est dû. J'en parle dans [un article dédié](/actualites/plus-value-immobiliere-quand-la-vente-est-imposee).

## Et les honoraires d'agence ?

Ils sont fixés dans le mandat, qui indique s'ils sont à la charge du vendeur ou de l'acheteur. L'annonce doit le préciser, ainsi que le prix avec et sans honoraires. Le barème d'Efficity est public, il est accessible depuis la page [mentions légales](/mentions-legales).

Si vous voulez une estimation de ce qui vous restera net après la vente, [je peux vous aider à faire le calcul](/contact).`,
  },
  {
    slug: "plus-value-immobiliere-quand-la-vente-est-imposee",
    category: "Fiscalité",
    date: "2026-10-27T05:05:00Z",
    title: "Plus-value immobilière : quand la vente est-elle imposée ?",
    excerpt:
      "La vente de la résidence principale est exonérée. Pour un appartement loué ou une résidence secondaire, l'impôt dépend surtout de la durée de détention.",
    content: `C'est une question qui revient presque à chaque rendez-vous, et elle mérite une réponse claire. Je ne suis pas fiscaliste, et votre notaire reste la référence. Voici les règles générales.

## La résidence principale : exonérée

Si vous vendez le logement qui est votre résidence principale au jour de la vente, la plus-value n'est pas imposée, quel que soit son montant et quelle que soit la durée pendant laquelle vous l'avez possédé.

L'exonération s'applique aussi si le logement est vendu peu après votre déménagement, à condition que vous ayez fait le nécessaire pour vendre dans un délai normal. L'administration admet en général un délai d'environ un an, à condition de ne pas louer le logement entre-temps.

## Les autres biens : un impôt qui diminue avec le temps

Pour un appartement loué, une résidence secondaire ou un bien hérité, la plus-value est soumise :

- à l'impôt sur le revenu, au taux de 19 % ;
- aux prélèvements sociaux, de 17,2 % jusqu'ici. Le taux a été discuté lors des derniers budgets : votre notaire vous confirmera celui qui s'applique à votre vente.

Des abattements réduisent la plus-value à partir de la sixième année de détention. Pour l'impôt sur le revenu, l'exonération est totale après vingt-deux ans. Pour les prélèvements sociaux, il faut attendre trente ans.

Une taxe supplémentaire s'ajoute lorsque la plus-value imposable dépasse 50 000 €.

## Comment se calcule la plus-value

C'est la différence entre le prix de vente et le prix d'achat. Le prix d'achat peut être majoré des frais d'acquisition, réels ou forfaitaires à 7,5 %, et des travaux. Au-delà de cinq ans de détention, un forfait de 15 % peut être retenu pour les travaux sans justificatif.

## Un cas particulier utile

La première vente d'un logement qui n'est pas votre résidence principale peut être exonérée si vous n'avez pas été propriétaire de votre résidence principale pendant les quatre années précédentes, et que vous réinvestissez le prix dans l'achat de votre résidence principale dans les deux ans.

## En pratique

Avant de fixer un prix, je vous recommande de demander au notaire une simulation de la plus-value. Le montant net que vous toucherez est ce qui compte vraiment pour votre projet. Si vous préparez la vente d'un bien locatif, [parlons-en](/contact).`,
  },
  {
    slug: "mandat-simple-ou-exclusif",
    category: "Vendre",
    date: "2026-10-27T05:04:00Z",
    title: "Mandat simple ou exclusif : ce que je conseille, et pourquoi",
    excerpt:
      "Confier sa vente à une seule agence ou à plusieurs ? Ce que dit la loi, ce que change chaque formule en pratique, et ma position, sans détour.",
    content: `C'est souvent la dernière question avant de se lancer, et elle crée des tensions inutiles. Je vais donner ma position. Mais d'abord, les règles.

## Ce que dit la loi

Un agent immobilier ne peut pas vendre votre bien sans mandat écrit. C'est la loi Hoguet. Le mandat fixe le prix, la durée, les honoraires et à qui ils incombent.

Le **mandat simple** vous laisse libre de confier la vente à plusieurs agences et de vendre vous-même.

Le **mandat exclusif** confie la vente à un seul professionnel. Il est irrévocable pendant les trois premiers mois. Ensuite, vous pouvez y mettre fin à tout moment par lettre recommandée, avec un préavis de quinze jours.

## Ce que change le mandat simple

Votre bien apparaît sur plusieurs vitrines. Cela rassure. Mais les acheteurs voient souvent la même annonce plusieurs fois, parfois à des prix différents, ce qui ne plaide pas pour le bien. Et aucune agence n'a vraiment intérêt à investir du temps dans des photos soignées, une annonce travaillée ou une sélection serrée des visiteurs, puisqu'une autre peut vendre avant elle.

## Ce que change le mandat exclusif

Un seul interlocuteur, un seul prix, une seule annonce. Celui qui a le mandat engage des moyens parce qu'il sait que le travail ne sera pas perdu. Il peut aussi le partager avec d'autres agents pour élargir la diffusion. En contrepartie, vous devez choisir avec soin la personne à qui vous le confiez.

## Ma position

Je travaille de préférence en exclusivité, parce que c'est la formule qui me permet de faire bien mon métier : préparer le bien, l'écrire, le photographier, filtrer les visites, défendre le prix. Mais je ne fais pas signer une exclusivité à quelqu'un qui n'est pas convaincu. Un mandat signé à contrecœur ne sert personne.

Mon conseil, quelle que soit la formule : regardez qui fixe le prix et sur quoi il le fonde. C'est ce qui décide le plus de la suite. [Parlons de votre projet](/formulaire).`,
  },
  {
    slug: "boulogne-billancourt-quartiers-marches-differents",
    category: "Quartiers",
    date: "2026-10-27T05:03:00Z",
    title: "Boulogne-Billancourt : une ville, plusieurs marchés",
    excerpt:
      "Boulogne-Billancourt compte six quartiers officiels et bien plus de micro-marchés. Ce qui distingue chacun d'eux quand on achète ou qu'on vend.",
    content: `Boulogne-Billancourt est souvent présentée comme un seul marché. Quand on y vend des appartements, on découvre vite que ce n'est pas le cas. La commune compte six quartiers officiels, et à l'intérieur de chacun, d'une rue à l'autre, les acheteurs ne cherchent pas la même chose.

Je ne donne pas de prix par quartier dans cet article : les chiffres bougent, et une moyenne de quartier ne dit pas grand-chose d'un appartement précis. Pour les ventes réelles, la page [le marché à Boulogne-Billancourt](/secteurs/boulogne-billancourt) est mise à jour à partir des données publiques.

## Boulogne Nord : Les Princes-Marmottan et Parchamp-Albert-Kahn

C'est la partie résidentielle la plus recherchée de la ville, entre le bois de Boulogne, le parc des Princes et le jardin Albert-Kahn. On y trouve des immeubles en pierre de taille, des années 1930 et des maisons. Les acheteurs viennent souvent du 16e arrondissement voisin et comparent avec Paris.

## Le centre-ville

Autour de la mairie et de la route de la Reine, le centre concentre les commerces, le marché et la ligne 10 du métro. Le bâti y est très varié, de l'ancien aux immeubles plus récents. C'est là que l'étage, la lumière et le bruit de la rue font les plus gros écarts entre deux appartements voisins.

## Silly-Gallieni

Quartier plus calme, avec beaucoup de familles, entre le centre et le sud de la ville. Les acheteurs y cherchent souvent de la surface et de bonnes écoles à pied.

## République-Point-du-Jour

À la limite du 16e, desservi par la ligne 9. Un quartier vivant, avec un parc immobilier mêlant ancien et années 1960-1970, qui attire beaucoup d'acheteurs parisiens.

## Billancourt-Rives de Seine et le Trapèze

Sur les anciens terrains Renault, le Trapèze et l'île Seguin forment un quartier récent : immeubles neufs, parc de Billancourt, La Seine Musicale. Les appartements y sont plus standardisés, ce qui rend la comparaison plus facile, et la concurrence entre vendeurs plus directe.

## Ce que j'en retiens

Pour estimer un bien à Boulogne, je compare d'abord avec les ventes de la même rue et du même type d'immeuble. Le quartier vient ensuite. Si vous voulez savoir ce qui s'est vendu près de chez vous, commencez par [l'outil des ventes autour de chez moi](/ventes-autour-de-chez-moi).`,
  },
  {
    slug: "issy-les-moulineaux-ou-boulogne-comparer",
    category: "Quartiers",
    date: "2026-10-27T05:02:00Z",
    title: "Issy-les-Moulineaux ou Boulogne : comparer sans se tromper",
    excerpt:
      "Deux villes voisines, deux marchés distincts. Ce qui les sépare vraiment quand on compare des appartements, et pourquoi le prix au m² ne suffit pas.",
    content: `Beaucoup d'acheteurs hésitent entre Boulogne-Billancourt et Issy-les-Moulineaux. Beaucoup de vendeurs regardent aussi ce qui se vend de l'autre côté de la limite. Les deux villes se touchent, mais leurs marchés ne fonctionnent pas tout à fait de la même façon.

## Le bâti n'est pas le même

À Boulogne, une grande partie du parc est ancienne ou date de l'entre-deux-guerres, avec des immeubles plus récents dans le sud de la ville. À Issy, la part de logements construits depuis les années 1990 est importante, notamment au bord de la Seine et au Fort d'Issy, écoquartier bâti sur un ancien fort militaire. À surface égale, on ne compare donc pas toujours les mêmes appartements.

C'est pour cela qu'à Issy, l'époque de construction explique souvent les écarts de prix davantage que l'adresse.

## Les transports

Issy est desservie par la ligne 12 du métro, le RER C et le tramway T2 le long de la Seine. Boulogne par les lignes 9 et 10. La future ligne 15 du Grand Paris Express doit desservir les deux villes, avec une gare à Pont de Sèvres côté Boulogne et une à Issy RER. Pour un acheteur qui travaille à La Défense ou dans le sud de Paris, ces différences comptent.

## Comment comparer correctement

Comparer deux prix moyens au m² n'a pas beaucoup de sens. Je compare plutôt des biens qui se ressemblent : même époque de construction, même étage, même état, extérieur ou non. Les pages [Boulogne-Billancourt](/secteurs/boulogne-billancourt) et [Issy-les-Moulineaux](/secteurs/issy-les-moulineaux) affichent les ventes publiées dans chaque ville, avec leur répartition par nombre de pièces.

## Pour un vendeur

Si votre appartement se trouve près de la limite entre les deux communes, vos acheteurs regarderont des deux côtés. Votre prix doit tenir face aux biens comparables des deux villes. C'est un des points que je vérifie quand j'estime un bien dans ce secteur. [Demander une estimation](/estimation).`,
  },
  {
    slug: "vendre-appartement-occupe-ou-loue",
    category: "Juridique",
    date: "2026-10-27T05:01:00Z",
    title: "Vendre un appartement loué : vendre occupé ou donner congé ?",
    excerpt:
      "Bail vide ou meublé, droit de préemption du locataire, préavis, locataire protégé : les règles pour vendre un logement loué, et les choix possibles.",
    content: `Vendre un appartement loué pose une question de départ : le vendre avec le locataire en place, ou attendre la fin du bail pour le vendre libre. Les deux options sont possibles. Elles n'ont pas les mêmes conséquences.

## Vendre occupé

Le bail continue simplement avec le nouveau propriétaire. Le locataire reste, aux mêmes conditions. Vous pouvez vendre à tout moment, sans attendre l'échéance du bail.

En contrepartie, le bien n'intéresse plus que des investisseurs, ou des acheteurs prêts à attendre. Un logement occupé se vend en général moins cher qu'un logement libre. L'écart dépend du loyer, de la durée restante du bail et de l'âge du locataire.

## Donner congé pour vendre : bail vide

Pour un logement loué vide, vous pouvez donner congé pour vendre, mais seulement pour la date d'échéance du bail, et au moins six mois avant. Le congé doit indiquer le prix et les conditions de la vente.

Il vaut offre de vente au locataire : celui-ci bénéficie d'un droit de préemption et peut accepter pendant les deux premiers mois du préavis. S'il refuse et que vous baissez ensuite le prix, vous devez le lui proposer de nouveau.

Certains locataires sont protégés : ceux de plus de 65 ans dont les ressources sont inférieures à un plafond. Le propriétaire doit alors leur proposer un relogement, sauf exceptions liées à son propre âge ou à ses ressources.

## Donner congé pour vendre : bail meublé

Pour un meublé, le congé doit être donné au moins trois mois avant l'échéance. Le locataire n'a pas de droit de préemption légal.

## Que choisir ?

Tout dépend du calendrier, du montant du loyer et de ce que vous comptez faire du produit de la vente. Je fais en général les deux calculs avec le vendeur : prix probable occupé tout de suite, prix probable libre plus tard, en tenant compte des loyers perçus d'ici là et des frais éventuels.

Le congé est un acte précis, avec des mentions obligatoires. Faites-le relire par un professionnel avant de l'envoyer. Si vous envisagez de vendre un bien loué, [parlons-en](/contact).`,
  },
  {
    slug: "vendre-en-copropriete-documents-a-reunir",
    category: "Juridique",
    date: "2026-10-27T05:00:00Z",
    title: "Vendre en copropriété : les documents à réunir dès le départ",
    excerpt:
      "Règlement de copropriété, procès-verbaux d'assemblée, charges, fonds de travaux, état daté : la liste des pièces exigées pour vendre, et où les trouver.",
    content: `Un compromis qui tarde à se signer, c'est souvent un dossier incomplet. En copropriété, la loi impose de remettre à l'acheteur un ensemble de documents avant la signature de l'avant-contrat. Les réunir dès la mise en vente fait gagner des semaines.

## Les documents sur la copropriété

- le règlement de copropriété et l'état descriptif de division, avec leurs modifications ;
- les procès-verbaux des assemblées générales des trois dernières années ;
- la fiche synthétique de la copropriété, établie par le syndic ;
- le carnet d'entretien de l'immeuble ;
- le diagnostic technique global ou le plan pluriannuel de travaux, s'ils existent.

## Les documents financiers

- le montant des charges courantes et des charges hors budget payées par le vendeur au cours des deux exercices précédents ;
- les sommes qui resteront dues par le vendeur et celles que l'acheteur devra payer ;
- l'état global des impayés de charges dans la copropriété et de la dette envers les fournisseurs ;
- la quote-part du fonds de travaux attachée au lot.

La plupart de ces informations figurent dans un document que le syndic peut fournir, souvent appelé « pré-état daté ». Avant l'acte définitif, le notaire demande ensuite au syndic l'état daté, dont le prix est plafonné à 380 € TTC.

## Où les trouver

Beaucoup de syndics mettent ces documents à disposition dans l'espace en ligne des copropriétaires. Sinon, il faut les demander par écrit. Comptez quelques jours à quelques semaines selon le syndic.

## Pourquoi je les lis

Je ne me contente pas de les transmettre au notaire. Je lis les procès-verbaux avant de fixer le prix. Un ravalement voté, une procédure contre un copropriétaire, des travaux de toiture à venir : l'acheteur le découvrira, et sa banque aussi. Mieux vaut l'avoir anticipé dans le prix et dans la façon de présenter le bien.

Pour le reste du dossier, voir aussi [la liste des diagnostics obligatoires](/actualites/diagnostics-obligatoires-vente-appartement). Si vous préparez une vente, [je vous aide à constituer le dossier](/formulaire).`,
  },
];

export const LOCAL_ARTICLES: Article[] = DRAFTS.map(({ date, ...a }) => ({
  ...a,
  id: `local-${a.slug}`,
  cover_url: null,
  published: true,
  published_at: date,
  created_at: date,
  updated_at: date,
}));
