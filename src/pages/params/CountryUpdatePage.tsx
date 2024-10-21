import React, { useState, useEffect } from "react";
import Input from "../../components/FormElements/Input";
import Button from "../../components/FormElements/Button";
import { CircularProgress, Divider } from "@mui/material";
import useNotify from "../../utils/hooks/useToast";
import Modal from "../../components/Shared/Modal";
import { ChevronLeft } from "lucide-react";
import { useSelector } from "react-redux";

interface Country {
  _id: string;
  countryName: string;
  alpha2Code: string;
  alpha3Code: string;
  numeric: string;
  status: string;
  creator_id: any;
}

interface CountryUpdatePageProps {
  selectedCountry: Country;
  onClose: () => void;
  onUpdateSuccess: () => void;
}

export default function CountryUpdatePage({
  selectedCountry,
  onClose,
  onUpdateSuccess,
}: CountryUpdatePageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isModify, setIsModify] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { notifySuccess, notifyError } = useNotify();
  const [formData, setFormData] = useState<Country>(selectedCountry);
  const user = useSelector((state: any) => state.auth.user);

  useEffect(() => {
    setFormData(selectedCountry);
  }, [selectedCountry]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/iso-code/${formData._id}`,
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
        notifySuccess("Pays modifié avec succès !");
        setIsModify(false);
        setIsModalOpen(false);
        onUpdateSuccess();
        onClose();
      } else {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        notifyError("Erreur lors de la modification");
      }
    } catch (error) {
      console.error("Erreur lors de la soumission", error);
      notifyError("Erreur lors de la soumission");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  return (
    <section className="w-full p-4">
      <Modal
        show={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onClose={() => setIsModalOpen(false)}
        header="Confirmation de modification du pays"
        onSubmit={handleUpdate}
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
            <Button size="small" blue onClick={handleUpdate} type="button">
              Oui
            </Button>
          </div>
        ) : (
          <div className="flex justify-end mt-7 px-7 gap-2">
            <CircularProgress />
          </div>
        )}
      </Modal>
      <form onSubmit={handleSubmit}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div onClick={onClose} className="cursor-pointer">
              <ChevronLeft />
            </div>
            <h1 className="text-[20px] font-[800] text-gray-800">
              Pays <span className="font-[300]">{formData.countryName}</span>{" "}
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
            <Input
              element="input"
              id="countryName"
              label="Nom du pays"
              value={formData.countryName}
              onChange={handleInputChange}
              validators={[]}
              gray
              create
              disabled={!isModify}
            />
            <Input
              element="input"
              id="alpha2Code"
              label="Code Alpha-2"
              value={formData.alpha2Code}
              onChange={handleInputChange}
              validators={[]}
              gray
              create
              disabled={!isModify}
            />
            <Input
              element="input"
              id="alpha3Code"
              label="Code Alpha-3"
              value={formData.alpha3Code}
              onChange={handleInputChange}
              validators={[]}
              gray
              create
              disabled={!isModify}
            />
            <Input
              element="input"
              id="numeric"
              label="Code Numérique"
              value={formData.numeric}
              onChange={handleInputChange}
              validators={[]}
              gray
              create
              disabled={!isModify}
            />
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
                type="submit"
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