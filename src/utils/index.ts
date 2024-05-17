import { Filters_1, Link, LinkCard, Size, Suppliers, Params } from "@/type";
import { Home, Pen, Truck, ShoppingCart, Barcode, Settings, Grid3X3, Ruler, ListOrdered, Shirt, Captions, File } from "lucide-react";

export const LINKS: Link[] = [
  {
    name: "Accueil",
    link: "/",
    icon: Home,
    showInSidebar: true,
    showInBottom: false,
  },
  {
    name: "Paramètres",
    link: "/parameters",
    icon: Settings,
    showInSidebar: true,
    showInBottom: false,
  },
  {
    name: "Ajouter un produit",
    link: "/edit",
    icon: Barcode,
    showInSidebar: true,
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
    icon: Truck,
    showInSidebar: true,
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
  },
  {
    name: "Dimensions",
    link: "/parameters/dimension",
    icon: Ruler,
  },
  {
    name: "Grilles de dimensions",
    link: "/parameters/grid",
    icon: Grid3X3,
  },
  {
    name: "Collections",
    link: "/parameters/collection",
    icon: Shirt,
  },
  {
    name: "Marques",
    link: "/parameters/brand",
    icon: Captions,
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

