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

interface Country {
  _id: string;
  countryName: string;
  alpha2Code: string;
  alpha3Code: string;
  numeric: string;
  status: string;
  creator_id: any;
}

interface ClassificationUpdatePageProps {
  selectedCountry: Country;
  onUpdate: () => void;
  onClose: () => void;
}

interface FormData {
  creator_id: any;
  countryName: string;
  alpha2Code: string;
  alpha3Code: string;
  numeric: string;
  status: string;
}

export default function CountryUpdatePage({
  selectedCountry,
  onUpdate,
  onClose,
}: ClassificationUpdatePageProps) {
  const id = selectedCountry._id;
  const user = useSelector((state: any) => state.auth.user);
  const [isLoading, setIsLoading] = useState(false);
  const [isModify, setIsModify] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { notifySuccess, notifyError } = useNotify();
  const [country, setCountry] = useState<Country>();
  const [formData, setFormData] = useState<FormData>({
    creator_id: user._id,
    alpha2Code: country?.alpha2Code || "",
    alpha3Code: country?.alpha3Code || "",
    numeric: country?.numeric || "",
    countryName: country?.countryName || "",
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
    if (selectedCountry) {
      setCountry(selectedCountry);
    }
  }, [selectedCountry]);

  const fetchTax = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/iso-code/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      setCountry(data);

      // Mettez à jour formData avec les données récupérées
      setFormData({
        creator_id: data.creator_id || user._id,
        alpha2Code: data.alpha2Code || "",
        alpha3Code: data.alpha3Code || "",
        numeric: data.numeric || "",
        countryName: data.countryName || "",
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
        `${process.env.REACT_APP_URL_DEV}/api/v1/country/${id}`,
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
              Pays <span className="font-[300]">{country?.countryName}</span>{" "}
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
                  value={formData.countryName} 
                  placeholder={country?.countryName}
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
                  value={country?.countryName}
                  placeholder={country?.countryName}
                  disabled
                  validators={[]}
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
