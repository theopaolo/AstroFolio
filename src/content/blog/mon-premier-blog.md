---
title: Mon premier blog
description: ""
pubDate: 2023-08-10T20:32:05.520Z
heroImage: "/images/island.jpg"
---

Voilà je commence finalement un blog, inspiré par les copains @alexis et @robin !
Pour ce premier billet je vais à l'instar des deux zigotos, faire un exposé de la stack tech de ce journal.

### Tech stack
---
Framework : [Astro](https://astro.build)
CMS : [FrontMatter](https://frontmatter.codes/)
Versioning sur git
Hébergement : Vercel
Temps de mise en place: Un tgv Lyon -> Marseille
---

### Exposée

#### Astro
[Astro](https://astro.build)
J'utilise astro pour mon portfolio perso depuis un peux moins d'une années.
C'est un framework focus sur des site à contenue, un blog ou portfolio par exemple.
Un prise en main facile, configuré avec tailwind, de l'optimization d'images (pints important pour moi), le déloyment sur vercel.

De plus Astro propose l'[architecure d'île](https://docs.astro.build/fr/concepts/islands/) :
"Le terme “île Astro” désigne un composant d’interface utilisateur interactif sur une page HTML autrement statique. Plusieurs îles peuvent exister sur une page, et une île est toujours rendue de manière isolée. Considérez-les comme des îles dans une mer de HTML statique et non interactif."

Astro propose sa propre logique de composants avec l'extentions .astro mais il est UI *agnostic* et supporte les composant de framework tel que : vue, svelte, lit ou react.

Bref astro c'est le turfu, innovant et un plaisir à **utiliser**.

#### FrontMatter
[FrontMatter](https://frontmatter.codes/)
Le cms chelou qui vie dans VSC, pratique on ne sors pas de sont éditeur de code pour faire le site et gérer les contenues.
Il propose un jolie dashboard permettant de gérer la publicaiton de contenue, des taxonomies et les médias !
Quand on éditer son fichier mark down, FrontMatter nous donne une toute petite bar d'outils pour la rédaction.