import React from "react";
import CreatableSelect from "react-select/creatable";
import { Trash, Plus } from "lucide-react";

interface BlockSelectorProps {
  blocks: any[];
  optionsBlock: any[];
  handleChangeBlock: (selectedOption: any, index: number) => void;
  handleInputChangeBlock: (inputValueBlock: string) => void;
  inputValueBlock: string;
  customStyles: any;
}

const BlockSection: React.FC<BlockSelectorProps> = ({
  blocks,
  optionsBlock,
  handleChangeBlock,
  handleInputChangeBlock,
  inputValueBlock,
  customStyles,
}) => {
  // Fonction de filtrage améliorée
  const filterOptions = (inputValue: string, options: any[]) => {
    const input = inputValue.toLowerCase();
    return options.filter(option => {
      const labelMatch = option.label.toLowerCase().includes(input);
      const codeMatch = option.code
        ? option.code.toString().toLowerCase().includes(input)
        : false;
      return labelMatch || codeMatch;
    });
  };
  

  // Formatage personnalisé des options
  const formatOptionLabel = ({ label, code }: { label: string; code?: string }) => (
    <div className="flex items-center justify-between">
      <span>{label}</span>
      {code && <span className="text-gray-400 text-sm">({code})</span>}
    </div>
  );

  return (
    <div className="w-full flex flex-col gap-3">
      <div>
        {blocks.map((block, index) => (
          <div key={index} className="flex items-center gap-2">
            <CreatableSelect
              value={block}
              onChange={(option) => handleChangeBlock(option, index)}
              onInputChange={handleInputChangeBlock}
              inputValue={inputValueBlock}
              options={optionsBlock}
              filterOption={(option, input) => 
                filterOptions(input, [option.data])[0] !== undefined
              }
              formatOptionLabel={formatOptionLabel}
              placeholder="Recherche..."
              styles={{
                ...customStyles,
                menu: (base) => ({
                  ...base,
                  zIndex: 9999
                })
              }}
              menuPortalTarget={document.body}
              className="block text-sm py-1 w-full rounded-lg text-gray-500 border border-gray-200 focus:outline-none focus:ring-0 focus:border-gray-200 peer capitalize"
              isClearable
              openMenuOnFocus
              onMenuOpen={() => handleInputChangeBlock("")}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlockSection;