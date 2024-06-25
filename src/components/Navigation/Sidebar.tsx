import React, { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import Collapse from "@mui/material/Collapse";
import { LINKS } from "../../utils/index";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { setLogout } from "../../store/authSlice";
import { useDispatch, useSelector } from "react-redux";

export default function Sidebar() {
  const user = useSelector((state: any) => state.auth.user);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [openSubCategory, setOpenSubCategory] = useState<string | null>(null);
  const open = Boolean(anchorEl);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleOpenCategory = (name: string) => {
    setOpenCategory((prev) => (prev === name ? null : name));
  };

  const handleOpenSubCategory = (name: string) => {
    setOpenSubCategory((prev) => (prev === name ? null : name));
  };

  return (
    <aside className="fixed h-screen w-[250px] bg-white flex flex-col gap-3 z-[300] border-r-[1px] border-gray-300 dark:bg-gray-600 dark:border-gray-600">
      <ul className="text-gray-600 flex flex-col gap-8 px-7 py-8 overflow-y-auto">
        {LINKS.map((categoryWrapper, categoryWrapperIndex) =>
          categoryWrapper.linkCategory.map((category, categoryIndex) => (
            <li
              key={categoryWrapperIndex + "-" + categoryIndex}
              className="cursor-pointer"
            >
              <h2 className="font-bold text-gray-500 dark:text-white uppercase">
                {category.name}
              </h2>
              <ul className="flex flex-col mt-6">
                {category.linksGroup.map((link, i) => (
                  <li key={i} className="cursor-pointer dark:text-white">
                    {link.link ? (
                      <RouterLink
                        to={link.link}
                        className="flex items-center gap-2 hover:bg-gray-200 p-2 rounded-md ml-5"
                      >
                        {React.createElement(link.icon, { size: 17 })}
                        <div>
                          <h3>{link.name}</h3>
                        </div>
                      </RouterLink>
                    ) : (
                      <div
                        className="flex items-center gap-2 hover:bg-gray-200 p-2 rounded-md dark:text-white"
                        onClick={() => handleOpenCategory(link.name)}
                      >
                        {openCategory != link.name ? (
                          <ChevronRight
                            size={13}
                            className={
                              (link.group && link.group.length > 0) ||
                              (link.linksGroup && link.linksGroup.length > 0)
                                ? "visible"
                                : "invisible"
                            }
                          />
                        ) : (
                          <ChevronDown
                            size={13}
                            className={
                              (link.group && link.group.length > 0) ||
                              (link.linksGroup && link.linksGroup.length > 0)
                                ? "visible"
                                : "invisible"
                            }
                          />
                        )}
                        {React.createElement(link.icon, { size: 17 })}
                        <div>
                          <h3>{link.name}</h3>
                        </div>
                      </div>
                    )}
                    <Collapse in={openCategory === link.name}>
                      {link.group ? (
                        <ul className="flex flex-col">
                          {link.group.map((item, groupIndex) => (
                            <li key={groupIndex}>
                              <div
                                className="ml-10 flex items-center gap-1  hover:bg-gray-200 p-2 rounded-md dark:text-white"
                                onClick={() => handleOpenSubCategory(item.name)}
                              >
                                {openSubCategory != item.name ? (
                                  <ChevronRight size={13} />
                                ) : (
                                  <ChevronDown size={13} />
                                )}
                                <h4 className="text-[11px] dark:text-white">{item.name}</h4>
                              </div>
                              <Collapse in={openSubCategory === item.name}>
                                <ul className="ml-[65px]">
                                  {item.linksGroup.map((subLink, linkIndex) => (
                                    <li key={linkIndex}>
                                      <RouterLink
                                        to={subLink.link}
                                        className="flex text-gray-600 p-2 hover:bg-zinc-100 rounded-md"
                                      >
                                        {subLink.name}
                                      </RouterLink>
                                    </li>
                                  ))}
                                </ul>
                              </Collapse>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <ul className="ml-[50px]">
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
                  </li>
                ))}
              </ul>
            </li>
          ))
        )}
      </ul>
      <p className="text-center">Version 1.0</p>
    </aside>
  );
}
