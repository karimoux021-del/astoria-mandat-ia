# 🔐 Identifiants Admin - Astoria Mandat IA

## Compte Administrateur

### Accès au Panel Admin

**URL :** `https://VOTRE_DOMAINE.com/admin`

**Email :** `admin@astoria-mandat.fr`
**Mot de passe :** `AdminAstoria2025`

---

## 🎯 Fonctionnalités Admin Disponibles

### 1. Vue d'Ensemble (Dashboard)
- **KPIs en temps réel :**
  - Nombre total d'utilisateurs
  - Abonnements actifs
  - Revenus totaux générés
  - Tickets de support ouverts
  - MRR (Monthly Recurring Revenue)
  - Répartition des plans (Standard/Premium/Ultra)

### 2. Gestion des Utilisateurs
- **Liste complète** de toutes les agences inscrites
- **Voir les détails** : email, agence, plan, statut d'abonnement
- **Modifier un utilisateur** :
  - ✅ Activer plan Ultra gratuitement
  - ❌ Désactiver l'abonnement
  - 🚫 Bannir/Débannir un utilisateur
- **Filtrer** par statut, plan, date d'inscription

### 3. Centre de Support
- **Voir tous les tickets** de toutes les agences
- **Répondre aux tickets** directement depuis l'interface
- **Fermer automatiquement** les tickets après réponse
- **Tri** par date, statut (ouvert/fermé)

### 4. Statistiques Avancées
- **Revenus** :
  - Total des revenus encaissés
  - MRR (revenu mensuel récurrent)
  - Répartition par plan
- **Leads générés** par toutes les agences
- **Taux de conversion** global

---

## 🔧 Actions Administrateur Disponibles

### Sur les Utilisateurs :

1. **Activer un abonnement gratuitement**
   - Permet de donner un accès gratuit à n'importe quel plan
   - Utile pour les partenaires, testeurs, ou offres commerciales

2. **Modifier le plan d'abonnement**
   - Passer un utilisateur de Standard → Premium → Ultra
   - Ou inversement pour downgrade

3. **Désactiver un abonnement**
   - Couper l'accès sans bannir le compte
   - L'utilisateur peut se réabonner

4. **Bannir un utilisateur**
   - Bloque totalement l'accès au compte
   - Empêche la connexion
   - Utilisé en cas d'abus ou fraude

### Sur les Tickets de Support :

1. **Répondre à un ticket**
   - Interface de réponse intégrée
   - La réponse est visible par l'agence dans leur espace "Support"
   - Ticket automatiquement marqué comme "Fermé"

2. **Suivre l'historique**
   - Voir tous les échanges
   - Date de création, dernière mise à jour

---

## 📊 Métriques Suivies

### Financières :
- **Total Revenue** : Somme de tous les paiements reçus
- **MRR** : Revenu mensuel récurrent estimé
- **Répartition** : Combien d'users par plan

### Utilisateurs :
- **Total Users** : Nombre d'inscriptions
- **Active Subscriptions** : Utilisateurs payants actifs
- **Churn** : À implémenter (utilisateurs qui se désabonnent)

### Support :
- **Open Tickets** : Tickets en attente de réponse
- **Closed Tickets** : Tickets résolus
- **Temps de réponse moyen** : À implémenter

---

## 🔐 Sécurité du Panel Admin

### Protection :
- ✅ Route `/api/admin/*` protégée par vérification du rôle "admin"
- ✅ Middleware `get_admin_user()` vérifie le token ET le rôle
- ✅ Utilisateurs bannis ne peuvent pas se connecter
- ✅ JWT avec expiration 7 jours

### Recommandations :
1. **Changez le mot de passe** dès la première connexion
2. **Activez 2FA** (à implémenter si nécessaire)
3. **Ne partagez jamais** les identifiants admin
4. **Utilisez HTTPS** en production
5. **Surveillez les logs** d'accès admin régulièrement

---

## 🚀 Prochaines Améliorations Recommandées

### Court Terme :
1. **Dashboard Analytics enrichi** : graphiques d'évolution dans le temps
2. **Export CSV** : tous les utilisateurs, transactions
3. **Recherche** : filtrer users par email, agence, plan
4. **Notifications** : alertes quand nouveau ticket ouvert

### Moyen Terme :
1. **Gestion des codes promo** : créer/modifier/supprimer depuis l'interface
2. **Logs d'activité** : qui a fait quoi et quand
3. **Rapports automatiques** : email hebdomadaire avec KPIs
4. **Multi-admin** : plusieurs comptes admin avec permissions différentes

### Long Terme :
1. **Analytics avancées** : retention, churn, lifetime value
2. **A/B Testing** : tester différentes versions des prix
3. **Segmentation** : groupes d'utilisateurs personnalisés
4. **Automatisations** : relances automatiques, upsells

---

## 📞 Support Technique

En cas de problème avec le panel admin :
1. Vérifiez que vous êtes connecté avec le bon compte
2. Videz le cache du navigateur
3. Vérifiez les logs backend : `tail -n 100 /var/log/supervisor/backend.err.log`
4. Redémarrez le service si nécessaire : `sudo supervisorctl restart backend`

---

## ⚠️ IMPORTANT - À FAIRE EN PRODUCTION

1. **Changez le mot de passe admin** immédiatement
2. **Créez un email admin dédié** (ex: admin@votredomaine.com)
3. **Configurez les emails** pour recevoir les notifications de nouveaux tickets
4. **Mettez en place des sauvegardes** régulières de la base MongoDB
5. **Surveillez les métriques** quotidiennement les premières semaines

---

*Document généré le 13 janvier 2025*
*Astoria Mandat IA - Panel Administrateur v1.0*
