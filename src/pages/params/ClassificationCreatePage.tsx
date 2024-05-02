import React, { useEffect, useState } from "react";
import Card from "../../components/Shared/Card";
import Input from "../../components/FormElements/Input";
import { X } from "lucide-react";
import Button from "../../components/FormElements/Button";

interface Family {
  _id: string;
  YX_TYPE: string;
  YX_CODE: any;
  YX_LIBELLE: string;
}

const customStyles = {
  control: (provided: any) => ({
    ...provided,
    border: "none",
    boxShadow: "none",
    "&:hover": {
      border: "none",
    },
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    borderBottom: "1px solid #e5e5e5",
    backgroundColor: state.isSelected ? "#e5e5e5" : "white",
    color: state.isSelected ? "black" : "gray",
    "&:hover": {
      backgroundColor: "#e5e5e5",
      color: "black",
    },
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: "gray",
  }),
};

function ClassificationCreatePage() {
  const [searchValue, setSearchValue] = useState("");
  const [familyValue, setFamilyValue] = useState("");
  const [choiceValue, setChoiceValue] = useState("");
  const [dropdownIsOpen, setDropdownIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItem, setTotalItem] = useState(null);
  const limit = 20;
  const totalPages = Math.ceil((totalItem ?? 0) / limit);
  const [families, setFamilies] = useState<Family[]>([]);

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/family/search?value=${searchValue}&page=${currentPage}&limit=${limit}`,
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

  const handleDropdownClose = (family: string) => {
    setFamilyValue(family);
    setDropdownIsOpen(false);
    setChoiceValue(family);
  };

  useEffect(() => {
    if (searchValue) {
      handleSearch();
    }
  }, [searchValue]);

  return (
    <div>
      <Card title="Panel de création">
        <form className="w-[70%] mx-auto mt-[50px] mb-[50px]">
          <h1 className="text-2xl text-center">Créer une class</h1>
          <div className="mt-5 flex flex-col justify-between">
            <div className="flex flex-col">
              <Input
                element="select"
                id="level"
                label="Niveau"
                validators={[]}
                gray
              />
              <Input
                element="input"
                id="code"
                label="Code"
                validators={[]}
                gray
              />
              <div className="realtive">
                <Input
                  element="input"
                  id="family"
                  label="Lier avec une famille"
                  validators={[]}
                  gray
                  onChange={handleDropdownOpen}
                />
                {choiceValue && (
                  <div className="absolute top-[59%] bg-orange-400 py-2 px-4 rounded-md">
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
                {dropdownIsOpen && families && (
                  <div className="absolute w-[51%] bg-gray-50 z-[20000] px-4 py-4 rounded-b-md shadow-md">
                    <div
                      className="h-[30px] flex justify-end cursor-pointer"
                      onClick={() => setDropdownIsOpen(false)}
                    >
                      <span className="text-xl">X</span>
                    </div>
                    {families.map((family) => (
                      <ul>
                        <li
                          className="cursor-pointer py-1 hover:bg-sky-100"
                          onClick={() => handleDropdownClose(family.YX_LIBELLE)}
                        >
                          {family.YX_LIBELLE}
                        </li>
                      </ul>
                    ))}
                  </div>
                )}
              </div>
              <Input
                element="input"
                id="label"
                type="text"
                placeholder="Modifier le libellé"
                label="Libellé"
                validators={[]}
                gray
              />
              <div className="flex items-center gap-2 mt-5">
                <Button size="medium" blue>
                  Créer
                </Button>
                <Button size="medium" danger>
                  Annuler
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default ClassificationCreatePage;
