import React from "react";

interface UVCSupplierTableProps {
  reference: string;
  uvcDimension: { code: string; dimensions: string[] }[];
  supplierLabel: any;
}

const UVCSupplierTable: React.FC<UVCSupplierTableProps> = ({
  reference,
  uvcDimension,
  supplierLabel
}) => {
  return (
    <table className="w-full border">
      <thead>
        <tr className="text-[13px] text-gray-400">
          <th className="border px-4 py-2 w-[50px]">Code UVC</th>
          <th className="border px-4 py-2 w-[50px]">Couleur</th>
          <th className="border px-4 py-2 w-[50px]">Taille</th>
          <th className="border px-4 py-2 w-[50px]">Fournisseur</th>
        </tr>
      </thead>
      <tbody>
        {uvcDimension.map((uvc, index) => {
          // Extraire la couleur et la taille à partir de dimensions
          const [couleur, taille] = uvc.dimensions[0].split("/");
          const uvcReference = `${reference}_${couleur}_${taille}`;

          return (
            <tr key={index} className="text-[11px]">
              <td className="border px-4 py-1 text-center">{uvcReference}</td>
              <td className="border px-4 py-1 text-center">{couleur}</td>
              <td className="border px-4 py-1 text-center">{taille}</td>
              <td className="border px-4 py-1 text-center">{supplierLabel}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default UVCSupplierTable;
