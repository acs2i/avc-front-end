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
  return (
    <div
      className={`relative w-full flex flex-col gap-3 ${isList ? "" : "mt-2"}`}
    >
      <div>
        <CreatableSelect
          value={subFamily}
          onChange={handleChangeSubFamily}
          onInputChange={handleInputChangeSubFamily}
          inputValue={inputValueSubFamily}
          options={optionsSubFamily}
          placeholder="Sélectionner une sous-famille"
          styles={customStyles}
          menuPortalTarget={document.body}
          isClearable
          className="block text-sm py-1 w-full rounded-lg text-gray-500 border border-gray-200 focus:outline-none focus:ring-0 focus:border-gray-200 peer capitalize"
         
        />
      </div>
    </div>
  );
};

export default SubFamilySection;
