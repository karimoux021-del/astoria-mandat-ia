# 🔧 Configuration Stripe pour Astoria Mandat IA - Production

## 📋 Prérequis

1. Créer un compte Stripe sur https://stripe.com
2. Activer votre compte (vérification d'identité requise)
3. Accéder au Dashboard Stripe

---

## 🔑 Étape 1 : Récupérer vos clés API de production

### Dans le Dashboard Stripe :

1. Connectez-vous à https://dashboard.stripe.com
2. Cliquez sur **"Développeurs"** dans le menu de gauche
3. Cliquez sur **"Clés API"**
4. Vous verrez deux types de clés :
   - **Clé publiable** (commence par `pk_live_...`) - Pour le frontend
   - **Clé secrète** (commence par `sk_live_...`) - Pour le backend ⚠️ À GARDER SECRÈTE

5. **IMPORTANT** : Cliquez sur "Révéler la clé de test" pour voir la clé secrète, puis copiez-la

### ⚠️ Sécurité Cruciale

- ❌ **NE JAMAIS** committer les clés de production dans Git
- ❌ **NE JAMAIS** partager la clé secrète (`sk_live_...`)
- ✅ Utiliser uniquement les variables d'environnement
- ✅ Activer l'authentification à deux facteurs sur Stripe

---

## 💳 Étape 2 : Créer les produits d'abonnement

### Dans le Dashboard Stripe :

1. Allez dans **"Produits"** → **"Ajouter un produit"**

2. **Créer le plan Standard (199€/mois)** :
   - Nom : `Astoria Mandat IA - Standard`
   - Description : `IA de qualification 24/7, Scoring simple, Export Google Sheets, 1 agence`
   - Prix : `199` EUR
   - Modèle de facturation : **Récurrent**
   - Période de facturation : **Mensuel**
   - Cliquez sur **"Enregistrer le produit"**
   - ⚠️ **NOTEZ L'ID DU PRIX** (commence par `price_...`) : Vous en aurez besoin !

3. **Créer le plan Premium (349€/mois)** :
   - Nom : `Astoria Mandat IA - Premium`
   - Description : `Tout du Standard + Multi-agences, CRM, Notifications, Scoring avancé`
   - Prix : `349` EUR
   - Modèle de facturation : **Récurrent**
   - Période de facturation : **Mensuel**
   - ⚠️ **NOTEZ L'ID DU PRIX**

4. **Créer le plan Ultra-Premium (499€/mois)** :
   - Nom : `Astoria Mandat IA - Ultra-Premium`
   - Description : `Tunnel complet, Scripts fournis, Installation clé en main, Support 24/7`
   - Prix : `499` EUR
   - Modèle de facturation : **Récurrent**
   - Période de facturation : **Mensuel**
   - ⚠️ **NOTEZ L'ID DU PRIX**

---

## 🔗 Étape 3 : Configurer les webhooks

### Pourquoi les webhooks ?

Les webhooks permettent à Stripe de notifier votre application lorsqu'un paiement est effectué, annulé, ou qu'un abonnement expire.

### Configuration :

1. Dans le Dashboard Stripe, allez dans **"Développeurs"** → **"Webhooks"**
2. Cliquez sur **"Ajouter un point de terminaison"**
3. URL du webhook : `https://VOTRE_DOMAINE.com/api/webhook/stripe`
   - Remplacez `VOTRE_DOMAINE.com` par votre vrai domaine de production
4. Sélectionnez les événements à écouter :
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.created`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.payment_succeeded`
   - ✅ `invoice.payment_failed`
5. Cliquez sur **"Ajouter un point de terminaison"**
6. ⚠️ **NOTEZ LA CLÉ DE SIGNATURE DU WEBHOOK** (commence par `whsec_...`)

---

## 🚀 Étape 4 : Configurer les variables d'environnement

### Sur votre serveur de production (Emergent) :

1. Connectez-vous à votre environnement de production
2. Modifiez le fichier `/app/backend/.env` :

```bash
# Configuration Stripe Production
STRIPE_API_KEY=sk_live_VOTRE_CLE_SECRETE_ICI
STRIPE_WEBHOOK_SECRET=whsec_VOTRE_SECRET_WEBHOOK_ICI

# IDs des produits Stripe
STRIPE_PRICE_STANDARD=price_XXXXXXXXXXXXX
STRIPE_PRICE_PREMIUM=price_XXXXXXXXXXXXX
STRIPE_PRICE_ULTRA=price_XXXXXXXXXXXXX
```

3. **Redémarrez votre application** :
```bash
sudo supervisorctl restart backend
```

---

## 📧 Étape 5 : Configurer les emails de Stripe

### Personnalisation des emails :

1. Dans le Dashboard Stripe, allez dans **"Paramètres"** → **"E-mails"**
2. Personnalisez les emails pour :
   - Confirmation de paiement
   - Échec de paiement
   - Reçus
   - Rappels de facturation
3. Ajoutez votre logo et vos couleurs de marque (Navy #0F172A et Gold #D4AF37)

---

## ✅ Étape 6 : Tester en mode test avant de passer en production

### Cartes de test Stripe :

- **Paiement réussi** : `4242 4242 4242 4242`
- **Paiement refusé** : `4000 0000 0000 0002`
- **3D Secure requis** : `4000 0027 6000 3184`
- CVV : N'importe quel 3 chiffres
- Date d'expiration : N'importe quelle date future

### Processus de test :

1. Utilisez d'abord les clés de test (`sk_test_...`)
2. Créez un abonnement test
3. Vérifiez que les webhooks fonctionnent
4. Vérifiez que le statut de l'abonnement se met à jour dans votre base de données
5. Une fois tout validé, passez aux clés de production

---

## 🔐 Étape 7 : Sécurité et conformité

### Checklist de sécurité :

- ✅ Activer l'authentification à deux facteurs sur Stripe
- ✅ Activer Radar (détection de fraude) - Gratuit dans Stripe
- ✅ Configurer les alertes d'email pour les paiements suspects
- ✅ Vérifier que votre site utilise HTTPS (SSL/TLS)
- ✅ Ne jamais stocker de numéros de carte de crédit
- ✅ Respecter le RGPD pour les données clients

### Conformité PCI-DSS :

Stripe gère automatiquement la conformité PCI-DSS car :
- Les paiements sont traités sur les serveurs de Stripe
- Vous ne manipulez jamais directement les données de carte

---

## 💰 Étape 8 : Configurer les paiements

### Où atterrissent les paiements ?

Les paiements arrivent directement sur **votre compte bancaire** connecté à Stripe.

### Configuration du compte bancaire :

1. Dans le Dashboard Stripe, allez dans **"Paramètres"** → **"Détails du compte"**
2. Cliquez sur **"Comptes bancaires et de débit"**
3. Ajoutez votre IBAN (compte bancaire français)
4. Stripe vérifiera votre compte (peut prendre 1-2 jours)
5. Une fois vérifié, les paiements seront transférés automatiquement selon le calendrier de versement

### Calendrier de versement :

- **Par défaut** : J+7 (7 jours après le paiement)
- **Configurable** : Vous pouvez demander J+2 une fois votre compte vérifié
- Les versements sont automatiques (pas besoin d'action manuelle)

### Devise :

- Les prix sont en EUR (euros)
- Les versements sur votre compte bancaire seront en EUR
- Pas de frais de conversion si votre compte bancaire est en EUR

---

## 📊 Étape 9 : Monitoring et rapports

### Dashboard Stripe :

1. **Vue d'ensemble** : Revenus quotidiens, hebdomadaires, mensuels
2. **Abonnements actifs** : Nombre total d'agences abonnées
3. **Taux de désabonnement** (churn rate)
4. **Paiements échoués** : À surveiller pour relancer les clients

### Rapports automatiques :

- Stripe génère automatiquement des rapports financiers
- Export CSV disponible pour votre comptabilité
- Intégration possible avec Xero, QuickBooks, etc.

---

## 🔄 Étape 10 : Gestion des abonnements

### Annulation d'abonnement :

- Les clients peuvent annuler depuis leur dashboard
- L'accès reste actif jusqu'à la fin de la période payée
- Aucun remboursement automatique (à définir dans vos CGV)

### Échec de paiement :

1. Stripe réessaie automatiquement 3 fois
2. Email envoyé au client après chaque échec
3. Si tous les essais échouent : abonnement suspendu
4. Vous recevez une notification webhook

### Changement de plan :

- Les clients peuvent upgrader/downgrader leur plan
- Stripe calcule automatiquement le prorata
- Mise à jour immédiate de l'accès aux fonctionnalités

---

## 💡 Étape 11 : Optimisations recommandées

### Réduire le taux de désabonnement :

1. **Smart Retry** : Activé par défaut dans Stripe
2. **Mise à jour automatique des cartes** : Stripe met à jour les cartes expirées
3. **Relances par email** : Configurées automatiquement

### Augmenter les conversions :

1. **Essai gratuit** : Proposer 14 jours gratuits
2. **Coupons de réduction** : Créer des codes promo dans Stripe
3. **Facturation annuelle** : Offrir 2 mois gratuits pour paiement annuel

---

## 📞 Support Stripe

- **Documentation** : https://stripe.com/docs
- **Support email** : support@stripe.com
- **Support chat** : Disponible dans le Dashboard
- **Téléphone** : +33 1 76 36 45 75 (France)

---

## ✅ Checklist finale avant le lancement

- [ ] Clés API de production configurées
- [ ] 3 produits d'abonnement créés dans Stripe
- [ ] Webhooks configurés et testés
- [ ] Compte bancaire vérifié
- [ ] Emails Stripe personnalisés
- [ ] Tests de paiement effectués
- [ ] Radar activé (anti-fraude)
- [ ] Authentification à deux facteurs activée
- [ ] CGV et mentions légales à jour
- [ ] RGPD conforme

---

## 🎉 Félicitations !

Votre système de paiement est maintenant prêt pour la production. Les paiements arriveront automatiquement sur votre compte bancaire tous les 7 jours (ou 2 jours si configuré).

**Note importante** : Conservez ce document en lieu sûr et ne partagez jamais vos clés API de production.