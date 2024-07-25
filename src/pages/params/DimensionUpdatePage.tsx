import Card from "../../components/Shared/Card";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useFetch from "../../utils/hooks/usefetch";
import Input from "../../components/FormElements/Input";
import Button from "../../components/FormElements/Button";
import { CircularProgress, Divider } from "@mui/material";
import useNotify from "../../utils/hooks/useToast";
import Modal from "../../components/Shared/Modal";
import { ChevronLeft, RotateCcw, X } from "lucide-react";

interface Dimension {
  _id: string;
  code: string;
  label: string;
  type: string;
  status: string;
  creator_id: any;
  additional_fields?: any;
}

interface DimensionUpdatePageProps {
  selectedDimension: Dimension;
  onUpdate: () => void;
  onClose: () => void;
}

interface FormData {
  type: string;
  code: string;
  label: string;
}

export default function DimensionUpdatePage({
  selectedDimension,
  onClose,
  onUpdate,
}: DimensionUpdatePageProps) {
  const id = selectedDimension._id;
  const [dimensionUpdate, setDimensionUpadte] = useState<Dimension | null>(
    null
  );
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
  const [formData, setFormData] = useState<FormData>({
    type: "",
    code: "",
    label: "",
  });

  const handleLibelleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLibelle(e.target.value);
    setFormData((prevFormData) => ({
      ...prevFormData,
      label: e.target.value,
    }));
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setType(e.target.value);
    setFormData((prevFormData) => ({
      ...prevFormData,
      type: e.target.value,
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
      setLibelle(dimension.label);
      setCode(dimension.code);
      handleSetType(dimension.type);
      setFormData({
        type: dimension.type,
        code: dimension.code,
        label: dimension.label,
      });
    }
  }, [dimension]);

  useEffect(() => {
    if (selectedDimension) {
      setDimensionUpadte(selectedDimension);
    }
  }, [selectedDimension]);

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
          onUpdate();
          onClose();
        }, 100);
      } else {
        notifyError("Erreur lors de la modification");
      }
    } catch (error) {
      console.error(error);
    } finally {
    }
  };


  return (
    <section className="w-full p-4">
      <Modal
        show={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onClose={() => setIsModalOpen(false)}
        header="Confirmation de modification de la dimension"
        onSubmit={handleSubmit}
        icon="?"
      >
        <div className="px-7 mb-5">
          <p className="text-gray-800 text-xl">
            Voulez-vous vraiment appliquer ces modifications ?
          </p>
        </div>
        <Divider />
        {!isLoading ? (
          <div className="flex justify-end mt-7 px-7 gap-2">
            <Button
              size="small"
              danger
              type="button"
              onClick={() => setIsModalOpen(false)}
            >
              Non
            </Button>
            <Button size="small" blue type="submit">
              Oui
            </Button>
          </div>
        ) : (
          <div className="flex justify-end mt-7 px-7 gap-2">
            <CircularProgress />
          </div>
        )}
      </Modal>

      <form className="mb-[50px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div onClick={onClose} className="cursor-pointer">
              <ChevronLeft />
            </div>
            <h1 className="text-[20px] font-[800] text-gray-800">
              Code <span className="font-[300]">de la {dimension?.type} : {dimension?.code}</span>{" "}
           
            </h1>
          </div>
          {!isModify && (
            <div onClick={() => setIsModify(true)} className="cursor-pointer">
              <span className="text-[12px] text-blue-500">Modifier</span>
            </div>
          )}
        </div>
        <div className="mt-3">
          <Divider />
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
                  create
                  onChange={handleLibelleChange}
                  gray
                />
              </div>
            ) : (
              <div>
                <Input
                  element="input"
                  id="label"
                  type="text"
                  placeholder="Modifier le libellé"
                  value={libelle}
                  label="Libellé"
                  validators={[]}
                  disabled
                  create
                  onChange={handleLibelleChange}
                  gray
                />
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
                  Annuler
                </Button>
                <Button
                  size="small"
                  blue
                  onClick={() => setIsModalOpen(true)}
                  type="button"
                >
                  Modiifer {type}
                </Button>
              </div>
            </div>
          )}
        </div>
      </form>
    </section>
  );
}
