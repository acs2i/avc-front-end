import React, { useState } from "react";
import { useCollections } from "../utils/hooks/useCollection";
import CollectionSection from "./Formulaires/CollectionSection";

interface UVCInfosTableProps {
  reference: string;
  isModify?: boolean;
  block?: any;
  reason?: string;
  reason_display?: boolean;
  uvcDimension: { code: string; dimensions: string[]; collectionUvc: any }[];
  customStyles: any;
  placeholder: (index: number) => string;
  handleUpdateCollection: (index: number, updatedCollection: any) => void;
}

const UVCBlockTable: React.FC<UVCInfosTableProps> = ({
  reference,
  isModify,
  block,
  reason,
  reason_display,
  uvcDimension,
  customStyles,
  placeholder,
  handleUpdateCollection,
}) => {
  const { optionsCollection, handleInputChangeCollection } = useCollections(
    "",
    10
  );

  // Gérer un état local pour chaque ligne
  const [localInputValues, setLocalInputValues] = useState<string[]>(
    Array(uvcDimension.length).fill("") // Initialiser un tableau vide pour chaque ligne
  );

  const handleLocalInputChange = (index: number, newInputValue: string) => {
    // Mettre à jour uniquement la valeur de la ligne concernée
    const updatedValues = [...localInputValues];
    updatedValues[index] = newInputValue;
    setLocalInputValues(updatedValues);

    // Appeler la fonction du hook pour fetch les données
    handleInputChangeCollection(newInputValue);
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
              Motif
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
                <td className="border px-4 py-2 text-center text-sm">
                 {block}
                </td>
                <td className="border px-4 py-2 text-center text-sm">
                 {reason}
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
