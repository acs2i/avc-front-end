import React, { useState, useEffect } from "react";
import Input from "../../components/FormElements/Input";
import Button from "../../components/FormElements/Button";
import { CircularProgress, Divider } from "@mui/material";
import useNotify from "../../utils/hooks/useToast";
import { ChevronLeft } from "lucide-react";

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
  onClose: () => void;
  onUpdateSuccess: (itemId: string) => void;
}

export default function ClassificationUpdatePage({
  selectedFamily,
  onClose,
  onUpdateSuccess,
}: ClassificationUpdatePageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isModify, setIsModify] = useState(false);
  const { notifySuccess, notifyError } = useNotify();
  const [formData, setFormData] = useState<Tag>(selectedFamily);

  useEffect(() => {
    setFormData(selectedFamily);
  }, [selectedFamily]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/tag/${formData._id}`,
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
        notifySuccess("Classification modifiée avec succès !");
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

  return (
    <section className="w-full p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div onClick={onClose} className="cursor-pointer">
            <ChevronLeft />
          </div>
          <h1 className="text-[20px] font-[800] text-gray-800">
            Code <span className="font-[300]">de la {formData.level} : {formData.code}</span>{" "}
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
            id="level"
            label="Niveau"
            value={formData.level}
            placeholder={formData.level}
            disabled
            validators={[]}
            gray
            create
          />
          <Input
            element="input"
            id="name"
            type="text"
            placeholder="Modifier le libellé"
            value={formData.name}
            label="Libellé"
            validators={[]}
            create
            onChange={handleInputChange}
            gray
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
              type="button"
              onClick={() => handleUpdate()}
            >
              Modifier
            </Button>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
          <CircularProgress />
        </div>
      )}
    </section>
  );
}