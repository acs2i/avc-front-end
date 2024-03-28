import { Link, LinkCard, Suppliers } from "@/type";
import { Home, Pen, Truck, ShoppingCart } from "lucide-react";

export const LINKS: Link[] = [
  {
    name: "Accueil",
    link: "/",
    icon: Home,
    showInSidebar: true,
  },
  {
    name: "Création produit",
    link: "/product/create-product",
    icon: Pen,
    showInSidebar: true,
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
    name: "Validé",
    page: "valided"
  },
  {
    name: "Confirmé",
    page: "confirmed"
  },
  {
    name: "Exporté",
    page: "exported"
  },
];