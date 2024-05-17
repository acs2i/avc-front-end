import { ChevronLeft, Download, GripHorizontal, Plus } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import Menu from "@mui/material/Menu";
import React, { useState } from "react";
import { MenuItem } from "@mui/material";

type InFosCard = {
  title: any;
  children: React.ReactNode;
  createTitle: string;
  link: string;
};

export default function Card({ title, children, createTitle, link }: InFosCard) {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const shouldHideBackButton = location.pathname === "/";
  const pathsToHideDots = ["/parameters", "/edit"];
  const shouldHideDots = pathsToHideDots.includes(location.pathname);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <section className="bg-white shadow-md rounded-lg flex flex-col gap-1 rounded-md">
      <div className="bg-[#2A7B33] py-3 px-5 rounded-t-md flex items-center justify-between">
        <div className="flex items-center gap-4">
          {!shouldHideBackButton && (
            <div
              className="text-white h-[30px] w-[30px] flex items-center justify-center cursor-pointer"
              onClick={() => navigate(-1)}
            >
              <ChevronLeft />
            </div>
          )}
          <h2 className="text-white font-bold text-lg">{title}</h2>
        </div>
        {!shouldHideDots && (
          <>
            <Button
              id="basic-button"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
            >
              <div className="text-white cursor-pointer hover:text-gray-300">
                <GripHorizontal />
              </div>
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
              <MenuItem onClick={handleClose}>
                <Link to={link}>
                  <div className="flex items-center gap-3 w-full">
                    <div className="text-orange-500">
                      <Plus />
                    </div>
                    <p className="text-sm">{createTitle}</p>
                  </div>
                </Link>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <div className="flex items-center gap-3 w-full">
                  <div className="text-orange-500">
                    <Download />
                  </div>
                  <p className="text-sm">Exporter en CSV</p>
                </div>
              </MenuItem>
            </Menu>
          </>
        )}
      </div>
      <div className="py-2">{children}</div>
    </section>
  );
}
