# 🚀 Guide d'Intégration du Chatbot Astoria Mandat IA

## Pour les Agences Immobilières

Ce guide vous explique comment intégrer le chatbot de qualification Astoria Mandat IA sur votre site internet en moins de 5 minutes.

---

## 📋 Prérequis

- Avoir un compte actif sur Astoria Mandat IA
- Avoir un abonnement valide (Standard, Premium ou Ultra-Premium)
- Accès au code source de votre site web (ou à votre système de gestion de contenu)

---

## 🔑 Étape 1 : Récupérer votre clé d'intégration

1. Connectez-vous à votre espace client : https://astoria-mandat-ia.fr/dashboard
2. Allez dans l'onglet **"Intégration"**
3. Votre clé d'intégration unique s'affiche
4. Copiez le code JavaScript fourni

---

## 💻 Étape 2 : Intégrer le code sur votre site

### Option A : Site HTML/WordPress/Custom

Copiez-collez ce code **juste avant la balise `</body>`** de votre site :

```html
<!-- Astoria Mandat IA Chatbot -->
<script>
  (function(w,d,s,id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "https://astoria-mandat-ia.fr/widget.js";
    js.setAttribute('data-key', 'VOTRE_CLE_ICI');
    fjs.parentNode.insertBefore(js, fjs);
  }(window, document, 'script', 'astoria-chatbot'));
</script>
```

⚠️ **Remplacez `VOTRE_CLE_ICI` par votre clé d'intégration**

### Option B : WordPress avec plugin

1. Installez le plugin "Insert Headers and Footers"
2. Allez dans **Réglages** → **Insert Headers and Footers**
3. Collez le code dans la section **"Scripts in Footer"**
4. Enregistrez

### Option C : Wix

1. Allez dans **Paramètres du site** → **Suivi et analytiques**
2. Cliquez sur **"+ Nouvel outil"**
3. Sélectionnez **"Code personnalisé"**
4. Collez le code et choisissez **"Body - end"**
5. Enregistrez

### Option D : Shopify

1. Allez dans **Boutique en ligne** → **Thèmes**
2. Cliquez sur **Actions** → **Modifier le code**
3. Ouvrez le fichier **theme.liquid**
4. Collez le code juste avant `</body>`
5. Enregistrez

---

## ✅ Étape 3 : Vérifier l'installation

1. Ouvrez votre site dans un navigateur
2. Un bouton rond avec le logo Astoria devrait apparaître en bas à droite
3. Cliquez dessus pour ouvrir le chatbot
4. Testez une conversation complète
5. Vérifiez que le lead apparaît dans votre dashboard Astoria

### ✅ Si tout fonctionne :

- Le chatbot s'affiche en bas à droite
- Il pose des questions en français
- Les réponses sont enregistrées dans votre dashboard

### ❌ Si le chatbot ne s'affiche pas :

1. Vérifiez que vous avez bien copié tout le code
2. Vérifiez que votre clé d'intégration est correcte
3. Videz le cache de votre navigateur (Ctrl + F5)
4. Contactez le support : support@astoria-mandat-ia.fr

---

## 🎨 Étape 4 : Personnalisation (optionnel)

### Couleurs du chatbot

Vous pouvez personnaliser les couleurs du chatbot pour qu'il s'adapte à votre charte graphique :

```html
<script>
  window.astoriaConfig = {
    key: 'VOTRE_CLE_ICI',
    primaryColor: '#0F172A',  // Couleur principale
    accentColor: '#D4AF37',   // Couleur d'accentuation
    position: 'bottom-right'  // ou 'bottom-left'
  };
</script>
```

### Position du chatbot

Par défaut : bas à droite
Options : `bottom-right`, `bottom-left`

---

## 📊 Étape 5 : Suivre vos performances

Une fois le chatbot installé :

1. Connectez-vous à votre dashboard
2. Vous verrez en temps réel :
   - Nombre de conversations démarrées
   - Nombre de leads qualifiés
   - Taux de complétion
   - Score moyen des leads

---

## 🔧 Dépannage courant

### Le chatbot ne s'affiche pas

✅ **Solution** :
- Vérifiez que votre abonnement est actif
- Vérifiez que la clé d'intégration est correcte
- Assurez-vous que le code est bien placé avant `</body>`
- Videz le cache de votre navigateur

### Les leads n'apparaissent pas dans le dashboard

✅ **Solution** :
- Vérifiez que vous utilisez la bonne clé d'intégration
- Attendez 1-2 minutes (temps de synchronisation)
- Rafraîchissez la page du dashboard

### Le chatbot est en anglais

✅ **Solution** :
- Vérifiez votre configuration dans le dashboard
- La langue détectée est celle de votre compte
- Contactez le support si le problème persiste

---

## 📱 Multi-sites

### Si vous avez plusieurs sites web :

Vous pouvez utiliser la **même clé d'intégration** sur tous vos sites. Les leads seront tous centralisés dans votre dashboard unique.

**Plan Premium requis** pour gérer plusieurs sites avec clés différentes.

---

## 🛡️ Sécurité et confidentialité

- Le chatbot respecte le RGPD
- Les données sont chiffrées (SSL/TLS)
- Pas de cookies tiers installés
- Conforme aux règles de confidentialité françaises

### Mention légale à ajouter :

Ajoutez cette mention dans votre politique de confidentialité :

> "Ce site utilise Astoria Mandat IA, un chatbot de qualification de prospects. Les données collectées (nom, email, téléphone, projet immobilier) sont traitées de manière sécurisée et conforme au RGPD. Pour plus d'informations : https://astoria-mandat-ia.fr/confidentialite"

---

## 💡 Bonnes pratiques

### Pour maximiser vos conversions :

1. **Placez un CTA visible** : "Besoin d'aide ? Discutez avec notre assistant"
2. **Annoncez la disponibilité 24/7** : "Réponse immédiate, même le soir et le week-end"
3. **Testez régulièrement** : Simulez une conversation chaque semaine
4. **Analysez vos leads** : Consultez le dashboard tous les jours
5. **Relancez rapidement** : Les leads chauds doivent être contactés sous 24h

---

## 📞 Support technique

### Besoin d'aide ?

- **Email** : support@astoria-mandat-ia.fr
- **Téléphone** : 01 23 45 67 89 (Lun-Ven 9h-18h)
- **Chat** : Depuis votre dashboard
- **Documentation** : https://astoria-mandat-ia.fr/docs

### Support prioritaire :

- **Plan Premium** : Réponse sous 4h
- **Plan Ultra-Premium** : Support téléphonique 24/7 + installation assistée

---

## 🎉 Félicitations !

Votre chatbot Astoria Mandat IA est maintenant actif sur votre site. Vous allez pouvoir qualifier vos prospects automatiquement 24h/24 et 7j/7 !

**Prochaines étapes recommandées** :

1. Tester le chatbot en conditions réelles
2. Configurer vos intégrations (CRM, Google Sheets)
3. Personnaliser les questions si nécessaire (Plan Ultra-Premium)
4. Former votre équipe à utiliser le dashboard

---

*Document mis à jour le 13 janvier 2025*