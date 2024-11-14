import React, { useEffect, useState } from "react";
import { ChevronLeft, Plus, X } from "lucide-react";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useNotify from "../../utils/hooks/useToast";
import Button from "../../components/FormElements/Button";
import Input from "../../components/FormElements/Input";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import getNumbersFromLabel from "../../utils/func/GetNumbersFromLabel";

interface Dimension {
  _id: string;
  label: string;
  code: string;
  type: string;
  status: string;
}

interface FormData {
  code: string;
  label: string;
  type: string;
  dimensions: string[];
  status: string;
}

interface GridCreatePageProps {
  onCreate: (newGridId: string) => void;
  onClose: () => void;
}

export default function GridCreatePage({
  onCreate,
  onClose,
}: GridCreatePageProps) {
  const [searchValue, setSearchValue] = useState("");
  const [code, setCode] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [dimensions, setDimensions] = useState<Dimension[]>([]);
  const [selectedDimensions, setSelectedDimensions] = useState<Dimension[]>([]);
  const { notifySuccess, notifyError } = useNotify();
  const [label, setLabel] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 20;
  const [dropdownIsOpen, setDropdownIsOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    code: "",
    label: "",
    type: "",
    dimensions: [],
    status: "A",
  });

  const levelOptions = [
    { value: "couleur", label: "Couleur", name: "Couleur" },
    { value: "taille", label: "Taille", name: "Taille" },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/dimension-grid`,
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
        const newGridId = data._id;
        setTimeout(() => {
          notifySuccess("Collection crée avec succés !");
          setIsLoading(false);
          onCreate(newGridId);
          onClose();
        }, 100);
      } else if (response.status === 409) { // Status Conflict
        notifyError("Le code existe déjà"); // Utiliser le message du backend
        setIsLoading(false);
      } else {
        notifyError("Erreur lors de la création");
      }
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/dimension/search?label=${searchValue}&code=${code}&type=${formData.type}&page=${currentPage}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setDimensions(data.data);
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    }
  };
  

  const handleSetType = (e: any) => {
    const selectedOption = e.target.options[e.target.selectedIndex];
    const selectedOptionLabel = selectedOption.label;
    setFormData({
      ...formData,
      type: selectedOption.value,
    });
  };

  const handleSetCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLabel(e.target.value);
    setFormData({
      ...formData,
      code: e.target.value,
    });
  };

  const handleSetLabel = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLabel(e.target.value);
    setFormData({
      ...formData,
      label: e.target.value,
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    setDropdownIsOpen(true);
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
    setDropdownIsOpen(true);
  };

  const handleDropdownClose = (dimension: Dimension) => {
    const existingDimension = selectedDimensions.find(
      (d) => d._id === dimension._id
    );
    if (!existingDimension) {
      setSelectedDimensions([...selectedDimensions, dimension]);
      setFormData({
        ...formData,
        dimensions: [...formData.dimensions, dimension.label],
      });
    }
    setDropdownIsOpen(false);
  };

  const handleDragAndDrop = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(selectedDimensions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSelectedDimensions(items);
  };

  const handleDeleteDimension = (dimensionId: string) => {
    setSelectedDimensions(
      selectedDimensions.filter((dimension) => dimension._id !== dimensionId)
    );
  };

  useEffect(() => {
    if (searchValue || code) {
      handleSearch();
    }
  }, [searchValue, code]);

  return (
    <section className="w-full p-4">
      <form className="mb-[50px]" onSubmit={handleSubmit}>
        <div className="flex items-center gap-2">
          <div onClick={onClose} className="cursor-pointer">
            <ChevronLeft />
          </div>
          <h1 className="text-[20px] font-[800] text-gray-800">
            Créer <span className="font-[300]">une grille de dimension</span>
          </h1>
        </div>
        <div className="mt-[30px]">
          <div>
            <Input
              element="input"
              id="code"
              label="Code de la grille"
              placeholder="ex: 2365"
              validators={[]}
              onChange={handleSetCode}
              create
              required
              gray
            />
          </div>
          <div>
            <Input
              element="input"
              id="label"
              label="Libellé de la grille"
              placeholder="Donnez un nom à la grille"
              validators={[]}
              onChange={handleSetLabel}
              create
              required
              gray
            />
          </div>

          <div className="flex-1">
            <Input
              element="select"
              id="type"
              label="Type de dimension"
              placeholder="Choisissez un type de dimension"
              validators={[]}
              onChange={handleSetType}
              options={levelOptions}
              create
              required
              gray
            />
          </div>

          <div className="relative flex mt-3 gap-2">
            <div className="relative w-[50%]">
              <Input
                element="input"
                id="dimensionSearch"
                label="Rechercher par libellé"
                placeholder="Cherchez par code ou libellé"
                validators={[]}
                gray
                create
                onChange={handleSearchChange}
                value={searchValue}
              />
              <Input
                element="input"
                id="dimensionCode"
                label="Rechercher par code"
                placeholder="Cherchez par code"
                validators={[]}
                gray
                create
                onChange={handleCodeChange}
                value={code}
              />
              {dropdownIsOpen && dimensions && (searchValue || code) && (
                <div className="absolute w-[100%] bg-gray-50 z-[20000] py-4 rounded-b-md shadow-md">
                  <div
                    className="h-[30px] flex justify-end cursor-pointer px-3"
                    onClick={() => setDropdownIsOpen(false)}
                  >
                    <div className="h-[30px] w-[30px] flex justify-center items-center bg-orange-500 rounded-full text-white hover:bg-orange-400">
                      <X />
                    </div>
                  </div>
                  {dimensions.map((dimension, i) => (
                    <ul key={i}>
                      <li
                        className={`cursor-pointer py-1 ${
                          selectedDimensions.includes(dimension)
                            ? "bg-orange-400 text-white font-bold hover:bg-orange-300"
                            : ""
                        } hover:bg-gray-200 text-sm px-4 py-2 border-b`}
                        onClick={() => handleDropdownClose(dimension)}
                      >
                        {dimension.label}
                      </li>
                    </ul>
                  ))}
                </div>
              )}
            </div>
            <div className="w-[50%] border rounded-sm p-1">
              {selectedDimensions && (
                <DragDropContext onDragEnd={handleDragAndDrop}>
                  <Droppable droppableId="selectedDimensions">
                    {(provided) => (
                      <ul
                        className="flex flex-wrap gap-1"
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                      >
                        {selectedDimensions.map((dimension, index) => (
                          <Draggable
                            key={dimension._id}
                            draggableId={dimension._id}
                            index={index}
                          >
                            {(provided) => (
                              <li
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <div
                                  className="flex items-center justify-center relative w-[40px] h-[40px] bg-orange-300 text-white p-3 rounded-full font-bold cursor-pointer"
                                  onClick={() =>
                                    handleDeleteDimension(dimension._id)
                                  }
                                >
                                  {dimension.code}
                                </div>
                              </li>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </ul>
                    )}
                  </Droppable>
                </DragDropContext>
              )}
            </div>
          </div>
        </div>
        {!isLoading ? (
          <div className="mt-4 flex items-center gap-2">
            <Button size="small" cancel type="button" onClick={onClose}>
              Annuler
            </Button>
            <Button size="small" blue type="submit">
              Enregistrer ma grille
            </Button>
          </div>
        ) : (
          <div className="mt-3">
            <CircularProgress />
          </div>
        )}
      </form>
    </section>
  );
}
