import React from "react";
import CreatableSelect from "react-select/creatable";
import { Trash, Plus } from "lucide-react";

interface BrandSelectorProps {
  existingbrands?: any[];
  brands: any[];
  optionsBrand: any[];
  handleChangeBrand: (selectedOption: any, index: number) => void;
  removeBrandField: (index: number) => void;
  addBrandField: () => void;
  handleInputChangeBrand: (inputValueBrand: string) => void;
  inputValueBrand: string;
  customStyles: any;
  addBrand?: boolean;
  displayTrash?: Boolean;
}

const BrandSection: React.FC<BrandSelectorProps> = ({
  brands,
  existingbrands,
  optionsBrand,
  handleChangeBrand,
  removeBrandField,
  addBrandField,
  handleInputChangeBrand,
  inputValueBrand,
  customStyles,
  addBrand,
  displayTrash,
}) => {
  // Fonction de filtrage améliorée
  const filterOptions = (inputValue: string, options: any[]) => {
    const input = inputValue.toLowerCase();
    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(input) ||
        (option.code && option.code.toLowerCase().includes(input))
    );
  };

  // Formatage personnalisé des options
  const formatOptionLabel = ({
    label,
    code,
  }: {
    label: string;
    code?: string;
  }) => (
    <div className="flex items-center justify-between">
      <span>
        {code} - {label}
      </span>
    </div>
  );

  return (
    <div className="w-full flex flex-col gap-3">
      <div>
        {brands.map((brand, index) => (
          <div key={index} className="flex items-center gap-2">
            <CreatableSelect
              value={brand}
              onChange={(option) => handleChangeBrand(option, index)}
              onInputChange={handleInputChangeBrand}
              inputValue={inputValueBrand}
              options={optionsBrand}
              filterOption={(option, input) =>
                filterOptions(input, [option.data])[0] !== undefined
              }
              formatOptionLabel={formatOptionLabel}
              placeholder="Tapez votre recherche..."
              styles={{
                ...customStyles,
                menu: (base) => ({
                  ...base,
                  zIndex: 9999,
                }),
              }}
              menuPortalTarget={document.body}
              className="block text-sm py-1 w-full rounded-lg text-gray-500 border border-gray-200 focus:outline-none focus:ring-0 focus:border-gray-200 peer capitalize"
              isClearable
              openMenuOnFocus
              onMenuOpen={() => handleInputChangeBrand("")}
            />
            {displayTrash && (
              <button
                type="button"
                onClick={() => removeBrandField(index)}
                className="text-red-500 hover:text-red-300"
              >
                <Trash size={20} />
              </button>
            )}
          </div>
        ))}
        {addBrand && (
          <div
            onClick={addBrandField}
            className="flex flex-col items-center justify-center p-[20px] text-orange-400 hover:text-orange-300 cursor-pointer"
          >
            <div className="flex items-center gap-2 text-[12px] mt-3">
              <Plus size={30} />
            </div>
            <p className="font-[700]">Ajouter une marque</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandSection;
