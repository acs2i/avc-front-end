import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LINKS } from "../../utils";
import {
  Divider,
  Tooltip,
  Avatar,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import { setLogout } from "../../store/authSlice";
import { LogOut } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

export default function Sidebar() {
  const user = useSelector((state: any) => state.auth.user);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const visibleLinks = LINKS.filter((link) => link.showInSidebar);
  const bottomLinks = LINKS.filter((link) => link.showInBottom);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <nav className="fixed h-screen w-[70px] bg-white flex flex-col items-center justify-between gap-3 z-[300]">
      <div>
        <div className="w-[40px] py-4">
          <Link to="/">
            <img src="/img/logo.png" alt="" />
          </Link>
          <div className="w-full h-[1px] bg-gray-200 mt-5"></div>
        </div>
        <ul className="flex flex-col items-center gap-6">
          {visibleLinks.map((link, i) => (
            <Tooltip key={i} title={link.name} placement="right-start">
              <Link
                to={link.link}
                className={`text-gray-600 ${
                  new RegExp(`^${link.link}(/.*)?$`).test(location.pathname)
                    ? "text-orange-400"
                    : ""
                } ${
                  !new RegExp(`^${link.link}(/.*)?$`).test(location.pathname)
                    ? "hover:text-orange-300"
                    : ""
                }`}
              >
                {React.createElement(link.icon, {
                    size: new RegExp(`^${link.link}(/.*)?$`).test(
                      location.pathname
                    )
                      ? 25
                      : 19,
                    strokeWidth: new RegExp(`^${link.link}(/.*)?$`).test(
                      location.pathname
                    )
                      ? 2
                      : 1,
                  })}
              </Link>
            </Tooltip>
          ))}
        </ul>
        <div className="w-[40px]">
          <div className="w-full h-[1px] bg-gray-200 mt-6"></div>
        </div>
        <div>
          <ul className="flex flex-col items-center gap-6 mt-6">
            {bottomLinks.map((link, i) => (
              <Tooltip key={i} title={link.name} placement="right-start">
                <Link
                  to={link.link}
                  className={`text-gray-600 ${
                    new RegExp(`^${link.link}(/.*)?$`).test(location.pathname)
                      ? "text-orange-400"
                      : ""
                  } ${
                    !new RegExp(`^${link.link}(/.*)?$`).test(location.pathname)
                      ? "hover:text-orange-300"
                      : ""
                  }`}
                >
                  {React.createElement(link.icon, {
                    size: new RegExp(`^${link.link}(/.*)?$`).test(
                      location.pathname
                    )
                      ? 25
                      : 19,
                    strokeWidth: new RegExp(`^${link.link}(/.*)?$`).test(
                      location.pathname
                    )
                      ? 2
                      : 1,
                  })}
                </Link>
              </Tooltip>
            ))}
          </ul>
        </div>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Button
          id="basic-button"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
        >
          <Avatar
            src="/img/avatar_1.png"
            alt="avatar utilisateur"
            sx={{ width: 56, height: 56 }}
          />
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
          sx={{
            mt: 2,
            ml: 7,
          }}
        >
          <MenuItem onClick={handleClose} className="flex flex-col">
            <div className="mb-3 text-center p-4">
              <p className="text-xl font-bold capitalize text-gray-700">
                {user ? user.username : "test"}
              </p>
              <p className="text-xs font-bold text-gray-500">
                {user ? user.email : "test"}
              </p>
            </div>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleClose}>
            <div
              className="flex items-center justify-center gap-3 w-full"
              onClick={() => {
                dispatch(setLogout());
                navigate("/login");
              }}
            >
              <LogOut className="text-red-500" />
              <span className="font-bold text-gray-700">Déconnexion</span>
            </div>
          </MenuItem>
        </Menu>
      </div>
    </nav>
  );
}
