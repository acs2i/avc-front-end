import React from "react";

type InputProps = {
  element: "input" | "textarea" | "select";
  id: string;
  type?: string;
  placeholder?: string;
  rows?: number;
  options?: { value: string; label: string }[];
  label?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;
  value?: string | number;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
};

const Input: React.FC<InputProps> = (props) => {
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
        className="w-full h-[50px] border-b-2 border-orange-400 focus:outline-none"
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
      >
        {props.options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    ) : null;

  return (
    <div className="flex flex-col mb-[20px]">
      <label htmlFor={props.id} className="text-[15px] font-bold text-gray-500">{props.label}</label>
      {element}
    </div>
  );
};

export default Input;
