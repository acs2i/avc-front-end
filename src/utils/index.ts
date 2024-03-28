import { Link } from "@/type";
import { Home, Pen, Truck, ShoppingCart } from "lucide-react";

export const LINKS: Link[] = [
  {
    name: "Accueil",
    link: "/",
    icon : Home
  },
  {
    name: "Créer un produit",
    link: "/product/create-product",
    icon : Pen
  },
  {
    name: "Liste des fournisseurs",
    link: "/suppliers",
    icon : Truck
  },
  {
    name: "Page Produit",
    link: "/product/:id",
    icon : ShoppingCart
  },
];