import Card from "../../components/Card";
import { SUPPLIERS } from "../../utils/index";
import React from "react";

export default function SuppliersListPage() {
  return (
    <div>
        
      <Card title="Rechercher un fournisseur">
        <div className="flex flex-col">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="w-[70%] mx-auto">
              <div className="flex flex-col gap-3 mb-5">
                <label className="text-sm font-medium text-gray-900 whitespace-nowrap">
                  Nom du fournisseur :
                </label>
                <input
                  type="text"
                  placeholder="Entrez le nom du fournsseur"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-green-500 focus:outline-none p-2.5"
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card title="Résultats">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-sky-50">
              <tr>
                <th scope="col" className="px-6 py-4">
                  CODE
                </th>
                <th scope="col" className="px-6 py-4">
                  NOM
                </th>
                <th scope="col" className="px-6 py-4">
                  @
                </th>
              </tr>
            </thead>
            <tbody>
              {SUPPLIERS.map((supplier, i) => (
                <>
                  <tr className="bg-white border-b cursor-pointer hover:bg-slate-100">
                    <td className="px-6 py-4">{supplier.code}</td>
                    <td className="px-6 py-4">{supplier.name}</td>
                    <td className="px-6 py-4">{supplier.arobase}</td>
                  </tr>
                </>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

    </div>
  );
}
