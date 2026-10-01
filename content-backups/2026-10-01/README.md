# Textes du portfolio avant la version professionnelle

Sauvegarde du 1er octobre 2026, réalisée avant l’adaptation pour les associations et les enseignants. Elle conserve l’état local des fichiers, y compris les modifications qui n’étaient pas encore enregistrées dans Git.

- `index.astro.txt` : accueil, textes des projets personnels et ordre des sections.
- `Layout.astro.txt` : navigation, métadonnées et contact.
- `projects.ts.txt` : descriptions et crédits des projets, sauvegardés avant la passe de rédaction.
- `404.astro.txt` : texte de la page introuvable, sauvegardé avant la passe de rédaction.

Pour revenir à cette version, depuis la racine du projet :

```sh
cp content-backups/2026-10-01/index.astro.txt src/pages/index.astro
cp content-backups/2026-10-01/Layout.astro.txt src/layouts/Layout.astro
cp content-backups/2026-10-01/projects.ts.txt src/data/projects.ts
cp content-backups/2026-10-01/404.astro.txt src/pages/404.astro
```

Ces commandes remplacent les fichiers par leur état sauvegardé. Conserver les éventuelles modifications ultérieures avant de les utiliser.
