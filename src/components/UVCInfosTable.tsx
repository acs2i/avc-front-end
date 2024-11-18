import React, { useState } from "react";
import { useCollections } from "../utils/hooks/useCollection";
import CollectionSection from "./Formulaires/CollectionSection";

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

  return (
    <table className="w-full border">
      <thead>
        <tr className="text-sm text-gray-400">
          <th className="border px-4 py-2">Code UVC</th>
          <th className="border px-4 py-2">Couleur</th>
          <th className="border px-4 py-2">Taille</th>
          <th className="border px-4 py-2">Collection</th>
        </tr>
      </thead>
      <tbody>
        {uvcDimension.map((uvc, index) => {
          const [couleur, taille] = uvc.dimensions[0].split("/");
          const uvcReference = `${reference}_${couleur}_${taille}`;

          return (
            <tr key={index} className="text-sm">
              <td className="border px-4 py-1 text-center">{uvcReference}</td>
              <td className="border px-4 py-1 text-center">{couleur}</td>
              <td className="border px-4 py-1 text-center">{taille}</td>
              <td className="border px-4 py-1 text-center">
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
                      : uvc.collectionUvc || "Non spécifiée"}
                  </span>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default UVCInfosTable;
