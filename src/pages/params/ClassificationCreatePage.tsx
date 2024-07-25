import React, { useEffect, useState } from "react";
import Card from "../../components/Shared/Card";
import Input from "../../components/FormElements/Input";
import { ChevronLeft, Plus, X } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useNotify from "../../utils/hooks/useToast";
import Button from "../../components/FormElements/Button";
import { CircularProgress } from "@mui/material";

interface Tag {
  _id: string;
  code: string;
  name: string;
  level: string;
  tag_grouping_id: any;
}

interface TagGrouping {
  _id: string;
  name: string;
  level: string[];
}

interface ClassificationCreatePageProps {
  onCreate: (newFamilyId: string) => void;
  onClose: () => void;
}

interface FormData {
  creator_id: any;
  code: string;
  name: string;
  level: string;
  tag_grouping_id: any;
  status: string;
}

interface Option {
  value: string;
  label: string;
  name: string;
}

function ClassificationCreatePage({
  onCreate,
  onClose,
}: ClassificationCreatePageProps) {
  const user = useSelector((state: any) => state.auth.user);
  const [classificationValue, setClassificationValue] = useState("");
  const [levelOptions, setLevelOptions] = useState<Option[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { notifySuccess, notifyError } = useNotify();
  const [tagGrouping, setTagGrouping] = useState<TagGrouping[]>([]);
  const [formData, setFormData] = useState<FormData>({
    creator_id: user._id,
    code: "",
    name: "",
    level: "",
    tag_grouping_id: "",
    status: "A",
  });

  const navigate = useNavigate();

  const fetchTagGrouping = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/tag-grouping`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      setTagGrouping(data.data);
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/tag`,
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
        const newFamilyId = data._id;
        setTimeout(() => {
          notifySuccess("Classification créée avec succès !");
          setIsLoading(false);
          onCreate(newFamilyId);
          onClose();
        }, 100);
      } else {
        notifyError("Erreur lors de la création");
      }
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleClassificationChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { value } = e.target;
    setClassificationValue(value);

    const selectedTagGrouping = tagGrouping.find(
      (group) => group._id === value
    );
    if (selectedTagGrouping) {
      setLevelOptions(
        selectedTagGrouping.level.map((level) => ({
          value: level,
          label: level,
          name: level, // Ajouter la propriété name
        }))
      );
      setFormData({
        ...formData,
        tag_grouping_id: selectedTagGrouping._id,
        level: "", // Reset level when classification changes
      });
    } else {
      setLevelOptions([]);
    }
  };

  useEffect(() => {
    fetchTagGrouping();
  }, []);

  console.log(formData);

  return (
    <section className="w-full p-4">
      <form className="mb-[50px]" onSubmit={handleSubmit}>
        <div className="flex items-center gap-3">
          <div onClick={onClose} className="cursor-pointer">
            <ChevronLeft />
          </div>
          <h1 className="text-[20px] font-[800] text-gray-800">
            Créer <span className="font-[300]">une classification</span>
          </h1>
        </div>
        <div className="mt-[30px] flex flex-col justify-between">
          <div className="flex flex-col">
            <Input
              element="select"
              id="classification"
              label="Classification"
              placeholder="Choisissez une classification"
              validators={[]}
              onChange={handleClassificationChange}
              value={classificationValue}
              options={tagGrouping.map((group) => ({
                value: group._id,
                label: group.name,
                name: group.name,
              }))}
              create
              gray
            />

            <Input
              element="select"
              id="level"
              label="Niveau"
              placeholder="Choisissez un niveau"
              validators={[]}
              onChange={handleChange}
              value={formData.level}
              options={levelOptions}
              create
              gray
            />

            <Input
              element="input"
              id="code"
              label="Code"
              placeholder="Code de la classification"
              onChange={handleChange}
              validators={[]}
              create
              gray
            />
            <Input
              element="input"
              id="name"
              type="text"
              placeholder="Modifier le libellé"
              label="Libellé"
              onChange={handleChange}
              validators={[]}
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
                <Button size="small" green blue type="submit">
                  Créer classification
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

export default ClassificationCreatePage;
