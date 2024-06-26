import * as React from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import { useDispatch, useSelector } from "react-redux";
import { setLogout } from "../../store/authSlice";
import {
  Activity,
  LogOut,
  PieChart,
  Settings,
  User,
  UserPlus,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Switch } from "@mui/material";

export default function AccountMenu() {
  const user = useSelector((state: any) => state.auth.user);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const label = { inputProps: { "aria-label": "Switch demo" } };

  if (!user) {
    return null; 
  }
 
  return (
    <React.Fragment>
      <Tooltip title="Account settings">
        <IconButton
          onClick={handleClick}
          size="small"
          aria-controls={open ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <Avatar alt={user?.username || "test"} src={user?.imgPath || ""} />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem
          sx={{
            "&:hover": {
              backgroundColor: "transparent",
            },
          }}
        >
          <div className="flex flex-col">
            <div className="flex flex-col items-center justify-center mb-4">
              <div className="flex justify-center">
                <Avatar
                  alt={user?.username || "test"}
                  src={user?.imgPath || ""}
                  sx={{ width: 40, height: 40 }}
                />
              </div>
              <span className="text-sm font-bold text-gray-600">
                {user?.username || "test"}
              </span>
              <div>
                <Switch {...label} defaultChecked />
              </div>
            </div>
            <Divider />
            <div className="w-[300px] mt-4 mb-4">
              <ul className="flex flex-col gap-3">
                <Link className="hover:bg-gray-100 py-2" to={`/user/profile/${user._id}`}>
                  <div className="flex items-center gap-2" >
                    <User size={18} />
                    <span className="text-[13px]">Mon profile</span>
                  </div>
                </Link>
                <li className="hover:bg-gray-100 py-2">
                  <div className="flex items-center gap-2">
                    <PieChart size={18} />
                    <span className="text-[13px]">Mon tableau de bord</span>
                  </div>
                </li>
                <li className="hover:bg-gray-100 py-2">
                  <div className="flex items-center gap-2">
                    <Activity size={18} />
                    <span className="text-[13px]">Mon activité</span>
                  </div>
                </li>
                <li className="hover:bg-gray-100 py-2">
                  <div className="flex items-center gap-2">
                    <Settings size={18} />
                    <span className="text-[13px]">Paramètres</span>
                  </div>
                </li>
              </ul>
            </div>
            <Divider />
            <div className="py-4">
              <div className="flex items-center gap-2">
                <UserPlus size={18} />
                <span className="text-[13px]">Ajouter un utilisateur</span>
              </div>
            </div>
            <Divider />
            <div className="py-4">
              <button
                className="w-full bg-gray-100 py-2 rounded-md border border-gray-300 text-sm flex items-center justify-center gap-2 hover:brightness-75"
                onClick={() => {
                  dispatch(setLogout());
                  navigate("/login");
                }}
              >
                <LogOut size={18} />
                Deconnexion
              </button>
            </div>
          </div>
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
