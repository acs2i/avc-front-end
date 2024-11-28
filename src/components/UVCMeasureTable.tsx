import React from "react";

interface Price {
  supplier_id: string;
  price: {
    paeu: number;
    tbeu_pb: number;
    tbeu_pmeu: number;
  };
}

interface Uvc {
  code: string;
  dimensions: string[];
  prices: Price;
  eans: string[];
  status: string;
  collectionUvc: string;
  barcodePath: string;
  ean: string;
  height?: string;
  width?: string;
  length?: string;
  gross_weight?: string;
  net_weight?: string;
}

interface UVCMeasureTableProps {
  reference: string;
  uvcMeasure: Uvc[];
  Measure: {
    height: string;
    long: string;
    width: string;
    weight_brut: string;
    weight_net: string;
  };
  isModifyUvc?: boolean;
  setModifyUvc?: (value: boolean) => void;
  size_unit: string;
  weight_unit: string;
  isModify?: boolean;

  onUpdateMeasures?: (index: number, field: string, value: string) => void;
}

const UVCMeasureTable: React.FC<UVCMeasureTableProps> = ({
  uvcMeasure,
  Measure,
  reference,
  size_unit,
  weight_unit,
  isModify = false,
  isModifyUvc,
  setModifyUvc,
  onUpdateMeasures,
}) => {
  return (
    <div className="w-full">
      <div className="mb-4 p-4 bg-gray-100 rounded-md">
        <h3 className="font-semibold mb-2">Dimensions globales</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Hauteur: </span>
            <span className="font-medium">
              {Measure.height} {size_unit}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Longueur: </span>
            <span className="font-medium">
              {Measure.long} {size_unit}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Largeur: </span>
            <span className="font-medium">
              {Measure.width} {size_unit}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Poids brut: </span>
            <span className="font-medium">
              {Measure.weight_brut} {weight_unit}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Poids net: </span>
            <span className="font-medium">
              {Measure.weight_net} {weight_unit}
            </span>
          </div>
        </div>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50">
            <th className="border px-4 py-2 text-sm font-semibold text-gray-600">
              UVC Preref
            </th>
            <th className="border px-4 py-2 text-sm font-semibold text-gray-600">
              UVC Colombus
            </th>
            <th className="border px-4 py-2 text-sm font-semibold text-gray-600">
              Couleur
            </th>
            <th className="border px-4 py-2 text-sm font-semibold text-gray-600">
              Taille
            </th>
            <th className="border px-4 py-2 text-sm font-semibold text-gray-600">
              Hauteur
            </th>
            <th className="border px-4 py-2 text-sm font-semibold text-gray-600">
              Longueur
            </th>
            <th className="border px-4 py-2 text-sm font-semibold text-gray-600">
              Largeur
            </th>
            <th className="border px-4 py-2 text-sm font-semibold text-gray-600">
              Poids brut
            </th>
            <th className="border px-4 py-2 text-sm font-semibold text-gray-600">
              Poids net
            </th>
          </tr>
        </thead>
        <tbody>
          {uvcMeasure.map((uvc, index) => {
            const [couleur, taille] = uvc.dimensions[0]?.split("/") || ["", ""];
            const uvcReference = `${reference}_${couleur}_${taille}`;

            return (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border px-4 py-2 text-center text-sm">
                  {uvcReference}
                </td>
                <td className="border px-4 py-2 text-center text-sm">
                  -
                </td>
                <td className="border px-4 py-2 text-center text-sm">
                  {couleur}
                </td>
                <td className="border px-4 py-2 text-center text-sm">
                  {taille}
                </td>
                <td className="border px-4 py-2 text-center text-sm bg-blue-50">
                  {isModify && isModifyUvc ? (
                    <input
                      type="number"
                      className="w-20 p-1 border rounded [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      placeholder={uvc.height || Measure.height}
                      onChange={(e) =>
                        onUpdateMeasures?.(index, "height", e.target.value)
                      }
                    />
                  ) : (
                    `${uvc.height || Measure.height} ${size_unit}`
                  )}
                </td>
                <td className="border px-4 py-2 text-center text-sm  bg-blue-50">
                  {isModify && isModifyUvc ? (
                    <input
                      type="number"
                      className="w-20 p-1 border rounded [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      placeholder={uvc.length || Measure.long}
                      onChange={(e) =>
                        onUpdateMeasures?.(index, "length", e.target.value)
                      }
                    />
                  ) : (
                    `${uvc.length || Measure.long} ${size_unit}`
                  )}
                </td>
                <td className="border px-4 py-2 text-center text-sm bg-blue-50">
                  {isModify && isModifyUvc ? (
                    <input
                      type="number"
                      className="w-20 p-1 border rounded [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      placeholder={uvc.width || Measure.width}
                      onChange={(e) =>
                        onUpdateMeasures?.(index, "width", e.target.value)
                      }
                    />
                  ) : (
                    `${uvc.width || Measure.width} ${size_unit}`
                  )}
                </td>
                <td className="border px-4 py-2 text-center text-sm  bg-blue-50">
                  {isModify && isModifyUvc ? (
                    <input
                      type="number"
                      className="w-20 p-1 border rounded [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      placeholder={uvc.gross_weight || Measure.weight_brut}
                      onChange={(e) =>
                        onUpdateMeasures?.(
                          index,
                          "gross_weight",
                          e.target.value
                        )
                      }
                    />
                  ) : (
                    `${uvc.gross_weight || Measure.weight_brut} ${weight_unit}`
                  )}
                </td>
                <td className="border px-4 py-2 text-center text-sm bg-blue-50">
                  {isModify && isModifyUvc ? (
                    <input
                      type="number"
                      className="w-20 p-1 border rounded [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      placeholder={uvc.net_weight || Measure.weight_net}
                      onChange={(e) =>
                        onUpdateMeasures?.(index, "net_weight", e.target.value)
                      }
                    />
                  ) : (
                    `${uvc.net_weight || Measure.weight_net} ${weight_unit}`
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

export default UVCMeasureTable;
