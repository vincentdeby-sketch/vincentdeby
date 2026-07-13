# Refonte site d'estimation immobilière

Projet ambitieux : nouveau design éditorial haut de gamme, formulaire d'estimation multi-étapes avec carte OSM, back-office admin. Je découpe en lots livrables.

## Direction artistique (verrouillée)

- Palette : blanc cassé `#F7F5F0`, beige `#E8E1D5`, anthracite `#1A1A1A`, accent vert bouteille `#2A4A3E` (ajustable si tu préfères or mat ou bleu nuit — dis-le moi).
- Typo : **Fraunces** (serif, titres) + **Inter** (sans-serif, corps), chargées via `<link>` dans `__root.tsx`.
- Micro-interactions : fade-in au scroll, hover subtil, aucune ombre lourde, aucun dégradé, aucun emoji, aucune icône 3D.
- Grandes photos immo pleine largeur (générées via imagegen, style photographie architecturale naturelle).

## Backend (Lovable Cloud)

Activation de Cloud pour :
- **Auth admin** : email/password (compte créé à la main dans le dashboard, pas de signup public).
- **Tables** : `articles`, `properties`, `estimations`, + `user_roles` (rôle `admin` avec `has_role()` SECURITY DEFINER — pattern anti-recursion RLS).
- **Storage** : bucket public `media` pour photos articles/biens.
- RLS : lecture publique sur `articles`/`properties` publiés ; écriture réservée aux admins ; `estimations` insertion publique, lecture admin uniquement.

## Structure des routes (TanStack Start)

```
/                       Accueil (hero, réassurance, 3 news, 3 biens, CTA)
/actualites             Liste articles
/actualites/$slug       Détail article
/biens                  Liste biens en ligne
/biens/$id              Détail bien
/estimation             Formulaire multi-étapes
/auth                   Login admin (discret)
/_authenticated/admin              Dashboard
/_authenticated/admin/articles     CRUD news
/_authenticated/admin/biens        CRUD biens
/_authenticated/admin/estimations  Liste demandes reçues
```

## Formulaire d'estimation (5 étapes)

State géré en React, persisté dans `sessionStorage` pour ne pas perdre la progression. Validation Zod par étape.

1. **Adresse** — input avec autocomplétion Nominatim (debounce 400ms, User-Agent custom conformément aux TOS OSM), Leaflet + tuiles OSM affichant marker dès sélection.
2. **Type de bien** — maison / appartement / terrain / local commercial.
3. **Caractéristiques** — champs conditionnels selon type : surface, terrain, pièces, chambres, SdB, étage/ascenseur, année, état, DPE, chauffage, garage/parking, extérieurs, exposition/vue, copro (charges, syndic), proximité (transports, commerces, écoles), nuisances.
4. **Coordonnées** — nom, email, téléphone (Zod).
5. **Récapitulatif** — relecture + envoi → insert dans `estimations` + écran de confirmation humain et sobre.

## Admin

- Header du site public : lien « Espace pro » discret (bas de page + petit lien en nav).
- `/auth` : login email/password uniquement (pas de signup).
- Layout `_authenticated` (managé par l'intégration Supabase, `ssr: false`).
- Vérif rôle admin via `has_role()` dans chaque page admin, sinon redirect `/`.
- CRUD via server functions `createServerFn` avec `requireSupabaseAuth` + check `admin`.
- Upload images via storage bucket.

## Détails techniques

- `leaflet` + `react-leaflet` (dynamic import client-only, Leaflet ne supporte pas le SSR).
- CSS Leaflet chargé via CDN `<link>` dans `__root.tsx`.
- Nominatim : appelé côté client (public, pas de clé), header `Referer` implicite ; respect du rate limit (1 req/s + debounce).
- Toutes les tables ont `GRANT` explicites (`authenticated`, `anon` là où requis, `service_role`).
- `head()` par route (titre + description + og) — pas de defaults « Lovable App ».
- Responsive : grid mobile-first, carte 300px mobile / 500px desktop.

## Livraison

Je vais tout construire en une passe (design system + routes publiques + estimation + admin + Cloud). C'est volumineux mais cohérent — mieux vaut un seul lot que des allers-retours.

## Questions rapides avant de démarrer

1. **Couleur d'accent** : je pars sur **vert bouteille** `#2A4A3E`. Tu préfères **or mat** `#B8985A` ou **bleu nuit** `#1E3A5F` ?
2. **Nom de l'agence** à afficher (logo texte) ? Sinon je mets un placeholder « Maison & Associés ».
3. **Compte admin** : je crée la table `user_roles` et je te laisse créer ton user via l'UI Cloud puis je te montre comment te grant `admin`, ou tu veux que je seed un email précis ?
4. **Estimation** : après envoi, on stocke la demande et un admin recontacte (pas de calcul auto) — OK ? Ou tu veux un calcul indicatif automatique basé sur les critères ?

Réponds à ces 4 points (ou dis « go avec tes defaults ») et je lance la construction.