import Card from "../../components/Shared/Card";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useFetch from "../../utils/hooks/usefetch";
import Input from "../../components/FormElements/Input";
import Button from "../../components/FormElements/Button";
import { CircularProgress } from "@mui/material";
import useNotify from "../../utils/hooks/useToast";
import Modal from "../../components/Shared/Modal";

interface Collection {
  _id: string;
  CODE: any;
  LIBELLE: any;
}

interface FormData {
  CODE: string;
  LIBELLE: string;
}

export default function CollectionUpdatePage() {
  const { id } = useParams();
  const { notifySuccess, notifyError } = useNotify();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { data: collection } = useFetch<Collection>(
    `${process.env.REACT_APP_URL_DEV}/api/v1/collection/${id}`
  );
  const [libelle, setLibelle] = useState("");
  const [code, setCode] = useState();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    CODE: "",
    LIBELLE: "",
  });

  const handleLibelleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLibelle(e.target.value);
    setFormData((prevFormData) => ({
      ...prevFormData,
      LIBELLE: e.target.value,
    }));
  };

  useEffect(() => {
    if (collection) {
      setLibelle(collection.LIBELLE);
      setCode(collection.CODE);
      setFormData({
        LIBELLE: collection.LIBELLE,
        CODE: collection.CODE,
      });
    }
  }, [collection]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/collection/${id}`,
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
          notifySuccess("Collection modifiée avec succès !");
          setIsLoading(false);
          navigate(-1);
        }, 1000);
      } else {
        notifyError("Erreur lors de la modif !");
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
      <Card title={`Mettre à jour la classification`}>
        <form
          className="w-[70%] h-[400px] mx-auto mt-[50px] mb-[50px]"
          onSubmit={handleSubmit}
        >
          <h1 className="text-2xl">
            {" "}
            {collection?.LIBELLE} - {collection?.CODE}
          </h1>
          <div className="mt-5 flex flex-col justify-between">
            <div className="flex flex-col">
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
            </div>
            <div className="w-full mt-2">
            <div className="flex items-center gap-2">
              <Button
                size="medium"
                blue
                onClick={() => setIsModalOpen(true)}
                type="button"
              >
                Valider
              </Button>
              <Button size="medium" danger type="button" onClick={() => navigate(-1)}>
                Annuler
              </Button>
            </div>
          </div>
          </div>
        </form>
      </Card>
    </div>
  );
}
