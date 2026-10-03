# SNAG

Portfolio personnel statique, sans outil de build ni dependance JavaScript.

## Lancer en local

Depuis la racine du depot :

```sh
python3 -m http.server 4173
```

Puis ouvrir http://localhost:4173.

## Personnalisation avant publication

- Remplacer `hello@snag.dev` dans `index.html` et `app.js` par une adresse réelle.
- Remplacer les liens sociaux inactifs lorsque les profils existent.
- Les visuels actuels sont des compositions CSS de remplacement. Les medias futurs peuvent etre ranges dans `assets/images/` et `assets/projects/`.
- Les informations de projets sont dans `app.js`, dans l'objet `projects`.