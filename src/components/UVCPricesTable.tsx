import React from "react";

interface UVCPriceTableProps {
  reference: string;
  isModifyUvc?: boolean;
  setModifyUvc?: (value: boolean) => void;
  uvcPrices: {
    code: string;
    dimensions: string[];
    prices: {
      supplier_id: string;
      price: {
        paeu: number;
        tbeu_pb: number;
        tbeu_pmeu: number;
      };
    };
  }[];
  globalPrices: {
    paeu: number;
    tbeu_pb: number;
    tbeu_pmeu: number;
  };
  isModify: boolean;
  onPriceChange: (index: number, field: string, value: number) => void;
}

const UVCPriceTable: React.FC<UVCPriceTableProps> = ({
  reference,
  uvcPrices,
  globalPrices,
  isModify,
  isModifyUvc,
  setModifyUvc,
  onPriceChange,
}) => {
  return (
    <div className="w-full">
      <div className="mb-4 p-4 bg-gray-200 rounded-md shadow-md">
        <h3 className="font-semibold mb-2">Prix globaux</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <span className="text-sm text-gray-600">PAEU Global: </span>
            <span className="font-medium">{globalPrices.paeu} €</span>
          </div>
          <div>
            <span className="text-sm text-gray-600">TBEU/PB Global: </span>
            <span className="font-medium">{globalPrices.tbeu_pb} €</span>
          </div>
          <div>
            <span className="text-sm text-gray-600">TBEU/PMEU Global: </span>
            <span className="font-medium">{globalPrices.tbeu_pmeu} €</span>
          </div>
        </div>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50">
            <th className="border px-4 py-2 text-sm font-semibold text-gray-600">UVC Preref</th>
            <th className="border px-4 py-2 text-sm font-semibold text-gray-600">UVC Colombus</th>
            <th className="border px-4 py-2 text-sm font-semibold text-gray-600">Couleur</th>
            <th className="border px-4 py-2 text-sm font-semibold text-gray-600">Taille</th>
            <th className="border px-4 py-2 text-sm font-semibold text-gray-600">Prix Achat (PAEU)</th>
            <th className="border px-4 py-2 text-sm font-semibold text-gray-600">Prix Vente (TBEU/PB)</th>
            <th className="border px-4 py-2 text-sm font-semibold text-gray-600">Prix Modulé (TBEU/PMEU)</th>
          </tr>
        </thead>
        <tbody>
          {uvcPrices.map((uvc, index) => {
            const [color, size] = uvc.dimensions[0]?.split("/") || ["", ""];
            const uvcReference = `${reference}_${color}_${size}`;
            
            // Utiliser les prix de l'UVC s'ils existent, sinon utiliser les prix globaux
            const paeu = uvc.prices?.price?.paeu ?? globalPrices.paeu;
            const tbeu_pb = uvc.prices?.price?.tbeu_pb ?? globalPrices.tbeu_pb;
            const tbeu_pmeu = uvc.prices?.price?.tbeu_pmeu ?? globalPrices.tbeu_pmeu;

            return (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border px-4 py-2 text-center text-sm">{uvcReference}</td>
                <td className="border px-4 py-2 text-center text-sm">-</td>
                <td className="border px-4 py-2 text-center text-sm">{color}</td>
                <td className="border px-4 py-2 text-center text-sm">{size}</td>
                <td className="border px-4 py-2 text-center bg-blue-50">
                  {isModify && isModifyUvc ? (
                    <input
                      type="number"
                      value={paeu}
                      onChange={(e) => onPriceChange(index, "paeu", parseFloat(e.target.value) || 0)}
                      className="w-full p-1 text-center border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <span className="text-sm">{paeu} €</span>
                  )}
                </td>
                <td className="border px-4 py-2 text-center bg-blue-50">
                  {isModify && isModifyUvc ? (
                    <input
                      type="number"
                      value={tbeu_pb}
                      onChange={(e) => onPriceChange(index, "tbeu_pb", parseFloat(e.target.value) || 0)}
                      className="w-full p-1 text-center border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <span className="text-sm">{tbeu_pb} €</span>
                  )}
                </td>
                <td className="border px-4 py-2 text-center bg-blue-50">
                  {isModify && isModifyUvc ? (
                    <input
                      type="number"
                      value={tbeu_pmeu}
                      onChange={(e) => onPriceChange(index, "tbeu_pmeu", parseFloat(e.target.value) || 0)}
                      className="w-full p-1 text-center border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <span className="text-sm">{tbeu_pmeu} €</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default UVCPriceTable;