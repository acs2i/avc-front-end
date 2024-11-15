import React from "react";
import CreatableSelect from "react-select/creatable";

interface SubSubFamilySelectorProps {
  subSubFamily: any;
  optionsSubSubFamily: any[];
  handleChangeSubSubFamily: (selectedOption: any) => void;
  handleInputChangeSubSubFamily: (inputValueSubSubFamily: string) => void;
  inputValueSubSubFamily: string;
  customStyles: any;
  isList?: Boolean;
}

const SubSubFamilySection: React.FC<SubSubFamilySelectorProps> = ({
  subSubFamily,
  optionsSubSubFamily,
  handleChangeSubSubFamily,
  handleInputChangeSubSubFamily,
  inputValueSubSubFamily,
  customStyles,
  isList,
}) => {

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
    <div
      className={`relative w-full flex flex-col gap-3 ${isList ? "" : "mt-2"}`}
    >
      <div>
        <CreatableSelect
          value={subSubFamily}
          onChange={handleChangeSubSubFamily}
          onInputChange={handleInputChangeSubSubFamily}
          onFocus={() => handleInputChangeSubSubFamily("")}
          inputValue={inputValueSubSubFamily}
          options={optionsSubSubFamily}
          filterOption={(option, input) => 
            filterOptions(input, [option.data])[0] !== undefined
          }
          formatOptionLabel={formatOptionLabel}
          placeholder="Sélectionner une sous-sous-famille"
          styles={customStyles}
          className="block text-sm py-1 w-full rounded-lg text-gray-500 border border-gray-200 focus:outline-none focus:ring-0 focus:border-gray-200 peer capitalize"
          menuPortalTarget={document.body}
          menuPosition="fixed"
        />
      </div>
    </div>
  );
};

export default SubSubFamilySection;
