import React, { useState, useEffect } from "react";
import Input from "../../components/FormElements/Input";
import Button from "../../components/FormElements/Button";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useNotify from "../../utils/hooks/useToast";
import { VALIDATOR_REQUIRE } from "../../utils/validator";
import { CircularProgress } from "@mui/material";
import {
  Binary,
  CalendarRange,
  ChevronLeft,
  CircleDot,
  Plus,
  Space,
  TriangleAlert,
} from "lucide-react";

interface CustomField {
  field_name: string;
  field_type: string;
  options?: string[];
  default_value?: string;
  value?: string;
  hasUserSelectedDefault?: boolean;
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
      {
        field_name: "",
        field_type: "text",
        options: [],
        value: "",
        default_value: "",
      },
    ],
    status: "A",
  });

  // useEffect(() => {
  //   const fetchLastCode = async () => {
  //     try {
  //       const response = await fetch(`${process.env.REACT_APP_URL_DEV}/api/v1/user-field/last-code`, {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       });

  //       const data = await response.json();
  //       const lastCode = data.lastCode || 0;
  //       setFormData(prevFormData => ({ ...prevFormData, code: lastCode + 1 }));
  //     } catch (error) {
  //       console.error("Erreur lors de la récupération du dernier code", error);
  //     }
  //   };

  //   fetchLastCode();
  // }, []);

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
  
    if (type === "multiple_choice") {
      updatedFields[index].options = [""];
      updatedFields[index].default_value = "";
      updatedFields[index].hasUserSelectedDefault = false;
    } else if (type === "boolean") {
      updatedFields[index].options = ["Oui", "Non"];
      updatedFields[index].default_value = "Oui"; // Par défaut "Oui"
      updatedFields[index].hasUserSelectedDefault = false;
    } else {
      updatedFields[index].options = [];
      updatedFields[index].default_value = "";
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
    const newValue = e.target.value;
    updatedFields[fieldIndex].options![optionIndex] = newValue;

    // Si c'est la première option qui est modifiée ET qu'aucune valeur par défaut n'a été définie
    // ET que c'est la première fois qu'on modifie cette option
    if (
      optionIndex === 0 &&
      !updatedFields[fieldIndex].hasUserSelectedDefault &&
      !updatedFields[fieldIndex].default_value
    ) {
      updatedFields[fieldIndex].default_value = newValue;
      updatedFields[fieldIndex].hasUserSelectedDefault = true;
    }

    setFormData({ ...formData, additional_fields: updatedFields });
  };

  const handleDefaultValueChange = (fieldIndex: number, value: string) => {
    const updatedFields = [...formData.additional_fields];
    updatedFields[fieldIndex].default_value = value;
    updatedFields[fieldIndex].hasUserSelectedDefault = true;
    setFormData({ ...formData, additional_fields: updatedFields });
  };

  const isLastOptionEmpty = (fieldIndex: number) => {
    const options = formData.additional_fields[fieldIndex].options || [];
    return options.length > 0 && options[options.length - 1] === "";
  };

  const addOption = (fieldIndex: number) => {
    // Vérifier si la dernière option est vide
    if (isLastOptionEmpty(fieldIndex)) {
      return; // Ne rien faire si la dernière option est vide
    }

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
      } else if (response.status === 409) {
        notifyError("Le code existe déjà");
        setIsLoading(false);
      } else {
        notifyError("Erreur lors de la création");
      }
    } catch (error) {
      console.error("Erreur lors de la requête", error);
      notifyError("Erreur lors de la création");
    } finally {
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
            Créer <span className="font-[300]">un champ utilisateur</span>
          </h1>
        </div>
        <div className="w-full bg-yellow-400 mt-3 p-4 text-yellow-800 text-[15px] rounded-md shadow-md font-semibold flex gap-2 border-[1px] border-orange-400">
          <div>
            <TriangleAlert size={20} />
          </div>
          <p>
            Vous êtes sur le point de créer un nouveau champ utilisateur. Si
            cette nouvelle information doit être communiquée vers d’autres
            applications merci de contacter Acs2i pour que les interfaces soient
            adaptées en conséquence.
          </p>
        </div>
        <div className="mt-3 flex flex-col justify-between">
          <div className="flex flex-col">
            <Input
              element="select"
              id="apply_to"
              label="S'applique à"
              onChange={handleChange}
              validators={[VALIDATOR_REQUIRE()]}
              placeholder="Choisir la liaison"
              options={[
                { value: "Produit", label: "Produit", name: "Produit" },
                {
                  value: "Fournisseur",
                  label: "Fournisseur",
                  name: "Fournisseur",
                },
              ]}
              required
              create
              gray
            />
            <Input
              element="input"
              id="label"
              type="text"
              placeholder="Nom du champ"
              label="Nom du champ"
              onChange={handleChange}
              validators={[VALIDATOR_REQUIRE()]}
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
                      onClick={() => handleFieldTypeSelection(index, "boolean")}
                    >
                      <h3 className="text-md font-bold text-center">Boolean</h3>
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
                      onClick={() => handleFieldTypeSelection(index, "date")}
                    >
                      <h3 className="text-md font-bold text-center">
                        Date{" "}
                        <span className="text-[12px] italic">
                          (Jour/Mois/Année)
                        </span>
                      </h3>
                      <div className="flex items-center justify-center">
                        <CalendarRange />
                      </div>
                    </div>
                  </div>
                </div>

                {field.field_type === "multiple_choice" && (
                  <div className="mt-4">
                    {field.options!.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-end gap-2">
                        <Input
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
                        <input
                          type="radio"
                          checked={field.default_value === option}
                          onChange={() =>
                            handleDefaultValueChange(index, option)
                          }
                          className="h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                          name={`default-value-${index}`}
                        />
                        <label className="text-gray-700 text-sm">
                          Par défaut
                        </label>
                      </div>
                    ))}
                    <div
                      className={`mt-3 flex items-center gap-2 ${
                        isLastOptionEmpty(index)
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-orange-400 cursor-pointer hover:text-orange-300"
                      }`}
                      onClick={() =>
                        !isLastOptionEmpty(index) && addOption(index)
                      }
                    >
                      <Plus size={15} />
                      <span className="font-bold text-[13px]">
                        Ajouter une option
                      </span>
                    </div>
                  </div>
                )}
                {field.field_type === "boolean" && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Valeur par défaut
                    </label>
                    <div className="flex gap-4">
                      {["Oui", "Non"].map((option) => (
                        <div key={option} className="flex items-center gap-2">
                          <input
                            type="radio"
                            checked={
                              field.default_value === option ||
                              (!field.default_value && option === "Oui") // Par défaut, "Oui" est coché
                            }
                            onChange={() =>
                              handleDefaultValueChange(index, option)
                            }
                            className="h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                            name={`default-value-${index}`}
                          />
                          <label className="text-gray-700">{option}</label>
                        </div>
                      ))}
                    </div>
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
