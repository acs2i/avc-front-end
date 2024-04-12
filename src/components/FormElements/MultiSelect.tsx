import React, { useState } from "react";

type MultiSelectProps = {
  id: string;
  options: { value: string; label: string; name: string }[];
  label?: string;
  required?: boolean;
  value: string[];
  onChange: (selectedOptions: string[]) => void;
};

const MultiSelect: React.FC<MultiSelectProps> = ({
  id,
  options,
  label,
  required,
  value,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionClick = (option: {
    value: string;
    label: string;
    name: string;
  }) => {
    let newValue;
    if (value.includes(option.value)) {
      newValue = value.filter((o) => o !== option.value);
    } else {
      newValue = [...value, option.value];
    }
    onChange(newValue);
    // Vous pourriez ajouter une ligne ici pour mettre à jour l'état local `value`
    // par exemple: setValue(newValue);
    // mais ce n'est pas nécessaire si vous gérez correctement l'état dans le composant parent
  };

  return (
    <div className={`flex flex-col mt-3`}>
      <div>
        <label
          htmlFor={id}
          className="relative text-[15px] font-bold text-gray-500"
        >
          {label}
          {required && (
            <span className="absolute top-[-5px] right-[-10px] text-red-400">
              *
            </span>
          )}
        </label>
      </div>
      <div className="relative">
        <div
          className="w-full h-[50px] flex items-center bg-white border-b border-gray-300 rounded-md cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          {value.length > 0 ? (
            value.map((option, index) => (
              <span
                key={index}
                className="flex items-center justify-center bg-orange-200 text-gray-700 rounded-full w-[30px] h-[30px] mr-2"
              >
                {options.find((o) => o.value === option)?.name}
              </span>
            ))
          ) : (
            <span className="text-gray-500">Sélectionnez les tailles</span>
          )}
        </div>
        {isOpen && (
          <div className="absolute z-10 w-full bg-gray-100 border border-gray-300 rounded-md">
            <div className="relative h-[50px]">
              <span
                className="absolute right-[0px] text-white text-xl cursor-pointer bg-gray-400 w-[40px] h-[40px] flex items-center justify-center"
                onClick={() => setIsOpen(false)}
              >
                X
              </span>
            </div>
            <div>
              {options.map((option) => (
                <div
                  key={option.value}
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                    value.includes(option.value)
                      ? "bg-gray-200 text-gray-700"
                      : "text-gray-500"
                  }`}
                  onClick={() => handleOptionClick(option)}
                >
                  {option.name}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiSelect;
