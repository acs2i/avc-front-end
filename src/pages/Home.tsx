import React, { useState } from "react";
import Card from "../components/Card";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Fuse from "fuse.js";
import { Link, useNavigate } from "react-router-dom";
import { Pen} from "lucide-react";

type Product = {
  id: number;
  reference: string;
  name: string;
  family: string;
  subFamily: string;
  brand: string;
  collection: string;
};

const products: Product[] = [
  {
    id: 1,
    reference: "03.800010198",
    name: "Chaussures D'intervention ZEPHYR TF MID",
    family: "Chaussures",
    subFamily: "Chaussures De Randonnée",
    brand: "ZEPHYR",
    collection: "LOWA",
  },
  {
    id: 2,
    reference: "02.82910006",
    name: "Sac À Dos Alpinisme PAPANG 37",
    family: "Alpinisme",
    subFamily: "Sacs À Dos Et Accessoires",
    brand: "CILAO",
    collection: "PAPANG",
  },
];

const fuse = new Fuse(products, {
  keys: ["name", "reference", "family", "subFamily", "brand", "collection"],
  includeMatches: true,
});

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFamily, setSelectedFamily] = useState("");
  const [selectedSubFamily, setSelectedSubFamily] = useState("");
  const [isStrict, setIsStrict] = useState(false);
  const navigate = useNavigate();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleFamilyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFamily(event.target.value);
  };

  const handleSubFamilyChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedSubFamily(event.target.value);
  };

  const handleStrictChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsStrict(event.target.checked);
  };

  const filteredProducts = isStrict
    ? fuse
        .search(`${searchTerm} ${selectedFamily} ${selectedSubFamily}`)
        .map((result) => result.item)
    : products.filter((product) =>
        Object.values(product).some(
          (value) =>
            value.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            (selectedFamily &&
              product.family.toLowerCase() === selectedFamily.toLowerCase()) ||
            (selectedSubFamily &&
              product.subFamily.toLowerCase() ===
                selectedSubFamily.toLowerCase())
        )
      );

  const families = Array.from(
    new Set(products.map((product) => product.family))
  );
  const subFamilies = Array.from(
    new Set(products.map((product) => product.subFamily))
  );

  const targetProduct = (id: Product) => {
    navigate(`/product/${id}`);
  };

  return (
    <div>
      <Card title="Recherche">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <div className="flex items-center mb-4 md:mb-0">
            <input
              type="text"
              placeholder="Rechercher"
              className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-64 m-1"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <select
              className="border border-gray-300 rounded-lg px-4 py-2 m-1"
              value={selectedFamily}
              onChange={handleFamilyChange}
            >
              <option value="">Famille</option>
              {families.map((family) => (
                <option key={family} value={family}>
                  {family}
                </option>
              ))}
            </select>
            <select
              className="border border-gray-300 rounded-lg px-4 py-2 m-1"
              value={selectedSubFamily}
              onChange={handleSubFamilyChange}
            >
              <option value="">Sous-famille</option>
              {subFamilies.map((subFamily) => (
                <option key={subFamily} value={subFamily}>
                  {subFamily}
                </option>
              ))}
            </select>
            <div className="ml-4 flex items-center">
              <FormControlLabel
                className="ml-3 text-gray-700 font-medium"
                control={
                  <Switch checked={isStrict} onChange={handleStrictChange} />
                }
                label="Strict"
              />
            </div>
          </div>
          <button className="bg-green-800 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
            Valider
          </button>
        </div>
      </Card>

      <Card title={`${products.length} résultats`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-blue-50">
              <tr>
                <th scope="col" className="px-6 py-4">
                  RÉFÉRENCE
                </th>
                <th scope="col" className="px-6 py-4">
                  NOM
                </th>
                <th scope="col" className="px-6 py-4">
                  FAMILLE
                </th>
                <th scope="col" className="px-6 py-4">
                  SOUS-FAMILLE
                </th>
                <th scope="col" className="px-6 py-4">
                  MARQUE
                </th>
                <th scope="col" className="px-6 py-4">
                  COLLECTION
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product: Product) => (
                <tr
                  key={product.id}
                  onClick={() => targetProduct(product.id as any)}
                  className="bg-white border-b cursor-pointer hover:bg-slate-100"
                >
                  <td className="px-6 py-4">{product.reference}</td>
                  <td className="px-6 py-4">{product.name}</td>
                  <td className="px-6 py-4">{product.family}</td>
                  <td className="px-6 py-4">{product.subFamily}</td>
                  <td className="px-6 py-4">{product.brand}</td>
                  <td className="px-6 py-4">{product.collection}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-center">
          <Link
            to="/product/create-product"
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded mt-4 flex items-center gap-3 w-[200px]"
          >
            Créer un produit
            <Pen />
          </Link>
        </div>
      </Card>
    </div>
  );
}
