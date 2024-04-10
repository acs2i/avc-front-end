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
import CreateFamilyComponent from "../../components/CreateFamilyComponent";
import { VALIDATOR_REQUIRE } from "../../utils/validator";

export default function CreateProductPage() {
  const [page, setPage] = useState("addProduct");
  const [famillyId, setfamillyId] = useState<string | null>(null);
  const [famillyValue, setfamillyValue] = useState<string | null>(null);
  const [famillies, setFamillies] = useState<{ famillies: any[] }>({ famillies: [] });
  const [subFamillies, setSubFamillies] = useState<{ subFamillies: any[] }>({ subFamillies: [] });
  const user = useSelector((state: any) => state.auth.user);

  const options = famillies?.famillies.map((familly: any) => ({
    value: familly._id,
    label: familly.name,
    name: familly.name,
  }));

  const handleFamilyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    const selectedFamilyObject =
      famillies?.famillies.find((familly: any) => familly._id === value) ??
      null;
    setfamillyId(value);
    setfamillyValue(selectedFamilyObject?.name)
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
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    }
  };

  const fetchSubFamilies = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/familly/subFamilly/${famillyId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      setSubFamillies(data);
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    }
  };

  useEffect(() => {
    fetchFamilies();
    if (famillyId) {
      fetchSubFamilies();
    }else{
      setSubFamillies({ subFamillies: [] });
    }
  }, [famillyId]);

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
            {LINKCARD_EDIT.map((link: LinkCard, i) => (
              <React.Fragment key={i}>
                <button
                  className={`font-bold text-gray-600 ${
                    page === link.page ? "text-green-700" : ""
                  } ${page === link.page ? "animate-bounce" : ""}`}
                  onClick={() => setPage(link.page)}
                >
                  {link.name}
                </button>
                <div className="w-[1px] h-[20px] bg-gray-300"></div>
              </React.Fragment>
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
                  validators={[VALIDATOR_REQUIRE()]}
                  placeholder="Ajouter la référence du produit"
                  required
                  gray
                />
                <Input
                  element="input"
                  id="name"
                  label="Nom du produit :"
                  validators={[VALIDATOR_REQUIRE()]}
                  placeholder="Ajouter le libellé du produit"
                  required
                  gray
                />
              </div>
              <div className="gap-5 grid grid-cols-2 grid-template-columns: [label] 1fr [select] 2fr;">
                <div className="flex flex-col gap-3">
                  <Input
                    element="select"
                    id="familly"
                    label="Famille :"
                    onChange={handleFamilyChange}
                    options={options}
                    required
                    placeholder="Selectionner une famille"
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <Input
                    element="select"
                    id="subfamilly"
                    label="Sous-famille :"
                  
                    options={subFamillies.subFamillies}
                    placeholder="Selectionner une sous-famille"
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <Input
                    element="select"
                    id="brand"
                    label="Marque :"
                    required
                    options={famillies.famillies}
                    placeholder="Selectionner une marque"
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <Input
                    element="select"
                    id="productcollection"
                    label="Collection :"
                    required
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
            <CreateFamilyComponent/>
          </div>
        )}
      </Card>
    </div>
  );
}
