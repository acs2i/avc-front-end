import React from "react";
import CreatableSelect from "react-select/creatable";

interface CollectionSelectorProps {
  collection: any;
  optionsCollection: any[];
  handleChangeCollection: (selectedOption: any) => void;
  handleInputChangeCollection: (inputValueCollection: string) => void;
  inputValueCollection: string;
  placeholder?: string;
  customStyles: any;
}

const CollectionSection: React.FC<CollectionSelectorProps> = ({
  collection,
  optionsCollection,
  handleChangeCollection,
  handleInputChangeCollection,
  inputValueCollection,
  placeholder,
  customStyles,
}) => {
  // Fonction de filtrage améliorée
  const filterOptions = (inputValue: string, options: any[]) => {
    const input = inputValue.toLowerCase();
    return options.filter((option) => {
      const label = option.label ? option.label.toLowerCase() : "";
      const code = option.code ? option.code.toLowerCase() : "";
      return label.includes(input) || code.includes(input);
    });
  };

  // Formatage personnalisé des options
  const formatOptionLabel = ({ label, code }: { label: string; code: string }) => (
    <div className="flex items-center justify-between">
      <span>{label}</span>
      <span className="text-gray-400 text-sm">({code})</span>
    </div>
  );

  return (
    <div className="relative w-full flex flex-col gap-3">
      <div>
        <CreatableSelect
          value={collection}
          onChange={handleChangeCollection}
          onInputChange={handleInputChangeCollection}
          onFocus={() => handleInputChangeCollection("")}
          inputValue={inputValueCollection}
          options={optionsCollection}
          filterOption={(option, input) => 
            filterOptions(input, [option.data])[0] !== undefined
          }
          formatOptionLabel={formatOptionLabel}
          placeholder={placeholder || "Tapez Votre Recherche..."}
          styles={{
            ...customStyles,
            menu: (base) => ({
              ...base,
              zIndex: 9999
            })
          }}
          menuPortalTarget={document.body}
          isClearable
          className="block text-sm py-1 w-full rounded-lg text-gray-500 border border-gray-200 focus:outline-none focus:ring-0 focus:border-gray-200 peer capitalize"
          openMenuOnFocus
          onMenuOpen={() => handleInputChangeCollection("")}
          noOptionsMessage={() => "No options"}
          isValidNewOption={() => false}
        />
      </div>
    </div>
  );
};

export default CollectionSection;