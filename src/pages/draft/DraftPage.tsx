import React, { useEffect, useState } from "react";
import Card from "../../components/Shared/Card";
import { LINKCARD_DRAFT, PRODUCTS } from "../../utils/index";
import { Divider } from "@mui/material";


interface Draft {
  creator_id: string;
  description_ref: string;
  reference: string;
  designation_longue: string;
  designation_courte: string;
  marque: string;
  collection: string;
  description_brouillon: string;
}


export default function DraftPage() {
  const [page, setPage] = useState("draft");

  // useEffect(() => {
  //   fetchDraft();
  // }, []);

  // const fetchDraft = async () => {
  //   try {
  //     const response = await fetch(
  //       `${process.env.REACT_APP_URL_DEV}/api/v1/auth/all-users`,
  //       {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     const data = await response.json();
  //     setUsers(data);
  //   } catch (error) {
  //     console.error("Erreur lors de la requête", error);
  //   } finally {
    
  //   }
  // };

  return (
    <section>
      <div className="w-full h-[300px] bg-gray-100 p-8">
        <h3 className="text-[35px] font-[800] text-gray-800">Produits créés</h3>
        <div className="mt-4 mb-[30px]">
          <div className="flex justify-between">
            <div className="flex items-center gap-7">
              {LINKCARD_DRAFT.map((link, i) => (
                <React.Fragment key={i}>
                  <button
                    className={`text-blue-600 text-sm font-[600] ${
                      page === link.page ? "text-blue-900" : ""
                    }`}
                    onClick={() => setPage(link.page)}
                  >
                    {link.name}
                  </button>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>

      <table className="w-full text-left">
        <thead className="border-y-[1px] border-gray-200 text-md font-[800] text-gray-700">
          <tr>
            <th scope="col" className="px-6 py-2 w-[5%]">
              Reférence
            </th>
            <th scope="col" className="px-6 py-2 w-1/6">
              Libellé
            </th>
            <th scope="col" className="px-6 py-2 w-1/6">
              Marque
            </th>
            <th scope="col" className="px-6 py-2 w-1/6">
              Founisseur
            </th>
            <th scope="col" className="px-6 py-2 w-1/6">
              Famille
            </th>
            <th scope="col" className="px-6 py-2 w-1/6">
              Sous-famille
            </th>
            <th scope="col" className="px-6 py-2 w-1/6">
              Créateur
            </th>
            <th scope="col" className="px-6 py-2 w-1/6">
              Status
            </th>
          </tr>
        </thead>
        {page === "draft" && (
          <tbody>
            {PRODUCTS.filter((product) => product.status === 0).map(
              (product, i) => (
                <tr
                  key={i}
                  className="bg-white cursor-pointer hover:bg-slate-200 capitalize text-xs text-gray-800 even:bg-slate-50 whitespace-nowrap border"
                >
                  <td className="px-6 py-4 text-blue-500">{product.code}</td>
                  <td className="px-6 py-4">{product.name}</td>
                  <td className="px-6 py-4">{product.brand}</td>
                  <td className="px-6 py-4">{product.supplier}</td>
                  <td className="px-6 py-4">{product.family}</td>
                  <td className="px-6 py-4">{product.subFamily}</td>
                  <td className="px-6 py-4">{product.creatorName}</td>
                  <td className="px-6 py-4">
                    <span className="bg-yellow-500 p-2 text-white rounded-md">
                      Brouillon
                    </span>
                  </td>
                </tr>
              )
            )}
          </tbody>
        )}
        {page === "in progress" && (
          <tbody>
            {PRODUCTS.filter((product) => product.status === 1).map(
              (product, i) => (
                <tr
                  key={i}
                  className="bg-white cursor-pointer hover:bg-slate-200 capitalize text-xs text-gray-800 even:bg-slate-50 whitespace-nowrap border"
                >
                  <td className="px-6 py-4">{product.code}</td>
                  <td className="px-6 py-4">{product.name}</td>
                  <td className="px-6 py-4">{product.brand}</td>
                  <td className="px-6 py-4">{product.supplier}</td>
                  <td className="px-6 py-4">{product.family}</td>
                  <td className="px-6 py-4">{product.subFamily}</td>
                  <td className="px-6 py-4">{product.creatorName}</td>
                  <td className="px-6 py-4">
                    <span className="bg-orange-500 p-2 text-white rounded-md">
                      En cours de validation...
                    </span>
                  </td>
                </tr>
              )
            )}
          </tbody>
        )}
        {page === "done" && (
          <tbody>
            {PRODUCTS.filter((product) => product.status === 2).map(
              (product, i) => (
                <tr
                  key={i}
                  className="bg-white cursor-pointer hover:bg-slate-200 capitalize text-xs text-gray-800 even:bg-slate-50 whitespace-nowrap border"
                >
                  <td className="px-6 py-4">{product.code}</td>
                  <td className="px-6 py-4">{product.name}</td>
                  <td className="px-6 py-4">{product.brand}</td>
                  <td className="px-6 py-4">{product.supplier}</td>
                  <td className="px-6 py-4">{product.family}</td>
                  <td className="px-6 py-4">{product.subFamily}</td>
                  <td className="px-6 py-4">{product.creatorName}</td>
                  <td className="px-6 py-4">
                    <span className="bg-green-500 p-2 text-white rounded-md">
                      Validé
                    </span>
                  </td>
                </tr>
              )
            )}
          </tbody>
        )}
      </table>
    </section>
  );
}
