import React, { useState, useEffect } from "react";
import { CircularProgress } from "@mui/material";
import { MoveLeft, Plus, Save, X } from "lucide-react";
import Input from "../../components/FormElements/Input";
import { Link } from "react-router-dom";
import Card from "../../components/Shared/Card";
import Button from "../../components/FormElements/Button";
import { useSelector } from "react-redux";
import CreateFamilyComponent from "../../components/CreateFamilyComponent";
import CreateBrandComponent from "../../components/CreateBrandComponent";
import CreateCollectionComponent from "../../components/CreateCollectionComponent";
import { VALIDATOR_REQUIRE } from "../../utils/validator";
import useNotify from "../../utils/hooks/useToast";
import "react-toastify/dist/ReactToastify.css";
import useFetch from "../../utils/hooks/usefetch";
import { ActionMeta, SingleValue } from "react-select";
import CreatableSelect from "react-select/creatable";
import { colourOptions } from "../../data";

interface Family {
  _id: string;
  YX_TYPE: string;
  YX_CODE: string;
  YX_LIBELLE: string;
}

interface Collection {
  _id: string;
  CODE: string;
  LIBELLE: string;
}

interface Brand {
  _id: string;
  YX_CODE: string;
  YX_LIBELLE: string;
}

interface FormData {
  reference: string;
  name: string;
  desLong: string;
  desShort: string;
  family: Family | null;
  subFamily: any;
  brand: string;
  productCollection: string;
  supplier: string;
  uvc: {
    code: string;
    color: any;
    size: any;
    price: any;
  };
  status: number;
  creatorId: any;
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

type FamilyOption = {
  _id: string;
  YX_TYPE: string;
  YX_CODE: string;
  YX_LIBELLE: string;
};

export default function CreateProductPage() {
  const user = useSelector((state: any) => state.auth.user);
  const [page, setPage] = useState("addProduct");
  const [isLoading, setIsLoading] = useState(false);
  const [uvcIsOpen, setUvcIsOpen] = useState(false);
  const [createProductIsOpen, setCreateProductcIsOpen] = useState(true);
  const [familyId, setFamilyId] = useState<string>("");
  const { notifySuccess, notifyError } = useNotify();
  const [brandOptions, setBrandOptions] = useState<BrandOption[]>([]);
  const [formData, setFormData] = useState<FormData>({
    reference: "",
    name: "",
    desLong: "",
    desShort: "",
    family: null,
    subFamily: [],
    brand: "",
    productCollection: "",
    supplier: "",
    uvc: {
      code: "",
      color: [],
      size: [],
      price: [],
    },
    status: 0,
    creatorId: user._id,
  });

  const [selectedOptionBrand, setSelectedOptionBrand] =
    useState<SingleValue<BrandOption> | null>(null);
  const [selectedOptionCollection, setSelectedOptionCollection] =
    useState<SingleValue<CollectionOption> | null>(null);
  const [selectedOptionFamily, setSelectedOptionFamily] =
    useState<SingleValue<FamilyOption> | null>(null);
  const [inputValueBrand, setInputValueBrand] = useState("");
  const [inputValueCollection, setInputValueCollection] = useState("");
  const [inputValueFamily, setInputValueFamily] = useState("");
  const [optionsBrand, setOptionsBrand] = useState<BrandOption[]>([]);
  const [optionsCollection, setOptionsCollection] = useState<
    CollectionOption[]
  >([]);
  const [optionsFamily, setOptionsFamily] = useState<FamilyOption[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 20;

  const resetForm = () => {
    setFormData({
      reference: "",
      name: "",
      desLong: "",
      desShort: "",
      family: null,
      subFamily: [],
      brand: "",
      productCollection: "",
      supplier: "",
      uvc: {
        code: "",
        color: [],
        size: [],
        price: [],
      },
      status: 0,
      creatorId: user._id,
    });
  };

  const handleChange = async (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
      | { target: { id: string; value: any } }
  ) => {
    const { id, value } = e.target || e;

    if (id === "family") {
      const selectedFamilyObject = families?.find(
        (family: Family) => family._id === value
      );
      if (selectedFamilyObject) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          family: selectedFamilyObject,
        }));
        setFamilyId(value);
      }
    } else if (id === "size") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        uvc: {
          ...prevFormData.uvc,
          [id]: value,
        },
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [id]: value,
        desLong: id === "name" ? value : prevFormData.desLong,
        desShort: id === "name" ? value : prevFormData.desShort,
      }));
    }
  };

  // Fonction pour gérer le changement de la valeur sélectionnée
  const handleChangeBrand = (selectedOption: SingleValue<BrandOption>) => {
    const brandLabel = selectedOption ? selectedOption.label : "";
    setSelectedOptionBrand(selectedOption);
    setFormData((prevFormData) => ({
      ...prevFormData,
      brand: brandLabel,
    }));
  };

  // Fonction pour gérer la saisie de l'utilisateur
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

  // Fonction pour gérer le changement de la valeur sélectionnée
  const handleChangeCollection = (selectedOption: SingleValue<CollectionOption>) => {
    const collectionLabel = selectedOption ? selectedOption.label : "";
    setSelectedOptionCollection(selectedOption);
    setFormData((prevFormData) => ({
      ...prevFormData,
      productCollection: collectionLabel,
    }));
  };

  // Fonction pour gérer la saisie de l'utilisateur
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

  // Fonction pour gérer le changement de la valeur sélectionnée
  const handleChangeFamily = (newValue: SingleValue<FamilyOption>) => {
    setSelectedOptionFamily(newValue);
  };

  // Fonction pour gérer la saisie de l'utilisateur
  const handleInputChangeFamily = async (inputValueFamily: string) => {
    setInputValueFamily(inputValueFamily);

    // console.log(inputValue);
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

        const optionsFamily = data.data?.map((family: FamilyOption) => ({
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

      const optionsFamily = data.data?.map((family: FamilyOption) => ({
        value: family.YX_LIBELLE,
        label: family.YX_LIBELLE,
      }));

      setOptionsFamily(optionsFamily);
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    }
  };

  const { data: familiesData } = useFetch<{ data: Family[] }>(
    `${process.env.REACT_APP_URL_DEV}/api/v1/family`
  );

  const { data: collectionsData } = useFetch<{ data: Collection[] }>(
    `${process.env.REACT_APP_URL_DEV}/api/v1/collection`
  );

  const familyOptions =
    familiesData?.data.map(({ _id, YX_LIBELLE }) => ({
      value: _id,
      label: YX_LIBELLE,
      name: YX_LIBELLE,
    })) ?? [];

  const selectedFamilyName = formData.family?.YX_LIBELLE;

  const collectionOptions =
    collectionsData?.data.map(({ LIBELLE }) => ({
      value: LIBELLE,
      label: LIBELLE,
    })) ?? [];

  const handleCreateProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/product/create`,
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
        notifySuccess("Produit créé avec succès!");
        setIsLoading(false);
        resetForm();
      } else {
        console.error("Erreur lors de la connexion");
        notifyError("Erreur lors de la création du produit");
      }
    } catch (error) {
      console.error("Erreur lors de la requête", error);
      notifyError("Erreur lors de la création du produit");
    }
  };

  console.log(formData);

  useEffect(() => {
    const fetchInitialDataBrand = async () => {
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
    };

    const fetchInitialDataCollection = async () => {
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
    };

    const fetchInitialDataFamily = async () => {
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

        const optionsFamily = data.data?.map((family: FamilyOption) => ({
          value: family.YX_LIBELLE,
          label: family.YX_LIBELLE,
        }));

        setOptionsFamily(optionsFamily);
      } catch (error) {
        console.error("Erreur lors de la requête", error);
      }
    };

    fetchInitialDataBrand();
    fetchInitialDataCollection();
    fetchInitialDataFamily();
  }, []);

  return (
    <div>
      <Card title="Panel d'ajout" createTitle="" link="">
        {page === "addProduct" && (
          <div className="mt-7 mb-7">
            <form
              className="flex flex-col gap-4 w-[90%] mx-auto"
              onSubmit={handleCreateProduct}
            >
              <div className="flex items-center gap-3 h-[70px]">
                <div className="h-2/3 w-[8px] bg-[#01972B]"></div>
                <h4 className="text-3xl text-gray-600">
                  <span className="font-bold text-gray-700">Création</span>{" "}
                  d'une fiche produit
                </h4>
              </div>

              <div className="flex flex-col gap-7">
                <div className="flex items-center gap-3 h-[70px]">
                  <h5 className="text-2xl text-gray-600">
                    <span className="font-bold text-gray-700">Page</span>{" "}
                    principale
                  </h5>
                </div>
                <div className="flex gap-5 mt-6">
                  <div className="relative flex-1 border border-gray-200 rounded-md px-4 py-7 shadow-md">
                    <span className="absolute top-[-12px] bg-white px-3 text-[13px] italic">
                      Identification
                    </span>
                    <div className="gap-5 grid grid-cols-2 grid-template-columns: [label] 1fr [select] 2fr;">
                      <Input
                        element="input"
                        id="reference"
                        label="Référence :"
                        value={formData.reference}
                        onChange={handleChange}
                        validators={[VALIDATOR_REQUIRE()]}
                        placeholder="Ajouter la référence du produit"
                        required
                        gray
                      />
                      <Input
                        element="input"
                        id="name"
                        label="Nom d'appel :"
                        value={formData.name}
                        onChange={handleChange}
                        validators={[VALIDATOR_REQUIRE()]}
                        placeholder="Ajouter le libellé du produit"
                        required
                        gray
                      />
                    </div>
                    <div className="gap-5 grid grid-cols-2 grid-template-columns: [label] 1fr [select] 2fr;">
                      <Input
                        element="input"
                        id="name"
                        label="Désignation longue :"
                        value={formData.desLong}
                        onChange={handleChange}
                        validators={[VALIDATOR_REQUIRE()]}
                        placeholder="Ajouter la référence du produit"
                        required
                        gray
                      />
                      <Input
                        element="input"
                        id="name"
                        label="Désignation courte :"
                        value={formData.desShort}
                        onChange={handleChange}
                        validators={[VALIDATOR_REQUIRE()]}
                        placeholder=""
                        required
                        gray
                      />
                    </div>
                    <div className="gap-5 grid grid-cols-2 grid-template-columns: [label] 1fr [select] 2fr;">
                      <div className="flex flex-col gap-1">
                        <div>
                          <label className="relative text-[15px] font-bold text-gray-500">
                            Marque :{" "}
                            <span className="absolute top-[-5px] right-[-10px] text-red-400">
                              *
                            </span>
                          </label>
                        </div>
                        <CreatableSelect<BrandOption>
                          value={selectedOptionBrand}
                          onChange={handleChangeBrand}
                          onInputChange={handleInputChangeBrand}
                          inputValue={inputValueBrand}
                          options={optionsBrand}
                          placeholder="Selectionner une marque"
                          styles={customStyles}
                          className="block text-sm py-2.5 w-full text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-gray-200 peer capitalize"
                          required
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <div>
                          <label className="relative text-[15px] font-bold text-gray-500">
                            Collection :{" "}
                            <span className="absolute top-[-5px] right-[-10px] text-red-400">
                              *
                            </span>
                          </label>
                        </div>
                        <CreatableSelect<CollectionOption>
                          value={selectedOptionCollection}
                          onChange={handleChangeCollection}
                          onInputChange={handleInputChangeCollection}
                          inputValue={inputValueCollection}
                          options={optionsCollection}
                          placeholder="Selectionner une collection"
                          styles={customStyles}
                          className="block text-sm py-2.5 w-full text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-gray-200 peer capitalize"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="relative w-1/3 border border-gray-200 rounded-md px-4 py-7 shadow-md">
                    <span className="absolute top-[-12px] bg-white px-3 text-[13px] italic">
                      Classification principale
                    </span>
                    <div className="gap-5 grid grid-cols-1 grid-template-columns: [label] 1fr [select] 2fr;">
                      <div className="flex flex-col gap-1">
                        <div>
                          <label className="relative text-[15px] font-bold text-gray-500">
                            Famille :{" "}
                            <span className="absolute top-[-5px] right-[-10px] text-red-400">
                              *
                            </span>
                          </label>
                        </div>

                        <CreatableSelect<FamilyOption>
                          value={selectedOptionFamily}
                          onChange={handleChangeFamily}
                          onInputChange={handleInputChangeFamily}
                          inputValue={inputValueFamily}
                          options={optionsFamily}
                          placeholder="Selectionner une famille"
                          styles={customStyles}
                          className="block text-sm py-2.5 w-full text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-gray-200 peer capitalize"
                          required
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <div>
                          <label className="relative text-[15px] font-bold text-gray-500">
                            Sous-famille :{" "}
                          </label>
                        </div>
                        <CreatableSelect<FamilyOption>
                          value={selectedOptionFamily}
                          onChange={handleChangeFamily}
                          onInputChange={handleInputChangeFamily}
                          inputValue={inputValueFamily}
                          options={optionsFamily}
                          placeholder="Selectionner une sous-famille"
                          styles={customStyles}
                          className="block text-sm py-2.5 w-full text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-gray-200 peer capitalize"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-5">
                  <div className="relative w-2/3 border border-gray-200 rounded-md px-4 py-7 shadow-md">
                    <span className="absolute top-[-12px] bg-white px-3 text-[13px] italic">
                      Fournisseur principal
                    </span>
                    <div className="gap-5 grid grid-cols-1 grid-template-columns: [label] 1fr [select] 2fr;">
                      <Input
                        element="input"
                        id="supplier"
                        label="Nom :"
                        value={formData.supplier}
                        onChange={handleChange}
                        validators={[VALIDATOR_REQUIRE()]}
                        placeholder="Ajouter la référence du produit"
                        required
                        gray
                      />
                      <Input
                        element="input"
                        id="reference"
                        label="Reférence produit :"
                        value={formData.reference}
                        onChange={handleChange}
                        validators={[VALIDATOR_REQUIRE()]}
                        placeholder="Ajouter le libellé du produit"
                        required
                        gray
                      />
                    </div>
                  </div>

                  <div className="relative w-1/3 border border-gray-200 rounded-md px-4 py-7 shadow-md">
                    <span className="absolute top-[-12px] bg-white px-3 text-[13px] italic">
                      Caractéristiques du produit
                    </span>
                    <div className="gap-5 grid grid-cols-1 grid-template-columns: [label] 1fr [select] 2fr;">
                      <div>
                        <label className="relative text-[15px] font-bold text-gray-500">
                          Dimension :{" "}
                        </label>
                      </div>
                      <CreatableSelect
                        placeholder="Selectionner une dimension"
                        styles={customStyles}
                        value={formData.reference}
                        className="block text-sm py-2.5 w-full text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-gray-200 peer capitalize"
                      />
                      <div>
                        <label className="relative text-[15px] font-bold text-gray-500">
                          Composition :{" "}
                        </label>
                      </div>
                      <CreatableSelect
                        placeholder="Selectionner une composition"
                        styles={customStyles}
                        value={formData.reference}
                        className="block text-sm py-2.5 w-full text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-gray-200 peer capitalize"
                      />
                      <div>
                        <label className="relative text-[15px] font-bold text-gray-500">
                          Collection :{" "}
                        </label>
                      </div>
                      <CreatableSelect
                        placeholder="Selectionner une collection"
                        styles={customStyles}
                        value={formData.reference}
                        className="block text-sm py-2.5 w-full text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-gray-200 peer capitalize"
                      />
                      <div>
                        <label className="relative text-[15px] font-bold text-gray-500">
                          Thème :{" "}
                        </label>
                      </div>
                      <CreatableSelect
                        placeholder="Selectionner une thème"
                        styles={customStyles}
                        value={formData.reference}
                        className="block text-sm py-2.5 w-full text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-gray-200 peer capitalize"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {!isLoading ? (
                <div className="flex gap-2 mt-5">
                  <Button size="small" cancel>
                    <X size={15} />
                    Annuler
                  </Button>
                  <Button size="small" inverse type="submit">
                    <Save size={15} />
                    Sauvegarder
                  </Button>
                  <Button
                    size="small"
                    green
                    type="submit"
                    onClick={() => setFormData({ ...formData, status: 1 })}
                  >
                    <Plus size={15} />
                    Créer
                  </Button>
                </div>
              ) : (
                <div className="flex justify-center gap-2 mt-5">
                  <CircularProgress color="success" />
                </div>
              )}
            </form>
          </div>
        )}

        {page === "addFamilly" && (
          <div className="mt-7 mb-7">
            <CreateFamilyComponent />
          </div>
        )}

        {page === "addBrand" && (
          <div className="mt-7 mb-7">
            <CreateBrandComponent />
          </div>
        )}

        {page === "addCollection" && (
          <div className="mt-7 mb-7">
            <CreateCollectionComponent />
          </div>
        )}
      </Card>
    </div>
  );
}
