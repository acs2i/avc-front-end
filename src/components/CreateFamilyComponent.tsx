import React, { useEffect, useState } from "react";
import { Collapse } from "@mui/material";
import Input from "./FormElements/Input";
import Button from "./FormElements/Button";
import { ChevronDown, ChevronUp, Plus, X } from "lucide-react";
import { useSelector } from "react-redux";
import { VALIDATOR_REQUIRE } from "../utils/validator";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CreateFamilyComponent() {
  const user = useSelector((state: any) => state.auth.user);
  const [openFamily, setOpenFamily] = useState(true);
  const [openSubFamily, setOpenSubFamily] = useState(false);
  const [familyId, setfamilyId] = useState<string | null>(null);
  const [famillyValue, setFamillyValue] = useState<string | null>(null);
  const [subFamillyValue, setSubFamillyValue] = useState<string | null>(null);
  const [famillies, setFamillies] = useState<{ famillies: any[] }>({
    famillies: [],
  });

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

  const handleOpenFamilyCollapse = (event: any) => {
    event.preventDefault();
    setOpenFamily(!openFamily);
  };

  const handleOpenSubFamilyCollapse = (event: any) => {
    event.preventDefault();
    setOpenSubFamily(!openSubFamily);
  };

  const options = famillies?.famillies.map((familly: any) => ({
    value: familly._id,
    label: familly.name,
    name: familly.name,
  }));

  // Fonction qui récupère l'id de la famille
  const handleFamilyId = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    const selectedFamilyObject =
      famillies?.famillies.find((familly: any) => familly._id === value) ??
      null;
    setfamilyId(value);
  };

  // Fonction qui récupère la valeur de la famille
  const handleFamilyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setFamillyValue(value);
  };

  // Fonction qui récupère la valeur de la sous-famille
  const handleSubFamilyChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    setSubFamillyValue(value);
  };

  // Fonction qui crée une famille
  const handleCreateFamily = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/familly/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: famillyValue, creator: user._id }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        notifySuccess("Famille créée avec succès!");
      } else {
        console.error("Erreur lors de la connexion");
        notifyError("Erreur lors de la création de la famille");
      }
    } catch (error) {
      console.error("Erreur lors de la requête", error);
      notifyError("Erreur lors de la création de la famille");
    }
  };

  // Fonction qui récupère les familles pour lier avec sous-famille
  const fetchFamilies = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/familly`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      setFamillies(data);
      console.log(data)
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    }
  };

  // Fonction qui crée une sous-famille
  const handleCreateSubFamily = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/familly/subFamilly/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: subFamillyValue,
            familly: familyId,
            creator: user._id,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        notifySuccess("Sous-famille créée avec succès!");
      } else {
        console.error("Erreur lors de la connexion");
        notifyError("Erreur lors de la création de la sous-famille");
      }
    } catch (error) {
      console.error("Erreur lors de la requête", error);
      notifyError("Erreur lors de la création de la sous-famille");
    }
  };

  useEffect(() => {
    fetchFamilies();
  }, []);


  return (
    <div>
      {/* Ajout d'une famille */}
      <form
        className="flex flex-col gap-4 w-[60%] mx-auto"
        onSubmit={handleCreateFamily}
      >
        <div
          className="flex items-center gap-3 h-[70px]"
          onClick={handleOpenFamilyCollapse}
        >
          <div className="h-2/3 w-[8px] bg-emerald-700"></div>
          <h4 className="text-3xl text-gray-600 cursor-pointer select-none">
            <span className="font-bold text-gray-700">Ajout</span> d'une famille
          </h4>
          <button className="focus:outline-none text-gray-500">
            {!openFamily && <ChevronDown size={25} />}
            {openFamily && <ChevronUp size={25} />}
          </button>
        </div>
        <Collapse in={openFamily}>
          <div>
            <div className="gap-5 grid grid-cols-1 grid-template-columns: [label] 1fr [select] 2fr;">
              <div className="flex flex-col gap-3">
                <Input
                  element="input"
                  id="name"
                  label="Nom de la famille :"
                  onChange={handleFamilyChange}
                  validators={[VALIDATOR_REQUIRE()]}
                  placeholder="Ajouter le libellé de la famille"
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
          </div>
        </Collapse>
      </form>

      {/* Ajout d'une sous-famille */}
      <form
        className="flex flex-col gap-4 w-[60%] mx-auto mt-[50px]"
        onSubmit={handleCreateSubFamily}
      >
        <div
          className="flex items-center gap-3 h-[70px]"
          onClick={handleOpenSubFamilyCollapse}
        >
          <div className="h-2/3 w-[8px] bg-emerald-700"></div>
          <h4 className="text-3xl text-gray-600 cursor-pointer select-none">
            <span className="font-bold text-gray-700">Ajout</span> d'une
            sous-famille
          </h4>
          <button className="focus:outline-none text-gray-500">
            {!openSubFamily && <ChevronDown size={25} />}
            {openSubFamily && <ChevronUp size={25} />}
          </button>
        </div>
        <Collapse in={openSubFamily}>
          <div>
            <div className="gap-5 grid grid-cols-1 grid-template-columns: [label] 1fr [select] 2fr;">
              <div className="flex flex-col gap-3">
                <Input
                  element="input"
                  id="name"
                  label="Nom de la sous-famille :"
                  onChange={handleSubFamilyChange}
                  validators={[VALIDATOR_REQUIRE()]}
                  placeholder="Ajouter le libellé de la sous-famille"
                  required
                  gray
                />
                <Input
                  element="select"
                  id="familly"
                  label="Liaison avec une famille :"
                  onChange={handleFamilyId}
                  options={options}
                  placeholder="Selectionner une famille à lier"
                  required
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
          </div>
        </Collapse>
      </form>

      
    </div>
  );
}
