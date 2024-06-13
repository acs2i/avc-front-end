import React, { useEffect, useState } from "react";
import { LINKCARD_DRAFT, PRODUCTS } from "../../utils/index";
import { useSelector } from "react-redux";
import { format } from "date-fns";

interface Draft {
  creator_id: any;
  description_ref: string;
  reference: string;
  designation_longue: string;
  designation_courte: string;
  supplier_name: string;
  supplier_ref: string;
  family: string[];
  subFamily: string[];
  dimension_type: string;
  dimension: string[];
  brand: string;
  ref_collection: string;
  composition: string;
  description_brouillon: string;
  status: number;
  createdAt: any;
}

export default function DraftPage() {
  const userId = useSelector((state: any) => state.auth.user._id);
  const [page, setPage] = useState("draft");
  const [drafts, setDrafts] = useState<Draft[]>([]);

  const formatDate = (timestamp: any) => {
    return format(new Date(timestamp), "dd/MM/yyyy HH:mm:ss");
  };

  useEffect(() => {
    fetchDraft();
  }, []);

  const fetchDraft = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/draft/user/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      setDrafts(data);
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    } finally {
    }
  };

  return (
    <section>
      <div className="w-full h-[300px] bg-gray-100 p-8 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${"/img/background_forest.jpg"})`,
            opacity: 0.3,
            filter: "grayscale(100%)",
          }}
        ></div>
        <div className="relative z-10">
          <h3 className="text-[35px] font-[800] text-gray-800">
            Produits créés
          </h3>
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
      </div>

      <table className="w-full text-left">
        <thead className="border-y-[1px] border-gray-200 text-sm font-[800] text-gray-700">
          <tr>
            <th scope="col" className="px-6 py-2 w-[5%]">
              Reférence
            </th>
            <th scope="col" className="px-6 py-2 w-1/6">
              Libellé
            </th>
            <th scope="col" className="px-6 py-2 w-[10%]">
              Marque
            </th>
            <th scope="col" className="px-6 py-2 w-[10%]">
              Founisseur
            </th>
            <th scope="col" className="px-6 py-2 w-1/6">
              Famille
            </th>
            <th scope="col" className="px-6 py-2 w-1/6">
              Sous-famille
            </th>
            <th scope="col" className="px-6 py-2 w-[10%]">
              Date de création
            </th>
          </tr>
        </thead>
        {page === "draft" && (
          <tbody>
            {drafts
              .filter((draft) => draft.status === 0)
              .map((product, i) => (
                <tr
                  key={i}
                  className="bg-white cursor-pointer hover:bg-slate-200 capitalize text-[12px] text-gray-800 even:bg-slate-50 whitespace-nowrap border"
                >
                  <td className="px-6 py-4 text-blue-500">
                    {product.reference}
                  </td>
                  <td className="px-6 py-4">{product.designation_longue}</td>
                  <td className="px-6 py-4">{product.brand}</td>
                  <td className="px-6 py-4">{product.supplier_name}</td>
                  <td className="px-6 py-4">{product.family}</td>
                  <td className="px-6 py-4">{product.subFamily}</td>
                  <td className="px-6 py-4 text-blue-600">
                    {formatDate(product.createdAt)}
                  </td>
                </tr>
              ))}
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
