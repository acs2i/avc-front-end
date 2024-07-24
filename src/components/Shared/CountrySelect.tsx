import React, { useState, useEffect, useRef } from 'react';
import Select, { SingleValue } from 'react-select';
import countryList from 'react-select-country-list';

interface CountryOption {
  value: string;
  label: string;
}

interface CountrySelectorProps {
  index: number;
  value: string;
  onChange: (index: number, field: string, value: string) => void;
}

const CountrySelector: React.FC<CountrySelectorProps> = ({
  index,
  value,
  onChange,
}) => {
  const [selectedValue, setSelectedValue] = useState<SingleValue<CountryOption>>(null);
  const options = countryList().getData();
  const hasSetDefault = useRef(false);

  const changeHandler = (selectedOption: SingleValue<CountryOption>) => {
    setSelectedValue(selectedOption);
    onChange(index, "made_in", selectedOption ? selectedOption.value : "");
  };

  useEffect(() => {
    if (!hasSetDefault.current) {
      const defaultOption = options.find((option) => option.value === "FR");
      if (defaultOption) {
        setSelectedValue(defaultOption);
        onChange(index, "made_in", defaultOption.value);
        hasSetDefault.current = true;
      }
    }
  }, [index, onChange, options]);

  return (
    <div className="mt-3">
      <label className="relative text-sm font-medium text-gray-800">Made in :</label>
      <Select
        options={options}
        value={selectedValue}
        onChange={changeHandler}
      />
    </div>
  );
};

export default CountrySelector;
