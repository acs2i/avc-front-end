import React, { useReducer } from "react";
import { validate } from "../../utils/validator";
import PhoneInput from "react-phone-number-input"
import "react-phone-number-input/style.css";


type Validator = {
  type: string;
  val?: number | undefined;
};

type InputProps = {
  element: "input" | "textarea" | "select" | "phone";
  id: string;
  type?: string;
  placeholder?: string;
  placeholderColor?: string;
  orange?: boolean;
  create?: boolean;
  gray?: boolean;
  required?: boolean;
  disabled?: boolean;
  margin?: boolean;
  rows?: number;
  step?: string;
  options?: { value: string; label: string; name: string }[];
  maxLength?: number;
  label?: string;
  onChange?: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >;
  onClick?: any;
  onBlur?: React.FocusEventHandler<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >;
  value?: string | number;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  validators?: Validator[];
};

const inputReducer = (state: any, action: any) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.val,
        isValid: validate(action.val, action.validators),
      };
    case "TOUCH":
      return {
        ...state,
        isTouched: true,
      };
    default:
      return state;
  }
};

const Input: React.FC<InputProps> = (props) => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.value || "",
    isTouched: false,
    isValid: false,
  });

  const changeHandler = (event: any) => {
    // Appel du gestionnaire onChange fourni par le composant parent
    if (props.onChange) {
      props.onChange(event);
    }
    // Appel du gestionnaire de validation
    dispatch({
      type: "CHANGE",
      val: event.target.value,
      validators: props.validators,
    });
  };

  const phoneChangeHandler = (value: string | undefined) => {
    if (props.onChange) {
      props.onChange({
        target: { value: value || '', name: props.id }
      } as React.ChangeEvent<HTMLInputElement>);
    }
  
    dispatch({
      type: "CHANGE",
      val: value || '',
      validators: props.validators,
    });
  };
  

  const touchHandler = () => {
    dispatch({
      type: "TOUCH",
    });
  };

  const InputClasses = `
    w-full h-[40px] focus:outline-none mt-1 ${
      props.orange ? "border-b-2 border-orange-400" : ""
    }
    ${props.gray ? "border-b-[1px] border-gray-300 font-bold" : ""}
    ${props.create ? "border border-gray-300 rounded-lg px-2 focus:ring-blue-500 transition-all focus:border-[2px] focus:border-blue-500 focus:shadow-[0_0px_0px_5px_rgba(44,130,201,0.2)]" : ""}
    ${
      props.disabled
        ? " bg-gray-200 rounded-md border border-white text-gray-500 italic px-3 cursor-not-allowed"
        : ""
    }
    ${
      !inputState.isValid &&
      inputState.isTouched &&
      props.required &&
      "border-b-[1px] border-red-300"
    }
  `;

  const element =
    props.element === "input" ? (
      <input
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        onChange={changeHandler}
        onBlur={touchHandler}
        onClick={props.onClick}
        value={props.value}
        required={props.required}
        onKeyDown={props.onKeyDown}
        className={InputClasses}
        disabled={props.disabled}
        step={props.step}
        maxLength={props.maxLength}
        autoComplete="off"
      />
    ) : props.element === "textarea" ? (
      <textarea
        id={props.id}
        rows={props.rows || 3}
        placeholder={props.placeholder}
        onChange={props.onChange}
        onBlur={props.onBlur}
        value={props.value}
        maxLength={props.maxLength}
        className="border p-2 resize-none focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:shadow-[0_0px_0px_5px_rgba(44,130,201,0.2)] mt-1"
      />
    ) : props.element === "select" ? (
      <select
        id={props.id}
        onChange={props.onChange}
        onBlur={props.onBlur}
        required={props.required}
        value={props.value}
        className="bg-white border border-gray-300 text-gray-900 text-md rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:shadow-[0_0px_0px_5px_rgba(44,130,201,0.2)] block w-full p-2 mt-1 capitalize"
      >
        <option value="" selected hidden>
          {props.placeholder}
        </option>
        {props.options?.map((option, i) => (
          <option key={i} value={option.value}>
            {option.name}
          </option>
        ))}
      </select>
    ) : props.element === "phone" ? (
      <PhoneInput
        defaultCountry="FR"
        value={inputState.value}
        onChange={phoneChangeHandler}
        international
        withCountryCallingCode
        className="input-phone"
      />
    ) : null;

  return (
    <div className={`flex flex-col mt-3`}>
      <div>
        <label
          htmlFor={props.id}
          className="relative text-sm font-medium text-gray-800"
        >
          {props.label}
          {props.required && (
            <span className="absolute top-[-5px] right-[-10px] text-red-400">
              *
            </span>
          )}
        </label>
      </div>
      {element}
      {!inputState.isValid && inputState.isTouched && props.required && (
        <div className="mt-2 text-red-500 text-[12px]">
          Le champ ne doit pas être vide
        </div>
      )}
    </div>
  );
};

export default Input;
