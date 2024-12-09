import React, { useState } from "react";
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
  handleInputChangeUser: (inputValue: string) => void; // Ajouter ici
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
  handleInputChangeUser,
  familyOptions,
  handleFamilySearchInput,
}) => {
  const [allUsers, setAllUsers] = useState(userOptions);
  const [isLoading, setIsLoading] = useState(false);

  const showAllUsers = async () => {
    if (userOptions.length === 0) {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setAllUsers(userOptions);
      setIsLoading(false);
    } else {
      setAllUsers(userOptions);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <h6>Assistant(e)</h6>
      <CreatableSelect
        value={admin ? { label: admin, value: admin } : null}
        onChange={(option) => handleAdminChange(option ? option.value : "")}
        onInputChange={(inputValue) => setAdminSearchInput(inputValue)}
        onFocus={showAllUsers}
        options={allUsers}
        placeholder="Sélectionnez un utilisateur"
        styles={customStyles}
        isClearable
        isValidNewOption={() => false}
      />
      <h6>Acheteur(s)</h6>
      {buyers.map((buyer, index) => (
        <div key={index} className="grid grid-cols-2 gap-2">
          <div>
            <CreatableSelect
              value={
                buyer.user ? { label: buyer.user, value: buyer.user } : null
              } // Utilisation de buyer.user
              onChange={
                (option) =>
                  handleBuyerChange(index, "user", option ? option.value : "") // Mise à jour correcte du champ user
              }
              onInputChange={(inputValue) =>
                handleUserSearchInput(inputValue, index)
              } // Recherche spécifique à l'acheteur
              onFocus={showAllUsers}
              options={
                isLoading ? [{ label: "Chargement...", value: "" }] : allUsers
              }
              placeholder="Sélectionnez un utilisateur"
              styles={customStyles}
              isClearable
              isValidNewOption={() => false}
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
                handleBuyerChange(index, "family", selectedFamilies); // Mise à jour des familles
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
