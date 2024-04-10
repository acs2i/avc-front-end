import React, { useReducer } from "react";
import { validate } from "../../utils/validator";

type Validator = {
  type: string;
  val?: number | undefined;
};

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

  const touchHandler = () => {
    dispatch({
      type: "TOUCH",
    });
  };

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
        onChange={changeHandler}
        onBlur={touchHandler}
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
        className="block text-sm py-2.5 w-full text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-gray-200 peer capitalize"
      >
        <option value="" selected>
          {props.placeholder}
        </option>
        {props.options?.map((option, i) => (
          <option key={i} value={option.value} className="px-4 py-2">
            {option.name}
          </option>
        ))}
      </select>
    ) : null;

  return (
    <div className={`flex flex-col mb-[20px]`}>
      <label htmlFor={props.id} className="text-[15px] font-bold text-gray-500">
        {props.label}
      </label>
      {element}
      {!inputState.isValid && inputState.isTouched && (
        <div className="mt-3 text-red-500 rounded-md">Veuillez remplir ce champ</div>
      )}
    </div>
  );
};

export default Input;
