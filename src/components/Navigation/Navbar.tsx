import React, { useState } from "react";
import { Bell, Grip, Sun, Moon } from "lucide-react";
import { Avatar } from "@mui/material";
import { Link } from "react-router-dom";
import { setLogout } from "../../store/authSlice";
import { useDispatch, useSelector } from "react-redux";
import AccountMenu from "./AccountMenu";
import Drawer from "../Shared/Drawer";
import { useTheme } from "../../store/ThemeContext";

export default function Navbar() {
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);
  const { darkMode, toggleDarkMode } = useTheme();
  return (
    <>
      <Drawer show={drawerIsOpen} onCancel={() => setDrawerIsOpen(false)}>
        <div className="w-full flex items-center justify-center py-4">
          <div className="flex items-center gap-2">
            <Bell size={20} />
            <h4 className="text-center text-[25px]">
              <span className="font-[800]">Mes </span>notifications
            </h4>
          </div>
        </div>
      </Drawer>
      <nav className="w-full h-[60px] bg-white dark:bg-gray-800 border-b-[1px] border-gray-300 dark:border-gray-500 px-6 fixed top-0 left-0 z-[400000]">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-3">
            <div className="w-[40px] h-[30px]">
              <img src="/img/logo.png" alt="" className="w-full h-full" />
            </div>
            <Link to="/" className="text-2xl text-gray-600 dark:text-white font-nunito">
              Pré-référencement
            </Link>
          </div>
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
              className="block w-full px-[10px] py-[5px] ps-10 text-sm text-gray-900 border border-gray-300 rounded-2xl focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search..."
              required
            />
          </div>
          <div className="flex items-center gap-3 dark:text-white text-gray-600">
            <div
              className={`w-[30px] h-[30px] flex items-center justify-center rounded-full cursor-pointer ${
                darkMode
                  ? "bg-gray-800 text-yellow-300"
                  : "bg-orange-100 text-orange-400"
              }`}
              onClick={toggleDarkMode}
            >
              {darkMode ? <Moon size={20} /> : <Sun size={20} />}
            </div>
            <div
              onClick={() => setDrawerIsOpen(true)}
              className="cursor-pointer hover:animate-bounce"
            >
              <Bell size={20} />
            </div>
            <Grip size={20} />
            <AccountMenu />
          </div>
        </div>
      </nav>
    </>
  );
}
