import React from "react";

interface UVCPriceTableProps {
  reference: string;
  uvcPrices: {
    code: string;
    dimensions: string[];
    prices: {
      paeu: number;
      tbeu_pb: number;
      tbeu_pmeu: number;
    };
  }[];
  globalPrices: {
    paeu: number;
    tbeu_pb: number;
    tbeu_pmeu: number;
  };
  isModify: boolean;
  onPriceChange: (index: number, field: "paeu" | "tbeu_pb" | "tbeu_pmeu", value: number) => void;
}

const UVCPriceTable: React.FC<UVCPriceTableProps> = ({
  reference,
  uvcPrices,
  isModify,
  onPriceChange,
}) => {
  return (
    <table className="w-full border">
      <thead>
        <tr className="text-sm text-gray-400">
          <th className="border px-4 py-2">Code UVC</th>
          <th className="border px-4 py-2">Couleur</th>
          <th className="border px-4 py-2">Taille</th>
          <th className="border px-4 py-2">Prix Achat (PAEU)</th>
          <th className="border px-4 py-2">Prix Vente (TBEU/PB)</th>
          <th className="border px-4 py-2">Prix Modulé (TBEU/PMEU)</th>
        </tr>
      </thead>
      <tbody>
        {uvcPrices.map((uvc, index) => {
          const [color, size] = uvc.dimensions[0]?.split("/") || ["", ""];
          const uvcReference = `${reference}_${color}_${size}`;
          const { paeu, tbeu_pb, tbeu_pmeu } = uvc.prices;

          return (
            <tr key={index} className="text-sm">
              <td className="border px-4 py-1 text-center">{uvcReference}</td>
              <td className="border px-4 py-1 text-center">{color}</td>
              <td className="border px-4 py-1 text-center">{size}</td>
              <td className="border px-4 py-1 text-center">
                {isModify ? (
                  <input
                    type="number"
                    value={paeu}
                    onChange={(e) =>
                      onPriceChange(index, "paeu", parseFloat(e.target.value) || 0)
                    }
                    className="w-full text-center"
                  />
                ) : (
                  `${paeu} €`
                )}
              </td>
              <td className="border px-4 py-1 text-center">
                {isModify ? (
                  <input
                    type="number"
                    value={tbeu_pb}
                    onChange={(e) =>
                      onPriceChange(index, "tbeu_pb", parseFloat(e.target.value) || 0)
                    }
                    className="w-full text-center"
                  />
                ) : (
                  `${tbeu_pb} €`
                )}
              </td>
              <td className="border px-4 py-1 text-center">
                {isModify ? (
                  <input
                    type="number"
                    value={tbeu_pmeu}
                    onChange={(e) =>
                      onPriceChange(index, "tbeu_pmeu", parseFloat(e.target.value) || 0)
                    }
                    className="w-full text-center"
                  />
                ) : (
                  `${tbeu_pmeu} €`
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default UVCPriceTable;
