import React from "react";
import Button from "./FormElements/Button";

export default function SupplierComponent() {
  return (
    <div className="grid grid-cols-2 gap-2 px-2 mt-5">
      <div className="relative">
        <div className="absolute top-[-25px]">
          <h5>Liste des fournisseurs</h5>
        </div>
        <div className="w-full h-[300px] border border-gray-200"></div>
      </div>
      <div className="flex flex-col gap-7">
        <div className="relative border-[1px] border-gray-200 p-2">
          <div className="absolute top-[-15px]">
            <h5>Classer les fournisseurs</h5>
          </div>
          <div className="flex items-center justify-center gap-2 mt-3">
            <button className="px-6 py-1 bg-gray-300 rounded-sm">Monter</button>
            <button className="px-6 py-1 bg-gray-300 rounded-sm">
              Descendre
            </button>
          </div>
        </div>
        <div className="relative border-[1px] border-gray-200 p-2">
          <div className="absolute top-[-15px]">
            <h5>Prix d'achat</h5>
          </div>
          <div></div>
        </div>
      </div>
    </div>
  );
}
