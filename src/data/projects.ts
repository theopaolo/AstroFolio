import type { ImageMetadata } from 'astro';
import saffron from '../images/saffronkitchenproject.png';
import worldPressPhoto from '../images/worldpressphoto2021.png';
import greenShoots from '../images/green-shoots.png';
import nicolas from '../images/nicolasherman.png';
import labomobile from '../images/labomobile.png';
import chromogram from '../images/chromogram.jpg';

export interface Project {
  slug: string; title: string; year: string; category: string; role: string;
  summary: string; description: string[]; image: ImageMetadata;
  background: string; foreground: string; url?: string;
  imageAlt?: string; urlLabel?: string;
  reference?: { title: string; url: string };
  credits: { name: string; role: string }[];
}

export const projects: Project[] = [
  {
    slug: 'chromogram', title: 'Chromogram #1', year: '2025',
    category: 'Jeu de couleurs au musée', role: 'Architecture et développement',
    summary: 'Un tangram à compléter avec les couleurs des œuvres du MRAC.',
    description: [
      'Chromogram est une proposition de l’artiste Armelle Caron pour le MRAC Occitanie, à Sérignan. Dans l’exposition de collection Allons, le jeu invite à observer les œuvres pour y retrouver les sept couleurs d’un tangram.',
      'Sur smartphone, les QR codes présents dans les salles donnent accès aux couleurs à chercher. Les pièces se débloquent au fil de la visite. J’ai réalisé l’architecture et le développement de l’application, avec Stéphane Kouchian à la conception, au design et à la programmation.',
    ],
    image: chromogram, imageAlt: 'Les sept couleurs du tangram de Chromogram #1',
    background: '#ccffff', foreground: '#1b3c75',
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
    slug: 'world-press-photo', title: 'World Press Photo', year: '2021',
    category: 'Exposition en ligne', role: 'Webdesign et direction technique',
    summary: 'Une exposition en ligne réunissant les travaux de 42 photographes.',
    description: [
      'Face aux expositions annulées pendant la pandémie, une exposition en ligne rend les travaux des photographes accessibles au-delà des salles et des frontières.',
      'Une chronologie réunit 42 photographes, trois projets au long cours et neuf récits numériques. Des entretiens audio et des vidéos du jury prolongent la découverte des images. J’ai participé au webdesign et assuré la direction technique du projet.',
    ],
    image: worldPressPhoto, background: '#df071b', foreground: '#ffffff',
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
      'Nous l’avons accompagnée dès ses débuts, de son langage visuel à son site web. J’ai pris en charge le webdesign et la direction technique, en dialogue avec l’identité de Nadine RS et les illustrations de Milena Walter.',
    ],
    image: saffron, background: '#ffe019', foreground: '#07453a',
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
      'Green Shoots documente des initiatives écologiques dans dix pays de l’Union européenne : protection des milieux marins, alimentation, énergie et transports.',
      'Avec Max Franklin, j’ai développé un site dont les choix techniques prolongent le sujet. Images compressées, animations limitées, version statique et hébergement alimenté en énergie verte : la sobriété guide la fabrication comme la consultation.',
    ],
    image: greenShoots, background: '#ffefcf', foreground: '#a83213',
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
      'Le développement fait dialoguer navigation, transitions et chargement des médias pour laisser la place aux photographies. Le design est signé Siloé Nouyrit.',
    ],
    image: nicolas, background: '#202323', foreground: '#f6f3ef',
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
      'Les participantes et participants sont rémunérés pour explorer des approches et des dispositifs, sans obligation de production. J’ai contribué au projet par le design et le développement de son site.',
    ],
    image: labomobile, background: '#d4e8c2', foreground: '#25411c',
    credits: [{ name: 'Théo Goedert', role: 'Design et développement' }],
  },
];
