import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { setLogout } from "../../store/store";
import { LogOut } from "lucide-react";
import Divider from "@mui/material/Divider";


export default function Header({ titlePage }: { titlePage: string }) {
  const user = useSelector((state:any) => state.auth.user);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="py-8 flex items-center justify-between" id="top">
      <div>
        <h1 className="text-3xl font-bold text-gray-600">{titlePage}</h1>
      </div>
      <div className="flex items-center gap-2">
        <Button
          id="basic-button"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
        >
          <Avatar src="/img/user_img.png" alt="Non user" />
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
          className="mt-3"
        >
          <MenuItem onClick={handleClose} className="flex items-center gap-3">
            <Avatar src="/img/logo.png" alt="Lien portail fournisseur" />
            <span className="font-bold text-gray-700">
              Portail Fournisseurs
            </span>
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

        <div className="flex flex-col">
          <span className="text-[17px] font-bold text-gray-700">{user ? user.username : "philippe"}</span>
          <span className="text-[14px] text-gray-500">{user ? user.email : "cacaboom@hotmzil.fr"}</span>
        </div>
      </div>
    </div>
  );
}
