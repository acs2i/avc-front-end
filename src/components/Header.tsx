import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { LogOut } from "lucide-react";
import { Tooltip } from "@mui/material";

export default function Header({ titlePage }: { titlePage: string }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="py-8 flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-600">{titlePage}</h1>
      </div>
      <div className="flex items-center gap-2">

        <div className="cursor-pointer hover:brightness-125">
          <Tooltip title="Portail fournisseurs">
            <Avatar src="img/logo.png" alt="Lien portail fournisseur" />
          </Tooltip>
        </div>

        <Button
          id="basic-button"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
        >
          <Avatar src="img/user_img.png" alt="Non user" />
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
            <LogOut className="text-red-500" />
            <span className="font-bold text-gray-700">Déconnexion</span>
          </MenuItem>
        </Menu>

        <div className="flex flex-col">
          <span className="text-[17px] font-bold text-gray-700">Philippe</span>
          <span className="text-[14px] text-gray-500">Email</span>
        </div>
      </div>
    </div>
  );
}
