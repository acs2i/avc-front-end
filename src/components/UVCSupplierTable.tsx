import React, { useState } from "react";
import { SuppliersOption } from "@/type";

interface Supplier {
  supplier_id: string;
  supplier_ref: string;
  pcb: string;
  custom_cat: string;
  made_in: string;
}

interface CommonData {
  reference: string;
  uvcDimension: { code: string; dimensions: string[] }[];
}

interface ProductProps extends CommonData {
  type: "product";
  data: {
    suppliers: Supplier[];
  };
}

interface DraftProps extends CommonData {
  type: "draft";
  data: {
    suppliers: Supplier[];
  };
}

interface CreateProps extends CommonData {
  type: "create";
  data: {
    suppliers: SuppliersOption[];
  };
}

type UVCSupplierTableProps = ProductProps | DraftProps | CreateProps;

const UVCSupplierTable: React.FC<UVCSupplierTableProps> = ({
  reference,
  uvcDimension,
  type,
  data
}) => {
  const [selectedSupplierIndex, setSelectedSupplierIndex] = useState(0);

  const suppliers = data.suppliers;
  const currentSupplier = suppliers[selectedSupplierIndex];

  if (!suppliers.length) {
    return <div>Aucun fournisseur disponible</div>;
  }

  const getSupplierName = (supplier: Supplier | SuppliersOption) => {
    if (type === "create") {
      const createSupplier = supplier as SuppliersOption;
      return createSupplier.company_name || createSupplier.label || "Non défini";
    } else {
      const productSupplier = supplier as Supplier;
      return productSupplier.supplier_id || "Non défini";
    }
  };

  const getSupplierRef = (supplier: Supplier | SuppliersOption) => {
    if (type === "create") {
      const createSupplier = supplier as SuppliersOption;
      return createSupplier.supplier_ref || "Non défini";
    } else {
      const productSupplier = supplier as Supplier;
      return productSupplier.supplier_ref || "Non défini";
    }
  };

  const getPCB = (supplier: Supplier | SuppliersOption) => {
    if (type === "create") {
      const createSupplier = supplier as SuppliersOption;
      return createSupplier.pcb || "Non défini";
    } else {
      const productSupplier = supplier as Supplier;
      return productSupplier.pcb || "Non défini";
    }
  };

  const getCustomCat = (supplier: Supplier | SuppliersOption) => {
    if (type === "create") {
      const createSupplier = supplier as SuppliersOption;
      return createSupplier.custom_cat || "Non défini";
    } else {
      const productSupplier = supplier as Supplier;
      return productSupplier.custom_cat || "Non défini";
    }
  };

  const getMadeIn = (supplier: Supplier | SuppliersOption) => {
    if (type === "create") {
      const createSupplier = supplier as SuppliersOption;
      return createSupplier.made_in || "Non défini";
    } else {
      const productSupplier = supplier as Supplier;
      return productSupplier.made_in || "Non défini";
    }
  };

  const handleSupplierChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSupplierIndex(Number(event.target.value));
  };

  return (
    <div className="w-full">
      <div className="mb-4 p-4 bg-gray-100 rounded-md">
        <h3 className="font-semibold mb-2">Sélection du fournisseur</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Fournisseur: </span>
          <select
            value={selectedSupplierIndex}
            onChange={handleSupplierChange}
            className="border rounded-md p-1 bg-white focus:outline-none focus:border-blue-500 w-[300px]"
          >
            {suppliers.map((supplier, index) => (
              <option key={index} value={index}>
                {getSupplierName(supplier)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50">
            <th className="border px-4 py-2 text-sm font-semibold text-gray-600">
              Code UVC
            </th>
            <th className="border px-4 py-2 text-sm font-semibold text-gray-600">
              Couleur
            </th>
            <th className="border px-4 py-2 text-sm font-semibold text-gray-600">
              Taille
            </th>
            <th className="border px-4 py-2 text-sm font-semibold text-gray-600">
              Fournisseur
            </th>
            <th className="border px-4 py-2 text-sm font-semibold text-gray-600">
              Référence fournisseur
            </th>
            <th className="border px-4 py-2 text-sm font-semibold text-gray-600">
              PCB
            </th>
            <th className="border px-4 py-2 text-sm font-semibold text-gray-600">
              Catégorie douanière
            </th>
            <th className="border px-4 py-2 text-sm font-semibold text-gray-600">
              Origine
            </th>
          </tr>
        </thead>
        <tbody>
          {uvcDimension.map((uvc, index) => {
            const [couleur, taille] = uvc.dimensions[0]?.split("/") || ["", ""];
            const uvcReference = `${reference}_${couleur}_${taille}`;

            return (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border px-4 py-2 text-center text-sm">
                  {uvcReference}
                </td>
                <td className="border px-4 py-2 text-center text-sm">
                  {couleur}
                </td>
                <td className="border px-4 py-2 text-center text-sm">
                  {taille}
                </td>
                <td className="border px-4 py-2 text-center text-sm">
                  {getSupplierName(currentSupplier)}
                </td>
                <td className="border px-4 py-2 text-center text-sm">
                  {getSupplierRef(currentSupplier)}
                </td>
                <td className="border px-4 py-2 text-center text-sm">
                  {getPCB(currentSupplier)}
                </td>
                <td className="border px-4 py-2 text-center text-sm">
                  {getCustomCat(currentSupplier)}
                </td>
                <td className="border px-4 py-2 text-center text-sm">
                  {getMadeIn(currentSupplier)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default UVCSupplierTable;