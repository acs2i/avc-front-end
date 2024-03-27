import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LINKS } from "../utils";
import { Tooltip } from "@mui/material";

export default function Sidebar() {
  const location = useLocation();
  return (
    <nav className="h-screen w-[70px] bg-white flex flex-col items-center gap-3">
      <div className="w-[40px] py-4">
        <Link to="/">
          <img src="img/logo.png" alt="" />
        </Link>
        <div className="w-full h-[1px] bg-gray-200 mt-5"></div>
      </div>
      <ul className="flex flex-col gap-6">
      {LINKS.map((link, i) => (
        <Tooltip key={i} title={link.name} placement="right-start">
          <Link
            to={link.link}
            className={`text-gray-400 ${
              location.pathname === link.link ? "text-orange-400" : ""
            } ${location.pathname !== link.link ? "hover:text-orange-300" : ""}`}
          >
            {React.createElement(link.icon, { size: 19 })}
          </Link>
        </Tooltip>
      ))}
      </ul>
    </nav>
  );
}
