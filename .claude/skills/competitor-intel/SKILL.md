---
name: competitor-intel
description: Analyse un concurrent par recherche web : chiffres vérifiés et sourcés, faiblesses exploitables, prochains mouvements probables. À utiliser pour toute analyse concurrentielle.
---

# Competitor Intel

Adapté de ognjengt/founder-skills (MIT).

## Objectif
Renseignement concurrentiel fondé sur des données réelles — aucun chiffre inventé.

## Étapes

### 1. Contexte
Si `FOUNDER_CONTEXT.md` existe à la racine du projet, le lire pour orienter les stratégies (positionnement, forces, objectifs). Extraire de la demande : nom du concurrent (obligatoire), site, secteur, angles d'intérêt.

### 2. Recherche web — OBLIGATOIRE
Ne pas s'appuyer sur la mémoire d'entraînement seule. Chercher :
- **Chiffres** : CA, levées, valorisation, effectifs, nb clients, prix. Pour une société française : Pappers, Societe.com, Infogreffe (comptes déposés), presse (Maddyness, Les Échos, BFM). Sinon Crunchbase, LinkedIn.
- **Trafic & SEO** : Similarweb, Semrush/Ahrefs, Google Trends, BuiltWith.
- **Pub** : Meta Ads Library, campagnes Google visibles.
- **Faiblesses & avis** : Trustpilot, Avis Vérifiés, Google Avis, G2/Capterra si SaaS, forums, Reddit ; plaintes, licenciements, litiges, sanctions (DGCCRF, CNIL).
- **Signaux** : offres d'emploi, nouveautés produit, partenariats, posts des fondateurs.

### 3. Compiler les chiffres vérifiés
Chaque chiffre avec source + date. Sinon : « Non public ». Aucune estimation.

### 4. 3 stratégies de levier
Chacune exploite une faiblesse vérifiée (produit, service, prix, confiance, opérations, marketing), avec preuve et 3 actions concrètes faisables en 30-90 jours, sans gros capital sauf si l'utilisateur en dispose.

### 5. Prochains mouvements prédits
Interpréter les signaux (recrutements tech = push produit, commerciaux = croissance, support = problèmes d'échelle ; levée récente = expansion ; pas de levée depuis 2 ans = possible difficulté). Chaque prédiction cite ses signaux, confiance honnête (pas tout « Élevée »).

## Règles
- Ton analytique, pas de dénigrement.
- Sources primaires d'abord (annonces, comptes déposés, interviews).
- Données de moins de 12 mois en priorité ; dater tout.

## Format de sortie
```
# Intel concurrent : [Nom]
**Généré le :** … **Sources consultées :** N
## 1. Chiffres vérifiés (tableau Métrique | Valeur | Source | Date) + 2 observations
## 2. Stratégies de levier (x3) : faiblesse · preuve · actions · résultat attendu
## 3. Prochains mouvements (x2) : confiance · signaux · implication pour toi
## 4. Angles morts + comment les combler
```

## Vérification avant envoi
Recherche web faite sur chiffres, avis, trafic, pub ; chaque chiffre sourcé ou « Non public » ; stratégies basées sur des faiblesses vérifiées ; prédictions sourcées ; lacunes reconnues.
