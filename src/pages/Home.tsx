import React, { useState, useEffect } from "react";
import Card from "../components/Shared/Card";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Fuse from "fuse.js";
import { Link, useNavigate } from "react-router-dom";
import { Pen } from "lucide-react";
import { PRODUCT_CREATED } from "../utils";
import { ProductsCreated } from "@/type";
import { getFormData, setFormData, clearStorageData } from "../utils/func/LocalStorage";

const fuse = new Fuse(PRODUCT_CREATED, {
  keys: ["name", "ref", "family", "subFamily", "brand", "collection"],
  includeMatches: true,
});

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFamily, setSelectedFamily] = useState("");
  const [selectedSubFamily, setSelectedSubFamily] = useState("");
  const [isStrict, setIsStrict] = useState(false);
  const navigate = useNavigate();
  const email = "example@email.com"; // Remplacez par l'adresse e-mail de l'utilisateur actuel
  const formName = "searchForm";
  const pageName = window.location.pathname;

  useEffect(() => {
    const formData = getFormData(email, formName, pageName);
    setSearchTerm(formData.searchTerm || "");
    setSelectedFamily(formData.selectedFamily || "");
    setSelectedSubFamily(formData.selectedSubFamily || "");
    setIsStrict(formData.isStrict || false);
  }, [email, formName, pageName]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    setFormData(email, formName, pageName, {
      searchTerm: value,
      selectedFamily,
      selectedSubFamily,
      isStrict,
    });
  };

  const handleFamilyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedFamily(value);
    setFormData(email, formName, pageName, {
      searchTerm,
      selectedFamily: value,
      selectedSubFamily,
      isStrict,
    });
  };

  const handleSubFamilyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedSubFamily(value);
    setFormData(email, formName, pageName, {
      searchTerm,
      selectedFamily,
      selectedSubFamily: value,
      isStrict,
    });
  };

  const handleStrictChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.checked;
    setIsStrict(value);
    setFormData(email, formName, pageName, {
      searchTerm,
      selectedFamily,
      selectedSubFamily,
      isStrict: value,
    });
  };

  const filteredProducts = isStrict
    ? fuse
        .search(`${searchTerm} ${selectedFamily} ${selectedSubFamily}`)
        .map((result) => result.item)
    : PRODUCT_CREATED.filter((product) =>
        Object.values(product).some(
          (value) =>
            value.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            (selectedFamily &&
              product.familly.toLowerCase() === selectedFamily.toLowerCase()) ||
            (selectedSubFamily &&
              product.subFamilly.toLowerCase() ===
                selectedSubFamily.toLowerCase())
        )
      );

  const families = Array.from(
    new Set(PRODUCT_CREATED.map((product) => product.familly))
  );
  const subFamilies = Array.from(
    new Set(PRODUCT_CREATED.map((product) => product.subFamilly))
  );

  const targetProduct = (id: ProductsCreated) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="flex flex-col gap-7 mt-7">
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
              {subFamilies.map((subFamilly) => (
                <option key={subFamilly} value={subFamilly}>
                  {subFamilly}
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

      <Card title={`${PRODUCT_CREATED.length} résultats`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="uppercase bg-blue-50">
              <tr>
                <th scope="col" className="px-6 py-4">
                  RÉFÉRENCE
                </th>
                <th scope="col" className="px-6 py-6">
                  NOM
                </th>
                <th scope="col" className="px-6 py-6">
                  Famille
                </th>
                <th scope="col" className="px-6 py-6">
                  Sous-famille
                </th>
                <th scope="col" className="px-6 py-6">
                  MARQUE
                </th>
                <th scope="col" className="px-6 py-6">
                  COLLECTION
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  onClick={() => targetProduct(product.id as any)}
                  className="bg-white border-b cursor-pointer hover:bg-slate-100 capitalize font-bold text-sm text-gray-500"
                >
                  <td className="px-6 py-4">{product.ref}</td>
                  <td className="px-6 py-4">{product.name}</td>
                  <td className="px-6 py-4">{product.familly}</td>
                  <td className="px-6 py-4">{product.subFamilly}</td>
                  <td className="px-6 py-4">{product.brand}</td>
                  <td className="px-6 py-4">{product.collection}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-center mt-5">
          <Link
            to="/edit/edit-product"
            className="w-[200px] bg-gradient-to-r from-orange-600 to-orange-400 text-white font-bold py-2 rounded-3xl hover:brightness-125 flex items-center justify-center gap-1"
          >
            Créer un produit
            <Pen size={20} />
          </Link>
        </div>
      </Card>
    </div>
  );
}

// Voici des exemples d'utilisation de la fonction clearStorageData pour effacer les données du localStorage selon différents critères :

// Effacer les données pour un email spécifique :



// Copy code
// <button
//   onClick={() => clearStorageData("example@email.com")}
//   className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
// >
//   Clear Data for example@email.com
// </button>


// Effacer les données pour un formulaire spécifique (formName) :



// Copy code
// <button
//   onClick={() => clearStorageData(undefined, "searchForm")}
//   className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
// >
//   Clear Data for Search Form
// </button>


// Effacer les données pour une page spécifique (pageName) :
// jsx


// Copy code
// <button
//   onClick={() => clearStorageData(undefined, undefined, "/home")}
//   className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
// >
//   Clear Data for /home page
// </button>


// Effacer toutes les données du localStorage :
// jsx


// Copy code
// <button
//   onClick={() => clearStorageData()}
//   className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
// >
//   Clear All Data
// </button>