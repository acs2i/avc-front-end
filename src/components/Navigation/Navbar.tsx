import React, { useEffect, useState } from "react";
import { Bell, Grip, Sun, Moon } from "lucide-react";
import { Avatar } from "@mui/material";
import { Link } from "react-router-dom";
import { setLogout } from "../../store/authSlice";
import { useDispatch, useSelector } from "react-redux";
import AccountMenu from "./AccountMenu";
import Drawer from "../Shared/Drawer";
import { useTheme } from "../../store/ThemeContext";

interface Notification {
  message: string;
  date: Date;
  read: boolean;
}

export default function Navbar() {
  const userId = useSelector((state: any) => state?.auth?.user?._id);
  const token = useSelector((state: any) => state.auth.token);
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);
  const [environnment, setEnvironnment] = useState(process.env.REACT_APP_STATUS_ENVIRONNEMENT || "TEST");
  console.log(process.env.REACT_APP_STATUS_ENVIRONNEMENT)
  const { darkMode, toggleDarkMode } = useTheme();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/auth/${userId}/notifications`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    }
  };

  const markNotificationsAsRead = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/auth/${userId}/notifications?markAsRead=true`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      } else {
        console.error("Erreur lors de la mise à jour des notifications");
      }
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (drawerIsOpen) {
      markNotificationsAsRead();
    }
  }, [drawerIsOpen]);

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

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
        <div className="p-2">
          {notifications.length > 0 ? (
            <ul className="bg-blue-100 p-3 rounded-md shadow-md">
              {notifications.map((notification, index) => (
                <li key={index} className="text-[15px] flex flex-col">
                  <span>{notification.message}</span>
                  <span className="text-[9px] italic text-gray-700">
                    {new Date(notification.date).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p>Aucune notification disponible.</p>
          )}
        </div>
      </Drawer>
      <nav className="w-full h-[60px] bg-white dark:bg-gray-800 border-b-[1px] border-gray-300 dark:border-gray-500 px-6 fixed top-0 left-0 z-[400]">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-3">
            <div className="w-[40px] h-[30px]">
              <img src="/img/logo.png" alt="" className="w-full h-full" />
            </div>
            <Link
              to="/"
              className="text-sm md:text-2xl text-gray-600 dark:text-white font-nunito"
            >
              Pré-référencement
            </Link>
          </div>
          <div className="relative w-[300px] md:w-[400px]">
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
          <span className="bg-gray-800 text-orange-300 rounded text-[24px]">{environnment}</span>
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
              className="relative cursor-pointer"
            >
              {unreadNotificationsCount > 0 && (
                <div className="absolute h-[15px] w-[15px] bg-red-600 right-[-5px] top-[-5px] rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">
                    {unreadNotificationsCount}
                  </span>
                </div>
              )}
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
