import React, { useState, useEffect } from "react";
import Input from "../../components/FormElements/Input";
import { useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { useLocation, useNavigate } from "react-router-dom";
import Card from "../../components/Shared/Card";
import {
  ArrowBigRight,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  ImageUp,
  Maximize2,
  Minimize2,
  MinusCircle,
  Plus,
  Trash,
  Trash2,
} from "lucide-react";
import Button from "../../components/FormElements/Button";
import useNotify from "../../utils/hooks/useToast";
import { CircularProgress, Divider } from "@mui/material";
import { ActionMeta, SingleValue } from "react-select";
import CreatableSelect from "react-select/creatable";
import UVCGrid from "../../components/UVCGrid";
import CountrySelector from "../../components/Shared/CountrySelect";
import { LINKS_Product, LINKS_UVC } from "../../utils/index";
import UVCInfosTable from "../../components/UVCInfosTable";
import UVCPriceTable from "../../components/UVCPricesTable";
import UVCSupplierTable from "../../components/UVCSupplierTable";
import UVCGrid2 from "../../components/UVCGrid_2";
import FormSection from "../../components/Formulaires/FormSection";
import Modal from "../../components/Shared/Modal";
import SupplierFormComponent from "../../components/SupplierFormComponent";

interface PriceItemSchema {
  peau: number;
  tbeu_pb: number;
  tbeu_pmeu: number;
}

interface Price {
  tarif_id: any;
  currency: string;
  supplier_id: any;
  price: PriceItemSchema;
  store: string;
}

interface Uvc {
  code: string;
  dimensions: string[];
  prices: Price[];
  eans: string[];
  status: string;
  additional_fields: any;
}
interface Supplier {
  supplier_id: string;
  supplier_ref: string;
  pcb: string;
  custom_cat: string;
  made_in: string;
  company_name: string; 
}

interface FormData {
  creator_id: any;
  reference: string;
  name: string;
  short_label: string;
  long_label: string;
  type: string;
  tag_ids: any[];
  suppliers: Supplier[];
  dimension_types: string;
  brand_ids: any[];
  collection_ids: any[];
  peau: number;
  tbeu_pb: number;
  tbeu_pmeu: number;
  imgPath: string;
  status: string;
  additional_fields: any;
  uvc: Uvc[];
  initialSizes: any[];
  initialColors: any[];
  initialGrid: any[];
}

type Tag = {
  _id: string;
  level: string;
  code: string;
  name: string;
};

type TagOption = {
  value: string;
  label: string;
};

type ClasificationOption = {
  value: string;
  label: string;
  name: string;
};

type BrandOption = {
  _id: string;
  value: string;
  label: string;
  code: string;
};

type SuppliersOption = {
  _id: string;
  value: string;
  label: string;
  company_name: string;
  supplier_ref?: string;  // Champs optionnels
  pcb?: string;
  custom_cat?: string;
  made_in?: string;
};


type CollectionOption = {
  _id: string;
  value: string;
  label: string;
  code: string;
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
  const location = useLocation();
  const [supplierModalIsOpen, setsupplierModalIsOpen] = useState(false);
  const [page, setPage] = useState("dimension");
  const [onglet, setOnglet] = useState("infos");
  const [brandLabel, setBrandLabel] = useState("");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [classificationValue, setClassificationValue] =
    useState("Au vieux campeur");
  const [currentPage, setCurrentPage] = useState(1);
  const [inputValueFamily, setInputValueFamily] = useState("");
  const [inputValueClassification, setInputValueClassification] = useState("");
  const [selectedSuppliers, setSelectedSuppliers] = useState<SuppliersOption[]>(
    []
  );
  const [inputSubValueFamily, setInputSubValueFamily] = useState("");
  const [inputValueSubSubFamily, setInputValueSubSubFamily] = useState("");
  const [inputValueBrand, setInputValueBrand] = useState("");
  const [inputValueCollection, setInputValueCollection] = useState("");
  const [inputValueSupplier, setInputValueSupplier] = useState("");
  const [selectedOptionFamily, setSelectedOptionFamily] =
    useState<SingleValue<TagOption> | null>(null);
  const [selectedOptionSubFamily, setSelectedOptionSubFamily] =
    useState<SingleValue<TagOption> | null>(null);
  const [selectedOptionSubSubFamily, setSelectedOptionSubSubFamily] =
    useState<SingleValue<TagOption> | null>(null);
  const [selectedOptionBrand, setSelectedOptionBrand] =
    useState<SingleValue<BrandOption> | null>(null);
  const [selectedOptionCollection, setSelectedOptionCollection] =
    useState<SingleValue<CollectionOption> | null>(null);
  const [selectedOptionSupplier, setSelectedOptionSupplier] =
    useState<SingleValue<SuppliersOption> | null>(null);
  const [optionsFamily, setOptionsFamily] = useState<TagOption[]>([]);
  const [optionsSubFamily, setOptionsSubFamily] = useState<TagOption[]>([]);
  const [optionsSubSubFamily, setOptionsSubSubFamily] = useState<TagOption[]>(
    []
  );
  const [newSupplier, setNewSupplier] = useState<Supplier>({
    supplier_id: "",
    supplier_ref: "",
    pcb: "",
    custom_cat: "",
    made_in: "",
    company_name: ""
  });
  const [selectedSupplierIndex, setSelectedSupplierIndex] = useState<
    number | null
  >(null);
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
    reference: "",
    name: "",
    short_label: "",
    long_label: "",
    type: "Marchandise",
    tag_ids: [],
    suppliers: [],
    dimension_types: "Couleur/Taille",
    brand_ids: [],
    collection_ids: [],
    peau: 0,
    tbeu_pb: 0,
    tbeu_pmeu: 0,
    imgPath: "",
    status: "A",
    additional_fields: "",
    uvc: [
      {
        code: "",
        dimensions: [],
        prices: [
          {
            tarif_id: "",
            currency: "",
            supplier_id: "",
            price: {
              peau: 0,
              tbeu_pb: 0,
              tbeu_pmeu: 0,
            },
            store: "",
          },
        ],
        eans: [],
        status: "",
        additional_fields: {},
      },
    ],
    initialSizes: ["000"],
    initialColors: ["000"],
    initialGrid: [[true]],
  });

  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [uvcGrid, setUvcGrid] = useState<boolean[][]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
      short_label:
        e.target.id === "long_label"
          ? e.target.value.substring(0, 15)
          : formData.short_label,
    });
  };

  const handleChangeBrand = (selectedOption: SingleValue<BrandOption>) => {
    const brandId = selectedOption ? selectedOption.value : "";
    setSelectedOptionBrand(selectedOption);
    setFormData((prevFormData) => ({
      ...prevFormData,
      brand_ids: [brandId],
    }));
    const brandLabel = selectedOption ? selectedOption.label : "";
    setBrandLabel(brandLabel);
  };

  const handleChangeCollection = (
    selectedOption: SingleValue<CollectionOption>
  ) => {
    const collectionId = selectedOption ? selectedOption.value : "";
    setSelectedOptionCollection(selectedOption);
    setFormData((prevFormData) => ({
      ...prevFormData,
      collection_ids: [collectionId],
    }));
  };

  const handleChangeFamily = (newValue: SingleValue<TagOption> | null) => {
    setSelectedOptionFamily(newValue);

    setFormData((prevFormData) => {
      let newTagIds = [...prevFormData.tag_ids];
      if (newValue) {
        newTagIds[0] = newValue.value; // Place le Family ID à l'index 0
      } else {
        newTagIds[0] = ""; // Retire la famille si aucun n'est sélectionné
      }
      return {
        ...prevFormData,
        tag_ids: newTagIds.filter(Boolean), // Supprime les valeurs vides
      };
    });
  };

  const handleChangeSubFamily = (newValue: SingleValue<TagOption> | null) => {
    setSelectedOptionSubFamily(newValue);

    setFormData((prevFormData) => {
      let newTagIds = [...prevFormData.tag_ids];
      if (newValue) {
        newTagIds[1] = newValue.value; // Place le SubFamily ID à l'index 1
      } else {
        newTagIds[1] = ""; // Retire la sous-famille si aucun n'est sélectionné
      }
      return {
        ...prevFormData,
        tag_ids: newTagIds.filter(Boolean), // Supprime les valeurs vides
      };
    });
  };

  const handleChangeSubSubFamily = (
    newValue: SingleValue<TagOption> | null
  ) => {
    setSelectedOptionSubSubFamily(newValue);

    setFormData((prevFormData) => {
      let newTagIds = [...prevFormData.tag_ids];
      if (newValue) {
        newTagIds[2] = newValue.value; // Place le SubSubFamily ID à l'index 2
      } else {
        newTagIds[2] = ""; // Retire la sous-sous-famille si aucun n'est sélectionné
      }
      return {
        ...prevFormData,
        tag_ids: newTagIds.filter(Boolean), // Supprime les valeurs vides
      };
    });
  };

  const handleDimensionsChange = (
    newDimensions: { color: string; size: string }[]
  ) => {
    const newUVCs = newDimensions.map((dim) => ({
      code: "",
      dimensions: [`${dim.color}/${dim.size}`],
      prices: [
        {
          tarif_id: "",
          currency: "",
          supplier_id: "",
          price: {
            peau: formData.peau,
            tbeu_pb: formData.tbeu_pb,
            tbeu_pmeu: formData.tbeu_pmeu,
          },
          store: "",
        },
      ],
      eans: [],
      status: "",
      additional_fields: {},
    }));

    setFormData((prevFormData) => ({
      ...prevFormData,
      uvc: newUVCs,
    }));
    console.log(newUVCs);
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
          value: brand._id, // Assurez-vous que cette valeur est l'ID de la marque
          label: brand.label,
        }));

        setOptionsBrand(optionsBrand);
      } catch (error) {
        console.error("Erreur lors de la requête", error);
      }
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/brand/search?label=${inputValueBrand}&page=${currentPage}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();

      const optionsBrand = data.data?.map((brand: BrandOption) => ({
        value: brand._id, // Assurez-vous que cette valeur est l'ID de la marque
        label: brand.label,
      }));

      setOptionsBrand(optionsBrand);
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    }
  };

  const handleInputChangeCollection = async (inputValueCollection: string) => {
    setInputValueCollection(inputValueCollection);

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
            value: collection._id,
            label: collection.label,
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
        `${process.env.REACT_APP_URL_DEV}/api/v1/collection/search?label=${inputValueCollection}&page=${currentPage}&limit=${limit}`,
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
          value: collection._id,
          label: collection.label,
        })
      );

      setOptionsCollection(optionsCollection);
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    }
  };

  const handleInputChangeSupplier = async (inputValueSupplier: string) => {
    setInputValueSupplier(inputValueSupplier);

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
          value: supplier._id,
          label: supplier.company_name,
        }));

        setOptionsSupplier(optionsSupplier);
      } catch (error) {
        console.error("Erreur lors de la requête", error);
      }
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/supplier/search?company_name=${inputValueSupplier}&page=${currentPage}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();

      const optionsSupplier = data.data?.map((supplier: SuppliersOption) => ({
        value: supplier._id,
        label: supplier.company_name,
      }));

      setOptionsSupplier(optionsSupplier);
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    }
  };

  const handleClassificationChange = (
    newValue: SingleValue<TagOption>,
    actionMeta: ActionMeta<TagOption>
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
          `${process.env.REACT_APP_URL_DEV}/api/v1/tag`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();

        const optionsFamily = data.data?.map((tag: Tag) => ({
          value: tag._id,
          label: tag.name,
        }));

        setOptionsFamily(optionsFamily);
      } catch (error) {
        console.error("Erreur lors de la requête", error);
      }
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/tag/search?name=${inputValueFamily}&page=${currentPage}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();

      const optionsFamily = data.data?.map((tag: Tag) => ({
        value: tag._id,
        label: tag.name,
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
          `${process.env.REACT_APP_URL_DEV}/api/v1/tag/search?level=sous-famille`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();

        const optionsSubFamily = data.data?.map((tag: Tag) => ({
          value: tag._id,
          label: tag.name,
        }));

        setOptionsSubFamily(optionsSubFamily);
      } catch (error) {
        console.error("Erreur lors de la requête", error);
      }
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/tag/search?name=${inputValueSubFamily}&level=sous-famille&page=${currentPage}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();

      const optionsSubFamily = data.data?.map((tag: Tag) => ({
        value: tag._id,
        label: tag.name,
      }));

      setOptionsSubFamily(optionsSubFamily);
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    }
  };

  const handleInputChangeSubSubFamily = async (
    inputValueSubSubFamily: string
  ) => {
    setInputValueSubSubFamily(inputValueSubSubFamily);

    if (inputValueSubSubFamily === "") {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_URL_DEV}/api/v1/tag/search?level=sous-sous-famille`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();

        const optionsSubSubFamily = data.data?.map((tag: Tag) => ({
          value: tag._id,
          label: tag.name,
        }));

        setOptionsSubSubFamily(optionsSubSubFamily);
      } catch (error) {
        console.error("Erreur lors de la requête", error);
      }
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/tag/search?name=${inputValueSubSubFamily}&level=sous-sous-famille&page=${currentPage}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();

      const optionsSubSubFamily = data.data?.map((tag: Tag) => ({
        value: tag._id,
        label: tag.name,
      }));

      setOptionsSubSubFamily(optionsSubSubFamily);
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    }
  };

  const handleSupplierSelectChange = (index: number, option: SuppliersOption) => {
    const selectedSupplier = optionsSupplier.find(
      (supplier) => supplier.value === option?.value
    );
  
    if (selectedSupplier) {
      setSelectedSuppliers((prevSuppliers) => {
        const newSupplier = {
          _id: selectedSupplier.value,
          value: selectedSupplier.value,
          label: selectedSupplier.label,
          company_name: selectedSupplier.label,
          supplier_ref: "",
          pcb: "",
          custom_cat: "",
          made_in: "0",
        };
  
        // Ajoute le nouveau fournisseur à la fin du tableau
        return [...prevSuppliers, newSupplier];
      });
  
      // Mettez à jour `newSupplier` pour le fournisseur actuellement sélectionné
      setNewSupplier({
        supplier_id: selectedSupplier.value,
        company_name: selectedSupplier.label,
        supplier_ref: "",
        pcb: "",
        custom_cat: "",
        made_in: "",
      });
    }
  };
  

  const addSupplier = (newSupplier: any) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      suppliers: [...prevFormData.suppliers, newSupplier],
    }));

    setNewSupplier({
      supplier_id: "",
      company_name: "",
      supplier_ref: "",
      pcb: "",
      custom_cat: "",
      made_in: "",
    });
    
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: value === "" ? 0 : parseFloat(value),
    }));
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
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        setTimeout(() => {
          notifySuccess("Référence créée !");
          setIsLoading(false);
          navigate("/draft");
        }, 100);
      } else {
        notifyError("Erreur lors de la création !");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Erreur lors de la requête", error);
      setIsLoading(false);
    }
  };

  const removeSupplier = (index: number) => {
    setFormData((prevFormData) => {
      const newSuppliers = prevFormData.suppliers.filter((_, i) => i !== index);
      return {
        ...prevFormData,
        suppliers: newSuppliers,
      };
    });
  };

  const toggleFullScreen = () => {
    setIsFullScreen((prevState) => !prevState);
  };

 

  useEffect(() => {
    if (supplierModalIsOpen) {
      setNewSupplier({
        supplier_id: "",
        supplier_ref: "",
        pcb: "",
        custom_cat: "",
        made_in: "",
        company_name: ""
      });
      setInputValueSupplier("");
    }
  }, [supplierModalIsOpen]);

  console.log(formData);
  return (
    <>
      <Modal
        show={supplierModalIsOpen}
        onCancel={() => setsupplierModalIsOpen(false)}
        onClose={() => setsupplierModalIsOpen(false)}
        header="Ajouter un fournisseur"
      >
        <SupplierFormComponent
          supplier={newSupplier}
          index={0} // Pas besoin de multiples index ici car c'est un formulaire d'ajout
          optionsSupplier={optionsSupplier}
          inputValueSupplier={inputValueSupplier}
          handleSupplierSelectChange={handleSupplierSelectChange}
          handleInputChangeSupplier={handleInputChangeSupplier}
          handleSupplierChange={(index, field, value) => {
            setNewSupplier({ ...newSupplier, [field]: value });
          }}
          removeSupplier={() => {}}
          onCloseModal={() => setsupplierModalIsOpen(false)}
          addSupplier={addSupplier}
        />
      </Modal>
      <section className="w-full bg-slate-50 p-7">
        <div className="max-w-[2024px] mx-auto">
          <form onSubmit={handleSubmit} className="mb-[400px]">
            <div className="flex justify-between">
              <div>
                <h3 className="text-[32px] font-[800] text-gray-800">
                  Création <span className="font-[200]">d'une référence</span>
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
                      Créer la référence
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="mt-3">
                  <CircularProgress />
                </div>
              )}
            </div>

            <div className="flex flex-col-reverse lg:flex-row gap-7 mt-[50px] items-stretch">
              <div className="w-[60%]">
                <FormSection title="Identification">
                  <div className="mt-3">
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
                      id="name"
                      label="Nom d'appel :"
                      value={formData.name}
                      onChange={handleChange}
                      validators={[]}
                      placeholder="Ajouter le nom d'appel du produit"
                      create
                      gray
                    />
                    <Input
                      element="input"
                      id="long_label"
                      label="Désignation longue :"
                      value={formData.long_label}
                      onChange={handleChange}
                      validators={[]}
                      placeholder="Ajouter la designation du produit"
                      create
                      gray
                    />
                    <Input
                      element="input"
                      id="short_label"
                      label="Désignation Courte :"
                      value={formData.short_label}
                      onChange={handleChange}
                      validators={[]}
                      placeholder=""
                      create
                      gray
                    />
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
                    <div className="mt-[30px] grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          inputValue=""
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
                      {classificationValue && (
                        <div className="col-span-1">
                          <label className="text-sm font-medium text-gray-600">
                            Sous-sous-famille
                          </label>
                          <CreatableSelect
                            value={selectedOptionSubSubFamily}
                            onChange={handleChangeSubSubFamily}
                            onInputChange={handleInputChangeSubSubFamily}
                            inputValue={inputValueSubSubFamily}
                            options={optionsSubSubFamily}
                            placeholder="Selectionner une sous-sous-famille"
                            styles={customStyles}
                            className="mt-2 block text-sm py-1 w-full rounded-lg text-gray-500 border border-gray-200 focus:outline-none focus:ring-0 focus:border-gray-200 peer capitalize"
                            required
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </FormSection>
              </div>
              <div className="w-[480px] h-[400px] flex flex-col gap-5 border border-dashed border-2 border-slate-200 hover:bg-white hover:bg-opacity-75 transition-all duration-300 cursor-pointer">
                <div className="w-full h-full flex justify-center items-center rounded-md">
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
              </div>
            </div>
            <div className="flex gap-2 mt-[50px]">
              <div className="w-1/3 flex flex-col">
                <FormSection title="Fournisseurs">
                  <div className="flex flex-col gap-2">
                    {selectedSuppliers.map((supplier, index) =>
                      supplier?.company_name ? (
                        <div
                          key={index}
                          className={`text-center rounded-md cursor-pointer hover:brightness-125 shadow-md ${
                            index === 0 ? "bg-[#3B71CA]" : "bg-slate-400"
                          }`}
                        >
                          <span className="text-[20px] text-white font-bold">
                            {supplier.company_name}
                          </span>
                        </div>
                      ) : null
                    )}
                  </div>
                  <div
                    className="flex flex-col items-center justify-center p-[20px] text-orange-400 hover:text-orange-300 cursor-pointer"
                    onClick={() => setsupplierModalIsOpen(true)}
                  >
                    <div className="flex items-center gap-2 text-[12px] mt-3">
                      <Plus size={30} />
                    </div>
                    <p className="font-[700]">Ajouter un fournisseur</p>
                  </div>
                </FormSection>
              </div>
              <div className="w-1/3 flex flex-col gap-2">
                <FormSection title="Caractéristiques Produit" size="h-[300px]">
                  <div className="mt-3">
                    <Input
                      element="input"
                      id="product_type"
                      label="Type :"
                      value={formData.type}
                      onChange={handleChange}
                      validators={[]}
                      placeholder="Selectionnez un type de dimension"
                      create
                      disabled
                      gray
                    />
                    <Input
                      element="input"
                      id="dimension_type"
                      label="Type de dimension :"
                      value={formData.dimension_types}
                      onChange={handleChange}
                      validators={[]}
                      placeholder="Selectionnez un type de dimension"
                      create
                      disabled
                      gray
                    />
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
                </FormSection>
              </div>
              <div className="w-1/3 flex flex-col gap-2">
                <FormSection title="Prix" size="h-[300px]">
                  <div className="mt-3">
                    <Input
                      element="input"
                      id="peau"
                      label="Prix achat :"
                      value={formData.peau}
                      onChange={handlePriceChange}
                      validators={[]}
                      placeholder=""
                      create
                      gray
                    />
                    <Input
                      element="input"
                      id="tbeu_pb"
                      label="Prix Vente :"
                      value={formData.tbeu_pb}
                      onChange={handlePriceChange}
                      validators={[]}
                      placeholder=""
                      create
                      gray
                    />
                    <Input
                      element="input"
                      id="tbeu_pmeu"
                      label="Prix Modulé :"
                      value={formData.tbeu_pmeu}
                      onChange={handlePriceChange}
                      validators={[]}
                      placeholder=""
                      create
                      gray
                    />
                  </div>
                </FormSection>
              </div>
            </div>
            <div className="mt-3">
              <Divider />
            </div>
            {/* Partie onglets */}
            <div className="mt-[30px] flex mb-[50px]">
              <div className="w-[30%] border-t-[1px] border-gray-300">
                {LINKS_Product.map((link) => (
                  <div
                    key={link.page}
                    className={`relative border-r-[1px] border-b-[1px] border-gray-300 py-4 flex items-center gap-3 cursor-pointer ${
                      page === link.page ? "text-blue-500" : "text-gray-500"
                    } hover:text-blue-500`}
                    onClick={() => setPage(link.page)}
                  >
                    {React.createElement(link.icon, {
                      size: new RegExp(`^${link.link}(/.*)?$`).test(
                        location.pathname
                      )
                        ? 20
                        : 15,
                    })}
                    <span className="text-xs font-[600]">{link.name}</span>
                    {page === link.page && (
                      <>
                        <div
                          className="absolute right-0 top-1/2 transform -translate-y-1/2 rotate-180 w-5 h-5 bg-gray-300"
                          style={{
                            clipPath: "polygon(0 0, 100% 50%, 0 100%)",
                          }}
                        ></div>
                        <div
                          className="absolute right-[-1px] top-1/2 transform -translate-y-1/2 rotate-180 w-4 h-4 bg-gray-100"
                          style={{
                            clipPath: "polygon(0 0, 100% 50%, 0 100%)",
                          }}
                        ></div>
                      </>
                    )}
                  </div>
                ))}
              </div>
              {page === "dimension" && (
                <div
                  className={`border-t-[1px] border-gray-300 px-5 py-2 overflow-y-auto ${
                    isFullScreen
                      ? "fixed right-0 top-0 h-full w-full z-[9999] bg-gray-100"
                      : "w-[70%]"
                  }`}
                >
                  <UVCGrid2
                    onDimensionsChange={handleDimensionsChange}
                    initialSizes={formData.initialSizes}
                    initialColors={formData.initialColors}
                    initialGrid={formData.initialGrid}
                    setSizes={setSizes}
                    setColors={setColors}
                    setUvcGrid={setUvcGrid}
                    sizes={sizes}
                    colors={colors}
                    uvcGrid={uvcGrid}
                    isFullScreen={toggleFullScreen}
                  />
                </div>
              )}
              {page === "uvc" && (
                <div
                  className={`border-t-[1px] border-gray-300 px-5 py-2 ${
                    isFullScreen
                      ? "fixed right-0 top-0 h-full w-full z-[9999] bg-gray-100"
                      : "w-[70%]"
                  } overflow-y-auto`}
                >
                  <div className="flex items-center justify-between">
                    <ul className="flex items-center py-3 gap-3">
                      {LINKS_UVC.map((link) => (
                        <li
                          key={link.page}
                          className={`text-[13px] font-[700] cursor-pointer ${
                            onglet === link.page
                              ? "text-blue-500"
                              : "text-gray-500"
                          } hover:text-blue-500`}
                          onClick={() => setOnglet(link.page)}
                        >
                          {link.name}
                        </li>
                      ))}
                    </ul>
                    <div
                      className="cursor-pointer hover:text-gray-400"
                      onClick={toggleFullScreen}
                    >
                      {isFullScreen ? (
                        <Minimize2 size={17} />
                      ) : (
                        <Maximize2 size={17} />
                      )}
                    </div>
                  </div>
                  {formData.uvc.map((uvc, index) => (
                    <div key={index}>
                      {onglet === "infos" && (
                        <UVCInfosTable
                          uvcDimension={uvc.dimensions || []}
                          productReference={formData.reference || ""}
                          brandLabel={brandLabel}
                        />
                      )}
                      {/* {onglet === "price" && (
                          <UVCPriceTable
                            uvcPrices={uvc.prices}
                            productReference={formData.reference || ""}
                            handleChangePrice={(priceIndex, field, value) =>
                              handleChangePriceUVC(index, priceIndex, field, value)
                            }
                          />
                        )} */}
                      {/* {onglet === "supplier" && (
                          <UVCSupplierTable
                            uvcDimensions={uvc.dimensions || []}
                            productReference={formData.reference || ""}
                            productSupplier={
                              formData.suppliers[0]?.supplier_id || ""
                            }
                          />
                        )} */}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Partie boutton */}
            {!isLoading ? (
              <div className="mt-[50px] flex gap-2">
                <button
                  className="w-full bg-[#9FA6B2] text-white py-2 rounded-md font-[600] hover:bg-[#bac3d4] hover:text-white shadow-md"
                  type="button"
                >
                  Annuler
                </button>
                <button
                  className="w-full bg-[#3B71CA] text-white py-2 rounded-md font-[600] hover:bg-sky-500 shadow-md"
                  type="submit"
                >
                  Créer la référence
                </button>
              </div>
            ) : (
              <div className="relative flex justify-center mt-7 px-7 gap-2">
                <CircularProgress size={100} />
                <div className="absolute h-[60px] w-[80px] top-[50%] translate-y-[-50%]">
                  <img
                    src="/img/logo.png"
                    alt="logo"
                    className="w-full h-full animate-pulse"
                  />
                </div>
              </div>
            )}
          </form>
        </div>
      </section>
    </>
  );
}
