import React from "react";
import { Link } from "react-router-dom";
import { LINKS } from "../utils";
import { Tooltip } from "@mui/material";

export default function Sidebar() {
  return (
    <nav className="h-screen w-[70px] bg-white flex flex-col items-center gap-3">
      <div className="w-[40px] py-4">
        <Link to="/">
          <img src="img/logo.png" alt="" />
        </Link>
        <div className="w-full h-[1px] bg-gray-200 mt-5"></div>
      </div>
      <div className="flex flex-col gap-6">
        {LINKS.map((link, i) => (
          <ul key={i}>
            <Tooltip  title={link.name} placement="right-start">
              <Link to={link.link} className="text-gray-400">
                {React.createElement(link.icon, { size: 19 })}
              </Link>
            </Tooltip>
          </ul>
        ))}
      </div>
    </nav>
  );
}
