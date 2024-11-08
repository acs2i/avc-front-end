import React from "react";

interface UVCMeasureTableProps {
  reference: string;
  uvcMeasure: {
    code: string;
    dimensions: string[];
  }[];
  Measure: {
    height: string;
    long: string;
    width: string;
    weight_brut: string;
    weight_net: string;
  };
  size_unit: string
  weight_unit: string
}

const UVCMeasureTable: React.FC<UVCMeasureTableProps> = ({ uvcMeasure, Measure, reference, size_unit, weight_unit }) => {
  return (
    <table className="w-full border">
      <thead>
        <tr className="text-[13px] text-gray-400">
          <th className="border px-4 py-2 w-[50px]">Code UVC</th>
          <th className="border px-4 py-2 w-[50px]">Couleur</th>
          <th className="border px-4 py-2 w-[50px]">Taille</th>
          <th className="border px-4 py-2 w-[50px]">Hauteur</th>
          <th className="border px-4 py-2 w-[50px]">Longueur</th>
          <th className="border px-4 py-2 w-[50px]">Largeur</th>
          <th className="border px-4 py-2 w-[50px]">Poids brut</th>
          <th className="border px-4 py-2 w-[50px]">Poids net</th>
        </tr>
      </thead>
      <tbody>
        {uvcMeasure.map((uvc, index) => {
          // Extraire la couleur et la taille à partir des dimensions
          const [couleur, taille] = uvc.dimensions[0].split("/");
          const uvcReference = `${reference}${couleur}${taille}`;

          return (
            <tr key={index} className="text-[11px]">
              <td className="border px-4 py-1 text-center">{uvcReference}</td>
              <td className="border px-4 py-1 text-center">{couleur}</td>
              <td className="border px-4 py-1 text-center">{taille}</td>
              <td className="border px-4 py-1 text-center">{Measure.height} {size_unit}</td>
              <td className="border px-4 py-1 text-center">{Measure.long} {size_unit}</td>
              <td className="border px-4 py-1 text-center">{Measure.width} {size_unit}</td>
              <td className="border px-4 py-1 text-center">{Measure.weight_brut} {weight_unit}</td>
              <td className="border px-4 py-1 text-center">{Measure.weight_net} {weight_unit}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default UVCMeasureTable;
