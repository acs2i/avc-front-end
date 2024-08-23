import React, { useEffect, useState } from "react";
import Input from "../../components/FormElements/Input";
import Button from "../../components/FormElements/Button";
import { useNavigate } from "react-router-dom";
import useFetch from "../../utils/hooks/usefetch";
import { CircularProgress, Divider } from "@mui/material";
import useNotify from "../../utils/hooks/useToast";
import Modal from "../../components/Shared/Modal";
import {
  Binary,
  CalendarRange,
  ChevronLeft,
  CircleDot,
  Plus,
  Space,
} from "lucide-react";

interface CustomField {
  field_name: string;
  field_type: string;
  options?: string[];
  value?: string;
}

interface Field {
  _id: string;
  code: string;
  label: string;
  status: string;
  creator_id: any;
  additional_fields: CustomField[];
}

interface UserFieldUpdatePageProps {
  selectedField: Field;
  onUpdate: () => void;
  onClose: () => void;
}

interface FormData {
  code: string;
  label: string;
  additional_fields: CustomField[];
}

export default function UserFieldUpdatePage({
  selectedField,
  onUpdate,
  onClose,
}: UserFieldUpdatePageProps) {
  const id = selectedField._id;
  const { notifySuccess, notifyError } = useNotify();
  const [isModify, setIsModify] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { data: field } = useFetch<Field>(
    `${process.env.REACT_APP_URL_DEV}/api/v1/user-field/${id}`
  );
  const [formData, setFormData] = useState<FormData>({
    code: "1",
    label: "",
    additional_fields: [],
  });

  useEffect(() => {
    if (field) {
      setFormData({
        label: field.label,
        code: field.code,
        additional_fields: field.additional_fields || [],
      });
    }
  }, [field]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleAdditionalFieldChange = (
    index: number,
    fieldIndex: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const updatedFields = [...formData.additional_fields];
    updatedFields[fieldIndex].options![index] = e.target.value;
    setFormData({ ...formData, additional_fields: updatedFields });
  };

  const handleFieldTypeSelection = (index: number, type: string) => {
    const updatedFields = [...formData.additional_fields];
    updatedFields[index].field_type = type;
    updatedFields[index].options = type === "boolean" ? ["", ""] : [""];
    setFormData({ ...formData, additional_fields: updatedFields });
  };

  const addOption = (index: number) => {
    const updatedFields = [...formData.additional_fields];
    updatedFields[index].options!.push("");
    setFormData({ ...formData, additional_fields: updatedFields });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/user-field/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      if (response.ok) {
        notifySuccess("Champ utilisateur modifié avec succès !");
        setIsLoading(false);
        onUpdate();
        onClose();
      } else {
        notifyError("Erreur lors de la modification !");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fieldTypeTranslations: { [key: string]: string } = {
    text: "Texte libre",
    multiple_choice: "Choix multiple",
    boolean: "Boolean",
    date: "Date",
  };

  return (
    <section className="w-full p-4">
      <Modal
        show={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onClose={() => setIsModalOpen(false)}
        header="Confirmation de modification du champ utilisateur"
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
              cancel
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

      <form onSubmit={handleSubmit} className="mb-[50px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div onClick={onClose} className="cursor-pointer">
              <ChevronLeft />
            </div>
            <h1 className="text-[20px] font-bold text-gray-800">
              Numéro du champ utilisateur : {formData.code}
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
              id="label"
              type="text"
              placeholder="Nom du champ"
              label="Nom du champ"
              value={formData.label}
              onChange={handleInputChange}
              validators={[]}
              create
              gray
              disabled={!isModify}
            />
          </div>

          {isModify ? (
            <div className="mt-5">
              {formData.additional_fields.map((field, fieldIndex) => (
                <div key={fieldIndex} className="mt-4">
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
                      onClick={() =>
                        handleFieldTypeSelection(fieldIndex, "text")
                      }
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
                        handleFieldTypeSelection(fieldIndex, "multiple_choice")
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
                        handleFieldTypeSelection(fieldIndex, "boolean")
                      }
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
                      onClick={() =>
                        handleFieldTypeSelection(fieldIndex, "date")
                      }
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

                  {(field.field_type === "multiple_choice" ||
                    field.field_type === "boolean") && (
                    <div className="mt-4">
                      {field.options!.map((option: any, optionIndex: any) => (
                        <Input
                          key={optionIndex}
                          element="input"
                          id={`option_${optionIndex}`}
                          label={`Option ${optionIndex + 1}`}
                          placeholder={`Option ${optionIndex + 1}`}
                          value={option}
                          onChange={(e) =>
                            handleAdditionalFieldChange(
                              optionIndex,
                              fieldIndex,
                              e as React.ChangeEvent<HTMLInputElement>
                            )
                          }
                          validators={[]}
                          create
                          gray
                          disabled={!isModify}
                        />
                      ))}
                      {field.field_type === "multiple_choice" && isModify && (
                        <div
                          className="mt-3 flex items-center gap-2 text-orange-400 cursor-pointer hover:text-orange-300"
                          onClick={() => addOption(fieldIndex)}
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
            </div>
          ) : (
            <div className="mt-4">
              <h2 className="text-sm font-[700]">Type de champ</h2>
              <div
                className={`w-[100px] h-[100px] cursor-pointer p-4 border rounded-lg mt-2 flex items-center justify-center bg-gray-200 text-gray-700 shadow-[0_0_10px_rgba(0,0,0,0.3)]`}
              >
                <h3 className="text-md font-bold text-center capitalize">
                  {field?.additional_fields[0]?.field_type
                    ? fieldTypeTranslations[
                        field.additional_fields[0].field_type
                      ] || field.additional_fields[0].field_type
                    : "Type inconnu"}
                </h3>
              </div>
            </div>
          )}

          {isModify && (
            <div className="w-full mt-6">
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
                  Modifier le champ utilisateur
                </Button>
              </div>
            </div>
          )}
        </div>
      </form>
    </section>
  );
}
