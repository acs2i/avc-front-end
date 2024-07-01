import { LINKCARD_PRODUCT } from "../../utils/index";
import Card from "../../components/Shared/Card";
import React, { useState } from "react";
import Input from "../../components/FormElements/Input";
import { Navigate, useParams } from "react-router-dom";
import { LinkCard } from "@/type";
import { Divider } from "@mui/material";
import Button from "../../components/FormElements/Button";
import useFetch from "../../utils/hooks/usefetch";
import { Check, ChevronLeft, ImageUp, X } from "lucide-react";
import Modal from "../../components/Shared/Modal";
import Header from "../../components/Navigation/Header";
import { useNavigate } from "react-router-dom";
import CreatableSelect from "react-select/creatable";

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
  const [selectedRowData, setSelectedRowData] = useState<Row | null>(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: product } = useFetch<Product[]>(
    `${process.env.REACT_APP_URL_DEV}/api/v1/product/${id}`
  );

  const handleRowClick = (item: any) => {
    setSelectedRowData(item);
  };

  return (
    <section className="w-full bg-gray-100 h-screen p-8">
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-2">
          <div onClick={() => navigate(-1)} className="cursor-pointer">
            <ChevronLeft />
          </div>
          <h1 className="text-[32px] font-[800]">Page produit</h1>
        </div>
        {product && <h2 className="text-[25px]">{product[0]?.GA_LIBELLE}</h2>}
      </div>

      <div className="mt-7">
        {product && (
          <div className="flex gap-7 mt-[50px]">
            <div className="w-[70%] flex flex-col gap-3">
              <div className="relative border p-3 ">
                <div className="absolute top-[-15px] bg-gray-100 px-2">
                  <span className="text-[17px] italic">Identification</span>
                </div>
                <div className="grid grid-cols-4 gap-2 py-2">
                  <span className="col-span-1 font-bold text-gray-700">
                    Référence :
                  </span>
                  <span className="col-span-3 text-gray-600">
                    {product[0]?.GA_CODEARTICLE}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2 py-2">
                  <span className="col-span-1 font-bold text-gray-700">
                    Nom d'appel :
                  </span>
                  <span className="col-span-3 text-gray-600 whitespace-nowrap">
                    N/A
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2 py-2">
                  <span className="col-span-1 font-bold text-gray-700">
                    Désignation longue :
                  </span>
                  <span className="col-span-3 text-gray-600 whitespace-nowrap">
                    {product[0]?.GA_LIBELLE}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 py-2">
                  <span className="col-span-1 font-bold text-gray-700">
                    Désignation courte :
                  </span>
                  <span className="col-span-3 text-gray-600 whitespace-nowrap">
                    {product[0]?.GA_LIBCOMPL}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <span className="col-span-1 font-bold text-gray-700">
                    Marque :
                  </span>
                  <span className="col-span-3 text-gray-600">
                    {product[0]?.brand ? product[0]?.brand.YX_LIBELLE : "N/A"}
                  </span>
                </div>

                <div className="mt-[30px] grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="col-span-full">
                    <h5 className="text-[20px] font-[700]">Classification</h5>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    <span className="col-span-1 font-bold text-gray-700">
                      Famille :
                    </span>
                    <span className="col-span-3 text-gray-600 whitespace-nowrap">
                      {product[0]?.family
                        ? product[0]?.family.YX_LIBELLE
                        : "N/A"}
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    <span className="col-span-1 font-bold text-gray-700">
                      Sous-famille :
                    </span>
                    <span className="col-span-3 text-gray-600 whitespace-nowrap">
                      {product[0]?.subFamily
                        ? product[0]?.subFamily.YX_LIBELLE
                        : "N/A"}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <span className="col-span-1 font-bold text-gray-700">
                      Sous-sous-famille :
                    </span>
                    <span className="col-span-3 text-gray-600">N/A</span>
                  </div>
                </div>

                <div className="mt-[30px]">
                  <h5 className="text-[20px] font-[700] mb-4">
                    Caractéristiques produit
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid grid-cols-4 gap-2">
                      <span className="col-span-1 font-bold text-gray-700">
                        Type :
                      </span>
                      <span className="col-span-3 text-gray-600">
                        Marchandise
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      <span className="col-span-1 font-bold text-gray-700">
                        Dimensions :
                      </span>
                      <span className="col-span-3 text-gray-600">
                        Couleur/Taille
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      <span className="col-span-1 font-bold text-gray-700">
                        Collection :
                      </span>
                      <span className="col-span-3 text-gray-600">N/A</span>
                    </div>
                    
                  </div>
                </div>
              </div>
            </div>

            <div className="w-[30%] flex flex-col gap-5">
              <Card title=" Ajouter une image">
                <div className="w-full h-[250px] border border-dashed border-2 border-gray-300 mt-3 flex justify-center items-center">
                  <div className="flex flex-col items-center text-center">
                    <p className="font-bold text-gray-600">
                      Glissez déposez votre image ici ou{" "}
                      <span className="text-blue-400">
                        téléchargez depuis votre ordinateur
                      </span>
                    </p>
                    <div className="text-gray-300">
                      <ImageUp size={50} />
                    </div>
                  </div>
                </div>
              </Card>
              <Card title="Fournisseur principal">
                <div className="flex flex-col gap-2">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Nom
                    </label>
                    <Input
                      element="input"
                      id="reference"
                      label="Référence :"
                      value=""
                      validators={[]}
                      placeholder="Ajouter la référence du produit"
                      create
                      gray
                    />
                  </div>
                  <div>
                    <Input
                      element="input"
                      id="reference"
                      label="Référence :"
                      value=""
                      validators={[]}
                      placeholder="Ajouter la référence du produit"
                      create
                      gray
                    />
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg px-4 py-7 shadow-md w-full mt-7">
        <h4 className="text-[18px] font-[800] text-gray-800">
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
              {product &&
                product[0]?.uvcs.map((item) => (
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
    </section>
  );
}
