import React, {useState} from "react";
import Card from "../../components/Shared/Card";
import { LINKCARD_DRAFT, PRODUCTS } from "../../utils/index";
import { Divider } from "@mui/material";

export default function DraftPage() {
  const [page, setPage] = useState("draft");
  return (
    <div>
      <Card title="Produits crées" createTitle="" link="">
        <div className="mt-4 mb-[30px] px-4">
          <div className="flex justify-between">
            <div className="flex items-center gap-7">
              {LINKCARD_DRAFT.map((link, i) => (
                <React.Fragment key={i}>
                  <button
                    className={`text-gray-600 text-sm ${
                      page === link.page ? "text-green-700 font-bold" : ""
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
          <div className="mt-6">
            <Divider />
          </div>
        </div>
        <table className="w-full text-left">
          <thead className="bg-gray-200 text-sm text-gray-500">
            <tr>
              <th scope="col" className="px-6 py-4 w-1/6">
                Code
              </th>
              <th scope="col" className="px-6 py-4 w-1/6">
                Libellé
              </th>
              <th scope="col" className="px-6 py-4 w-1/6">
                Marque
              </th>
              <th scope="col" className="px-6 py-4 w-1/6">
                Founisseur
              </th>
              <th scope="col" className="px-6 py-4 w-1/6">
                Famille
              </th>
              <th scope="col" className="px-6 py-4 w-1/6">
                Sous-famille
              </th>
              <th scope="col" className="px-6 py-4 w-1/6">
                Créateur
              </th>
              <th scope="col" className="px-6 py-4 w-1/6">
                Status
              </th>
            </tr>
          </thead>
          {page === "draft" && <tbody>
            {PRODUCTS.filter(product => product.status === 0).map((product, i) => (
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
                  <span className="bg-yellow-500 p-2 text-white rounded-md">Brouillon</span>
                </td>
              </tr>
            ))}
          </tbody>}
          {page === "in progress" && <tbody>
            {PRODUCTS.filter(product => product.status === 1).map((product, i) => (
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
                  <span className="bg-orange-500 p-2 text-white rounded-md">En cours de validation...</span>
                </td>
              </tr>
            ))}
          </tbody>}
          {page === "done" && <tbody>
            {PRODUCTS.filter(product => product.status === 2).map((product, i) => (
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
                  <span className="bg-green-500 p-2 text-white rounded-md">Validé</span>
                </td>
              </tr>
            ))}
          </tbody>}
        </table>
      </Card>
    </div>
  );
}
