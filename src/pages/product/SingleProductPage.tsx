import { LINKCARD_PRODUCT } from "../../utils/index";
import Card from "../../components/Shared/Card";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { LinkCard } from "@/type";
import { Divider } from "@mui/material";
import useFetch from "../../utils/hooks/usefetch";
import { Check, X } from "lucide-react";

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
  family: any;
  subFamily: any;
  imgPath: string;
  uvcs: any[];
  brand: any;
}

export default function SingleProductPage() {
  const [page, setPage] = useState("details");
  const { id } = useParams();
  const colors = ["bg-gray-700", "bg-gray-500", "bg-gray-400"];
  const color = ["100", "200", "300", "400", "500", "600"];
  const size = ["39", "40", "40 1/2", "41", "41 1/2", "42", "43", "44"];
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8];
  const { data: product } = useFetch<Product[]>(
    `${process.env.REACT_APP_URL_DEV}/api/v1/product/${id}`
  );

  console.log(product);
  return (
    <section className="mt-7">
      <Card title={`Article n°${product && product[0]?.GA_CODEARTICLE}`}>
        <div className="mt-4 mb-[30px] px-4">
          <div className="flex items-center gap-7">
            {LINKCARD_PRODUCT.map((link: LinkCard, i) => (
              <React.Fragment key={i}>
                <button
                  className={`font-bold text-gray-600 ${
                    page === link.page ? "text-green-700" : ""
                  } ${page === link.page ? "animate-bounce" : ""}`}
                  onClick={() => setPage(link.page)}
                >
                  {link.name}
                </button>
                <div className="w-[1px] h-[20px] bg-gray-300"></div>
              </React.Fragment>
            ))}
          </div>
          <div className="mt-6">
            <Divider />
          </div>
        </div>

        {/* Product Detail */}
        {product && product.length > 0 && page === "details" && (
          <div className="flex grid-rows-3 grid-flow-col gap-4 mt-5 px-4">
            <div className="flex gap-[25px]">
              <div className="h-[400px] w-[400px] border border-gray-300 rounded-lg overflow-hidden">
                {product[0].imgPath ? (
                  <img
                    src={product[0].imgPath}
                    alt=""
                    className="w-full h-auto rounded-lg transition-all duration-[20s] transform scale-100 hover:scale-150 shadow-none hover:shadow-lg"
                  />
                ) : (
                  <img
                    src="/img/logo.png"
                    alt="logo"
                    className="w-full h-full object-cover rounded-lg shadow-none hover:shadow-lg"
                  />
                )}
              </div>
              <div className="flex-col col-span-2 justify-center">
                <h2 className="text-2xl text-gray-600 font-bold font-montserrat capitalize">
                  {product[0].GA_LIBELLE}
                </h2>
                <div className="grid grid-cols-1 gap-4 mt-5">
                  <div className="overflow-x-auto">
                    <table className="table-auto">
                      <tbody className="capitalize">
                        <tr>
                          <td className="px-4 py-2 text-gray-700 font-bold">
                            Code article :
                          </td>
                          <td className="px-4 py-2 text-gray-400 font-bold">
                            {product[0].GA_CODEARTICLE}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-gray-700 font-bold">
                            Libellé complet :
                          </td>
                          <td className="px-4 py-2 text-gray-400 font-bold">
                            {product[0].GA_LIBCOMPL}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-gray-700 font-bold">
                            Libellé :
                          </td>
                          {product && (
                            <td className="px-4 py-2 text-gray-400 font-bold">
                              {product[0].GA_LIBELLE}
                            </td>
                          )}
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-gray-700 font-bold">
                            Fournisseur principal :
                          </td>
                          <td className="px-4 py-2 text-gray-400 font-bold">
                            {product[0].GA_FOURNPRINC}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-gray-700 font-bold">
                            Famille :
                          </td>
                          <td className="px-4 py-2 text-gray-400 font-bold">
                            <div>
                              <span>{product[0].GA_LIBREART1}</span>
                              <span className="mx-1">-</span>
                              {product[0] && (
                                <span>{product[0].family.YX_LIBELLE}</span>
                              )}
                            </div>
                          </td>
                        </tr>
                        {product[0].GA_LIBREART2 && (
                          <tr>
                            <td className="px-4 py-2 text-gray-700 font-bold">
                              Sous-famille :
                            </td>
                            <td className="px-4 py-2 text-gray-400 font-bold">
                              <div>
                                <span>{product[0].GA_LIBREART2}</span>
                                <span className="mx-1">-</span>
                                <span>{product[0].subFamily.YX_LIBELLE}</span>
                              </div>
                            </td>
                          </tr>
                        )}
                        <tr>
                          <td className="px-4 py-2 text-gray-700 font-bold">
                            Tailles :
                          </td>
                          <td className="px-4 py-2 text-gray-400 font-bold">
                            <div className="flex items-center gap-2">
                              {product[0].uvcs.map((uvc, i) => (
                                <div className="border px-2 py-1 rounded-xs">
                                  {uvc.TAILLE}
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-gray-700 font-bold">
                            Couleurs :
                          </td>
                          <td className="px-4 py-2 text-gray-400 font-bold">
                            <div className="flex items-center gap-2">
                              {product[0].uvcs.map((uvc, i) => (
                                <div className="border px-2 py-1 rounded-xs">
                                  {uvc.COULEUR}
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Product diemnsions */}
        {product && page === "uvcs" && (
          <div className="overflow-x-auto bg-white">
            <div className="flex items-center gap-2 justify-center mb-6">
              <h4 className="text-2xl font-bold text-gray-800">UVCS</h4>
            </div>
            <table className="w-[90%] mx-auto">
              <thead className="bg-gray-100 text-md text-gray-400 border">
                <tr>
                  <th scope="col" className="px-6 py-4 w-[10px]"></th>
                  {/* Obtenir les tailles uniques */}
                  {Array.from(
                    new Set(product[0].uvcs.map((uvc) => uvc.TAILLE))
                  ).map((taille) => (
                    <th
                      scope="col"
                      className="px-6 py-4 text-center"
                      key={taille}
                    >
                      {taille}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from(
                  new Set(product[0].uvcs.map((uvc) => uvc.COULEUR))
                ).map((couleur) => (
                  <tr className="even:bg-gray-50 border" key={couleur}>
                    <td className="px-6 py-4 flex items-center gap-2 text-center font-bold text-gray-500">
                      {couleur}
                    </td>
                    {Array.from(
                      new Set(product[0].uvcs.map((uvc) => uvc.TAILLE))
                    ).map((taille) => {
                      const uvcExiste = product[0].uvcs.some(
                        (uvc) =>
                          uvc.COULEUR === couleur && uvc.TAILLE === taille
                      );

                      return (
                        <td key={`${couleur}-${taille}`}>
                          {uvcExiste ? (
                            <div className="flex justify-center items-center h-full text-green-600">
                              <Check />
                            </div>
                          ) : (
                            <div className="flex justify-center items-center h-full text-red-600">
                              <X />
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </section>
  );
}
