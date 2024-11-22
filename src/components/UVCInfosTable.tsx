import React, { useState } from "react";
import { useCollections } from "../utils/hooks/useCollection";
import CollectionSection from "./Formulaires/CollectionSection";
import { Info } from "lucide-react";

interface UVCInfosTableProps {
  reference: string;
  isModify?: boolean;
  collection?: any;
  uvcDimension: { code: string; dimensions: string[]; collectionUvc: any }[];
  customStyles: any;
  placeholder: (index: number) => string;
  handleUpdateCollection: (index: number, updatedCollection: any) => void;
}

const UVCInfosTable: React.FC<UVCInfosTableProps> = ({
  reference,
  isModify,
  collection,
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

  if (!collection) {
    return (
      <div className="bg-gray-200 p-4 rounded-md shadow-md font-semibold text-gray-700 flex items-center gap-2">
        <Info/>
        <span>Aucune collection n'a été ajoutée au brouillon</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Section descriptive */}
      <div className="mb-4 p-4 bg-gray-200 rounded-md shadow-md">
        <h3 className="font-semibold mb-2">Collection principale</h3>
        <div className="grid grid-cols-1 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Collection : </span>
            <span className="font-medium">
              {collection ? collection : "Aucune collection n'a été ajouté"}
            </span>
          </div>
        </div>
      </div>

      {/* Table des collections */}
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
              Collection
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
                  -
                </td>
                <td className="border px-4 py-2 text-center text-sm">
                  {couleur}
                </td>
                <td className="border px-4 py-2 text-center text-sm">
                  {taille}
                </td>
                <td className="border px-4 py-2 text-center text-sm bg-blue-50">
                  {isModify ? (
                    <CollectionSection
                      collection={uvc.collectionUvc}
                      placeholder={placeholder(index)}
                      optionsCollection={optionsCollection}
                      handleChangeCollection={(selectedOption) =>
                        handleUpdateCollection(index, selectedOption)
                      }
                      handleInputChangeCollection={(newInputValue) =>
                        handleLocalInputChange(index, newInputValue)
                      }
                      inputValueCollection={localInputValues[index]}
                      customStyles={customStyles}
                    />
                  ) : (
                    <span>
                      {typeof uvc.collectionUvc === "object" &&
                      uvc.collectionUvc?.label
                        ? uvc.collectionUvc.label
                        : uvc.collectionUvc ||
                          "Aucune collection n'a été ajoutée"}
                    </span>
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

export default UVCInfosTable;
