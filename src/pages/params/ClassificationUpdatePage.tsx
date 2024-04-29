import Card from "../../components/Shared/Card";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useFetch from "../../utils/hooks/usefetch";
import Input from "../../components/FormElements/Input";
import Button from "../../components/FormElements/Button";
import { CircularProgress } from "@mui/material";
import useNotify from "../../utils/hooks/useToast";

interface Family {
  _id: string;
  YX_TYPE: string;
  YX_CODE: any;
  YX_LIBELLE: string;
}

interface FormData {
  YX_TYPE: string;
  YX_CODE: string;
  YX_LIBELLE: string;
}

export default function ClassificationUpdatePage() {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const { notifySuccess, notifyError } = useNotify();

  const { data: family } = useFetch<Family>(
    `${process.env.REACT_APP_URL_DEV}/api/v1/family/${id}`
  );
  const [libelle, setLibelle] = useState("");
  const [type, setType] = useState("");
  const [code, setCode] = useState();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    YX_TYPE: "",
    YX_CODE: "",
    YX_LIBELLE: "",
  });
  const options = [
    { value: "Famille", label: "Famille", name: "Famille" },
    { value: "Sous-famille", label: "Sous-famille", name: "Sous-famille" },
    {
      value: "Sous-sous-famille",
      label: "Sous-sous-famille",
      name: "Sous-sous-famille",
    },
  ];

  const handleLibelleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLibelle(e.target.value);
    setFormData((prevFormData) => ({
      ...prevFormData,
      YX_LIBELLE: e.target.value,
    }));
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setType(e.target.value);
    setFormData((prevFormData) => ({
      ...prevFormData,
      YX_TYPE: e.target.value,
    }));
  };

  const handleSetType = (type: string) => {
    if (type === "LA1") {
      setType("Famille");
    } else if (type === "LA2") {
      setType("Sous-famille");
    } else {
      setType("Sous-sous-famille");
    }
  };

  useEffect(() => {
    if (family) {
      setLibelle(family.YX_LIBELLE);
      setCode(family.YX_CODE);
      handleSetType(family.YX_TYPE);
      setFormData({
        YX_TYPE: family.YX_TYPE,
        YX_CODE: family.YX_CODE,
        YX_LIBELLE: family.YX_LIBELLE,
      });
    }
  }, [family]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/family/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      if (response.ok) {
        setTimeout(() => {
          notifySuccess("Classification modifié avec succés !");
          setIsLoading(false);
          navigate(-1);
        }, 1000);
      } else {
        notifyError("Erreur lors de la modification");
      }
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  return (
    <div>
      <Card title={`Mettre à jour la classification`}>
        <form
          className="w-[70%] h-[400px] mx-auto mt-[50px] mb-[50px]"
          onSubmit={handleSubmit}
        >
          <h1 className="text-2xl">
            {" "}
            {family?.YX_LIBELLE} - {family?.YX_CODE}
          </h1>
          <div className="mt-5 flex flex-col justify-between">
            <div className="flex flex-col">
              <div>
                <Input
                  element="input"
                  id="level"
                  label="Niveau"
                  value={type}
                  placeholder={type}
                  disabled
                  validators={[]}
                  gray
                  onChange={handleTypeChange}
                />
                <Input
                  element="input"
                  id="label"
                  type="text"
                  placeholder="Modifier le libellé"
                  value={libelle}
                  label="Libellé"
                  validators={[]}
                  onChange={handleLibelleChange}
                  gray
                />
              </div>
            </div>
            <div className="w-full mt-2">
              {!isLoading ? (
                <Button size="small" blue type="submit">
                  Valider
                </Button>
              ) : (
                <CircularProgress />
              )}
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}
