import Button from "../../components/FormElements/Button";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Modal from "../../components/Shared/Modal";
import {
  ChevronLeft,
  CircleSlash2,
  Maximize2,
  Minimize2,
  Pen,
  Plus,
} from "lucide-react";
import { LINKS_Product, LINKS_UVC } from "../../utils/index";
import UVCInfosTable from "../../components/UVCInfosTable";
import UVCPriceTable from "../../components/UVCPricesTable";
import UVCSupplierTable from "../../components/UVCSupplierTable";
import UVCMeasureTable from "../../components/UVCMeasureTable";
import UVCEanTable from "../../components/UVCEanTable";
import SupplierComponent from "../../components/SupplierComponent";
import UVCGrid from "../../components/UVCGrid";
import FormSection from "../../components/Formulaires/FormSection";
import CreatableSelect from "react-select/creatable";
import { SingleValue } from "react-select";
import useNotify from "../../utils/hooks/useToast";
import { CircularProgress } from "@mui/material";
import {
  Uvc,
  Supplier,
  Draft,
  SupplierDetail,
  TagOption,
  BrandOption,
  CollectionOption,
  SuppliersOption,
  Tag,
} from "@/type";
import { useFetchDetails } from "../../utils/hooks/usefetchdetails";
import DynamicField from "../../components/FormElements/DynamicField";
import SupplierFormComponent from "../../components/SupplierFormComponent";
import Input from "../../components/FormElements/Input";
import Loader from "../../components/Shared/Loader";
import Backdrop from "@mui/material/Backdrop";
import UVCBlockTable from "../../components/UVCBlockTable";

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

export default function DraftUpdatePage() {
  const { id } = useParams();
  const token = useSelector((state: any) => state.auth.token);
  const creatorId = useSelector((state: any) => state.auth.user);
  const { notifySuccess, notifyError } = useNotify();
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const [refreshDetails, setRefreshDetails] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  const [error, setError] = useState("");
  const [page, setPage] = useState("dimension");
  const navigate = useNavigate();
  const [draft, setDraft] = useState<Draft>();
  const [isDetailsFetched, setIsDetailsFetched] = useState(false);
  const [isModify, setIsModify] = useState(false);
  const [isModifyUvc, setIsModifyUvc] = useState(false);
  const [product, setProduct] = useState<Draft>();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [desactivationInput, setDesactivationInput] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenConfirm, setIsModalOpenConfirm] = useState(false);
  const [onglet, setOnglet] = useState("infos");
  const [formData, setFormData] = useState<FormData>({
    creator_id: draft?.creator_id,
    reference: draft?.reference || "",
    alias: draft?.alias || "",
    short_label: draft?.short_label || "",
    long_label: draft?.long_label || "",
    type: "Marchandise",
    tag_ids: [],
    suppliers: draft?.suppliers || [],
    dimension_types: draft?.dimension_types?.[0] || "Couleur/Taille",
    brand_ids: [],
    collection_ids: [],
    paeu: draft?.paeu || 0,
    tbeu_pb: draft?.tbeu_pb || 0,
    tbeu_pmeu: draft?.tbeu_pmeu || 0,
    height: draft?.height || "",
    width: draft?.width || "",
    length: draft?.length || "",
    comment: draft?.comment || "",
    size_unit: draft?.size_unit || "",
    weigth_unit: draft?.weigth_unit || "",
    gross_weight: draft?.gross_weight || "",
    net_weight: draft?.net_weight || "",
    imgPath: "",
    status: "A",
    additional_fields: [],
    uvc: draft?.uvc || [],
    initialSizes: ["000"],
    initialColors: ["000"],
    initialGrid: [[true]],
  });
  const [selectedOptionBrand, setSelectedOptionBrand] =
    useState<SingleValue<BrandOption> | null>(null);
  const [optionsBrand, setOptionsBrand] = useState<BrandOption[]>([]);
  const [createError, setCreateError] = useState();
  const [fieldValues, setFieldValues] = useState<{ [key: string]: any }>({});
  const [isCreate, setIsCreate] = useState(false);
  const [userFields, setUserFields] = useState<UserField[]>([]);
  const [inputValueBrand, setInputValueBrand] = useState("");
  const [brandLabel, setBrandLabel] = useState("");
  const [selectedOptionFamily, setSelectedOptionFamily] =
    useState<SingleValue<TagOption> | null>(null);
  const [selectedOptionSubFamily, setSelectedOptionSubFamily] =
    useState<SingleValue<TagOption> | null>(null);
  const [selectedOptionSubSubFamily, setSelectedOptionSubSubFamily] =
    useState<SingleValue<TagOption> | null>(null);
  const [optionsFamily, setOptionsFamily] = useState<TagOption[]>([]);
  const [optionsSubFamily, setOptionsSubFamily] = useState<TagOption[]>([]);
  const [optionsSubSubFamily, setOptionsSubSubFamily] = useState<TagOption[]>(
    []
  );
  const [supplierModalIsOpen, setsupplierModalIsOpen] = useState(false);
  const [optionsSupplier, setOptionsSupplier] = useState<SuppliersOption[]>([]);
  const [selectedSuppliers, setSelectedSuppliers] = useState<SuppliersOption[]>(
    []
  );
  const [inputValueSupplier, setInputValueSupplier] = useState("");
  const [inputValueSubSubFamily, setInputValueSubSubFamily] = useState("");
  const [inputValueFamily, setInputValueFamily] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierDetail>();
  const [modalSupplierisOpen, setModalSupplierisOpen] = useState(false);
  const [inputSubValueFamily, setInputSubValueFamily] = useState("");
  const [selectedOptionCollection, setSelectedOptionCollection] =
    useState<SingleValue<CollectionOption> | null>(null);
  const [optionsCollection, setOptionsCollection] = useState<
    CollectionOption[]
  >([]);
  const [newSupplier, setNewSupplier] = useState<Supplier>({
    supplier_id: "",
    supplier_ref: "",
    pcb: "",
    custom_cat: "",
    made_in: "",
    company_name: "",
  });
  const [inputValueCollection, setInputValueCollection] = useState("");

  const [sizes, setSizes] = useState<string[]>(formData.initialSizes);
  const [colors, setColors] = useState<string[]>(formData.initialColors);
  const [uvcGrid, setUvcGrid] = useState<boolean[][]>(formData.initialGrid);

  useEffect(() => {
    fetchDraft();
  }, []);
  const {
    tagDetails,
    brandDetails,
    collectionDetails,
    supplierDetails,
    loading,
  } = useFetchDetails({ token, draft });
  const isValidObjectId = (id: string): boolean => {
    return /^[a-fA-F0-9]{24}$/.test(id);
  };

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
      const fieldIndex = updatedAdditionalFields.findIndex(
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

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: value === "" ? 0 : parseFloat(value),
    }));
  };

  const fetchDraft = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/draft/draft/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      setDraft(data);
      console.log(data);
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    }
  };

  const handleInputChange = (event: any) => {
    setDesactivationInput(event.target.value);
  };

  const toggleFullScreen = () => {
    setIsFullScreen((prevState) => !prevState);
  };

  const handleGridChange = (grid: string[][]) => {
    const updatedUVCs: Uvc[] = [];

    grid.forEach((row, colorIndex) => {
      row.forEach((dimension, sizeIndex) => {
        if (
          dimension &&
          typeof dimension === "string" &&
          dimension.includes(",")
        ) {
          const [color, size] = dimension.split(",");
          const uvcIndex = colorIndex * row.length + sizeIndex;
          const existingUvc = formData.uvc[uvcIndex];
          const collectionUvc =
            existingUvc?.collectionUvc || formData.collection_ids[0] || "";

          updatedUVCs.push({
            code: `${draft?.reference}_${color}_${size}`,
            dimensions: [`${color}/${size}`],
            prices: existingUvc?.prices || {
              supplier_id: "",
              price: {
                paeu: formData.paeu || 0,
                tbeu_pb: formData.tbeu_pb || 0,
                tbeu_pmeu: formData.tbeu_pmeu || 0,
              },
            },
            collectionUvc,
            barcodePath: "",
            eans: [],
            ean: "",
            status: "",
            height: existingUvc?.height || formData.height || "0",
            width: existingUvc?.width || formData.width || "0",
            length: existingUvc?.length || formData.length || "0",
            gross_weight:
              existingUvc?.gross_weight || formData.gross_weight || "0",
            net_weight: existingUvc?.net_weight || formData.net_weight || "0",
          });
        }
      });
    });

    setFormData((prevFormData) => ({
      ...prevFormData,
      uvc: updatedUVCs,
    }));
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

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      uvc: prevFormData.uvc.map((uvc) => ({
        ...uvc,
        collectionUvc: uvc.collectionUvc || "", // Ajoutez une valeur par défaut si absente
      })),
    }));
  }, []);

  useEffect(() => {
    if (draft && draft.uvc) {
      // Vérification de l'existence de draft.uvc
      setFormData({
        creator_id: draft.creator_id,
        reference: draft.reference || "",
        alias: draft.alias || "",
        short_label: draft.short_label || "",
        long_label: draft.long_label || "",
        type: draft.type || "Marchandise",
        tag_ids: draft.tag_ids || [],
        suppliers: draft.suppliers || [],
        dimension_types: draft.dimension_types?.[0] || "Couleur/Taille",
        brand_ids: draft.brand_ids || [],
        collection_ids: draft.collection_ids || [],
        paeu: draft.paeu || 0,
        tbeu_pb: draft.tbeu_pb || 0,
        tbeu_pmeu: draft.tbeu_pmeu || 0,
        height: draft.height || "",
        width: draft.width || "",
        length: draft.length || "",
        comment: draft.comment || "",
        size_unit: draft.size_unit || "",
        weigth_unit: draft.weigth_unit || "",
        gross_weight: draft.gross_weight || "",
        net_weight: draft.net_weight || "",
        imgPath: draft.imgPath || "",
        status: draft.status === "A" ? "A" : "I",
        additional_fields: draft.additional_fields || {},
        uvc: draft.uvc.map((uvc) => ({
          ...uvc,
          height: uvc.height || draft.height || "",
          width: uvc.width || draft.width || "",
          length: uvc.length || draft.length || "",
          gross_weight: uvc.gross_weight || draft.gross_weight || "",
          net_weight: uvc.net_weight || draft.net_weight || "",
          prices: {
            supplier_id: uvc.prices?.supplier_id || "",
            price: {
              paeu: uvc.prices?.price?.paeu || draft.paeu || 0,
              tbeu_pb: uvc.prices?.price?.tbeu_pb || draft.tbeu_pb || 0,
              tbeu_pmeu: uvc.prices?.price?.tbeu_pmeu || draft.tbeu_pmeu || 0,
            },
          },
        })),
        initialSizes: formData.initialSizes,
        initialColors: formData.initialColors,
        initialGrid: formData.initialGrid,
      });
    }
  }, [draft]);

  useEffect(() => {
    fetchField();
  }, []);

  useEffect(() => {
    if (draft && Array.isArray(draft.uvc) && draft.uvc.length > 0) {
      // Extraire les tailles et les couleurs
      const extractedColors = draft.uvc
        ? [
            ...new Set(
              draft.uvc
                .map((uvc) => uvc?.dimensions?.[0]?.split("/")[0])
                .filter(Boolean) // Filtrer les valeurs undefined ou null
            ),
          ]
        : [];

      const extractedSizes = draft.uvc
        ? [
            ...new Set(
              draft.uvc
                .map((uvc) => uvc?.dimensions?.[0]?.split("/")[1])
                .filter(Boolean) // Filtrer les valeurs undefined ou null
            ),
          ]
        : [];

      // Construire la grille initiale
      const initialGrid = extractedColors.map((color) =>
        extractedSizes.map(
          (size) =>
            draft?.uvc?.some((uvc) => {
              const dimension = uvc?.dimensions?.[0];
              if (dimension) {
                const [uvcColor, uvcSize] = dimension.split("/");
                return uvcColor === color && uvcSize === size;
              }
              return false;
            }) || false
        )
      );

      // Mettre à jour les états
      setSizes(extractedSizes);
      setColors(extractedColors);
      setUvcGrid(initialGrid);
    } else {
      // Si il n'y a pas d'uvc, on met les états à des valeurs par défaut
      setSizes([]);
      setColors([]);
      setUvcGrid([]);
    }
  }, [draft]);

  // Handle CreatableSelect for Brand
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
          value: brand.code,
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
        value: brand.code,
        label: brand.label,
      }));

      setOptionsBrand(optionsBrand);
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    }
  };

  const handleChangeFamily = (newValue: SingleValue<TagOption> | null) => {
    setSelectedOptionFamily(newValue);

    setFormData((prevFormData) => {
      let newTagIds = [...prevFormData.tag_ids];
      if (newValue) {
        newTagIds[0] = newValue.value;
      } else {
        newTagIds[0] = "";
      }
      return {
        ...prevFormData,
        tag_ids: newTagIds.filter(Boolean),
      };
    });
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
          value: tag.code,
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
        value: tag.code,
        label: tag.name,
      }));

      setOptionsFamily(optionsFamily);
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    }
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
          value: tag.code,
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
        value: tag.code,
        label: tag.name,
      }));

      setOptionsSubFamily(optionsSubFamily);
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    }
  };

  const handleChangeSubSubFamily = (
    newValue: SingleValue<TagOption> | null
  ) => {
    setSelectedOptionSubSubFamily(newValue);

    setFormData((prevFormData) => {
      let newTagIds = [...prevFormData.tag_ids];
      if (newValue) {
        newTagIds[2] = newValue.value;
      } else {
        newTagIds[2] = "";
      }
      return {
        ...prevFormData,
        tag_ids: newTagIds.filter(Boolean),
      };
    });
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
          value: tag.code,
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
        value: tag.code,
        label: tag.name,
      }));

      setOptionsSubSubFamily(optionsSubSubFamily);
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    }
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

  const handleUpdateCollection = (index: number, updatedCollection: any) => {
    console.log(
      "Updating collection for UVC at index:",
      index,
      updatedCollection
    );
    setFormData((prevFormData) => {
      const updatedUVCs = [...prevFormData.uvc];

      // Vérifiez si `updatedCollection` est un objet et extrayez `value`, sinon utilisez directement `updatedCollection`.
      updatedUVCs[index].collectionUvc =
        typeof updatedCollection === "object" && updatedCollection !== null
          ? updatedCollection.value // Utilisez `value` pour normaliser
          : updatedCollection;

      console.log("Updated UVCs:", updatedUVCs);

      return { ...prevFormData, uvc: updatedUVCs };
    });
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
            value: collection.label,
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
          value: collection.label,
          label: collection.label,
        })
      );

      setOptionsCollection(optionsCollection);
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    }
  };

  const updateDraftStatus = async (
    newStatus: number,
    shouldRedirect: boolean
  ) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/draft/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ step: newStatus }),
        }
      );

      if (response.ok) {
        setTimeout(() => {
          notifySuccess("Brouiilon validée");
          setIsLoading(false);
          if (shouldRedirect) {
            navigate("/draft");
            window.location.reload();
          }
        }, 100);
      } else {
        notifyError("Erreur lors de la mise à jour du statut !");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut", error);
      setError("Erreur lors de la mise à jour du statut du brouillon");
      setIsLoading(false);
    }
  };

  const handleTypeChange = (selectedType: string) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      type: selectedType,
    }));
  };

  const handleSupplierSelectChange = (
    index: number,
    option: SuppliersOption
  ) => {
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
          supplier_id: selectedSupplier.value,
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

  const handleUpdateDraft = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/draft/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Réponse du backend :", result);
        notifySuccess("Brouillon modifié avec succès !");
        window.location.reload();
        setTimeout(() => {
          setIsLoading(false);
          setIsModify(false);
          // fetchDraft();
        }, 300);
      } else {
        notifyError("Erreur lors de la modification !");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Erreur lors de la requête", error);
      setError("Erreur lors de la mise à jour du brouillon");
    }
  };

  const handleCreateProduct = async () => {
    setIsCreate(true);
    try {
      // Étape 1 : Création des UVC et récupération des IDs
      const uvcPromises = formData.uvc.map(async (uvc) => {
        const response = await fetch(
          `${process.env.REACT_APP_URL_DEV}/api/v1/uvc`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(uvc),
          }
        );

        if (!response.ok) {
          throw new Error("Erreur lors de la création des UVC !");
        }

        const createdUvc = await response.json();
        return createdUvc._id; // Récupère l'ID de chaque UVC créé
      });

      const uvcIds = await Promise.all(uvcPromises);

      // Étape 2 : Création du produit avec les IDs des UVC
      const productData = {
        ...formData,
        uvc_ids: uvcIds, // Inclure les identifiants des UVC
      };

      const productResponse = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/product`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(productData),
        }
      );

      if (productResponse.ok) {
        updateDraftStatus(3, false);
        notifySuccess("Produit créé avec succès !");
        navigate("/product");
      } else if (productResponse.status === 400) {
        // Afficher un message explicite si la référence existe déjà
        const errorData = await productResponse.json();
        const errorMessage =
          errorData.error || "La référence du produit existe déjà.";
        setCreateError(errorMessage);
      } else {
        // Gérer d'autres erreurs génériques
        const errorData = await productResponse.json();
        const errorMessage =
          errorData.error || "Erreur lors de la création du produit !";
        notifyError(errorMessage);
      }
    } catch (error) {
      console.error("Erreur lors de la création du produit :", error);
      notifyError("Erreur lors de la création du produit !");
    } finally {
      setIsCreate(false);
    }
  };

  console.log(product);
  return (
    <>
      <Modal
        show={supplierModalIsOpen}
        onCancel={() => setsupplierModalIsOpen(false)}
        onClose={() => setsupplierModalIsOpen(false)}
        header="Fournisseur"
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
      <Modal
        show={modalSupplierisOpen}
        onCancel={() => setModalSupplierisOpen(false)}
        onClose={() => setModalSupplierisOpen(false)}
        header="Fournisseur"
      >
        <SupplierComponent
          supplier={selectedSupplier}
          index={selectedSupplier?.index ?? 0}
        />
      </Modal>
      <Modal
        show={isModalOpenConfirm}
        onCancel={() => setIsModalOpenConfirm(false)}
        onClose={() => setIsModalOpenConfirm(false)}
        header={`Desactivation de  ${draft && draft.long_label}`}
      >
        <div className="border-b-[2px] py-5">
          <div className="w-[90%] mx-auto">
            {draft && (
              <p>
                Recopiez ce texte pour valider la desactivation :
                <span className="font-[800] text-[13px]">
                  {" "}
                  {draft.long_label}
                </span>
              </p>
            )}
            <div className="mt-3">
              <input
                type="text"
                value={desactivationInput}
                onChange={handleInputChange}
                className="border p-2 w-full rounded-md focus:outline-none focus:border-[2px] focus:border-blue-500 focus:shadow-[0_0px_0px_5px_rgba(44,130,201,0.2)]"
              />
            </div>
          </div>
        </div>
        <div className="mt-4 w-[90%] mx-auto">
          {draft && (
            <button
              type="button"
              disabled={desactivationInput !== draft.long_label}
              className={`p-2 w-full rounded-md ${
                desactivationInput !== draft.long_label
                  ? "bg-gray-300"
                  : "bg-red-500 text-white"
              }`}
            >
              Valider la desactivation
            </button>
          )}
        </div>
      </Modal>
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={isCreate}
      >
        <div className="flex flex-col items-center gap-4">
          <p className="text-[30px] animate-pulse">En cours de création</p>
          <CircularProgress color="inherit" size={100} />
        </div>
      </Backdrop>
      <section className="w-full bg-slate-50 p-8 max-w-[2000px] mx-auto min-h-screen">
        {createError && (
          <div className="w-full bg-red-500 p-4 text-white rounded-md font-semibold shadow-md">
            <p>{createError}</p>
          </div>
        )}
        <form onSubmit={handleUpdateDraft}>
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2">
              <div onClick={() => navigate(-1)} className="cursor-pointer">
                <ChevronLeft />
              </div>
              <h1 className="text-[32px] font-[800]">
                Details <span className="font-[300]">du brouillon</span>
              </h1>
            </div>
            <div className="flex items-center justify-between">
              {draft && (
                <h2 className="text-[25px] font-[200]">{draft.long_label}</h2>
              )}
              {!isModify ? (
                <div className="flex items-center gap-2">
                  {draft?.step === 1 ? (
                    <Button
                      size="small"
                      type="button"
                      green
                      onClick={() => {
                        updateDraftStatus(2, true); // Passe à l'étape 2 pour validation
                      }}
                    >
                      Valider le brouillon
                    </Button>
                  ) : draft?.step === 2 ? (
                    <Button
                      size="small"
                      type="button"
                      green
                      onClick={handleCreateProduct} // Action pour enregistrer la référence
                    >
                      Enregistrer la référence
                    </Button>
                  ) : null}
                  {draft?.step !== 3 && (
                    <>
                      <Button
                        size="small"
                        type="button"
                        cancel
                        onClick={(e) => {
                          e.preventDefault();
                          setIsModalOpenConfirm(true);
                        }}
                      >
                        {draft?.status === "A"
                          ? "Désactiver la référence"
                          : "Réactiver la référence"}
                      </Button>
                      <Button
                        blue
                        size="small"
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setIsModify(true);
                        }}
                        disabled={product?.status === "D"}
                      >
                        {isModify ? "Annuler modification" : "Modifier"}
                      </Button>
                    </>
                  )}
                </div>
              ) : !isLoading ? (
                <div className="flex items-center gap-2">
                  <Button
                    size="small"
                    cancel
                    type="button"
                    onClick={() => setIsModify(false)}
                  >
                    Annuler
                  </Button>
                  <Button size="small" blue type="submit">
                    Valider
                  </Button>
                </div>
              ) : (
                <div className="mt-3">
                  <CircularProgress />
                </div>
              )}
            </div>
          </div>

          {/* Partie Infos */}
          <div className="mt-7">
            {draft && (
              <>
                {/* Indentification */}
                <div className="flex flex-col-reverse lg:flex-row gap-7 mt-[50px] items-stretch">
                  <div className="w-[60%]">
                    <FormSection
                      title="Identification"
                      size={`${!isModify ? "h-[400px]" : "h-[470px]"}`}
                    >
                      <div className="mt-3">
                        <div className="relative flex-1">
                          <div className="grid grid-cols-4 gap-2 py-2">
                            <span className="col-span-1 font-[700] text-slate-500 text-[13px]">
                              Reférence :
                            </span>
                            {!isModify ? (
                              <span className="col-span-3 text-gray-600 whitespace-nowrap text-[14px]">
                                {draft.reference ? (
                                  draft.reference
                                ) : (
                                  <CircleSlash2 size={15} />
                                )}
                              </span>
                            ) : (
                              <input
                                type="text"
                                id="reference"
                                onChange={handleChange}
                                placeholder={draft?.reference}
                                value={formData.reference}
                                className="col-span-3 border rounded-md p-1 bg-white py-2 focus:outline-none focus:border-blue-500"
                              />
                            )}
                          </div>
                          <div className="grid grid-cols-4 gap-2 py-2">
                            <span className="col-span-1 font-[700] text-slate-500 text-[13px]">
                              Nom d'appel :
                            </span>
                            {!isModify ? (
                              <span className="col-span-3 text-gray-600 whitespace-nowrap text-[14px]">
                                {draft.alias ? (
                                  draft.alias
                                ) : (
                                  <CircleSlash2 size={15} />
                                )}
                              </span>
                            ) : (
                              <input
                                type="text"
                                id="alias"
                                onChange={handleChange}
                                placeholder={draft?.alias}
                                value={formData.alias}
                                className="col-span-3 border rounded-md p-1 bg-white py-2 focus:outline-none focus:border-blue-500"
                              />
                            )}
                          </div>
                          <div className="grid grid-cols-4 gap-2 py-2">
                            <span className="col-span-1 font-[700] text-slate-500 text-[13px]">
                              Désignation longue :
                            </span>
                            {!isModify ? (
                              <span className="col-span-3 text-gray-600 whitespace-nowrap text-[14px]">
                                {draft.long_label ? (
                                  draft.long_label
                                ) : (
                                  <CircleSlash2 size={15} />
                                )}
                              </span>
                            ) : (
                              <input
                                type="text"
                                id="long_label"
                                onChange={handleChange}
                                placeholder={draft?.long_label}
                                value={formData.long_label}
                                className="col-span-3 border rounded-md p-1 bg-white py-2 focus:outline-none focus:border-blue-500"
                              />
                            )}
                          </div>
                          <div className="grid grid-cols-4 gap-2 py-2">
                            <span className="col-span-1 font-[700] text-slate-500 text-[13px]">
                              Désignation courte :
                            </span>
                            {!isModify ? (
                              <span className="col-span-3 text-gray-600 whitespace-nowrap text-[14px]">
                                {draft.short_label ? (
                                  draft.short_label
                                ) : (
                                  <CircleSlash2 size={15} />
                                )}
                              </span>
                            ) : (
                              <input
                                type="text"
                                id="short_label"
                                onChange={handleChange}
                                placeholder={draft?.short_label}
                                value={formData.short_label}
                                className="col-span-3 border rounded-md p-1 bg-white py-2 focus:outline-none focus:border-blue-500"
                              />
                            )}
                          </div>
                          <div className="grid grid-cols-4 gap-2 py-2">
                            <span className="col-span-1 font-[700] text-slate-500 text-[13px]">
                              Marque :
                            </span>
                            {!isModify ? (
                              <span className="col-span-3 text-gray-600 text-[14px]">
                                {draft.brand_ids.length > 0 ? (
                                  draft.brand_ids.map(
                                    (brandId: string, index: number) => {
                                      if (isValidObjectId(brandId)) {
                                        return brandDetails &&
                                          brandDetails.length > 0 ? (
                                          brandDetails.map((brand, index) => (
                                            <p key={index}>{brand.label}</p>
                                          ))
                                        ) : (
                                          <CircleSlash2 size={15} />
                                        );
                                      } else {
                                        return <p key={index}>{brandId}</p>;
                                      }
                                    }
                                  )
                                ) : (
                                  <CircleSlash2 size={15} />
                                )}
                              </span>
                            ) : (
                              <CreatableSelect
                                className="col-span-3"
                                value={selectedOptionBrand}
                                onChange={handleChangeBrand}
                                onInputChange={handleInputChangeBrand}
                                options={optionsBrand}
                                inputValue={inputValueBrand}
                                isClearable
                                placeholder={
                                  draft?.brand_ids[0] ||
                                  "Selectionnez une marque"
                                }
                              />
                            )}
                          </div>

                          <div className="grid grid-cols-4 gap-2 py-2">
                            <span className="col-span-1 font-[700] text-slate-500 text-[13px]">
                              Famille :
                            </span>
                            {!isModify ? (
                              <span className="col-span-3 text-gray-600 whitespace-nowrap text-[14px]">
                                {draft.tag_ids && draft.tag_ids[0] ? (
                                  isValidObjectId(draft.tag_ids[0]) ? (
                                    tagDetails && tagDetails[0] ? (
                                      <p>{`${tagDetails[0].code} - ${tagDetails[0].name}`}</p>
                                    ) : (
                                      <CircleSlash2 size={15} />
                                    )
                                  ) : (
                                    <p>{draft.tag_ids[0]}</p>
                                  )
                                ) : (
                                  <CircleSlash2 size={15} />
                                )}
                              </span>
                            ) : (
                              <CreatableSelect
                                className="col-span-3"
                                value={selectedOptionFamily}
                                onChange={handleChangeFamily}
                                onInputChange={handleInputChangeFamily}
                                options={optionsFamily}
                                inputValue={inputValueFamily}
                                isClearable
                                placeholder={
                                  draft?.tag_ids[0] ||
                                  "Selectionnez une Famille"
                                }
                              />
                            )}
                          </div>

                          <div className="grid grid-cols-4 gap-2 py-2">
                            <span className="col-span-1 font-[700] text-slate-500 text-[13px]">
                              Sous-famille :
                            </span>
                            {!isModify ? (
                              <span className="col-span-3 text-gray-600 whitespace-nowrap text-[14px]">
                                {draft.tag_ids && draft.tag_ids[1] ? (
                                  isValidObjectId(draft.tag_ids[1]) ? (
                                    tagDetails && tagDetails[1] ? (
                                      <p>{`${tagDetails[1].code} - ${tagDetails[1].name}`}</p>
                                    ) : (
                                      <CircleSlash2 size={15} />
                                    )
                                  ) : (
                                    <p>{draft.tag_ids[1]}</p>
                                  )
                                ) : (
                                  <CircleSlash2 size={15} />
                                )}
                              </span>
                            ) : (
                              <CreatableSelect
                                className="col-span-3"
                                value={selectedOptionSubFamily}
                                onChange={handleChangeSubFamily}
                                onInputChange={handleInputChangeSubFamily}
                                options={optionsSubFamily}
                                inputValue={inputSubValueFamily}
                                isClearable
                                placeholder={
                                  draft?.tag_ids[1] ||
                                  "Selectionnez une Sous-fFamille"
                                }
                              />
                            )}
                          </div>

                          <div className="grid grid-cols-4 gap-2 py-2">
                            <span className="col-span-1 font-[700] text-slate-500 text-[13px]">
                              Sous-sous-famille :
                            </span>
                            {!isModify ? (
                              <span className="col-span-3 text-gray-600 whitespace-nowrap text-[14px]">
                                {draft.tag_ids && draft.tag_ids[2] ? (
                                  isValidObjectId(draft.tag_ids[2]) ? (
                                    tagDetails && tagDetails[2] ? (
                                      <p>{`${tagDetails[2].code} - ${tagDetails[2].name}`}</p>
                                    ) : (
                                      <CircleSlash2 size={15} />
                                    )
                                  ) : (
                                    <p>{draft.tag_ids[2]}</p>
                                  )
                                ) : (
                                  <CircleSlash2 size={15} />
                                )}
                              </span>
                            ) : (
                              <CreatableSelect
                                className="col-span-3"
                                value={selectedOptionSubSubFamily}
                                onChange={handleChangeSubSubFamily}
                                onInputChange={handleInputChangeSubSubFamily}
                                options={optionsSubSubFamily}
                                inputValue={inputValueSubSubFamily}
                                isClearable
                                placeholder={
                                  draft?.tag_ids[2] ||
                                  "Selectionnez une Sous-sous-Famille"
                                }
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </FormSection>
                  </div>
                  <div className="w-[480px] bg-white">
                    <FormSection
                      size={`${!isModify ? "h-[400px]" : "h-[470px]"}`}
                    >
                      {draft.imgPath ? (
                        <div className="relative w-full h-0 pb-[75%]">
                          <img
                            src={draft.imgPath}
                            alt="Product"
                            className="absolute top-0 left-0 w-full h-full object-contain"
                          />
                        </div>
                      ) : (
                        <div className="relative w-full h-0 pb-[75%]">
                          <img
                            src="/img/logo_2.png"
                            alt="logo"
                            className="absolute top-0 left-0 w-full h-full object-cover filter saturate-50 opacity-50"
                          />
                          <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-xl font-bold bg-black bg-opacity-50 p-2 rounded rotate-[-20deg]">
                            Pas d'image
                          </span>
                        </div>
                      )}
                    </FormSection>
                  </div>
                </div>

                <div className="flex gap-2 mt-[30px] items-stretch">
                  {/* Fournisseur */}
                  <div className="w-1/4">
                    <FormSection title="Fournisseur">
                      <div className="relative flex flex-col gap-3">
                        <div className="mt-3">
                          <div className="flex flex-col gap-2">
                            {[
                              ...(draft.suppliers || []),
                              ...selectedSuppliers,
                            ].map((supplierDetail, index) => {
                              const draftSupplier = draft?.suppliers.find(
                                (draftSup) =>
                                  draftSup.supplier_id ===
                                  supplierDetail.supplier_id
                              );

                              const combinedSupplier = {
                                ...supplierDetail,
                                ...draftSupplier,
                              };

                              return (
                                <div
                                  key={index}
                                  className={`text-center rounded-md cursor-pointer hover:brightness-125 shadow-md ${
                                    index === 0
                                      ? "bg-[#3B71CA]"
                                      : "bg-slate-400"
                                  }`}
                                  onClick={() => {
                                    setSelectedSupplier({
                                      ...combinedSupplier,
                                      index,
                                    } as SupplierDetail);
                                    setModalSupplierisOpen(true);
                                  }}
                                >
                                  <span className="text-[20px] text-white font-bold">
                                    {combinedSupplier.company_name ||
                                      combinedSupplier.supplier_id}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                          {isModify && (
                            <div
                              className="flex flex-col items-center justify-center p-[20px] text-orange-400 hover:text-orange-300 cursor-pointer"
                              onClick={() => setsupplierModalIsOpen(true)}
                            >
                              <div className="flex items-center gap-2 text-[12px] mt-3">
                                <Plus size={30} />
                              </div>
                              <p className="font-[700]">
                                Ajouter un fournisseur
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </FormSection>
                  </div>
                  {/* Caractéristiques produit */}
                  <div className="w-1/4">
                    <FormSection title="Caractéristiques Produit">
                      <div className="mt-3">
                        <div className="grid grid-cols-12 gap-2 py-2">
                          <span className="col-span-4 font-[700] text-slate-500 text-[12px]">
                            Type :
                          </span>
                          {!isModify ? (
                            <span className="col-span-6 text-gray-600 whitespace-nowrap overflow-ellipsis overflow-hidden text-[14px]">
                              {draft.type ? draft.type : "Marchandise"}
                            </span>
                          ) : (
                            <select
                              className="col-span-6 border rounded-md p-1 bg-white focus:outline-none focus:border-blue-500 py-2"
                              value={formData.type}
                              onChange={(e) => handleTypeChange(e.target.value)}
                            >
                              <option value="marchandise">Marchandise</option>
                              <option value="service">Service</option>
                              <option value="produit_financier">
                                Produit financier
                              </option>
                            </select>
                          )}
                        </div>
                        <div className="grid grid-cols-12 gap-2 py-2">
                          <span className="col-span-4 font-[700] text-slate-500 text-[12px]">
                            Dimensions :
                          </span>
                          <span className="col-span-6 text-gray-600 whitespace-nowrap overflow-ellipsis overflow-hidden text-[14px] capitalize">
                            {draft.dimension_types &&
                            draft.dimension_types.length > 0 ? (
                              draft.dimension_types.join(" / ")
                            ) : (
                              <CircleSlash2 size={15} />
                            )}
                          </span>
                        </div>
                        <div className="grid grid-cols-12 gap-2 py-2">
                          <span className="col-span-4 font-[700] text-slate-500 text-[12px]">
                            Collection :
                          </span>
                          {!isModify ? (
                            <span className="col-span-6 text-gray-600 text-[14px]">
                              {draft?.collection_ids[0]}
                            </span>
                          ) : (
                            <CreatableSelect
                              className="col-span-6"
                              value={selectedOptionCollection}
                              onChange={handleChangeCollection}
                              onInputChange={handleInputChangeCollection}
                              options={optionsCollection}
                              inputValue={inputValueCollection}
                              isClearable
                              placeholder={draft?.collection_ids[0]}
                            />
                          )}
                        </div>
                      </div>
                    </FormSection>
                  </div>
                  {/* Prix produit */}
                  <div className="w-1/4">
                    <FormSection title="Prix">
                      <div className="mt-3">
                        <div className="flex items-center gap-2 py-2">
                          <span className="font-[700] text-slate-500 text-[12px]">
                            Prix Achat (PAEU) :
                          </span>
                          {!isModify ? (
                            <span className="col-span-6 text-gray-600 whitespace-nowrap overflow-ellipsis overflow-hidden text-[14px]">
                              {draft.paeu} €
                            </span>
                          ) : (
                            <input
                              type="number"
                              id="paeu"
                              onChange={handlePriceChange}
                              placeholder={formData.paeu.toString()}
                              className="border rounded-md p-1 bg-white focus:outline-none focus:border-blue-500 w-full"
                            />
                          )}
                        </div>
                        <div className="flex items-center gap-2 py-2">
                          <span className="font-[700] text-slate-500 text-[12px]">
                            Prix Vente (TBEU/PB) :
                          </span>
                          {!isModify ? (
                            <span className="text-gray-600 whitespace-nowrap overflow-ellipsis overflow-hidden text-[14px]">
                              {draft.tbeu_pb} €
                            </span>
                          ) : (
                            <input
                              type="number"
                              id="tbeu_pb"
                              onChange={handlePriceChange}
                              placeholder={formData.tbeu_pb.toString()}
                              className="border rounded-md p-1 bg-white focus:outline-none focus:border-blue-500 w-full"
                            />
                          )}
                        </div>
                        <div className="flex items-center gap-2 py-2">
                          <span className="font-[700] text-slate-500 text-[12px]">
                            Prix Modulé (TBEU/PMEU) :
                          </span>
                          {!isModify ? (
                            <span className="col-span-6 text-gray-600 whitespace-nowrap overflow-ellipsis overflow-hidden text-[14px]">
                              {draft.tbeu_pmeu} €
                            </span>
                          ) : (
                            <input
                              type="number"
                              id="tbeu_pmeu"
                              onChange={handlePriceChange}
                              placeholder={formData.tbeu_pmeu.toString()}
                              className="border rounded-md p-1 bg-white focus:outline-none focus:border-blue-500 w-full"
                            />
                          )}
                        </div>
                      </div>
                    </FormSection>
                  </div>
                  {/* Cotes et poids */}
                  <div className="w-1/4">
                    <FormSection title="Cotes et poids">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <div className="flex items-center gap-2 py-2">
                            <span className="font-[700] text-slate-500 text-[12px]">
                              Hauteur
                            </span>
                            {!isModify ? (
                              <span className="text-gray-600 whitespace-nowrap overflow-ellipsis overflow-hidden text-[14px]">
                                {draft.height || "0"}
                                {draft.size_unit || "m"}
                              </span>
                            ) : (
                              <input
                                type="number"
                                id="height"
                                onChange={handleChange}
                                value={formData.height}
                                className="border rounded-md p-1 bg-white focus:outline-none focus:border-blue-500 w-full"
                              />
                            )}
                          </div>
                          <div className="flex items-center gap-2 gap-2 py-2">
                            <span className="font-[700] text-slate-500 text-[12px]">
                              Longueur
                            </span>
                            {!isModify ? (
                              <span className="text-gray-600 whitespace-nowrap overflow-ellipsis overflow-hidden text-[14px]">
                                {draft.length || "0"}
                                {draft.size_unit || "m"}
                              </span>
                            ) : (
                              <input
                                type="number"
                                id="length"
                                onChange={handleChange}
                                value={formData.length}
                                className="border rounded-md p-1 bg-white focus:outline-none focus:border-blue-500 w-full"
                              />
                            )}
                          </div>
                          <div className="flex items-center gap-2 py-2">
                            <span className="font-[700] text-slate-500 text-[12px]">
                              Largeur
                            </span>
                            {!isModify ? (
                              <span className="text-gray-600 overflow-ellipsis overflow-hidden text-[14px]">
                                {draft.width || "0"}
                                {draft.size_unit || "m"}
                              </span>
                            ) : (
                              <input
                                type="number"
                                id="width"
                                onChange={handleChange}
                                value={formData.width}
                                className="border rounded-md p-1 bg-white focus:outline-none focus:border-blue-500 w-full"
                              />
                            )}
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 gap-2 py-2">
                            <span className="font-[700] text-slate-500 text-[12px]">
                              Poids Brut
                            </span>
                            {!isModify ? (
                              <span className="col-span-6 text-gray-600 text-[14px]">
                                {draft.gross_weight || "0"}
                                {draft.weigth_unit || "kg"}
                              </span>
                            ) : (
                              <input
                                type="number"
                                id="gross_weight"
                                onChange={handleChange}
                                value={formData.gross_weight}
                                className="border rounded-md p-1 bg-white focus:outline-none focus:border-blue-500 w-full"
                              />
                            )}
                          </div>
                          <div className="flex items-center gap-2 gap-2 py-2">
                            <span className="font-[700] text-slate-500 text-[12px]">
                              Poids Net
                            </span>
                            {!isModify ? (
                              <span className="text-gray-600 text-[14px]">
                                {draft.net_weight || "0"}
                                {draft.weigth_unit || "kg"}
                              </span>
                            ) : (
                              <input
                                type="number"
                                id="net_weight"
                                onChange={handleChange}
                                value={formData.net_weight}
                                className="border rounded-md p-1 bg-white focus:outline-none focus:border-blue-500 w-full"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </FormSection>
                  </div>
                </div>
                <div className="mt-3 w-full">
                  {!isModify && (
                    <FormSection title="Champs utilisateurs">
                      <div>
                        {userFields
                          .filter((field) => field.apply_to === "Produit")
                          .map((field: any, index: number) => {
                            const draftField = draft.additional_fields.find(
                              (draftField: any) =>
                                draftField.label === field.label
                            );

                            return (
                              <div
                                key={index}
                                className="grid grid-cols-12 gap-2 py-2"
                              >
                                <span className="col-span-2 font-[700] text-slate-500 text-[13px]">
                                  {field.label} :
                                </span>

                                <span className="col-span-4 text-gray-600 whitespace-nowrap overflow-ellipsis overflow-hidden text-[14px]">
                                  {draftField?.value || "Non renseigné"}
                                </span>
                              </div>
                            );
                          })}
                      </div>
                    </FormSection>
                  )}
                  {isModify && (
                    <FormSection title="Champs utilisateurs">
                      <div>
                        {userFields && userFields.length > 0 && (
                          <div className="mt-3">
                            {userFields
                              .filter((field) => field.apply_to === "Produit")
                              .map((field) => (
                                <div key={field._id} className="mb-6">
                                  <h3 className="text-md font-semibold text-gray-800 mb-1">
                                    {field.label}
                                  </h3>
                                  {field.additional_fields.map(
                                    (customField, index) => (
                                      <div
                                        key={`${field._id}-${index}`}
                                        className="mb-4"
                                      >
                                        <DynamicField
                                          id={`${field._id}-${index}`}
                                          name={customField.field_name}
                                          fieldType={customField.field_type}
                                          value={
                                            fieldValues[
                                              `${field._id}-${index}`
                                            ] || ""
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
                                    )
                                  )}
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    </FormSection>
                  )}
                </div>
                <div className="mt-5">
                  <FormSection title="Commentaire">
                    <div>
                      {!isModify ? (
                        <p className="">{draft.comment}</p>
                      ) : (
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
                      )}
                    </div>
                  </FormSection>
                </div>
              </>
            )}
          </div>

          {/* Partie onglets */}
          <div className="mt-[30px] flex">
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
                        style={{ clipPath: "polygon(0 0, 100% 50%, 0 100%)" }}
                      ></div>
                      <div
                        className="absolute right-[-1px] top-1/2 transform -translate-y-1/2 rotate-180 w-4 h-4 bg-gray-100"
                        style={{ clipPath: "polygon(0 0, 100% 50%, 0 100%)" }}
                      ></div>
                    </>
                  )}
                </div>
              ))}
              <div className="mt-3">
                {isModify && (
                  <Button
                    size="100"
                    blue
                    onClick={() => setIsModifyUvc((prev) => !prev)}
                    type="button"
                  >
                    {isModifyUvc ? "Générer les UVC" : "Modifier les UVC"}
                  </Button>
                )}
              </div>
            </div>
            {page === "dimension" && (
              <div
                className={`border-t-[1px] border-gray-300 px-5 py-2 overflow-y-auto ${
                  isFullScreen
                    ? "fixed right-0 top-0 w-full h-screen z-[9999] bg-gray-100"
                    : "w-[70%]"
                }`}
              >
                <UVCGrid
                  onDimensionsChange={handleGridChange}
                  initialSizes={sizes}
                  initialColors={colors}
                  initialGrid={uvcGrid}
                  setSizes={setSizes}
                  setColors={setColors}
                  setUvcGrid={setUvcGrid}
                  sizes={sizes}
                  colors={colors}
                  uvcGrid={uvcGrid}
                  isFullScreen={toggleFullScreen}
                  isModify={isModifyUvc}
                  isEditable
                />
              </div>
            )}
            {page === "uvc" && (
              <div
                className={`border-t-[1px] border-gray-300 px-5 py-2 ${
                  isFullScreen
                    ? "fixed right-0 top-0 w-full z-[9999] bg-gray-100"
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
                {onglet === "infos" && draft && (
                  <UVCInfosTable
                    isModify={isModifyUvc}
                    reference={draft?.reference}
                    placeholder={(index) =>
                      formData.uvc[index]?.collectionUvc ||
                      formData.collection_ids[0]?.label ||
                      ""
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
                {onglet === "price" && draft && (
                  <UVCPriceTable
                    reference={draft?.reference}
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
                {onglet === "supplier" && draft && (
                  <UVCSupplierTable
                    reference={draft?.reference}
                    uvcDimension={formData.uvc}
                    supplierLabel={draft?.suppliers[0].supplier_id}
                  />
                )}
                {onglet === "weight" && draft && (
                  <UVCMeasureTable
                    reference={draft?.reference}
                    uvcMeasure={formData.uvc}
                    Measure={{
                      height: draft?.height || "0",
                      long: draft?.length || "0",
                      width: draft?.width || "0",
                      weight_brut: draft?.gross_weight || "0",
                      weight_net: draft?.net_weight || "0",
                    }}
                    size_unit={draft?.size_unit || "m"}
                    weight_unit={draft?.weigth_unit || "kg"}
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
                {onglet === "ean" && draft && (
                  <UVCEanTable
                    reference={draft?.reference}
                    uvcDimension={formData.uvc}
                  />
                )}
                {onglet === "bloc" && draft && (
                  <UVCBlockTable
                    isModify={isModifyUvc}
                    reference={draft?.reference}
                    placeholder={(index) =>
                      formData.uvc[index]?.collectionUvc ||
                      formData.collection_ids[0]?.label ||
                      ""
                    }
                    block="Non"
                    uvcDimension={formData.uvc.map((uvc) => ({
                      code: uvc.code,
                      dimensions: uvc.dimensions,
                      collectionUvc: uvc.collectionUvc,
                    }))}
                    customStyles={customStyles}
                    handleUpdateCollection={handleUpdateCollection}
                  />
                )}
              </div>
            )}
          </div>
        </form>
      </section>
    </>
  );
}
