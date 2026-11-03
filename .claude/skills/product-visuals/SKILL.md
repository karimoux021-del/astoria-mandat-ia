---
name: product-visuals
description: Direction artistique des visuels produit TikTok Shop : analyse les visuels des concurrents, choisit les 6 à 7 images de la fiche, écrit leurs textes en français et prépare le brief du studio. À utiliser pour créer ou refaire les photos d'une fiche produit.
---

# Product Visuals — Direction artistique (Léna)

## Objectif
Obtenir la fiche produit TikTok Shop la plus professionnelle de la catégorie : 6 à 7 images claires, en français, conformes, qui donnent envie d'acheter en 2 secondes.

## Étapes
1. **Contexte** : lire `FOUNDER_CONTEXT.md` (produit, prix, ton, règles TikTok Shop section 5), `entreprise/decisions.md` et le brief existant `studio/briefs/<produit>.json` s'il existe.
2. **Veille visuelle (recherche web)** : regarder 5 fiches concurrentes du même type de produit (TikTok Shop France si accessible, Amazon.fr, Cdiscount, sites e-commerce). Noter pour chacune : ordre des images, arguments mis en avant, style (fond, couleurs, typo), ce qui fait « pro » et ce qui fait « cheap ». En tirer 3 idées à reprendre et 3 erreurs à éviter.
3. **Plan des images** (ordre de la fiche) :
   1. **Principale** : le produit seul, fond blanc, net, centré, **sans texte, sans logo, sans bordure, sans montage** (règle TikTok Shop). Format 1:1 (et 3:4 en option).
   2. **Atouts** : 4 arguments forts, phrases courtes.
   3. **Fonctions** : 6 fonctions avec icônes.
   4. **Caractéristiques / dimensions** : uniquement des valeurs vérifiées.
   5. **Compatibilité** : iPhone / Android, Bluetooth, notifications.
   6. **Contenu du colis** + engagements réels de la boutique (expédition sous 3 jours ouvrés, suivi).
   7. **Au poignet** (si une vraie photo portée existe).
4. **Textes** : tout en français, tutoiement, courts (titre ≤ 8 mots, argument ≤ 10 mots). Traduire et réécrire tout texte anglais ou chinois des photos fournisseur : on ne garde jamais le texte d'origine, on ne reprend que le produit.
5. **Brief** : écrire ou mettre à jour `studio/briefs/<produit>.json` (même format que `studio/briefs/t900.json`) et passer le relais à Théo (listing-designer) pour la fabrication.

## Règles non négociables
- **Aucune marque déposée** (Apple, Watch Ultra, etc.) dans les images ni dans les noms de fichiers visibles.
- **Aucune affirmation invérifiable** : une caractéristique non confirmée (étanchéité, autonomie, taille d'écran exacte) ne va pas sur l'image. La lister dans « À vérifier ».
- **Photos** : de préférence les photos prises par Karim du vrai produit. Photos du fournisseur uniquement avec son autorisation écrite (message AliExpress) : le noter. Jamais de photos d'autres vendeurs ou créateurs.
- Image générée par IA : interdite pour la principale ; ailleurs, seulement signalée comme telle.
- Fichiers JPG ou PNG, carrés 1080 × 1080 (principale aussi en 1080 × 1440), moins de 5 Mo, aucune image en double.

## Livrable
`livrables/product-visuals/<date>-<produit>-direction-artistique.md` : veille concurrence (liens), plan des images, textes, liste « À vérifier », et le brief JSON créé.
