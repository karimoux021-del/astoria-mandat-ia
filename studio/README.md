# Studio photo Astoria

Transforme les photos d'un produit en images de fiche TikTok Shop, propres et en français.

```bash
node studio/render.cjs studio/briefs/t900.json   # → visuels/t900/1-principale.jpg … 7-au-poignet.jpg
```

1. Mets les photos du produit dans `visuels/sources/<produit>/` : `principale.jpg` (de face), `profil.jpg` (de 3/4), et si possible `poignet.jpg` (portée) et `colis.jpg` (contenu de la boîte).
   Astuce : pose la montre sur une feuille blanche, à la lumière du jour, sans flash. Le studio détoure tout seul les photos sur fond uni.
2. Décris le produit dans `studio/briefs/<produit>.json` (modèle : `t900.json`). Mets uniquement des caractéristiques vérifiées.
3. Lance la commande : les images sortent dans `visuels/<produit>/`, numérotées dans l'ordre de la fiche.

Règles TikTok Shop appliquées : image principale sur fond blanc, sans texte ni logo ; JPG de 1080 × 1080 (et 1080 × 1440 pour la principale) ; moins de 5 Mo ; pas d'images en double.
Photos du fournisseur : seulement avec son autorisation écrite. Jamais de marque déposée.

L'équipe Studio du pôle Marketing (Léna pour la direction artistique, Théo pour le graphisme) utilise cet outil pendant ses journées de travail.
