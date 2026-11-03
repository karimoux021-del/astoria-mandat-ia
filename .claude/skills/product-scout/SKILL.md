---
name: product-scout
description: Trouve et compare de nouveaux produits (ou un meilleur modèle) à vendre sur TikTok Shop France, avec fournisseurs, prix d'achat réels et risques. À utiliser pour chercher un nouveau produit ou une montée en gamme.
---

# Product Scout — Chasseur de produits

## Objectif
Proposer 3 à 5 produits (ou modèles) concrets à lancer, sourcés et chiffrés, classés par potentiel de marge nette et de vente sur TikTok Shop France.

## Étapes
1. **Contexte** : lire `FOUNDER_CONTEXT.md` (produit actuel, frais TikTok Shop, règles, temps limité du fondateur).
2. **Recherche web obligatoire** :
   - Fournisseurs : AliExpress, Alibaba, CJ Dropshipping, fournisseurs européens. Relever le prix unitaire, le prix par 10/50 pièces, les frais de port vers la France, le délai, la note du vendeur et le nombre de commandes.
   - Demande : produits similaires visibles sur TikTok Shop France, Amazon.fr, Cdiscount ; prix de vente constatés ; avis clients (ce qu'ils aiment, ce qu'ils reprochent).
   - Tendance : Google Trends, vidéos TikTok récentes.
3. **Filtrer** : écarter tout produit qui copie une marque déposée (nom, logo, design protégé), qui n'a pas de marquage CE, qui est fragile ou trop cher à expédier, ou qui contient des batteries non conformes.
4. **Chiffrer chaque piste** avec la méthode de calcul ci-dessous.

## Calcul de la marge nette par vente (TikTok Shop France)
- Commission TikTok Shop ≈ 9 % du prix produit + frais REP ≈ 0,50 € (électronique avec batterie) + promotion ≈ 0,02 €.
- Le client paie la livraison 4,99 € et TikTok Shop fournit l'étiquette.
- Marge nette = prix de vente − frais TikTok − prix d'achat livré (produit + port fournisseur / quantité).
- Donner la marge pour 2 ou 3 prix de vente (ex. 24,99 €, 29,99 €, 34,99 €).

## Format de sortie
```
## Pistes produits — [date]
| Produit | Prix d'achat livré | Prix de vente conseillé | Marge nette / vente | Demande | Risque |
### Piste 1 : … (lien fournisseur, pourquoi ça peut marcher, risques, test conseillé)
### Recommandation : par quoi commencer et quelle quantité de test
### Sources
```

## Règles
- Aucun chiffre inventé : chaque prix a sa source (lien + date). Sinon « Non trouvé ».
- Toujours proposer une **commande test** petite (10 à 20 pièces) avant d'investir plus.
- Rester simple : le fondateur a peu de temps.
