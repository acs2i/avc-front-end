import Card from "../../components/Shared/Card";
import { SUPPLIERS } from "../../utils/index";
import React from "react";

export default function SuppliersListPage() {
  return (
    <div className="flex flex-col gap-7 mt-7">

      <Card title="La liste des fournisseurs">
        <div className="overflow-x-auto">
        <table className="w-full text-left">
              <thead className="uppercase bg-blue-50">
                <tr>
                  <th scope="col" className="px-6 py-6">
                    CODE
                  </th>
                  <th scope="col" className="px-6 py-6">
                    NOM
                  </th>
                  <th scope="col" className="px-6 py-6">
                    @
                  </th>
                </tr>
              </thead>
              <tbody>
                {SUPPLIERS.map((supplier, i) => (
                    <>
                      <tr className="bg-white border-b cursor-pointer hover:bg-slate-100 capitalize font-bold text-sm text-gray-500">
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
