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
