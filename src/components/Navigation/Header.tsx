import React from "react";
import Button from "../FormElements/Button";

interface headerProps {
  title: string;
  link: string;
  btnTitle: string;
  placeholder: string;
  children: any;
}

export default function Header({ title, children, link,   btnTitle, placeholder }: headerProps) {
  return (
    <div className="w-full h-[300px] bg-gray-100 p-8 border border-b-gray-300">
      <h3 className="text-[35px] font-bold text-gray-800">{title}</h3>
      <div className="flex flex-col gap-4">
        <div className=" flex items-center gap-4">
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
              className="block w-full px-[10px] py-[8px] ps-10 text-sm text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder={placeholder}
              required
            />
          </div>
          <Button size="small" blue to={link}>{btnTitle}</Button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
