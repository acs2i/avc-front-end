import React from "react";
import CreatableSelect from "react-select/creatable";

interface CollectionSelectorProps {
  collection: any;
  optionsCollection: any[];
  handleChangeCollection: (selectedOption: any) => void;
  handleInputChangeCollection: (inputValueCollection: string) => void;
  inputValueCollection: string;
  placeholder: string;
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

  const filterOptions = (inputValue: string, options: any[]) => {
    const input = inputValue ? inputValue.toLowerCase() : "";
    return options.filter((option) => {
      const name = option.label ? option.label.toLowerCase() : "";
      const code = option.code ? option.code.toLowerCase() : "";
      return name.includes(input) || code.includes(input);
    });
  };

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
          value={collection} // Gérer une seule collection
          onChange={handleChangeCollection} // Pas d'index ici
          onInputChange={handleInputChangeCollection}
          onFocus={() => handleInputChangeCollection("")}
          filterOption={(option, input) => 
            filterOptions(input, [option.data])[0] !== undefined
          }
          formatOptionLabel={formatOptionLabel}
          inputValue={inputValueCollection}
          options={optionsCollection}
          placeholder={placeholder}
          styles={customStyles}
          menuPortalTarget={document.body}
          isClearable
          className="block text-sm py-1 w-full rounded-lg text-gray-500 border border-gray-200 focus:outline-none focus:ring-0 focus:border-gray-200 peer capitalize"
        />
      </div>
    </div>
  );
};

export default CollectionSection;
