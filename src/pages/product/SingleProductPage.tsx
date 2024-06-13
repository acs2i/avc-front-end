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
import Header from "../../components/Navigation/Header";

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

  return (
    <section className="w-full bg-gray-100 h-screen p-8 flex flex-col gap-2">
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-lg h-[400px] flex flex-col shadow-md">
          <div className="relative h-[80px] bg-green-600 rounded-t-lg">
            {product && (
              <div className="absolute bottom-[-50px] left-[50%] translate-x-[-50%] rounded-lg h-[100px] w-[100px] overflow-hidden">
                <img
                  src={
                    product[0]?.imgPath ? product[0]?.imgPath : "/img/logo.png"
                  }
                  alt="img"
                  className="w-full h-auto rounded-lg transition-all duration-[20s] transform scale-100 hover:scale-150 shadow-none hover:shadow-lg"
                />
              </div>
            )}
          </div>
          <div className="mt-[50px] w-full flex-grow">
            {product && (
              <div className="flex flex-col items-center gap-2">
                <div className="w-full border-b-[1px] text-center">
                  <h3 className="text-[20px] font-[800] text-gray-800">
                    {product[0]?.GA_LIBELLE}
                  </h3>
                </div>
                <div className="flex flex-col justify-center items-center gap-1 py-4">
                  <div className="flex items-center text-[13px] font-[600] gap-2">
                    <span>Référence :</span>
                    <span>{product[0]?.GA_CODEARTICLE}</span>
                  </div>

                  <div className="flex items-center text-[13px] font-[600] gap-2">
                    <span>Désignation longue :</span>
                    <span>{product[0]?.GA_LIBELLE}</span>
                  </div>

                  <div className="flex items-center text-[13px] font-[600] gap-2">
                    <span>Désignation courte :</span>
                    <span>{product[0]?.GA_LIBCOMPL}</span>
                  </div>

                  <div className="flex items-center text-[13px] font-[600] gap-2">
                    <span>Type :</span>
                    <span>Marchandise</span>
                  </div>

                  <div className="flex items-center text-[13px] font-[600] gap-2">
                    <span>Fournisseur principal :</span>
                    <span>{product[0]?.GA_FOURNPRINC}</span>
                  </div>

                  <div className="flex items-center text-[13px] font-[600] gap-2">
                    <span>Dimensions :</span>
                    <span>Couleur/Taille</span>
                  </div>

                  <div className="flex items-center text-[13px] font-[600] gap-2">
                    <span>Marque :</span>
                    <span>{product[0]?.brand.YX_LIBELLE}</span>
                  </div>

                  <div className="flex items-center text-[13px] font-[600] gap-2">
                    <span>Collection :</span>
                    <span>N/A</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="bg-white rounded-lg h-[195px] flex flex-col shadow-md">
            <div className="w-full">
              {product && (
                <div>
                  <div className="w-full p-4">
                    <h4 className="text-[18px] font-[800] text-gray-800">
                      Classes
                    </h4>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="flex flex-col items-center text-[10px] font-[600] gap-1">
                      <span className="h-[50px] w-[50px] bg-pink-600 flex items-center justify-center text-white rounded-full">
                        Famille
                      </span>
                      <span>{product[0]?.family.YX_LIBELLE}</span>
                    </div>
                    <div className="flex flex-col items-center text-[10px] font-[600] gap-1">
                      <span className="h-[50px] w-[50px] bg-orange-400 flex items-center justify-center text-white text-center rounded-full">
                        Sous-famille
                      </span>
                      <span>{product[0]?.subFamily.YX_LIBELLE}</span>
                    </div>
                    <div className="flex flex-col items-center text-[10px] font-[600] gap-1">
                      <span className="h-[50px] w-[50px] bg-purple-900 flex items-center justify-center text-white text-center rounded-full">
                        Sous-sous-famille
                      </span>
                      <span>N/A</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg h-[195px] flex flex-col shadow-md">
            <div className="w-full">
              {product && (
                <div>
                  <div className="w-full p-4">
                    <h4 className="text-[18px] font-[800] text-gray-800">
                      Caractéristiques du produit
                    </h4>
                  </div>
                  <div className="flex flex-col gap-1 w-[90%] mx-auto">
                    <div className="flex text-[13px] font-[600] gap-2">
                      <span>Conditionement :</span>
                      <span></span>
                    </div>
                    <div className="flex text-[13px] font-[600] gap-2">
                      <span>Origine de fabrication :</span>
                      <span></span>
                    </div>
                    <div className="flex text-[13px] font-[600] gap-2">
                      <span>Mesure :</span>
                      <span>PCE - Pièce</span>
                    </div>
                    <div className="flex text-[13px] font-[600] gap-2">
                      <span>Vente :</span>
                      <span>UNI - Unité</span>
                    </div>
                    <div className="flex text-[13px] font-[600] gap-2">
                      <span>Packaging :</span>
                      <span>Standard</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg h-[400px] flex flex-col shadow-md">
          <div className="w-full">
            {product && (
              <div>
                <div className="w-full p-4">
                  <h4 className="text-[18px] font-[800] text-gray-800">
                    Prix d'achat /vente
                  </h4>
                </div>
                <div className="overflow-x-auto flex justify-center">
                  <table className="table-auto">
                    <tbody className="capitalize text-xs text-gray-700">
                      <tr>
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
            )}
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg px-4 py-7 shadow-md w-full">
        <h4 className="text-[17px] font-[800] text-sky-600">
          Unité de vente consomateur
        </h4>
        <div className="overflow-x-auto mt-4">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-[90%] mx-auto flex gap-7">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-bold text-gray-800">
                  Réference produit :
                </p>
                <p className="text-sm text-blue-500">
                  {product && product[0]?.GA_CODEARTICLE}
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-bold text-gray-800">Dimension :</p>
                <select
                  name="pets"
                  className="w-[200px] border focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
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
              {product && product[0]?.uvcs.map((item) => (
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
                  <td className="py-4">{selectedRowData.GA_CHARLIBRE1}</td>
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
      </div>
      {/* Paramètres généraux */}
      {/* {product && page === "general" && (
        <div className="mt-[12px] flex flex-col gap-3">
          <div className="flex gap-3">
           
          </div>
          
        </div>
      )} */}
    </section>
  );
}
