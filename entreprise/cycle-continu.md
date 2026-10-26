# Cycle continu de l'entreprise (consigne de Karim du 26/10/2026)

Karim veut une équipe **toujours active**, qui gère **en autonomie** tout ce qui se passe sur TikTok Shop et qui explore le centre vendeur, pôle par pôle. Ce fichier est la consigne de chaque cycle (toutes les 2 h, de 8 h à 22 h). La journée complète de 6 h 52 (`procedure-journee.md`) continue en plus.

## Le bras dans le centre vendeur
La seule façon d'agir sur TikTok Shop est la **session Claude dans Chrome de Karim** : `session_01C7pJcHgwZ5u21riu9x7QqE` (relais décrit dans `entreprise/a-appliquer/README.md`).
- Lire ce qu'elle a fait : `list_events` (kinds `user` + `result`) et `get_session` (statut, `post_turn_summary`).
- Lui donner une mission : `send_message`. Elle ne peut agir que si **le Mac de Karim est allumé et Chrome ouvert avec le panneau Claude** (`connection_status: connected`). Sinon, on prépare la mission et on la garde pour le cycle suivant.

## Déroulé d'un cycle (15 min max)
1. `git pull`. Lire `decisions.md`, le haut de `backlog.md`, le dernier journal et `entreprise/ventes/`.
2. **Relire la session Chrome** : ce qui a été fait ou bloqué depuis le dernier cycle → l'écrire dans `entreprise/ventes/<AAAA-MM-JJ>-cycles.md` (horodaté).
3. **Urgences d'abord** (dans l'ordre) : commande à expédier proche de la limite, fiche rejetée ou en violation, message client sans réponse, avis négatif, stock à 0.
4. **Exploration du pôle de tour** (rotation, une par cycle) :
   - 8 h **Ventes & opérations** (Bastien) : commandes, délais, retours, messages clients, santé de la boutique.
   - 10 h **Marketing** (Antoine) : fiches produit (titre, caractéristiques, photos, violations), outils de promotion, missions offertes.
   - 12 h **Stratégie** (Margaux) : données analytiques (visiteurs, conversion, sources du chiffre d'affaires), campagnes ouvertes.
   - 14 h **Contenu & réseaux** (Chloé) : vidéos publiées et leurs performances, LIVE, affiliés.
   - 16 h **Projets & Nouveautés** (Sofia) : catalogue, catégories, conditions pour ajouter la P86.
   - 18 h, 20 h, 22 h : Alexandre, urgences et suivi des actions en cours.
5. Si Chrome est connecté : envoyer **une** mission claire à la session Chrome (lecture, ou action autorisée ci-dessous), puis écrire le résultat au cycle suivant.
6. Commit + push. Mettre à jour `equipe/etat` des bureaux (status `working`, tâche du cycle). **Pas de notification** à Karim, sauf urgence (commande à expédier dans moins de 24 h, fiche rejetée, avis négatif).

## Ce que l'équipe fait SEULE (autonomie donnée par Karim)
- Tout lire dans le centre vendeur.
- Corriger la **conformité des fiches** : titre, description, caractéristiques vraies, retrait des photos ou des mots qui citent une marque (règles FOUNDER_CONTEXT §5).
- Répondre aux **messages clients** de façon polie et factuelle (délais, suivi, fonctions vérifiées), sans promettre de remboursement ni de geste commercial.
- Préparer les étiquettes d'expédition (sans annuler de commande).

## Ce qui reste TOUJOURS à Karim (« oui » écrit)
Argent (achat de stock, publicité, GMV Max, abonnement), prix et promotions, annulation ou remboursement d'une commande, suppression de produit, modification du stock affiché (seul Karim connaît le stock réel), informations légales qu'on ne connaît pas (fabricant, adresse, GPSR, CE), dépôt physique des colis.

## Demander quelque chose à Karim : les bureaux, pas le compte rendu (consigne du 26/10)
Karim répond directement dans les bureaux (https://claude.ai/artifact/RNJC2sv2aRo1wpUWfap1VP). Chaque question pour lui = **un document** de la collection `demandes` de la base de la page (outil ArtifactData) :
`{ agent: "<id du collègue qui demande>", titre, question, details (Markdown court, chiffré en marge nette si argent), images: [{url, legende}], options: ["Oui","Non"] (ou 2–3 choix courts), statut: "attente", creeLe: "<ISO>" }`. Le collègue porte alors une étoile « ★ Besoin de toi » dans les bureaux.
- **Images** : toujours quand ça aide à décider (photo produit, capture, visuel, lien AliExpress illustré). Pour en ajouter : 1) les fichiers du dépôt `visuels/demandes/` publiés avec la page (Artifact publish de `monde/index.html` avec `files: {"demandes/<nom>.jpg": "visuels/demandes/<nom>.jpg"}`, url de la page) → `url: "demandes/<nom>.jpg"` ; ou 2) Artifact `asset: true` (upload) → l'`url` renvoyée. Jamais d'image d'un autre vendeur dans une fiche ou une vidéo ; dans une demande, une capture de fiche fournisseur sert seulement à décider.
- **Réponses** : à chaque cycle, `ArtifactData query` sur `demandes` (statut `repondu`), puis appliquer (pour une réponse « Non », proposer une nouvelle version en nouvelle demande) : inscrire la décision en haut de `entreprise/decisions.md`, mettre à jour le backlog, préparer l'action (Chrome si besoin), puis passer le document en `statut: "traite"`. Karim peut aussi avoir écrit une info dans `commentaire`.
- Maximum ~8 demandes en attente à la fois ; fermer (`statut: "traite"`) celles devenues inutiles.
- Recherches libres autorisées par Karim (26/10) : AliExpress, Alibaba, CJ… pour trouver de nouveaux produits ou fournisseurs. Aucun achat sans son « oui ».
