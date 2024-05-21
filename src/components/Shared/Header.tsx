import React, { useState } from "react";
import { Bell, Heart, MessageSquare, MessageSquareReply } from "lucide-react";
import SideDrawer from "./Drawer";
import Backdrop from "./Backdrop";
import { MESSAGES, NOTIF } from "../../utils/index";

export default function Header({ titlePage }: { titlePage: string }) {
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);
  const [drawerContent, setDrawerContent] = useState<
    "messages" | "notifications"
  >("messages");

  const openDrawer = (content: "messages" | "notifications") => {
    setDrawerContent(content);
    setDrawerIsOpen(true);
  };

  const closeDrawer = () => {
    setDrawerIsOpen(false);
  };

  return (
    <>
      <SideDrawer
        show={drawerIsOpen}
        onCancel={() => setDrawerIsOpen(false)}
        onClose={() => setDrawerIsOpen(false)}
      >
        {drawerContent === "messages" ? (
          <div className="py-5 px-3">
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="text-gray-400">
                  <MessageSquare />
                </div>
                <h4 className="text-2xl">
                  <span className="font-bold">Mes</span> messages
                </h4>
              </div>
              <div className="w-full flex flex-col gap-6 mt-5">
                {MESSAGES.map((message) => (
                  <div className="w-full bg-indigo-100 hover:bg-orange-100 p-2 rounded-md shadow-md hover:scale-110 transition-all">
                    <div className="flex flex-col">
                      <h5 className="font-bold text-gray-700">
                        {message.user}
                      </h5>
                      <p className="text-sm text-gray-600">{message.message}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div>
                        <span className="text-xs italic text-gray-600">{message.date}</span>
                      </div>
                      <div className="mt-2 flex items-center gap-2 text-gray-500">
                        <div>
                          <MessageSquareReply size={20} />
                        </div>
                        <div>
                          <Heart size={20} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="py-5 px-3">
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="text-gray-400">
                  <Bell />
                </div>
                <h4 className="text-2xl">
                  <span className="font-bold">Mes</span> notifications
                </h4>
              </div>
              <div className="w-full flex flex-col gap-6 mt-5">
                {NOTIF.map((notif) => (
                  <div className="w-full bg-indigo-100 hover:bg-orange-100 p-3 rounded-md shadow-md hover:scale-110 transition-all">
                    <div className="flex flex-col">
                      <h5 className="font-bold text-gray-700">{notif.user}</h5>
                      <p className="text-sm text-gray-600">{notif.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </SideDrawer>
      <div className="py-8 flex items-center justify-between" id="top">
        <div>
          <h1 className="text-3xl font-bold text-gray-600">{titlePage}</h1>
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <div className="relative cursor-pointer" onClick={() => openDrawer("messages")}>
            <div className="absolute top-[-5px] right-[-5px] w-[18px] h-[18px] bg-red-500 text-white flex items-center justify-center rounded-full">
              <span className="text-[12px]">{MESSAGES.length}</span>
            </div>
            <MessageSquare />
          </div>
          <div className="relative cursor-pointer" onClick={() => openDrawer("notifications")}>
            <div className="absolute top-[-5px] right-[-5px] w-[18px] h-[18px] bg-red-500 text-white flex items-center justify-center rounded-full">
              <span className="text-[12px]">{NOTIF.length}</span>
            </div>
            <Bell />
          </div>
        </div>
      </div>
    </>
  );
}
