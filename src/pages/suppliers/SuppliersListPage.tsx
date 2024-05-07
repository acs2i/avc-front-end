import Card from "../../components/Shared/Card";
import { SUPPLIERS } from "../../utils/index";
import React from "react";

export default function SuppliersListPage() {
  return (
    <div className="flex flex-col gap-7 mt-7">
      <Card title="La liste des fournisseurs">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-blue-50 text-md text-gray-500">
              <tr>
                <th scope="col" className="px-6 py-4">
                  Code
                </th>
                <th scope="col" className="px-6 py-4">
                  Nom
                </th>
                <th scope="col" className="px-6 py-4">
                  @
                </th>
              </tr>
            </thead>
            <tbody>
              {SUPPLIERS.map((supplier, i) => (
                <>
                  <tr className="bg-white cursor-pointer hover:bg-slate-200 capitalize text-sm text-gray-400 even:bg-slate-50 whitespace-nowrap font-bold border">
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
