import React, { useState, useEffect } from "react";
import Input from "../../components/FormElements/Input";
import Button from "../../components/FormElements/Button";
import { CircularProgress, Divider } from "@mui/material";
import useNotify from "../../utils/hooks/useToast";
import { ChevronLeft } from "lucide-react";
import { useSelector } from "react-redux";
import { formatDate } from "../../utils/func/formatDate";

interface Tag {
  _id: string;
  code: string;
  name: string;
  level: string;
  tag_grouping_id: any;
  additional_fields?: any;
  status: string;
  updates: any;
}

interface UpdateEntry {
  updated_at: Date;
  updated_by: string;
  changes: Record<string, any>;
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
  const user = useSelector((state: any) => state.auth.user);

  useEffect(() => {
    setFormData(selectedFamily);
  }, [selectedFamily]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleUpdate = async (isStatusUpdate = false, newStatus = '') => {
    setIsLoading(true);

    const updatedData = isStatusUpdate
      ? { status: newStatus || (formData.status === 'A' ? 'I' : 'A') }
      : Object.keys(formData).reduce((acc, key) => {
          const typedKey = key as keyof Tag;
          if (formData[typedKey] !== selectedFamily[typedKey]) {
            acc[typedKey] = formData[typedKey];
          }
          return acc;
        }, {} as Partial<Tag>);

    const updateEntry: UpdateEntry = {
      updated_at: new Date(),
      updated_by: user.username,
      changes: updatedData,
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/tag/${formData._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...updatedData, updateEntry }),
        }
      );

      if (response.ok) {
        let message = "Classification modifiée avec succès !";
        if (isStatusUpdate) {
          message = updatedData.status === 'A' 
            ? "Classification réactivée avec succès !" 
            : "Classification désactivée avec succès !";
        }
        notifySuccess(message);
        setIsModify(false);
        onUpdateSuccess(formData._id);
        onClose();
      } else {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        let errorMessage = "Erreur lors de la modification";
        if (isStatusUpdate) {
          errorMessage = updatedData.status === 'A'
            ? "Erreur lors de la réactivation"
            : "Erreur lors de la désactivation";
        }
        notifyError(errorMessage);
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
            Code{" "}
            <span className="font-[300]">
              de la {formData.level} : {formData.code}
            </span>{" "}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          {!isModify && formData.status !== 'I' && (
            <div onClick={() => setIsModify(true)} className="cursor-pointer">
              <span className="text-[12px] text-blue-500">Modifier</span>
            </div>
          )}
          {formData.status === 'I' && (
            <div onClick={() => handleUpdate(true, 'A')} className="cursor-pointer">
              <span className="text-[12px] text-green-500">Réactiver</span>
            </div>
          )}
          {formData.status === 'A' && (
            <div onClick={() => handleUpdate(true, 'I')} className="cursor-pointer">
              <span className="text-[12px] text-red-500">Désactiver</span>
            </div>
          )}
        </div>
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
            disabled={!isModify || formData.status === 'I'}
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
              onClick={() => handleUpdate(false)}
            >
              Modifier
            </Button>
          </div>
        </div>
      )}

      {selectedFamily.updates && (
        <div className="mt-[30px] flex flex-col gap-3 relative">
          <h6 className="text-xs font-[700] text-gray-700">
            Historique des modifications :
          </h6>
          <div className="pl-6 relative h-[700px] overflow-y-scroll relative">
            {selectedFamily.updates
              .slice()
              .sort((a: { updated_at: string }, b: { updated_at: string }) => {
                return (
                  new Date(b.updated_at).getTime() -
                  new Date(a.updated_at).getTime()
                );
              })
              .map((update: any, index: number) => (
                <div key={index} className="relative mb-4 flex items-start">
                  <div className="absolute left-[-22px] top-[50%] w-3 h-3 bg-blue-600 rounded-full"></div>
                  <div className="bg-gray-100 w-full p-2 rounded-md shadow-md">
                    <p className="text-[12px] italic">
                      <span className="text-blue-500">
                        Modifié le : {formatDate(update.updated_at)}
                      </span>{" "}
                      par{" "}
                      <span className="capitalize">{update.updated_by}</span>
                    </p>
                    <div className="text-[13px] text-gray-500 font-[500]">
                      {Object.entries(update.changes).map(([key, value]) => (
                        <p key={key}>
                          Modification du Libellé en <span className="font-bold">{String(value)}</span>
                        </p>
                      ))}
                    </div>
                    <p className="text-[13px] text-gray-500 font-[500]">
                      Fichier exporté : {update.file_name}
                    </p>
                  </div>
                </div>
              ))}
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