import React from "react";

type InputProps = {
  element: "input" | "textarea" | "select";
  id: string;
  type?: string;
  placeholder?: string;
  placeholderColor?: string;
  orange?: boolean;
  gray?: boolean;
  rows?: number;
  options?: { value: string; label: string; name: string }[];
  label?: string;
  onChange?: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >;
  onBlur?: React.FocusEventHandler<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >;
  value?: string | number;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
};

const Input: React.FC<InputProps> = (props) => {
  const InputClasses = `
    fw-full h-[50px] focus:outline-none ${
      props.orange ? "border-b-2 border-orange-400" : ""
    }
    ${props.gray ? "border-b-[1px] border-gray-300" : ""}
  `;

  const element =
    props.element === "input" ? (
      <input
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        onChange={props.onChange}
        onBlur={props.onBlur}
        value={props.value}
        onKeyDown={props.onKeyDown}
        className={InputClasses}
      />
    ) : props.element === "textarea" ? (
      <textarea
        id={props.id}
        rows={props.rows || 3}
        placeholder={props.placeholder}
        onChange={props.onChange}
        onBlur={props.onBlur}
        value={props.value}
      />
    ) : props.element === "select" ? (
      <select
        id={props.id}
        onChange={props.onChange}
        onBlur={props.onBlur}
        value={props.value}
        className="block text-sm py-2.5 px-0 w-full text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-gray-200 peer capitalize"
      >
        <option value="" disabled selected hidden>
          {props.placeholder}
        </option>
        {props.options?.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.name}
          </option>
        ))}
      </select>
    ) : null;

  return (
    <div className="flex flex-col mb-[20px]">
      <label htmlFor={props.id} className="text-[15px] font-bold text-gray-500">
        {props.label}
      </label>
      {element}
    </div>
  );
};

export default Input;
