import React from "react";
import CreatableSelect from "react-select/creatable";
import Input from "./FormElements/Input";

interface Buyer {
  family: string[];
  user: string;
}

interface GestionFormComponentProps {
  admin: string;
  buyers: Buyer[];
  adminOptions: { label: string; value: string }[];
  setAdminSearchInput: (value: string) => void;
  handleAdminChange: (value: string) => void;
  handleBuyerChange: (
    index: number,
    field: keyof Buyer,
    value: string | string[]
  ) => void;
  addBuyer: () => void;
  onCloseModal: () => void;
  userOptions: { label: string; value: string }[];
  handleUserSearchInput: (inputValue: string, index: number) => void;
  familyOptions: { label: string; value: string; code: string }[];
  handleFamilySearchInput: (inputValue: string) => void;
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
  handleFamilySearchInput,
}) => {
  return (
    <div className="flex flex-col gap-4 p-4">
      <h6>Assistant(e)</h6>
      <CreatableSelect
        value={admin ? { label: admin, value: admin } : null}
        onChange={(option) => handleAdminChange(option ? option.value : "")}
        onInputChange={(inputValue) => setAdminSearchInput(inputValue)}
        options={adminOptions}
        placeholder="Sélectionnez un utilisateur"
        styles={customStyles}
        isClearable
      />

      <h6>Acheteur(s)</h6>
      {buyers.map((buyer, index) => (
        <div key={index} className="grid grid-cols-2 gap-2">
          <div>
            <CreatableSelect
              value={
                buyer.user ? { label: buyer.user, value: buyer.user } : null
              }
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
          </div>
          <div>
            <CreatableSelect
              isMulti
              value={buyer.family.map((fam) => ({ label: fam, value: fam }))}
              onChange={(options) => {
                const selectedFamilies = options
                  ? options.map((opt) => opt.value)
                  : [];
                handleBuyerChange(index, "family", selectedFamilies);
              }}
              onInputChange={(inputValue) => {
                if (typeof inputValue === "string")
                  handleFamilySearchInput(inputValue);
              }}
              options={familyOptions.map((opt) => ({
                label: String(opt.code),
                value: String(opt.code),
              }))}
              placeholder="Sélectionnez une ou plusieurs familles"
              styles={customStyles}
              isClearable
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        className="mt-4 bg-green-500 text-white rounded px-3 py-1"
        onClick={addBuyer}
      >
        + Ajouter Acheteur
      </button>

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