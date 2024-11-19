import React from "react";

interface UVCSupplierTableProps {
  reference: string;
  uvcDimension: { code: string; dimensions: string[] }[];
  supplierLabel: any;
}

const UVCSupplierTable: React.FC<UVCSupplierTableProps> = ({
  reference,
  uvcDimension,
  supplierLabel,
}) => {
  return (
    <div className="w-full">
      {/* Conteneur d'informations générales */}
      <div className="mb-4 p-4 bg-gray-100 rounded-md">
        <h3 className="font-semibold mb-2">Fournisseur principal</h3>
        <div>
          <span className="text-sm text-gray-600">Fournisseur: </span>
          <span className="font-medium">{supplierLabel || "Non défini"}</span>
        </div>
      </div>

      {/* Table des dimensions */}
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
          </tr>
        </thead>
        <tbody>
          {uvcDimension.map((uvc, index) => {
            // Extraire couleur et taille
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
                  {supplierLabel}
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
