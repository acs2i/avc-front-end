import React, { useState } from "react";

interface UVCPriceTableProps {
  uvcPrices: string[];
  productReference: string;
}

const UVCPriceTable: React.FC<UVCPriceTableProps> = ({ uvcPrices,  productReference }) => {
  const [prices, setPrices] = useState<{ [key: string]: { pa: number | string, pv: number | string, pm: number | string } }>(
    uvcPrices.reduce((acc, dimension) => {
      acc[dimension] = { pa: 0, pv: 0, pm: 0 };
      return acc;
    }, {} as { [key: string]: { pa: number | string, pv: number | string, pm: number | string } })
  );

  const handlePriceChange = (dimension: string, type: "pa" | "pv" | "pm", value: string) => {
    setPrices(prevPrices => ({
      ...prevPrices,
      [dimension]: {
        ...prevPrices[dimension],
        [type]: value,
      },
    }));
  };

  return (
    <table className="w-full border">
      <thead>
        <tr className="text-[13px] text-gray-400">
        <th className="border px-4 py-2 w-[50px]">Code UVC</th>
          <th className="border px-4 py-2 w-[50px]">Couleur</th>
          <th className="border px-4 py-2 w-[50px]">Taille</th>
          <th className="border px-4 py-2 w-[50px]">Prix Achat</th>
          <th className="border px-4 py-2 w-[50px]">Prix Vente</th>
          <th className="border px-4 py-2 w-[50px]">Prix Modulé</th>
        </tr>
      </thead>
      <tbody>
        {uvcPrices.map((dimension, index) => {
          const [couleur, taille] = dimension.split(',');
          const priceData = prices[dimension] || { pa: 0, pv: 0, pm: 0 };
          const codeUVC = `${productReference}${couleur}${taille}`;
          return (
            <tr key={index} className="text-[11px]">
              <td className="border px-4 py-1 text-center">{codeUVC}</td>
              <td className="border px-4 py-1 text-center">{couleur}</td>
              <td className="border px-4 py-1 text-center">{taille}</td>
              <td className="border px-4 py-1 text-center">
                <input
                  type="text"
                  value={priceData.pa}
                  onChange={(e) => handlePriceChange(dimension, "pa", e.target.value)}
                  className="w-1/2 text-center border-[2px] focus:outline-none focus:border-blue-200 rounded-md"
                />
              </td>
              <td className="border px-4 py-1 text-center">
                <input
                  type="text"
                  value={priceData.pv}
                  onChange={(e) => handlePriceChange(dimension, "pv", e.target.value)}
                  className="w-1/2 text-center border-[2px] focus:outline-none focus:border-blue-200 rounded-md"
                />
              </td>
              <td className="border px-4 py-1 text-center">
                <input
                  type="text"
                  value={priceData.pm}
                  onChange={(e) => handlePriceChange(dimension, "pm", e.target.value)}
                  className="w-1/2 text-center border-[2px] focus:outline-none focus:border-blue-200 rounded-md"
                />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default UVCPriceTable;
