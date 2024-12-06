import React, { useState } from "react";
import { useCollections } from "../utils/hooks/useCollection";
import CollectionSection from "./Formulaires/CollectionSection";
import BlockSection from "./Formulaires/BlockSection";
import { useBlocks } from "../utils/hooks/useBlock";

interface UVCInfosTableProps {
  reference: string;
  isModify?: boolean;
  isModifyUvc?: boolean;
  blockValue?: string;
  block?: any;
  reason?: string;
  reason_display?: boolean;
  uvcDimension: {
    code: string;
    dimensions: string[];
    collectionUvc: any;
    blocked: any;
    blocked_reason_code: any;
  }[];
  customStyles: any;
  placeholder: (index: number) => string;
  handleUpdateBlocked: (index: number, updatedCollection: any) => void;
  handleUpdateBlockedReason: (index: number, updatedBlock: any) => void;
}

const UVCBlockTable: React.FC<UVCInfosTableProps> = ({
  reference,
  isModify,
  isModifyUvc,
  block,
  reason,
  blockValue,
  reason_display,
  uvcDimension,
  customStyles,
  placeholder,
  handleUpdateBlocked,
  handleUpdateBlockedReason,
}) => {
  const { optionsBlock, handleInputChangeBlock } = useBlocks("", 10);

  const [localInputValues, setLocalInputValues] = useState<string[]>(
    Array(uvcDimension.length).fill("") // Initialiser un tableau vide pour chaque ligne
  );

  const handleLocalInputChange = (index: number, newInputValue: string) => {
    const updatedValues = [...localInputValues];
    updatedValues[index] = newInputValue;
    setLocalInputValues(updatedValues);

    handleInputChangeBlock(newInputValue);
  };

  return (
    <div className="w-full">
      {/* Table des collections */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50">
            <th className="border px-4 py-2 text-sm font-semibold text-gray-600">
              Code UVC
            </th>
            <th className="border px-4 py-2 text-sm font-semibold text-gray-600">
              Couleur
            </th>
            <th className="border px-4 py-2 text-sm font-semibold text-gray-600">
              Taille
            </th>
            <th className="border px-4 py-2 text-sm font-semibold text-gray-600">
              Blocage
            </th>
            <th className="border px-4 py-2 text-sm font-semibold text-gray-600">
              Motif du blocage
            </th>
          </tr>
        </thead>
        <tbody>
          {uvcDimension.map((uvc, index) => {
            const [couleur, taille] = uvc.dimensions[0]?.split("/") || ["", ""];
            const uvcReference = `${reference}_${couleur}_${taille}`;

            return (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border px-4 py-2 text-center text-sm">
                  {uvcReference}
                </td>
                <td className="border px-4 py-2 text-center text-sm">
                  {couleur}
                </td>
                <td className="border px-4 py-2 text-center text-sm">
                  {taille}
                </td>
                <td className="border px-4 py-2 text-center text-sm bg-blue-50">
                  {isModify && isModifyUvc ? (
                    <select
                      className="w-full border rounded-md p-1 bg-white text-gray-600 focus:outline-none focus:border-blue-500"
                      value={uvc.blocked || blockValue || ""} // Utilisez la valeur spécifique de l'UVC
                      onChange={(e) => {
                        const updatedBlocked = e.target.value;
                        handleUpdateBlocked(index, {
                          ...uvc,
                          blocked: updatedBlocked,
                        });
                      }}
                    >
                      <option value="Non">Non</option>
                      <option value="Oui">Oui</option>
                    </select>
                  ) : (
                    uvc.blocked || blockValue || "Non"
                  )}
                </td>
                <td className="border px-4 py-2 text-center text-sm bg-blue-50">
                  {isModify && isModifyUvc && uvc.blocked === "Oui" ? (
                    <BlockSection
                      blocks={
                        uvc.blocked_reason_code
                          ? [uvc.blocked_reason_code]
                          : [reason]
                      }
                      placeholder={placeholder(index)}
                      optionsBlock={optionsBlock}
                      handleChangeBlock={(selectedOption) =>
                        handleUpdateBlockedReason(index, selectedOption)
                      }
                      handleInputChangeBlock={(newInputValue) =>
                        handleLocalInputChange(index, newInputValue)
                      }
                      inputValueBlock={localInputValues[index]}
                      customStyles={customStyles}
                    />
                  ) : (
                    uvc.blocked === "Non"
                    ? "-"
                    : uvc.blocked_reason_code || reason || "-"
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

export default UVCBlockTable;
