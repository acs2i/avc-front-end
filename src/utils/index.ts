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