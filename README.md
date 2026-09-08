# Portfolio de Théo Goedert

Portfolio personnel en français, construit avec Astro et Piloti 2.0.0. Les six réalisations réunissent le contenu d’AstroFolio, du prototype intro-react et du projet Chromogram. Le site présente aussi le parcours, l’enseignement et les projets personnels de Théo.

## En local

Node.js 22.12 ou plus récent.

```sh
npm ci
npm run dev
```

Pour vérifier la version de production :

```sh
npm run build
npm run preview
```

`npm run check` vérifie les composants Astro et TypeScript.

## Publier avec Coolify

1. Pousser ce dossier dans le dépôt Git connecté à Coolify.
2. Créer une application depuis ce dépôt. Choisir **Dockerfile** comme mode de construction, avec `/Dockerfile` à la racine.
3. Indiquer **8080** dans « Ports Exposes ». Le serveur final sert uniquement les fichiers statiques et ne nécessite aucune variable d’environnement.
4. Attribuer d’abord un domaine de prévisualisation et déployer. Vérifier les projets, une page projet ouverte directement et une URL inexistante.
5. Ajouter `https://www.theogoedert.com` dans les domaines de l’application. Faire pointer l’enregistrement DNS de `www` vers le serveur Coolify. Retirer un éventuel enregistrement AAAA si le serveur ne répond pas en IPv6.
6. Configurer `theogoedert.com` pour rediriger vers `www.theogoedert.com`. Vérifier le certificat HTTPS et les deux adresses avant de retirer l’ancien déploiement Vercel.

Le site n’a pas été publié automatiquement et les DNS restent à configurer. Le jardin reste indépendant.

### Alternative sans Dockerfile

Utiliser le mode site statique de Coolify avec `npm ci`, puis `npm run build`, et le dossier publié `dist`. La version Node doit être au moins 22.12. La configuration de cache et de page 404 de `nginx.conf` concerne le mode Dockerfile.

## Modifier le contenu

- `src/data/projects.ts` : descriptions, dates, rôles, crédits et liens.
- `src/pages/index.astro` : introduction, parcours, projets personnels et contact.
- `src/components/NamePortrait.astro` et `src/images/theo.jpeg` : portrait au survol du nom.
- `src/components/SoftColors.astro` : panneau de réglages du fond d’introduction.
- `src/scripts/soft-colors.ts` et `src/scripts/soft-colors-shader.ts` : rendu animé, palettes et paramètres par défaut.
- `src/styles/site.css` : couleurs du jardin, compositions Piloti, composants et animations.
- `astro.config.mjs` et `public/robots.txt` : domaine public.

Les cartes sont des liens vers des pages statiques. JavaScript ajoute un aperçu dans une boîte de dialogue native. Échap, le bouton de fermeture et un clic sur le fond ferment l’aperçu. Le focus revient à la carte. Sans JavaScript, le lien ouvre la page du projet.

L’animation d’introduction est indépendante de l’affichage des projets et respecte la réduction des mouvements. Le portrait apparaît au survol du nom et au focus clavier. Sur téléphone, toucher le prénom de l’introduction l’affiche ou le masque. Le thème suit le système et le choix manuel est conservé dans le navigateur.

Le fond Soft Colors est intégré au site, sans dépendre du serveur local de l’outil. Il reprend les vagues, le mélange des couleurs en OKLab et le grain du projet `three-lab/gradients`, avec une luminosité minimale pour le contraste du texte. Le panneau est fermé par défaut, les changements restent limités à la visite et le bouton de pause fonctionne indépendamment du panneau. Le rendu s’arrête hors écran ou dans un onglet masqué. Sans JavaScript ou WebGL, le fond CSS garde l’introduction lisible. Aucune dépendance supplémentaire n’est nécessaire.

La base typographique optionnelle de Piloti n’est pas importée : elle ajoute un espacement entre les lettres des titres. Les réglages, le reset, les compositions et les utilitaires de Piloti sont utilisés directement depuis npm.

## Sources éditoriales

Les crédits et descriptions viennent de `project-descriptions.md` et des données du prototype. Pour Nicolas Hermann, la date 2022 du portfolio principal est conservée, alors que le prototype indique 2023. Labomobile n’a pas d’URL publique renseignée. Les scores de performance et autres chiffres non vérifiés présents dans les anciens textes ne sont pas publiés.

La biographie s’appuie sur `../cvgenerator/data/cv-data-fr.json`. Le portrait vient du prototype intro-react. Pour Chromogram #1, les informations viennent de la [présentation du MRAC](https://mrac.laregion.fr/Armelle-Caron-73) et des crédits de [l’application](https://chromogramrac.com/start). Le visuel provient du fichier original `static/download/Chromogram_Wallpaper_MRAC.jpg` dans tangram-app. Le musée se trouve à Sérignan.

## Vérifications du 8 septembre 2026

Compilation et contrôle Astro/TypeScript sans erreur. La première version a été vérifiée dans Helium sur ordinateur, téléphone, thème sombre et page projet, avec tests des cinq aperçus d’origine, du focus clavier, de la fermeture, du thème persistant, des animations réduites et du stockage bloqué. Sans JavaScript, l’introduction reste visible et les cartes ouvrent leurs pages.

Après la révision personnelle : contrôle visuel sur ordinateur et téléphone, six cartes présentes, aucun débordement horizontal à 320, 390, 768 et 1440 px. Portrait testé à la souris, au clavier et au toucher, fermeture par Échap, position contenue dans la fenêtre et réduction des mouvements. Nom accessible du titre vérifié, liens de navigation d’au moins 44 px de haut, fiche Chromogram avec crédits et contexte mobile. Aucune erreur JavaScript détectée dans ces parcours.

Pour le fond Soft Colors : commandes testées au clavier et au toucher, pause du rendu, arrêt hors écran, reprise sans saut temporel, réglages et réinitialisation. Contrôle à 320, 390, 768, 1440 et 1920 px, y compris l’ouverture du panneau après défilement et le portrait après redimensionnement. Vérification du mode de réduction des mouvements, de la perte puis du retour du contexte WebGL, du navigateur sans WebGL et de la navigation sans JavaScript. Le contraste minimal mesuré sur les trois palettes, aux intensités 0,85 et 1,5 et sur plusieurs phases, est de 4,74:1. Aucun échec dans ces parcours.

Lighthouse mobile sur la première version locale : accessibilité 100, bonnes pratiques 100, référencement 100. Ces scores précèdent l’ajout du portrait et de Chromogram et ne constituent pas un audit d’accessibilité complet. Aucun score de performance n’a été retourné par cet outil. Le conteneur Docker n’a pas été exécuté, le moteur Docker étant arrêté sur la machine. Le déploiement Coolify et la configuration DNS restent à effectuer.
