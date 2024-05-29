import { LINKCARD_PRODUCT } from "../../utils/index";
import Card from "../../components/Shared/Card";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { LinkCard } from "@/type";
import { Divider } from "@mui/material";
import Button from "../../components/FormElements/Button";
import useFetch from "../../utils/hooks/usefetch";
import { Check, X } from "lucide-react";
import Modal from "../../components/Shared/Modal";

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

interface Row {
  GA_CHARLIBRE1: string;
  COULEUR: string;
  TAILLE: string;
}

export default function SingleProductPage() {
  const [page, setPage] = useState("general");
  const [selectedRowData, setSelectedRowData] = useState<Row | null>(null);
  const [PAEUVAalue, setPAEUValue] = useState("200.00");
  const [TBEUVAalue, setTBEUValue] = useState("200.00");
  const [TBEUPAEUVAalue, setTBEUPAEUValue] = useState("200.00");
  const { id } = useParams();
  const { data: product } = useFetch<Product[]>(
    `${process.env.REACT_APP_URL_DEV}/api/v1/product/${id}`
  );

  const handleRowClick = (item: any) => {
    setSelectedRowData(item);
  };

  console.log(product);
  console.log(selectedRowData);

  return (
    <section className="mt-7">
      <Card
        title={`Code article : ${product && product[0]?.GA_CODEARTICLE}`}
        createTitle="Editer La Fiche"
        link=""
      >
        <div className="mt-4 mb-[30px] px-4">
          <div className="flex justify-between">
            <div className="flex items-center gap-7">
              {LINKCARD_PRODUCT.map((link: LinkCard, i) => (
                <React.Fragment key={i}>
                  <button
                    className={`font-bold text-gray-600 text-xs ${
                      page === link.page ? "text-green-700" : ""
                    }`}
                    onClick={() => setPage(link.page)}
                  >
                    {link.name}
                  </button>
                  <div className="w-[1px] h-[20px] bg-gray-300"></div>
                </React.Fragment>
              ))}
            </div>
          </div>
          <div className="mt-3">
            <Divider />
          </div>
        </div>

        {/* Paramètres généraux */}
        {product && page === "general" && (
          <div className="flex grid-rows-3 grid-flow-col gap-4 mt-5 mb-5 px-4">
            <div className="flex gap-[25px]">
              <div className="h-[400px] w-[400px] overflow-hidden flex items-center justify-center">
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
                    className="w-1/2 h-1/2 object-cover rounded-lg shadow-none"
                  />
                )}
              </div>
              <div className="flex-col col-span-2 justify-center">
                <div className="relative grid grid-cols-1 gap-4 mt-7 border border-gray-200 rounded-md px-4 py-7 shadow-md w-[700px]">
                  <span className="absolute top-[-20px] left-[10px] bg-white px-3 text-[20px] italic font-bold">
                    {product[0].GA_LIBELLE}
                  </span>
                  <div className="overflow-x-auto">
                    <table className="table-auto">
                      <tbody className="capitalize text-xs text-gray-700">
                        <tr>
                          <td className="py-2 font-bold">Référence :</td>
                          <td className="px-4 py-2">
                            {product[0].GA_CODEARTICLE}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2 font-bold">Désignation :</td>
                          <td className="px-4 py-2">
                            {product[0].GA_LIBCOMPL}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2 font-bold">Désign. courte :</td>
                          {product && (
                            <td className="px-4 py-2">
                              {product[0].GA_LIBELLE}
                            </td>
                          )}
                        </tr>
                        <tr>
                          <td className="py-2 font-bold">Type :</td>
                          <td className="px-4 py-2">Marchandise</td>
                        </tr>
                        <tr>
                          <td className="py-2 font-bold">
                            Fournisseur principal :
                          </td>
                          <td className="px-4 py-2">
                            <div className="flex items-center justify-between">
                              <span>{product[0].GA_FOURNPRINC}</span>
                              <span className="text-blue-500 cursor-pointer hover:text-blue-400">
                                Définir
                              </span>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2 font-bold">Marque :</td>
                          <td className="px-4 py-2">
                            {product[0].brand.YX_LIBELLE}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2 text-gray-700 font-bold">
                            Famille :
                          </td>
                          <td className="px-4 py-2">
                            <div>
                              <span>{product[0].GA_LIBREART1}</span>
                              {product[0].family && (
                                <>
                                  <span className="mx-1">-</span>
                                  <span>{product[0].family.YX_LIBELLE}</span>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2 font-bold">Sous-famille :</td>
                          {product[0].GA_LIBREART2 && (
                            <td className="px-4 py-2">
                              <div>
                                <span>{product[0].GA_LIBREART2}</span>
                                {product[0].subFamily && (
                                  <>
                                    <span className="mx-1">-</span>
                                    <span>
                                      {product[0].subFamily.YX_LIBELLE}
                                    </span>
                                  </>
                                )}
                              </div>
                            </td>
                          )}
                        </tr>
                        <tr>
                          <td className="py-2 font-bold">Dimensions :</td>
                          <td className="px-4 py-2 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span>CT</span>
                              <span>-</span>
                              <span>Couleur/Taille</span>
                            </div>
                            <div>
                              <span className="text-blue-500 cursor-pointer hover:text-blue-400">
                                Définir
                              </span>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2 font-bold">
                            Prix achat /vente :
                          </td>
                          <td className="px-4 py-4 flex items-center justify-between">
                            <table className="w-[100%] mx-auto">
                              <thead className="bg-gray-100 text-md text-gray-400 border border-solid border-gray-300">
                                <tr>
                                  <th
                                    scope="col"
                                    className="px-6 py-4 text-center border border-solid border-gray-300 border-b"
                                  >
                                    Tarif
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-6 py-4 text-center border border-solid border-gray-300 border-b"
                                  >
                                    PRIX DE BASE
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="even:bg-gray-50">
                                  <th
                                    scope="row"
                                    className="px-6 py-4 text-center font-bold text-gray-500 border border-solid border-gray-300"
                                  >
                                    PAEU
                                  </th>
                                  <td className="p-0 text-center font-bold text-gray-500 border border-solid border-gray-300">
                                    <div className="h-full">
                                      <input
                                        type="text"
                                        className="w-full h-full border-none text-center focus:outline-none"
                                        value={PAEUVAalue}
                                        onChange={(e) =>
                                          setPAEUValue(e.target.value)
                                        }
                                      />
                                    </div>
                                  </td>
                                </tr>
                                <tr className="even:bg-gray-50">
                                  <th
                                    scope="row"
                                    className="px-6 py-4 text-center font-bold text-gray-500 border border-solid border-gray-300"
                                  >
                                    TBEU /BASE
                                  </th>
                                  <td className="p-0 text-center font-bold text-gray-500 border border-solid border-gray-300">
                                    <div className="h-full">
                                      <input
                                        type="text"
                                        className="w-full h-full border-none text-center focus:outline-none bg-gray-50"
                                        value={TBEUVAalue}
                                        onChange={(e) =>
                                          setTBEUValue(e.target.value)
                                        }
                                      />
                                    </div>
                                  </td>
                                </tr>
                                <tr className="even:bg-gray-50">
                                  <th
                                    scope="row"
                                    className="px-6 py-4 text-center font-bold text-gray-500 border border-solid border-gray-300"
                                  >
                                    TBEU / PMEU
                                  </th>
                                  <td className="p-0 text-center font-bold text-gray-500 border border-solid border-gray-300">
                                    <div className="h-full">
                                      <input
                                        type="text"
                                        className="w-full h-full border-none text-center focus:outline-none"
                                        value={TBEUPAEUVAalue}
                                        onChange={(e) =>
                                          setTBEUPAEUValue(e.target.value)
                                        }
                                      />
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
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

        {/* Caractéristiques du produit */}
        {product && page === "details" && (
          <div className="flex grid-rows-3 grid-flow-col gap-4 mt-5 mb-5 px-4">
            <div className="flex gap-[25px]">
              <div className="h-[400px] w-[400px] overflow-hidden flex items-center justify-center">
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
                    className="w-1/2 h-1/2 object-cover rounded-lg shadow-none"
                  />
                )}
              </div>
              <div className="flex-col col-span-2 justify-center">
                <div className="relative grid grid-cols-1 gap-4 mt-7 border border-gray-200 rounded-md px-4 py-7 shadow-md w-[700px]">
                  <span className="absolute top-[-20px] left-[10px] bg-white px-3 text-[20px] italic font-bold">
                    {product[0].GA_LIBELLE}
                  </span>
                  <div className="overflow-x-auto">
                    <table className="table-auto">
                      <tbody className="text-xs text-gray-700">
                        <tr>
                          <td className="py-2 font-bold">Conditionement :</td>
                          <td className="px-4 py-2"></td>
                        </tr>
                        <tr>
                          <td className="py-2 font-bold">
                            Origine de fabrication :
                          </td>
                          <td className="px-4 py-2"></td>
                        </tr>
                        <tr>
                          <td className="py-2 font-bold">
                            Catégorie douanière :
                          </td>
                          <td className="px-4 py-2"></td>
                        </tr>
                        <tr>
                          <td className="py-2 font-bold">Mesure :</td>
                          <td className="px-4 py-2">
                            <div className="flex items-center gap-3">
                              <span>PCE</span>
                              <span>-</span>
                              <span>Pièce</span>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2 font-bold">Vente :</td>
                          <td className="px-4 py-2">
                            <div className="flex items-center gap-3">
                              <span>UNI</span>
                              <span>-</span>
                              <span>Unité</span>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2 font-bold">Packaging :</td>
                          <td className="px-4 py-2">Standard</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Caractéristiques du produit */}
        {product && page === "unit" && (
          <div className="overflow-x-auto bg-white">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-[90%] mx-auto flex gap-4">
                <div className="flex flex-col gap-2"> 
                  <p className="text-sm font-bold text-gray-800">
                    Réference produit :
                  </p>
                  <input type="text" className="border focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-bold text-gray-800">Dimension :</p>
                  <select name="pets" className="w-[200px] border focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                    <option value="">--Toutes--</option>
                    <option value="color">Couleur</option>
                    <option value="size">Taille</option>
                  </select>
                </div>
              </div>
            </div>
            <table className="w-[90%] mx-auto border">
              <thead className="bg-gray-100 text-sm text-gray-600 border border-solid border-gray-300">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-2 text-center border border-solid border-gray-300 border-b"
                  >
                    Code
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-2 text-center border border-solid border-gray-300 border-b"
                  >
                    Dimensions
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-2 text-center border border-solid border-gray-300 border-b"
                  >
                    Code à barres
                  </th>
                </tr>
              </thead>
              <tbody className="text-center text-xs">
                {product[0]?.uvcs.map((item) => (
                  <tr
                    className="border text-gray-700 hover:bg-slate-200 cursor-pointer"
                    onClick={() => handleRowClick(item)}
                  >
                    <td className="py-2 px-2 border">{item.GA_CHARLIBRE1}</td>
                    <td className="py-2 px-2 flex items-center justify-center gap-1">
                      <span>{item.COULEUR}</span>
                      <span>,</span>
                      <span>{item.TAILLE}</span>
                    </td>
                    <td className="border">
                      <span>000000033254</span>
                    </td>
                  </tr>
                ))}

                {selectedRowData && (
                  <tr
                    className="border cursor-pointer bg-sky-800 text-white font-bold"
                    onClick={() => setSelectedRowData(null)}
                  >
                    <td className="py-2">{selectedRowData.GA_CHARLIBRE1}</td>
                    <td>
                      {selectedRowData.COULEUR}, {selectedRowData.TAILLE}
                    </td>
                    <td>000000033254</td>
                  </tr>
                )}
              </tbody>
            </table>
            {selectedRowData && (
              <div className="w-[90%] h-[70px] border mx-auto px-4 py-2">
                <div className="flex items-center gap-3">
                  <span className="font-bold">Couleur :</span>
                  <span>{selectedRowData.COULEUR}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold">Taille :</span>
                  <span>{selectedRowData.TAILLE}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </Card>
    </section>
  );
}
