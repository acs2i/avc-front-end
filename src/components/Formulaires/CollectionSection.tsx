import React from "react";
import CreatableSelect from "react-select/creatable";

interface CollectionSelectorProps {
  collection: any; // Une seule collection
  optionsCollection: any[];
  handleChangeCollection: (selectedOption: any) => void; // Plus besoin d'index ici
  handleInputChangeCollection: (inputValueCollection: string) => void;
  inputValueCollection: string;
  customStyles: any;
}

const CollectionSection: React.FC<CollectionSelectorProps> = ({
  collection,
  optionsCollection,
  handleChangeCollection,
  handleInputChangeCollection,
  inputValueCollection,
  customStyles,
}) => {
  return (
    <div className="relative w-full flex flex-col gap-3">
      <div>
        <CreatableSelect
          value={collection} // Gérer une seule collection
          onChange={handleChangeCollection} // Pas d'index ici
          onInputChange={handleInputChangeCollection}
          inputValue={inputValueCollection}
          options={optionsCollection}
          placeholder="Sélectionner une collection"
          styles={customStyles}
          className="block text-sm py-1 w-full rounded-lg text-gray-500 border border-gray-200 focus:outline-none focus:ring-0 focus:border-gray-200 peer capitalize"
        />
      </div>
    </div>
  );
};

export default CollectionSection;
