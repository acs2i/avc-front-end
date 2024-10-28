import React, { useState, useEffect } from "react";
import Input from "../../components/FormElements/Input";
import Button from "../../components/FormElements/Button";
import { CircularProgress, Divider } from "@mui/material";
import useNotify from "../../utils/hooks/useToast";
import { ChevronLeft, Plus } from "lucide-react";

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
  onClose: () => void;
  onUpdateSuccess: (itemId: string) => void;
}

export default function UserFieldUpdatePage({
  selectedField,
  onClose,
  onUpdateSuccess,
}: UserFieldUpdatePageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isModify, setIsModify] = useState(false);
  const { notifySuccess, notifyError } = useNotify();
  const [formData, setFormData] = useState<Field>(selectedField);

  useEffect(() => {
    setFormData(selectedField);
  }, [selectedField]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
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

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/user-field/${formData._id}`,
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
        setIsModify(false);
        onUpdateSuccess(formData._id);
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

  const fieldTypeTranslations: { [key: string]: string } = {
    text: "Texte libre",
    multiple_choice: "Choix multiple",
    boolean: "Boolean",
    date: "Date",
  };

  return (
    <section className="w-full p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div onClick={onClose} className="cursor-pointer">
            <ChevronLeft />
          </div>
          <h1 className="text-[20px] font-[800] text-gray-800">
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
                  {/* Type selection options here */}
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
                {formData.additional_fields[0]?.field_type
                  ? fieldTypeTranslations[
                      formData.additional_fields[0].field_type
                    ] || formData.additional_fields[0].field_type
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
                type="button"
                onClick={() => handleUpdate()}
              >
                Modifier le champ utilisateur
              </Button>
            </div>
          </div>
        )}
      </div>

      {isLoading && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
          <CircularProgress />
        </div>
      )}
    </section>
  );
}