import React from "react";
import { Link } from "react-router-dom";

interface ButtonProps {
  href?: string;
  to?: string;
  exact?: boolean;
  size?: "default" | "small" | "medium" | "big";
  inverse?: boolean;
  danger?: boolean;
  green?: boolean;
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
    font-inherit text-center py-4 px-6 rounded-lg font-bold flex items-center gap-2
    ${props.size === "small" ? "text-sm py-[8px] px-[15px]" : ""}
    ${props.size === "medium" ? "text-md py-[15px] px-[20px]" : ""}
    ${props.size === "big" ? "text-lg flex items-center justify-center gap-2.5 w-full" : ""}
    ${props.orange ? "bg-gradient-to-r from-orange-600 to-orange-400 border border-orange-500 text-white hover:brightness-125" : ""}
    ${props.green ? "bg-gradient-to-r from-emerald-800 to-emerald-700 border border-emerald-500 text-white hover:brightness-125" : ""}
    ${props.warning ? "bg-yellow-500 text-white hover:bg-yellow-400" : ""}
    ${props.danger ? "bg-gradient-to-r from-red-700 to-red-600 border border-red-500 text-white hover:brightness-125" : ""}

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