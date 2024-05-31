import React from "react";
import { Bell, Grip, Sun } from "lucide-react";
import { Avatar } from "@mui/material";
import { Link } from "react-router-dom";
import { setLogout } from "../../store/authSlice";
import { useDispatch, useSelector } from "react-redux";

export default function Navbar() {
  const user = useSelector((state: any) => state.auth.user);
  return (
    <nav className="w-full h-[60px] bg-white border-b-[1px] border-gray-300 px-6 fixed top-0 left-0 z-[400]">
      <div className="flex items-center justify-between h-full">
        <div className="flex items-center gap-3">
          <div className="w-[40px] h-[30px]">
            <img src="/img/logo.png" alt="" className="w-full h-full" />
          </div>
          <Link to="/" className="text-2xl text-gray-600">
            Au Vieux Campeur preref
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
        <div className="flex items-center gap-3 text-gray-600">
          <div className="w-[30px] h-[30px] flex items-center justify-center rounded-full bg-orange-100 text-orange-400">
            <Sun size={20} />
          </div>
          <Bell size={20} />
          <Grip size={20} />
          <Avatar alt={user.username} src="img/avatar.jpg" />
        </div>
      </div>
    </nav>
  );
}
