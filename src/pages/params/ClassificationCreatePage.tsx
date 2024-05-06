import React, { useEffect, useState } from "react";
import Card from "../../components/Shared/Card";
import Input from "../../components/FormElements/Input";
import { X } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useNotify from "../../utils/hooks/useToast";
import Button from "../../components/FormElements/Button";
import { CircularProgress } from "@mui/material";

interface Family {
  _id: string;
  YX_TYPE: string;
  YX_CODE: any;
  YX_LIBELLE: string;
}

interface FormData {
  family: { YX_CODE: string; YX_LIBELLE: string; YX_TYPE: string };
  creatorId: string;
}

function ClassificationCreatePage() {
  const user = useSelector((state: any) => state.auth.user);
  const [type, setType] = useState("")
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { notifySuccess, notifyError } = useNotify();
  const [searchValue, setSearchValue] = useState("");
  const [familyCodeValue, setFamilyCodeValue] = useState("");
  const [choiceValue, setChoiceValue] = useState("");
  const [dropdownIsOpen, setDropdownIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 20;
  const [families, setFamilies] = useState<Family[]>([]);
  const [formData, setFormData] = useState<FormData>({
    family: { YX_CODE: "", YX_LIBELLE: "", YX_TYPE: "" },
    creatorId: user._id,
  });

  const levelOptions = [
    { value: "LA1", label: "Famille", name: "Famille" },
    { value: "LA2", label: "Sous-famille", name: "Sous-Famille" },
    {
      value: "LA3",
      label: "Sous-sous-famille",
      name: "Sous-sous-famille",
    },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.id === "YX_TYPE") {
        const selectedLevel = e.target.value;
        const numericLevel = parseInt(selectedLevel.substring(2), 10);
        const previousNumericLevel = numericLevel - 1;
        const fetchLevel = `LA${previousNumericLevel}`;
    
        setType(fetchLevel);
      }

    setFormData({
      ...formData,
      family: {
        ...formData.family,
        [e.target.id]: e.target.value,
      },
    });
  };

  console.log(type)


  const handleSearch = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/family/YX_TYPE?value=${searchValue}&page=${currentPage}&limit=${limit}&YX_TYPE=${type}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();

      setFamilies(data.data);
      console.log(data);
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    }
  };

  const handleDropdownOpen = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    setChoiceValue("");
    setDropdownIsOpen(true);
  };

  const handleDropdownClose = (family: Family | null) => {
    setDropdownIsOpen(false);
    if (family) {
      setChoiceValue(family.YX_LIBELLE);
      setFamilyCodeValue(family.YX_CODE);

      // Vérifier si le code saisi contient déjà un code de famille
      const codeSaisi = formData.family.YX_CODE;
      const codeFamillePrecedent = familyCodeValue;
      const codeSansFamillePrecedente = codeSaisi.startsWith(
        codeFamillePrecedent
      )
        ? codeSaisi.substring(codeFamillePrecedent.length)
        : codeSaisi;

      // Concaténer le nouveau code de famille avec le code saisi sans le code de famille précédent
      setFormData({
        ...formData,
        family: {
          ...formData.family,
          YX_CODE: family.YX_CODE + codeSansFamillePrecedente,
        },
      });
    } else {
      setChoiceValue("");
      setFamilyCodeValue("");

      // Réinitialiser le code saisi
      setFormData({
        ...formData,
        family: {
          ...formData.family,
          YX_CODE: "",
        },
      });
   
    }
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/family`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        setTimeout(() => {
          notifySuccess("Marque crée avec succés !");
          setIsLoading(false);
          navigate(-1);
        }, 1000);
      } else {
        notifyError("Erreur lors de la création");
      }
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    }
  };

  console.log(formData);
  useEffect(() => {
    if (searchValue) {
      handleSearch();
    }
  }, [searchValue]);

  return (
    <div>
      <Card title="Panel de création">
        <form
          className="w-[70%] mx-auto mt-[50px] mb-[50px]"
          onSubmit={handleSubmit}
        >
          <h1 className="text-2xl text-center">Création de la classe</h1>
          <div className="mt-5 flex flex-col justify-between">
            <div className="flex flex-col">
              <Input
                element="select"
                id="YX_TYPE"
                label="Niveau"
                placeholder="Choississez un niveau"
                validators={[]}
                onChange={handleChange}
                options={levelOptions}
                gray
              />
              <Input
                element="input"
                id="YX_CODE"
                label="Code"
                placeholder="Code de la class"
                onChange={handleChange}
                validators={[]}
                gray
              />
              {type !== "" && type !== "LA0" && type !== "LANaN" && (
                <div className="relative">
                  <Input
                    element="input"
                    id="family"
                    label="Lien avec un parent"
                    placeholder="Choississez une famille / sous-famille"
                    validators={[]}
                    gray
                    onChange={handleDropdownOpen}
                  />
                  {choiceValue && (
                    <div className="absolute bottom-[3px] bg-orange-400 py-2 px-4 rounded-md">
                      <div
                        className="absolute flex items-center justify-center h-[18px] w-[18px] top-[-2px] right-[-4px] rounded-full bg-red-600 text-white cursor-pointer"
                        onClick={() => setChoiceValue("")}
                      >
                        <X />
                      </div>
                      <p className="text-white font-bold text-sm">
                        {choiceValue}
                      </p>
                    </div>
                  )}
                  {dropdownIsOpen && families && searchValue && (
                    <div className="absolute w-[100%] bg-gray-50 z-[20000] py-4 rounded-b-md shadow-md">
                      <div
                        className="h-[30px] flex justify-end cursor-pointer"
                        onClick={() => setDropdownIsOpen(false)}
                      >
                        <span className="text-xl px-4">X</span>
                      </div>
                      {families.map((family) => (
                        <ul>
                          <li
                            className="cursor-pointer py-1 hover:bg-gray-200 text-lg px-4 py-2 border-b"
                            onClick={() => handleDropdownClose(family)}
                          >
                            {family.YX_LIBELLE}
                          </li>
                        </ul>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <Input
                element="input"
                id="YX_LIBELLE"
                type="text"
                placeholder="Modifier le libellé"
                label="Libellé"
                onChange={handleChange}
                validators={[]}
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
                    Créer
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
      </Card>
    </div>
  );
}

export default ClassificationCreatePage;
