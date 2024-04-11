import React, { useEffect, useState } from "react";
import { Collapse } from "@mui/material";
import Input from "./FormElements/Input";
import Button from "./FormElements/Button";
import { ChevronDown, ChevronUp, Plus, X } from "lucide-react";
import { useSelector } from "react-redux";
import { VALIDATOR_REQUIRE } from "../utils/validator";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CreateCollectionComponent() {
  const user = useSelector((state: any) => state.auth.user);
  const [collectionValue, setCollectionValue] = useState<string | null>(null);

  // Fonction pour afficher un toast de succès
  const notifySuccess = (message: any) => {
    toast.success(message, {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };

  // Fonction pour afficher un toast d'erreur
  const notifyError = (message: string) => {
    toast.error(message, {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };

  const handleCollectionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setCollectionValue(value);
  };

  const handleCreateFamily = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/collection/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: collectionValue, creator: user._id }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        notifySuccess("Collection créée avec succès!");
      } else {
        console.error("Erreur lors de la connexion");
        notifyError("Erreur lors de la création de la collection");
      }
    } catch (error) {
      console.error("Erreur lors de la requête", error);
      notifyError("Erreur lors de la création de la famille");
    }
  };


  return (
    <div>
      <form
        className="flex flex-col gap-4 w-[60%] mx-auto"
        onSubmit={handleCreateFamily}
      >
        <div className="flex items-center gap-3 h-[70px]">
          <div className="h-2/3 w-[8px] bg-emerald-700"></div>
          <h4 className="text-3xl text-gray-600">
            <span className="font-bold text-gray-700">Ajout</span> d'une collection
          </h4>
        </div>
        <div className="gap-5 grid grid-cols-1 grid-template-columns: [label] 1fr [select] 2fr;">
          <div className="flex flex-col gap-3">
            <Input
              element="input"
              id="brand"
              label="Libéllé de la collection :"
              onChange={handleCollectionChange}
              validators={[VALIDATOR_REQUIRE()]}
              placeholder="Ajouter le libellé de la collection"
              required
              gray
            />

          </div>
        </div>

        <div className="flex gap-2 mt-3">
          <Button size="small" green type="submit">
            <Plus size={15} />
            Ajouter
          </Button>
          <Button size="small" cancel>
            <X size={15} />
            Annuler
          </Button>
        </div>
      </form>
    </div>
  );
}
