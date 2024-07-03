import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import Collapse from "@mui/material/Collapse";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { LINKS } from "../../utils/index";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { setLogout } from "../../store/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { Hidden } from "@mui/material";

export default function Sidebar() {
  const user = useSelector((state: any) => state.auth.user);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [openSubCategory, setOpenSubCategory] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleOpenCategory = (name: string) => {
    setOpenCategory((prev) => (prev === name ? null : name));
  };

  const handleOpenSubCategory = (name: string) => {
    setOpenSubCategory((prev) => (prev === name ? null : name));
  };

  const handleMobileOpen = (name: string) => {
    setMobileOpen((prev) => (prev === name ? null : name));
  };

  const handleMenuOpen = (event: any, name: any) => {
    setAnchorEl(event.currentTarget);
    setOpenMenu(name);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setOpenMenu(null);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        handleMenuClose();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <aside className="fixed h-screen bg-white flex flex-col items-center gap-1 z-[300] border-r-[1px] border-gray-300 dark:bg-gray-600 dark:border-gray-600 w-16 sm:w-20 md:w-40 lg:w-64 transition-width duration-300">
      <ul className="text-gray-600 flex flex-col gap-2 px-2 py-4 overflow-y-auto">
        {LINKS.map((categoryWrapper, categoryWrapperIndex) =>
          categoryWrapper.linkCategory.map((category, categoryIndex) => (
            <li
              key={categoryWrapperIndex + "-" + categoryIndex}
              className="cursor-pointer"
            >
              <h2 className="font-bold text-gray-500 dark:text-white uppercase hidden md:block">
                {category.name}
              </h2>
              <ul className="flex flex-col mt-2 md:mt-6">
                {category.linksGroup.map((link, i) => (
                  <li key={i} className="cursor-pointer dark:text-white">
                    {link.link ? (
                      <RouterLink
                        to={link.link}
                        className="flex items-center justify-center md:justify-start gap-1 hover:bg-gray-200 p-2 rounded-md"
                      >
                        {React.createElement(link.icon, { size: 17 })}
                        <div className="hidden md:block">
                          <h3>{link.name}</h3>
                        </div>
                      </RouterLink>
                    ) : (
                      <>
                        <div
                          className="relative flex items-center justify-center md:justify-start gap-1 hover:bg-gray-200 p-2 rounded-md dark:text-white"
                          onClick={(e) => {
                            if (window.innerWidth < 768) {
                              handleMenuOpen(e, link.name);
                            } else {
                              handleOpenCategory(link.name);
                            }
                          }}
                        >
                          <div className="absolute left-[-10px]">
                            {openCategory !== link.name ? (
                              <ChevronRight
                                size={13}
                                className={
                                  (link.group && link.group.length > 0) ||
                                  (link.linksGroup &&
                                    link.linksGroup.length > 0)
                                    ? "visible hidden md:block"
                                    : "invisible"
                                }
                              />
                            ) : (
                              <ChevronDown
                                size={13}
                                className={
                                  (link.group && link.group.length > 0) ||
                                  (link.linksGroup &&
                                    link.linksGroup.length > 0)
                                    ? "visible hidden md:block"
                                    : "invisible"
                                }
                              />
                            )}
                          </div>
                          {React.createElement(link.icon, { size: 17 })}
                          <div className="hidden md:block">
                            <h3>{link.name}</h3>
                          </div>
                        </div>
                        {window.innerWidth < 768 ? (
                          <Menu
                            anchorEl={anchorEl}
                            open={openMenu === link.name}
                            onClose={handleMenuClose}
                            anchorOrigin={{
                              vertical: "top",
                              horizontal: "right",
                            }}
                          >
                            {link.group
                              ? link.group.map((item, groupIndex) => (
                                  <MenuItem
                                    key={groupIndex}
                                    onClick={handleMenuClose}
                                  >
                                    <RouterLink to={item.linksGroup[0].link}>
                                      {item.name}
                                    </RouterLink>
                                  </MenuItem>
                                ))
                              : link.linksGroup &&
                                link.linksGroup.map((subLink, linkIndex) => (
                                  <MenuItem
                                    key={linkIndex}
                                    onClick={handleMenuClose}
                                  >
                                    <RouterLink to={subLink.link}>
                                      {subLink.name}
                                    </RouterLink>
                                  </MenuItem>
                                ))}
                          </Menu>
                        ) : (
                          <Collapse
                            in={openCategory === link.name}
                            className="md:block"
                          >
                            {link.group ? (
                              <ul className="flex flex-col">
                                {link.group.map((item, groupIndex) => (
                                  <li key={groupIndex}>
                                    <div
                                      className="ml-4 md:ml-5 flex items-center gap-1 hover:bg-gray-200 p-2 rounded-md dark:text-white"
                                      onClick={() =>
                                        handleOpenSubCategory(item.name)
                                      }
                                    >
                                      {openSubCategory !== item.name ? (
                                        <ChevronRight size={13} />
                                      ) : (
                                        <ChevronDown size={13} />
                                      )}
                                      <h4 className="text-[11px] dark:text-white">
                                        {item.name}
                                      </h4>
                                    </div>
                                    <Collapse
                                      in={openSubCategory === item.name}
                                      className="md:block"
                                    >
                                      <ul className="ml-8 md:ml-[65px]">
                                        {item.linksGroup.map(
                                          (subLink, linkIndex) => (
                                            <li key={linkIndex}>
                                              <RouterLink
                                                to={subLink.link}
                                                className="flex text-gray-600 p-2 hover:bg-zinc-100 rounded-md"
                                              >
                                                {subLink.name}
                                              </RouterLink>
                                            </li>
                                          )
                                        )}
                                      </ul>
                                    </Collapse>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <ul className="ml-4 md:ml-[30px]">
                                {link.linksGroup &&
                                  link.linksGroup.map((subLink, linkIndex) => (
                                    <li key={linkIndex}>
                                      <RouterLink
                                        to={subLink.link}
                                        className="flex text-gray-600 p-2 hover:bg-gray-200 rounded-md dark:text-white"
                                      >
                                        {subLink.name}
                                      </RouterLink>
                                    </li>
                                  ))}
                              </ul>
                            )}
                          </Collapse>
                        )}
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </li>
          ))
        )}
      </ul>
      <p className="text-center">Version 1.0.5</p>
    </aside>
  );
}
