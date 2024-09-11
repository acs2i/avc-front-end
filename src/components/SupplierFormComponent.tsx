import React from "react";
import CreatableSelect from "react-select/creatable";
import Input from "../components/FormElements/Input";
import { Trash2 } from "lucide-react";

interface SupplierEditorProps {
  supplier: any;
  index: number;
  optionsSupplier: any[];
  inputValueSupplier: string;
  handleSupplierSelectChange: (index: number, option: any) => void;
  handleInputChangeSupplier: (inputValue: string) => void;
  handleSupplierChange: (index: number, field: string, value: string) => void;
  removeSupplier: (index: number) => void;
  onCloseModal: () => void;
  addSupplier: (supplier: any) => void;
}

const SupplierFormComponent: React.FC<SupplierEditorProps> = ({
  supplier,
  index,
  optionsSupplier,
  inputValueSupplier,
  handleSupplierSelectChange,
  handleInputChangeSupplier,
  handleSupplierChange,
  removeSupplier,
  onCloseModal,
  addSupplier,
}) => {
  const handleAddSupplier = () => {
    // Créer un nouveau fournisseur avec les données actuelles
    const newSupplier = {
      supplier_id: supplier.supplier_id || "",
      supplier_ref: supplier.supplier_ref || "",
      pcb: supplier.pcb || "",
      custom_cat: supplier.custom_cat || "",
      made_in: supplier.made_in || "",
    };

    console.log("Vérification des champs du nouveau fournisseur : ", newSupplier);

    
    // Appeler la fonction pour ajouter le fournisseur dans formData.suppliers
    addSupplier(newSupplier);

    // Fermer la modal après l'ajout du fournisseur
    onCloseModal();
  };

  return (
    <div className="mt-3 px-6">
      <div>
        <label className="text-sm font-medium text-gray-600">Nom</label>
        <CreatableSelect
          value={optionsSupplier?.find(
            (option) => option.value === supplier.supplier_id
          )}
          onChange={(option) => handleSupplierSelectChange(index, option)}
          onInputChange={handleInputChangeSupplier}
          inputValue={inputValueSupplier}
          options={optionsSupplier}
          placeholder="Sélectionner un fournisseur"
          className="mt-2 block text-sm py-1 w-full rounded-lg text-gray-500 border border-gray-200 focus:outline-none focus:ring-0 focus:border-gray-200 peer capitalize"
          required
        />
      </div>
      <div>
        <Input
          element="input"
          id={`supplier_ref-${index}`}
          label="Référence produit :"
          value={supplier.supplier_ref || ""}
          onChange={(e) =>
            handleSupplierChange(index, "supplier_ref", e.target.value)
          }
          validators={[]}
          placeholder="Ajouter la référence produit"
          create
          gray
        />
      </div>
      <div>
        <Input
          element="input"
          id={`pcb-${index}`}
          label="PCB (multiple) :"
          value={supplier.pcb || ""}
          onChange={(e) => handleSupplierChange(index, "pcb", e.target.value)}
          placeholder="Ajouter le PCB"
          validators={[]}
          create
          gray
        />
      </div>
      <div>
        <Input
          element="input"
          id={`custom_cat-${index}`}
          label="Catégorie douanière :"
          value={supplier.custom_cat || ""}
          onChange={(e) =>
            handleSupplierChange(index, "custom_cat", e.target.value)
          }
          placeholder="Ajouter la catégorie douanière"
          validators={[]}
          create
          gray
        />
      </div>
      <div>
        <Input
          element="input"
          id={`made_in-${index}`}
          label="Origine :"
          value={supplier.made_in || ""}
          onChange={(e) =>
            handleSupplierChange(index, "made_in", e.target.value)
          }
          placeholder="Ajouter l'origine"
          validators={[]}
          create
          gray
        />
      </div>
      <button
        type="button"
        onClick={handleAddSupplier}
        className="mt-4 bg-blue-500 text-white rounded-md px-4 py-2 w-full"
      >
        Ajouter le fournisseur
      </button>
    </div>
  );
};

export default SupplierFormComponent;
