import React, { useState, useEffect } from "react";
import Input from "../../components/FormElements/Input";
import { useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Card from "../../components/Shared/Card";
import { ImageUp } from "lucide-react";
import Button from "../../components/FormElements/Button";
import useNotify from "../../utils/hooks/useToast";
import { CircularProgress } from "@mui/material";

interface FormData {
  creator_id: string;
  description_ref: string;
  reference: string;
  designation_longue: string;
  designation_courte: string;
  marque: string;
  collection: string;
  description_brouillon: string;
}

export default function CreateProductPage() {
  const creatorId = useSelector((state: any) => state.auth.user);
  const { notifySuccess, notifyError } = useNotify();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    creator_id: creatorId._id,
    description_ref: "",
    reference: "",
    designation_longue: "",
    designation_courte: "",
    marque: "",
    collection: "",
    description_brouillon: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
      designation_courte:
        e.target.id === "designation_longue"
          ? e.target.value.substring(0, 15)
          : formData.designation_courte,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/draft`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        setTimeout(() => {
          notifySuccess("Brouillon créé !");
          setIsLoading(false);
          navigate("/draft");
        }, 1000);
      } else {
        notifyError("Erreur lors de la création !");
      }
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    }
  };


  return (
    <section className="w-full h-screen bg-gray-100 p-7">
      <div>
        <h3 className="text-[32px] font-[800] text-gray-800">
          Créer un article
        </h3>
        <p className="text-[17px] text-gray-600">Lorem ipsum dolor sit amet</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="flex gap-7 mt-[50px]">
          <div className="w-[70%] flex flex-col gap-3">
            <div className="relative border p-3 ">
              <div className="absolute top-[-15px] bg-gray-100 px-2">
                <span className="text-[13px] italic">Identification</span>
              </div>
              <Input
                element="input"
                id="reference"
                label="Référence :"
                value={formData.reference}
                onChange={handleChange}
                validators={[]}
                placeholder="Ajouter la référence du produit"
                create
                required
                gray
              />
              <Input
                element="input"
                id="designation_longue"
                label="Désignation longue :"
                value={formData.designation_longue}
                onChange={handleChange}
                validators={[]}
                placeholder="Ajouter la designation du produit"
                create
                required
                gray
              />
              <Input
                element="input"
                id="designation_courte"
                label="Désignation Courte :"
                value={formData.designation_courte}
                onChange={handleChange}
                validators={[]}
                placeholder=""
                create
                required
                gray
              />
            </div>
            <div className="relative border p-3 ">
              <div className="absolute top-[-15px] bg-gray-100 px-2">
                <span className="text-[13px] italic">
                  Fournisseur principal
                </span>
              </div>
              <Input
                element="input"
                id="supplier"
                label="Nom :"
                value=""
                validators={[]}
                placeholder="Ajouter la référence du produit"
                create
                gray
              />
              <Input
                element="input"
                id="reference"
                label="Référence produit :"
                value=""
                validators={[]}
                placeholder="Ajouter la designation du produit"
                create
                gray
              />
            </div>
            <div className="mt-3">
              <h3 className="text-[22px] font-[800] text-gray-800">
                Ajouter une image
              </h3>
              <div className="w-full h-[250px] border border-dashed border-2 border-gray-300 mt-3 flex justify-center items-center">
                <div className="flex flex-col items-center">
                  <p className="font-bold text-gray-600">
                    Glissez déposez votre image ici ou{" "}
                    <span className="text-blue-400">
                      téléchargez depuis votre ordinateur
                    </span>
                  </p>
                  <div className="text-gray-300">
                    <ImageUp size={70} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-[30%] flex flex-col gap-5">
            <Card title="Classification principale">
              <div className="flex flex-col gap-3">
                <Input
                  element="select"
                  id="family"
                  label="Famille :"
                  value=""
                  validators={[]}
                  placeholder="Selectionnez un famille"
                  gray
                />
                <Input
                  element="select"
                  id="family"
                  label="Sous-famille :"
                  value=""
                  validators={[]}
                  placeholder="Selectionnez une sous-famille"
                  gray
                />
              </div>
            </Card>
            <Card title="Caractéristiques du produit">
              <div className="flex flex-col gap-3">
                <Input
                  element="select"
                  id="dimension"
                  label="Dimensions :"
                  value=""
                  validators={[]}
                  placeholder="Selectionnez une dimension"
                  gray
                />
                <Input
                  element="select"
                  id="composition"
                  label="Composition :"
                  value=""
                  validators={[]}
                  placeholder="Selectionnez une composition"
                  gray
                />
                <Input
                  element="select"
                  id="collection"
                  label="Collection :"
                  value=""
                  validators={[]}
                  placeholder="Selectionnez une collection"
                  gray
                />
                <Input
                  element="select"
                  id="theme"
                  label="Thème :"
                  value=""
                  validators={[]}
                  placeholder="Selectionnez un thème"
                  gray
                />
              </div>
            </Card>
          </div>
        </div>
        {!isLoading ? (
          <div className="flex gap-3 mt-5">
            <Button size="small" cancel type="button">
              Annuler
            </Button>
            <Button size="small" blue type="submit">
              Enregistrer
            </Button>
          </div>
        ) : (
          <div className="mt-3">
            <CircularProgress />
          </div>
        )}
      </form>
    </section>
  );
}
