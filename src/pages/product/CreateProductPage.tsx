import React, { useState, useEffect } from "react";
import { MoveLeft, Plus, Save, X } from "lucide-react";
import Input from "../../components/FormElements/Input";
import { Link } from "react-router-dom";
import Card from "../../components/Shared/Card";
import Button from "../../components/FormElements/Button";
import { LINKCARD_EDIT } from "../../utils/index";
import { LinkCard } from "@/type";
import { Divider } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  getFormData,
  setFormData,
  clearStorageData,
} from "../../utils/func/LocalStorage";

export default function CreateProductPage() {
  const [page, setPage] = useState("addProduct");
  const [famillies, setFamillies] = useState({ famillies: [] });
  const [refTerm, setRefTerm] = useState("");
  const [nameFamille, setNameFamilleTerm] = useState("");
  const [selectedLinkFamily, setSelectedLinkFamily] = useState("");
  const [selectedSubFamily, setSelectedSubFamily] = useState("");
  const [isStrict, setIsStrict] = useState(false);

  const user = useSelector((state: any) => state.auth.user);
  const email = user.email;
  const formName = page;
  const pageName = window.location.pathname;

  useEffect(() => {
    const formData = getFormData(email, formName, pageName);
    setRefTerm(formData.refTerm || "");
    setNameFamilleTerm(formData.nameFamille || "");
    setSelectedLinkFamily(formData.selectedLinkFamily || "");
  }, [email, formName, pageName]);

  const handleRefChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setRefTerm(value);
    setFormData(email, formName, pageName, {
      refTerm: value,
      nameFamille,
      selectedLinkFamily,
    });
  };

  const handleNameFamilleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setNameFamilleTerm(value);
    setFormData(email, formName, pageName, {
      refTerm,
      nameFamille: value,
      selectedLinkFamily,
    });
  };

  const handleLinkFamilyChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    setSelectedLinkFamily(value);
    setFormData(email, formName, pageName, {
      refTerm,
      nameFamille,
      selectedLinkFamily: value,
    });
  };

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
      console.log(famillies);
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    }
  };

  useEffect(() => {
    fetchFamilies();
  }, []);

  return (
    <div className="mt-7">
      <Link
        to="/edit"
        className="flex items-center justify-start gap-3 mb-5 font-bold text-gray-600"
      >
        <MoveLeft />
        <span>Retour</span>
      </Link>
      <Card title="Panel d'ajout">
        <div className="mt-4 mb-[50px]">
          <div className="flex items-center gap-7">
            {LINKCARD_EDIT.map((link: LinkCard) => (
              <>
                <button
                  className={`font-bold text-gray-600 ${
                    page === link.page ? "text-green-700" : ""
                  } ${page === link.page ? "animate-bounce" : ""}`}
                  onClick={() => setPage(link.page)}
                >
                  {link.name}
                </button>
                <div className="w-[1px] h-[20px] bg-gray-300"></div>
              </>
            ))}
          </div>
          <div className="mt-6">
            <Divider />
          </div>
        </div>

        {page === "addProduct" && (
          <div className="mt-7 mb-7">
            <form className="flex flex-col gap-4 w-[60%] mx-auto">
              <div className="flex items-center gap-3 h-[70px]">
                <div className="h-2/3 w-[8px] bg-emerald-700"></div>
                <h4 className="text-3xl text-gray-600">
                  <span className="font-bold text-gray-700">Ajout</span> d'un
                  produit
                </h4>
              </div>
              <div className="gap-5 grid grid-cols-1 grid-template-columns: [label] 1fr [select] 2fr;">
                <Input
                  element="input"
                  id="reference"
                  label="Référence du produit :"
                  onChange={handleLinkFamilyChange}
                  placeholder="Ajouter la référence du produit"
                  gray
                />
                <Input
                  element="input"
                  id="name"
                  label="Nom du produit :"
                  onChange={handleLinkFamilyChange}
                  placeholder="Ajouter le libellé du produit"
                  gray
                />
              </div>
              <div className="gap-5 grid grid-cols-2 grid-template-columns: [label] 1fr [select] 2fr;">
                <div className="flex flex-col gap-3">
                  <Input
                    element="select"
                    id="familly"
                    label="Famille :"
                    onChange={handleLinkFamilyChange}
                    options={famillies.famillies}
                    placeholder="Selectionner une famille"
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <Input
                    element="select"
                    id="subfamilly"
                    label="Sous-famille :"
                    onChange={handleLinkFamilyChange}
                    options={famillies.famillies}
                    placeholder="Selectionner une sous-famille"
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <Input
                    element="select"
                    id="brand"
                    label="Marque :"
                    onChange={handleLinkFamilyChange}
                    options={famillies.famillies}
                    placeholder="Selectionner une marque"
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <Input
                    element="select"
                    id="productcollection"
                    label="Collection :"
                    onChange={handleLinkFamilyChange}
                    options={famillies.famillies}
                    placeholder="Selectionner une collection"
                  />
                </div>
              </div>

              <div className="flex gap-2 mt-3">
                <Button size="small" green>
                  <Save size={15} />
                  Enregistrer
                </Button>
                <Button size="small" green>
                  <Plus size={15} />
                  Ajouter
                </Button>
                <Button size="small" danger>
                  <X size={15} />
                  Annuler
                </Button>
              </div>
            </form>
          </div>
        )}

        {page === "addFamilly" && (
          <div className="mt-7 mb-7">
            <form className="flex flex-col gap-4 w-[60%] mx-auto">
            <div className="flex items-center gap-3 h-[70px]">
                <div className="h-2/3 w-[8px] bg-emerald-700"></div>
                <h4 className="text-3xl text-gray-600">
                  <span className="font-bold text-gray-700">Ajout</span> d'une
                  famille
                </h4>
              </div>
              <div className="gap-5 grid grid-cols-1 grid-template-columns: [label] 1fr [select] 2fr;">
                <div className="flex flex-col gap-3">
                  <Input
                    element="input"
                    id="name"
                    label="Nom de la famille :"
                    onChange={handleLinkFamilyChange}
                    placeholder="Ajouter le libellé de la famille"
                    gray
                  />
                </div>
              </div>

              <div className="flex gap-2 mt-7">
                <Button size="small" green>
                  <Plus size={15} />
                  Ajouter
                </Button>
                <Button size="small" danger>
                  <X size={15} />
                  Annuler
                </Button>
              </div>
            </form>
          </div>
        )}
      </Card>
    </div>
  );
}
