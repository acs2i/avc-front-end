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
  const [additionalFields, setAdditionalFields] = useState([
    { name: "", value: "" },
  ]);
  const { notifySuccess, notifyError } = useNotify();
  const location = useLocation();
  const [page, setPage] = useState("dimension");
  const [onglet, setOnglet] = useState("infos");
  const [brandLabel, setBrandLabel] = useState("")
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [classificationValue, setClassificationValue] =
    useState("Au vieux campeur");
  const [currentPage, setCurrentPage] = useState(1);
  const [inputValueFamily, setInputValueFamily] = useState("");
  const [inputValueClassification, setInputValueClassification] = useState("");
  const [addFieldIsVisible, setaddFieldIsVisible] = useState(false);
  const [inputSubValueFamily, setInputSubValueFamily] = useState("");
  const [inputValueBrand, setInputValueBrand] = useState("");
  const [inputValueCollection, setInputValueCollection] = useState("");
  const [inputValueSupplier, setInputValueSupplier] = useState("");
  const [selectedOptionFamily, setSelectedOptionFamily] =
    useState<SingleValue<TagOption> | null>(null);
  const [selectedOptionSubFamily, setSelectedOptionSubFamily] =
    useState<SingleValue<TagOption> | null>(null);
  const [selectedOptionBrand, setSelectedOptionBrand] =
    useState<SingleValue<BrandOption> | null>(null);
  const [selectedOptionCollection, setSelectedOptionCollection] =
    useState<SingleValue<CollectionOption> | null>(null);
  const [selectedOptionSupplier, setSelectedOptionSupplier] =
    useState<SingleValue<SuppliersOption> | null>(null);
  const [optionsFamily, setOptionsFamily] = useState<TagOption[]>([]);
  const [optionsSubFamily, setOptionsSubFamily] = useState<TagOption[]>([]);
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
    suppliers: [
      {
        supplier_id: "",
        supplier_ref: "",
        pcb: "",
        custom_cat: "",
        made_in: "",
      },
    ],
    dimension_types: "Couleur/Taille",
    brand_ids: [],
    collection_ids: [],
    imgPath: "",
    status: "",
    additional_fields: "",
    uvc: [
      {
        code: "",
        dimensions: ["000", "000"],
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
    initialSizes: ["000"], // Example initial sizes
    initialColors: ["000"], // Example initial colors
    initialGrid: [[true]], // Example initial grid
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
    setBrandLabel(brandLabel)
  };

  console.log(brandLabel)

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

    if (newValue) {
      setFormData({
        ...formData,
        tag_ids: [newValue.value],
      });
    } else {
      setFormData({
        ...formData,
        tag_ids: [],
      });
    }
  };

  const handleChangeSubFamily = (newValue: SingleValue<TagOption> | null) => {
    setSelectedOptionSubFamily(newValue);

    if (newValue) {
      setFormData({
        ...formData,
        tag_ids: [newValue.value],
      });
    } else {
      setFormData({
        ...formData,
        tag_ids: [],
      });
    }
  };

  const handleDimensionsChange = (newDimensions: string[][]) => {
    const newUVCs = newDimensions.map((dimensions) => ({
      code: "",
      dimensions,
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
    }));

    setFormData((prevFormData) => ({
      ...prevFormData,
      uvc: newUVCs,
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
          `${process.env.REACT_APP_URL_DEV}/api/v1/family/search?YX_LIBELLE=""&page=${currentPage}&limit=${limit}&YX_TYPE=LA2`,
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
        `${process.env.REACT_APP_URL_DEV}/api/v1/family/search?YX_LIBELLE=${inputValueSubFamily}&page=${currentPage}&limit=${limit}&YX_TYPE=LA2`,
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

  const handleSupplierChange = (
    index: number,
    field: string,
    value: string
  ) => {
    setFormData((prevFormData) => {
      const newSuppliers = [...prevFormData.suppliers];
      newSuppliers[index] = { ...newSuppliers[index], [field]: value };
      return {
        ...prevFormData,
        suppliers: newSuppliers,
      };
    });
  };

  const handleSupplierSelectChange = (
    index: number,
    option: SingleValue<SuppliersOption>
  ) => {
    setFormData((prevFormData) => {
      const newSuppliers = [...prevFormData.suppliers];
      newSuppliers[index] = {
        ...newSuppliers[index],
        supplier_id: option ? option.value : "",
      };
      return {
        ...prevFormData,
        suppliers: newSuppliers,
      };
    });
  };

  const handleChangePrice = (
    uvcIndex: number,
    priceIndex: number,
    field: string,
    value: string
  ) => {
    const parsedValue = parseFloat(value);
    setFormData((prevFormData) => {
      const newUvc = [...prevFormData.uvc];
      const newPrices = [...newUvc[uvcIndex].prices];
      newPrices[priceIndex] = {
        ...newPrices[priceIndex],
        price: {
          ...newPrices[priceIndex].price,
          [field]: isNaN(parsedValue) ? 0 : parsedValue,
        },
      };
      newUvc[uvcIndex] = {
        ...newUvc[uvcIndex],
        prices: newPrices,
      };
      return {
        ...prevFormData,
        uvc: newUvc,
      };
    });
  };

  // const handleChangePriceUVC = (uvcIndex: number, priceIndex: number, field: string, value: number) => {
  //   setFormData(prevFormData => {
  //     const updatedUvc = [...prevFormData.uvc];
  //     updatedUvc[uvcIndex].prices[priceIndex].price[field] = value;

  //     return {
  //       ...prevFormData,
  //       uvc: updatedUvc
  //     };
  //   });
  // };

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
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        setTimeout(() => {
          notifySuccess("Fournisseur créé !");
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

  const addField = () => {
    setAdditionalFields([...additionalFields, { name: "", value: "" }]);
  };

  const removeField = (index: any) => {
    const updatedFields = additionalFields.filter((_, i) => i !== index);
    setAdditionalFields(updatedFields);
  };

  const addSupplier = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      suppliers: [
        ...prevFormData.suppliers,
        {
          supplier_id: "",
          supplier_ref: "",
          pcb: "",
          custom_cat: "",
          made_in: "",
        },
      ],
    }));
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

  console.log(formData);
  return (
    <section className="w-full bg-slate-50 p-7">
      <div className="max-w-[2024px] mx-auto">
        <form onSubmit={handleSubmit} className="mb-[400px]">
          <div className="flex justify-between">
            <div>
              <h3 className="text-[32px] font-[800] text-gray-800">
                Créer <span className="font-[200]">une référence</span>
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
                    Créer une référence
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mt-3">
                <CircularProgress />
              </div>
            )}
          </div>

          <div className="flex gap-7 mt-[80px]">
            <div className="relative w-[70%] flex flex-col gap-3">
              <h4 className="absolute top-[-15px] left-[20px] px-2 text-[17px] text-gray-600 bg-slate-50 font-[400]">
                Identification
              </h4>
              <div className="border border-gray-300 rounded-md p-3">
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
                        value={selectedOptionSubFamily}
                        onChange={handleChangeSubFamily}
                        onInputChange={handleInputChangeSubFamily}
                        inputValue={inputSubValueFamily}
                        options={optionsSubFamily}
                        placeholder="Selectionner une sous-sous-famille"
                        styles={customStyles}
                        className="mt-2 block text-sm py-1 w-full rounded-lg text-gray-500 border border-gray-200 focus:outline-none focus:ring-0 focus:border-gray-200 peer capitalize"
                        required
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2 mt-[30px]">
                <div className="w-1/3 flex flex-col">
                  {formData.suppliers.map((supplier, index) => (
                    <div
                      key={index}
                      className={`relative flex flex-col gap-2 ${
                        index > 0 && "mt-5"
                      }`}
                    >
                      <h4 className="absolute top-[-15px] left-[20px] px-2 text-[17px] text-gray-600 bg-slate-50 font-[400]">
                        Fournisseur {index === 0 ? "principal" : `${index + 1}`}
                      </h4>
                      <div className="border border-gray-300 rounded-md p-3">
                        <div>
                          <label className="text-sm font-medium text-gray-600">
                            Nom
                          </label>
                          <CreatableSelect<SuppliersOption>
                            value={optionsSupplier.find(
                              (option) => option.value === supplier.supplier_id
                            )}
                            onChange={(option) =>
                              handleSupplierSelectChange(index, option)
                            }
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
                            id={`supplier_ref-${index}`}
                            label="Référence produit :"
                            value={supplier.supplier_ref}
                            onChange={(e) =>
                              handleSupplierChange(
                                index,
                                "supplier_ref",
                                e.target.value
                              )
                            }
                            validators={[]}
                            placeholder="Ajouter la référence produit"
                            create
                            gray
                          />
                        </div>
                        <div>
                          <Input
                            element="input"
                            id={`pcb-${index}`}
                            label="PCB :"
                            value={supplier.pcb}
                            onChange={(e) =>
                              handleSupplierChange(index, "pcb", e.target.value)
                            }
                            validators={[]}
                            placeholder="Ajouter le PCB"
                            create
                            gray
                          />
                        </div>
                        <div>
                          <Input
                            element="input"
                            id={`custom_cat-${index}`}
                            label="Catégorie douanière :"
                            value={supplier.custom_cat}
                            onChange={(e) =>
                              handleSupplierChange(
                                index,
                                "custom_cat",
                                e.target.value
                              )
                            }
                            validators={[]}
                            placeholder="Ajouter la catégorie douanière"
                            create
                            gray
                          />
                        </div>
                        <div>
                          <CountrySelector
                            index={index}
                            value={supplier.made_in}
                            onChange={handleSupplierChange}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeSupplier(index)}
                          className="mt-2 text-red-600 flex items-center gap-2 text-[12px]"
                        >
                          <Trash2 size={13} />
                          Supprimer ce fournisseur
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addSupplier}
                    className="flex items-center gap-2 text-[12px] text-orange-400 mt-3"
                  >
                    <Plus size={17} />
                    Ajouter un fournisseur
                  </button>
                </div>
                <div className="relative w-1/3 flex flex-col gap-2">
                  <h4 className="absolute top-[-15px] left-[20px] px-2 text-[17px] text-gray-600 bg-slate-50 font-[400]">
                    Caractéristiques du produit
                  </h4>
                  <div className="border border-gray-300 rounded-md p-3">
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
                </div>
                <div className="relative w-1/3 flex flex-col gap-2">
                  <h4 className="absolute top-[-15px] left-[20px] px-2 text-[17px] text-gray-600 bg-slate-50 font-[400]">
                    Prix
                  </h4>
                  <div className="border border-gray-300 rounded-md p-3">
                    {formData.uvc.map((uvc, uvcIndex) => (
                      <div key={uvcIndex}>
                        {uvc.prices.map((price, priceIndex) => (
                          <div key={priceIndex}>
                            <Input
                              element="input"
                              id={`peau-${uvcIndex}-${priceIndex}`}
                              label="Prix achat :"
                              value={price.price.peau.toString()}
                              onChange={(e) =>
                                handleChangePrice(
                                  uvcIndex,
                                  priceIndex,
                                  "peau",
                                  e.target.value
                                )
                              }
                              validators={[]}
                              placeholder=""
                              create
                              gray
                            />
                            <Input
                              element="input"
                              id={`tbeu_pb-${uvcIndex}-${priceIndex}`}
                              label="Prix Vente :"
                              value={price.price.tbeu_pb.toString()}
                              onChange={(e) =>
                                handleChangePrice(
                                  uvcIndex,
                                  priceIndex,
                                  "tbeu_pb",
                                  e.target.value
                                )
                              }
                              validators={[]}
                              placeholder=""
                              create
                              gray
                            />
                            <Input
                              element="input"
                              id={`tbeu_pmeu-${uvcIndex}-${priceIndex}`}
                              label="Prix Modulé :"
                              value={price.price.tbeu_pmeu.toString()}
                              onChange={(e) =>
                                handleChangePrice(
                                  uvcIndex,
                                  priceIndex,
                                  "tbeu_pmeu",
                                  e.target.value
                                )
                              }
                              validators={[]}
                              placeholder=""
                              create
                              gray
                            />
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-4 mt-[30px]">
                <div className="relative w-full flex flex-col gap-3">
                  <h4 className="absolute top-[-15px] left-[20px] px-2 text-[17px] text-gray-600 bg-slate-50 font-[400]">
                    Informations additionelles
                  </h4>
                  {/* Partie tarifs */}
                  <div className="border border-gray-300 p-3">
                    <div className="py-[5px] w-[90%] mx-auto">
                      {additionalFields.map((field, index) => (
                        <div
                          key={index}
                          className="relative grid grid-cols-2 gap-2"
                        >
                          <Input
                            element="input"
                            id={`name-${index}`}
                            label="Nom du champ :"
                            value={field.name}
                            validators={[]}
                            placeholder=""
                            create
                            gray
                          />
                          <Input
                            element="input"
                            id={`value-${index}`}
                            label="Valeur du champ :"
                            value={field.value}
                            validators={[]}
                            placeholder=""
                            create
                            gray
                          />
                          <button
                            type="button"
                            onClick={() => removeField(index)}
                            className="absolute top-[50%] translate-y-[50%] right-[-25px] text-red-500 hover:text-red-300"
                          >
                            <Trash size={15} />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addField}
                        className="flex items-center gap-2 text-[12px] text-orange-400 mt-3"
                      >
                        <Plus size={17} />
                        Ajouter un champ
                      </button>
                    </div>
                  </div>
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
              <div className="mt-[50px] flex gap-2">
                <button
                  className="w-full border border-gray-300 text-red-600 bg-slate-200 hover:bg-red-600 hover:text-white font-bold shadow-md rounded-md"
                  type="button"
                >
                  Annuler
                </button>
                <button
                  className="w-full bg-sky-600 text-white py-2 rounded-md font-[600] hover:bg-sky-500 shadow-md"
                  type="submit"
                >
                  Créer la référence
                </button>
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
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
