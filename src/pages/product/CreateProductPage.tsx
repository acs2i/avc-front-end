import React, { useState, useEffect } from "react";
import Input from "../../components/FormElements/Input";
import { useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { useLocation, useNavigate } from "react-router-dom";
import Card from "../../components/Shared/Card";
import { ChevronLeft, Info, Maximize2, Minimize2, Plus } from "lucide-react";
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
import DynamicField from "../../components/FormElements/DynamicField";
import BrandSection from "../../components/Formulaires/BrandSection";
import CollectionSection from "../../components/Formulaires/CollectionSection";
import FamilySection from "../../components/Formulaires/FamilySection";
import SubFamilySection from "../../components/Formulaires/SubFamilySection";
import SubSubFamilySection from "../../components/Formulaires/SubSubFamilySection";
import { useBrands } from "../../utils/hooks/useBrands";
import { useCollections } from "../../utils/hooks/useCollection";
import { useFamily } from "../../utils/hooks/useFamily";
import { useSubFamily } from "../../utils/hooks/useSubFamily";
import { useSubSubFamily } from "../../utils/hooks/useSubSubFamily";
import {
  Uvc,
  Supplier,
  Draft,
  SupplierDetail,
  TagOption,
  BrandOption,
  CollectionOption,
  Price,
  PriceItemSchema,
  SuppliersOption,
  Tag,
} from "@/type";
import UVCMeasureTable from "../../components/UVCMeasureTable";

interface FormData {
  creator_id: any;
  reference: string;
  alias: string;
  short_label: string;
  long_label: string;
  type: string;
  tag_ids: any[];
  suppliers: Supplier[];
  dimension_types: string;
  brand_ids: any[];
  collection_ids: any[];
  tax: string;
  paeu: number;
  tbeu_pb: number;
  tbeu_pmeu: number;
  height: string;
  width: string;
  length: string;
  comment: string;
  size_unit: string;
  weigth_unit: string;
  gross_weight: string;
  net_weight: string;
  imgPath: string;
  status: string;
  additional_fields: any[];
  uvc: Uvc[];
  initialSizes: any[];
  initialColors: any[];
  initialGrid: any[];
}

interface CustomField {
  field_name: string;
  field_type: string;
  options?: string[];
  value?: string;
}

interface UserField {
  _id: string;
  code: string;
  label: string;
  apply_to: string;
  status: string;
  creator_id: any;
  additional_fields: CustomField[];
}

interface Unit {
  value: string;
  name: string;
  unit: string;
  apply_to: string;
}

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
  const [taxs, setTaxs] = useState([]);
  const [selectedTax, setSelectedTax] = useState("");
  const location = useLocation();
  const [supplierModalIsOpen, setsupplierModalIsOpen] = useState(false);
  const [userFields, setUserFields] = useState<UserField[]>([]);
  const [fieldValues, setFieldValues] = useState<{ [key: string]: any }>({});
  const [isModifyUvc, setIsModifyUvc] = useState(false);
  const [sizeUnits, setSizeUnits] = useState([]);
  const [weightUnits, setWeightUnits] = useState([]);
  const [page, setPage] = useState("dimension");
  const [onglet, setOnglet] = useState("infos");
  const [brandLabel, setBrandLabel] = useState("");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isDisabled = true;

  const [classificationValue, setClassificationValue] =
    useState("Au vieux campeur");
  const [currentPage, setCurrentPage] = useState(1);
  const [inputValueClassification, setInputValueClassification] = useState("");
  const [selectedSuppliers, setSelectedSuppliers] = useState<SuppliersOption[]>(
    []
  );
  const [inputValueSupplier, setInputValueSupplier] = useState("");
  const [newSupplier, setNewSupplier] = useState<Supplier>({
    supplier_id: "",
    supplier_ref: "",
    pcb: "",
    custom_cat: "",
    made_in: "",
    company_name: "",
  });
  const [optionsSupplier, setOptionsSupplier] = useState<SuppliersOption[]>([]);
  const classificationOptions = [
    {
      _id: "Au vieux",
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
    alias: "",
    short_label: "",
    long_label: "",
    type: "Marchandise",
    tag_ids: [],
    suppliers: [],
    dimension_types: "Couleur/Taille",
    brand_ids: [],
    collection_ids: [],
    tax: "",
    paeu: 0,
    tbeu_pb: 0,
    tbeu_pmeu: 0,
    height: "0",
    width: "0",
    length: "0",
    comment: "",
    size_unit: "",
    weigth_unit: "",
    gross_weight: "0",
    net_weight: "0",
    imgPath: "",
    status: "A",
    uvc: [
      {
        code: "",
        dimensions: [],
        prices: {
          supplier_id: "",
          price: {
            paeu: 0,
            tbeu_pb: 0,
            tbeu_pmeu: 0,
          },
        },
        collectionUvc: "",
        barcodePath: "",
        eans: [],
        ean: "",
        status: "",
      },
    ],
    additional_fields: [],
    initialSizes: ["000"],
    initialColors: ["000"],
    initialGrid: [[true]],
  });

  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [uvcGrid, setUvcGrid] = useState<boolean[][]>([]);
  // Fonction qui fetch les marques pour l'input creatable select (brand)
  const isCreate = false;
  const {
    inputValueBrand,
    optionsBrand,
    brands,
    handleInputChangeBrand,
    handleChangeBrand,
    addBrandField,
    removeBrandField,
  } = useBrands("", 10, isCreate);

  // Fonction qui fetch les collections pour l'input creatable select (collection)
  const {
    inputValueCollection,
    optionsCollection,
    selectedCollection,
    handleInputChangeCollection,
    handleChangeCollection,
  } = useCollections("", 10);
  // Fonction qui fetch les familles pour l'input creatable select (tag)
  const {
    inputValueFamily,
    optionsFamily,
    selectedFamily,
    handleInputChangeFamily,
    handleChangeFamily,
  } = useFamily("", 10);
  // Fonction qui fetch les sous-familles pour l'input creatable select (tag)
  const {
    inputValueSubFamily,
    optionsSubFamily,
    selectedSubFamily,
    handleInputChangeSubFamily,
    handleChangeSubFamily,
  } = useSubFamily("", 10);
  // Fonction qui fetch les sous-sous-familles pour l'input creatable select (tag)
  const {
    inputValueSubSubFamily,
    optionsSubSubFamily,
    selectedSubSubFamily,
    handleInputChangeSubSubFamily,
    handleChangeSubSubFamily,
  } = useSubSubFamily("", 10);

  const handleFieldChange = (
    label: string,
    field_type: string, // Ajout du type de champ
    id: string,
    newValue: string
  ) => {
    // Mettre à jour fieldValues pour le contrôle local
    setFieldValues((prevValues) => ({
      ...prevValues,
      [id]: newValue, // Met à jour l'état local du champ
    }));

    // Mettre à jour formData.additional_fields pour avoir un tableau d'objets
    setFormData((prevFormData) => {
      const updatedAdditionalFields = [...prevFormData.additional_fields];

      // Vérifier si un champ avec ce label existe déjà
      const fieldIndex = updatedAdditionalFields?.findIndex(
        (field) => field.label === label
      );

      if (fieldIndex !== -1) {
        // Mettre à jour la valeur et le type si le champ existe
        updatedAdditionalFields[fieldIndex].value = newValue;
        updatedAdditionalFields[fieldIndex].field_type = field_type;
      } else {
        // Ajouter un nouveau champ s'il n'existe pas encore
        updatedAdditionalFields.push({ label, value: newValue, field_type });
      }

      return {
        ...prevFormData,
        additional_fields: updatedAdditionalFields,
      };
    });
  };

  const handleUpdateCollection = (index: number, updatedCollection: any) => {
    setFormData((prevFormData) => {
      const updatedUVCs = [...prevFormData.uvc];
      updatedUVCs[index].collectionUvc = updatedCollection;
      return { ...prevFormData, uvc: updatedUVCs };
    });
  };

  const handleDimensionsChange = (
    newDimensions: { color: string; size: string }[]
  ) => {
    const newUVCs = newDimensions.map((dim, i) => {
      // Génération d'un code unique pour chaque UVC basé sur la référence du produit, couleur et taille
      const generatedCode = `${formData.reference}${dim.color}${dim.size}`;

      return {
        _id: "",
        code: generatedCode, // Utilisation du code généré
        dimensions: [`${dim.color}/${dim.size}`],
        prices: {
          supplier_id: "",
          price: {
            paeu: formData.paeu || 0,
            tbeu_pb: formData.tbeu_pb || 0,
            tbeu_pmeu: formData.tbeu_pmeu || 0,
          },
        },
        collectionUvc: formData.collection_ids[0]?.label || "",
        eans: [],
        ean: "",
        barcodePath: "",
        status: "",
      };
    });

    setFormData((prevFormData) => ({
      ...prevFormData,
      uvc: newUVCs,
    }));
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
          value: supplier.company_name,
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
        value: supplier.company_name,
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

  useEffect(() => {
    if (selectedCollection) {
      setFormData((prevFormData) => {
        const updatedUVCs = prevFormData.uvc.map((uvc) => ({
          ...uvc,
          collectionUvc: selectedCollection.label,
        }));
        return {
          ...prevFormData,
          uvc: updatedUVCs,
        };
      });
    }
  }, [selectedCollection]);

  const handleSupplierSelectChange = (
    index: number,
    option: SuppliersOption
  ) => {
    const selectedSupplier = optionsSupplier?.find(
      (supplier) => supplier.value === option?.value
    );

    if (selectedSupplier) {
      setSelectedSuppliers((prevSuppliers) => {
        const newSupplier: SuppliersOption = {
          _id: selectedSupplier.value, // Copie l'ID sélectionné
          value: selectedSupplier.value,
          label: selectedSupplier.label,
          company_name: selectedSupplier.label,
          supplier_id: selectedSupplier.value, // Ajoutez la propriété supplier_id
          supplier_ref: "", // Valeur par défaut
          pcb: "", // Valeur par défaut
          custom_cat: "", // Valeur par défaut
          made_in: "0", // Valeur par défaut
        };

        // Ajoute le nouveau fournisseur à la fin du tableau
        return [...prevSuppliers, newSupplier];
      });

      // Mettez à jour `newSupplier` pour le fournisseur actuellement sélectionné
      setNewSupplier({
        supplier_id: selectedSupplier.value, // Assurez-vous que supplier_id est défini
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

  const fetchField = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/user-field`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      setUserFields(data.data);
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    } finally {
      setIsLoading(false);
    }
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

  const fetchUnits = async () => {
    setIsLoading(true);
    try {
      let url = `${process.env.REACT_APP_URL_DEV}/api/v1/unit`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();

      const sizeUnits = result.data
        .filter((unit: Unit) => unit.apply_to === "size")
        .map((unit: Unit) => ({
          value: unit.unit,
          label: unit.name,
          name: unit.unit,
        }));

      const weightUnits = result.data
        .filter((unit: Unit) => unit.apply_to === "weight")
        .map((unit: Unit) => ({
          value: unit.unit,
          label: unit.name,
          name: unit.unit,
        }));

      setSizeUnits(sizeUnits);
      setWeightUnits(weightUnits);

      if (sizeUnits.length > 0) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          size_unit: sizeUnits[0].value,
        }));
      }

      if (weightUnits.length > 0) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          weigth_unit: weightUnits[0].value,
        }));
      }
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTax = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/tax`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      console.log(data);
      const formattedTaxs = data.data.map((tax: any) => ({
        value: tax.rate.toString(),
        name: tax.label,
      }));

      setTaxs(formattedTaxs);

      // Rechercher la TVA à 20% et la définir comme valeur par défaut
      const tva20 = formattedTaxs?.find((tax: any) => tax.value === "20");
      if (tva20) {
        setSelectedTax(tva20.value);
        setFormData((prevFormData) => ({
          ...prevFormData,
          tax: tva20.value,
        }));
      }
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFullScreen = () => {
    setIsFullScreen((prevState) => !prevState);
  };

  // Fonction qui récupère les données de tout les autres champs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
      short_label:
        e.target.id === "long_label"
          ? e.target.value.substring(0, 15)
          : formData.short_label,
    });

    // Si c'est le champ 'tax', on met à jour `selectedTax`
    if (e.target.id === "tax") {
      setSelectedTax(e.target.value);
    }
  };

  // Use Effect pour ajouter l'id des creatable select au formdata
  useEffect(() => {
    setFormData((prevFormData) => {
      const updatedTagIds = [...prevFormData.tag_ids];

      // Mise à jour de la famille à l'index 0
      if (selectedFamily) {
        updatedTagIds[0] = selectedFamily.value;
      }

      // Mise à jour de la sous-famille à l'index 1
      if (selectedSubFamily) {
        updatedTagIds[1] = selectedSubFamily.value;
      }

      // Mise à jour de la sous-sous-famille à l'index 2
      if (selectedSubSubFamily) {
        updatedTagIds[2] = selectedSubSubFamily.value;
      }

      // Filtrer les valeurs vides éventuelles dans tag_ids
      const filteredTagIds = updatedTagIds.filter(Boolean);

      return {
        ...prevFormData,
        brand_ids: brands.map((brand) => brand?._id || ""),
        collection_ids: selectedCollection
          ? [selectedCollection._id]
          : prevFormData.collection_ids,
        tag_ids: filteredTagIds,
      };
    });
  }, [
    brands,
    selectedCollection,
    selectedFamily,
    selectedSubFamily,
    selectedSubSubFamily,
  ]);

  // Use Effect qui réinitialise les champs dans la modal fournisseur
  useEffect(() => {
    if (supplierModalIsOpen) {
      setNewSupplier({
        supplier_id: "",
        supplier_ref: "",
        pcb: "",
        custom_cat: "",
        made_in: "",
        company_name: "",
      });
      setInputValueSupplier("");
    }
  }, [supplierModalIsOpen]);

  // Use Effect pour fetcher les "UserFields" au montage du composant
  useEffect(() => {
    fetchField();
    fetchUnits();
  }, []);

  useEffect(() => {
    fetchTax();
  }, []);

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
          index={0}
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
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <div
                    onClick={() => navigate("/product")}
                    className="cursor-pointer"
                  >
                    <ChevronLeft />
                  </div>
                  <h3 className="text-[32px] font-[800] text-gray-800">
                    Création <span className="font-[200]">d'un article</span>
                  </h3>
                </div>
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
                    <Button
                      size="small"
                      cancel
                      type="button"
                      onClick={() => navigate("/product")}
                    >
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
                      maxLength={70}
                    />
                    <Input
                      element="input"
                      id="alias"
                      label="Alias :"
                      value={formData.alias}
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
                      maxLength={70}
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
                      maxLength={35}
                    />
                    <div className="mt-4">
                      <label className="text-sm font-medium text-gray-600">
                        Marque
                      </label>
                      <BrandSection
                        brands={brands}
                        optionsBrand={optionsBrand}
                        handleChangeBrand={handleChangeBrand}
                        removeBrandField={removeBrandField}
                        addBrandField={addBrandField}
                        handleInputChangeBrand={handleInputChangeBrand}
                        inputValueBrand={inputValueBrand}
                        customStyles={customStyles}
                      />
                    </div>
                    <div className="mt-[30px] grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="col-span-1">
                        <label className="text-sm font-medium text-gray-600">
                          Classification principale
                        </label>
                        <CreatableSelect
                          value={classificationOptions?.find(
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
                          <FamilySection
                            family={selectedFamily}
                            optionsFamily={optionsFamily}
                            handleChangeFamily={handleChangeFamily}
                            handleInputChangeFamily={handleInputChangeFamily}
                            inputValueFamily={inputValueFamily}
                            customStyles={customStyles}
                          />
                        </div>
                      )}

                      {classificationValue && (
                        <div className="col-span-1">
                          <label className="text-sm font-medium text-gray-600">
                            Sous-famille
                          </label>
                          <SubFamilySection
                            subFamily={selectedSubFamily}
                            optionsSubFamily={optionsSubFamily}
                            handleChangeSubFamily={handleChangeSubFamily}
                            handleInputChangeSubFamily={
                              handleInputChangeSubFamily
                            }
                            inputValueSubFamily={inputValueSubFamily}
                            customStyles={customStyles}
                          />
                        </div>
                      )}
                      {classificationValue && (
                        <div className="col-span-1">
                          <label className="text-sm font-medium text-gray-600">
                            Sous-sous-famille
                          </label>
                          <SubSubFamilySection
                            subSubFamily={selectedSubSubFamily}
                            optionsSubSubFamily={optionsSubSubFamily}
                            handleChangeSubSubFamily={handleChangeSubSubFamily}
                            handleInputChangeSubSubFamily={
                              handleInputChangeSubSubFamily
                            }
                            inputValueSubSubFamily={inputValueSubSubFamily}
                            customStyles={customStyles}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </FormSection>
              </div>

              <div
                className={`w-[480px] h-[400px] flex flex-col gap-5 border-[5px] border-dashed border-slate-300 rounded-lg ${
                  isDisabled
                    ? "bg-gray-200 cursor-not-allowed opacity-50"
                    : "hover:bg-white hover:bg-opacity-75 transition ease-in-out delay-150 duration-300 cursor-pointer"
                }`}
              >
                <div className="w-full h-full flex justify-center items-center rounded-md">
                  <div className="flex flex-col items-center text-center gap-5">
                    <div className="w-[120px]">
                      <img
                        src="/img/img_upload.png"
                        alt="icone"
                        className={isDisabled ? "grayscale" : ""}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <p
                        className={`text-gray-600 text-[25px] ${
                          isDisabled ? "text-gray-400" : ""
                        }`}
                      >
                        Glissez déposez votre image ici
                      </p>
                      <span
                        className={`text-gray-600 text-[15px] ${
                          isDisabled ? "text-gray-400" : ""
                        }`}
                      >
                        ou
                      </span>
                      <button
                        disabled={isDisabled}
                        className={`border-[3px] border-blue-400 rounded-full ${
                          isDisabled
                            ? "bg-gray-300 text-gray-500 border-gray-400"
                            : "hover:bg-blue-500"
                        }`}
                      >
                        Téléchargez la depuis votre ordinateur
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
            <div className="flex gap-2 mt-[50px]">
              <div className="w-1/4 flex flex-col">
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
              <div className="w-1/4 flex flex-col gap-2">
                <FormSection title="Caractéristiques Produit" size="h-[350px]">
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
                      <CollectionSection
                        placeholder="Choississez une collection"
                        collection={selectedCollection}
                        optionsCollection={optionsCollection}
                        handleChangeCollection={handleChangeCollection}
                        handleInputChangeCollection={
                          handleInputChangeCollection
                        }
                        inputValueCollection={inputValueCollection}
                        customStyles={customStyles}
                      />
                    </div>
                  </div>
                </FormSection>
              </div>
              <div className="w-1/4 flex flex-col gap-2">
                <FormSection title="Prix" size="h-[350px]">
                  <div className="mt-3">
                    <Input
                      element="select"
                      id="tax"
                      label="Taxes :"
                      validators={[]}
                      placeholder=""
                      onChange={handleChange}
                      options={taxs}
                      value={selectedTax}
                      create
                      gray
                    />
                    <Input
                      element="input"
                      type="number"
                      id="paeu"
                      label="Prix achat :"
                      onChange={handlePriceChange}
                      validators={[]}
                      placeholder={formData.paeu.toString()}
                      create
                      gray
                      step="any"
                    />
                    <Input
                      element="input"
                      type="number"
                      id="tbeu_pb"
                      label="Prix Vente :"
                      onChange={handlePriceChange}
                      validators={[]}
                      placeholder={formData.tbeu_pb.toString()}
                      create
                      gray
                      step="any"
                    />
                    <Input
                      element="input"
                      id="tbeu_pmeu"
                      type="number"
                      label="Prix Modulé :"
                      onChange={handlePriceChange}
                      validators={[]}
                      placeholder={formData.tbeu_pmeu.toString()}
                      create
                      gray
                      step="any"
                    />
                  </div>
                </FormSection>
              </div>
              <div className="w-1/4 flex flex-col gap-2">
                <FormSection title="Cotes et poids" size="h-[350px]">
                  <div className="flex gap-3">
                    <div>
                      <Input
                        element="select"
                        id="size_unit"
                        label="Unité (taille)"
                        validators={[]}
                        placeholder="Sélectionnez une unité"
                        value={formData.size_unit}
                        onChange={handleChange}
                        create
                        gray
                        options={sizeUnits}
                      />
                      <Input
                        element="input"
                        id="height"
                        label="Hauteur :"
                        type="number"
                        onChange={handleChange}
                        validators={[]}
                        placeholder={formData.height}
                        create
                        gray
                        step="any"
                      />
                      <Input
                        element="input"
                        id="length"
                        label="Longueur :"
                        type="number"
                        onChange={handleChange}
                        validators={[]}
                        placeholder={formData.length}
                        create
                        gray
                        step="any"
                      />
                      <Input
                        element="input"
                        id="width"
                        label="Largeur :"
                        type="number"
                        onChange={handleChange}
                        validators={[]}
                        placeholder={formData.width}
                        create
                        gray
                        step="any"
                      />
                    </div>
                    <div>
                      <Input
                        element="select"
                        id="weigth_unit"
                        label="Unité (poids)"
                        onChange={handleChange}
                        value={formData.weigth_unit}
                        validators={[]}
                        placeholder="Sélectionnez une unité"
                        create
                        gray
                        options={weightUnits}
                      />
                      <Input
                        element="input"
                        id="gross_weight"
                        label="Poids Brut :"
                        type="number"
                        onChange={handleChange}
                        validators={[]}
                        placeholder={formData.gross_weight}
                        create
                        gray
                        step="any"
                      />
                      <Input
                        element="input"
                        id="net_weight"
                        label="Poids Net :"
                        type="number"
                        onChange={handleChange}
                        validators={[]}
                        placeholder={formData.net_weight}
                        create
                        gray
                        step="any"
                      />
                    </div>
                  </div>
                </FormSection>
              </div>
            </div>
            <div className="mt-3 w-full">
              {userFields && userFields.length > 0 && (
                <FormSection title="Champs utilisateurs">
                  <div className="mt-3">
                    {userFields
                      .filter((field) => field.apply_to === "Produit")
                      .map((field) => (
                        <div key={field._id} className="mb-6">
                          {/* Affichage du label au niveau supérieur */}
                          <h3 className="text-md font-semibold text-gray-800 mb-1">
                            {field.label}
                          </h3>
                          {field.additional_fields.map((customField, index) => (
                            <div key={`${field._id}-${index}`} className="mb-4">
                              <DynamicField
                                id={`${field._id}-${index}`}
                                name={customField.field_name}
                                fieldType={customField.field_type}
                                value={
                                  fieldValues[`${field._id}-${index}`] || ""
                                }
                                onChange={(e) =>
                                  handleFieldChange(
                                    field.label,
                                    customField.field_type,
                                    `${field._id}-${index}`,
                                    e.target.value
                                  )
                                }
                                options={customField.options}
                              />
                            </div>
                          ))}
                        </div>
                      ))}
                  </div>
                </FormSection>
              )}
            </div>
            <div className="mt-3">
              <FormSection title="Commentaire">
                <Input
                  element="textarea"
                  id="comment"
                  label=""
                  onChange={handleChange}
                  value={formData.comment}
                  validators={[]}
                  placeholder="Tapez votre commentaire sur le produit"
                  maxLength={3000}
                  create
                  gray
                />
              </FormSection>
            </div>
            <div className="mt-3">
              <Divider />
            </div>
            {/* Partie onglets */}
            <div className="mt-[30px] flex mb-[50px]">
              <div className="w-[30%] border-t-[1px] border-gray-300">
                {LINKS_Product.map((link, index) => (
                  <div
                    key={index}
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
                {
                  <div className="mt-3">
                    <Button
                      size="100"
                      blue
                      type="button"
                      onClick={() => setIsModifyUvc((prev) => !prev)}
                    >
                      {isModifyUvc ? "Générer les UVC" : "Modifier les UVC"}
                    </Button>
                  </div>
                }
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
                      {LINKS_UVC.map((link, index) => (
                        <li
                          key={index}
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

                  {onglet === "infos" && (
                    <UVCInfosTable
                      isModify={isModifyUvc}
                      reference={formData?.reference}
                      placeholder={(index) =>
                        formData.uvc[index]?.collectionUvc ||
                        formData.collection_ids[0]?.label ||
                        "Aucune collection n'a été ajouté"
                      }
                      uvcDimension={formData.uvc.map((uvc) => ({
                        code: uvc.code,
                        dimensions: uvc.dimensions,
                        collectionUvc: uvc.collectionUvc,
                      }))}
                      customStyles={customStyles}
                      handleUpdateCollection={handleUpdateCollection}
                    />
                  )}
                  {onglet === "price" && (
                    <UVCPriceTable
                      reference={formData?.reference}
                      uvcPrices={formData.uvc} // Passez directement formData.uvc sans le mapping
                      globalPrices={{
                        paeu: formData.paeu,
                        tbeu_pb: formData.tbeu_pb,
                        tbeu_pmeu: formData.tbeu_pmeu,
                      }}
                      isModify={isModifyUvc}
                      onPriceChange={(index, field, value) => {
                        setFormData((prevFormData) => {
                          const updatedUVCs = [...prevFormData.uvc];

                          // Vérifier si prices existe, sinon l'initialiser
                          if (!updatedUVCs[index].prices) {
                            updatedUVCs[index].prices = {
                              supplier_id: "",
                              price: {
                                paeu: 0,
                                tbeu_pb: 0,
                                tbeu_pmeu: 0,
                              },
                            };
                          }

                          // Mettre à jour uniquement le champ dans prices.price
                          updatedUVCs[index].prices.price = {
                            ...updatedUVCs[index].prices.price,
                            [field]: value,
                          };

                          return { ...prevFormData, uvc: updatedUVCs };
                        });
                      }}
                    />
                  )}
                  {onglet === "supplier" && (
                    <UVCSupplierTable
                      reference={formData?.reference}
                      uvcDimension={formData.uvc}
                      type="create"
                      data={{
                        suppliers: selectedSuppliers,
                      }}
                    />
                  )}
                  {onglet === "weight" && (
                    <UVCMeasureTable
                      reference={formData?.reference}
                      uvcMeasure={formData.uvc}
                      Measure={{
                        height: formData?.height || "0",
                        long: formData?.length || "0",
                        width: formData?.width || "0",
                        weight_brut: formData?.gross_weight || "0",
                        weight_net: formData?.net_weight || "0",
                      }}
                      size_unit={formData?.size_unit || "m"}
                      weight_unit={formData?.weigth_unit || "kg"}
                      isModify={isModifyUvc}
                      onUpdateMeasures={(index, field, value) => {
                        setFormData((prev) => {
                          const updatedUvc = [...prev.uvc];
                          updatedUvc[index] = {
                            ...updatedUvc[index],
                            [field]: value,
                          };
                          return { ...prev, uvc: updatedUvc };
                        });
                      }}
                    />
                  )}
                  {onglet === "ean" && (
                    <div className="bg-gray-200 p-4 rounded-md shadow-md font-semibold text-gray-700 flex items-center gap-2">
                      <Info />
                      <span>
                        Les EAN seront créés lors de la validation définitive
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
