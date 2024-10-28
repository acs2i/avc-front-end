import React, { useState, useEffect } from "react";
import Input from "../../components/FormElements/Input";
import Button from "../../components/FormElements/Button";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useNotify from "../../utils/hooks/useToast";
import { VALIDATOR_REQUIRE } from "../../utils/validator";
import { CircularProgress } from "@mui/material";
import { Binary, CalendarRange, ChevronLeft, CircleDot, Plus, Space } from "lucide-react";

interface CustomField {
  field_name: string;
  field_type: string;
  options?: string[];
  value?: string;
}

interface FormData {
  code: number | null;
  label: string;
  apply_to: string;
  additional_fields: CustomField[];
  status: string;
}

interface UserFieldCreatePageProps {
  onCreate: (newFieldId: string) => void;
  onClose: () => void;
}

export default function UserFieldCreatePage({
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
    apply_to: "",
    additional_fields: [
      { field_name: "", field_type: "text", options: [], value: "" }
    ],
    status: "A",
  });


  useEffect(() => {
    const fetchLastCode = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_URL_DEV}/api/v1/user-field/last-code`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        const lastCode = data.lastCode || 0; 
        setFormData(prevFormData => ({ ...prevFormData, code: lastCode + 1 }));
      } catch (error) {
        console.error("Erreur lors de la récupération du dernier code", error);
      }
    };

    fetchLastCode();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleAdditionalFieldChange = (
    index: number,
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const updatedFields = [...formData.additional_fields];
    updatedFields[index] = {
      ...updatedFields[index],
      [e.target.id]: e.target.value,
    };
    setFormData({ ...formData, additional_fields: updatedFields });
  };

  const handleFieldTypeSelection = (index: number, type: string) => {
    const updatedFields = [...formData.additional_fields];
    updatedFields[index].field_type = type;
    
    // Pas besoin de définir des options pour boolean pendant la création
    if (type === "multiple_choice") {
      updatedFields[index].options = [""];
    } else {
      updatedFields[index].options = [];
    }
    
    updatedFields[index].value = updatedFields[index].value || "";
    setFormData({ ...formData, additional_fields: updatedFields });
  };
  
  

  const handleOptionChange = (
    fieldIndex: number,
    optionIndex: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const updatedFields = [...formData.additional_fields];
    updatedFields[fieldIndex].options![optionIndex] = e.target.value;
    setFormData({ ...formData, additional_fields: updatedFields });
  };

  const addOption = (fieldIndex: number) => {
    const updatedFields = [...formData.additional_fields];
    updatedFields[fieldIndex].options!.push("");
    setFormData({ ...formData, additional_fields: updatedFields });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/user-field`,
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
          notifySuccess("Champ utilisateur créé avec succès !");
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

  console.log(formData)
  return (
    <section className="w-full p-4">
      <form className="mb-[50px]" onSubmit={handleSubmit}>
        <div className="flex items-center gap-3">
          <div onClick={onClose} className="cursor-pointer">
            <ChevronLeft />
          </div>
          <h1 className="text-[20px] font-[800] text-gray-800">
            Créer <span className="font-[300]">un champ utilisateur</span>
          </h1>
        </div>
        <div className="mt-[30px] flex flex-col justify-between">
          <div className="flex flex-col">
            <Input
              element="input"
              id="label"
              type="text"
              placeholder="Nom du champ"
              label="Nom du champ"
              onChange={handleChange}
              validators={[]}
              required
              create
              gray
            />
           <Input
              element="select"
              id="apply_to"
              label="S'applique à"
              onChange={handleChange}
              validators={[]}
              placeholder="Choisir la liaison"
              options={[
                { value: "Produit", label: "Produit", name: "Produit" },
                { value: "Fournisseur", label: "Fournisseur", name: "Fournisseur" }
              ]}
              required
              create
              gray
            />
            {formData.additional_fields.map((field, index) => (
              <div key={index} className="mt-2">
                <div className="mt-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Type de champ
                  </label>
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div
                      className={`cursor-pointer p-4 border rounded-lg ${
                        field.field_type === "text"
                          ? "bg-blue-500 text-white"
                          : "bg-white text-gray-800"
                      }`}
                      onClick={() => handleFieldTypeSelection(index, "text")}
                    >
                      <h3 className="text-md font-bold text-center">
                        Texte libre
                      </h3>
                      <div className="flex items-center justify-center">
                        <Space />
                      </div>
                    </div>

                    <div
                      className={`cursor-pointer p-4 border rounded-lg ${
                        field.field_type === "multiple_choice"
                          ? "bg-blue-500 text-white"
                          : "bg-white text-gray-800"
                      }`}
                      onClick={() =>
                        handleFieldTypeSelection(index, "multiple_choice")
                      }
                    >
                      <h3 className="text-md font-bold text-center">
                        Choix multiple
                      </h3>
                      <div className="flex items-center justify-center">
                        <CircleDot />
                      </div>
                    </div>

                    <div
                      className={`cursor-pointer p-4 border rounded-lg ${
                        field.field_type === "boolean"
                          ? "bg-blue-500 text-white"
                          : "bg-white text-gray-800"
                      }`}
                      onClick={() =>
                        handleFieldTypeSelection(index, "boolean")
                      }
                    >
                      <h3 className="text-md font-bold text-center">
                        Boolean
                      </h3>
                      <div className="flex items-center justify-center">
                        <Binary />
                      </div>
                    </div>

                    <div
                      className={`cursor-pointer p-4 border rounded-lg ${
                        field.field_type === "date"
                          ? "bg-blue-500 text-white"
                          : "bg-white text-gray-800"
                      }`}
                      onClick={() =>
                        handleFieldTypeSelection(index, "date")
                      }
                    >
                      <h3 className="text-md font-bold text-center">
                        Date <span className="text-[12px] italic">(Jour/Mois/Année)</span>
                      </h3>
                      <div className="flex items-center justify-center">
                        <CalendarRange />
                      </div>
                    </div>
                  </div>
                </div>

                {(field.field_type === "multiple_choice" || field.field_type === "boolean") && (
                  <div className="mt-4">
                    {field.options!.map((option, optionIndex) => (
                      <Input
                        key={optionIndex}
                        element="input"
                        id={`option_${optionIndex}`}
                        label={`Option ${optionIndex + 1}`}
                        placeholder={`Option ${optionIndex + 1}`}
                        onChange={(e) =>
                          handleOptionChange(
                            index,
                            optionIndex,
                            e as React.ChangeEvent<HTMLInputElement>
                          )
                        }
                        validators={[]}
                        value={option}
                        required
                        create
                        gray
                      />
                    ))}
                    {field.field_type === "multiple_choice" && (
                      <div
                        className="mt-3 flex items-center gap-2 text-orange-400 cursor-pointer hover:text-orange-300"
                        onClick={() => addOption(index)}
                      >
                        <Plus size={15} />
                        <span className="font-bold text-[13px]">
                          Ajouter une option
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

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
                  Créer le champ utilisateur
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
