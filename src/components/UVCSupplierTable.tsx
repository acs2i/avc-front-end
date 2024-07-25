import React, { useState } from "react";

interface UVCInfosTableProps {
  uvcDimensions: string[];
  productReference: string;
  productSupplier: {
    _id: string;
    code: string;
    company_name: string;
  };
}

const UVCSupplierTable: React.FC<UVCInfosTableProps> = ({
  uvcDimensions,
  productReference,
  productSupplier,
}) => {
  const [collections, setCollections] = useState<{ [key: string]: string }>(
    uvcDimensions.reduce((acc, dimension) => {
      acc[dimension] = "";
      return acc;
    }, {} as { [key: string]: string })
  );

  const handleSupplierChange = (dimension: string, value: string) => {
    setCollections((prevSupplier) => ({
      ...prevSupplier,
      [dimension]: value,
    }));
  };

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
        {uvcDimensions.map((dimension, index) => {
          const [couleur, taille] = dimension.split(",");
          const codeUVC = `${productReference}${couleur}${taille}`;
          return (
            <tr key={index} className="text-[11px]">
              <td className="border px-4 py-1 text-center">{codeUVC}</td>
              <td className="border px-4 py-1 text-center">{couleur}</td>
              <td className="border px-4 py-1 text-center">{taille}</td>
              <td className="border px-4 py-1 text-center">
                <div>
                  <span>{productSupplier.code}</span>
                  <span className="mx-1">-</span>
                  <span>{productSupplier.company_name}</span>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default UVCSupplierTable;
