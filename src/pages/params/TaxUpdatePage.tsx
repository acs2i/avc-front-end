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

interface Tax {
  _id: string;
  code: string;
  label: string;
  rate: string;
  status: string;
  creator_id: any;
}
interface ClassificationUpdatePageProps {
  selectedTax: Tax;
  onUpdate: () => void;
  onClose: () => void;
}

interface FormData {
  creator_id: any;
  code: string;
  label: string;
  rate: string;
  status: string;
}

export default function TaxUpdatePage({
  selectedTax,
  onUpdate,
  onClose,
}: ClassificationUpdatePageProps) {
  const id = selectedTax._id;
  const user = useSelector((state: any) => state.auth.user);
  const [classification, setClassification] = useState<Tax | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModify, setIsModify] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { notifySuccess, notifyError } = useNotify();
  const [tax, setTax] = useState<Tax>();
  const [formData, setFormData] = useState<FormData>({
    creator_id: user._id,
    code: tax?.code || "",
    label: tax?.label || "",
    rate: tax?.rate || "",
    status: "A",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  useEffect(() => {
    if (selectedTax) {
      setClassification(selectedTax);
      setTax(selectedTax);
    }
  }, [selectedTax]);

  const fetchTax = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/tax/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      setTax(data);

      // Mettez à jour formData avec les données récupérées
      setFormData({
        creator_id: data.creator_id || user._id,
        code: data.code || "",
        label: data.label || "",
        rate: data.rate || "",
        status: data.status || "A",
      });
    } catch (error) {
      console.error("Erreur lors de la requête", error);
      notifyError("Erreur lors de la récupération des données");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTax();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      console.log("Submitting form data:", formData);
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/tax/${id}`,
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
        }, 100);
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
            <h1 className="text-[20px] font-[800] text-gray-800">
              Code <span className="font-[300]">{tax?.code}</span>{" "}
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
                  label="Libellé"
                  value={formData.label} // Assurez-vous d'utiliser formData pour gérer l'état
                  placeholder={tax?.label} // Vous pouvez garder le placeholder comme backup
                  validators={[]}
                  gray
                  create
                  onChange={handleChange}
                />
                <Input
                  element="input"
                  id="rate"
                  label="Taux"
                  value={formData.rate} // Utilisez formData pour garder la valeur modifiée ou non
                  placeholder={tax?.rate}
                  validators={[]}
                  gray
                  create
                  onChange={handleChange}
                />
              </div>
            ) : (
              <div>
                <Input
                  element="input"
                  id="label"
                  label="Libellé"
                  value={tax?.label}
                  placeholder={tax?.label}
                  disabled
                  validators={[]}
                  gray
                />
                <Input
                  element="input"
                  id="rate"
                  label="Taux"
                  type="text"
                  placeholder="Modifier le libellé"
                  value={`${tax?.rate} %`}
                  disabled
                  validators={[]}
                  create
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
