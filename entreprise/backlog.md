# Backlog Astoria Mods

Règle : chaque ligne = une tâche, son responsable, son statut (à faire / en cours / fait / bloqué) et le lien du livrable.

## Organisation
- [x] **Alexandre (general-manager)** : hiérarchie en place (DG + 5 chefs de pôle, contrôle qualité, rapports dans `entreprise/rapports/`). — fait le 20/10 (validé par Karim)
- [x] **Chefs de pôle (department-head)** : contrôle des livrables du 20/10 + rapports → `entreprise/rapports/2026-10-20-*.md`. — fait le 20/10

## Priorité 1 — Nouveau produit à plus forte marge
- [x] **Sami (product-scout)** : trouver 5 montres connectées plus haut de gamme avec liens fournisseurs, prix d'achat, délais. — fait le 20/10 → `livrables/product-scout/2026-10-20-montres-premium.md` (piste n° 1 : réf. P86 AMOLED 1,93" ; prix indicatifs, AliExpress bloqué en accès direct)
- [x] **Maëlle (margin-analyst)** : marge nette des modèles de Sami à 24,99 / 29,99 / 34,99 €. — fait le 20/10 → `livrables/margin-analyst/2026-10-20-marges-montres-premium.md` (P86 à 29,99 € : 11,73 €/vente si achat ≈ 15 €)
- [x] **Noé (trend-scout)** : demande TikTok Shop France + formats vidéo. — fait le 20/10 → `livrables/trend-scout/2026-10-20-demande-montres-premium.md` (pic Black Friday 27/11 → Noël)
- [ ] **Karim** : commander 1 échantillon P86 cette semaine si ≤ 16 € livré sur fr.aliexpress, après avoir demandé la déclaration CE au vendeur. — à faire (décidé le 20/10, d1 : A)
- [x] **Clara (sop-creator)** : protocole de test de l'échantillon en 3 jours. — fait le 20/10 → `livrables/sop-creator/2026-10-20-sop-video-et-test-echantillon.md`
- [x] **Sami (product-scout)** : fournisseurs alternatifs de la P86 / GTS 4. — fait le 20/10 → `livrables/product-scout/2026-10-20-fournisseurs-p86.md` (aucune alternative rentable : seule la boutique officielle AliExpress permet ≤ 16 € ; commander les 10 pièces au plus tard le 05/11 pour le Black Friday)
- [x] **Victor (competitor-intel)** : veille des montres AMOLED avec appels. — fait le 20/10 → `livrables/competitor-intel/2026-10-20-veille-montres-amoled.md` (P86 vue à 25–34 € en France ; proposition : 27,99 € pendant le Black Friday)
- [ ] **Léa (pricing-strategist)** : calendrier de prix de la P86 (29,99 € au lancement → prix Black Friday) selon la décision de Karim. — à faire
- [ ] **Karim** : vérifier sur téléphone 2 prix concurrents de la P86 (Powerplanet, TikTok Shop FR). — à faire (5 min)
- [ ] **Jade (launch-manager)** : plan de lancement 4 semaines de la P86 à **29,99 €** (échantillon → test 3 jours → 10 pièces avant le 05/11 → fiche → vidéos → Black Friday / Noël). — à faire (priorité de demain)

## Priorité 2 — Écouler les ~15 montres restantes
- [x] **Inès (viral-hook-creator) + Jules (brand-copywriter)** : 3 scripts « dernières pièces » à 15 €. — fait le 20/10 → `livrables/viral-hook-creator/2026-10-20-scripts-dernieres-pieces.md`
- [x] **Zoé (marketing-ideas)** : finir le stock sans baisser la marge. — fait le 20/10 → `livrables/marketing-ideas/2026-10-20-finir-le-stock.md` (prix normal + vidéos ; pack duo 27,99 € en renfort au 01/11)
- [ ] **Karim** : tourner les 3 scripts (≈ 30 min au total) et les publier sur 3 jours, prix inchangé à 15 €. — à faire (d3 : A)
- [ ] **Zoé (marketing-ideas)** : au 01/11, si stock > 8 pièces, préparer le pack duo 27,99 €. — à faire (01/11)
- [x] **Clara (sop-creator)** : SOP « publier une vidéo TikTok Shop conforme ». — fait le 20/10 → même fichier

## Priorité 3 — Préparer la suite
- [ ] **Camille (strategic-planning)** : bilan hebdomadaire et 3 priorités de la semaine. — chaque lundi
- [ ] **Victor (competitor-intel)** : veille des vendeurs de montres sur TikTok Shop France. — chaque semaine
- [ ] **Yanis (prd-generator)** : cadrer le projet « relier TikTok Shop aux bureaux » (quelles données, API Partner TikTok Shop ou export manuel). — à faire

## Studio visuels (pôle Marketing)
- [x] **Léna (product-visuals)** : veille visuelle + plan des 7 images + brief T900. — fait le 20/10 → `livrables/product-visuals/2026-10-20-t900-direction-artistique.md`
- [x] **Théo (listing-designer)** : retirer « iPhone » des titres par défaut du gabarit. — fait le 20/10 (`studio/templates/visuels.html`)
- [ ] **Karim** : déposer 4 photos de la T900 dans `visuels/sources/t900/` (principale, profil, colis, poignet ; feuille blanche, lumière du jour). — à faire (15 min)
- [ ] **Théo (listing-designer)** : produire les visuels de la T900 avec `node studio/render.cjs studio/briefs/t900.json` dès que Karim a déposé ses photos dans `visuels/sources/t900/`. — bloqué (photos de Karim)
- [ ] **Léna + Théo** : brief et visuels de la P86 (photos fournisseur seulement avec autorisation écrite ; vraies photos à la réception de l'échantillon). — à faire après la décision d'achat

## Idées de l'équipe (à proposer à Karim)
- **Victor** (20/10) : P86 à 27,99 € pendant le Black Friday et Noël (−1,82 €/vente, 9,91 € de marge) pour se rapprocher des ≈ 25 € constatés ailleurs ; jamais sous 24,99 €.
- **Inès** (20/10) : vidéo « test appel au poignet » tournée avec l'échantillon (preuve contre le reproche n° 2 des clients : la qualité du son).
- **Zoé** (20/10) : Live TikTok « dernières pièces » de 20 min un soir de semaine, 0 € de pub (vérifier l'accès au LIVE Shopping du compte).
- **Noé** (20/10) : vidéo comparatif côte à côte « 15 € vs 29,99 € » pour vendre les deux gammes à la fois.
- **Sami** (20/10) : le boîtier « ultra » 49 mm actuel ressemble au design d'une montre de marque ; ne pas en recommander après le déstockage, privilégier des formes génériques (risque propriété intellectuelle).
- **Maëlle** (20/10) : garder la montre ronde GPS (Btalk 3) pour un futur palier 39,99–44,99 €.
