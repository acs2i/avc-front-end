import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";
import { ToolbarProps } from "react-big-calendar";

const CustomToolbar: React.FC<ToolbarProps> = ({
  label,
  onNavigate,
  onView,
}) => {
  return (
    <div className="flex justify-between items-center p-4">
      <div>
        <button
          className="bg-gray-200 px-2 py-1 border border-gray-300 rounded hover:bg-gray-100"
          onClick={() => onNavigate("TODAY")}
        >
          Aujourd'hui
        </button>
      </div>
      <div className="flex items-center gap-3">
        <div onClick={() => onNavigate("PREV")} className="cursor-pointer">
          <ChevronLeft />
        </div>
        <span className="text-xl font-bold">{label}</span>
        <div onClick={() => onNavigate("NEXT")} className="cursor-pointer">
          <ChevronRight />
        </div>
      </div>
      <div className="flex items-center">
        <button
          className="bg-gray-200 px-2 py-1 border border-gray-300 rounded-l-md hover:bg-gray-100"
          onClick={() => onView("month")}
        >
          Mois
        </button>
        <button
          className="bg-gray-200 px-2 py-1 border border-gray-300 hover:bg-gray-100"
          onClick={() => onView("week")}
        >
          Semaine
        </button>
        <button
          className="bg-gray-200 px-2 py-1 border border-gray-300 hover:bg-gray-100"
          onClick={() => onView("day")}
        >
          Jour
        </button>
        <button
          className="bg-gray-200 px-2 py-1 border border-gray-300 rounded-r-md hover:bg-gray-100"
          onClick={() => onView("agenda")}
        >
          Agenda
        </button>
      </div>
    </div>
  );
};

export default CustomToolbar;
