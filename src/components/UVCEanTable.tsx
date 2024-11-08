import React from "react";

interface UVCEanTableProps {
  reference: string;
  uvcDimension: { code: string; dimensions: string[]; ean: string; eans: string[] }[];
}

const UVCEanTable: React.FC<UVCEanTableProps> = ({
  reference,
  uvcDimension,
}) => {
  return (
    <table className="w-full border">
      <thead>
        <tr className="text-[13px] text-gray-400">
          <th className="border px-4 py-2 w-[50px]">Code UVC</th>
          <th className="border px-4 py-2 w-[50px]">Couleur</th>
          <th className="border px-4 py-2 w-[50px]">Taille</th>
          <th className="border px-4 py-2 w-[50px]">EAN Principal</th>
          <th className="border px-4 py-2 w-[50px]">EAN 2</th>
          <th className="border px-4 py-2 w-[50px]">EAN 3</th>
          <th className="border px-4 py-2 w-[50px]">EAN 4</th>
        </tr>
      </thead>
      <tbody>
        {uvcDimension.map((uvc, index) => {
          // Extraire la couleur et la taille à partir de dimensions
          const [couleur, taille] = uvc.dimensions[0].split("/");
          const uvcReference = `${reference}${couleur}${taille}`;

          return (
            <tr key={index} className="text-[11px]">
              <td className="border px-4 py-1 text-center">{uvcReference}</td>
              <td className="border px-4 py-1 text-center">{couleur}</td>
              <td className="border px-4 py-1 text-center">{taille}</td>
              <td className="border px-4 py-1 text-center">{uvc.ean || "-"}</td>
              <td className="border px-4 py-1 text-center">{uvc.eans[0] || "-"}</td>
              <td className="border px-4 py-1 text-center">{uvc.eans[1] || "-"}</td>
              <td className="border px-4 py-1 text-center">{uvc.eans[2] || "-"}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default UVCEanTable;
