import { LINKS_Product, LINKS_UVC } from "../../utils/index";
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import useFetch from "../../utils/hooks/usefetch";
import {
  ChevronLeft,
  CircleSlash2,
  Maximize2,
  Minimize2,
  Pen,
  Plus,
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

interface formDataUVC {
  uvc: DatalakeUvc[];
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
  peau: number;
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
  uvc_ids: Uvc[];
  additional_fields: any[];
  initialSizes: any[];
  initialColors: any[];
  initialGrid: any[];
}

export default function SingleProductPage() {
  const { id } = useParams();
  const token = useSelector((state: any) => state.auth.token);
  const creatorId = useSelector((state: any) => state.auth.user);
  const [fieldValues, setFieldValues] = useState<{ [key: string]: any }>({});
  const { notifySuccess, notifyError } = useNotify();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [modalSupplierisOpen, setModalSupplierisOpen] = useState(false);
  const [product, setProduct] = useState<Product>();
  const [brandLabel, setBrandLabel] = useState("");
  const [inputValueBrand, setInputValueBrand] = useState("");
  const [optionsBrand, setOptionsBrand] = useState<BrandOption[]>([]);
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
    peau: product?.peau || 0,
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
    imgPath: "",
    status: "A",
    uvc_ids: [],
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
        ean: "",
        status: "",
      },
    ],
  });
  const [newSupplier, setNewSupplier] = useState<Supplier>({
    supplier_id: "",
    supplier_ref: "",
    pcb: "",
    custom_cat: "",
    made_in: "",
    company_name: "",
  });

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
        peau: product.peau || 0,
        tbeu_pb: product.tbeu_pb || 0,
        tbeu_pmeu: product.tbeu_pmeu || 0,
        height: product?.height || "",
        width: product?.width || "",
        length: product?.length || "",
        comment: product?.comment || "",
        size_unit: product?.size_unit || "",
        weigth_unit: product?.weigth_unit || "",
        gross_weight: product?.gross_weight || "",
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
        pcb: supplier?.pcb || "PCB inconnue",
        custom_cat: supplier?.custom_cat || "Catégorie inconnue",
        made_in: supplier?.made_in || "Pays d'origine inconnu",
      }));

      setSelectedSuppliers(suppliersMapped);
    }
  }, [product, creatorId._id]);

  const [sizes, setSizes] = useState<string[]>(formData.initialSizes);
  const [colors, setColors] = useState<string[]>(formData.initialColors);
  const [uvcGrid, setUvcGrid] = useState<boolean[][]>(formData.initialGrid);

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

  const handleDimensionsChange = (dimensions: string[][]) => {
    const newDimensions = dimensions.flatMap((dim) => {
      return dim.map((combination) => {
        const [color, size] = combination.split(",");
        return { color, size };
      });
    });

    const newUVCs = newDimensions.map((dim, index) => ({
      product_id: id,
      code: `${dim.color}${dim.size}${formData.reference}`,
      dimensions: [`${dim.color}/${dim.size}`],
      prices: [
        {
          tarif_id: "",
          currency: "EUR",
          supplier_id:
            selectedSuppliers.length > 0 ? selectedSuppliers[0]._id : "",
          price: {
            peau: formData.peau,
            tbeu_pb: formData.tbeu_pb,
            tbeu_pmeu: formData.tbeu_pmeu,
          },
          store: "",
        },
      ],
      eans: [],
      ean:"",
      status: "A",
    }));

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
        console.log(result);
        setProduct(result);
      } else {
        console.error("Erreur lors de la requête");
      }
    } catch (error) {
      console.error("Erreur lors de la requête", error);
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
      // Récupérez les UVC à créer et mappez-les
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

      // Mettez à jour l'ordre des fournisseurs
      const formattedSuppliers: Supplier[] = selectedSuppliers.map(
        (supplierOption) => ({
          supplier_id: supplierOption.value,
          supplier_ref: supplierOption.supplier_ref || "",
          pcb: supplierOption.pcb || "",
          custom_cat: supplierOption.custom_cat || "",
          made_in: supplierOption.made_in || "",
          company_name: supplierOption.company_name || "",
        })
      );

      // Données à mettre à jour dans le produit
      const updatedFormData = {
        ...formData,
        uvc_ids: uvcIds,
        suppliers: formattedSuppliers,
      };

      const productResponse = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/product/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedFormData),
        }
      );

      if (productResponse.ok) {
        notifySuccess("Le produit à bien été mise à jour !");
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

      if (response.ok) {
        notifySuccess("Ordre des fournisseurs mis à jour avec succès !");
      } else {
        notifyError(
          "Erreur lors de la mise à jour de l'ordre des fournisseurs !"
        );
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour", error);
      notifyError("Erreur lors de la mise à jour de l'ordre des fournisseurs");
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
      console.log(data.data);
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

  console.log(product);
  console.log(selectedSupplier);
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
          <div className="mt-1 px-6">
            {selectedSupplierIndex === 0 && (
              <h6 className="text-[#3B71CA] font-[600] text-[13px] italic">
                Fournisseur Principal
              </h6>
            )}
            <div className="flex flex-col gap-4 mt-3">
              <p>
                <span className="font-[700] text-gray-700">
                  Raison Sociale :{" "}
                </span>
                {selectedSupplier.company_name}
              </p>
              <p>
                <span className="font-[700] text-gray-700">
                  Référence Produit :{" "}
                </span>
                {selectedSupplier.supplier_ref}
              </p>
              <p>
                <span className="font-[700] text-gray-700">PCB : </span>
                {selectedSupplier.pcb}
              </p>
              <p>
                <span className="font-[700] text-gray-700">
                  Catégorie Dounière :{" "}
                </span>
                {selectedSupplier.custom_cat ? selectedSupplier.custom_cat : ""}
              </p>
              <p>
                <span className="font-[700] text-gray-700">Origine : </span>
                {selectedSupplier.made_in}
              </p>
              {selectedSupplierIndex !== 0 && isModify && (
                <div className="mt-4 flex items-center gap-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      onChange={handleCheckboxChange}
                      className="form-checkbox"
                      checked={isCheckboxChecked}
                    />
                    <span className="text-sm text-gray-600">
                      Passer en fournisseur principal
                    </span>
                  </label>
                  {isCheckboxChecked && (
                    <Button size="small" blue onClick={handleSetAsMainSupplier}>
                      Valider
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
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
                    size="small"
                    type="button"
                    cancel
                    onClick={(e) => {
                      e.preventDefault();
                      setIsModalOpenConfirm(true);
                    }}
                  >
                    {product?.status === "A"
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
                  <Button size="small" blue>
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
                            Nom d'appel :
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
                      <div className="relative flex flex-col gap-3">
                        <div className="mt-3 flex flex-col gap-2">
                          {selectedSuppliers && selectedSuppliers.length > 0 ? (
                            selectedSuppliers.map((supplier, index) => (
                              <div
                                key={index}
                                className={`text-center rounded-md cursor-pointer hover:brightness-125 shadow-md ${
                                  index === 0 ? "bg-[#3B71CA]" : "bg-slate-400"
                                }`}
                                onClick={() =>
                                  handleSupplierClick(supplier, index)
                                }
                              >
                                <span className="text-[20px] text-white font-bold capitalize">
                                  {supplier.label}
                                </span>
                              </div>
                            ))
                          ) : (
                            <p>Aucun fournisseur pour cette référence</p>
                          )}
                        </div>
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
                    </FormSection>
                  </div>
                  {/* Caractéristiques produit */}
                  <div className="w-1/4">
                    <FormSection title="Caractéristiques Produit">
                      <div className="mt-3">
                        <div className="grid grid-cols-12 gap-2 py-2">
                          <span className="col-span-6 font-[700] text-slate-500 text-[13px]">
                            Type :
                          </span>
                          {!isModify ? (
                            <span className="col-span-6 text-gray-600 whitespace-nowrap overflow-ellipsis overflow-hidden text-[14px] capitalize">
                              {product.type ? product.type : "Marchandise"}
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
                          <span className="col-span-6 font-[700] text-slate-500 text-[13px]">
                            Dimensions :
                          </span>
                          <span className="col-span-6 text-gray-600 whitespace-nowrap overflow-ellipsis overflow-hidden text-[14px] capitalize">
                            {product.dimension_types &&
                            product.dimension_types.length > 0 ? (
                              product.dimension_types.join(" / ")
                            ) : (
                              <CircleSlash2 size={15} />
                            )}
                          </span>
                        </div>
                        <div className="grid grid-cols-12 gap-2 py-2">
                          <span className="col-span-6 font-[700] text-slate-500 text-[13px]">
                            Collection :
                          </span>
                          {!isModify ? (
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
                          ) : (
                            <CreatableSelect
                              className="col-span-6"
                              value={selectedOptionCollection}
                              onChange={handleChangeCollection}
                              onInputChange={handleInputChangeCollection}
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
                      </div>
                    </FormSection>
                  </div>
                  {/* Prix produit */}
                  <div className="w-1/4">
                    <FormSection title="Prix">
                      <div className="mt-3">
                        <div className="grid grid-cols-12 gap-2 py-2">
                          <span className="col-span-6 font-[700] text-slate-500 text-[13px]">
                            Prix Achat (PAEU) :
                          </span>
                          {!isModify ? (
                            <span className="col-span-6 text-gray-600 whitespace-nowrap overflow-ellipsis overflow-hidden text-[14px]">
                              {product.peau} €
                            </span>
                          ) : (
                            <input
                              type="text"
                              id="peau"
                              onChange={handlePriceChange}
                              value={formData.peau}
                              className="col-span-6 border rounded-md p-1 bg-white focus:outline-none focus:border-blue-500"
                            />
                          )}
                        </div>
                        <div className="grid grid-cols-12 gap-2 py-2">
                          <span className="col-span-6 font-[700] text-slate-500 text-[13px]">
                            Prix Vente (TBEU/PB) :
                          </span>
                          {!isModify ? (
                            <span className="col-span-6 text-gray-600 whitespace-nowrap overflow-ellipsis overflow-hidden text-[14px]">
                              {product.tbeu_pb} €
                            </span>
                          ) : (
                            <input
                              type="text"
                              id="tbeu_pb"
                              onChange={handlePriceChange}
                              value={formData.tbeu_pb}
                              className="col-span-6 border rounded-md p-1 bg-white focus:outline-none focus:border-blue-500"
                            />
                          )}
                        </div>
                        <div className="grid grid-cols-12 gap-2 py-2">
                          <span className="col-span-6 font-[700] text-slate-500 text-[13px]">
                            Prix Modulé (TBEU/PMEU) :
                          </span>
                          {!isModify ? (
                            <span className="col-span-6 text-gray-600 whitespace-nowrap overflow-ellipsis overflow-hidden text-[14px]">
                              {product.tbeu_pmeu} €
                            </span>
                          ) : (
                            <input
                              type="text"
                              id="tbeu_pmeu"
                              onChange={handlePriceChange}
                              value={formData.tbeu_pmeu}
                              className="col-span-6 border rounded-md p-1 bg-white focus:outline-none focus:border-blue-500"
                            />
                          )}
                        </div>
                      </div>
                    </FormSection>
                  </div>
                  {/* Prix produit */}
                  <div className="w-1/4">
                    <FormSection title="Cotes et poids">
                      <div className="flex gap-3">
                        <div>
                          <div className="grid grid-cols-12 gap-2 py-2">
                            <span className="col-span-6 font-[700] text-slate-500 text-[13px]">
                              Hauteur
                            </span>
                            {!isModify ? (
                              <span className="col-span-6 text-gray-600 whitespace-nowrap overflow-ellipsis overflow-hidden text-[14px]">
                                {product?.height}
                                {product?.size_unit || "m"}
                              </span>
                            ) : (
                              <input
                                type="text"
                                id="height"
                                onChange={handleChange}
                                value={formData.height}
                                className="col-span-6 border rounded-md p-1 bg-white focus:outline-none focus:border-blue-500"
                              />
                            )}
                          </div>
                          <div className="grid grid-cols-12 gap-2 py-2">
                            <span className="col-span-6 font-[700] text-slate-500 text-[13px] whitespace-nowrap">
                              Longueur
                            </span>
                            {!isModify ? (
                              <span className="col-span-6 text-gray-600 whitespace-nowrap overflow-ellipsis overflow-hidden text-[14px]">
                                {product?.length}
                                {product?.size_unit || "m"}
                              </span>
                            ) : (
                              <input
                                type="text"
                                id="length"
                                onChange={handleChange}
                                value={formData.length}
                                className="col-span-6 border rounded-md p-1 bg-white focus:outline-none focus:border-blue-500"
                              />
                            )}
                          </div>
                          <div className="grid grid-cols-12 gap-2 py-2">
                            <span className="col-span-6 font-[700] text-slate-500 text-[13px]">
                              Largeur
                            </span>
                            {!isModify ? (
                              <span className="col-span-6 text-gray-600 whitespace-nowrap overflow-ellipsis overflow-hidden text-[14px]">
                                {product?.width}
                                {product?.size_unit || "m"}
                              </span>
                            ) : (
                              <input
                                type="text"
                                id="width"
                                onChange={handleChange}
                                value={formData.width}
                                className="col-span-6 border rounded-md p-1 bg-white focus:outline-none focus:border-blue-500"
                              />
                            )}
                          </div>
                        </div>
                        <div>
                          <div className="grid grid-cols-12 gap-2 py-2">
                            <span className="col-span-6 font-[700] text-slate-500 text-[13px]">
                              Poids Brut
                            </span>
                            {!isModify ? (
                              <span className="col-span-6 text-gray-600 whitespace-nowrap overflow-ellipsis overflow-hidden text-[14px]">
                                {product?.gross_weight}
                                {product?.weigth_unit || "kg"}
                              </span>
                            ) : (
                              <input
                                type="text"
                                id="gross_weight"
                                onChange={handleChange}
                                value={formData.gross_weight}
                                className="col-span-6 border rounded-md p-1 bg-white focus:outline-none focus:border-blue-500"
                              />
                            )}
                          </div>
                          <div className="grid grid-cols-12 gap-2 py-2">
                            <span className="col-span-6 font-[700] text-slate-500 text-[13px]">
                              Poids Net
                            </span>
                            {!isModify ? (
                              <span className="col-span-6 text-gray-600 whitespace-nowrap overflow-ellipsis overflow-hidden text-[14px]">
                                {product?.net_weight}
                                {product?.weigth_unit || "kg"}
                              </span>
                            ) : (
                              <input
                                type="text"
                                id="net_weight"
                                onChange={handleChange}
                                value={formData.net_weight}
                                className="col-span-6 border rounded-md p-1 bg-white focus:outline-none focus:border-blue-500"
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
                    <FormSection title="Champs additionnels">
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

                            return (
                              <div
                                key={index}
                                className="grid grid-cols-12 gap-2 py-2"
                              >
                                <span className="col-span-3 font-[700] text-slate-500 text-[13px]">
                                  {field.label} :
                                </span>

                                <span className="col-span-3 text-gray-600 whitespace-nowrap overflow-ellipsis overflow-hidden text-[14px]">
                                  {supplierField?.value || "Non renseigné"}
                                </span>
                              </div>
                            );
                          })}
                      </div>
                    </FormSection>
                  )}
                  {isModify && (
                    <FormSection title="Champs additionnels">
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
                  isModify={isModify}
                  isEditable={true}
                />
              </div>
            )}
            {page === "uvc" && (
              <div
                className={`border-t-[1px] border-gray-300 px-5 py-2 ${
                  isFullScreen
                    ? "fixed right-0 top-0 w-full h-screen z-[9999] bg-gray-100"
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
                {onglet === "infos" && product && (
                  <UVCInfosTable
                    reference={product?.reference}
                    uvcDimension={formData.uvc_ids}
                    brandLabel={product.brand_ids[0]?.label || ""}
                  />
                )}
                {onglet === "price" && product && (
                  <UVCPriceTable
                    reference={product?.reference}
                    uvcPrices={formData.uvc_ids}
                    globalPrices={{
                      peau: formData.peau,
                      tbeu_pb: formData.tbeu_pb,
                      tbeu_pmeu: formData.tbeu_pmeu,
                    }}
                  />
                )}
                {onglet === "supplier" && product && (
                  <UVCSupplierTable
                    reference={product?.reference}
                    uvcDimension={formData.uvc_ids}
                    supplierLabel={
                      product.suppliers[0].supplier_id.company_name || ""
                    }
                  />
                )}
                {onglet === "weight" && product && (
                  <UVCMeasureTable
                    reference={product?.reference}
                    uvcMeasure={formData.uvc_ids}
                    Measure={{
                      height: product.height || "0",
                      long: product.length || "0",
                      width: product.width || "0",
                      weight_brut: product.gross_weight || "0",
                      weight_net: product.net_weight || "0",
                    }}
                    size_unit={product.size_unit || "m"}
                    weight_unit={product.weigth_unit || "kg"}
                  />
                )}
                {onglet === "ean" && product && (
                  <UVCEanTable
                    reference={product?.reference}
                    uvcDimension={formData.uvc_ids}
                  />
                )}
              </div>
            )}
          </div>
          {isModify && (
            <div>
              {!isLoading ? (
                <div className="mt-[50px] flex gap-2">
                  <button
                    className="w-full bg-[#9FA6B2] text-white py-2 rounded-md font-[600] hover:bg-[#bac3d4] hover:text-white shadow-md"
                    type="button"
                    onClick={() => setIsModify(false)}
                  >
                    Annuler la modification
                  </button>
                  <button
                    className="w-full bg-[#3B71CA] text-white py-2 rounded-md font-[600] hover:bg-sky-500 shadow-md"
                    type="submit"
                  >
                    Valider les modifications
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
            </div>
          )}
        </form>
      </section>
    </>
  );
}
