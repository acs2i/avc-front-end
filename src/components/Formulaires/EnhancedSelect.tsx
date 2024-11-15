import React, { useCallback } from 'react';
import CreatableSelect from 'react-select/creatable';
import { SingleValue, GroupBase } from 'react-select';
import { BrandOption, TagOption, CollectionOption } from '@/type';

type OptionType = BrandOption | TagOption | CollectionOption;

interface EnhancedSelectProps<T extends OptionType> {
  value: SingleValue<T> | null;
  onChange: (option: SingleValue<T>) => void;
  onInputChange: (inputValue: string) => void;
  options: T[];
  inputValue: string;
  placeholder: string;
  type: 'brand' | 'family' | 'subfamily' | 'subsubfamily' | 'collection';
  className?: string;
  isDisabled?: boolean;
}

const customStyles = {
  control: (provided: any, state: any) => ({
    ...provided,
    border: state.isFocused ? '1px solid #3B71CA' : '1px solid #E5E7EB',
    boxShadow: 'none',
    '&:hover': {
      border: '1px solid #3B71CA',
    },
    cursor: 'pointer',
    minHeight: '38px',
  }),
  menu: (base: any) => ({
    ...base,
    zIndex: 9999,
    marginTop: '2px',
  }),
  menuPortal: (base: any) => ({
    ...base,
    zIndex: 9999,
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isSelected ? '#E5E7EB' : 'white',
    color: state.isSelected ? 'black' : 'gray',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#F3F4F6',
      color: 'black',
    },
  }),
  valueContainer: (provided: any) => ({
    ...provided,
    padding: '0 6px',
  }),
};

function EnhancedSelect<T extends OptionType>({
  value,
  onChange,
  onInputChange,
  options,
  inputValue,
  placeholder,
  type,
  className,
  isDisabled = false,
}: EnhancedSelectProps<T>) {
  const handleFocus = useCallback(() => {
    onInputChange('');
  }, [onInputChange]);

  const formatOptionLabel = useCallback((option: T): JSX.Element => {
    const baseClassName = "flex justify-between items-center";

    switch(type) {
      case 'brand': {
        const brandOption = option as BrandOption;
        return (
          <div className={baseClassName}>
            <span>{brandOption.label}</span>
            {brandOption.code && (
              <span className="text-gray-400 text-sm">({brandOption.code})</span>
            )}
          </div>
        );
      }
      
      case 'family':
      case 'subfamily':
      case 'subsubfamily': {
        const tagOption = option as TagOption;
        return (
          <div className={baseClassName}>
            <span>{tagOption.name}</span>
            <span className="text-gray-400 text-sm">({tagOption._id})</span>
          </div>
        );
      }
        
      case 'collection': {
        const collectionOption = option as CollectionOption;
        return (
          <div className={baseClassName}>
            <span>{collectionOption.label}</span>
            {collectionOption.code && (
              <span className="text-gray-400 text-sm">({collectionOption.code})</span>
            )}
          </div>
        );
      }

      default:
        return (
          <div className={baseClassName}>
            <span>{String(option.label || '')}</span>
          </div>
        );
    }
  }, [type]);

  return (
    <CreatableSelect<T, false, GroupBase<T>>
      value={value}
      onChange={onChange}
      onInputChange={onInputChange}
      onFocus={handleFocus}
      options={options}
      inputValue={inputValue}
      placeholder={placeholder}
      formatOptionLabel={formatOptionLabel}
      styles={customStyles}
      className={className}
      menuPortalTarget={document.body}
      menuPosition="fixed"
      menuShouldBlockScroll
      menuPlacement="auto"
      openMenuOnFocus={true}
      onMenuOpen={handleFocus}
      blurInputOnSelect={false}
      isSearchable
      isClearable
      isDisabled={isDisabled}
      noOptionsMessage={() => "Aucun résultat"}
      loadingMessage={() => "Chargement..."}
      components={{
        IndicatorSeparator: () => null
      }}
    />
  );
}

export default EnhancedSelect;