import { LINKCARD_PRODUCT } from "../../utils/index";
import Card from "../../components/Shared/Card";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { LinkCard } from "@/type";
import { Divider } from "@mui/material";
import useFetch from "../../utils/hooks/usefetch";

interface Product {
  GA_CODEARTICLE: string;
  GA_FERME: string;
  GA_FOURNPRINC: string;
  GA_HISTORIQUE: string[];
  GA_LIBCOMPL: string;
  GA_LIBELLE: string;
  GA_LIBREART1: number;
  GA_LIBREART2: number;
  GA_LIBREART3: number;
  GA_LIBREART4: number;
}

export default function SingleProductPage() {
  const [page, setPage] = useState("details");
  const { id } = useParams();
  const colors = ["bg-gray-700", "bg-gray-500", "bg-gray-400"];
  const { data: product } = useFetch<Product>(
    `${process.env.REACT_APP_URL_DEV}/api/v1/product/${id}`
  );

  

  console.log(product);
  return (
    <section className="mt-7">
      <Card title={`Article n°${product?.GA_CODEARTICLE}`}>
        <div className="mt-4 mb-[30px] px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-7">
              
            </div>
          </div>
          <div className="mt-6">
            <Divider />
          </div>
        </div>

        {/* Product Detail */}
        {product && page === "details" ? (
          <div className="flex grid-rows-3 grid-flow-col gap-4 mt-5 px-4">
            <div className="flex-col row-span-3 justify-center">
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                {/* <img
                  src={product?.imgPath}
                  alt=""
                  className="w-full h-auto rounded-lg transition-all duration-[20s] transform scale-100 hover:scale-150 shadow-none hover:shadow-lg"
                /> */}
              </div>
            </div>
            <div className="flex-col col-span-2 justify-center">
              <h2 className="text-2xl text-gray-600 font-bold font-montserrat capitalize">
              {product?.GA_LIBCOMPL}
              </h2>
              <div className="grid grid-cols-1 gap-4 mt-5">
                <div className="overflow-x-auto">
                  <table className="table-auto">
                    <tbody className="capitalize font-bold">
                      <tr>
                        <td className="px-4 py-4 text-gray-700">Code article :</td>
                        <td className="px-4 py-4 text-gray-500 font-normal">
                          {product?.GA_CODEARTICLE}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-4 text-gray-700">
                          Libéllé complet :
                        </td>
                        <td className="px-4 py-4 text-gray-500 font-normal">
                          {product?.GA_LIBCOMPL}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-4 text-gray-700">
                          Libéllé :
                        </td>
                        <td className="px-4 py-4 text-gray-500 font-normal">
                          {product?.GA_LIBELLE}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-4 text-gray-700">Fournisseur principal :</td>
                        <td className="px-4 py-4 text-gray-500 font-normal">
                          {product?.GA_FOURNPRINC}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-4 text-gray-700">
                          Famille :
                        </td>
                        <td className="px-4 py-4 text-gray-500 font-normal">
                          {product?.GA_LIBREART1}
                        </td>
                      </tr>
                      {product?.GA_LIBREART2 != null && (
                      <tr>
                        <td className="px-4 py-4 text-gray-700">
                          Sous-famille :
                        </td>
                        <td className="px-4 py-4 text-gray-500 font-normal">
                          {product?.GA_LIBREART2}
                        </td>
                      </tr>
                      )}
                      {product?.GA_LIBREART3 != null && (
                      <tr>
                        <td className="px-4 py-4 text-gray-700">
                          Sous-Sous-famille :
                        </td>
                        <td className="px-4 py-4 text-gray-500 font-normal">
                          {product?.GA_LIBREART3}
                        </td>
                      </tr>
                      )}
                      <tr>
                        <td className="px-4 py-4 text-gray-700">
                          Fermé :
                        </td>
                        <td className="px-4 py-4 flex items-center gap-2 select-none">
                          {product?.GA_FERME}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        ) : (<div>chargement</div>)}
      </Card>
    </section>
  );
}
