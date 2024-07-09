import React, { useState } from "react";

interface UVCInfosTableProps {
  uvcPrices: string[];
  productReference: string;
  productBrand: string;
}

const UVCInfosTable: React.FC<UVCInfosTableProps> = ({
  uvcPrices,
  productReference,
  productBrand
}) => {
  const [collections, setCollections] = useState<{ [key: string]: string }>(
    uvcPrices.reduce((acc, dimension) => {
      acc[dimension] = "";
      return acc;
    }, {} as { [key: string]: string })
  );

  const handleCollectionChange = (dimension: string, value: string) => {
    setCollections((prevCollections) => ({
      ...prevCollections,
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
          <th className="border px-4 py-2 w-[50px]">Collection</th>
        </tr>
      </thead>
      <tbody>
        {uvcPrices.map((dimension, index) => {
          const [couleur, taille] = dimension.split(",");
          const codeUVC = `${productReference}${couleur}${taille}`;
          return (
            <tr key={index} className="text-[11px]">
              <td className="border px-4 py-1 text-center">{codeUVC}</td>
              <td className="border px-4 py-1 text-center">{couleur}</td>
              <td className="border px-4 py-1 text-center">{taille}</td>
              <td className="border px-4 py-1 text-center">{productBrand}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default UVCInfosTable;
