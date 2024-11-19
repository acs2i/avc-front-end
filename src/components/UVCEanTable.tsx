import React from "react";

interface UVCEanTableProps {
  reference: string;
  uvcDimension: { code: string; dimensions: string[]; ean: string; eans: string[] }[];
}

const UVCEanTable: React.FC<UVCEanTableProps> = ({ reference, uvcDimension }) => {
  return (
    <div className="w-full">
      {/* Conteneur d'informations globales */}
      <div className="mb-4 p-4 bg-gray-100 rounded-md">
        <h3 className="font-semibold mb-2">Informations EAN</h3>
        <p className="text-sm text-gray-600">
          Liste des UVC avec leurs codes EAN principaux et secondaires.
        </p>
      </div>

      {/* Table des EAN */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50">
            <th className="border px-4 py-2 text-sm font-semibold text-gray-600">Code UVC</th>
            <th className="border px-4 py-2 text-sm font-semibold text-gray-600">Couleur</th>
            <th className="border px-4 py-2 text-sm font-semibold text-gray-600">Taille</th>
            <th className="border px-4 py-2 text-sm font-semibold text-gray-600">EAN Principal</th>
            <th className="border px-4 py-2 text-sm font-semibold text-gray-600">EAN 2</th>
            <th className="border px-4 py-2 text-sm font-semibold text-gray-600">EAN 3</th>
            <th className="border px-4 py-2 text-sm font-semibold text-gray-600">EAN 4</th>
          </tr>
        </thead>
        <tbody>
          {uvcDimension.map((uvc, index) => {
            const [couleur, taille] = uvc.dimensions[0]?.split("/") || ["", ""];
            const uvcReference = `${reference}_${couleur}_${taille}`;

            return (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border px-4 py-2 text-center text-sm">{uvcReference}</td>
                <td className="border px-4 py-2 text-center text-sm">{couleur}</td>
                <td className="border px-4 py-2 text-center text-sm">{taille}</td>
                <td className="border px-4 py-2 text-center text-sm">{uvc.ean || "-"}</td>
                <td className="border px-4 py-2 text-center text-sm">{uvc.eans[0] || "-"}</td>
                <td className="border px-4 py-2 text-center text-sm">{uvc.eans[1] || "-"}</td>
                <td className="border px-4 py-2 text-center text-sm">{uvc.eans[2] || "-"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default UVCEanTable;
