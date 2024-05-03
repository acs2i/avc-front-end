import React, { useEffect, useState } from "react";
import Card from "../../components/Shared/Card";
import Input from "../../components/FormElements/Input";
import Button from "../../components/FormElements/Button";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useNotify from "../../utils/hooks/useToast";
import { VALIDATOR_REQUIRE } from "../../utils/validator";
import { CircularProgress } from "@mui/material";

interface FormData {
  GDI_TYPEDIM: string;
  GDI_DIMORLI: string;
  GDI_LIBELLE: string;
}

export default function DimensionCreateItemPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state: any) => state.auth.user);
  const { notifySuccess, notifyError } = useNotify();
  const [formData, setFormData] = useState<FormData>({
    GDI_TYPEDIM: "",
    GDI_DIMORLI: "",
    GDI_LIBELLE: "",
  });

  const levelOptions = [
    { value: "DI1", label: "Couleur", name: "Couleur" },
    { value: "DI2", label: "Taille", name: "Taille" },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/dimension`,
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
          notifySuccess("Marque crée avec succés !");
          setIsLoading(false);
          navigate(-1);
        }, 1000);
      } else {
        notifyError("Erreur lors de la création");
      }
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    }
  };

  return (
    <div>
      <Card title="Panel de création">
        <form
          className="w-[70%] mx-auto mt-[50px] mb-[50px]"
          onSubmit={handleSubmit}
        >
          <h1 className="text-2xl text-center">
            Créer une dimension
          </h1>
          <div className="mt-5 flex flex-col justify-between">
            <div className="flex flex-col">
              <Input
                element="select"
                id="GDI_TYPEDIM"
                label="Type de dimension"
                placeholder="Choississez un type de dimension"
                validators={[]}
                onChange={handleChange}
                options={levelOptions}
                required
                gray
              />
              <Input
                element="input"
                id="GDI_DIMORLI"
                label="Code"
                placeholder="ex: 456"
                onChange={handleChange}
                validators={[VALIDATOR_REQUIRE()]}
                required
                gray
              />
              <Input
                element="input"
                id="GDI_LIBELLE"
                type="text"
                placeholder="Nom de la collection"
                label="Libellé"
                onChange={handleChange}
                validators={[VALIDATOR_REQUIRE()]}
                required
                gray
              />
              {!isLoading ? (
                <div className="flex items-center gap-2 mt-5">
                  <Button size="medium" blue type="submit">
                    Créer
                  </Button>
                  <Button
                    size="medium"
                    danger
                    type="button"
                    onClick={() => navigate(-1)}
                  >
                    Annuler
                  </Button>
                </div>
              ) : (
                <div className="mt-3">
                  <CircularProgress />
                </div>
              )}
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}
