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
import FormSection from "../../components/Formulaires/FormSection";

interface Product {
  _id: string;
  creator_id: any;
  reference: string;
  name: string;
  short_label: string;
  long_label: string;
  type: string;
  tag_ids: any[];
  suppliers: any[];
  dimension_types: string[];
  uvc_ids: any[];
  brand_ids: any[];
  collection_ids: any[];
  imgPath: string;
  peau: number;
  tbeu_pb: number;
  tbeu_pmeu: number;
  status: string;
  additional_fields: any;
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

export default function SingleProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product>();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [desactivationInput, setDesactivationInput] = useState("");
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenConfirm, setIsModalOpenConfirm] = useState(false);
  const [isModify, setIsModify] = useState(false);
  const [page, setPage] = useState("dimension");
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

  const handleGridChange = (grid: string[][]) => {
    const flattenedGrid = grid.flat();
    setFormData((prevFormData) => ({
      ...prevFormData,
      dimension: flattenedGrid,
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

  return (
    <section className="w-full bg-slate-50 p-8 max-w-[2000px] mx-auto">
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
      <form>
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
          {product && (
            <>
              {/* Indentification */}
              <div className="flex flex-col-reverse lg:flex-row gap-7 mt-[50px] items-stretch">
                <div className="w-[60%]">
                  <FormSection
                    title="Identification"
                    size={`${!isModify ? "h-[400px]" : "h-[450px]"}`}
                  >
                    <div className="relative mt-3">
                      <div className="grid grid-cols-4 gap-2 py-2">
                        <span className="col-span-1 text-gray-700 font-bold">
                          Référence :
                        </span>
                        <span className="col-span-3 text-slate-500">
                          {product.reference}
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-2 py-2">
                        <span className="col-span-1 text-gray-700 font-bold">
                          Nom d'appel :
                        </span>
                        {!isModify ? (
                          <span className="col-span-3 text-slate-500 whitespace-nowrap">
                            {product.name ? (
                              product.name
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
                        <span className="col-span-1 text-gray-700 font-bold">
                          Désignation longue :
                        </span>
                        {!isModify ? (
                          <span className="col-span-3 text-slate-500 whitespace-nowrap">
                            {product.long_label ? (
                              product.long_label
                            ) : (
                              <CircleSlash2 size={15} />
                            )}
                          </span>
                        ) : (
                          <input
                            type="text"
                            className="w-[300px] border rounded-md p-1 bg-gray-100 focus:outline-none focus:border-blue-500"
                            value={product.long_label}
                          />
                        )}
                      </div>
                      <div className="grid grid-cols-4 gap-2 py-2">
                        <span className="col-span-1 font-[600] text-gray-700 font-bold">
                          Désignation courte :
                        </span>
                        {!isModify ? (
                          <span className="col-span-3 text-slate-500 whitespace-nowrap">
                            {product.short_label ? (
                              product.short_label
                            ) : (
                              <CircleSlash2 size={15} />
                            )}
                          </span>
                        ) : (
                          <input
                            type="text"
                            className="w-[300px] border rounded-md p-1 bg-gray-100 focus:outline-none focus:border-blue-500"
                            value={product.short_label}
                          />
                        )}
                      </div>
                      <div className="grid grid-cols-4 gap-2 py-2">
                        <span className="col-span-1 font-[600] text-gray-700 font-bold">
                          Marque :
                        </span>
                        {!isModify ? (
                          <span className="col-span-3 text-slate-500">
                            {product.brand_ids &&
                            product.brand_ids.length > 0 ? (
                              product.brand_ids.map((brand, index) => (
                                <div key={index}>
                                  <span>{brand.label}</span>
                                </div>
                              ))
                            ) : (
                              <CircleSlash2 size={15} />
                            )}
                          </span>
                        ) : (
                          <div className="col-span-3">
                            {product.brand_ids && product.brand_ids.length > 0
                              ? product.brand_ids.map((brand, index) => (
                                  <input
                                    key={index}
                                    type="text"
                                    className="w-[300px] border rounded-md p-1 bg-gray-100 focus:outline-none focus:border-blue-500 mb-2"
                                    value={brand.label}
                                  />
                                ))
                              : "N/A"}
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-4 gap-2 py-2">
                        <span className="col-span-1 font-[600] text-gray-700 font-bold">
                          Famille :
                        </span>
                        {!isModify ? (
                          <span className="col-span-3 text-slate-500 whitespace-nowrap">
                            {product.tag_ids && product.tag_ids.length > 0 ? (
                              `${product.tag_ids[0].code} - ${product.tag_ids[0].name}`
                            ) : (
                              <CircleSlash2 size={15} />
                            )}
                          </span>
                        ) : (
                          <input
                            type="text"
                            className="w-[300px] border rounded-md p-1 bg-gray-100 focus:outline-none focus:border-blue-500"
                            value={
                              product.tag_ids && product.tag_ids.length > 0
                                ? product.tag_ids[0].name
                                : "N/A"
                            }
                          />
                        )}
                      </div>

                      <div className="grid grid-cols-4 gap-2 py-2">
                        <span className="col-span-1 font-[600] text-gray-700 font-bold">
                          Sous-famille :
                        </span>
                        {!isModify ? (
                          <span className="col-span-3 text-slate-500 whitespace-nowrap">
                            {product.tag_ids && product.tag_ids.length > 0 ? (
                              `${product.tag_ids[1].code} - ${product.tag_ids[1].name}`
                            ) : (
                              <CircleSlash2 size={15} />
                            )}
                          </span>
                        ) : (
                          <input
                            type="text"
                            className="w-[300px] border rounded-md p-1 bg-gray-100 focus:outline-none focus:border-blue-500"
                            value={
                              product.tag_ids && product.tag_ids.length > 0
                                ? product.tag_ids[1].name
                                : "N/A"
                            }
                          />
                        )}
                      </div>

                      <div className="grid grid-cols-4 gap-2 py-2">
                        <span className="col-span-1 font-[600] text-gray-700 font-bold">
                          Sous-sous-famille :
                        </span>
                        {!isModify ? (
                          <span className="col-span-3 text-slate-500 whitespace-nowrap">
                            {product.tag_ids && product.tag_ids.length > 3 ? (
                              `${product.tag_ids[3].code} - ${product.tag_ids[3].name}`
                            ) : (
                              <CircleSlash2 size={15} />
                            )}
                          </span>
                        ) : (
                          <input
                            type="text"
                            className="w-[300px] border rounded-md p-1 bg-gray-100 focus:outline-none focus:border-blue-500"
                            value={
                              product.tag_ids && product.tag_ids.length > 3
                                ? product.tag_ids[3].name
                                : "N/A"
                            }
                            readOnly
                          />
                        )}
                      </div>
                    </div>
                  </FormSection>
                </div>

                <div className="w-[480px] bg-white">
                  <FormSection
                    size={`${!isModify ? "h-[400px]" : "h-[450px]"}`}
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

              <div className="flex gap-7 mt-[50px] items-stretch">
                {/* Fournisseur */}
                <div className="w-1/3 ">
                  <FormSection
                    title="Fournisseur"
                    size={`${!isModify ? "h-[300px]" : "h-[400px]"}`}
                  >
                    <div className="relative flex flex-col gap-3">
                      <div className="mt-3">
                        {product.suppliers && product.suppliers.length > 0 ? (
                          product.suppliers.map((supplier, index) => (
                            <div
                              key={index}
                              className={`text-center rounded-md cursor-pointer hover:brightness-125 shadow-md ${
                                index === 0 ? "bg-[#3B71CA]" : "bg-slate-400"
                              }`}
                            >
                              <span className="text-[20px] text-white font-bold capitalize">
                                {supplier.supplier_id.code} -{" "}
                                {supplier.supplier_id.company_name}
                              </span>
                            </div>
                          ))
                        ) : (
                          <p>Aucun fournisseur pour cette référence</p>
                        )}
                      </div>
                    </div>
                  </FormSection>
                </div>
                {/* Caractéristiques produit */}
                <div className="w-1/3">
                  <FormSection
                    title="Caractéristiques Produit"
                    size={`${!isModify ? "h-[300px]" : "h-[400px]"}`}
                  >
                    <div className="mt-3">
                      <div className="grid grid-cols-12 gap-2 py-2">
                        <span className="col-span-4 font-bold text-gray-700">
                          Type :
                        </span>
                        {!isModify ? (
                          <span className="col-span-6 text-slate-500 whitespace-nowrap overflow-ellipsis overflow-hidden">
                            {product.type ? product.type : "Marchandise"}
                          </span>
                        ) : (
                          <input
                            type="text"
                            className="col-span-6 border rounded-md p-1 bg-gray-100 focus:outline-none focus:border-blue-500"
                          />
                        )}
                      </div>
                      <div className="grid grid-cols-12 gap-2 py-2">
                        <span className="col-span-4 font-bold text-gray-700">
                          Dimensions :
                        </span>
                        <span className="col-span-6 text-slate-500 whitespace-nowrap overflow-ellipsis overflow-hidden capitalize">
                          {product.dimension_types &&
                          product.dimension_types.length > 0 ? (
                            product.dimension_types.join(" / ")
                          ) : (
                            <CircleSlash2 size={15} />
                          )}
                        </span>
                      </div>
                      <div className="grid grid-cols-12 gap-2 py-2">
                        <span className="col-span-4 font-bold text-gray-700">
                          Collection :
                        </span>
                        {!isModify ? (
                          <span className="col-span-6 text-slate-500 whitespace-nowrap overflow-ellipsis overflow-hidden">
                            {product.collection_ids &&
                            product.collection_ids.length > 0 ? (
                              product.collection_ids.map(
                                (collection, index) => (
                                  <div key={index}>
                                    <span>{collection.label}</span>
                                  </div>
                                )
                              )
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
                    </div>
                  </FormSection>
                </div>
                {/* Prix produit */}
                <div className="w-1/3">
                  <FormSection
                    title="Prix"
                    size={`${!isModify ? "h-[300px]" : "h-[400px]"}`}
                  >
                    <div className="mt-3">
                      <div className="grid grid-cols-12 gap-2 py-2">
                        <span className="col-span-6 font-bold text-gray-700">
                          Prix Achat (PAEU) :
                        </span>
                        {!isModify ? (
                          <span className="col-span-6 text-slate-500 whitespace-nowrap overflow-ellipsis overflow-hidden">
                            {product.peau} €
                          </span>
                        ) : (
                          <input
                            type="text"
                            className="col-span-6 border rounded-md p-1 bg-gray-100 focus:outline-none focus:border-blue-500"
                          />
                        )}
                      </div>
                      <div className="grid grid-cols-12 gap-2 py-2">
                        <span className="col-span-6 font-bold text-gray-700">
                          Prix Vente (TBEU/PB) :
                        </span>
                        {!isModify ? (
                          <span className="col-span-6 text-slate-500 whitespace-nowrap overflow-ellipsis overflow-hidden">
                            {product.tbeu_pb} €
                          </span>
                        ) : (
                          <input
                            type="text"
                            className="col-span-6 border rounded-md p-1 bg-gray-100 focus:outline-none focus:border-blue-500"
                          />
                        )}
                      </div>
                      <div className="grid grid-cols-12 gap-2 py-2">
                        <span className="col-span-6 font-bold text-gray-700">
                          Prix Modulé (TBEU/PMEU) :
                        </span>
                        {!isModify ? (
                          <span className="col-span-6 text-slate-500 whitespace-nowrap overflow-ellipsis overflow-hidden">
                            {product.tbeu_pmeu} €
                          </span>
                        ) : (
                          <input
                            type="text"
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
                  ? "fixed right-0 top-0 w-full h-screen z-[9999] bg-gray-100"
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
                        onglet === link.page ? "text-blue-500" : "text-gray-500"
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
                  uvcDimension={formData.dimension}
                  productReference={product.reference || ""}
                  brandLabel=""
                />
              )}
              {onglet === "price" && product && (
                <UVCPriceTable
                  uvcPrices={formData.dimension}
                  productReference={product.reference || ""}
                />
              )}
              {/* {onglet === "supplier" && product && (
                <UVCSupplierTable
                  uvcDimensions={formData.dimension}
                  productReference={product.reference || ""}
                  productSupplier={product.princ_supplier_id || ""}
                />
              )} */}
            </div>
          )}
        </div>
      </form>
    </section>
  );
}
