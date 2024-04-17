import Card from "../../components/Shared/Card";
import React, { useState, useEffect } from "react";
import Button from "../../components/FormElements/Button";
import { LINKCARD} from "../../utils/index";
import { LinkCard } from "@/type";
import { Divider, Tooltip } from "@mui/material";
import { Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import truncateText from "../../utils/func/Formattext";

export default function CreatedProductPage() {
  const [page, setPage] = useState("progress");
  const [products, setProducts] = useState({ products: [] });
  const [isLoading, setIsLoading] = useState(true);

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
      setIsLoading(false); // Définir isLoading à false après avoir récupéré les données
    }
  };

  if (isLoading) {
    return <div>Chargement en cours...</div>;
  }

  return (
    <div className="mt-7 mb-[100px]">
      <Card title="Les produits créés">
        <div className="mt-4 mb-[30px] px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-7">
              {LINKCARD.map((link: LinkCard) => (
                <>
                  <button
                    className={`font-bold text-gray-600 ${
                      page === link.page ? "text-green-700" : ""
                    } ${page === link.page ? "animate-bounce" : ""}`}
                    onClick={() => setPage(link.page)}
                  >
                    {link.name}
                  </button>
                  <div className="w-[1px] h-[20px] bg-gray-300"></div>
                </>
              ))}
            </div>
            <Link
              to="/edit/edit-product"
              className="text-[14px] text-sky-700 hover:text-sky-400 flex items-center gap-2"
            >
              <Plus size={14} />
              <span>Ajouter un produit</span>
            </Link>
          </div>
          <div className="mt-6">
            <Divider />
          </div>
        </div>

        {page === "progress" && (
          <div className="flex flex-col gap-4">
            <h4 className="text-center text-3xl text-gray-600 mb-5">
              <span className="font-bold text-gray-700">Ajouts</span> non
              finalisés
            </h4>
            <table className="w-full text-left">
              <thead className="bg-green-900 text-sm text-white">
                <tr>
                  <th scope="col" className="px-6 py-4">
                    Référence
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Nom
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Famille
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Sous-famille
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.products.length > 0
                  ? products.products
                      .filter((product: any) => product.status === 0)
                      .map((product: any) => (
                        <>
                          <tr
                           className="bg-white cursor-pointer hover:bg-slate-200 capitalize text-sm text-gray-500 even:bg-slate-50 whitespace-nowrap"
                            key={product._id}
                          >
                            <td className="px-6 py-3 font-bold">{product.reference}</td>
                            <td className="px-6 py-3">{product.name}</td>
                            <td className="px-6 py-3">{product.family}</td>
                            <td className="px-6 py-3">{product.subFamily}</td>
                            <td className="px-6 py-3 font-bold">En cours...</td>
                            <td className="px-6 py-3 flex items-center gap-3">
                              <Button size="small" inverse>
                                Editer
                              </Button>
                              <Tooltip title="Supprimer">
                                <div className="text-red-400 hover:text-red-600">
                                  <Trash2 size={15} />
                                </div>
                              </Tooltip>
                            </td>
                          </tr>
                        </>
                      ))
                  : ""}
              </tbody>
            </table>
          </div>
        )}

        {page === "done" && (
          <div className="flex flex-col gap-4">
            <h4 className="text-center text-3xl text-gray-600 mb-5">
              <span className="font-bold text-gray-700">Ajouts</span> finalisés
            </h4>
            <table className="w-full text-left">
              <thead className="bg-green-900 text-sm text-white">
                <tr>
                  <th scope="col" className="px-6 py-4">
                    Référence
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Nom
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Famille
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Sous-famille
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.products.length > 0 ? (
                  products.products
                    .filter((product: any) => product.status === 1)
                    .map((product: any) => (
                      <>
                        <tr
                          className="bg-white cursor-pointer hover:bg-slate-200 capitalize text-sm text-gray-500 even:bg-slate-50 whitespace-nowrap"
                          key={product._id}
                        >
                          <td className="px-6 py-3 font-bold">{product.reference}</td>
                          <td className="px-6 py-3">{truncateText(product.name, 30)}</td>
                            <td className="px-6 py-3">{truncateText(product.family.join(', '), 30)}</td>
                            <td className="px-6 py-3">{truncateText(product.subFamily.join(', '), 50)}</td>
                          <td className="px-6 py-3 font-bold">Validé</td>
                          <td className="px-6 py-3 flex items-center gap-3">
                            <Button size="small" green>
                              Afficher
                            </Button>
                            <Tooltip title="Supprimer">
                              <div className="text-red-400 hover:text-red-600">
                                <Trash2 size={15} />
                              </div>
                            </Tooltip>
                          </td>
                        </tr>
                      </>
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
        )}
      </Card>
    </div>
  );
}
