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
} from "lucide-react";

export const LINKS: Link[] = [
  {
    linkCategory: [
      {
        name: "Apps",
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
                name: "Liste des références",
                link: "/product",
              },
              {
                name: "Créer une référence",
                link: "/product/edit",
              },
              {
                name: "Références créées",
                link: "/draft",
              },
            ],
            icon: Shirt,
          },
         
          {
            name: "Fournisseurs",
            linksGroup: [
              {
                name: "Liste des fournisseurs",
                link: "/suppliers/suppliers-list",
              },
              {
                name: "Créer un fournisseur",
                link: "/suppliers/create",
              },
            ],
            icon: Factory,
          },
          {
            name: "Paramètres",
            link: "/parameters",
            linksGroup: [],
            icon: Settings2,
          },
          // {
          //   name: "Calendrier",
          //   link: "/calendar",
          //   linksGroup: [],
          //   icon: CalendarDays,
          // },
          {
            name: "Chat",
            link: "/chat",
            linksGroup: [],
            icon: MessageSquare,
          },
        ],
      },
      {
        name: "Admin",
        linksGroup: [
          {
            name: "Utilisateurs",
            linksGroup: [
              {
                name: "Liste des utilisateurs",
                link: "/admin",
              },
              {
                name: "Créer un groupe",
                link: "/admin/create-group",
              },
              {
                name: "Groupes créés",
                link: "/admin/created-group",
              },
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
    name: "Tarifs",
    link: "/parameters/brand",
    icon: Tag,
    page: "tarif",
  },
  {
    name: "Regime de taxe",
    link: "/parameters/brand",
    icon: HandCoins,
    page: "tax_1",
  },
  {
    name: "Taxes",
    link: "/parameters/brand",
    icon: HandCoins,
    page: "tax_2",
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

export const PRODUCTS: Product[] = [
  {
    code: "678900",
    name: "SAC A DOS ALPINISME MIXT 25 + 5",
    brand: "Ma marque",
    family: "Matériel de montagne",
    subFamily: "Montagne",
    supplier: "Millet",
    productImg:
      "https://www.auvieuxcampeur.fr/media/catalog/product/cache/f83a0334dfee85ff9d02a56cf16dc6c2/8/0/804646122_263.jpg",
    creatorName: "Walid Bouaka",
    creatorImg:
      "https://media.istockphoto.com/id/1386479313/fr/photo/heureuse-femme-daffaires-afro-am%C3%A9ricaine-mill%C3%A9naire-posant-isol%C3%A9e-sur-du-blanc.jpg?s=612x612&w=0&k=20&c=CS0xj40eNCorQyzN1ImeMKlvPDocPHSaMsXethQ-Q_g=",
    comment:
      "This Fitbit is fantastic! I was trying to be in better shape and needed some motivation, so I decided to treat myself to a new Fitbit.",
    status: 1,
  },
  {
    code: "678900",
    name: "ROULEAU DE PEAUX RACE PRO 2.0",
    brand: "Ma marque",
    family: "Matériel de montagne",
    subFamily: "Montagne",
    supplier: "Millet",
    productImg:
      "https://www.auvieuxcampeur.fr/media/catalog/product/cache/f83a0334dfee85ff9d02a56cf16dc6c2/8/2/821580047_603.jpg",
    creatorName: "Walid Bouaka",
    creatorImg:
      "https://media.istockphoto.com/id/1386479313/fr/photo/heureuse-femme-daffaires-afro-am%C3%A9ricaine-mill%C3%A9naire-posant-isol%C3%A9e-sur-du-blanc.jpg?s=612x612&w=0&k=20&c=CS0xj40eNCorQyzN1ImeMKlvPDocPHSaMsXethQ-Q_g=",
    comment:
      "La peau Pomoca Race 2.0 offre une glisse incroyable grâce à un nouveau procédé de glisse utilisant un produit de très haute qualité. Un conseil pour améliorer la glisse : vous crayonnez le poil avec un fart tendre, puis un passage avec le fer à farter pour gorger le poil et le tour est joué. Vendue au mètre.",
    status: 0,
  },
  {
    code: "678900",
    name: "SHORT SPOTLESS EVOLUTION W",
    brand: "Ma marque",
    family: "Matériel de montagne",
    subFamily: "Montagne",
    supplier: "Millet",
    productImg:
      "https://www.auvieuxcampeur.fr/media/catalog/product/cache/f83a0334dfee85ff9d02a56cf16dc6c2/8/0/804560306_152.jpg",
    creatorName: "Michel Jambon",
    creatorImg:
      "https://upload.wikimedia.org/wikipedia/commons/b/b7/Michel_Cremades.jpg",
    comment:
      "Mesdames, ce short Spotless Evolution Royal Robbins est juste parfait pour toutes vos aventures en plein air ! Ultra confortable, anti-tâches (oui, vous avez bien lu !), et extensible dans tous les sens pour suivre tous vos mouvements. Que vous partiez en rando ou juste pour une journée à flâner dehors, ce short est l’indispensable absolu !",
    status: 1,
  },
  {
    code: "678900",
    name: "PIOLET AIR TECH EVO",
    brand: "Ma marque",
    family: "Matériel de montagne",
    subFamily: "Montagne",
    supplier: "Millet",
    productImg:
      "https://www.auvieuxcampeur.fr/media/catalog/product/cache/f83a0334dfee85ff9d02a56cf16dc6c2/8/0/802890193_303.jpg",
    creatorName: "Jean Pourpre",
    creatorImg: "https://ekladata.com/ixROJV5Yo31eHvhwZqcq5aAvKZU.jpg",
    comment:
      "Mesdames, ce short Spotless Evolution Royal Robbins est juste parfait pour toutes vos aventures en plein air !",
    status: 1,
  },
  {
    code: "678900",
    name: "COUTEAU CO-PILOT",
    brand: "Ma marque",
    family: "Matériel de montagne",
    subFamily: "Montagne",
    supplier: "Millet",
    productImg:
      "https://www.auvieuxcampeur.fr/media/catalog/product/cache/f83a0334dfee85ff9d02a56cf16dc6c2/8/0/804270088_303_A.jpg",
    creatorName: "Walid Bouaka",
    creatorImg:
      "https://media.istockphoto.com/id/1386479313/fr/photo/heureuse-femme-daffaires-afro-am%C3%A9ricaine-mill%C3%A9naire-posant-isol%C3%A9e-sur-du-blanc.jpg?s=612x612&w=0&k=20&c=CS0xj40eNCorQyzN1ImeMKlvPDocPHSaMsXethQ-Q_g=",
    comment:
      "Mesdames, ce short Spotless Evolution Royal Robbins est juste parfait pour toutes vos aventures en plein air !",
    status: 1,
  },
  {
    code: "678900",
    name: "COUTEAU CO-PILOT",
    brand: "Ma marque",
    family: "Matériel de montagne",
    subFamily: "Montagne",
    supplier: "Millet",
    productImg:
      "https://www.auvieuxcampeur.fr/media/catalog/product/cache/f83a0334dfee85ff9d02a56cf16dc6c2/8/0/804270088_303_A.jpg",
    creatorName: "Walid Bouaka",
    creatorImg:
      "https://media.istockphoto.com/id/1386479313/fr/photo/heureuse-femme-daffaires-afro-am%C3%A9ricaine-mill%C3%A9naire-posant-isol%C3%A9e-sur-du-blanc.jpg?s=612x612&w=0&k=20&c=CS0xj40eNCorQyzN1ImeMKlvPDocPHSaMsXethQ-Q_g=",
    comment:
      "Mesdames, ce short Spotless Evolution Royal Robbins est juste parfait pour toutes vos aventures en plein air !",
    status: 2,
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
  {
    title: "Total orders",
    subtitle: "Last 7 days",
    data1: [300, 500, 900, 350, 650],
    data2: [300, 450, 1000, 300, 650],
    labels: ["Janvier", "Février", "Mars", "Avril", "Juin"],
    chartType: "bar",
  },
  {
    title: "New customers",
    subtitle: "Last 7 days",
    data1: [300, 500, 500, 800, 1000],
    data2: [200, 600, 450, 400, 200],
    labels: ["Janvier", "Février", "Mars", "Avril", "Juin"],
    chartType: "line",
  },
  {
    title: "UVC",
    subtitle: "Avec vs. sans code barre",
    data1: [1200, 500],
    data2: [],
    labels: ["Avec code barre", "Sans code barre"],
    chartType: "pie",
  },
  {
    title: "Paying vs non paying",
    subtitle: "Last 7 days",
    data1: [300, 500, 1000, 300, 650],
    data2: [200, 600, 450, 400, 500],
    labels: ["Janvier", "Février", "Mars", "Avril", "Juin"],
    chartType: "point",
  },
];
