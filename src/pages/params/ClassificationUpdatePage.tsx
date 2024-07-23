import Card from "../../components/Shared/Card";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Input from "../../components/FormElements/Input";
import Button from "../../components/FormElements/Button";
import { CircularProgress, Divider } from "@mui/material";
import useNotify from "../../utils/hooks/useToast";
import Modal from "../../components/Shared/Modal";
import { ChevronLeft } from "lucide-react";
import { useSelector } from "react-redux";

interface Tag {
  _id: string;
  code: string;
  name: string;
  level: string;
  tag_grouping_id: any;
  additional_fields?: any;
  status: string;
}

interface ClassificationUpdatePageProps {
  selectedFamily: Tag;
  onUpdate: () => void;
  onClose: () => void;
}

interface FormData {
  creator_id: any;
  code: string;
  name: string;
  level: string;
  tag_grouping_id: any;
  status: string;
}

export default function ClassificationUpdatePage({
  selectedFamily,
  onUpdate,
  onClose,
}: ClassificationUpdatePageProps) {
  const id = selectedFamily._id;
  const user = useSelector((state: any) => state.auth.user);
  const [classification, setClassification] = useState<Tag | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModify, setIsModify] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { notifySuccess, notifyError } = useNotify();
  const [family, setFamily] = useState<Tag>();
  const [libelle, setLibelle] = useState("");
  const [type, setType] = useState("");
  const [code, setCode] = useState("");
  const [formData, setFormData] = useState<FormData>({
    creator_id: user._id,
    code: "",
    name: "",
    level: "",
    tag_grouping_id: "",
    status: "A",
  });

  const handleLibelleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLibelle(e.target.value);
    setFormData((prevFormData) => ({
      ...prevFormData,
      name: e.target.value,
    }));
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setType(e.target.value);
    setFormData((prevFormData) => ({
      ...prevFormData,
      level: e.target.value,
    }));
  };

  useEffect(() => {
    if (family) {
      setLibelle(family.name);
      setCode(family.code);
      setFormData((prevFormData) => ({
        ...prevFormData,
        level: family.level,
        code: family.code,
        name: family.name,
        tag_grouping_id: family.tag_grouping_id,
        status: family.status,
      }));
    }
  }, [family]);

  useEffect(() => {
    if (selectedFamily) {
      setClassification(selectedFamily);
      setFamily(selectedFamily);
    }
  }, [selectedFamily]);

  const fetchFamily = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/tag/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      console.log("Fetched data:", data);
      setFamily(data);
    } catch (error) {
      console.error("Erreur lors de la requête", error);
      notifyError("Erreur lors de la récupération des données");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFamily();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      console.log("Submitting form data:", formData);
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/tag/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      if (response.ok) {
        const data = await response.json();
        console.log("Updated data:", data);
        setTimeout(() => {
          notifySuccess("Classification modifiée avec succès !");
          setIsLoading(false);
          onUpdate();
          onClose();
        }, 1000);
      } else {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        notifyError("Erreur lors de la modification");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Erreur lors de la soumission", error);
      notifyError("Erreur lors de la soumission");
      setIsLoading(false);
    }
  };
  console.log(formData);
  return (
    <section className="w-full p-4">
      <Modal
        show={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onClose={() => setIsModalOpen(false)}
        header="Confirmation de modification de la classe"
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
      <form className="mb-[50px]" onSubmit={handleSubmit}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div onClick={onClose} className="cursor-pointer">
              <ChevronLeft />
            </div>
            <h1 className="text-[20px] font-bold text-gray-800">
              Code de la <span className="font-bold">{type} :</span>{" "}
              {family?.code}
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
                  id="level"
                  label="Niveau"
                  value={family?.level}
                  placeholder={family?.level}
                  disabled
                  validators={[]}
                  gray
                  create
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
                  create
                  onChange={handleLibelleChange}
                  gray
                />
              </div>
            ) : (
              <div>
                <Input
                  element="input"
                  id="level"
                  label="Niveau"
                  value={family?.level}
                  placeholder={family?.level}
                  disabled
                  validators={[]}
                  gray
                  create
                  onChange={handleTypeChange}
                />
                <Input
                  element="input"
                  id="label"
                  type="text"
                  placeholder="Modifier le libellé"
                  value={libelle}
                  label="Libellé"
                  disabled
                  validators={[]}
                  create
                  onChange={handleLibelleChange}
                  gray
                />
              </div>
            )}
          </div>
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
                Modifier
              </Button>
            </div>
          </div>
        )}
      </form>
    </section>
  );
}
