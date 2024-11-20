import React, { useState } from "react";
import Button from "../components/FormElements/Button";
import { Pen } from "lucide-react";
import { isDraft } from "@reduxjs/toolkit";

interface SupplierProps {
  supplier: any;
  index: number;
  onUpdate?: (updatedSupplier: any) => void;
  onClose?: () => void;
  isModify?: boolean;
  isDraft?: boolean;
}

export default function SupplierComponent({ 
  supplier, 
  index, 
  onUpdate, 
  onClose,
  isModify = false,
  isDraft
}: SupplierProps) {
  const [editedSupplier, setEditedSupplier] = useState(supplier);
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedSupplier({
      ...editedSupplier,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    onUpdate?.(editedSupplier);
    setIsEditing(false);
  };

  if (!isModify || !isEditing) {
    return (
      <div className="px-4">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-[30px] font-bold">{isDraft ? supplier.supplier_id : supplier.company_name}</h2>
            {index === 0 && <span className="italic">(Fournisseur principal)</span>}
          </div>
          {isModify && (
            <Button 
              blue 
              size="small"
              onClick={() => setIsEditing(true)}
            >
              <div className="flex items-center gap-2">
                <Pen size={15} />
                <span>Modifier</span>
              </div>
            </Button>
          )}
        </div>
        <div className="flex flex-col gap-2">
          {!isDraft && <div>
            <span className="text-[15px] font-[700] text-slate-600">Code : </span>
            <span className="text-[15px] font-[500] text-gray-700">
              {supplier.code}{" "}
            </span>
          </div>}
          <div>
            <span className="text-[15px] font-[700] text-slate-600">
              Reférence du produit :{" "}
            </span>
            <span className="text-[15px] font-[500] text-gray-700">
              {supplier.supplier_ref}{" "}
            </span>
          </div>
          <div>
            <span className="text-[15px] font-[700] text-slate-600">PCB : </span>
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

  return (
    <div className="px-4">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 className="text-[30px] font-bold">{isDraft ? supplier.supplier_id : supplier.company_name}</h2>
        {index === 0 && <span className="italic">(Fournisseur principal)</span>}
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-[15px] font-[700] text-slate-600">
            Reférence du produit
          </label>
          <input
            type="text"
            name="supplier_ref"
            value={editedSupplier.supplier_ref}
            onChange={handleChange}
            className="border p-2 rounded-md"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[15px] font-[700] text-slate-600">PCB</label>
          <input
            type="text"
            name="pcb"
            value={editedSupplier.pcb}
            onChange={handleChange}
            className="border p-2 rounded-md"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[15px] font-[700] text-slate-600">
            Categorie douanière
          </label>
          <input
            type="text"
            name="custom_cat"
            value={editedSupplier.custom_cat}
            onChange={handleChange}
            className="border p-2 rounded-md"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[15px] font-[700] text-slate-600">Origine</label>
          <input
            type="text"
            name="made_in"
            value={editedSupplier.made_in}
            onChange={handleChange}
            className="border p-2 rounded-md"
          />
        </div>
        
        <div className="flex justify-end gap-2 mt-4">
          <Button 
            size="small" 
            cancel 
            onClick={() => setIsEditing(false)}
          >
            Annuler
          </Button>
          <Button 
            size="small" 
            blue 
            onClick={handleSubmit}
          >
            Enregistrer
          </Button>
        </div>
      </div>
    </div>
  );
}