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
