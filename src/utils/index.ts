import { Filters_1, Link, LinkCard, ProductsCreated, Suppliers } from "@/type";
import { Home, Pen, Truck, ShoppingCart } from "lucide-react";

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
    icon: Pen,
    showInSidebar: true,
  },
  {
    name: "Ajout d'un nouveau produit",
    link: "/edit/edit-product",
    icon: Pen,
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

export const PRODUCT_CREATED: ProductsCreated[] = [
  {
    id: 1,
    ref: "03.800010198",
    name: "Chaussures d'intervention ZEPHYR TF MID",
    familly: "chaussures",
    subFamilly: "chaussures de randonnée",
    brand: "ZEPHYR",
    collection: "LOWA",
    status: 1
  },
  {
    id: 2,
    ref: "02.829910006",
    name: "Sac à dos alpinisme PAPANG 37",
    familly: "alpinisme",
    subFamilly: "Sacs à dos et accessoires",
    brand: "CILAO",
    collection: "PAPANG",
    status: 0
  },
  {
    id: 3,
    ref: "055.808120142",
    name: "Luge toupie SUPERSTAR",
    familly: "ski/ski de randonnée",
    subFamilly: "luges",
    brand: "FRENDO",
    collection: "SUPERSTAR",
    status: 1
  },
  {
    id: 4,
    ref: "44.822648552",
    name: "Manchons booster ELITE EVOLUTION",
    familly: "vêtements",
    subFamilly: "gants, bonnets et accessoires",
    brand: "BV SPORT",
    collection: "EVOLUTION",
    status: 1
  },
  {
    id: 5,
    ref: "11.835910095",
    name: "T-SHIRT MC ARCY M",
    familly: "Grimpe / Escalade / Slackline ",
    subFamilly: "Vêtements d'escalde",
    brand: "ARCY",
    collection: "ARCY",
    status: 0
  },
  {
    id: 6,
    ref: "19.805930241",
    name: "Chaussures de running CLIFTON 9 M",
    familly: "chaussures",
    subFamilly: "chaussures lifestyle",
    brand: "HOKA",
    collection: "CLIFTON",
    status: 0
  },
  {
    id: 7,
    ref: "19.8054568",
    name: "Chaussures de randonnée AEQUILIBRIUM TREK GTX",
    familly: "chaussures",
    subFamilly: "chaussures de randonnée",
    brand: "AEQUILIBRIUM",
    collection: "LA SPORTIVA",
    status: 0
  },
  {
    id: 7,
    ref: "19.80545656656",
    name: "t-shirt Merino PW 140 SEAMLESS",
    familly: "sous-vêtements",
    subFamilly: "alpinisme",
    brand: "ODLO",
    collection: "ODLO",
    status: 1
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