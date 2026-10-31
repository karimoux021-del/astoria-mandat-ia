# Mini-PRD : relier TikTok Shop aux bureaux d'Astoria
> Contrôle : Validé par Bastien, chef du pôle Ventes & opérations, le 21/10/2026 — palier A applicable dès demain, règles de sécurité claires (aucun identifiant ni donnée client dans le dépôt) ; détails de l'API non vérifiés sur la doc officielle.

- **Auteur** : Yanis (prd-generator), pôle Ventes & opérations. **Date** : 21/10/2026
- **Statut** : à valider par Bastien (chef de pôle), puis décision de Karim
- **Origine** : `FOUNDER_CONTEXT.md` §0 (« Projet suivant ») et rapport Ventes du 20/10/2026

## 1. Problème et objectif

L'équipe IA met à jour les bureaux (page web hébergée et sa petite base partagée) chaque jour, mais elle ne voit aucun chiffre réel du compte TikTok Shop. Les rapports parlent de ventes et de stock sans données.

**Objectif** : chaque matin, l'équipe dispose des **5 chiffres clés** de la veille, sans que Karim y passe plus de 5 minutes et sans jamais lui demander ses identifiants.

**Hors périmètre** : toute écriture dans TikTok Shop (prix, stock, fiche, messages clients). L'équipe ne fait que **lire**.

## 2. Ce que disent les recherches (21/10/2026)

> Méthode : recherches web le 21/10/2026. La doc officielle (partner.tiktokshop.com) apparaît dans les résultats, mais la page elle-même n'a pas pu être ouverte depuis notre environnement (accès réseau bloqué). Tout ce qui vient d'un site tiers est marqué **(tiers)** et **doit être vérifié** sur la doc officielle avant d'y passer du temps.

### 2.1 API officielle (TikTok Shop Partner Center / Open API)

| Question | Réponse | Source |
|---|---|---|
| Un vendeur peut-il créer sa propre app ? | **Oui** : profil « Seller (in-house) developer » → type **Custom app**, limité aux données de **sa propre boutique**. Elle est distribuée par un lien d'autorisation privé (pas de passage par l'App Store). | Guide développeur officiel [tts-developer-guide](https://partner.tiktokshop.com/docv2/page/tts-developer-guide) (résumé du moteur de recherche) ; [create-your-app](https://partner.tiktokshop.com/docv2/page/create-your-app) |
| Portail pour la France | `partner.tiktokshop.com` (les États-Unis ont un portail séparé, `partner.us.tiktokshop.com`). La région se choisit à la création du compte et **ne peut plus être changée**. | [Apideck](https://developers.apideck.com/apis/ecommerce/tiktok/configuration) (tiers), [Unified.to](https://unified.to/blog/how_to_setup_a_tiktok_shop_application) (tiers) |
| Inscription / validation | Vendeur développeur : vérification par l'e-mail administrateur de la boutique, validation annoncée « immédiate » **(tiers)**. Autres profils (agence, éditeur) : documents d'entreprise, 2 à 3 jours ouvrés **(tiers)**. Le guide officiel indique une revue conformité/juridique de **3 semaines ou plus** pour les États-Unis, le Royaume-Uni « et certains marchés ». Pour la France : **Non trouvé**. | Unified.to (tiers), guide officiel |
| Entreprise requise ? | Le compte vendeur FR exige déjà une entreprise immatriculée (micro-entreprise/EI acceptée selon des guides tiers). Karim a un SIRET. Une **condition propre au compte développeur pour un vendeur individuel** : **Non trouvé**. | [speed-ecom.eu](https://speed-ecom.eu/blog/comment-vendre-sur-tiktok-shop-france-2026/) (tiers), [4seller](https://www.4seller.com/blog/en/article/135-Effortlessly-Onboard-TikTok-Shop-in-Europe-4seller-Empowers-Local-Sellers) (tiers) |
| Revue obligatoire de l'app | Une Custom app échappe à la revue App Store, **sauf** si elle est classée « Connector » ou si elle atteint 25 boutiques autorisées. Ce n'est pas notre cas. | Apideck (tiers) |
| Authentification | OAuth 2.0 : App Key + App Secret + Service ID, autorisation du vendeur via `services.tiktokshop.com`, puis access token + refresh token. **Durée de vie du jeton : les sources ne sont pas d'accord** (24 h ou 7 jours pour l'access token, 365 jours pour le refresh token). | [getphyllo (01/07/2026)](https://www.getphyllo.com/post/tiktok-api-integration-guide-2026-setup-endpoints-common-pitfalls) (tiers), [UseResponse](https://help.useresponse.com/hemi/knowledge-base/article/marketplaces-tiktok-marketplace-integration-v2-tiktok-authentication-database-structure_1) (tiers) |
| Permissions (scopes) | À demander app par app dans « Manage API » (ex. Shop Authorized Information, Product Basic, Order Information). | Unified.to (tiers) |
| Limites de débit | Chiffres propres à TikTok Shop : **Non trouvé**. Gérer les erreurs 429 (ralentir puis réessayer). | getphyllo (tiers) |
| Coût du Partner Center | **Non trouvé**. | — |

**Endpoints utiles (lecture seule, versions à vérifier dans la doc officielle) :**

| Besoin | Endpoint signalé | Source |
|---|---|---|
| Commandes | `POST /order/202309/orders/search` (Get Order List) | [UseResponse](https://help.useresponse.com/hemi/knowledge-base/article/marketplaces-tiktok-marketplace-integration-v2-tiktok-order-management-tiktok-get-orders_1) (tiers) |
| Produits / stock | `POST /product/202502/products/search` (Search Products) | [Daasity](https://help.daasity.com/core-concepts/data-integrations/setup-guides/digital-integrations/tiktok-shop/integration-specifications) (tiers) |
| Règlements | « Get Statements » (API Finance) : chemin exact **Non trouvé** | [MindCloud](https://mindcloud.co/docs/universal/rest/tiktok-shop/latest) (tiers) |
| Statistiques | `GET /analytics/202509/shop/performance` | Daasity (tiers) ; annonce officielle [Bestsellers Analytics Open API](https://partner.tiktokshop.com/docv2/page/3dk9557y) |
| Vidéos (vues) | **Non trouvé** côté API Shop | — |

### 2.2 Sans code

- **Export des commandes** : Seller Center → *Commandes* → filtre statut + dates → **Exporter** (l'emplacement du bouton varie selon le marché) **(tiers)**. Source : [EchoTik](https://www.echotik.live/blog/how-to-export-tiktok-shop-data/).
- **Export des règlements** : *Finances* → *Relevés (Statements)* → Exporter → *Historique des exports*. Fichier Excel en plusieurs onglets (ventes nettes, livraison, frais, ajustements), jusqu'à 90 jours par export, basé sur la **date de règlement** et non sur la date de commande **(tiers ; captures de 2023)**. Sources : [Link My Books](https://help.linkmybooks.com/en/articles/8727688-how-to-download-tiktok-shop-finance-statement), [Link My Books, 23/11/2025](https://linkmybooks.com/blog/tiktok-shop-transactions-reports). Libellés en français : **à confirmer** dans le compte de Karim.
- **Outils tiers** :

| Outil | Usage | Prix mensuel | France ? | Source |
|---|---|---|---|---|
| Dashboardly | Tableau de bord marge/stock TikTok Shop | Starter **29 $/mois** (1 boutique, 1 500 commandes), 23 $/mois en annuel ; essai de 14 jours avec carte bancaire ; rapports en anglais | Pages en FR/DE : **compatibilité FR probable, à confirmer** | [dashboardly.io/pricing](https://dashboardly.io/pricing), [Capterra](https://www.capterra.co.uk/software/1080152/Dashboardly) |
| Zapier | Connecteur TikTok Shop natif | — | **Non trouvé** (seulement TikTok Conversions / Lead Gen) | [zapier.com](https://zapier.com/apps/tiktok-conversion/integrations) |
| Make | Connecteur TikTok Shop natif | — | **Non trouvé** (seul le module HTTP générique, qui suppose déjà une app API) | [community.make.com (mars 2025)](https://community.make.com/t/why-i-don-t-have-a-tiktok-module/72300) |
| OttoKit, Tray.ai, Pipe17, Patchworks, MindCloud | Connecteurs / intégrateurs | **Non trouvé** | Non trouvé | [ottokit](https://ottokit.com/docs/connect-tiktok-shop-to-ottokit/), [tray.ai](https://tray.ai/connectors/tiktok-shop-integrations), [Pipe17](https://support.pipe17.com/hc/en-us/articles/49699061653019) |

À ~1 vente par jour, un outil à 29 $/mois coûte environ l'équivalent de **4 à 5 ventes de marge** (6,06 €/vente selon FOUNDER_CONTEXT §4, avec un taux de change à vérifier). **Non rentable aujourd'hui.**

## 3. Recommandation en 3 paliers

### Palier A : manuel, 5 min/jour (**à faire tout de suite**)
Chaque soir (ou le matin), Karim ouvre l'app TikTok Shop Seller Center sur son téléphone et donne **5 chiffres** à l'équipe : il les tape dans le bureau (champ prévu) ou les envoie dans la conversation. L'équipe crée alors `entreprise/ventes/AAAA-MM-JJ.md` (gabarit en §5) et met à jour la base des bureaux.

| # | Chiffre | Où le lire (libellés à confirmer) |
|---|---|---|
| 1 | Commandes de la veille (nombre) | Accueil / Données → période « Hier » |
| 2 | Ventes de la veille (€ TTC, hors livraison) | Accueil / Données → GMV ou Ventes |
| 3 | Commandes à expédier (dont celles à J+2 ou plus) | Commandes → « À expédier » |
| 4 | Stock restant (montre 15 €) | Produits → Gérer les produits → colonne Stock |
| 5 | Dernier règlement reçu (montant + date) | Finances → Relevés / Paiements |

**Coût : 0 €. Effort : 5 min/jour. Risque : oubli** (l'équipe note alors « Non relevé », elle n'estime jamais).

### Palier B : export CSV hebdomadaire (**à partir de la semaine prochaine**)
Le lundi, Karim exporte (1) les commandes des 7 derniers jours et (2) le relevé de règlements, puis dépose les fichiers dans `entreprise/ventes/exports/AAAA-Sxx-commandes.csv` et `…-reglements.xlsx` (uniquement si le dépôt est privé, voir §4). L'équipe vérifie les 5 chiffres de la semaine, calcule la **marge réelle par vente** (règlement ÷ commandes, pour confirmer les 13,15 € encaissés) et signale les écarts.
**Coût : 0 €. Effort : environ 10 min/semaine.** Avant de déposer, Karim **supprime les colonnes qui contiennent des données personnelles** (nom, adresse, téléphone des clients). Ces données personnelles relèvent du RGPD et l'équipe n'en a pas besoin.

### Palier C : API automatique (**pas maintenant**)
Une Custom app en lecture seule (commandes, produits, relevés, statistiques) et un petit script hébergé **hors du dépôt** qui écrit chaque nuit les 5 chiffres dans la base des bureaux.
- **Effort** : création du compte développeur, de l'app et des scopes (Karim, environ 1 h si la validation est bien immédiate), puis développement, hébergement d'un serveur avec secret et rafraîchissement des jetons, et maintenance quand les versions d'API changent (202309, 202502, 202509…). Il faut un développeur ou plusieurs sessions de l'équipe IA. Chiffrage précis : **Non trouvé**.
- **Coût** : Partner Center **Non trouvé** ; hébergement du script : quelques €/mois selon l'hébergeur (non chiffré).
- **Risques** : fuite de l'App Secret ou des jetons (accès à toute la boutique) ; revue de conformité possible (3 semaines ou plus sur certains marchés) ; une page web publique ne peut **pas** garder un secret. Le script doit donc tourner sur un serveur.
- **Déclencheur pour reconsidérer** : lancement du modèle à 29,99 € **et** relevé A qui dépasse 10 min/jour, ou plusieurs ventes par jour.

## 4. Règles pour l'équipe IA : ce qu'elle ne doit JAMAIS faire

1. **Ne jamais demander, stocker ni recopier** le mot de passe, le code 2FA, l'App Key/Secret, les access/refresh tokens ou les cookies de Karim, que ce soit dans le dépôt, la base des bureaux, un livrable ou un message.
2. **Ne jamais commiter** de fichier `.env`, de jeton ou d'export brut contenant des données clients (noms, adresses, téléphones, e-mails).
3. **Ne jamais agir sur la boutique** : ni prix, ni stock, ni fiche, ni réponse client, ni remboursement. Lecture seule.
4. **Ne jamais inventer un chiffre** : un chiffre manquant s'écrit « Non relevé », jamais « ~1 ».
5. **Ne jamais utiliser d'outil tiers payant ni de service de scraping** du Seller Center sans décision de Karim (risque pour le compte et pour les données).
6. Ne mettre dans la base partagée des bureaux que des **agrégats** (les 5 chiffres), jamais de données par client.

## 5. Gabarit : `entreprise/ventes/AAAA-MM-JJ.md`

```markdown
# Ventes du AAAA-MM-JJ (journée de la veille)

- Relevé par : Karim | Source : Seller Center (app) | Heure du relevé : HH:MM

| # | Chiffre | Valeur | Commentaire |
|---|---|---|---|
| 1 | Commandes (nombre) | _ | |
| 2 | Ventes (€ TTC, hors livraison) | _ € | |
| 3 | Commandes à expédier (dont en retard ≥ J+2) | _ (_) | délai max : 3 jours ouvrés |
| 4 | Stock restant, montre 15 € | _ | début du déstockage ≈ 15 |
| 5 | Dernier règlement reçu | _ € le JJ/MM | |

## Calculé par l'équipe (ne pas remplir à la main)
- Marge nette estimée de la veille : commandes × 6,06 € = _ € (hypothèse FOUNDER_CONTEXT §4)
- Stock : jours restants au rythme actuel = _
- Alerte : [ ] commande à expédier en retard  [ ] stock ≤ 5  [ ] chiffre « Non relevé »
```

## 6. Critères de réussite et prochaines étapes
- **Réussi si** : 6 relevés sur 7 jours dans `entreprise/ventes/` la première semaine, et le rapport du directeur cite des chiffres réels.
- **Étapes** : (1) Bastien valide ce PRD ; (2) Karim confirme les libellés réels des 5 chiffres dans son Seller Center (5 min) ; (3) l'équipe crée `entreprise/ventes/` et ajoute un champ « 5 chiffres » dans les bureaux ; (4) premier export B le lundi 26/10/2026.
- **Décision demandée à Karim** : A tout de suite + B le lundi (recommandé) / A seul / aller directement à C.
