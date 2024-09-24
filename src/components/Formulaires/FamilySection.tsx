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
  return (
    <div
      className={`relative w-full flex flex-col gap-3 ${isList ? "" : "mt-2"}`}
    >
      <div>
        <CreatableSelect
          value={family} // Gérer une seule famille
          onChange={handleChangeFamily} // Pas d'index ici
          onInputChange={handleInputChangeFamily}
          inputValue={inputValueFamily}
          options={optionsFamily}
          placeholder="Sélectionner une famille"
          styles={customStyles}
          menuPortalTarget={document.body}
          isClearable
          className="block text-sm py-1 w-full rounded-lg text-gray-500 border border-gray-200 focus:outline-none focus:ring-0 focus:border-gray-200 peer capitalize z-30"
        />
      </div>
    </div>
  );
};

export default FamilySection;
