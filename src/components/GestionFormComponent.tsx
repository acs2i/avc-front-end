import React from "react";
import CreatableSelect from "react-select/creatable";
import Input from "./FormElements/Input";

interface Buyer {
  family: string;
  user: string;
}

interface GestionFormComponentProps {
  admin: string;
  buyers: Buyer[];
  adminOptions: { label: string; value: string }[];
  setAdminSearchInput: (value: string) => void;
  handleAdminChange: (value: string) => void;
  handleBuyerChange: (index: number, field: keyof Buyer, value: string) => void;
  addBuyer: (buyer: Buyer) => void;
  onCloseModal: () => void;
  userOptions: { label: string; value: string }[];
  handleUserSearchInput: (inputValue: string, index: number) => void;
  familyOptions: { label: string; value: string }[]; // Ajoutez cette prop
  handleFamilySearchInput: (inputValue: string) => void; // Ajoutez cette prop
}

const customStyles = {
  control: (base: any) => ({
    ...base,
    minWidth: "200px",
    borderColor: "#ddd",
    boxShadow: "none",
    "&:hover": {
      borderColor: "#ccc",
    },
  }),
};

const GestionFormComponent: React.FC<GestionFormComponentProps> = ({
  admin,
  buyers,
  adminOptions,
  setAdminSearchInput,
  handleAdminChange,
  handleBuyerChange,
  addBuyer,
  onCloseModal,
  userOptions,
  handleUserSearchInput,
  familyOptions,
  handleFamilySearchInput, // Ajoutez cette prop
}) => {
  return (
    <div className="flex flex-col gap-4 p-4">
      <h5>Gestionnaire</h5>
      <CreatableSelect
        value={admin ? { label: admin, value: admin } : null}
        onChange={(option) => handleAdminChange(option ? option.value : "")}
        onInputChange={(inputValue) => setAdminSearchInput(inputValue)}
        options={adminOptions}
        placeholder="Sélectionnez un utilisateur"
        styles={customStyles}
        isClearable
      />

      <h6>Acheteurs</h6>
      {buyers.map((buyer, index) => (
        <div key={index} className="grid grid-cols-2 gap-2">
          <CreatableSelect
            value={buyer.user ? { label: buyer.user, value: buyer.user } : null}
            onChange={(option) =>
              handleBuyerChange(index, "user", option?.value || "")
            }
            onInputChange={(inputValue) =>
              handleUserSearchInput(inputValue, index)
            }
            options={userOptions}
            placeholder="Sélectionnez un utilisateur"
            styles={customStyles}
            isClearable
          />
          <CreatableSelect
            value={
              buyer.family
                ? { label: String(buyer.family), value: String(buyer.family) }
                : null
            }
            onChange={(option) =>
              handleBuyerChange(index, "family", option?.value || "")
            }
            onInputChange={(inputValue) => {
              if (typeof inputValue === "string")
                handleFamilySearchInput(inputValue);
            }}
            options={familyOptions.map((opt) => ({
              ...opt,
              label: String(opt.label),
              value: String(opt.label),
            }))}
            placeholder="Sélectionnez une famille"
            styles={customStyles}
            isClearable
          />
        </div>
      ))}

      <button
        type="button"
        className="px-4 py-2 mt-4 bg-blue-500 text-white rounded"
        onClick={onCloseModal}
      >
        Fermer
      </button>
    </div>
  );
};

export default GestionFormComponent;
