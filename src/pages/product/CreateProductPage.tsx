import React, { useState, useEffect } from "react";
import Input from "../../components/FormElements/Input";
import { useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Card from "../../components/Shared/Card";
import { ArrowBigRight, ArrowRight, ImageUp } from "lucide-react";
import Button from "../../components/FormElements/Button";
import useNotify from "../../utils/hooks/useToast";
import { CircularProgress } from "@mui/material";
import { useFamilies } from "../../utils/hooks/useFamilies";
import { ActionMeta, SingleValue } from "react-select";
import CreatableSelect from "react-select/creatable";
import useFetch from "../../utils/hooks/usefetch";
import UVCGrid from "../../components/UVCGrid";

interface FormData {
  creator_id: any;
  description_ref: string;
  reference: string;
  designation_longue: string;
  designation_courte: string;
  supplier_name: string;
  supplier_ref: string;
  family: string[];
  subFamily: string[];
  dimension_type: string;
  dimension: string[];
  brand: string;
  ref_collection: string;
  composition: string;
  description_brouillon: string;
}

type Family = {
  _id: string;
  YX_TYPE: string;
  YX_CODE: string;
  YX_LIBELLE: string;
};

type FamilyOption = {
  value: string;
  label: string;
};

type ClasificationOption = {
  value: string;
  label: string;
  name: string;
};

type BrandOption = {
  value: string;
  label: string;
  YX_CODE: string;
  YX_LIBELLE: string;
};

type CollectionOption = {
  value: string;
  label: string;
  CODE: string;
  LIBELLE: string;
};

type SuppliersOption = {
  value: string;
  label: string;

  T_LIBELLE: string;
};

const customStyles = {
  control: (provided: any) => ({
    ...provided,
    border: "none", // Supprimer la bordure
    boxShadow: "none",
    borderRadius: "10px", // Ajouter une bordure arrondie
    "&:hover": {
      border: "none", // Assurez-vous que la bordure n'apparaît pas au survol
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

export default function CreateProductPage() {
  const creatorId = useSelector((state: any) => state.auth.user);
  const token = useSelector((state: any) => state.auth.token);

  const { notifySuccess, notifyError } = useNotify();
  const [isLoading, setIsLoading] = useState(false);
  const [classificationValue, setClassificationValue] =
    useState("Au vieux campeur");
  const [currentPage, setCurrentPage] = useState(1);
  const [inputValueFamily, setInputValueFamily] = useState("");
  const [inputValueClassification, setInputValueClassification] = useState("");
  const [inputSubValueFamily, setInputSubValueFamily] = useState("");
  const [inputValueBrand, setInputValueBrand] = useState("");
  const [inputValueCollection, setInputValueCollection] = useState("");
  const [inputValueSupplier, setInputValueSupplier] = useState("");
  const [selectedOptionFamily, setSelectedOptionFamily] =
    useState<SingleValue<FamilyOption> | null>(null);
  const [selectedOptionSubFamily, setSelectedOptionSubFamily] =
    useState<SingleValue<FamilyOption> | null>(null);
  const [selectedOptionBrand, setSelectedOptionBrand] =
    useState<SingleValue<BrandOption> | null>(null);
  const [selectedOptionCollection, setSelectedOptionCollection] =
    useState<SingleValue<CollectionOption> | null>(null);
  const [selectedOptionSupplier, setSelectedOptionSupplier] =
    useState<SingleValue<SuppliersOption> | null>(null);
  const [optionsFamily, setOptionsFamily] = useState<FamilyOption[]>([]);
  const [optionsSubFamily, setOptionsSubFamily] = useState<FamilyOption[]>([]);
  const [optionsBrand, setOptionsBrand] = useState<BrandOption[]>([]);
  const [optionsCollection, setOptionsCollection] = useState<
    CollectionOption[]
  >([]);
  const [optionsSupplier, setOptionsSupplier] = useState<SuppliersOption[]>([]);

  const classificationOptions = [
    {
      value: "Au vieux campeur",
      label: "Au vieux campeur",
      name: "Au vieux campeur",
    },
  ];
  const limit = 10;
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    creator_id: creatorId._id,
    description_ref: "",
    reference: "",
    designation_longue: "",
    designation_courte: "",
    supplier_name: "",
    supplier_ref: "",
    family: [],
    subFamily: [],
    dimension_type: "Couleur/Taille",
    brand: "",
    ref_collection: "",
    description_brouillon: "",
    dimension: [],
    composition: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
      designation_courte:
        e.target.id === "designation_longue"
          ? e.target.value.substring(0, 15)
          : formData.designation_courte,
    });
  };

  const handleChangeBrand = (selectedOption: SingleValue<BrandOption>) => {
    const brandLabel = selectedOption ? selectedOption.label : "";
    setSelectedOptionBrand(selectedOption);
    setFormData((prevFormData) => ({
      ...prevFormData,
      brand: brandLabel,
    }));
  };

  const handleChangeCollection = (
    selectedOption: SingleValue<CollectionOption>
  ) => {
    const collectionLabel = selectedOption ? selectedOption.label : "";
    setSelectedOptionCollection(selectedOption);
    setFormData((prevFormData) => ({
      ...prevFormData,
      ref_collection: collectionLabel,
    }));
  };

  const handleChangeSupplier = (
    selectedOption: SingleValue<SuppliersOption>
  ) => {
    const supplierLabel = selectedOption ? selectedOption.label : "";
    setSelectedOptionSupplier(selectedOption);
    setFormData((prevFormData) => ({
      ...prevFormData,
      supplier_name: supplierLabel,
    }));
  };

  const handleChangeFamily = (newValue: SingleValue<FamilyOption> | null) => {
    setSelectedOptionFamily(newValue);

    if (newValue) {
      setFormData({
        ...formData,
        family: [newValue.value],
      });
    } else {
      setFormData({
        ...formData,
        family: [],
      });
    }
  };

  const handleChangeSubFamily = (
    newValue: SingleValue<FamilyOption> | null
  ) => {
    setSelectedOptionSubFamily(newValue);

    if (newValue) {
      setFormData({
        ...formData,
        subFamily: [newValue.value],
      });
    } else {
      setFormData({
        ...formData,
        subFamily: [],
      });
    }
  };

  const handleGridChange = (grid: string[][]) => {
    // Flatten the grid and join color and size
    const flattenedGrid = grid.flat();
    setFormData((prevFormData) => ({
      ...prevFormData,
      dimension: flattenedGrid,
    }));
  };

  const handleInputChangeBrand = async (inputValueBrand: string) => {
    setInputValueBrand(inputValueBrand);

    if (inputValueBrand === "") {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_URL_DEV}/api/v1/brand`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();

        const optionsBrand = data.data?.map((brand: BrandOption) => ({
          value: brand.YX_LIBELLE,
          label: brand.YX_LIBELLE,
        }));

        setOptionsBrand(optionsBrand);
      } catch (error) {
        console.error("Erreur lors de la requête", error);
      }
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/brand/search?YX_LIBELLE=${inputValueBrand}&page=${currentPage}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();

      const optionsBrand = data.data?.map((brand: BrandOption) => ({
        value: brand.YX_LIBELLE,
        label: brand.YX_LIBELLE,
      }));

      setOptionsBrand(optionsBrand);
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    }
  };

  const handleInputChangeCollection = async (inputValueCollection: string) => {
    setInputValueCollection(inputValueCollection);

    // console.log(inputValue);
    if (inputValueCollection === "") {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_URL_DEV}/api/v1/collection`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();

        const optionsCollection = data.data?.map(
          (collection: CollectionOption) => ({
            value: collection.LIBELLE,
            label: collection.LIBELLE,
          })
        );

        setOptionsCollection(optionsCollection);
      } catch (error) {
        console.error("Erreur lors de la requête", error);
      }
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/collection/search?LIBELLE=${inputValueCollection}&page=${currentPage}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();

      const optionsCollection = data.data?.map(
        (collection: CollectionOption) => ({
          value: collection.LIBELLE,
          label: collection.LIBELLE,
        })
      );

      setOptionsCollection(optionsCollection);
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    }
  };

  const handleInputChangeSupplier = async (inputValueCollection: string) => {
    setInputValueSupplier(inputValueCollection);

    // console.log(inputValue);
    if (inputValueSupplier === "") {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_URL_DEV}/api/v1/supplier`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();

        const optionsSupplier = data.data?.map((supplier: SuppliersOption) => ({
          value: supplier.T_LIBELLE,
          label: supplier.T_LIBELLE,
        }));

        setOptionsSupplier(optionsSupplier);
      } catch (error) {
        console.error("Erreur lors de la requête", error);
      }
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/supplier?page=${currentPage}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();

      const optionsSupplier = data.data?.map((supplier: SuppliersOption) => ({
        value: supplier.T_LIBELLE,
        label: supplier.T_LIBELLE,
      }));

      setOptionsSupplier(optionsSupplier);
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    }
  };

  const handleClassificationChange = (
    newValue: SingleValue<FamilyOption>,
    actionMeta: ActionMeta<FamilyOption>
  ) => {
    setClassificationValue(newValue ? newValue.value : "");
  };

  const handleInputChangeClassification = (inputValue: string) => {
    setInputValueClassification(inputValue);
  };

  const handleInputChangeFamily = async (inputValueFamily: string) => {
    setInputValueFamily(inputValueFamily);

    if (inputValueFamily === "") {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_URL_DEV}/api/v1/family`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();

        const optionsFamily = data.data?.map((family: Family) => ({
          value: family.YX_LIBELLE,
          label: family.YX_LIBELLE,
        }));

        setOptionsFamily(optionsFamily);
      } catch (error) {
        console.error("Erreur lors de la requête", error);
      }
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/family/search?YX_LIBELLE=${inputValueFamily}&page=${currentPage}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();

      const optionsFamily = data.data?.map((family: Family) => ({
        value: family.YX_LIBELLE,
        label: family.YX_LIBELLE,
      }));

      setOptionsFamily(optionsFamily);
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    }
  };

  const handleInputChangeSubFamily = async (inputValueSubFamily: string) => {
    setInputSubValueFamily(inputValueSubFamily);

    if (inputValueSubFamily === "") {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_URL_DEV}/api/v1/family/search?YX_LIBELLE=""&page=${currentPage}&limit=${limit}&YX_TYPE=LA2`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();

        const optionsSubFamily = data.data?.map((family: Family) => ({
          value: family.YX_LIBELLE,
          label: family.YX_LIBELLE,
        }));

        setOptionsSubFamily(optionsSubFamily);
      } catch (error) {
        console.error("Erreur lors de la requête", error);
      }
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/family/search?YX_LIBELLE=${inputValueSubFamily}&page=${currentPage}&limit=${limit}&YX_TYPE=LA2`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();

      const optionsSubFamily = data.data?.map((family: Family) => ({
        value: family.YX_LIBELLE,
        label: family.YX_LIBELLE,
      }));

      setOptionsSubFamily(optionsSubFamily);
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/draft`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        setTimeout(() => {
          notifySuccess("Brouillon créé !");
          setIsLoading(false);
          navigate("/draft");
        }, 1000);
      } else {
        notifyError("Erreur lors de la création !");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Erreur lors de la requête", error);
      setIsLoading(false);
    }
  };

  console.log(formData);

  return (
    <section className="w-full bg-gray-100 p-7">
      <div className="max-w-[2024px] mx-auto">
        <form onSubmit={handleSubmit} className="mb-[400px]">
          <div className="flex justify-between">
            <div>
              <h3 className="text-[32px] font-[800] text-gray-800">
                Créer un article
              </h3>
              {creatorId && (
                <p className="text-[17px] text-gray-600 italic">
                  Création par{" "}
                  <span className="font-[600]">{creatorId.username}</span>
                </p>
              )}
            </div>
            {!isLoading ? (
              <div className="flex items-center justify-between gap-3 mt-[50px]">
                <div className="flex gap-3">
                  <Button size="small" cancel type="button">
                    Annuler
                  </Button>
                  <Button size="small" blue type="submit">
                    Enregistrer
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mt-3">
                <CircularProgress />
              </div>
            )}
          </div>

          <div className="flex gap-7 mt-[50px]">
            <div className="w-[70%] flex flex-col gap-3">
              <div className="relative border p-3 ">
                <div className="absolute top-[-15px] bg-gray-100 px-2">
                  <span className="text-[17px] italic">Identification</span>
                </div>
                <Input
                  element="input"
                  id="reference"
                  label="Référence :"
                  value={formData.reference}
                  onChange={handleChange}
                  validators={[]}
                  placeholder="Ajouter la référence du produit"
                  create
                  gray
                />
                <Input
                  element="input"
                  id="designation_longue"
                  label="Désignation longue :"
                  value={formData.designation_longue}
                  onChange={handleChange}
                  validators={[]}
                  placeholder="Ajouter la designation du produit"
                  create
                  gray
                />
                <Input
                  element="input"
                  id="designation_courte"
                  label="Désignation Courte :"
                  value={formData.designation_courte}
                  onChange={handleChange}
                  validators={[]}
                  placeholder=""
                  create
                  gray
                />
                <div className="mt-[30px] grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="col-span-full">
                    <h5 className="text-[20px] font-[700]">Classification</h5>
                  </div>
                  <div className="col-span-1">
                    <label className="text-sm font-medium text-gray-600">
                      Classification principale
                    </label>
                    <CreatableSelect
                      value={classificationOptions.find(
                        (option) => option.value === classificationValue
                      )}
                      onChange={handleClassificationChange}
                      onInputChange={handleInputChangeClassification}
                      inputValue={inputValueFamily}
                      options={classificationOptions}
                      placeholder="Choisir une classification"
                      styles={customStyles}
                      className="mt-2 block text-sm py-1 w-full rounded-lg text-gray-500 border border-gray-200 focus:outline-none focus:ring-0 focus:border-gray-200 peer capitalize"
                      required
                    />
                  </div>

                  {classificationValue && (
                    <div className="col-span-1">
                      <label className="text-sm font-medium text-gray-600">
                        Famille
                      </label>
                      <CreatableSelect
                        value={selectedOptionFamily}
                        onChange={handleChangeFamily}
                        onInputChange={handleInputChangeFamily}
                        inputValue={inputValueFamily}
                        options={optionsFamily}
                        placeholder="Selectionner une famille"
                        styles={customStyles}
                        className="mt-2 block text-sm py-1 w-full rounded-lg text-gray-500 border border-gray-200 focus:outline-none focus:ring-0 focus:border-gray-200 peer capitalize"
                        required
                      />
                    </div>
                  )}

                  {classificationValue && (
                    <div className="col-span-1">
                      <label className="text-sm font-medium text-gray-600">
                        Sous-famille
                      </label>
                      <CreatableSelect
                        value={selectedOptionSubFamily}
                        onChange={handleChangeSubFamily}
                        onInputChange={handleInputChangeSubFamily}
                        inputValue={inputSubValueFamily}
                        options={optionsSubFamily}
                        placeholder="Selectionner une sous-famille"
                        styles={customStyles}
                        className="mt-2 block text-sm py-1 w-full rounded-lg text-gray-500 border border-gray-200 focus:outline-none focus:ring-0 focus:border-gray-200 peer capitalize"
                        required
                      />
                    </div>
                  )}
                </div>

                <div className="mt-[30px]">
                  <h5 className="text-[20px] font-[700] mb-4">
                    Caractéristiques produit
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Marque
                      </label>
                      <CreatableSelect<BrandOption>
                        value={selectedOptionBrand}
                        onChange={handleChangeBrand}
                        onInputChange={handleInputChangeBrand}
                        inputValue={inputValueBrand}
                        options={optionsBrand}
                        placeholder="Selectionner une marque"
                        styles={customStyles}
                        className="mt-2 block text-sm py-1 w-full rounded-lg text-gray-500 border border-gray-200 focus:outline-none focus:ring-0 focus:border-gray-200 peer capitalize"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Collection
                      </label>
                      <CreatableSelect<CollectionOption>
                        value={selectedOptionCollection}
                        onChange={handleChangeCollection}
                        onInputChange={handleInputChangeCollection}
                        inputValue={inputValueCollection}
                        options={optionsCollection}
                        placeholder="Selectionner une collection"
                        styles={customStyles}
                        className="mt-2 block text-sm py-1 w-full rounded-lg text-gray-500 border border-gray-200 focus:outline-none focus:ring-0 focus:border-gray-200 peer capitalize"
                        required
                      />
                    </div>
                  </div>
                  <Input
                    element="input"
                    id="dimension_type"
                    label="Type de dimension :"
                    value={formData.dimension_type}
                    onChange={handleChange}
                    validators={[]}
                    placeholder="Selectionnez un type de dimension"
                    create
                    disabled
                    gray
                  />
                </div>
                <div className="mt-3">
                  <UVCGrid onDimensionsChange={handleGridChange} />
                </div>
              </div>
            </div>

            <div className="w-[30%] flex flex-col gap-5">
              <Card title=" Ajouter une image">
                <div className="w-full h-[250px] border border-dashed border-2 border-gray-300 mt-3 flex justify-center items-center">
                  <div className="flex flex-col items-center text-center">
                    <p className="font-bold text-gray-600">
                      Glissez déposez votre image ici ou{" "}
                      <span className="text-blue-400">
                        téléchargez depuis votre ordinateur
                      </span>
                    </p>
                    <div className="text-gray-300">
                      <ImageUp size={50} />
                    </div>
                  </div>
                </div>
              </Card>
              <Card title="Fournisseur principal">
                <div className="flex flex-col gap-2">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Nom
                    </label>
                    <CreatableSelect<SuppliersOption>
                      value={selectedOptionSupplier}
                      onChange={handleChangeSupplier}
                      onInputChange={handleInputChangeSupplier}
                      inputValue={inputValueSupplier}
                      options={optionsSupplier}
                      placeholder="Selectionner un fournisseur"
                      styles={customStyles}
                      className="mt-2 block text-sm py-1 w-full rounded-lg text-gray-500 border border-gray-200 focus:outline-none focus:ring-0 focus:border-gray-200 peer capitalize"
                      required
                    />
                  </div>
                  <div>
                    <Input
                      element="input"
                      id="supplier_ref"
                      label="Référence produit :"
                      value={formData.supplier_ref}
                      onChange={handleChange}
                      validators={[]}
                      placeholder="Ajouter la designation du produit"
                      create
                      gray
                    />
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
