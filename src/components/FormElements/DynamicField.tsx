import React from "react";
import Input from "../../components/FormElements/Input";

interface DynamicFieldProps {
  fieldType: string;
  value: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  id: string;
  name?: string;
  options?: string[];
}

const DynamicField: React.FC<DynamicFieldProps> = ({ fieldType, value, onChange, id, name, options }) => {
  switch (fieldType) {
    case "text":
      return (
        <Input
          element="input"
          type="text"
          id={id}
          value={value}
          onChange={onChange}
          validators={[]}
          placeholder="Saisir une valeur"
          create
          gray
        />
      );
    case "number":
      return (
        <Input
          element="input"
          type="number"
          id={id}
          value={value}
          onChange={onChange}
          validators={[]}
          placeholder="Saisir un nombre"
          create
          gray
        />
      );
    case "textarea":
      return (
        <Input
          element="textarea"
          id={id}
          value={value}
          onChange={onChange}
          validators={[]}
          placeholder="Saisir un texte"
          create
          gray
        />
      );
    case "multiple_choice":
    case "boolean":
      return (
        <div className="flex gap-5">
          {options &&
            options.map((option, index) => (
              <label key={index} className="inline-flex items-center">
                <input
                  type="radio"
                  name={name}
                  value={option}
                  checked={value === option}
                  onChange={onChange}
                  className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-1 text-gray-700 capitalize text-sm">{option}</span>
              </label>
            ))}
        </div>
      );
    case "date":
      return (
        <Input
          element="input"
          type="date"
          id={id}
          value={value}
          onChange={onChange}
          validators={[]}
          placeholder="Choisir une date"
          create
          gray
        />
      );
    default:
      return null;
  }
};

export default DynamicField;
