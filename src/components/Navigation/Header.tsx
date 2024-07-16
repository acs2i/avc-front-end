import React from "react";
import Button from "../FormElements/Button";

interface headerProps {
  light?: string;
  title?: string;
  link: string;
  btnTitle: string;
  placeholder: string;
  children?: any;
  button?: boolean;
  height: any;
}

export default function Header({
  light,
  title,
  children,
  link,
  btnTitle,
  placeholder,
  button,
  height
}: headerProps) {
  return (
    <div className="w-full bg-slate-100 p-4 relative overflow-hidden" style={{ height: height || 'auto' }}>
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${"/img/background_forest.jpg"})`,
          opacity: 0.05,
          filter: "grayscale(10%)",
          backgroundPosition: "center bottom -50px",
        }}
      ></div>
      <div className="p-8 relative z-10">
        <h3 className="text-[35px] font-[800] text-gray-800">{title} <span className="font-[600]">{light}</span></h3>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="relative w-[400px]">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 cursor-pointer">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="search"
                id="default-search"
                className="block w-full px-[10px] py-[8px] ps-10 text-sm text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:border-[2px] focus:border-blue-500 focus:shadow-[0_0px_0px_5px_rgba(44,130,201,0.2)]"
                placeholder={placeholder}
                required
              />
            </div>
            {button && <Button size="small" blue to={link}>
              {btnTitle}
            </Button>}
          </div>
          <div className="relative">{children}</div>
        </div>
      </div>
    </div>
  );
}
