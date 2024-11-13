import React from "react";

interface UVCPriceTableProps {
  reference: string;
  uvcPrices: {
    code: string;
    dimensions: string[];
  }[];
  globalPrices: {
    peau: number;
    tbeu_pb: number;
    tbeu_pmeu: number;
  };
}

const UVCPriceTable: React.FC<UVCPriceTableProps> = ({ uvcPrices, globalPrices, reference }) => {
  return (
    <table className="w-full border">
      <thead>
        <tr className="text-[13px] text-gray-400">
          <th className="border px-4 py-2 w-[50px]">Code UVC</th>
          <th className="border px-4 py-2 w-[50px]">Couleur</th>
          <th className="border px-4 py-2 w-[50px]">Taille</th>
          <th className="border px-4 py-2 w-[50px]">Prix Achat (PEAU)</th>
          <th className="border px-4 py-2 w-[50px]">Prix Vente (TBEU/PB)</th>
          <th className="border px-4 py-2 w-[50px]">Prix Modulé (TBEU/PMEU)</th>
        </tr>
      </thead>
      <tbody>
        {uvcPrices.map((uvc, index) => {
          // Extraire la couleur et la taille à partir des dimensions
          const [couleur, taille] = uvc.dimensions[0].split("/");
          const uvcReference = `${reference}_${couleur}_${taille}`;

          return (
            <tr key={index} className="text-[11px]">
              <td className="border px-4 py-1 text-center">{uvcReference}</td>
              <td className="border px-4 py-1 text-center">{couleur}</td>
              <td className="border px-4 py-1 text-center">{taille}</td>
              {/* Utiliser les prix globaux */}
              <td className="border px-4 py-1 text-center">{globalPrices.peau} €</td>
              <td className="border px-4 py-1 text-center">{globalPrices.tbeu_pb} €</td>
              <td className="border px-4 py-1 text-center">{globalPrices.tbeu_pmeu} €</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default UVCPriceTable;
