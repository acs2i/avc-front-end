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

interface FormData {
  creator_id: any;
  description_ref: string;
  reference: string;
  designation_longue: string;
  designation_courte: string;
  call_name: string;
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
  initialSizes: any[];
  initialColors: any[];
  initialGrid: any[];
}

export default function DraftUpdatePage() {
  const token = useSelector((state: any) => state.auth.token);
  const location = useLocation();
  const [isSend, setisSned] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState("dimension");
  const navigate = useNavigate();
  const [draft, setDraft] = useState<Draft>();
  const [isDetailsFetched, setIsDetailsFetched] = useState(false); // Nouveau drapeau pour éviter la boucle infinie
  const [isModify, setIsModify] = useState(false);
  const { id } = useParams();
  const [product, setProduct] = useState<Draft>();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [desactivationInput, setDesactivationInput] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenConfirm, setIsModalOpenConfirm] = useState(false);
  const [onglet, setOnglet] = useState("infos");
  const [formData, setFormData] = useState<FormData>({
    creator_id: "",
    description_ref: "",
    reference: "",
    designation_longue: "",
    designation_courte: "",
    call_name: "",
    supplier_name: "",
    supplier_ref: "",
    family: [],
    subFamily: [],
    dimension_type: "",
    brand: "",
    ref_collection: "",
    description_brouillon: "",
    dimension: [],
    composition: "",
    initialSizes: [],
    initialColors: [],
    initialGrid: [],
  });

  const [sizes, setSizes] = useState<string[]>(formData.initialSizes);
  const [colors, setColors] = useState<string[]>(formData.initialColors);
  const [uvcGrid, setUvcGrid] = useState<boolean[][]>(formData.initialGrid);

  useEffect(() => {
    fetchDraft();
  }, []);

  useEffect(() => {
    if (draft && !isDetailsFetched) {
      fetchDetails();
      setIsDetailsFetched(true);
    }
  }, [draft]);

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

  const handleSend = async () => {
    if (!draft) return;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/draft/draft/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: 1 }),
        }
      );

      if (response.ok) {
        const updatedDraft = await response.json();
        setDraft(updatedDraft);
        navigate(-1);
      } else {
        setError("Erreur lors de la transmission du brouillon");
      }
    } catch (error) {
      console.error("Erreur lors de la requête", error);
      setError("Erreur lors de la transmission du brouillon");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/draft/draft/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        navigate(-1);
      } else {
        setError("Erreur lors de la suppresion du brouillon");
      }
    } catch (error) {
      setError("Erreur lors de la suppression du brouillon");
    }
  };

  const handleInputChange = (event: any) => {
    setDesactivationInput(event.target.value);
  };

  const toggleFullScreen = () => {
    setIsFullScreen((prevState) => !prevState);
  };

  const handleGridChange = (grid: string[][]) => {
    const flattenedGrid = grid.flat();
    setFormData((prevFormData) => ({
      ...prevFormData,
      dimension: flattenedGrid,
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
        suppliers: supplierDetails.filter(Boolean) as SupplierDetail[],
      }));
    } catch (error) {
      console.error("Erreur lors de la récupération des détails", error);
    }
  };

  return (
    <>
      <section className="w-full bg-slate-50 p-8 max-w-[2000px] mx-auto">
        <Modal
          show={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          onClose={() => setIsModalOpen(false)}
          header="Fournisseurs"
        >
          <SupplierComponent />
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
        <form>
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
            {draft && (
              <>
                {/* Indentification */}
                <div className="flex flex-col-reverse lg:flex-row gap-7 mt-[50px] items-stretch">
                  <div className="w-full lg:w-[60%]">
                    <div
                      className={`relative flex flex-col gap-3 bg-white border border-slate-200 p-4 ${
                        isModify ? "h-[420px]" : "h-[380px]"
                      } rounded-md`}
                    >
                      <div className="absolute top-[-15px] px-1 bg-gradient-to-b from-slate-50 to-white">
                        <h4 className="font-[900] text-[15px] text-gray-600">
                          Identification
                        </h4>
                      </div>
                      <div className="relative flex-1">
                        <div className="grid grid-cols-4 gap-2 py-2">
                          <span className="col-span-1 font-[700] text-slate-500 text-[13px]">
                            Référence :
                          </span>
                          <span className="col-span-3 text-gray-600 text-[14px]">
                            {draft.reference}
                          </span>
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
                              className="w-[300px] border rounded-md p-1 bg-gray-100 focus:outline-none focus:border-blue-500"
                              value={draft.long_label}
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
                              className="w-[300px] border rounded-md p-1 bg-gray-100 focus:outline-none focus:border-blue-500"
                              value={draft.short_label}
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
                            <div className="col-span-3">
                              {draft.brand_ids && draft.brand_ids.length > 0
                                ? draft.brand_ids.map((brand, index) => (
                                    <input
                                      key={index}
                                      type="text"
                                      className="w-[300px] border rounded-md p-1 bg-gray-100 focus:outline-none focus:border-blue-500 mb-2"
                                      value=""
                                    />
                                  ))
                                : "N/A"}
                            </div>
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
                            <input
                              type="text"
                              className="w-[300px] border rounded-md p-1 bg-gray-100 focus:outline-none focus:border-blue-500"
                              value={
                                draft.tag_details &&
                                draft.tag_details.length > 0
                                  ? draft.tag_details[0].name
                                  : "N/A"
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
                              {draft.tag_details &&
                              draft.tag_details.length > 0 ? (
                                `${draft.tag_details[1].code} - ${draft.tag_details[1].name}`
                              ) : (
                                <CircleSlash2 size={15} />
                              )}
                            </span>
                          ) : (
                            <input
                              type="text"
                              className="w-[300px] border rounded-md p-1 bg-gray-100 focus:outline-none focus:border-blue-500"
                              value={
                                draft.tag_details &&
                                draft.tag_details.length > 0
                                  ? draft.tag_details[1].name
                                  : "N/A"
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
                              {draft.tag_details &&
                              draft.tag_details.length > 0 ? (
                                `${draft.tag_details[2].code} - ${draft.tag_details[2].name}`
                              ) : (
                                <CircleSlash2 size={15} />
                              )}
                            </span>
                          ) : (
                            <input
                              type="text"
                              className="w-[300px] border rounded-md p-1 bg-gray-100 focus:outline-none focus:border-blue-500"
                              value={
                                draft.tag_details &&
                                draft.tag_details.length > 0
                                  ? draft.tag_details[2].name
                                  : "N/A"
                              }
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-[480px] bg-white border border-slate-200 rounded-md">
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
                  </div>
                </div>

                <div className="flex gap-7 mt-[50px] items-stretch">
                  {/* Fournisseur */}
                  <div className="w-1/3 ">
                    <div className="relative flex flex-col gap-3 bg-white">
                      <div className="absolute top-[-12px] left-[15px] px-1 bg-gradient-to-b from-slate-50 to-white z-10">
                        <h4 className="font-[900] text-[15px] text-gray-600">
                          Fournisseur principal
                        </h4>
                      </div>
                      <div
                        className={`relative border border-slate-200 rounded-md p-3 ${
                          isModify ? "h-[320px]" : "h-[250px]"
                        }`}
                      >
                        {!isModify && (
                          <div
                            className="absolute right-[10px] cursor-pointer text-gray-600"
                            onClick={() => setIsModalOpen(true)}
                          >
                            <Pen size={17} />
                          </div>
                        )}
                        <div className="grid grid-cols-12 gap-2 py-2">
                          <span className="col-span-6 font-[700] text-slate-500 text-[13px]">
                            Code :
                          </span>
                          {!isModify ? (
                            <span className="col-span-6 text-gray-600 whitespace-nowrap overflow-ellipsis overflow-hidden text-[14px]">
                              {draft?.suppliers &&
                              draft.suppliers.length > 0 ? (
                                draft.suppliers[0].code
                              ) : (
                                <CircleSlash2 size={15} />
                              )}
                            </span>
                          ) : (
                            <input
                              type="text"
                              className="col-span-6 border rounded-md p-1 bg-gray-100 focus:outline-none focus:border-blue-500"
                              value=""
                            />
                          )}
                        </div>

                        <div className="grid grid-cols-12 gap-2 py-2">
                          <span className="col-span-6 font-[700] text-slate-500 text-[13px]">
                            Raison sociale :
                          </span>
                          {!isModify ? (
                            <span className="col-span-6 text-gray-600 whitespace-nowrap overflow-ellipsis overflow-hidden text-[14px]">
                              {draft?.suppliers &&
                              draft.suppliers.length > 0 ? (
                                draft.suppliers[0].company_name
                              ) : (
                                <CircleSlash2 size={15} />
                              )}
                            </span>
                          ) : (
                            <input
                              type="text"
                              className="col-span-6 border rounded-md p-1 bg-gray-100 focus:outline-none focus:border-blue-500"
                              value=""
                            />
                          )}
                        </div>

                        <div className="grid grid-cols-12 gap-2 py-2">
                          <span className="col-span-6 font-[700] text-slate-500 text-[13px]">
                            Ref. produit :
                          </span>
                          {!isModify ? (
                            <span className="col-span-6 text-gray-600 whitespace-nowrap overflow-ellipsis overflow-hidden text-[14px]">
                              {draft ? (
                                draft.reference
                              ) : (
                                <CircleSlash2 size={15} />
                              )}
                            </span>
                          ) : (
                            <input
                              type="text"
                              className="col-span-6 border rounded-md p-1 bg-gray-100 focus:outline-none focus:border-blue-500"
                            />
                          )}
                        </div>
                        <div className="grid grid-cols-12 gap-2 py-2">
                          <span className="col-span-6 font-[700] text-slate-500 text-[13px]">
                            Multiple achat :
                          </span>
                          {!isModify ? (
                            <span className="col-span-6 text-gray-600 whitespace-nowrap overflow-ellipsis overflow-hidden text-[14px]">
                              <CircleSlash2 size={15} />
                            </span>
                          ) : (
                            <input
                              type="text"
                              className="col-span-6 border rounded-md p-1 bg-gray-100 focus:outline-none focus:border-blue-500"
                            />
                          )}
                        </div>
                        <div className="grid grid-cols-12 gap-2 py-2">
                          <span className="col-span-6 font-[700] text-slate-500 text-[13px]">
                            Origine :
                          </span>
                          {!isModify ? (
                            <span className="col-span-6 text-gray-600 whitespace-nowrap overflow-ellipsis overflow-hidden text-[14px]">
                              <CircleSlash2 size={15} />
                            </span>
                          ) : (
                            <input
                              type="text"
                              className="col-span-6 border rounded-md p-1 bg-gray-100 focus:outline-none focus:border-blue-500"
                            />
                          )}
                        </div>
                        <div className="grid grid-cols-12 gap-2 py-2">
                          <span className="col-span-6 font-[700] text-slate-500 text-[13px]">
                            Catégorie douanière :
                          </span>
                          {!isModify ? (
                            <span className="col-span-6 text-gray-600 whitespace-nowrap overflow-ellipsis overflow-hidden text-[14px]">
                              <CircleSlash2 size={15} />
                            </span>
                          ) : (
                            <input
                              type="text"
                              className="col-span-6 border rounded-md p-1 bg-gray-100 focus:outline-none focus:border-blue-500"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Caractéristiques produit */}
                  <div className="w-1/3">
                    <div className="relative flex flex-col gap-3 bg-white">
                      <div className="absolute top-[-12px] left-[15px] px-1 bg-gradient-to-b from-slate-50 to-white z-10">
                        <h4 className="font-[900] text-[15px] text-gray-600">
                          Caractéristiques produit
                        </h4>
                      </div>
                      <div
                        className={`relative border border-slate-200 p-3 rounded-md ${
                          isModify ? "h-[320px]" : "h-[250px]"
                        }`}
                      >
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
                            <span className="col-span-3 text-gray-600 text-[14px]">
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
                            <input
                              type="text"
                              className="w-[300px] border rounded-md p-1 bg-gray-100 focus:outline-none focus:border-blue-500"
                              value={
                                draft.tag_details &&
                                draft.tag_details.length > 0
                                  ? draft.tag_details[1].name
                                  : "N/A"
                              }
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Prix produit */}
                  <div className="w-1/3">
                    <div className="relative flex flex-col gap-3 bg-white">
                      <div className="absolute top-[-12px] left-[15px] px-1 bg-gradient-to-b from-slate-50 to-white z-10">
                        <h4 className="font-[900] text-[15px] text-gray-600">
                          Prix
                        </h4>
                      </div>
                      <div
                        className={`relative border border-slate-200 p-3 ${
                          isModify ? "h-[320px]" : "h-[250px]"
                        }`}
                      >
                        <div className="grid grid-cols-12 gap-2 py-2">
                          <span className="col-span-6 font-[700] text-slate-500 text-[13px]">
                            Prix Achat (PAEU) :
                          </span>
                          {!isModify ? (
                            <span className="col-span-6 text-gray-600 whitespace-nowrap overflow-ellipsis overflow-hidden text-[14px]">
                              100,20
                            </span>
                          ) : (
                            <input
                              type="text"
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
                              100,20
                            </span>
                          ) : (
                            <input
                              type="text"
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
                              100,20
                            </span>
                          ) : (
                            <input
                              type="text"
                              className="col-span-6 border rounded-md p-1 bg-gray-100 focus:outline-none focus:border-blue-500"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Partie onglets */}
          <div className="mt-[30px] flex mb-[500px]">
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
                    ? "fixed right-0 top-0 w-full z-[9999] bg-gray-100"
                    : "w-[70%]"
                }`}
              >
                <UVCGrid
                  onDimensionsChange={handleGridChange}
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
                )}
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
        </form>
      </section>
    </>
  );
}
