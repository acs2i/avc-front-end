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
} from "lucide-react";
import { LINKS_Product, LINKS_UVC } from "../../utils/index";
import UVCInfosTable from "../../components/UVCInfosTable";
import UVCPriceTable from "../../components/UVCPricesTable";
import UVCSupplierTable from "../../components/UVCSupplierTable";
import SupplierComponent from "../../components/SupplierComponent";
import UVCGrid from "../../components/UVCGrid";
import FormSection from "../../components/Formulaires/FormSection";
import CreatableSelect from "react-select/creatable";
import { SingleValue } from "react-select";
import Input from "../../components/FormElements/Input";
import useNotify from "../../utils/hooks/useToast";
import { CircularProgress } from "@mui/material";

interface TagDetail {
  _id: string;
  name: string;
  code: string;
}

interface BrandDetail {
  _id: string;
  label: string;
}

interface CollectionDetail {
  _id: string;
  label: string;
}

interface SupplierDetail {
  index: number;
  code: string;
  company_name: string;
  supplier_id: string;
  supplier_ref: string;
  pcb: string;
  custom_cat: string;
  made_in: string;
}

interface Draft {
  _id: string;
  creator_id: any;
  reference: string;
  name: string;
  short_label: string;
  long_label: string;
  type: string;
  tag_ids: string[];
  brand_ids: string[];
  collection_ids: string[];
  peau: number;
  tbeu_pb: number;
  tbeu_pmeu: number;
  imgPath: string;
  status: string;
  additional_fields: any;
  suppliers: SupplierDetail[];
  dimension_types: string[];
  uvc?: any[];
  tag_details?: TagDetail[];
  brand_details?: BrandDetail[];
  collection_details?: CollectionDetail[];
}

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
  _id: string;
  name: string;
  value: string;
  label: string;
};

type BrandOption = {
  _id: string;
  value: string;
  label: string;
};

type CollectionOption = {
  _id: string;
  value: string;
  label: string;
};

export default function DraftUpdatePage() {
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
  const { id } = useParams();
  const [product, setProduct] = useState<Draft>();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [desactivationInput, setDesactivationInput] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenConfirm, setIsModalOpenConfirm] = useState(false);
  const [onglet, setOnglet] = useState("infos");
  const [formData, setFormData] = useState<FormData>({
    creator_id: creatorId._id,
    reference: draft?.reference || "",
    name: draft?.name || "",
    short_label: draft?.short_label || "",
    long_label: draft?.long_label || "",
    type: "Marchandise",
    tag_ids: [],
    suppliers: draft?.suppliers || [],
    dimension_types: draft?.dimension_types?.[0] || "Couleur/Taille",
    brand_ids: [],
    collection_ids: [],
    peau: draft?.peau || 0,
    tbeu_pb: draft?.tbeu_pb || 0,
    tbeu_pmeu: draft?.tbeu_pmeu || 0,
    imgPath: "",
    status: "A",
    additional_fields: "",
    uvc: draft?.uvc || [],
    initialSizes: ["000"],
    initialColors: ["000"],
    initialGrid: [[true]],
  });
  const [selectedOptionBrand, setSelectedOptionBrand] =
    useState<SingleValue<BrandOption> | null>(null);
  const [optionsBrand, setOptionsBrand] = useState<BrandOption[]>([]);
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
  const [inputValueSubSubFamily, setInputValueSubSubFamily] = useState("");
  const [inputValueFamily, setInputValueFamily] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState<
    SupplierDetail
  >();
  const [modalSupplierisOpen, setModalSupplierisOpen] = useState(false);
  const [inputSubValueFamily, setInputSubValueFamily] = useState("");
  const [selectedOptionCollection, setSelectedOptionCollection] =
    useState<SingleValue<CollectionOption> | null>(null);
  const [optionsCollection, setOptionsCollection] = useState<
    CollectionOption[]
  >([]);
  const [inputValueCollection, setInputValueCollection] = useState("");

  const [sizes, setSizes] = useState<string[]>(formData.initialSizes);
  const [colors, setColors] = useState<string[]>(formData.initialColors);
  const [uvcGrid, setUvcGrid] = useState<boolean[][]>(formData.initialGrid);

  useEffect(() => {
    fetchDraft();
  }, []);

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
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    }
  };

  const fetchDetails = async () => {
    if (!draft) return;

    try {
      const tagDetails = await Promise.all(
        draft.tag_ids.map((tagId) => fetchTagDetails(tagId))
      );
      const brandDetails = await Promise.all(
        draft.brand_ids.map((brandId) => fetchBrandDetails(brandId))
      );
      const collectionDetails = await Promise.all(
        draft.collection_ids.map((collectionId) =>
          fetchCollectionDetails(collectionId)
        )
      );
      const supplierDetails = await Promise.all(
        draft.suppliers.map((supplier) =>
          fetchSupplierDetails(supplier.supplier_id)
        )
      );

      setDraft((prevDraft) => ({
        ...prevDraft!,
        tag_details: tagDetails.filter(Boolean) as TagDetail[],
        brand_details: brandDetails.filter(Boolean) as BrandDetail[],
        collection_details: collectionDetails.filter(
          Boolean
        ) as CollectionDetail[],
        suppliers: draft.suppliers.map((supplier, index) => ({
          ...supplier,
          ...supplierDetails[index],
        })),
      }));
    } catch (error) {
      console.error("Erreur lors de la récupération des détails", error);
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
        if (dimension) {
          const [color, size] = dimension.split(",");
          updatedUVCs.push({
            code: `${color}/${size}`,
            dimensions: [`${color}/${size}`],
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
          });
        }
      });
    });

    setFormData((prevFormData) => ({
      ...prevFormData,
      uvc: updatedUVCs,
    }));
  };
  const fetchTagDetails = async (tagId: any) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/tag/${tagId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(
        "Erreur lors de la requête pour récupérer les détails du tag",
        error
      );
      return null;
    }
  };

  const fetchBrandDetails = async (brandId: any) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/brand/${brandId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(
        "Erreur lors de la requête pour récupérer les détails de la marque",
        error
      );
      return null;
    }
  };

  const fetchCollectionDetails = async (collectionId: any) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/collection/${collectionId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(
        "Erreur lors de la requête pour récupérer les détails de la collection",
        error
      );
      return null;
    }
  };

  const fetchSupplierDetails = async (supplierId: string) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/supplier/${supplierId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(
        "Erreur lors de la requête pour récupérer les détails du fournisseur",
        error
      );
      return null;
    }
  };

  useEffect(() => {
    if (draft && !isDetailsFetched) {
      fetchDetails();
      setIsDetailsFetched(true);
    }
  }, [draft, isDetailsFetched, refreshDetails]);

  useEffect(() => {
    if (draft) {
      setFormData({
        creator_id: draft.creator_id,
        reference: draft.reference || "",
        name: draft.name || "",
        short_label: draft.short_label || "",
        long_label: draft.long_label || "",
        type: draft.type || "Marchandise",
        tag_ids: draft.tag_ids || [],
        suppliers: draft.suppliers || [],
        dimension_types: draft.dimension_types[0] || "Couleur/Taille",
        brand_ids: draft.brand_ids || [],
        collection_ids: draft.collection_ids || [],
        peau: draft.peau || 0,
        tbeu_pb: draft.tbeu_pb || 0,
        tbeu_pmeu: draft.tbeu_pmeu || 0,
        imgPath: draft.imgPath || "",
        status: draft.status || "A",
        additional_fields: draft.additional_fields || {},
        uvc: draft.uvc || [],
        initialSizes: formData.initialSizes,
        initialColors: formData.initialColors,
        initialGrid: formData.initialGrid,
      });
    }
  }, [draft]);

  useEffect(() => {
    if (draft && draft.uvc) {
      // Extraire les tailles et les couleurs
      const extractedColors = draft?.uvc
        ? [
            ...new Set(
              draft.uvc.map((uvc) => uvc.dimensions?.[0]?.split("/")[0])
            ),
          ]
        : [];

      const extractedSizes = draft?.uvc
        ? [
            ...new Set(
              draft.uvc.map((uvc) => uvc.dimensions?.[0]?.split("/")[1])
            ),
          ]
        : [];

      // Construire la grille initiale
      const initialGrid = extractedColors.map((color) =>
        extractedSizes.map(
          (size) =>
            draft?.uvc?.some((uvc) => {
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

  // Fonction de mise a jour du brouillon
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
        setTimeout(() => {
          notifySuccess("Brouillon modifié avec succès !");
          setIsLoading(false);
          window.location.reload();
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

  const updateDraftStatus = async (newStatus: string) => {
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
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (response.ok) {
        setTimeout(() => {
          notifySuccess("Brouiilon validée");
          setIsLoading(false);
          navigate("/draft");
          window.location.reload();
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

  console.log(formData);

  return (
    <>
      <Modal
        show={modalSupplierisOpen}
        onCancel={() => setModalSupplierisOpen(false)}
        onClose={() => setModalSupplierisOpen(false)}
        header="Fournisseur"
      >
        <SupplierComponent supplier={selectedSupplier} index={selectedSupplier?.index ?? 0}/> 
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
      <section className="w-full bg-slate-50 p-8 max-w-[2000px] mx-auto">
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
                  {draft?.status === "A" ? (
                    <Button
                      size="small"
                      type="button"
                      green
                      onClick={() => {
                        updateDraftStatus("I");
                      }}
                    >
                      Valider le brouillon
                    </Button>
                  ) : (
                    <Button size="small" type="button" green>
                      Enregistrer la référence
                    </Button>
                  )}
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
                      size={`${!isModify ? "h-[400px]" : "h-[450px]"}`}
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
                                className="w-[300px] border rounded-md p-1 bg-gray-100 focus:outline-none focus:border-blue-500"
                              />
                            )}
                          </div>
                          <div className="grid grid-cols-4 gap-2 py-2">
                            <span className="col-span-1 font-[700] text-slate-500 text-[13px]">
                              Nom d'appel :
                            </span>
                            {!isModify ? (
                              <span className="col-span-3 text-gray-600 whitespace-nowrap text-[14px]">
                                {draft.name ? (
                                  draft.name
                                ) : (
                                  <CircleSlash2 size={15} />
                                )}
                              </span>
                            ) : (
                              <input
                                type="text"
                                id="name"
                                onChange={handleChange}
                                placeholder={draft?.name}
                                value={formData.name}
                                className="w-[300px] border rounded-md p-1 bg-gray-100 focus:outline-none focus:border-blue-500"
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
                                className="w-[300px] border rounded-md p-1 bg-gray-100 focus:outline-none focus:border-blue-500"
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
                                className="w-[300px] border rounded-md p-1 bg-gray-100 focus:outline-none focus:border-blue-500"
                              />
                            )}
                          </div>
                          <div className="grid grid-cols-4 gap-2 py-2">
                            <span className="col-span-1 font-[700] text-slate-500 text-[13px]">
                              Marque :
                            </span>
                            {!isModify ? (
                              <span className="col-span-3 text-gray-600 text-[14px]">
                                {draft.brand_details &&
                                draft.brand_details.length > 0 ? (
                                  draft.brand_details.map((brand, index) => (
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
                                {draft.tag_details &&
                                draft.tag_details.length > 0 ? (
                                  `${draft.tag_details[0].code} - ${draft.tag_details[0].name}`
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
                              />
                            )}
                          </div>

                          <div className="grid grid-cols-4 gap-2 py-2">
                            <span className="col-span-1 font-[700] text-slate-500 text-[13px]">
                              Sous-famille :
                            </span>
                            {!isModify ? (
                              <span className="col-span-3 text-gray-600 whitespace-nowrap text-[14px]">
                                {draft.tag_details &&
                                draft.tag_details.length > 0 ? (
                                  `${draft.tag_details[1].code} - ${draft.tag_details[1].name}`
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
                              />
                            )}
                          </div>

                          <div className="grid grid-cols-4 gap-2 py-2">
                            <span className="col-span-1 font-[700] text-slate-500 text-[13px]">
                              Sous-sous-famille :
                            </span>
                            {!isModify ? (
                              <span className="col-span-3 text-gray-600 whitespace-nowrap text-[14px]">
                                {draft.tag_details &&
                                draft.tag_details.length > 0 ? (
                                  `${draft.tag_details[2].code} - ${draft.tag_details[2].name}`
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
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </FormSection>
                  </div>
                  <div className="w-[480px] bg-white">
                    <FormSection
                      size={`${!isModify ? "h-[400px]" : "h-[450px]"}`}
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

                <div className="flex gap-7 mt-[50px] items-stretch">
                  {/* Fournisseur */}
                  <div className="w-1/3 ">
                    <FormSection
                      title="Fournisseur"
                      size={`${!isModify ? "h-[250px]" : "h-[400px]"}`}
                    >
                      <div className="relative flex flex-col gap-3">
                        <div className="mt-3">
                          {isModify && (
                            <div
                              className="absolute right-[10px] cursor-pointer text-gray-600"
                              onClick={() => setIsModalOpen(true)}
                            >
                              <Pen size={17} />
                            </div>
                          )}
                          <div className="flex flex-col gap-2">
                            {draft.suppliers.map((supplier, index) => (
                              <div
                                key={index}
                                className={`text-center rounded-md cursor-pointer hover:brightness-125 shadow-md ${
                                  index === 0 ? "bg-[#3B71CA]" : "bg-slate-400"
                                }`}
                                onClick={() => {
                                  setSelectedSupplier({ ...supplier, index });
                                  setModalSupplierisOpen(true);  // Ouvre la modal
                                }}
                              >
                                <span className="text-[20px] text-white font-bold">
                                  {supplier.code} - {supplier.company_name}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </FormSection>
                  </div>
                  {/* Caractéristiques produit */}
                  <div className="w-1/3">
                    <FormSection
                      title="Caractéristiques Produit"
                      size={`${!isModify ? "h-[250px]" : "h-[400px]"}`}
                    >
                      <div className="mt-3">
                        <div className="grid grid-cols-12 gap-2 py-2">
                          <span className="col-span-4 font-[700] text-slate-500 text-[13px]">
                            Type :
                          </span>
                          {!isModify ? (
                            <span className="col-span-6 text-gray-600 whitespace-nowrap overflow-ellipsis overflow-hidden text-[14px]">
                              {draft.type ? draft.type : "Marchandise"}
                            </span>
                          ) : (
                            <input
                              type="text"
                              className="col-span-6 border rounded-md p-1 bg-gray-100 focus:outline-none focus:border-blue-500"
                            />
                          )}
                        </div>
                        <div className="grid grid-cols-12 gap-2 py-2">
                          <span className="col-span-4 font-[700] text-slate-500 text-[13px]">
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
                          <span className="col-span-4 font-[700] text-slate-500 text-[13px]">
                            Collection :
                          </span>
                          {!isModify ? (
                            <span className="col-span-6 text-gray-600 text-[14px]">
                              {draft.collection_details &&
                              draft.collection_details.length > 0 ? (
                                draft.collection_details.map(
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
                              isClearable
                            />
                          )}
                        </div>
                      </div>
                    </FormSection>
                  </div>
                  {/* Prix produit */}
                  <div className="w-1/3">
                    <FormSection
                      title="Prix"
                      size={`${!isModify ? "h-[250px]" : "h-[400px]"}`}
                    >
                      <div className="mt-3">
                        <div className="grid grid-cols-12 gap-2 py-2">
                          <span className="col-span-6 font-[700] text-slate-500 text-[13px]">
                            Prix Achat (PAEU) :
                          </span>
                          {!isModify ? (
                            <span className="col-span-6 text-gray-600 whitespace-nowrap overflow-ellipsis overflow-hidden text-[14px]">
                              {draft.peau} €
                            </span>
                          ) : (
                            <input
                              type="text"
                              id="peau"
                              onChange={handlePriceChange}
                              value={formData.peau}
                              className="col-span-6 border rounded-md p-1 bg-gray-100 focus:outline-none focus:border-blue-500"
                            />
                          )}
                        </div>
                        <div className="grid grid-cols-12 gap-2 py-2">
                          <span className="col-span-6 font-[700] text-slate-500 text-[13px]">
                            Prix Vente (TBEU/PB) :
                          </span>
                          {!isModify ? (
                            <span className="col-span-6 text-gray-600 whitespace-nowrap overflow-ellipsis overflow-hidden text-[14px]">
                              {draft.tbeu_pb} €
                            </span>
                          ) : (
                            <input
                              type="text"
                              id="tbeu_pb"
                              onChange={handlePriceChange}
                              value={formData.tbeu_pb}
                              className="col-span-6 border rounded-md p-1 bg-gray-100 focus:outline-none focus:border-blue-500"
                            />
                          )}
                        </div>
                        <div className="grid grid-cols-12 gap-2 py-2">
                          <span className="col-span-6 font-[700] text-slate-500 text-[13px]">
                            Prix Modulé (TBEU/PMEU) :
                          </span>
                          {!isModify ? (
                            <span className="col-span-6 text-gray-600 whitespace-nowrap overflow-ellipsis overflow-hidden text-[14px]">
                              {draft.tbeu_pmeu} €
                            </span>
                          ) : (
                            <input
                              type="text"
                              id="tbeu_pmeu"
                              onChange={handlePriceChange}
                              value={formData.tbeu_pmeu}
                              className="col-span-6 border rounded-md p-1 bg-gray-100 focus:outline-none focus:border-blue-500"
                            />
                          )}
                        </div>
                      </div>
                    </FormSection>
                  </div>
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
                  isModify={isModify}
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
                {/* {onglet === "infos" && draft && (
                  <UVCInfosTable
                    uvcDimension={formData.dimension}
                    productReference={draft.reference || ""}
                    brandLabel=""
                  />
                )}
                {onglet === "price" && draft && (
                  <UVCPriceTable
                    uvcPrices={formData.dimension}
                    productReference={draft.reference || ""}
                  />
                )} */}
                {/* {onglet === "supplier" && draft && (
                  <UVCSupplierTable
                    uvcDimensions={formData.dimension}
                    productReference={draft.reference || ""}
                    productSupplier={draft.princ_supplier_id || ""}
                  />
                )} */}
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
