import React from "react";
import CreatableSelect from "react-select/creatable";

interface FamilySelectorProps {
  family: any;
  optionsFamily: any[];
  handleChangeFamily: (selectedOption: any) => void;
  handleInputChangeFamily: (inputValueFamily: string) => void;
  inputValueFamily: string;
  customStyles: any;
  isList?: Boolean;
}

const FamilySection: React.FC<FamilySelectorProps> = ({
  family,
  optionsFamily,
  handleChangeFamily,
  handleInputChangeFamily,
  inputValueFamily,
  customStyles,
  isList,
}) => {
  // Fonction de filtrage améliorée
  const filterOptions = (inputValue: string, options: any[]) => {
    const input = inputValue.toLowerCase();
    return options.filter(
      option =>
        option.name.toLowerCase().includes(input) ||
        option.code.toLowerCase().includes(input)
    );
  };

  // Formatage personnalisé des options
  const formatOptionLabel = ({ name, code }: { name: string; code: string }) => (
    <div className="flex items-center justify-between">
      <span>{name}</span>
      <span className="text-gray-400 text-sm">({code})</span>
    </div>
  );

  return (
    <div className={`w-full flex flex-col gap-3 ${isList ? "" : "mt-2"}`}>
      <div>
        <CreatableSelect
          value={family}
          onChange={handleChangeFamily}
          onInputChange={handleInputChangeFamily}
          inputValue={inputValueFamily}
          options={optionsFamily}
          filterOption={(option, input) => 
            filterOptions(input, [option.data])[0] !== undefined
          }
          formatOptionLabel={formatOptionLabel}
          placeholder="Rechercher ou créer une famille"
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
          onMenuOpen={() => handleInputChangeFamily("")}
        />
      </div>
    </div>
  );
};

export default FamilySection;