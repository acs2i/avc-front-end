import Card from "../../components/Shared/Card";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useFetch from "../../utils/hooks/usefetch";
import Input from "../../components/FormElements/Input";
import Button from "../../components/FormElements/Button";
import { CircularProgress } from "@mui/material";
import useNotify from "../../utils/hooks/useToast";
import Modal from "../../components/Shared/Modal";
import { RotateCcw, X } from "lucide-react";

interface Dimension {
  _id: string;
  GDI_TYPEDIM: string;
  GDI_DIMORLI: any;
  GDI_LIBELLE: any;
}

interface FormData {
  GDI_TYPEDIM: string;
  GDI_DIMORLI: string;
  GDI_LIBELLE: string;
}

export default function ClassificationUpdatePage() {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isModify, setIsModify] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { notifySuccess, notifyError } = useNotify();

  const { data: dimension } = useFetch<Dimension>(
    `${process.env.REACT_APP_URL_DEV}/api/v1/dimension/${id}`
  );
  const [libelle, setLibelle] = useState("");
  const [type, setType] = useState("");
  const [code, setCode] = useState("");
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    GDI_TYPEDIM: "",
    GDI_DIMORLI: "",
    GDI_LIBELLE: "",
  });

  const handleLibelleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLibelle(e.target.value);
    setFormData((prevFormData) => ({
      ...prevFormData,
      GDI_LIBELLE: e.target.value,
    }));
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setType(e.target.value);
    setFormData((prevFormData) => ({
      ...prevFormData,
      GDI_TYPEDIM: e.target.value,
    }));
  };

  const handleSetType = (type: string) => {
    if (type === "DI1") {
      setType("Couleur");
    } else if (type === "DI2") {
      setType("Taille");
    }
  };

  useEffect(() => {
    if (dimension) {
      setLibelle(dimension.GDI_LIBELLE);
      setCode(dimension.GDI_DIMORLI);
      handleSetType(dimension.GDI_TYPEDIM);
      setFormData({
        GDI_TYPEDIM: dimension.GDI_TYPEDIM,
        GDI_DIMORLI: dimension.GDI_DIMORLI,
        GDI_LIBELLE: dimension.GDI_LIBELLE,
      });
    }
  }, [dimension]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/dimension/${id}`,
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
          notifySuccess("Dimension modifiée avec succés !");
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
      <Modal
        show={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        header="Confirmation"
        onSubmit={handleSubmit}
      >
        <p className="font-bold text-gray-800">
          Voulez-vous vraiment appliquer ces modifications ?
        </p>
        {!isLoading ? (
          <div className="flex justify-center gap-2 mt-4">
            <Button size="medium" blue type="submit">
              Oui
            </Button>
            <Button
              size="medium"
              danger
              type="button"
              onClick={() => setIsModalOpen(false)}
            >
              Non
            </Button>
          </div>
        ) : (
          <div className="mt-4">
            <CircularProgress />
          </div>
        )}
      </Modal>
      <Card title={`Mettre à jour la dimension`}>
        <form
          className="w-[70%] h-[400px] mx-auto mt-[50px] mb-[50px]"
          onSubmit={handleSubmit}
        >
          <div className="flex items-center justify-between">
            <h1 className="text-2xl">
              {type} n° {dimension?.GDI_DIMORLI}
            </h1>
            {!isModify && (
              <Button size="small" green onClick={() => setIsModify(true)}>
                <RotateCcw size={15}/>
                Modifier la dimension
              </Button>
            )}
          </div>
          <div className="mt-5 flex flex-col justify-between">
            <div className="flex flex-col">
              {isModify ? (
                <div>
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
              ) : (
                <div>
                  <div className="py-2">
                    <h3 className="mb-1 text-md text-gray-800 font-bold">
                      Libellé
                    </h3>
                    <p className="text-md">{dimension?.GDI_LIBELLE}</p>
                  </div>
                </div>
              )}
            </div>
            {isModify && (
              <div className="w-full mt-2">
                <div className="flex items-center gap-2">
                  <Button
                    size="small"
                    cancel
                    type="button"
                    onClick={() => setIsModify(false)}
                  >
                    <X size={15} />
                    Annuler
                  </Button>
                  <Button
                    size="small"
                    green
                    onClick={() => setIsModalOpen(true)}
                    type="button"
                  >
                    <RotateCcw size={15} />
                    Modiifer
                  </Button>
                </div>
              </div>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}
