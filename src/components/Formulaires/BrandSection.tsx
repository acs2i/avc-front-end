import React from "react";
import CreatableSelect from "react-select/creatable";
import { Trash, Plus } from "lucide-react";

interface BrandSelectorProps {
  brands: any[];
  optionsBrand: any[];
  handleChangeBrand: (selectedOption: any, index: number) => void;
  removeBrandField: (index: number) => void;
  addBrandField: () => void;
  handleInputChangeBrand: (inputValueBrand: string) => void;
  inputValueBrand: string;
  customStyles: any;
}

const BrandSection: React.FC<BrandSelectorProps> = ({
  brands,
  optionsBrand,
  handleChangeBrand,
  removeBrandField,
  addBrandField,
  handleInputChangeBrand,
  inputValueBrand,
  customStyles,
}) => {
  return (
    <div className="relative w-full flex flex-col gap-3">
      <div >
        {brands.map((brand, index) => (
          <div key={index} className="flex items-center gap-2 mt-2">
            <CreatableSelect
              value={brand}
              onChange={(option) => handleChangeBrand(option, index)}
              onInputChange={handleInputChangeBrand}
              inputValue={inputValueBrand}
              options={optionsBrand}
              placeholder="Selectionner une marque"
              styles={customStyles}
              className="block text-sm py-1 w-full rounded-lg text-gray-500 border border-gray-200 focus:outline-none focus:ring-0 focus:border-gray-200 peer capitalize"
            />
            <button
              type="button"
              onClick={() => removeBrandField(index)}
              className="text-red-500 hover:text-red-300"
            >
              <Trash size={20} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addBrandField}
          className="flex items-center gap-2 text-[12px] text-orange-400 mt-3"
        >
          <Plus size={17} />
          Ajouter une marque
        </button>
      </div>
    </div>
  );
};

export default BrandSection;
