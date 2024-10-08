import React, { useState } from "react";
import Input from "../../components/FormElements/Input";
import Button from "../../components/FormElements/Button";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useNotify from "../../utils/hooks/useToast";
import { VALIDATOR_REQUIRE } from "../../utils/validator";
import { CircularProgress } from "@mui/material";
import { ChevronLeft } from "lucide-react";

interface FormData {
  code: number | null;
  label: string;
  creator_id: any;
  status: string;
}

interface UserFieldCreatePageProps {
  onCreate: (newFieldId: string) => void;
  onClose: () => void;
}

export default function BlockCreatePage({
  onCreate,
  onClose,
}: UserFieldCreatePageProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state: any) => state.auth.user);
  const { notifySuccess, notifyError } = useNotify();
  const [formData, setFormData] = useState<FormData>({
    code: null,
    label: "",
    creator_id: user._id,
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/block`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData), 
        }
      );

      if (response.ok) {
        const data = await response.json();
        const newFieldId = data._id;
        setFormData((prevFormData) => ({
          ...prevFormData,
          code: data.code,
        }));
        setTimeout(() => {
          notifySuccess("Taxe créée avec succès !");
          setIsLoading(false);
          onCreate(newFieldId);
          onClose();
        }, 100);
      } else {
        notifyError("Erreur lors de la création");
      }
    } catch (error) {
      console.error("Erreur lors de la requête", error);
      setIsLoading(false);
    }
  };

  return (
    <section className="w-full p-4">
      <form className="mb-[50px]" onSubmit={handleSubmit}>
        <div className="flex items-center gap-3">
          <div onClick={onClose} className="cursor-pointer">
            <ChevronLeft />
          </div>
          <h1 className="text-[20px] font-[800] text-gray-800">
            Créer <span className="font-[300]">un blocage</span>
          </h1>
        </div>
        <div className="mt-[30px] flex flex-col justify-between">
          <div className="flex flex-col">
     
            <Input
              element="input"
              id="label"
              type="text"
              placeholder="ex: Annulation fournisseur"
              label="Libellé"
              onChange={handleChange}
              validators={[VALIDATOR_REQUIRE()]}
              required
              create
              gray
            />

            {!isLoading ? (
              <div className="flex items-center gap-2 mt-5">
                <Button
                  size="small"
                  cancel
                  type="button"
                  onClick={() => navigate(-1)}
                >
                  Annuler
                </Button>
                <Button size="small" blue type="submit">
                  Créer le blocage
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
    </section>
  );
}
