import { LINKS_Product, LINKS_UVC } from "../../utils/index";
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import useFetch from "../../utils/hooks/usefetch";
import {
  ChevronLeft,
  CircleSlash2,
  Copy,
  IterationCcw,
  Maximize2,
  Minimize2,
  Pen,
  Plus,
  TriangleAlert,
} from "lucide-react";
import Modal from "../../components/Shared/Modal";
import { useNavigate } from "react-router-dom";
import CreatableSelect from "react-select/creatable";
import Button from "../../components/FormElements/Button";
import UVCGrid from "../../components/UVCGrid";
import UVCPriceTable from "../../components/UVCPricesTable";
import SupplierComponent from "../../components/SupplierComponent";
import UVCInfosTable from "../../components/UVCInfosTable";
import UVCSupplierTable from "../../components/UVCSupplierTable";
import UVCMeasureTable from "../../components/UVCMeasureTable";
import UVCEanTable from "../../components/UVCEanTable";
import { SingleValue } from "react-select";
import FormSection from "../../components/Formulaires/FormSection";
import {
  Uvc,
  Supplier,
  Product,
  BrandOption,
  TagOption,
  Tag,
  CollectionOption,
  SupplierDetail,
  SuppliersOption,
  Price,
  DatalakeUvc,
} from "@/type";
import { useSelector } from "react-redux";
import SupplierFormComponent from "../../components/SupplierFormComponent";
import useNotify from "../../utils/hooks/useToast";
import { CircularProgress } from "@mui/material";
import DynamicField from "../../components/FormElements/DynamicField";
import Input from "../../components/FormElements/Input";
import UVCBlockTable from "../../components/UVCBlockTable";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import truncateText from "../../utils/func/Formattext";
import BlockSection from "../../components/Formulaires/BlockSection";
import { useBlocks } from "../../utils/hooks/useBlock";

interface formDataUVC {
  uvc: DatalakeUvc[];
}

interface CustomField {
  field_name: string;
  field_type: string;
  options?: string[];
  default_value?: string;
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

interface SupplierData {
  supplier_id:
    | {
        _id?: string;
        company_name: string;
      }
    | string;
  company_name?: string;
  supplier_ref: string;
  pcb: string;
  custom_cat: string;
  made_in: string;
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
  blocked: string;
  blocked_reason_code: string;
  size_unit: string;
  weigth_unit: string;
  gross_weight: string;
  net_weight: string;
  imgPath: string;
  status: string;
  uvc_ids: Uvc[];
  additional_fields: any[];
  initialSizes: any[];
  initialColors: any[];
  initialGrid: any[];
}

type BlockOption = {
  _id: string;
  value: string;
  code: number;
  label: string;
};

interface SupplierListProps {
  suppliers: SuppliersOption[];
  onSupplierClick: (supplier: SuppliersOption, index: number) => void;
  onDragEnd: (result: DropResult) => void;
  isModify: boolean;
  setModalSupplierisOpen: (open: boolean) => void;
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

const SupplierList: React.FC<SupplierListProps> = ({
  suppliers,
  onSupplierClick,
  onDragEnd,
  isModify,
  setModalSupplierisOpen,
}) => {
  return (
    <div className="relative flex flex-col gap-3">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="suppliers">
          {(provided) => (
            <div
              className="mt-3 flex flex-col gap-2"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {suppliers && suppliers.length > 0 ? (
                suppliers.map((supplier, index) => (
                  <Draggable
                    key={supplier.value}
                    draggableId={supplier.value}
                    index={index}
                    isDragDisabled={!isModify}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        onClick={() => onSupplierClick(supplier, index)}
                        className={`text-center rounded-md cursor-pointer hover:brightness-110 shadow-md p-3 ${
                          index === 0
                            ? "bg-gradient-to-r from-cyan-600 to-cyan-800 text-white"
                            : "bg-slate-300 text-gray-500"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[20px] text-white font-bold capitalize">
                            {supplier.label}
                          </span>
                          {index === 0 && (
                            <span className="text-xs text-white bg-cyan-800 px-2 py-1 rounded border border-white">
                              Fournisseur Principal
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))
              ) : (
                <p>Aucun fournisseur pour cette référence</p>
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      {isModify && (
        <div
          className="flex flex-col items-center justify-center p-[20px] text-orange-400 hover:text-orange-300 cursor-pointer"
          onClick={() => setModalSupplierisOpen(true)}
        >
          <div className="flex items-center gap-2 text-[12px] mt-3">
            <Plus size={30} />
          </div>
          <p className="font-[700]">Ajouter un fournisseur</p>
        </div>
      )}
    </div>
  );
};

export default function SingleProductPage() {
  const { id } = useParams();
  const token = useSelector((state: any) => state.auth.token);
  const creatorId = useSelector((state: any) => state.auth.user);
  const [hasFormatError, setHasFormatError] = useState(false);
  const [editableColumnIndex, setEditableColumnIndex] = useState<number | null>(
    null
  );
  const [fieldValues, setFieldValues] = useState<{ [key: string]: any }>({});
  const [hasEanConflict, setHasEanConflict] = useState(false);
  const { notifySuccess, notifyError } = useNotify();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [modalSupplierisOpen, setModalSupplierisOpen] = useState(false);
  const [product, setProduct] = useState<Product>();
  const [brandLabel, setBrandLabel] = useState("");
  const [inputValueBrand, setInputValueBrand] = useState("");
  const [optionsBrand, setOptionsBrand] = useState<BrandOption[]>([]);
  const [differences, setDifferences] = useState<
    { field: string; productValue: any; uvcValue: any }[]
  >([]);
  const [isDifferenceModalOpen, setIsDifferenceModalOpen] = useState(false);
  const [selectedOptionBrand, setSelectedOptionBrand] =
    useState<SingleValue<BrandOption> | null>(null);
  const [inputValueFamily, setInputValueFamily] = useState("");
  const [optionsFamily, setOptionsFamily] = useState<TagOption[]>([]);
  const [selectedOptionFamily, setSelectedOptionFamily] =
    useState<SingleValue<TagOption> | null>(null);
  const [inputSubValueFamily, setInputSubValueFamily] = useState("");
  const [optionsSubFamily, setOptionsSubFamily] = useState<TagOption[]>([]);
  const [selectedOptionSubFamily, setSelectedOptionSubFamily] =
    useState<SingleValue<TagOption> | null>(null);
  const [inputValueSubSubFamily, setInputValueSubSubFamily] = useState("");
  const [optionsSubSubFamily, setOptionsSubSubFamily] = useState<TagOption[]>(
    []
  );
  const [selectedOptionSubSubFamily, setSelectedOptionSubSubFamily] =
    useState<SingleValue<TagOption> | null>(null);
  const [inputValueCollection, setInputValueCollection] = useState("");
  const [optionsCollection, setOptionsCollection] = useState<
    CollectionOption[]
  >([]);
  const [selectedOptionCollection, setSelectedOptionCollection] =
    useState<SingleValue<CollectionOption> | null>(null);
  const [optionsSupplier, setOptionsSupplier] = useState<SuppliersOption[]>([]);
  const [inputValueSupplier, setInputValueSupplier] = useState("");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  const [desactivationInput, setDesactivationInput] = useState("");
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenConfirm, setIsModalOpenConfirm] = useState(false);
  const [selectedSuppliers, setSelectedSuppliers] = useState<SuppliersOption[]>(
    []
  );
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null
  );
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [selectedSupplierIndex, setSelectedSupplierIndex] = useState<
    number | null
  >(null);
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const [userFields, setUserFields] = useState<UserField[]>([]);
  const [isModify, setIsModify] = useState(false);
  const [isModifyUvc, setIsModifyUvc] = useState(false);
  const [page, setPage] = useState("dimension");
  const [onglet, setOnglet] = useState("infos");
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
    paeu: product?.paeu || 0,
    tbeu_pb: product?.tbeu_pb || 0,
    tbeu_pmeu: product?.tbeu_pmeu || 0,
    height: product?.height || "",
    width: product?.width || "",
    length: product?.length || "",
    comment: product?.comment || "",
    size_unit: product?.size_unit || "",
    weigth_unit: product?.weigth_unit || "",
    gross_weight: product?.gross_weight || "",
    net_weight: product?.net_weight || "",
    blocked: product?.blocked || "Non",
    blocked_reason_code: product?.blocked_reason_code || "",
    imgPath: "",
    status: "A",
    uvc_ids: product?.uvc_ids || [
      {
        _id: "",
        code: "",
        dimensions: [],
        eans: ["-"], // Ajoutez une valeur par défaut vide
        ean: "",
        prices: {
          supplier_id: "",
          price: { paeu: 0, tbeu_pb: 0, tbeu_pmeu: 0 },
        },
      },
    ],
    initialSizes: ["000"],
    initialColors: ["000"],
    initialGrid: [[true]],
    additional_fields: [],
  });
  const [formDataUvc, setFormDataUvc] = useState<formDataUVC>({
    uvc: [
      {
        product_id: "",
        code: "",
        dimensions: [],
        prices: {
          supplier_id: "",
          price: {
            paeu: product?.paeu || 0,
            tbeu_pb: product?.tbeu_pb || 0,
            tbeu_pmeu: product?.tbeu_pmeu || 0,
          },
        },
        collectionUvc: product?.collection_ids[0]?.label || "",
        eans: [],
        ean: "",
        status: "",
        blocked: "",
        blocked_reason_code: "",
        barcodePath: "",
        height: product?.height || "",
        width: product?.width || "",
        length: product?.length || "",
        net_weight: product?.net_weight || "",
        gross_weight: product?.gross_weight || "",
      },
    ],
  });
  const {
    inputValueBlock,
    optionsBlock,
    blocks,
    handleInputChangeBlock,
    handleChangeBlock,
    addBlockField,
    removeBrandField,
  } = useBlocks("", 10);

  // Ajoutez ces fonctions juste après vos interfaces et avant votre composant
  const isDifferent = (oldValue: any, newValue: any): boolean => {
    // Si les deux valeurs sont des tableaux
    if (Array.isArray(oldValue) && Array.isArray(newValue)) {
      if (oldValue.length !== newValue.length) return true;

      // Pour les tableaux d'objets (comme suppliers, uvc_ids)
      if (typeof oldValue[0] === "object") {
        return (
          JSON.stringify(
            oldValue.sort((a, b) =>
              JSON.stringify(a).localeCompare(JSON.stringify(b))
            )
          ) !==
          JSON.stringify(
            newValue.sort((a, b) =>
              JSON.stringify(a).localeCompare(JSON.stringify(b))
            )
          )
        );
      }

      // Pour les tableaux simples
      return (
        JSON.stringify(oldValue.sort()) !== JSON.stringify(newValue.sort())
      );
    }

    // Si les deux valeurs sont des objets
    if (
      typeof oldValue === "object" &&
      oldValue !== null &&
      typeof newValue === "object" &&
      newValue !== null
    ) {
      const oldKeys = Object.keys(oldValue);
      const newKeys = Object.keys(newValue);

      if (oldKeys.length !== newKeys.length) return true;

      return oldKeys.some((key) => isDifferent(oldValue[key], newValue[key]));
    }

    // Pour les valeurs simples
    return oldValue !== newValue;
  };

  const createUpdateEntry = (
    oldProduct: any,
    newProduct: any,
    userName: string
  ) => {
    const changes: any = {};

    // Fonction pour normaliser les IDs ObjectId en strings
    const normalizeId = (id: any) => {
      if (typeof id === "object" && id !== null) {
        return id.toString(); // Convertit ObjectId en string
      }
      return id;
    };

    // Fonction pour extraire les données essentielles
    const extractEssentialData = (item: any, type: string) => {
      if (!item) return null;

      switch (type) {
        case "tag":
          return {
            _id: normalizeId(item._id || item),
            code: item.code || "",
            name: item.name || "",
            level: item.level || "",
          };

        case "brand":
          return {
            _id: normalizeId(item._id || item),
            label: item.label || "",
          };

        case "collection":
          return {
            _id: normalizeId(item._id || item),
            label: item.label || "",
          };

        case "supplier":
          if (typeof item === "object") {
            return {
              supplier_id: normalizeId(item.supplier_id),
              supplier_ref: item.supplier_ref || "",
              pcb: item.pcb || "",
              custom_cat: item.custom_cat || "",
              made_in: item.made_in || "",
            };
          }
          return item;

        default:
          return item;
      }
    };

    // Fonction pour formater la valeur selon le type de champ
    const formatValue = (value: any, field: string) => {
      if (!value) return value;

      switch (field) {
        case "tag_ids":
          return Array.isArray(value)
            ? value.map((tag) => extractEssentialData(tag, "tag"))
            : value;

        case "brand_ids":
          return Array.isArray(value)
            ? value.map((brand) => extractEssentialData(brand, "brand"))
            : value;

        case "collection_ids":
          return Array.isArray(value)
            ? value.map((collection) =>
                extractEssentialData(collection, "collection")
              )
            : value;

        case "suppliers":
          return Array.isArray(value)
            ? value.map((supplier) =>
                extractEssentialData(supplier, "supplier")
              )
            : value;

        case "uvc_ids":
          return Array.isArray(value)
            ? value.map((uvc) => ({
                _id: normalizeId(uvc._id || uvc),
                code: uvc.code || "",
                dimensions: uvc.dimensions || [],
              }))
            : value;

        // Pour les champs simples
        case "short_label":
        case "long_label":
        case "alias":
        case "reference":
        case "type":
        case "comment":
          return value ? value.toString() : "";

        // Pour les champs numériques
        case "paeu":
        case "tbeu_pb":
        case "tbeu_pmeu":
          return typeof value === "number" ? value : parseFloat(value) || 0;

        default:
          return value;
      }
    };

    // Liste des champs à suivre
    const fieldsToTrack = [
      "reference",
      "alias",
      "short_label",
      "long_label",
      "type",
      "tag_ids",
      "suppliers",
      "dimension_types",
      "brand_ids",
      "collection_ids",
      "paeu",
      "tbeu_pb",
      "tbeu_pmeu",
      "height",
      "width",
      "length",
      "comment",
      "size_unit",
      "weigth_unit",
      "gross_weight",
      "net_weight",
      "blocked",
    ];

    // Comparer chaque champ
    fieldsToTrack.forEach((field) => {
      const oldValue = formatValue(oldProduct[field], field);
      const newValue = formatValue(newProduct[field], field);

      // Ne comparer que si les valeurs sont différentes
      if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
        changes[field] = {
          oldValue,
          newValue,
        };
      }
    });

    // Retourner l'entrée de mise à jour
    return {
      updated_at: new Date(),
      updated_by: userName,
      changes: Object.keys(changes).length > 0 ? changes : undefined,
      file_name: `PRODUCT_UPDATE_${new Date()
        .toISOString()
        .split("T")[0]
        .replace(
          /-/g,
          ""
        )}_${new Date().getHours()}${new Date().getMinutes()}${new Date().getSeconds()}.csv`,
    };
  };

  const transformedSuppliers =
    product?.suppliers?.map((supplier) => ({
      supplier_id: supplier.supplier_id?.company_name || "ID inconnu",
      supplier_ref: supplier.supplier_ref || "Référence inconnue",
      pcb: supplier.pcb || "PCB inconnu",
      custom_cat: supplier.custom_cat || "Catégorie inconnue",
      made_in: supplier.made_in || "Pays d'origine inconnu",
    })) || [];

  const [newSupplier, setNewSupplier] = useState<Supplier>({
    supplier_id: "",
    supplier_ref: "",
    pcb: "",
    custom_cat: "",
    made_in: "",
    company_name: "",
  });

  const reorderSuppliers = (
    list: SuppliersOption[],
    startIndex: number,
    endIndex: number
  ): SuppliersOption[] => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const handleFormatErrorChange = (hasError: boolean) => {
    setHasFormatError(hasError);
    console.log(hasFormatError);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const updatedSuppliers = reorderSuppliers(
      selectedSuppliers,
      result.source.index,
      result.destination.index
    );

    setSelectedSuppliers(updatedSuppliers);
    updateProductSuppliersOrder(updatedSuppliers);
  };

  useEffect(() => {
    if (product) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        uvc_ids: product.uvc_ids.map((uvc) => ({
          ...uvc,
          collectionUvc: product.collection_ids[0]?.label || "",
        })),
      }));
    }
  }, [product]);

  useEffect(() => {
    if (product) {
      setFormData({
        creator_id: creatorId._id,
        reference: product.reference || "",
        alias: product.alias || "",
        short_label: product.short_label || "",
        long_label: product.long_label || "",
        type: product.type || "Marchandise",
        tag_ids: product.tag_ids || [],
        suppliers: product.suppliers || [],
        dimension_types: product.dimension_types?.[0] || "Couleur/Taille",
        brand_ids: product.brand_ids || [],
        collection_ids: product.collection_ids || [],
        paeu: product.paeu || 0,
        tbeu_pb: product.tbeu_pb || 0,
        tbeu_pmeu: product.tbeu_pmeu || 0,
        height: product?.height || "",
        width: product?.width || "",
        length: product?.length || "",
        comment: product?.comment || "",
        size_unit: product?.size_unit || "",
        weigth_unit: product?.weigth_unit || "",
        gross_weight: product?.gross_weight || "",
        blocked: product?.blocked || "",
        blocked_reason_code: product?.blocked_reason_code || "",
        net_weight: product?.net_weight || "",
        imgPath: product.imgPath || "",
        status: product.status || "A",
        uvc_ids: product.uvc_ids || [],
        additional_fields: product.additional_fields || [],
        initialSizes: ["000"],
        initialColors: ["000"],
        initialGrid: [[true]],
      });

      // Mapping des suppliers avec vérifications
      const suppliersMapped = product.suppliers.map((supplier: any) => ({
        _id: supplier?.supplier_id?._id || "",
        value: supplier?.supplier_id?._id || "",
        label: supplier?.supplier_id?.company_name || "Nom inconnu",
        company_name: supplier?.supplier_id?.company_name || "Nom inconnu",
        supplier_ref: supplier?.supplier_ref || "Référence inconnue",
        supplier_id: supplier?.supplier_id || "Référence inconnue",
        pcb: supplier?.pcb || "PCB inconnue",
        custom_cat: supplier?.custom_cat || "Catégorie inconnue",
        made_in: supplier?.made_in || "Pays d'origine inconnu",
      }));

      setSelectedSuppliers(suppliersMapped);
    }
  }, [product, creatorId._id]);

  useEffect(() => {
    if (product && product.uvc_ids) {
      setFormDataUvc({
        uvc: product.uvc_ids.map((uvc) => ({
          ...uvc,
          product_id: uvc.product_id || "",
          code: uvc.code || "",
          dimensions: uvc.dimensions || [],
          prices: {
            supplier_id: uvc.prices?.supplier_id || "",
            price: {
              // Utiliser d'abord les prix spécifiques de l'UVC s'ils existent
              paeu: uvc.prices?.price?.paeu || product.paeu || 0,
              tbeu_pb: uvc.prices?.price?.tbeu_pb ?? product.tbeu_pb ?? 0,
              tbeu_pmeu: uvc.prices?.price?.tbeu_pmeu ?? product.tbeu_pmeu ?? 0,
            },
          },
          collectionUvc:
            uvc.collectionUvc || product.collection_ids[0]?.label || "",
          eans: uvc.eans || ["-"],
          ean: uvc.ean || "",
          status: uvc.status || "A",
          made_in: uvc.made_in,
          custom_cat: uvc.custom_cat,
          measurements: uvc.measurements,
          net_weight: uvc.net_weight,
          gross_weight: uvc.gross_weight,
          height: uvc.height,
          length: uvc.length,
          width: uvc.width,
          blocked: uvc.blocked,
          blocked_reason_code: uvc.blocked_reason_code,
          coulfour: uvc.coulfour,
          visible_on_internet: uvc.visible_on_internet,
          sold_on_internet: uvc.sold_on_internet,
          seuil_internet: uvc.seuil_internet,
          en_reassort: uvc.en_reassort,
          remisegenerale: uvc.remisegenerale,
          fixation: uvc.fixation,
          ventemetre: uvc.ventemetre,
          comment: uvc.comment,
          barcodePath: uvc.barcodePath,
        })),
      });
    }
  }, [product]);

  const [sizes, setSizes] = useState<string[]>(formData.initialSizes);
  const [colors, setColors] = useState<string[]>(formData.initialColors);
  const [uvcGrid, setUvcGrid] = useState<boolean[][]>(formData.initialGrid);

  const filterOptions = (inputValue: string, options: any[]) => {
    const input = inputValue ? inputValue.toLowerCase() : "";
    return options.filter((option) => {
      const name = option.label ? option.label.toLowerCase() : "";
      const code = option.code ? option.code.toLowerCase() : ""; // Vérifiez si le code existe
      return name.includes(input) || code.includes(input);
    });
  };

  const formatOptionLabel = ({
    label,
    code,
  }: {
    label: string;
    code: string;
  }) => (
    <div className="flex items-center justify-between">
      <span>{label}</span>
      <span className="text-gray-400 text-sm">({code})</span>
    </div>
  );

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

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: value === "" ? 0 : parseFloat(value),
    }));
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

  const handleTypeChange = (selectedType: string) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      type: selectedType,
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

  const handleChangeSubFamily = (newValue: SingleValue<TagOption> | null) => {
    setSelectedOptionSubFamily(newValue);

    setFormData((prevFormData) => {
      let newTagIds = [...prevFormData.tag_ids];
      if (newValue) {
        newTagIds[1] = newValue.value;
      } else {
        newTagIds[1] = "";
      }
      return {
        ...prevFormData,
        tag_ids: newTagIds.filter(Boolean),
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

  const handleUpdateCollection = (index: number, updatedCollection: any) => {
    setFormDataUvc((prevFormDataUvc) => {
      const updatedUVCs = [...prevFormDataUvc.uvc];
      updatedUVCs[index].collectionUvc = updatedCollection;
      return { ...prevFormDataUvc, uvc: updatedUVCs };
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
            code: collection.code,
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
        `${process.env.REACT_APP_URL_DEV}/api/v1/collection/search?label=${inputValueCollection}&code=${inputValueCollection}&page=${currentPage}&limit=${limit}`,
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
          code: collection.code,
        })
      );

      setOptionsCollection(optionsCollection);
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    }
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
          supplier_id: "",
          supplier_ref: "",
          pcb: "",
          custom_cat: "",
          made_in: "",
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

  const updateSupplierDetails = (
    supplierId: string,
    field: string,
    value: string
  ) => {
    setSelectedSuppliers((prevSuppliers) => {
      return prevSuppliers.map((supplier) => {
        if (supplier.value === supplierId) {
          return {
            ...supplier,
            [field]: value,
          };
        }
        return supplier;
      });
    });
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

  const handleDimensionsChange = (dimensions: string[][]) => {
    const newUVCs = dimensions.flatMap((dim) => {
      return dim.map((combination, i) => {
        const [color, size] = combination.split(",");

        const existingUvc = formData.uvc_ids.find((uvc) => {
          const [existingColor, existingSize] =
            uvc.dimensions[0]?.split("/") || [];
          return existingColor === color && existingSize === size;
        });

        // Vérifiez que `prices` et `price` existent, sinon appliquez une valeur par défaut
        const defaultPrice = { paeu: 0, tbeu_pb: 0, tbeu_pmeu: 0 };
        const prices = existingUvc?.prices || {
          supplier_id: "",
          price: defaultPrice,
        };

        return {
          product_id: id,
          code: `${formData.reference}_${color}_${size}`,
          dimensions: [`${color}/${size}`],
          prices: {
            supplier_id: prices.supplier_id,
            price: {
              paeu: prices.price.paeu || formData.paeu || 0,
              tbeu_pb: prices.price.tbeu_pb || formData.tbeu_pb || 0,
              tbeu_pmeu: prices.price.tbeu_pmeu || formData.tbeu_pmeu || 0,
            },
          },
          collectionUvc:
            formData.uvc_ids[i]?.collectionUvc ||
            formData.collection_ids[0]?.label ||
            "Aucune collection enregistré",
          eans: existingUvc?.eans || ["-"],
          ean: existingUvc?.ean || "",
          barcodePath: existingUvc?.barcodePath || "",
          height: existingUvc?.height || "",
          width: existingUvc?.height || "",
          length: existingUvc?.length || "",
          gross_weight: existingUvc?.gross_weight || "",
          net_weight: existingUvc?.gross_weight || "",
          status: "A",
        };
      });
    });

    setFormDataUvc((prevFormData) => ({
      ...prevFormData,
      uvc: newUVCs,
    }));
  };

  const fetchProduct = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/product/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        setProduct(result);
      } else {
        console.error("Erreur lors de la requête");
      }
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    }
  };

  const checkDifferences = () => {
    const detectedDifferences: {
      field: string;
      productValue: any;
      uvcValue: any;
    }[] = [];

    formDataUvc.uvc.forEach((uvc, index) => {
      [
        "collectionUvc",
        "paeu",
        "tbeu_pb",
        "tbeu_pmeu",
        "height",
        "width",
        "length",
        "gross_weight",
        "net_weight",
      ].forEach((field) => {
        const productValue = formData[field as keyof typeof formData];
        const uvcValue = uvc[field as keyof typeof uvc];

        if (
          productValue !== undefined &&
          uvcValue !== undefined &&
          productValue !== uvcValue
        ) {
          detectedDifferences.push({
            field,
            productValue,
            uvcValue,
          });
        }
      });
    });

    if (detectedDifferences.length > 0) {
      setDifferences(detectedDifferences);
      setIsDifferenceModalOpen(true);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  useEffect(() => {
    fetchField();
  }, []);

  useEffect(() => {
    if (product) {
      // Extraire les tailles et les couleurs
      const extractedColors = product?.uvc_ids
        ? [
            ...new Set(
              product.uvc_ids.map((uvc) => uvc.dimensions?.[0]?.split("/")[0])
            ),
          ]
        : [];

      const extractedSizes = product?.uvc_ids
        ? [
            ...new Set(
              product.uvc_ids.map((uvc) => uvc.dimensions?.[0]?.split("/")[1])
            ),
          ]
        : [];

      // Construire la grille initiale
      const initialGrid = extractedColors.map((color) =>
        extractedSizes.map(
          (size) =>
            product?.uvc_ids?.some((uvc) => {
              const [uvcColor, uvcSize] = uvc.dimensions[0].split("/");
              return uvcColor === color && uvcSize === size;
            }) || false // Si la valeur est undefined, elle sera remplacée par false
        )
      );

      // Mettre à jour les états
      setSizes(extractedSizes);
      setColors(extractedColors);
      setUvcGrid(initialGrid);
    }
  }, [product]);

  const toggleFullScreen = () => {
    setIsFullScreen((prevState) => !prevState);
  };

  const handleInputChange = (event: any) => {
    setDesactivationInput(event.target.value);
  };

  // Fonction de mise a jour de la référence
  const handleUpdateReference = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Créer les UVC et récupérer leurs IDs
      const uvcPromises = formDataUvc.uvc.map(async (uvc) => {
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
        return createdUvc._id;
      });

      const uvcIds = await Promise.all(uvcPromises);

      // Formater les fournisseurs sélectionnés
      const formattedSuppliers = selectedSuppliers.map((supplierOption) => ({
        supplier_id: supplierOption.value,
        supplier_ref: supplierOption.supplier_ref || "",
        pcb: supplierOption.pcb || "",
        custom_cat: supplierOption.custom_cat || "",
        made_in: supplierOption.made_in || "",
        company_name: supplierOption.company_name || "",
      }));

      // Préparer les données mises à jour
      const updatedFormData = {
        ...formData,
        uvc_ids: uvcIds,
        suppliers: formattedSuppliers,
      };

      // Créer l'entrée de mise à jour
      const updateEntry = createUpdateEntry(
        product,
        updatedFormData,
        creatorId.username
      );

      // Envoyer la requête
      const productResponse = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/product/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...updatedFormData,
            updateEntry,
          }),
        }
      );

      if (productResponse.ok) {
        notifySuccess("Le produit a bien été mis à jour !");
        window.location.reload();
      } else {
        notifyError("Erreur lors de la mise à jour de la référence !");
      }
    } catch (error) {
      console.error("Erreur lors de la requête", error);
      notifyError("Erreur lors de la mise à jour de la référence");
    } finally {
      setIsLoading(false);
      setIsModify(false);
    }
  };

  // Fonction pour mettre à jour l'ordre des fournisseurs dans le produit
  const updateProductSuppliersOrder = async (
    updatedSuppliers: SuppliersOption[]
  ) => {
    const formattedSuppliers: Supplier[] = updatedSuppliers.map(
      (supplierOption) => ({
        supplier_id: supplierOption.value, // ou supplierOption._id selon votre structure
        supplier_ref: supplierOption.supplier_ref || "",
        pcb: supplierOption.pcb || "",
        custom_cat: supplierOption.custom_cat || "",
        made_in: supplierOption.made_in || "",
        company_name: supplierOption.company_name || "",
      })
    );

    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/product/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...product,
            suppliers: formattedSuppliers, // Utilisez le tableau formaté ici
          }),
        }
      );
    } catch (error) {
      console.error("Erreur lors de la mise à jour", error);
    }
  };

  const handleSupplierClick = (supplier: any, index: number) => {
    setSelectedSupplier(supplier);
    setSelectedSupplierIndex(index);
    setIsSupplierModalOpen(true);
  };

  const handleCheckboxChange = () => {
    setIsCheckboxChecked(!isCheckboxChecked);
  };

  const handleSetAsMainSupplier = () => {
    if (selectedSupplierIndex !== null && selectedSupplierIndex > 0) {
      const updatedSuppliers = [...selectedSuppliers];
      const [selected] = updatedSuppliers.splice(selectedSupplierIndex, 1);
      updatedSuppliers.unshift(selected);

      // Mise à jour de l'état local et fermeture de la modal
      setSelectedSuppliers(updatedSuppliers);
      setSelectedSupplierIndex(0);
      setIsCheckboxChecked(false);
      setIsSupplierModalOpen(false);

      // Appel de l'API pour mettre à jour l'ordre des fournisseurs dans le produit
      updateProductSuppliersOrder(updatedSuppliers);
    }
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

  const prepareDraftData = () => {
    // Étape 1 : Préparer les données pour le draft
    const formattedSuppliers = formData.suppliers.map(
      (supplier: SupplierData) => {
        let companyName = "Nom inconnu";

        // Vérifie si supplier_id est un objet avec company_name
        if (
          typeof supplier.supplier_id === "object" &&
          supplier.supplier_id?.company_name
        ) {
          companyName = supplier.supplier_id.company_name;
        } else if (typeof supplier.supplier_id === "string") {
          companyName = supplier.supplier_id; // Utilisez la chaîne directement si c'est une string
        }

        return {
          supplier_id: companyName,
          supplier_ref: "",
          pcb: supplier.pcb || "",
          custom_cat: supplier.custom_cat || "",
          made_in: supplier.made_in || "",
        };
      }
    );

    const draftData = {
      creator_id: creatorId._id,
      reference: "",
      alias: formData.alias || "",
      short_label: formData.short_label || "",
      long_label: formData.long_label,
      type: formData.type,
      tag_ids: Array.isArray(formData.tag_ids)
        ? formData.tag_ids.map((tag) => tag.code || "Tag inconnu")
        : [],
      suppliers: formattedSuppliers,
      dimension_types: Array.isArray(formData.dimension_types)
        ? formData.dimension_types
        : [formData.dimension_types || "Type par défaut"],
      brand_ids: Array.isArray(formData.brand_ids)
        ? formData.brand_ids.map((brand) => brand.label || "Marque inconnue")
        : ["Marque inconnue"],
      collection_ids: Array.isArray(formData.collection_ids)
        ? formData.collection_ids.map(
            (collection) => collection.label || "Collection inconnue"
          )
        : ["Collection inconnue"],
      paeu: formData.paeu || 0,
      tbeu_pb: formData.tbeu_pb || 0,
      tbeu_pmeu: formData.tbeu_pmeu || 0,
      height: formData.height || "0",
      width: formData.width || "0",
      length: formData.length || "0",
      comment: formData.comment || "",
      gross_weight: formData.gross_weight || "0",
      net_weight: formData.net_weight || "0",
      size_unit: formData.size_unit || "",
      weigth_unit: formData.weigth_unit || "",
      imgPath: formData.imgPath || "",
      status: "Draft", // Toujours `Draft` pour un draft
      step: 1, // Étape initiale d'un draft
      additional_fields: formData.additional_fields || [],
      uvc: formDataUvc.uvc.map((uvc) => ({
        code: "",
        dimensions: uvc.dimensions,
        prices: {
          price: {
            paeu: uvc.prices?.price?.paeu || 0,
            tbeu_pb: uvc.prices?.price?.tbeu_pb || 0,
            tbeu_pmeu: uvc.prices?.price?.tbeu_pmeu || 0,
          },
        },
        collectionUvc: uvc.collectionUvc,
        height: uvc.height || "0",
        width: uvc.width || "0",
        length: uvc.length || "0",
        gross_weight: uvc.gross_weight || "0",
        net_weight: uvc.net_weight || "0",
        eans: uvc.eans || [],
        ean: "",
        status: "A",
      })),
    };

    return draftData;
  };

  const handleDuplicate = async () => {
    setIsLoading(true);
    try {
      const draftData = prepareDraftData(); // Préparer les données

      // Étape 2 : Envoyer les données à la route /draft
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/draft`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(draftData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Erreur lors de la création du draft"
        );
      }

      const newDraft = await response.json();
      notifySuccess("Draft créé avec succès !");
      navigate(`/draft/${newDraft._id}`);
    } catch (error) {
      console.error("Erreur lors de la duplication :", error);
      notifyError("Erreur lors de la création du draft");
    } finally {
      setIsLoading(false);
    }
  };

  const handleColumnEdit = (index: number) => {
    setEditableColumnIndex(index);
  };

  useEffect(() => {
    if (!isModify) {
      setIsModifyUvc(false);
    }
  }, [isModify]);

  const resetHasEanConflict = () => {
    setHasEanConflict(false);
  };

  useEffect(() => {
    const selectedBlockId = blocks[0]?._id || "";
    setFormData((prevFormData) => ({
      ...prevFormData,
      blocked_reason_code: selectedBlockId,
    }));
  }, [blocks]);

  const updateUvcProperty = (index: number, property: string, value: any) => {
    setFormDataUvc((prevFormDataUvc) => {
      const updatedUvc = [...prevFormDataUvc.uvc];
      updatedUvc[index] = {
        ...updatedUvc[index],
        [property]: value,
      };

      // Synchronisez formData si applicable
      if (property === "blocked" || property === "blocked_reason_code") {
        setFormData((prevFormData) => {
          const updatedUvcIds = [...prevFormData.uvc_ids];
          updatedUvcIds[index] = {
            ...updatedUvcIds[index],
            [property]: value,
          };
          return {
            ...prevFormData,
            uvc_ids: updatedUvcIds,
          };
        });
      }

      return {
        ...prevFormDataUvc,
        uvc: updatedUvc,
      };
    });
  };

  const handleUpdateBlocked = (index: number, updatedCollection: any) => {
    const isBlockedNo = updatedCollection.blocked === "Non";

    // Met à jour la propriété `blocked`
    updateUvcProperty(index, "blocked", updatedCollection.blocked);

    // Réinitialise `blocked_reason_code` si `blocked` est "Non"
    if (isBlockedNo) {
      updateUvcProperty(index, "blocked_reason_code", "");
    }
  };

  const handleUpdateBlockReason = (index: number, updatedReason: any) => {
    const reason =
      typeof updatedReason === "object"
        ? updatedReason.value || updatedReason.label
        : updatedReason;
    updateUvcProperty(index, "blocked_reason_code", reason);
  };

  console.log(formData);

  return (
    <>
      <Modal
        show={modalSupplierisOpen}
        onCancel={() => setModalSupplierisOpen(false)}
        onClose={() => setModalSupplierisOpen(false)}
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
            if (newSupplier.supplier_id) {
              updateSupplierDetails(newSupplier.supplier_id, field, value);
            }
          }}
          removeSupplier={() => {}}
          onCloseModal={() => setModalSupplierisOpen(false)}
          addSupplier={addSupplier}
        />
      </Modal>
      <Modal
        show={isModalOpenConfirm}
        onCancel={() => setIsModalOpenConfirm(false)}
        onClose={() => setIsModalOpenConfirm(false)}
        header={`Desactivation de  ${product && product.long_label}`}
      >
        <div className="border-b-[2px] py-5">
          <div className="w-[90%] mx-auto">
            {product && (
              <p>
                Recopiez ce texte pour valider la desactivation :
                <span className="font-[800] text-[13px]">
                  {" "}
                  {product.long_label}
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
          {product && (
            <button
              type="button"
              disabled={desactivationInput !== product.long_label}
              className={`p-2 w-full rounded-md ${
                desactivationInput !== product.long_label
                  ? "bg-gray-300"
                  : "bg-red-500 text-white"
              }`}
            >
              Valider la desactivation
            </button>
          )}
        </div>
      </Modal>
      <Modal
        show={isSupplierModalOpen}
        onCancel={() => setIsSupplierModalOpen(false)}
        onClose={() => setIsSupplierModalOpen(false)}
        header="Détails du fournisseur"
      >
        {selectedSupplier && (
          <>
            <SupplierComponent
              supplier={selectedSupplier}
              isModify={isModify}
              isDraft={false}
              index={selectedSupplierIndex ?? 0}
              onUpdate={(updatedSupplier) => {
                if (
                  selectedSupplier &&
                  typeof selectedSupplierIndex === "number"
                ) {
                  // Update both formData.suppliers and selectedSuppliers
                  setFormData((prevFormData) => {
                    const updatedSuppliers = [...prevFormData.suppliers];
                    updatedSuppliers[selectedSupplierIndex] = {
                      ...updatedSuppliers[selectedSupplierIndex],
                      ...updatedSupplier,
                    };
                    return {
                      ...prevFormData,
                      suppliers: updatedSuppliers,
                    };
                  });

                  setSelectedSuppliers((prevSuppliers) => {
                    const updatedSuppliers = [...prevSuppliers];
                    updatedSuppliers[selectedSupplierIndex] = {
                      ...updatedSuppliers[selectedSupplierIndex],
                      ...updatedSupplier,
                    };
                    return updatedSuppliers;
                  });

                  setIsSupplierModalOpen(false);
                }
              }}
              onClose={() => setIsSupplierModalOpen(false)}
            />
          </>
        )}
      </Modal>
      <section className="w-full bg-slate-50 p-8 max-w-[2000px] mx-auto min-h-screen">
        <form onSubmit={handleUpdateReference}>
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2">
              <div onClick={() => navigate(-1)} className="cursor-pointer">
                <ChevronLeft />
              </div>
              <h1 className="text-[32px] font-[800]">
                Page <span className="font-[300]">produit</span>
              </h1>
            </div>
            <div className="flex items-center justify-between">
              {product && (
                <h2 className="text-[25px] font-[200]">{product.long_label}</h2>
              )}
              {isLoading ? (
                // Afficher un indicateur de chargement si isLoading est vrai
                <div className="flex items-center gap-2">
                  <CircularProgress />
                </div>
              ) : !isModify ? (
                <div className="flex items-center gap-2">
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                    }}
                    size="small"
                    danger
                  >
                    {formData.status === "A" ? (
                      <TriangleAlert size={15} />
                    ) : (
                      <IterationCcw size={15} />
                    )}

                    {formData.status === "A"
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
                    <Pen size={15} />
                    {isModify ? "Annuler modification" : "Modifier"}
                  </Button>
                  <Button
                    size="small"
                    blue
                    type="button"
                    onClick={handleDuplicate}
                    disabled={product?.status === "D"}
                  >
                    <Copy size={15} />
                    Dupliquer
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    size="small"
                    cancel
                    type="button"
                    onClick={() => setIsModify(false)}
                  >
                    Annuler
                  </Button>
                  <Button
                    size="small"
                    type="submit"
                    blue
                    disabled={isLoading || hasEanConflict || hasFormatError}
                  >
                    Valider
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Partie Infos */}
          <div className="mt-7">
            {product && (
              <>
                {/* Indentification */}
                <div className="flex flex-col-reverse lg:flex-row gap-7 mt-[50px] items-stretch">
                  <div className="w-[60%]">
                    <FormSection
                      title="Identification"
                      size={`${!isModify ? "h-[400px]" : "h-[470px]"}`}
                    >
                      <div className="relative mt-3">
                        <div className="grid grid-cols-4 gap-2 py-2">
                          <span className="col-span-1 font-[700] text-slate-500 text-[13px]">
                            Reférence :
                          </span>
                          {!isModify ? (
                            <span className="col-span-3 text-gray-600 whitespace-nowrap text-[14px]">
                              {product.reference ? (
                                product.reference
                              ) : (
                                <CircleSlash2 size={15} />
                              )}
                            </span>
                          ) : (
                            <input
                              type="text"
                              id="reference"
                              onChange={handleChange}
                              placeholder={product?.reference}
                              value={formData.reference}
                              className="col-span-3 border rounded-md p-1 bg-gray-200 border-white text-gray-500 italic py-2"
                              disabled
                            />
                          )}
                        </div>
                        <div className="grid grid-cols-4 gap-2 py-2">
                          <span className="col-span-1 font-[700] text-slate-500 text-[13px]">
                            Alias :
                          </span>
                          {!isModify ? (
                            <span className="col-span-3 text-gray-600 whitespace-nowrap text-[14px]">
                              {product.alias ? (
                                product.alias
                              ) : (
                                <CircleSlash2 size={15} />
                              )}
                            </span>
                          ) : (
                            <input
                              type="text"
                              id="alias"
                              onChange={handleChange}
                              placeholder={product?.alias}
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
                              {product.long_label ? (
                                product.long_label
                              ) : (
                                <CircleSlash2 size={15} />
                              )}
                            </span>
                          ) : (
                            <input
                              type="text"
                              id="long_label"
                              onChange={handleChange}
                              placeholder={product?.long_label}
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
                              {product.short_label ? (
                                product.short_label
                              ) : (
                                <CircleSlash2 size={15} />
                              )}
                            </span>
                          ) : (
                            <input
                              type="text"
                              id="short_label"
                              onChange={handleChange}
                              placeholder={product?.short_label}
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
                              {product.brand_ids &&
                              product.brand_ids.length > 0 ? (
                                product.brand_ids.map((brand, index) => (
                                  <p key={index}>{brand.label}</p>
                                ))
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
                              placeholder={product?.brand_ids[0].label || ""}
                              isClearable
                            />
                          )}
                        </div>

                        <div className="grid grid-cols-4 gap-2 py-2">
                          <span className="col-span-1 font-[700] text-slate-500 text-[13px]">
                            Famille :
                          </span>
                          {!isModify ? (
                            <span className="col-span-3 text-gray-600 whitespace-nowrap text-[14px]">
                              {product.tag_ids && product.tag_ids.length > 0 ? (
                                `${product.tag_ids[0].code} - ${product.tag_ids[0].name}`
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
                              placeholder={
                                product?.tag_ids?.[0]
                                  ? `${product.tag_ids[0].code} - ${product.tag_ids[0].name}`
                                  : "Sélectionnez une famille"
                              }
                              isClearable
                            />
                          )}
                        </div>

                        <div className="grid grid-cols-4 gap-2 py-2">
                          <span className="col-span-1 font-[700] text-slate-500 text-[13px]">
                            Sous-famille :
                          </span>
                          {!isModify ? (
                            <span className="col-span-3 text-gray-600 whitespace-nowrap text-[14px]">
                              {product.tag_ids[1] &&
                              product.tag_ids.length > 0 ? (
                                `${product.tag_ids[1].code} - ${product.tag_ids[1].name}`
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
                              placeholder={
                                product?.tag_ids?.[1]
                                  ? `${product.tag_ids[1].code} - ${product.tag_ids[1].name}`
                                  : "Sélectionnez une sous famille"
                              }
                              isClearable
                            />
                          )}
                        </div>

                        <div className="grid grid-cols-4 gap-2 py-2">
                          <span className="col-span-1 font-[700] text-slate-500 text-[13px]">
                            Sous-sous-famille :
                          </span>
                          {!isModify ? (
                            <span className="col-span-3 text-gray-600 whitespace-nowrap text-[14px]">
                              {product.tag_ids[2] &&
                              product.tag_ids.length > 0 ? (
                                `${product?.tag_ids[2].code} - ${product?.tag_ids[2].name}`
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
                              placeholder={
                                product?.tag_ids?.[2]
                                  ? `${product.tag_ids[2].code} - ${product.tag_ids[2].name}`
                                  : "Sélectionnez une sous sous famille"
                              }
                              isClearable
                            />
                          )}
                        </div>
                      </div>
                    </FormSection>
                  </div>

                  <div className="w-[480px] bg-white">
                    <FormSection
                      size={`${!isModify ? "h-[400px]" : "h-[470px]"}`}
                    >
                      {product.imgPath ? (
                        <div className="relative w-full h-0 pb-[75%]">
                          <img
                            src={product.imgPath}
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

                <div className="flex gap-2 mt-[50px] items-stretch">
                  {/* Fournisseur */}
                  <div className="w-1/4">
                    <FormSection title="Fournisseurs">
                      <SupplierList
                        suppliers={selectedSuppliers}
                        onSupplierClick={handleSupplierClick}
                        onDragEnd={handleDragEnd}
                        isModify={isModify}
                        setModalSupplierisOpen={setModalSupplierisOpen}
                      />
                    </FormSection>
                  </div>
                  {/* Caractéristiques produit */}
                  <div className="w-1/4">
                    <FormSection title="Caractéristiques Produit">
                      <div className="mt-3 grid grid-cols-1 gap-2">
                        <div className="grid grid-cols-2 items-center gap-x-4">
                          <span className="font-[700] text-slate-500 text-[12px]">
                            Type :
                          </span>
                          {!isModify ? (
                            <div>
                              <span className="col-span-6 text-gray-600 whitespace-nowrap overflow-ellipsis overflow-hidden text-[14px] capitalize">
                                {product.type ? product.type : "Marchandise"}
                              </span>
                            </div>
                          ) : (
                            <select
                              className="w-full border rounded-md p-1 bg-white focus:outline-none focus:border-blue-500 py-2"
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
                        <div className="grid grid-cols-2 items-center gap-x-4">
                          <span className="font-[700] text-slate-500 text-[12px]">
                            Dimensions :
                          </span>
                          <div>
                            <span className="col-span-6 text-gray-600 whitespace-nowrap overflow-ellipsis overflow-hidden text-[14px] capitalize">
                              {product.dimension_types &&
                              product.dimension_types.length > 0 ? (
                                product.dimension_types.join(" / ")
                              ) : (
                                <CircleSlash2 size={15} />
                              )}
                            </span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 items-center gap-x-4">
                          <span className="font-[700] text-slate-500 text-[12px]">
                            Collection :
                          </span>
                          {!isModify ? (
                            <div>
                              <span className="col-span-6 text-gray-600 text-[14px]">
                                {product.collection_ids &&
                                product.collection_ids.length > 0 ? (
                                  product.collection_ids.map(
                                    (collection, index) => (
                                      <p key={index}>{collection.label}</p>
                                    )
                                  )
                                ) : (
                                  <CircleSlash2 size={15} />
                                )}
                              </span>
                            </div>
                          ) : (
                            <CreatableSelect
                              className="w-full"
                              value={selectedOptionCollection}
                              onChange={handleChangeCollection}
                              onInputChange={handleInputChangeCollection}
                              onFocus={() => handleInputChangeCollection("")}
                              filterOption={(option, input) =>
                                filterOptions(input, [option.data])[0] !==
                                undefined
                              }
                              formatOptionLabel={formatOptionLabel}
                              options={optionsCollection}
                              inputValue={inputValueCollection}
                              placeholder={
                                product?.collection_ids?.[0]?.label ||
                                "Selectionnez une collection"
                              }
                              isClearable
                            />
                          )}
                        </div>
                        <div className="grid grid-cols-2 items-center gap-x-4">
                          <span className="font-[700] text-slate-500 text-[12px]">
                            Blocage :
                          </span>
                          {!isModify ? (
                            <div>
                              <span className="col-span-6 text-gray-600 text-[14px]">
                                {formData.blocked === "Oui" ? "Oui" : "Non"}
                              </span>
                            </div>
                          ) : (
                            <select
                              className="w-full border rounded-md p-1 bg-white text-gray-600 focus:outline-none focus:border-blue-500"
                              value={formData.blocked}
                              onChange={(e) =>
                                setFormData((prevFormData) => ({
                                  ...prevFormData,
                                  blocked: e.target.value,
                                }))
                              }
                            >
                              <option value="Non">Non</option>
                              <option value="Oui">Oui</option>
                            </select>
                          )}
                        </div>

                        {formData.blocked === "Oui" && (
                          <div className="grid grid-cols-2 items-center gap-x-4">
                            <span className="font-[700] text-slate-500 text-[12px]">
                              Raison du blocage :
                            </span>
                            {!isModify ? (
                              <div>
                                <span className="col-span-6 text-gray-600 text-[14px]">
                                  {product?.blocked_reason_code
                                    ? product?.blocked_reason_code
                                    : "-"}
                                </span>
                              </div>
                            ) : (
                              <BlockSection
                                blocks={blocks}
                                optionsBlock={optionsBlock}
                                handleChangeBlock={handleChangeBlock}
                                handleInputChangeBlock={handleInputChangeBlock}
                                inputValueBlock={inputValueBlock}
                                customStyles={customStyles}
                              />
                            )}
                          </div>
                        )}
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
                              {product.paeu} €
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
                              {product.tbeu_pb} €
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
                            <span className="text-gray-600 whitespace-nowrap overflow-ellipsis overflow-hidden text-[14px]">
                              {product.tbeu_pmeu} €
                            </span>
                          ) : (
                            <input
                              type="number"
                              id="tbeu_pmeu"
                              onChange={handlePriceChange}
                              placeholder={formData.tbeu_pmeu.toString()}
                              className="rounded-md p-1 bg-white focus:outline-none focus:border-blue-500 w-full"
                            />
                          )}
                        </div>
                      </div>
                    </FormSection>
                  </div>
                  {/* Prix produit */}
                  <div className="w-1/4">
                    <FormSection title="Cotes et Poids">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <div className="flex items-center gap-2 py-2">
                            <span className="font-[700] text-slate-500 text-[12px]">
                              Hauteur
                            </span>
                            {!isModify ? (
                              <span className="col-span-6 text-gray-600 whitespace-nowrap overflow-ellipsis overflow-hidden text-[14px] capitalize">
                                {product?.height || "0"} (
                                {product?.size_unit || "M"})
                              </span>
                            ) : (
                              <input
                                type="text"
                                id="height"
                                onChange={handleChange}
                                value={formData.height}
                                className="border rounded-md p-1 bg-white focus:outline-none focus:border-blue-500 w-full"
                              />
                            )}
                          </div>
                          <div className="flex items-center gap-2 py-2">
                            <span className="font-[700] text-slate-500 text-[12px]">
                              Longueur
                            </span>
                            {!isModify ? (
                              <span className="ext-gray-600 whitespace-nowrap overflow-ellipsis overflow-hidden text-[14px]">
                                {product?.length || "0"} (
                                {product?.size_unit || "M"})
                              </span>
                            ) : (
                              <input
                                type="text"
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
                              <span className="col-span-6 text-gray-600 whitespace-nowrap overflow-ellipsis overflow-hidden text-[14px]">
                                {product?.width || "0"} (
                                {product?.size_unit || "M"})
                              </span>
                            ) : (
                              <input
                                type="text"
                                id="width"
                                onChange={handleChange}
                                value={formData.width}
                                className="col-span-6 border rounded-md p-1 bg-white focus:outline-none focus:border-blue-500 w-full"
                              />
                            )}
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 py-2">
                            <span className="font-[700] text-slate-500 text-[12px]">
                              Poids Brut
                            </span>
                            {!isModify ? (
                              <span className="col-span-6 text-gray-600 whitespace-nowrap overflow-ellipsis overflow-hidden text-[14px]">
                                {product?.gross_weight || "0"} (
                                {product?.weigth_unit || "KG"})
                              </span>
                            ) : (
                              <input
                                type="number"
                                id="gross_weight"
                                onChange={handleChange}
                                value={formData.gross_weight}
                                className="col-span-6 border rounded-md p-1 bg-white focus:outline-none focus:border-blue-500 w-full"
                              />
                            )}
                          </div>
                          <div className="flex items-center gap-2 py-2">
                            <span className="font-[700] text-slate-500 text-[12px]">
                              Poids Net
                            </span>
                            {!isModify ? (
                              <span className="col-span-6 text-gray-600 text-[14px]">
                                {product?.net_weight || "0"} (
                                {product?.weigth_unit || "KG"})
                              </span>
                            ) : (
                              <input
                                type="number"
                                id="net_weight"
                                onChange={handleChange}
                                value={formData.net_weight}
                                className="col-span-6 border rounded-md p-1 bg-white focus:outline-none focus:border-blue-500 w-full"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </FormSection>
                  </div>
                </div>
                <div className="mt-[30px]">
                  {!isModify && (
                    <FormSection title="Champs Utilisateur">
                      <div>
                        {userFields
                          .filter((field) => field.apply_to === "Produit")
                          .map((field: any, index: number) => {
                            const supplierField = Array.isArray(
                              product?.additional_fields
                            )
                              ? product.additional_fields.find(
                                  (supField: any) =>
                                    supField.label === field.label
                                )
                              : null;

                            const displayValue =
                              supplierField?.value ||
                              field.additional_fields[0]?.default_value ||
                              "Non renseigné";

                            return (
                              <div
                                key={index}
                                className="grid grid-cols-12 gap-2 py-2"
                              >
                                <span className="col-span-3 font-[700] text-slate-500 text-[13px]">
                                  {field.label} :
                                </span>

                                <span className="col-span-3 text-gray-600 whitespace-nowrap overflow-ellipsis overflow-hidden text-[14px]">
                                  {displayValue}
                                </span>
                              </div>
                            );
                          })}
                      </div>
                    </FormSection>
                  )}
                  {isModify && (
                    <FormSection title="Champs utilisateur">
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
                                    (customField, index) => {
                                      const fieldValue =
                                        fieldValues[`${field._id}-${index}`] ||
                                        customField.default_value || // Pré-remplir avec la valeur par défaut
                                        "";

                                      return (
                                        <div
                                          key={`${field._id}-${index}`}
                                          className="mb-4"
                                        >
                                          <DynamicField
                                            id={`${field._id}-${index}`}
                                            name={customField.field_name}
                                            fieldType={customField.field_type}
                                            value={fieldValue}
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
                                      );
                                    }
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
                        <p className="text-sm text-gray-500 font-[600]">
                          {product.comment
                            ? product.comment
                            : "Aucun commentaire"}
                        </p>
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
              {isModify && (
                <div className="mt-3">
                  <Button
                    size="100"
                    blue
                    type="button"
                    onClick={() => setIsModifyUvc((prev) => !prev)}
                    disabled={isLoading || hasEanConflict || hasFormatError}
                  >
                    {isModifyUvc ? "Enregistrer" : "Modifier les UVC"}
                  </Button>
                </div>
              )}
            </div>
            {page === "dimension" && (
              <div
                className={`border-t-[1px] border-gray-300 px-5 py-2 overflow-y-auto ${
                  isFullScreen
                    ? "fixed right-0 top-0 w-full h-screen z-[9999] bg-gray-100"
                    : "w-full"
                }`}
              >
                <UVCGrid
                  onDimensionsChange={handleDimensionsChange}
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
                  isEditable={false}
                />
              </div>
            )}
            {page === "uvc" && (
              <div
                className={`border-t-[1px] border-gray-300 px-5 py-2 ${
                  isFullScreen
                    ? "fixed right-0 top-0 w-full h-screen z-[9999] bg-gray-100"
                    : "w-full"
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
                {onglet === "infos" && product && (
                  <UVCInfosTable
                    isModify={isModify}
                    isModifyUvc={isModifyUvc}
                    setModifyUvc={setIsModifyUvc}
                    reference={truncateText(product?.reference, 15) || ""}
                    collection={
                      product?.collection_ids?.[0]?.label || "Non spécifiée"
                    }
                    placeholder={(index) =>
                      formData.uvc_ids[index]?.collectionUvc ||
                      formData.collection_ids[0]?.label ||
                      ""
                    }
                    uvcDimension={formDataUvc.uvc.map((uvc) => ({
                      code: uvc.code,
                      dimensions: uvc.dimensions,
                      collectionUvc:
                        uvc.collectionUvc ||
                        product?.collection_ids[0]?.label ||
                        "",
                    }))}
                    customStyles={customStyles}
                    handleUpdateCollection={handleUpdateCollection}
                  />
                )}
                {onglet === "price" && product && (
                  <UVCPriceTable
                    reference={truncateText(product?.reference, 15) || ""}
                    uvcPrices={formDataUvc.uvc}
                    globalPrices={{
                      paeu: formData.paeu,
                      tbeu_pb: formData.tbeu_pb,
                      tbeu_pmeu: formData.tbeu_pmeu,
                    }}
                    isModify={isModify}
                    isModifyUvc={isModifyUvc}
                    setModifyUvc={setIsModifyUvc}
                    onPriceChange={(index, field, value) => {
                      setFormDataUvc((prevFormData) => {
                        const updatedUVCs = [...prevFormData.uvc];

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
                        updatedUVCs[index].prices.price = {
                          ...updatedUVCs[index].prices.price,
                          [field]: value,
                        };

                        return { ...prevFormData, uvc: updatedUVCs };
                      });
                    }}
                  />
                )}
                {onglet === "supplier" && product && (
                  <UVCSupplierTable
                    reference={truncateText(product?.reference, 15) || ""}
                    uvcDimension={formData.uvc_ids || []}
                    type="product"
                    data={{
                      suppliers: transformedSuppliers,
                    }}
                  />
                )}

                {onglet === "weight" && product && (
                  <UVCMeasureTable
                    reference={truncateText(product?.reference, 15) || ""}
                    uvcMeasure={formDataUvc.uvc}
                    Measure={{
                      height: product?.height || "0",
                      long: product?.length || "0",
                      width: product?.width || "0",
                      weight_brut: product?.gross_weight || "0",
                      weight_net: product?.net_weight || "0",
                    }}
                    size_unit={product?.size_unit || "m"}
                    weight_unit={product?.weigth_unit || "kg"}
                    isModify={isModify}
                    isModifyUvc={isModifyUvc}
                    setModifyUvc={setIsModifyUvc}
                    onUpdateMeasures={(index, field, value) => {
                      setFormDataUvc((prev) => {
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
                {onglet === "ean" && product && (
                  <UVCEanTable
                    isModify={isModify}
                    isModifyUvc={isModifyUvc}
                    reference={truncateText(product?.reference, 15) || ""}
                    uvcDimension={formData.uvc_ids.map((uvc) => ({
                      ...uvc,
                      id: uvc._id || "default-id",
                      code: uvc.code || "default-code",
                      dimensions: uvc.dimensions || [],
                      ean: uvc.ean || "",
                      eans: uvc.eans || ["-"],
                    }))}
                    onResetConflict={resetHasEanConflict}
                    onUpdateEan={(uvcIndex, eanIndex, value) => {
                      setFormData((prev) => {
                        const updatedUvc = [...prev.uvc_ids];

                        // Si c'est une mise à jour globale (-1)
                        if (eanIndex === -1) {
                          if (updatedUvc[uvcIndex]?.eans) {
                            updatedUvc[uvcIndex].eans = updatedUvc[
                              uvcIndex
                            ].eans.map((ean) => (ean === value ? value : ean));
                          }
                        } else {
                          // Mise à jour d'un EAN spécifique
                          if (!updatedUvc[uvcIndex].eans) {
                            updatedUvc[uvcIndex].eans = [];
                          }
                          updatedUvc[uvcIndex].eans[eanIndex] = value;
                        }

                        return { ...prev, uvc_ids: updatedUvc };
                      });
                    }}
                    onCheckEan={async (ean, uvcId, currentEanIndex) => {
                      try {
                        const response = await fetch(
                          `${process.env.REACT_APP_URL_DEV}/api/v1/uvc/check-eans`,
                          {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              ean,
                              uvcId,
                              currentEanIndex,
                            }),
                          }
                        );
                        const data = await response.json();
                        console.log(data);
                        setHasEanConflict(data.exist);
                        return {
                          exists: data.exist,
                          productId: data.product?._id || null,
                          uvcId: data.uvcId || null,
                        };
                      } catch (error) {
                        console.error("Error checking EAN:", error);
                        return { exists: false, productId: null, uvcId: null };
                      }
                    }}
                    onFormatErrorChange={handleFormatErrorChange}
                  />
                )}

                {onglet === "bloc" && product && (
                  <UVCBlockTable
                    isModify={isModify}
                    isModifyUvc={isModifyUvc}
                    reference={truncateText(product?.reference, 15) || ""}
                    placeholder={(index) => {
                      const uvcSpecific =
                        formData.uvc_ids[index]?.blocked_reason_code;
                      const productGlobal = formData.blocked_reason_code;
                      const uvcGlobal =
                        formDataUvc.uvc?.[index]?.blocked_reason_code;

                      // Si l'une de ces valeurs est un objet, prenez la clé `label` ou `value`
                      const formatBlockedReason = (reason: any) =>
                        typeof reason === "object" && reason !== null
                          ? reason.label || reason.value || ""
                          : reason;

                      return (
                        formatBlockedReason(uvcSpecific) ||
                        formatBlockedReason(productGlobal) ||
                        formatBlockedReason(uvcGlobal) ||
                        ""
                      );
                    }}
                    blockValue={formData.blocked}
                    reason={formData.blocked_reason_code || "-"}
                    uvcDimension={formData.uvc_ids.map((uvc) => ({
                      code: uvc.code,
                      dimensions: uvc.dimensions,
                      collectionUvc: uvc.collectionUvc,
                      blocked: uvc.blocked,
                      blocked_reason_code: uvc.blocked_reason_code,
                    }))}
                    customStyles={customStyles}
                    handleUpdateBlocked={handleUpdateBlocked}
                    handleUpdateBlockedReason={handleUpdateBlockReason}
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
