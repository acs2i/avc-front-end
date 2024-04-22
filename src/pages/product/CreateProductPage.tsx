import React, { useState } from "react";
import { Collapse, CircularProgress } from "@mui/material";
import { ChevronDown, ChevronUp, MoveLeft, Plus, Save, X } from "lucide-react";
import Input from "../../components/FormElements/Input";
import { Link } from "react-router-dom";
import Card from "../../components/Shared/Card";
import Button from "../../components/FormElements/Button";
import { LINKCARD_EDIT, Sizes } from "../../utils/index";
import { LinkCard } from "@/type";
import { Divider } from "@mui/material";
import { useSelector } from "react-redux";
import CreateFamilyComponent from "../../components/CreateFamilyComponent";
import CreateBrandComponent from "../../components/CreateBrandComponent";
import CreateCollectionComponent from "../../components/CreateCollectionComponent";
import { VALIDATOR_REQUIRE } from "../../utils/validator";
import MultiSelect from "../../components/FormElements/MultiSelect";
import useNotify from "../../utils/hooks/useToast";
import "react-toastify/dist/ReactToastify.css";
import useFetch from "../../utils/hooks/usefetch";

import CreatableSelect from "react-select/creatable";

import { colourOptions } from "../../data";

interface Family {
  _id: string;
  name: string;
}

interface Collection {
  _id: string;
  name: string;
}

interface SubFamily {
  _id: string;
  name: string;
}

interface Brand {
  _id: string;
  name: string;
}

interface FormData {
  reference: string;
  name: string;
  family: any;
  subFamily: any;
  brand: string;
  productCollection: string;
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

export default function CreateProductPage() {
  const user = useSelector((state: any) => state.auth.user);
  const [page, setPage] = useState("addProduct");
  const [isLoading, setIsLoading] = useState(false);
  const [uvcIsOpen, setUvcIsOpen] = useState(false);
  const [createProductIsOpen, setCreateProductcIsOpen] = useState(true);
  const [familyId, setFamilyId] = useState<string>("");
  const { notifySuccess, notifyError } = useNotify();
  const [formData, setFormData] = useState<FormData>({
    reference: "",
    name: "",
    family: [],
    subFamily: [],
    brand: "",
    productCollection: "",
    uvc: {
      code: "",
      color: [],
      size: [],
      price: [],
    },
    status: 0,
    creatorId: user._id,
  });
  const resetForm = () => {
    setFormData({
      reference: "",
      name: "",
      family: [],
      subFamily: [],
      brand: "",
      productCollection: "",
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

  const handleOpenUvcCollapse = (event: any) => {
    event.preventDefault();
    setUvcIsOpen(!uvcIsOpen);
  };
  const handleOpenProductCollapse = (event: any) => {
    event.preventDefault();
    setCreateProductcIsOpen(!createProductIsOpen);
  };

  // Récupération données
  const handleChange = async (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
      | { target: { id: string; value: any } }
  ) => {
    const { id, value } = e.target || e;

    if (id === "family") {
      const selectedFamilyObject = famillies?.find(
        (family: any) => family._id === value
      );
      if (selectedFamilyObject) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          family: selectedFamilyObject.name,
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
        uvc: {
          ...prevFormData.uvc,
          [id]: value,
        },
      }));
    }
  };

  // Fonctions récupération des données (famille, sous-famille, marques, collection)
  const { data: famillies } = useFetch<Family[]>(
    `${process.env.REACT_APP_URL_DEV}/api/v1/family`
  );

  const { data: subFamillies } = useFetch(
    familyId &&
      `${process.env.REACT_APP_URL_DEV}/api/v1/family/subFamily/${familyId}`
  );

  const { data: brands } = useFetch<Brand[]>(
    `${process.env.REACT_APP_URL_DEV}/api/v1/brand`
  );

  const { data: collections } = useFetch<Collection[]>(
    `${process.env.REACT_APP_URL_DEV}/api/v1/collection`
  );

  // Mapping des données pour crée les options des input select
  const options =
    famillies?.map(({ _id, name }) => ({ value: _id, label: name, name })) ??
    [];
  const selectedFamilyName = famillies?.find(
    (family: Family) => family._id === formData.family
  )?.name;
  const collectionOptions =
    collections?.map(({ name }) => ({ value: name, label: name, name })) ?? [];
  const brandOptions: { value: string; label: string }[] =
    brands?.map(({ name }) => ({ value: name, label: name })) ?? [];

  // Envoi du formulaire de création de produit
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
        notifySuccess("Produit créée avec succès!");
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

  return (
    <div className="mt-7">
      <Link
        to="/edit"
        className="flex items-center justify-start gap-3 mb-5 font-bold text-gray-600"
      >
        <MoveLeft />
        <span>Retour</span>
      </Link>
      <Card title="Panel d'ajout">
        <div className="mt-4 mb-[50px] px-4">
          <div className="flex items-center gap-7">
            {LINKCARD_EDIT.map((link: LinkCard, i) => (
              <React.Fragment key={i}>
                <button
                  className={`font-bold text-gray-600 ${
                    page === link.page ? "text-green-700" : ""
                  } ${page === link.page ? "animate-bounce" : ""}`}
                  onClick={() => setPage(link.page)}
                >
                  {link.name}
                </button>
                <div className="w-[1px] h-[20px] bg-gray-300"></div>
              </React.Fragment>
            ))}
          </div>
          <div className="mt-6">
            <Divider />
          </div>
        </div>

        {page === "addProduct" && (
          <div className="mt-7 mb-7">
            <form
              className="flex flex-col gap-4 w-[90%] mx-auto"
              onSubmit={handleCreateProduct}
            >
              <div className="flex items-center gap-3 h-[70px]">
                <div className="h-2/3 w-[8px] bg-emerald-700"></div>
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
                        id="reference"
                        label="Désignation longue :"
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
                        label="Désignation courte :"
                        value={formData.name}
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
                        <CreatableSelect
                          placeholder="Selectionner une marque"
                          styles={customStyles}
                          value={formData.brand}
                          // onChange={handleChange}
                          className="block text-sm py-2.5 w-full text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-gray-200 peer capitalize"
                          options={brandOptions}
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
                        <CreatableSelect
                          placeholder="Selectionner une collection"
                          styles={customStyles}
                          value={formData.productCollection}
                          // onChange={handleChange}
                          className="block text-sm py-2.5 w-full text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-gray-200 peer capitalize"
                          options={collectionOptions}
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
                        <CreatableSelect
                          placeholder="Selectionner une famille"
                          styles={customStyles}
                          value={selectedFamilyName}
                          //onChange={handleChange}
                          className="block text-sm py-2.5 w-full text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-gray-200 peer capitalize"
                          options={options}
                          required
                          isMulti
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <div>
                          <label className="relative text-[15px] font-bold text-gray-500">
                            Sous-famille :{" "}
                          </label>
                        </div>
                        <CreatableSelect
                          placeholder="Selectionner une sous-famille"
                          styles={customStyles}
                          value={formData.subFamily}
                          onChange={handleChange}
                          className="block text-sm py-2.5 w-full text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-gray-200 peer capitalize"
                          options={
                            familyId
                              ? Array.isArray(subFamillies)
                                ? subFamillies
                                : []
                              : []
                          }
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
                        id="name"
                        label="Nom :"
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
                        label="Reférence produit :"
                        value={formData.name}
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
                        onChange={handleChange}
                        className="block text-sm py-2.5 w-full text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-gray-200 peer capitalize"
                        options={" "}
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
                        onChange={handleChange}
                        className="block text-sm py-2.5 w-full text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-gray-200 peer capitalize"
                        options={" "}
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
                        onChange={handleChange}
                        className="block text-sm py-2.5 w-full text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-gray-200 peer capitalize"
                        options={" "}
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
                        onChange={handleChange}
                        className="block text-sm py-2.5 w-full text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-gray-200 peer capitalize"
                        options={" "}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* <div>
                <div
                  className="flex items-center gap-3 h-[70px]"
                  onClick={handleOpenUvcCollapse}
                >
                  <h5 className="text-2xl text-gray-600">
                    <span className="font-bold text-gray-700">Création</span> de
                    l'uvc du produit
                  </h5>
                  <button className="focus:outline-none text-gray-500">
                    {!uvcIsOpen && <ChevronDown size={25} />}
                    {uvcIsOpen && <ChevronUp size={25} />}
                  </button>
                </div>
                <Collapse in={uvcIsOpen}>
                  <h6>Uvc 1</h6>
                  <div className="gap-5 grid grid-cols-2 grid-template-columns: [label] 1fr [select] 2fr; mb-[50px]">
                    <div className="flex flex-col gap-1">
                      <Input
                        element="input"
                        id="code"
                        label="Code fournisseur :"
                        value={formData.uvc.code}
                        onChange={handleChange}
                        validators={[]}
                        placeholder="Veuillez saisir le code fournisseur"
                        gray
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <MultiSelect
                        id="size"
                        label="Tailles :"
                        options={Sizes}
                        value={formData.uvc.size}
                        onChange={(selectedOptions) =>
                          handleChange({
                            target: { id: "size", value: selectedOptions },
                          })
                        }
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <Input
                        element="input"
                        id="color"
                        label="Couleurs :"
                        value={formData.uvc.color}
                        onChange={handleChange}
                        validators={[]}
                        placeholder="Veuillez saisir le ou les couleurs"
                        gray
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <Input
                        element="input"
                        id="price"
                        label="Prix :"
                        value={formData.uvc.price}
                        onChange={handleChange}
                        validators={[]}
                        placeholder="Veuillez saisir le prix"
                        gray
                      />
                    </div>
                  </div>
                </Collapse>
              </div> */}

              {!isLoading ? (
                <div className="flex gap-2 mt-5">
                  <Button
                    size="small"
                    green
                    type="submit"
                    onClick={() => setFormData({ ...formData, status: 1 })}
                  >
                    <Plus size={15} />
                    Créer
                  </Button>
                  <Button size="small" inverse type="submit">
                    <Save size={15} />
                    Sauvegarder
                  </Button>
                  <Button size="small" cancel>
                    <X size={15} />
                    Annuler
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
