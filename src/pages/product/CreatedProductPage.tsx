import Card from "../../components/Card";
import React, { useState } from "react";
import Button from "../../components/FormElements/Button";
import { LINKCARD, PRODUCT_CREATED } from "../../utils/index";
import { LinkCard } from "@/type";
import { Divider } from "@mui/material";
import { CircleDotDashed, Eye } from "lucide-react";

export default function CreatedProductPage() {
  const [page, setPage] = useState("progress");

  return (
    <div className="mt-7">
      <div className="flex justify-end mb-5">
        <Button size="medium" orange to="/product/create-product">
          Ajouter un produit
        </Button>
      </div>
      <Card title="Les produits créés">
        <div className="mt-4 mb-[30px]">
          <div className="flex items-center gap-7">
            {LINKCARD.map((link: LinkCard) => (
              <>
                <button
                  className={`font-bold text-gray-600 ${
                    page === link.page ? "text-green-700" : ""
                  }`}
                  onClick={() => setPage(link.page)}
                >
                  {link.name}
                </button>
                <div className="w-[1px] h-[20px] bg-gray-300"></div>
              </>
            ))}
          </div>
          <div className="mt-6">
            <Divider />
          </div>
        </div>

        {page === "progress" && (
          <div className="flex flex-col gap-4">
            <h4 className="text-center text-3xl text-gray-600 mb-5">
              <span className="font-bold text-gray-700">Ajouts</span> non finalisés
            </h4>
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-sky-50">
                <tr>
                  <th scope="col" className="px-6 py-4">
                    Référence
                  </th>
                  <th scope="col" className="px-6 py-4">
                    NOM
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
                {PRODUCT_CREATED.filter((product) => product.status === 0) // Filtrer les produits avec status 1 (en cours de validation)
                  .map((product, i) => (
                    <>
                      <tr className="bg-white border-b cursor-pointer hover:bg-slate-100">
                        <td className="px-6 py-4">{product.ref}</td>
                        <td className="px-6 py-4">{product.name}</td>
                        <td className="px-6 py-4">{product.familly}</td>
                        <td className="px-6 py-4">{product.subFamilly}</td>
                        <td className="px-6 py-4 font-bold">En cours...</td>
                        <td className="px-6 py-4">
                          <Button size="small" warning>
                            Finaliser
                            <CircleDotDashed/>
                          </Button>
                        </td>
                      </tr>
                    </>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {page === "done" && (
          <div className="flex flex-col gap-4">
            <h4 className="text-center text-3xl text-gray-600 mb-5">
              <span className="font-bold text-gray-700">Ajouts</span> finalisés
            </h4>
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-sky-50">
                <tr>
                  <th scope="col" className="px-6 py-4">
                    Référence
                  </th>
                  <th scope="col" className="px-6 py-4">
                    NOM
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
                {PRODUCT_CREATED.filter((product) => product.status === 1) // Filtrer les produits avec status 1 (en cours de validation)
                  .map((product, i) => (
                    <>
                      <tr className="bg-white border-b cursor-pointer hover:bg-slate-100">
                        <td className="px-6 py-4">{product.ref}</td>
                        <td className="px-6 py-4">{product.name}</td>
                        <td className="px-6 py-4">{product.familly}</td>
                        <td className="px-6 py-4">{product.subFamilly}</td>
                        <td className="px-6 py-4 font-bold">Terminé</td>
                        <td className="px-6 py-4">
                          <Button size="small" green>
                            Consulter
                            <Eye/>
                          </Button>
                        </td>
                      </tr>
                    </>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
