import React from "react";
import { Link } from "react-router-dom";

interface ButtonProps {
  href?: string;
  to?: string;
  exact?: boolean;
  size?: "xs" | "small" | "medium" | "big";
  inverse?: boolean;
  inverseBlue?: boolean;
  danger?: boolean;
  green?: boolean;
  blue?: boolean;
  gray?: boolean;
  cancel?: boolean;
  warning?: boolean;
  orange?: boolean;
  dark?: boolean;
  gradient?: boolean;
  type?: "button" | "submit" | "reset" | undefined;
  onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
  disabled?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = (props) => {
  const buttonClasses = `
    font-inherit text-center py-4 px-6 rounded-md flex items-center justify-center gap-2 transition-all
    ${props.size === "small" ? "text-xs py-[8px] px-[10px]" : ""}
    ${props.size === "medium" ? "text-md py-[10px] px-[25px]" : ""}
    ${props.size === "xs" ? "text-xs py-[5px] px-[5px]" : ""}
    ${props.size === "big" ? "text-lg flex items-center justify-center gap-2.5 w-full" : ""}
    ${props.orange ? "bg-gradient-to-r from-orange-600 to-orange-400 border border-orange-500 text-white hover:brightness-125" : ""}
    ${props.green ? "bg-green-400 border border-emerald-500 text-white hover:brightness-125" : ""}
    ${props.blue ? "bg-[#3B71CA] border border-sky-600 text-white hover:brightness-125 font-bold" : ""}
    ${props.inverseBlue ? "bg-transparent border border-sky-600 text-gray-700 font-bold hover:bg-sky-700 hover:text-white" : ""}
    ${props.inverse ? "bg-transparent border border-emerald-500 text-gray-700 hover:brightness-125" : ""}
    ${props.cancel ? "border border-gray-300 text-white bg-[#9FA6B2] hover:bg-[#bac3d4] hover:text-white font-bold" : ""}
    ${props.warning ? "bg-yellow-500 text-white hover:bg-yellow-400" : ""}
    ${props.danger ? "bg-[#DC4C64] border border-red-500 text-white hover:brightness-125" : ""}
    ${props.gray ? "bg-[#3B3B3C] border border-black text-white hover:brightness-125" : ""}
    ${props.disabled ? "bg-gray-500 border border-gray-500 text-gray-400 cursor-not-allowed" : ""}

  `;

  if (props.href) {
    return (
      <a
        className={buttonClasses}
        type={props.type}
        onClick={props.onClick}
        href={props.href}
      >
        {props.children}
      </a>
    );
  }

  if (props.to) {
    return (
      <Link
        to={props.to}
        className={buttonClasses}
      >
        {props.children}
      </Link>
    );
  }

  return (
    <button
      className={buttonClasses}
      type={props.type}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
};

export default Button;