# Portfolio de Théo Goedert

Portfolio statique en français, construit avec Astro et Piloti.

## Développement

Node.js 22.12 ou plus récent.

```sh
npm ci
npm run dev
```

Vérifier puis prévisualiser la version de production :

```sh
npm run check
npm run build
npm run preview
```

## Contenu

- `src/data/projects.ts` contient les projets, descriptions, crédits et liens.
- `src/pages/index.astro` contient l’introduction, la biographie, les projets personnels et le contact.
- `src/images/` et `public/images/side-projects/` contiennent les visuels.
- `PRODUCT.md` et `DESIGN.md` décrivent le produit et sa direction visuelle.

Le contenu et les liens restent accessibles sans JavaScript. Le script client ajoute le thème, le portrait interactif, les transitions et les aperçus des Sidequests. Le fond Soft Colors conserve un dégradé CSS lorsque WebGL est indisponible.

## Déploiement

`npm run build` génère le site dans `dist/`.

Le `Dockerfile` construit le site puis le sert avec nginx sur le port 8080. Dans Coolify, sélectionner le Dockerfile à la racine et exposer le port 8080. Le mode site statique de Coolify peut aussi publier directement `dist/`.
