import { Filters_1, Link, LinkCard, Size, Suppliers, Params, Notifications } from "@/type";
import { Home, Pen, Truck, ShoppingCart, Barcode, Settings, Grid3X3, Ruler, ListOrdered, Shirt, Captions, File, FileClock, FileCheck2, UserCog, AreaChart, LineChart, Settings2, Factory } from "lucide-react";

export const LINKS: Link[] = [
  {
    name: "Dashboard",
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
    link: "/edit",
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
    bg: "/img/bg_params_1.png"
  },
  {
    name: "Dimensions",
    link: "/parameters/dimension",
    icon: Ruler,
    bg: "/img/bg_params_2.jpg"
  },
  {
    name: "Grilles de dimensions",
    link: "/parameters/grid",
    icon: Grid3X3,
    bg: "/img/bg_params_3.png"
  },
  {
    name: "Collections",
    link: "/parameters/collection",
    icon: Shirt,
    bg: "/img/bg_params_4.png"
  },
  {
    name: "Marques",
    link: "/parameters/brand",
    icon: Captions,
    bg: "/img/bg_params_5.png"
  },
 
 
];

export const SUPPLIERS: Suppliers[] = [
  {
    code: "ERCFGJ89",
    name: "Michel",
    arobase: "67GGGVV"
  },
  {
    code: "ERCF546",
    name: "Jean",
    arobase: "67GGIPP"
  },
  {
    code: "ERTYJNNJ89",
    name: "Jean pourpre",
    arobase: "674567"
  },
  {
    code: "ERCFGJ89",
    name: "Michelle la chienne",
    arobase: "67G67899"
  },
];

export const LINKCARD: LinkCard[] = [
  {
    name: "En cours",
    page: "progress"
  },
  {
    name: "Finalisés",
    page: "done"
  },
];

export const LINKCARD_EDIT: LinkCard[] = [
  {
    name: "Ajouter un produit",
    page: "addProduct"
  },
  {
    name: "Ajouter une famille",
    page: "addFamilly"
  },
  {
    name: "Ajouter une marque",
    page: "addBrand"
  },
  {
    name: "Ajouter une collection",
    page: "addCollection"
  },
  

];

export const LINKCARD_PRODUCT: LinkCard[] = [
  {
    name: "Details du produit",
    page: "details"
  },
  {
    name: "Uvcs",
    page: "uvcs"
  },
 
];

export const LINKCARD_SEARCH: LinkCard[] = [
  {
    name: "Standards",
    page: "standard"
  },
  {
    name: "Compléments",
    page: "complement"
  },
  {
    name: "Caractéristiques",
    page: "caracteristiques"
  },
  {
    name: "Dimensions",
    page: "dimension"
  },
  

];

export const NOTIF: Notifications[] = [
  {
    user: "John Doe",
    message: "La création de produit a été validée",
    date: "21/05/2024"
  },
  {
    user: "Jane Da",
    message: "La création de produit a été validée",
    date: "21/05/2024"
  },
  {
    user: "Michel Jambon",
    message: "La création de produit a été validée",
    date: "21/05/2024"
  },
  {
    user: "Pré-ref",
    message: "Vous avez des produits en cours de création",
    date: "21/05/2024"
  },
];

export const MESSAGES: Notifications[] = [
  {
    user: "John Doe",
    message: "Il y a un probleme dans le produit que vous avez enregistrée",
    date: "21/05/2024"
  },
  {
    user: "Jane Da",
    message: "njehfjehdefefffff",
    date: "21/05/2024"
  },
  {
    user: "Michel Jambon",
    message: "fjehfefhjehieuieui",
    date: "21/05/2024"
  },
  {
    user: "Pré-ref",
    message: "jhhghttrtrdrrs",
    date: "21/05/2024"
  },
  {
    user: "Pré-ref",
    message: "jhhghttrtrdrrs",
    date: "21/05/2024"
  },
];

