---
name: pricing-strategist
description: Construit une stratégie de prix (paliers, prix, positionnement) pour un produit ou service, adaptée au marché français. À utiliser pour toute question de tarification.
---

# Pricing Strategist

Adapté de ognjengt/founder-skills (MIT).

## Objectif
Livrer une stratégie de prix complète et justifiée : modèle, paliers, prix, positionnement, leviers de revenu.

## Étapes

### 1. Contexte
Si `FOUNDER_CONTEXT.md` existe à la racine du projet, le lire d'abord. Sinon, utiliser la conversation : produit/service, cible, concurrents et leurs prix, proposition de valeur, stade, objectifs de CA. Ne jamais redemander ce qui est déjà connu.

### 2. Questions (seulement si l'info manque, 7 max, par lots de 4 max via AskUserQuestion)
1. B2B ou B2C ?
2. Modèle préféré ou à éviter (abonnement, paiement unique, à l'usage, freemium, forfaits/packs) ?
3. Métrique de valeur qui croît avec l'usage (rapports, heures, km, invités, utilisateurs…) ?
4. Marge brute visée ?
5. Sensibilité prix de la cible ?
6. Concurrents directs et leurs prix ?
7. Stade / objectif de CA ?
S'arrêter dès que l'info suffit.

### 3. Choisir la structure (décider soi-même, justifier)
- Abonnement B2B → paliers SaaS (Starter / Pro / Business)
- Abonnement B2C → Gratuit / Essentiel / Premium
- À l'usage → forfait de base + tranches
- Achat unique ou prestation (événementiel, service) → packs Bon / Mieux / Top
- Signaux mixtes → hybride

### 4. Pour chaque palier
- Nom parlant
- Prix en € (TTC pour du B2C, HT pour du B2B — le préciser), mensuel + annuel (~20 % de remise) si abonnement
- Justification du prix (concurrence, valeur, marge, disposition à payer) — jamais de prix nu
- Contenu inclus et ce qui est volontairement exclu pour pousser à l'upgrade
- Client cible précis

### 5. Couche stratégique
- Positionnement face aux concurrents nommés
- Leviers psychologiques utilisés (ancrage, leurre, prix en 7/9…) et pourquoi
- Déclencheurs d'upgrade
- Optimisation du revenu (options, add-ons, acompte, remise annuelle, upsell)
- Le risque prix principal pour CE business et comment le surveiller

## Principes
- Prix sur la valeur, jamais sur le coût de fabrication (le coût fixe seulement le plancher).
- 4 paliers max ; 3 par défaut. Le palier du milieu est le héros.
- Le palier haut sert d'ancre.
- Un freemium n'a de sens que si le gratuit est vraiment utile.
- Contexte France : TVA (préciser si l'utilisateur est en franchise de TVA, auto-entrepreneur), affichage TTC obligatoire en B2C, droit de rétractation de 14 jours pour la vente en ligne aux particuliers.

## Format de sortie
```
## Stratégie de prix — [Nom]
**Structure :** … **Pourquoi :** 2-3 phrases
### [Palier] — Prix · Pour qui · Inclus · Justification
(répéter)
### Positionnement & psychologie
### Optimisation du revenu (3 actions concrètes)
### Risque principal
### Hypothèses retenues
```

## Vérification avant envoi
Chaque prix justifié ; palier du milieu = meilleur rapport ; ≤ 4 paliers ; positionnement spécifique au business ; risque non générique ; hypothèses listées.

## Valeurs par défaut
3 paliers, remise annuelle 20 %, sensibilité prix modérée, devise EUR. Documenter toute hypothèse.
