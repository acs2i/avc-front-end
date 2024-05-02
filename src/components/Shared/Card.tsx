import { ChevronLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import React from "react";

type InFosCard = {
  title: any;
  children: React.ReactNode;
};

export default function Card({ title, children }: InFosCard) {
  const navigate = useNavigate();
  const location = useLocation();

  const shouldHideBackButton = location.pathname === "/";

  return (
    <section className="bg-white shadow-md rounded-lg flex flex-col gap-1 rounded-md">
      <div className="bg-green-900 py-3 px-5 rounded-t-md flex items-center gap-2">
        {!shouldHideBackButton && <div
          className="text-white bg-orange-500 h-[30px] w-[30px] flex items-center justify-center cursor-pointer rounded-full hover:bg-orange-400"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft />
        </div>}
        <h2 className="text-white font-bold text-lg">{title}</h2>
      </div>
      <div className="py-2">{children}</div>
    </section>
  );
}
