import { Link } from "@/type";
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
    link: "/suppliers",
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

type Product = {
  id: number;
  reference: string;
  name: string;
  family: string;
  subFamily: string;
  brand: string;
  collection: string;
  img: string;
};


export const products: Product[] = [
  {
    id: 1,
    reference: "03.800010198",
    name: "Chaussures D'intervention ZEPHYR TF MID",
    family: "Chaussures",
    subFamily: "Chaussures De Randonnée",
    brand: "ZEPHYR",
    collection: "LOWA",
    img: "/img/logo.png",
  },
  {
    id: 2,
    reference: "02.82910006",
    name: "Sac À Dos Alpinisme PAPANG 37",
    family: "Alpinisme",
    subFamily: "Sacs À Dos Et Accessoires",
    brand: "CILAO",
    collection: "PAPANG",
    img: "/img/logo.png",
  },
];