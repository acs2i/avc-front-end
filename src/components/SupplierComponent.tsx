import React from "react";

interface SupplierProps {
  supplier: any;
  index: number;
}

export default function SupplierComponent({ supplier, index }: SupplierProps) {
  return (
    <div className="px-4">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-[30px] font-bold">{supplier.company_name}</h2>
        {index === 0 && <span className="italic">(Fournisseur principal)</span>}
      </div>
      <div className="flex flex-col gap-2">
        <div>
          <span className="text-[15px] font-[700] text-slate-600">Code : </span>
          <span className="text-[15px] font-[500] text-gray-700">
            {supplier.code}{" "}
          </span>
        </div>
        <div>
          <span className="text-[15px] font-[700] text-slate-600">
            Reférence du produit :{" "}
          </span>
          <span className="text-[15px] font-[500] text-gray-700">
            {supplier.supplier_ref}{" "}
          </span>
        </div>
        <div>
          <span className="text-[15px] font-[700] text-slate-600">Pcb : </span>
          <span className="text-[15px] font-[500] text-gray-700">
            {supplier.pcb}{" "}
          </span>
        </div>
        <div>
          <span className="text-[15px] font-[700] text-slate-600">
            Categorie douanière :{" "}
          </span>
          <span className="text-[15px] font-[500] text-gray-700">
            {supplier.custom_cat}{" "}
          </span>
        </div>
        <div>
          <span className="text-[15px] font-[700] text-slate-600">
            Origine :{" "}
          </span>
          <span className="text-[15px] font-[500] text-gray-700">
            {supplier.made_in}{" "}
          </span>
        </div>
      </div>
    </div>
  );
}
