import React, { useEffect, useState } from "react";
import Card from "../../components/Shared/Card";
import Input from "../../components/FormElements/Input";
import Button from "../../components/FormElements/Button";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useNotify from "../../utils/hooks/useToast";
import { VALIDATOR_REQUIRE } from "../../utils/validator";
import { CircularProgress } from "@mui/material";
import { ChevronLeft, Plus, X } from "lucide-react";

interface FormData {
  code: string;
  label: string;
  status: string;
  creator_id: any;
}

interface CollectionCreatePageProps {
  onCreate: (newCollectionId: string) => void;
  onClose: () => void;
}

export default function CollectionCreatePage({
  onCreate,
  onClose,
}: CollectionCreatePageProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState("");
  const user = useSelector((state: any) => state.auth.user);
  const { notifySuccess, notifyError } = useNotify();
  const [formData, setFormData] = useState<FormData>({
    creator_id: user._id,
    code: "",
    label: "",
    status: "A",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors("");

    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/collection`,
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
        const newCollectionId = data._id;
        setTimeout(() => {
          notifySuccess("Collection crée avec succès !");
          setIsLoading(false);
          onCreate(newCollectionId);
          onClose();
        }, 100);
      } else {
        if (response.status === 409) {
          const errorData = await response.json();
          setErrors("Code déjà existant.");
        } else {
          setErrors("Erreur lors de la création de la collection.");
        }
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Erreur lors de la requête", error);
      setErrors("Erreur lors de la requête");
      notifyError("Erreur lors de la requête");
      setIsLoading(false);
    }
  };

  console.log(formData);

  return (
    <section className="w-full p-4">
      <form className="mb-[50px]" onSubmit={handleSubmit}>
        <div className="flex items-center gap-3">
          <div onClick={onClose} className="cursor-pointer">
            <ChevronLeft />
          </div>
          <h1 className="text-[20px] font-[800] text-gray-800">
            Créer <span className="font-[300]">une collection</span>
          </h1>
        </div>
        <div className="mt-[30px] flex flex-col justify-between">
          <div className="flex flex-col">
            <Input
              element="input"
              id="code"
              label="Code"
              placeholder="ex: 456"
              onChange={handleChange}
              validators={[VALIDATOR_REQUIRE()]}
              required
              create
              gray
              maxLength={3}
            />
            <Input
              element="input"
              id="label"
              type="text"
              placeholder="Nom de la collection"
              label="Libellé"
              onChange={handleChange}
              validators={[VALIDATOR_REQUIRE()]}
              required
              create
              gray
              maxLength={50}
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
                <Button size="small" green blue type="submit">
                  Créer une collection
                </Button>
              </div>
            ) : (
              <div className="mt-3">
                <CircularProgress />
              </div>
            )}
          </div>
        </div>
        {errors && (
          <div className="w-full bg-red-400 mt-4 p-4 rounded-md shadow-md">
            <span className="text-white font-bold">{errors}</span>
          </div>
        )}
      </form>
    </section>
  );
}
