import React from "react";

interface UVCInfosTableProps {
  uvcDimension: { code: string; dimensions: string[] }[];  // Mise à jour du type
  brandLabel: string;
}

const UVCInfosTable: React.FC<UVCInfosTableProps> = ({
  uvcDimension,
  brandLabel
}) => {
  return (
    <table className="w-full border">
      <thead>
        <tr className="text-[13px] text-gray-400">
          <th className="border px-4 py-2 w-[50px]">Code UVC</th>
          <th className="border px-4 py-2 w-[50px]">Couleur</th>
          <th className="border px-4 py-2 w-[50px]">Taille</th>
          <th className="border px-4 py-2 w-[50px]">Marque</th>
        </tr>
      </thead>
      <tbody>
        {uvcDimension.map((uvc, index) => {
          // Extraire la couleur et la taille à partir de dimensions
          const [couleur, taille] = uvc.dimensions[0].split("/");

          return (
            <tr key={index} className="text-[11px]">
              <td className="border px-4 py-1 text-center">{uvc.code}</td>
              <td className="border px-4 py-1 text-center">{couleur}</td>
              <td className="border px-4 py-1 text-center">{taille}</td>
              <td className="border px-4 py-1 text-center">{brandLabel}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default UVCInfosTable;
