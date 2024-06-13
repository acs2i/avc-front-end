import { ChevronLeft, Download, GripHorizontal, Plus } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import Menu from "@mui/material/Menu";
import React, { useState } from "react";
import { MenuItem } from "@mui/material";

type InFosCard = {
  children: React.ReactNode;
  title: string;
};

export default function Card({ children, title }: InFosCard) {
  return (
    <section className="bg-white shadow-md rounded-lg flex flex-col gap-1 rounded-md py-4 px-4">
      <h4 className="text-lg font-[700] text-gray-800">{title}</h4>
      <div className="py-2">{children}</div>
    </section>
  );
}
