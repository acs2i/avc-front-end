import React, { useState, useEffect } from "react";
import Card from "../components/Shared/Card";
import { Link, useNavigate } from "react-router-dom";
import { Pen } from "lucide-react";
import { FILTERS_1 } from "../utils";
import truncateText from "../utils/func/Formattext";
import Button from "../components/FormElements/Button";


interface Product {
  _id: string;
  name: string;
  family: any;
  subFamily: any;
  brand: string;
  productCollection: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModify, setIsModify] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/product`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    } finally {
      setIsLoading(false); 
    }
  };

  if (isLoading) {
    return <div>Chargement en cours...</div>;
  }

  return (
    <div className="flex gap-7 mt-7">
      <div className="w-[300px] min-w-[300px] bg-white rounded-lg shadow-md">
        <div className="w-full bg-green-900 text-white p-4 rounded-t-md text-center">
          <span className="text-xl">Filtres</span>
        </div>

        <div className="flex flex-col justify-between mt-6 p-4 ">
          <div className="flex flex-col gap-5">
            <div>
              <p className="mb-4 font-bold">Marques</p>
              <div className="flex flex-col gap-1">
                {FILTERS_1.map((filtre, i) => (
                  <div className="flex items-center" key={i}>
                    <input
                      id="default-checkbox"
                      type="checkbox"
                      value=""
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label className="ms-2 text-md text-gray-900 dark:text-gray-300">
                      {filtre.title}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-4 font-bold">Couleurs</p>
              <div className="flex flex-col gap-1">
                {FILTERS_1.map((filtre, i) => (
                  <div className="flex items-center" key={i}>
                    <input
                      id="default-checkbox"
                      type="checkbox"
                      value=""
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label className="ms-2 text-md text-gray-900 dark:text-gray-300">
                      {filtre.title}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-4 font-bold">Collections</p>
              <div className="flex flex-col gap-1">
                {FILTERS_1.map((filtre, i) => (
                  <div className="flex items-center" key={i}>
                    <input
                      id="default-checkbox"
                      type="checkbox"
                      value=""
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label className="ms-2 text-md text-gray-900 dark:text-gray-300">
                      {filtre.title}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-4 font-bold">Familles</p>
              <div className="flex flex-col gap-1">
                {FILTERS_1.map((filtre, i) => (
                  <div className="flex items-center" key={i}>
                    <input
                      id="default-checkbox"
                      type="checkbox"
                      value=""
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label className="ms-2 text-md text-gray-900 dark:text-gray-300">
                      {filtre.title}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 w-full mt-5">
              <button className="bg-slate-200 w-full py-2 rounded-md font-bold text-gray-600 hover:brightness-105">
                Réinitialiser les filtres
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 w-full">
        <div className="relative w-full shadow-2xl">
          <input
            type="search"
            id="search-dropdown"
            className="block p-2.5 w-full text-sm text-gray-900 border-2 border-gray-200 bg-gray-50 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="Rechercher..."
          />
          <button
            type="submit"
            className="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-green-800 rounded-e-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
          >
            <svg
              className="w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </button>
        </div>

        <div className="flex justify-end w-full">
          <button
            className="text-[14px] text-sky-700 hover:text-sky-400 flex items-center gap-2"
            onClick={() => setIsModify((prev) => !prev)}
          >
            {!isModify ? "Modifier" : "Arrêter de modifier"}
          </button>
        </div>

        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="w-full text-left">
            <thead className="bg-green-900 text-sm text-white">
              <tr>
                {isModify && (
                  <th scope="col" className="px-6 py-4">
                    #
                  </th>
                )}
                <th scope="col" className="px-6 py-4">
                  Référence
                </th>
                <th scope="col" className="px-6 py-4">
                  Libéllé
                </th>
                <th scope="col" className="px-6 py-4">
                  Famille
                </th>
                <th scope="col" className="px-6 py-4">
                  Sous-famille
                </th>
                <th scope="col" className="px-6 py-4">
                  Marque
                </th>
                <th scope="col" className="px-6 py-4">
                  Collection
                </th>
              </tr>
            </thead>
            <tbody>
              {products && products.length > 0 ? (
                products.map((product: any) => (
                  
                  <tr
                    key={product._id}
                    className="bg-white cursor-pointer hover:bg-slate-200 capitalize text-sm text-gray-500 even:bg-slate-50 whitespace-nowrap"
                    onClick={
                      isModify
                        ? () => {}
                        : () => navigate(`product/${product._id}`)
                    }
                  >
                    {isModify && (
                      <td className="px-6 py-4 font-bold">
                        <input
                          id="default-checkbox"
                          type="checkbox"
                          value=""
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </td>
                    )}
                    <td className="px-6 py-4 font-bold">{product.reference}</td>
                    <td className="px-6 py-4">
                      {product.name}
                    </td>
                    <td className="px-6 py-4">
                      {product.family}
                    </td>
                    <td className="px-6 py-4">
                      {product.subFamily}
                    </td>
                    <td className="px-6 py-4">{product.brand}</td>
                    <td className="px-6 py-4">{product.productCollection}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center">
                    Aucun produit à afficher
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* <div className="flex justify-center mt-5">
            <Link
              to="/edit/edit-product"
              className="w-[200px] bg-gradient-to-r from-orange-600 to-orange-400 text-white font-bold py-2 rounded-3xl hover:brightness-125 flex items-center justify-center gap-1"
            >
              Créer un produit
              <Pen size={20} />
            </Link>
          </div> */}
      </div>
    </div>
  );
}