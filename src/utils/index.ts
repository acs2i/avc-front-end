import {
  Link,
  LinkCard,
  Suppliers,
  Params,
  Notifications,
  Graph,
  MarkerInfo,
  Product,
  Card,
} from "@/type";
import {
  CalendarDays,
  TriangleAlert,
  ListOrdered,
  Ruler,
  Grid3X3,
  Shirt,
  Captions,
  BarChart2,
  Settings2,
  Factory,
  SquarePen,
  User,
  MessageSquare,
  Barcode,
  Tag,
  HandCoins,
  Euro,
  RectangleEllipsis,
  ShieldBan,
  Flag,
} from "lucide-react";

export const LINKS: Link[] = [
  {
    linkCategory: [
      {
        name: "",
        linksGroup: [
          {
            name: "Tableau de bord",
            link: "/",
            linksGroup: [],
            icon: BarChart2,
          },
          {
            name: "Articles",
            linksGroup: [
              {
                name: "Liste des articles",
                link: "/product",
              },
              {
                name: "Création d'un article",
                link: "/product/edit",
              },
              {
                name: "Importer un article",
                link: "/draft/import",
              },
              // {
              //   name: "Importer informations fournisseur",
              //   link: "/draft/import-supplier",
              // },
              {
                name: "Articles à traiter",
                link: "/draft",
              },
            ],
            icon: Shirt,
          },
          {
            name: "Fournisseurs",
            link: "/suppliers/suppliers-list",
            linksGroup: [],
            icon: Factory,
          },       
          {
            name: "Paramètres",
            link: "/parameters",
            linksGroup: [],
            icon: Settings2,
          },
          // {
          //   name: "Chat",
          //   link: "/chat",
          //   linksGroup: [],
          //   icon: MessageSquare,
          // },
          {
            name: "Utilisateurs",
            linksGroup: [
              {
                name: "Liste des utilisateurs",
                link: "/admin",
              },
              // {
              //   name: "Créer un groupe",
              //   link: "/admin/create-group",
              // },
              // {
              //   name: "Groupes créés",
              //   link: "/admin/created-group",
              // },
            ],
            icon: User,
          },
        ],
      },
    ],
  },
];
export const LINKS_Params: Params[] = [
  {
    name: "Classifications",
    link: "/parameters/classification",
    icon: ListOrdered,
    page: "classe",
  },
  {
    name: "Dimensions",
    link: "/parameters/dimension",
    icon: Ruler,
    page: "dimension",
  },
  {
    name: "Grilles de dimensions",
    link: "/parameters/grid",
    icon: Grid3X3,
    page: "grid",
  },
  {
    name: "Collections",
    link: "/parameters/collection",
    icon: Shirt,
    page: "collection",
  },
  {
    name: "Marques",
    link: "/parameters/brand",
    icon: Captions,
    page: "brand",
  },
  {
    name: "Champs utilisateur",
    link: "/parameters/brand",
    icon: RectangleEllipsis,
    page: "field",
  },
  {
    name: "Taxes",
    link: "/parameters/brand",
    icon: HandCoins,
    page: "tax",
  },
  {
    name: "Blocages",
    link: "/parameters/brand",
    icon: ShieldBan,
    page: "block",
  },
  {
    name: "Pays",
    link: "/parameters/brand",
    icon: Flag,
    page: "country",
  },
];

export const LINKS_Product: Params[] = [
  {
    name: "Dimensions",
    link: "",
    icon: Ruler,
    page: "dimension",
  },
  {
    name: "UVC",
    link: "",
    icon: Tag,
    page: "uvc",
  },
];

export const LINKS_UVC: Params[] = [
  {
    name: "Informations",
    link: "",
    icon: "",
    page: "infos",
  },
  {
    name: "Prix",
    link: "",
    icon: "",
    page: "price",
  },
  {
    name: "Fournisseurs",
    link: "",
    icon: "",
    page: "supplier",
  },
  {
    name: "Côtes & poids",
    link: "",
    icon: "",
    page: "weight",
  },
  {
    name: "EAN",
    link: "",
    icon: "",
    page: "ean",
  },
  {
    name: "Blocages",
    link: "",
    icon: "",
    page: "bloc",
  },
  {
    name: "Pays",
    link: "",
    icon: "",
    page: "country",
  },
  {
    name: "Champs utilisateur",
    link: "",
    icon: "",
    page: "user",
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
    name: "Identification",
    page: "general",
  },
  {
    name: "Caractéristiques du produit",
    page: "details",
  },
  {
    name: "Unité de vente consommateur",
    page: "unit",
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
    geocode: [48.8566, 2.3522], // Paris
    name: "Paris",
  },
  {
    geocode: [43.2965, 5.3698], // Marseille
    name: "Marseille",
  },
  {
    geocode: [45.7640, 4.8357], // Lyon
    name: "Lyon",
  },
  {
    geocode: [43.7102, 7.2620], // Nice
    name: "Nice",
  },
  {
    geocode: [50.6292, 3.0573], // Lille
    name: "Lille",
  },
  {
    geocode: [44.8378, -0.5792], // Bordeaux
    name: "Bordeaux",
  },
  {
    geocode: [48.5734, 7.7521], // Strasbourg
    name: "Strasbourg",
  },
  {
    geocode: [49.2583, 4.0317], // Reims
    name: "Reims",
  },
  {
    geocode: [48.1173, -1.6778], // Rennes
    name: "Rennes",
  },
  {
    geocode: [47.3220, 5.0415], // Dijon
    name: "Dijon",
  },
];

export const LINKCARD_DRAFT: LinkCard[] = [
  {
    name: "Brouillons",
    page: "draft",
  },
  {
    name: "En cours de validation...",
    page: "in progress",
  },
  {
    name: "Validée",
    page: "done",
  },
];

export const DRAFT_CATEGORY: LinkCard[] = [
  {
    name: "Créés",
    page: "created",
  },
  {
    name: "Extraits",
    page: "extract",
  },
  {
    name: "Importés",
    page: "import",
  },
];

export const CARD: Card[] = [
  // {
  //   title: "UVC",
  //   subtitle: "Avec vs. Sans Code Barre",
  //   data1: [],
  //   data2: [],
  //   labels: ["Avec Code Barre", "Sans Code Barre"],
  //   chartType: "pie",
  // },
  // {
  //   title: "Total orders",
  //   subtitle: "Last 7 days",
  //   data1: [300, 500, 900, 350, 650],
  //   data2: [300, 450, 1000, 300, 650],
  //   labels: ["Janvier", "Février", "Mars", "Avril", "Juin"],
  //   chartType: "bar",
  // },
  // {
  //   title: "New customers",
  //   subtitle: "Last 7 days",
  //   data1: [300, 500, 500, 800, 1000],
  //   data2: [200, 600, 450, 400, 200],
  //   labels: ["Janvier", "Février", "Mars", "Avril", "Juin"],
  //   chartType: "line",
  // },
  // {
  //   title: "UVC",
  //   subtitle: "Avec vs. sans code barre",
  //   data1: [1200, 500],
  //   data2: [],
  //   labels: ["Avec code barre", "Sans code barre"],
  //   chartType: "pie",
  // },
  // {
  //   title: "Paying vs non paying",
  //   subtitle: "Last 7 days",
  //   data1: [300, 500, 1000, 300, 650],
  //   data2: [200, 600, 450, 400, 500],
  //   labels: ["Janvier", "Février", "Mars", "Avril", "Juin"],
  //   chartType: "point",
  // },
];
