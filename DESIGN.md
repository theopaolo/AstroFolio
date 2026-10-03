# Continuité avec le jardin

Le jardin constitue la référence visuelle. Fond rose clair #fff7fb, texte violet #5c4b75, accent rose #ff66c4, Fragment Sans. Le thème sombre reprend les couleurs du jardin. Toutes les fontes restent sans empattements.

Sur les écrans Display P3, la chroma de l’accent rose, des fonds de projets et des bandes de palette augmente de 12 %. Celle des vagues, de leur dégradé de secours et des sélecteurs de palette augmente de 18 %. Les teintes et la luminosité OKLCH restent identiques. Le shader convertit ses couleurs vers Display P3 avant de limiter les canaux et conserve son seuil de luminance pour le texte. Le rendu sRGB reste la base lorsque l’écran ou le navigateur ne prend pas en charge ces couleurs.

L’introduction utilise le rendu de Soft Colors en pleine largeur. Le nom, la navigation et les textes sont en indigo sur les vagues bleues et leur grain. Les réglages initiaux sont : vitesse 1, dérive 0,7, fréquence 0,7 et intensité 0,85. La luminosité des zones les plus sombres est limitée pour conserver un contraste lisible. Le reste du site retrouve les couleurs du jardin.

Le bouton Soft Colors se trouve en bas à droite de l’introduction. Son panneau est fermé par défaut et propose trois palettes, les quatre réglages de mouvement, le grain et une réinitialisation. Une commande de pause reste accessible à côté du bouton. Les réglages de l’outil complet restent sur softcolors.ludique.dev. Le panneau respecte les limites de la fenêtre et se ferme par Échap, au clic extérieur ou au défilement.

Le bas de l’introduction ne contient que les commandes Soft Colors et pause, sans texte ni filet de séparation. La navigation occupe toute la largeur et reste en haut pendant le défilement. Transparente à l’arrivée, elle prend le fond du thème dès que la page défile. Les ancres et le panneau de réglages tiennent compte de sa hauteur.

L’animation utilise uniquement le mode vagues du shader d’origine, sans ajouter Three.js au portfolio. Le rendu est limité à 30 images par seconde et 1,3 million de pixels. Il s’arrête hors écran, dans un onglet masqué et en pause. La préférence de réduction des mouvements affiche une image fixe que l’utilisateur peut animer volontairement. Un dégradé CSS reste visible sans JavaScript ou sans WebGL.

Le portfolio présente huit réalisations en cartes colorées, sur trois colonnes sur ordinateur, deux sur tablette et une sur téléphone. Les informations de rôle et d’année sont visibles avant d’ouvrir les détails. Les crédits restent accessibles sur les pages projet. Chromogram ouvre la sélection et précise que le jeu se consulte sur smartphone.

L’introduction reprend le rythme du prototype React : le titre commence à 100 ms, le sous-titre à 220 ms et le paragraphe à 340 ms. Chaque groupe remonte de 20 px et devient net en 600 ms. À 940 ms, la navigation descend et les commandes du fond remontent, ensemble sur 500 ms. La réduction des mouvements affiche tout immédiatement. Le contenu est visible par défaut et la navigation reste accessible dès que la page défile. Les cartes ouvrent un aperçu natif avec fermeture clavier et restitution du focus. Leur lien mène à une vraie page si JavaScript est désactivé.

Le portrait apparaît au survol du nom, suit le pointeur avec le ressort du prototype React et reste dans la fenêtre. Le suivi conserve son élan lorsque le pointeur change de direction et s’arrête une fois sa position atteinte. Sur le prénom de l’introduction, il est aussi accessible au clavier et au toucher. Échap le ferme. La préférence de réduction des mouvements désactive le suivi et réduit les transitions. Les liens de navigation ont une hauteur minimale de 44 px.

Piloti fournit les réglages, le reset et les compositions container, cluster, grid, stack et flow. Les styles propres au portfolio restent dans une couche components. La base typographique optionnelle de Piloti n'est pas importée car elle impose un espacement des titres.

Les surfaces sont sobres, avec des filets fins et des coins de 10 px sur les cartes. La couleur vient des projets. La biographie présente le parcours, Shimsham, l’enseignement et le son en texte courant. Le contact tient sur une ligne avec l’adresse email. Le jardin et Piloti apparaissent à côté des autres projets personnels.
