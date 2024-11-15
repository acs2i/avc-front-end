import React from "react";
import CreatableSelect from "react-select/creatable";

interface SubFamilySelectorProps {
  subFamily: any;
  optionsSubFamily: any[];
  handleChangeSubFamily: (selectedOption: any) => void;
  handleInputChangeSubFamily: (inputValueSubFamily: string) => void;
  inputValueSubFamily: string;
  customStyles: any;
  isList?: Boolean;
}

const SubFamilySection: React.FC<SubFamilySelectorProps> = ({
  subFamily,
  optionsSubFamily,
  handleChangeSubFamily,
  handleInputChangeSubFamily,
  inputValueSubFamily,
  customStyles,
  isList,
}) => {
  // Fonction de filtrage améliorée
  const filterOptions = (inputValue: string, options: any[]) => {
    const input = inputValue.toLowerCase();
    return options.filter((option) => {
      const name = option.name ? option.name.toLowerCase() : "";
      const code = option.code ? option.code.toLowerCase() : "";
      return name.includes(input) || code.includes(input);
    });
  };
  

  // Formatage personnalisé des options
  const formatOptionLabel = ({ name, code }: { name: string; code: string }) => (
    <div className="flex items-center justify-between">
      <span>{name}</span>
      <span className="text-gray-400 text-sm">({code})</span>
    </div>
  );

  return (
    <div className={`relative w-full flex flex-col gap-3 ${isList ? "" : "mt-2"}`}>
      <div>
        <CreatableSelect
          value={subFamily}
          onChange={handleChangeSubFamily}
          onInputChange={handleInputChangeSubFamily}
          onFocus={() => handleInputChangeSubFamily("")}
          inputValue={inputValueSubFamily}
          options={optionsSubFamily}
          filterOption={(option, input) => 
            filterOptions(input, [option.data])[0] !== undefined
          }
          formatOptionLabel={formatOptionLabel}
          placeholder="Rechercher ou créer une sous-famille"
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
          onMenuOpen={() => handleInputChangeSubFamily("")}
        />
      </div>
    </div>
  );
};

export default SubFamilySection;