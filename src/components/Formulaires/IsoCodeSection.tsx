import React from "react";
import CreatableSelect from "react-select/creatable";
import { Trash, Plus } from "lucide-react";

interface IsoCodeSectionProps {
  isoCode: any;
  optionsIsoCode: any[];
  handleChangeIsoCode: (selectedOption: any) => void;
  handleInputChangeIsoCode: (inputValue: string) => void;
  inputValueIsoCode: string;
  customStyles: any;
}
const IsoCodeSection: React.FC<IsoCodeSectionProps> = ({
  isoCode,
  optionsIsoCode,
  handleChangeIsoCode,
  handleInputChangeIsoCode,
  inputValueIsoCode,
  customStyles,
}) => {
  return (
    <div className="w-full flex flex-col gap-1">
      <label className="mt-2 font-semibold">Pays :</label>
      <div className="flex items-center gap-2">
        <CreatableSelect
          value={isoCode}
          onChange={handleChangeIsoCode}
          onInputChange={handleInputChangeIsoCode}
          inputValue={inputValueIsoCode}
          onFocus={() => handleInputChangeIsoCode("")}
          options={optionsIsoCode}
          placeholder="Sélectionner un code ISO"
          styles={customStyles}
          menuPortalTarget={document.body}
          className="block text-sm py-1 w-full rounded-lg text-gray-500 border border-gray-200 focus:outline-none focus:ring-0 focus:border-gray-200 peer capitalize"
          isClearable
        />
      </div>
    </div>
  );
};

export default IsoCodeSection;
