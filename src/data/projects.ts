import type { ImageMetadata } from 'astro';
import chromogram from '../images/chromogram.jpg';
import greenShoots from '../images/green-shoots.png';
import labomobile from '../images/labomobile.png';
import malBajja from '../images/malbajja.webp';
import nicolas from '../images/nicolasherman.png';
import saffron from '../images/saffronkitchenproject.png';
import sera from '../images/sera-studio.webp';
import worldPressPhoto from '../images/worldpressphoto2021.png';

export interface Project {
  slug: string; title: string; year?: string; category: string; role: string;
  summary: string; description: string[]; image: ImageMetadata;
  background: string; foreground: string;
  // Five colors sampled from the project image for the plate and section theme.
  palette: [string, string, string, string, string];
  url?: string;
  imageAlt?: string; urlLabel?: string;
  reference?: { title: string; url: string };
  credits: { name: string; role: string; url?: string }[];
}

export const projects: Project[] = [
  {
    slug: 'chromogram', title: 'Chromogram', year: '2025',
    category: 'Jeu de couleurs au musée', role: 'Architecture et développement',
    summary: 'Un tangram à compléter avec les couleurs des œuvres du MRAC.',
    description: [
      'Chromogram est une proposition de l’artiste Armelle Caron pour le MRAC Occitanie, à Sérignan. Dans l’exposition de collection Allons, le jeu invite à observer les œuvres pour y retrouver les sept couleurs d’un tangram.',
      'Sur smartphone, les QR codes présents dans les salles donnent accès aux couleurs à chercher. Les pièces se débloquent au fil de la visite. J’ai réalisé l’architecture et le développement de l’application, avec Stéphane Kouchian à la conception, au design et à la programmation.',
    ],
    image: chromogram, imageAlt: 'Les sept couleurs du tangram de Chromogram',
    background: '#0b4fd1', foreground: '#ccffff',
    palette: ['#1b3c75', '#ccffff', '#7b77d5', '#44a635', '#fee215'],
    url: 'https://chromogramrac.com/start', urlLabel: 'Le jeu sur smartphone',
    reference: { title: 'Présentation par le MRAC', url: 'https://mrac.laregion.fr/Armelle-Caron-73' },
    credits: [
      { name: 'Armelle Caron', role: 'Proposition artistique' },
      { name: 'Théo Goedert', role: 'Architecture et développement' },
      { name: 'Stéphane Kouchian', role: 'Conception, design et programmation' },
      { name: 'Sandrine Nugue / CNAP', role: 'Typographie Infini' },
      { name: 'MRAC Occitanie, Sérignan', role: 'Musée' },
    ],
  },
  {
    slug: 'mal-bajja', title: 'Mal-Bajja', year: '2025',
    category: 'Archive participative', role: 'Carte interactive',
    summary: 'Une archive en ligne qui cartographie les récits et les souvenirs de Birżebbuġa, à Malte.',
    description: [
      'Mal-Bajja rassemble l’histoire de Birżebbuġa, une ville du sud-est de Malte. Le site réunit des récits oraux, des documents d’archive et des vidéos, accompagne un parcours de promenade à faire en autonomie et invite les habitants à envoyer leurs histoires et leurs photos.',
      'Sur un projet porté par Samira Damato, Nadine Rotem-Stibbe a conçu le design et réalisé le site sur Webflow. J’ai développé la carte interactive. On y filtre les lieux et les archives, et chaque point ouvre son récit, avec vidéos et textes, en anglais ou en maltais.',
    ],
    image: malBajja, imageAlt: 'La carte de Mal-Bajja, avec les lieux et les archives de Birżebbuġa',
    background: '#97abd1', foreground: '#1c3d52',
    palette: ['#97abd1', '#1c3d52', '#ffea97', '#f6f6f6', '#ced0ce'],
    url: 'https://www.mal-bajja.com/home-en',
    reference: { title: 'Le projet sur le site de Nadine Rotem-Stibbe', url: 'https://nadiners.com/project/malbajja.html' },
    credits: [
      { name: 'Samira Damato', role: 'Concept et direction' },
      { name: 'Nadine Rotem-Stibbe', role: 'Design et développement Webflow' },
      { name: 'Théo Goedert', role: 'Carte interactive' },
      { name: 'Benjamin Zammit', role: 'Vidéo et montage' },
      { name: 'Yasmin Kuymizakis', role: 'Musique et son' },
    ],
  },
  {
    slug: 'sera-studio', title: 'Sera',
    category: 'Mode et boutique en ligne', role: 'Développement web',
    summary: 'Une boutique en ligne qui réunit collections de vêtements et récits de savoir-faire textiles.',
    description: [
      'Le site de Sera réunit une boutique de vêtements et des récits sur le tissage, la broderie et les collaborations artistiques du studio.',
      'J’ai participé au développement du site avec N. Zonca et Stéphane Kouchian, sur un design de Laand Studio.',
    ],
    image: sera, imageAlt: 'La page d’accueil de Sera, avec deux photographies de la collection',
    background: '#e6e5df', foreground: '#30271f',
    palette: ['#d9cebf', '#30271f', '#cb937b', '#bccdda', '#8b5b43'],
    url: 'https://www.sera-studio.com/',
    credits: [
      { name: 'Laand Studio', role: 'Design' },
      { name: 'N. Zonca, Théo Goedert et Stéphane Kouchian', role: 'Développement' },
    ],
  },
  {
    slug: 'world-press-photo', title: 'World Press Photo', year: '2021',
    category: 'Exposition en ligne', role: 'Webdesign et direction technique',
    summary: 'Une exposition en ligne réunissant les travaux de 42 photographes.',
    description: [
      'Pendant la pandémie, cette exposition en ligne permettait de présenter les travaux des photographes malgré les annulations d’expositions en salle.',
      'Une chronologie réunit 42 photographes, trois projets au long cours et neuf récits numériques. Des entretiens audio et des vidéos du jury accompagnent les photographies. J’ai participé au webdesign et assuré la direction technique du projet.',
    ],
    image: worldPressPhoto, background: '#df071b', foreground: '#ffffff',
    palette: ['#df071b', '#ffffff', '#0c0c0c', '#4b4c4c', '#939493'],
    url: 'https://wpp21.shimsham.design/',
    credits: [
      { name: 'Samira Damato', role: 'Développement du concept' },
      { name: 'Nadine RS', role: 'Concept et design' },
      { name: 'Théo Goedert', role: 'Webdesign et direction technique' },
      { name: 'Kamil et Max Franklin', role: 'Développement' },
    ],
  },
  {
    slug: 'saffron-kitchen-project', title: 'Saffron Kitchen Project', year: '2021',
    category: 'Solidarité et cuisine', role: 'Webdesign et direction technique',
    summary: 'Le site d’une association de cuisine et de formation à Athènes.',
    description: [
      'À Athènes, Saffron Kitchen Project accompagne les personnes réfugiées et vulnérables à travers la cuisine. L’association propose des repas et des formations aux métiers de la restauration.',
      'Nous avons accompagné l’association dès ses débuts. J’ai pris en charge le webdesign et la direction technique, avec Nadine RS pour l’identité visuelle et Milena Walter pour les illustrations.',
    ],
    image: saffron, background: '#07453a', foreground: '#ffe019',
    palette: ['#002311', '#ffe019', '#e5194c', '#ff8000', '#ffffff'],
    url: 'https://www.saffronkitchenproject.org/',
    credits: [
      { name: 'Nadine RS', role: 'Identité visuelle' },
      { name: 'Théo Goedert', role: 'Webdesign et direction technique' },
      { name: 'Milena Walter', role: 'Illustration' },
    ],
  },
  {
    slug: 'green-shoots', title: 'Green Shoots', year: '2022',
    category: 'Récits et écoconception', role: 'Développement web',
    summary: 'Dix initiatives écologiques européennes racontées sur un site éco-conçu.',
    description: [
      'Green Shoots documente des initiatives écologiques dans dix pays de l’Union européenne : protection des milieux marins, alimentation, énergie et transports.',
      'J’ai développé le site avec Max Franklin. Pour limiter sa consommation, nous avons compressé les images, limité les animations et réalisé une version statique, hébergée sur un serveur alimenté en énergie verte.',
    ],
    image: greenShoots, background: '#FFF1DB', foreground: 'hsl(120, 90%, 25%)',
    palette: ['#002800', '#8F911B', '#FF3C00', '#FFF1DB', '#F57953'],
    url: 'https://green-shoots.eu/',
    credits: [
      { name: 'María Goirigolzarri, Samira Damato, Nadine Rotem-Stibbe et Stefano Carini', role: 'Concept' },
      { name: 'Nadine Rotem-Stibbe', role: 'Design' },
      { name: 'Théo Goedert et Max Franklin', role: 'Développement' },
    ],
  },
  {
    slug: 'nicolas-hermann', title: 'Nicolas Hermann', year: '2022',
    category: 'Photographie et WebGL', role: 'Développement créatif',
    summary: 'Un portfolio photographique dont la navigation utilise la 3D.',
    description: [
      'Un portfolio pour explorer les séries du photographe Nicolas Hermann dans une expérience WebGL.',
      'J’ai développé la navigation en 3D, les transitions et le chargement des médias. Le design est signé Siloé Nouyrit.',
    ],
    image: nicolas, background: '#292d2d', foreground: '#f6f3ef',
    palette: ['#161616', '#f6f3ef', '#343434', '#6b6b6b', '#acacac'],
    url: 'https://nh.shimsham.design/',
    credits: [
      { name: 'Siloé Nouyrit', role: 'Design' },
      { name: 'Théo Goedert', role: 'Développement' },
    ],
  },
  {
    slug: 'labomobile', title: 'Labomobile', year: '2023',
    category: 'Arts et expérimentation', role: 'Design et développement',
    summary: 'Un site pour un espace d’expérimentation nomade entre arts, sciences et techniques.',
    description: [
      'Labomobile est un espace d’expérimentation nomade au croisement des arts, des sciences et de la technique. Chaque édition rassemble une équipe autour d’un thème commun.',
      'Les participantes et participants sont rémunérés pour explorer des approches et des dispositifs, sans obligation de production. Le projet est porté par Arnaud Chevalier, de L’instant mobile. J’ai conçu et développé le site, avec Alex Andrix au creative coding.',
    ],
    image: labomobile, background: '#d24417', foreground: '#fff',
    palette: ['#c2380a', '#25411c', '#00000c', '#d4e8c2', '#9b3414'],
    url: 'https://labomobile.org/',
    credits: [
      { name: 'Arnaud Chevalier / L’instant mobile', role: 'Conception originale', url: 'https://linstantmobile.fr' },
      { name: 'Théo Goedert', role: 'Design et développement' },
      { name: 'Alex Andrix', role: 'Creative coding', url: 'https://alexandrix.com/' },
    ],
  },
];
