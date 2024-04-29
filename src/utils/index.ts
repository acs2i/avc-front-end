import { Filters_1, Link, LinkCard, Size, Suppliers, Params } from "@/type";
import { Home, Pen, Truck, ShoppingCart, Barcode, Settings, Grid3X3, Ruler, ListOrdered, Shirt, Captions } from "lucide-react";

export const LINKS: Link[] = [
  {
    name: "Accueil",
    link: "/",
    icon: Home,
    showInSidebar: true,
  },
  {
    name: "Création",
    link: "/edit",
    icon: Barcode,
    showInSidebar: true,
  },
  {
    name: "Ajout d'un nouveau produit",
    link: "/edit/edit-product",
    icon: Pen,
    showInSidebar: false,
  },
  {
    name: "Paramètres",
    link: "/parameters",
    icon: Settings,
    showInSidebar: true,
  },
  {
    name: "Classifications",
    link: "/parameters/classification",
    icon: Settings,
    showInSidebar: false,
  },
  {
    name: "Modifier une classifications",
    link: "/parameters/classification/:id",
    icon: Settings,
    showInSidebar: false,
  },
  {
    name: "Collections",
    link: "/parameters/collection",
    icon: Settings,
    showInSidebar: false,
  },
  {
    name: "Modifier une collection",
    link: "/parameters/collection/:id",
    icon: Settings,
    showInSidebar: false,
  },
  {
    name: "Dimensions",
    link: "/parameters/dimension",
    icon: Settings,
    showInSidebar: false,
  },
  {
    name: "Marques",
    link: "/parameters/brand",
    icon: Settings,
    showInSidebar: false,
  },
  {
    name: "Liste des fournisseurs",
    link: "/suppliers/suppliers-list",
    icon: Truck,
    showInSidebar: true,
  },
  {
    name: "Page Produit",
    link: "/product/:id",
    icon: ShoppingCart,
    showInSidebar: false,
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
    link: "/",
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
    name: "Les tailles",
    page: "sizes"
  },
  {
    name: "Les Couleurs",
    page: "colors"
  },
  {
    name: "Les prix",
    page: "prices"
  },
 

];

export const FILTERS_1: Filters_1[] = [
  {
    title: "Mon filtre",
  },
  {
    title: "Mon filtre",
  },
  {
    title: "Mon filtre",
  },
  {
    title: "Mon filtre",
  },
  {
    title: "Mon filtre",
  },
  {
    title: "Mon filtre",
  },
]

export const Sizes: Size[] = [
  {
    value: "XS",
    label: "XS",
    name: "XS"
  },
  {
    value: "S",
    label: "S",
    name: "S"
  },
  {
    value: "M",
    label: "M",
    name: "M"
  },
  {
    value: "L",
    label: "L",
    name: "L"
  },
  {
    value: "XL",
    label: "XL",
    name: "XL"
  },
  {
    value: "XXL",
    label: "XXL",
    name: "XXL"
  },
]