import {
  Link,
  LinkCard,
  Suppliers,
  Params,
  Notifications,
  Graph,
  MarkerInfo,
} from "@/type";
import {
  ShoppingCart,
  Settings,
  Grid3X3,
  Ruler,
  ListOrdered,
  Shirt,
  Captions,
  File,
  UserCog,
  LineChart,
  Settings2,
  Factory,
} from "lucide-react";

export const LINKS: Link[] = [
  {
    name: "Tableau de bord",
    link: "/",
    icon: LineChart,
    showInSidebar: true,
    showInBottom: false,
  },
  {
    name: "Liste Articles",
    link: "/product",
    icon: Shirt,
    showInSidebar: true,
    showInBottom: false,
  },
  {
    name: "Codification",
    link: "/parameters",
    icon: Settings2,
    showInSidebar: true,
    showInBottom: false,
  },
  {
    name: "Ajouter un produit",
    link: "/product/edit",
    icon: Shirt,
    showInSidebar: false,
    showInBottom: false,
  },
  {
    name: "Classifications",
    link: "/parameters/classification",
    icon: Settings,
    showInSidebar: false,
    showInBottom: false,
  },
  {
    name: "Créer une classe",
    link: "/parameters/classification/create",
    icon: Settings,
    showInSidebar: false,
    showInBottom: false,
  },
  {
    name: "Modifier une classe",
    link: "/parameters/classification/:id",
    icon: Settings,
    showInSidebar: false,
    showInBottom: false,
  },
  {
    name: "Collections",
    link: "/parameters/collection",
    icon: Settings,
    showInSidebar: false,
    showInBottom: false,
  },
  {
    name: "Créer une collection",
    link: "/parameters/collection/create",
    icon: Settings,
    showInSidebar: false,
    showInBottom: false,
  },
  {
    name: "Modifier une collection",
    link: "/parameters/collection/:id",
    icon: Settings,
    showInSidebar: false,
    showInBottom: false,
  },
  {
    name: "Dimensions",
    link: "/parameters/dimension",
    icon: Settings,
    showInSidebar: false,
    showInBottom: false,
  },
  {
    name: "Créer une nouvelle dimension",
    link: "/parameters/dimension/create/item",
    icon: Settings,
    showInSidebar: false,
    showInBottom: false,
  },
  {
    name: "Modifier une dimension",
    link: "/parameters/dimension/:id",
    icon: Settings,
    showInSidebar: false,
    showInBottom: false,
  },
  {
    name: "Les grilles de dimensions",
    link: "/parameters/grid",
    icon: Settings,
    showInSidebar: false,
    showInBottom: false,
  },
  {
    name: "Créer une grille de dimensions",
    link: "/parameters/grid/create",
    icon: Settings,
    showInSidebar: false,
    showInBottom: false,
  },
  {
    name: "Page Produit",
    link: "/product/:id",
    icon: ShoppingCart,
    showInSidebar: false,
    showInBottom: false,
  },
  {
    name: "Marques",
    link: "/parameters/brand",
    icon: Settings,
    showInSidebar: false,
    showInBottom: false,
  },
  {
    name: "Créer une marque",
    link: "/parameters/brand/create",
    icon: Settings,
    showInSidebar: false,
    showInBottom: false,
  },
  {
    name: "Modifier une marque",
    link: "/parameters/brand/:id",
    icon: Settings,
    showInSidebar: false,
    showInBottom: false,
  },
  {
    name: "Liste des fournisseurs",
    link: "/suppliers/suppliers-list",
    icon: Factory,
    showInSidebar: true,
    showInBottom: false,
  },
  {
    name: "Panel administrateur",
    link: "/admin",
    icon: UserCog,
    showInSidebar: false,
    showInBottom: true,
  },
  {
    name: "Créer utilisateur",
    link: "/admin/create-user",
    icon: Settings,
    showInSidebar: false,
    showInBottom: false,
  },
  {
    name: "Brouillons",
    link: "/draft",
    icon: File,
    showInSidebar: false,
    showInBottom: true,
  },
];

export const LINKS_Params: Params[] = [
  {
    name: "Classifications",
    link: "/parameters/classification",
    icon: ListOrdered,
    bg: "/img/bg_params_1.png",
  },
  {
    name: "Dimensions",
    link: "/parameters/dimension",
    icon: Ruler,
    bg: "/img/bg_params_2.jpg",
  },
  {
    name: "Grilles de dimensions",
    link: "/parameters/grid",
    icon: Grid3X3,
    bg: "/img/bg_params_3.png",
  },
  {
    name: "Collections",
    link: "/parameters/collection",
    icon: Shirt,
    bg: "/img/bg_params_4.png",
  },
  {
    name: "Marques",
    link: "/parameters/brand",
    icon: Captions,
    bg: "/img/bg_params_5.png",
  },
];

export const SUPPLIERS: Suppliers[] = [
  {
    code: "ERCFGJ89",
    name: "Michel",
    arobase: "67GGGVV",
  },
  {
    code: "ERCF546",
    name: "Jean",
    arobase: "67GGIPP",
  },
  {
    code: "ERTYJNNJ89",
    name: "Jean pourpre",
    arobase: "674567",
  },
  {
    code: "ERCFGJ89",
    name: "Michelle la chienne",
    arobase: "67G67899",
  },
];

export const LINKCARD: LinkCard[] = [
  {
    name: "En cours",
    page: "progress",
  },
  {
    name: "Finalisés",
    page: "done",
  },
];

export const LINKCARD_EDIT: LinkCard[] = [
  {
    name: "Ajouter un produit",
    page: "addProduct",
  },
  {
    name: "Ajouter une famille",
    page: "addFamilly",
  },
  {
    name: "Ajouter une marque",
    page: "addBrand",
  },
  {
    name: "Ajouter une collection",
    page: "addCollection",
  },
];

export const LINKCARD_PRODUCT: LinkCard[] = [
  {
    name: "Details du produit",
    page: "details",
  },
  {
    name: "Uvcs",
    page: "uvcs",
  },
];

export const LINKCARD_SEARCH: LinkCard[] = [
  {
    name: "Standards",
    page: "standard",
  },
  {
    name: "Compléments",
    page: "complement",
  },
  {
    name: "Caractéristiques",
    page: "caracteristiques",
  },
  {
    name: "Dimensions",
    page: "dimension",
  },
];

export const NOTIF: Notifications[] = [
  {
    user: "John Doe",
    message: "La création de produit a été validée",
    date: "21/05/2024",
  },
  {
    user: "Jane Da",
    message: "La création de produit a été validée",
    date: "21/05/2024",
  },
  {
    user: "Michel Jambon",
    message: "La création de produit a été validée",
    date: "21/05/2024",
  },
  {
    user: "Pré-ref",
    message: "Vous avez des produits en cours de création",
    date: "21/05/2024",
  },
];

export const MESSAGES: Notifications[] = [
  {
    user: "John Doe",
    message: "Il y a un probleme dans le produit que vous avez enregistrée",
    date: "21/05/2024",
  },
  {
    user: "Jane Da",
    message: "njehfjehdefefffff",
    date: "21/05/2024",
  },
  {
    user: "Michel Jambon",
    message: "fjehfefhjehieuieui",
    date: "21/05/2024",
  },
  {
    user: "Pré-ref",
    message: "jhhghttrtrdrrs",
    date: "21/05/2024",
  },
  {
    user: "Pré-ref",
    message: "jhhghttrtrdrrs",
    date: "21/05/2024",
  },
];

export const GRAPH: Graph[] = [
  {
    title: "Toutes les commandes",
    data1: [12, 19, 14, 5, 16, 19],
    data2: [14, 16, 20, 5, 18, 22],
    chart: "line",
  },
  {
    title: "Nouveaux fournisseurs",
    data1: [12, 19, 14, 5, 16, 19],
    data2: [14, 16, 20, 5, 18, 22],
    chart: "bar",
  },
  {
    title: "Nouvelles marques",
    data1: [12, 19, 14, 5, 16, 19],
    data2: [14, 16, 20, 5, 18, 22],
    chart: "point",
  },
  {
    title: "Produits actifs vs inactifs",
    data1: [40, 60],
    data2: [40],
    chart: "dough",
  },
];


export const MARKERS: MarkerInfo[] = [
  {
    geocode: [48.856614, 2.3522219], // Paris
    name: "Fournisseur 1",
  },
  {
    geocode: [48.862725, 2.287592], // Paris - Trocadéro
    name: "Fournisseur 2",
  },
  {
    geocode: [48.85614465, 2.297820393322227], // Paris - Eiffel Tower
    name: "Fournisseur 3",
  },
  {
    geocode: [48.8737917, 2.2950275], // Paris - Arc de Triomphe
    name: "Fournisseur 4",
  },
  {
    geocode: [48.8588443, 2.2943506], // Paris - Eiffel Tower
    name: "Fournisseur 5",
  },
  {
    geocode: [48.804865, 2.120355], // Versailles
    name: "Fournisseur 6",
  },
  {
    geocode: [48.9021449, 2.4432121], // Saint-Denis
    name: "Fournisseur 7",
  },
  {
    geocode: [48.895651, 2.240655], // Levallois-Perret
    name: "Fournisseur 8",
  },
  {
    geocode: [48.898348, 2.377637], // Pantin
    name: "Fournisseur 9",
  },
  {
    geocode: [48.812485, 2.398603], // Vitry-sur-Seine
    name: "Fournisseur 10",
  },
  {
    geocode: [48.866667, 2.333333], // Paris - Centre
    name: "Fournisseur 11",
  },
  {
    geocode: [48.8708, 2.3274], // Paris - Place de la Concorde
    name: "Fournisseur 12",
  },
  {
    geocode: [48.853, 2.3499], // Paris - Île de la Cité
    name: "Fournisseur 13",
  },
  {
    geocode: [48.864716, 2.349014], // Paris - Le Marais
    name: "Fournisseur 14",
  },
  {
    geocode: [48.8606, 2.3376], // Paris - Louvre Museum
    name: "Fournisseur 15",
  },
  {
    geocode: [48.85341, 2.3488], // Paris - Saint-Germain-des-Prés
    name: "Fournisseur 16",
  },
  {
    geocode: [48.8789, 2.3641], // Paris - Montmartre
    name: "Fournisseur 17",
  },
  {
    geocode: [48.833, 2.333], // Paris - Montparnasse
    name: "Fournisseur 18",
  },
  {
    geocode: [48.8485, 2.3212], // Paris - Quartier Latin
    name: "Fournisseur 19",
  },
  {
    geocode: [48.8738, 2.295], // Paris - Champs-Élysées
    name: "Fournisseur 20",
  },
  {
    geocode: [43.296482, 5.36978], // Marseille
    name: "Fournisseur 13",
  },
  {
    geocode: [43.303074, 5.381179], // Marseille - Vieux Port
    name: "Fournisseur 21",
  },
  {
    geocode: [43.2806, 5.2404], // Marseille - La Valentine
    name: "Fournisseur 22",
  },
  {
    geocode: [43.2811, 5.3869], // Marseille - Castellane
    name: "Fournisseur 23",
  },
  {
    geocode: [43.2708, 5.4211], // Marseille - La Pointe Rouge
    name: "Fournisseur 24",
  },
  {
    geocode: [43.3366, 5.3473], // Marseille - Les Goudes
    name: "Fournisseur 25",
  },
  {
    geocode: [43.2938, 5.3758], // Marseille - Le Panier
    name: "Fournisseur 26",
  },
  {
    geocode: [43.2857, 5.3744], // Marseille - Joliette
    name: "Fournisseur 27",
  },
  {
    geocode: [43.3117, 5.3806], // Marseille - Palais Longchamp
    name: "Fournisseur 28",
  },
  {
    geocode: [43.3183, 5.4011], // Marseille - La Blancarde
    name: "Fournisseur 29",
  },
  {
    geocode: [43.3225, 5.3805], // Marseille - Baille
    name: "Fournisseur 30",
  },
  {
    geocode: [44.837789, -0.57918], // Bordeaux
    name: "Fournisseur 14",
  },
  {
    geocode: [47.218371, -1.553621], // Nantes
    name: "Fournisseur 15",
  },
  {
    geocode: [50.62925, 3.057256], // Lille
    name: "Fournisseur 16",
  },
  {
    geocode: [48.58392, 7.74553], // Strasbourg
    name: "Fournisseur 17",
  },
  {
    geocode: [45.188529, 5.724524], // Grenoble
    name: "Fournisseur 18",
  },
  {
    geocode: [43.710173, 7.261953], // Nice
    name: "Fournisseur 19",
  },
  {
    geocode: [49.443232, 1.099971], // Rouen
    name: "Fournisseur 20",
  },
  {
    geocode: [49.258329, 4.031696], // Reims
    name: "Fournisseur 21",
  },
  {
    geocode: [48.117266, -1.677793], // Rennes
    name: "Fournisseur 22",
  },
  {
    geocode: [47.322047, 5.04148], // Dijon
    name: "Fournisseur 23",
  },
  {
    geocode: [43.529742, 5.447427], // Aix-en-Provence
    name: "Fournisseur 25",
  },
  {
    geocode: [43.710172, 7.261953], // Nice
    name: "Fournisseur 26",
  },
  {
    geocode: [49.49437, 0.107929], // Le Havre
    name: "Fournisseur 27",
  },
  {
    geocode: [45.759723, 4.842223], // Villeurbanne
    name: "Fournisseur 28",
  },
  {
    geocode: [50.370963, 3.075355], // Roubaix
    name: "Fournisseur 29",
  },
  {
    geocode: [48.3028, 4.0799], // Troyes
    name: "Fournisseur 30",
  },
  {
    geocode: [48.390394, -4.486076], // Brest
    name: "Fournisseur 31",
  },
  {
    geocode: [50.632, 3.057], // Villeneuve-d'Ascq
    name: "Fournisseur 32",
  },
  {
    geocode: [44.841225, -0.580036], // Mérignac
    name: "Fournisseur 33",
  },
  {
    geocode: [43.527961, 5.445428], // Aix-en-Provence
    name: "Fournisseur 34",
  },
  {
    geocode: [43.31667, 5.37], // Marseille
    name: "Fournisseur 35",
  },
  {
    geocode: [43.52974, 5.44743], // Aix-en-Provence
    name: "Fournisseur 36",
  },
  {
    geocode: [47.322047, 5.04148], // Dijon
    name: "Fournisseur 37",
  },
  {
    geocode: [44.837789, -0.57918], // Bordeaux
    name: "Fournisseur 38",
  },
  {
    geocode: [45.188529, 5.724524], // Grenoble
    name: "Fournisseur 39",
  },
  {
    geocode: [50.62925, 3.057256], // Lille
    name: "Fournisseur 40",
  },
  {
    geocode: [48.58392, 7.74553], // Strasbourg
    name: "Fournisseur 41",
  },
  {
    geocode: [49.258329, 4.031696], // Reims
    name: "Fournisseur 42",
  },
  {
    geocode: [48.117266, -1.677793], // Rennes
    name: "Fournisseur 43",
  },
  {
    geocode: [47.218371, -1.553621], // Nantes
    name: "Fournisseur 44",
  },
  {
    geocode: [48.390394, -4.486076], // Brest
    name: "Fournisseur 45",
  },
  {
    geocode: [45.764043, 4.835659], // Lyon
    name: "Fournisseur 46",
  },
  {
    geocode: [44.841225, -0.580036], // Mérignac
    name: "Fournisseur 48",
  },
  {
    geocode: [45.759723, 4.842223], // Villeurbanne
    name: "Fournisseur 49",
  },
  {
    geocode: [50.370963, 3.075355], // Roubaix
    name: "Fournisseur 50",
  },
  {
    geocode: [49.49437, 0.107929], // Le Havre
    name: "Fournisseur 51",
  },
  {
    geocode: [50.632, 3.057], // Villeneuve-d'Ascq
    name: "Fournisseur 52",
  },
  {
    geocode: [48.3028, 4.0799], // Troyes
    name: "Fournisseur 53",
  },
];
