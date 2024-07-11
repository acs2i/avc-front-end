import { LINKS_Product, LINKS_UVC } from "../../utils/index";
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import useFetch from "../../utils/hooks/usefetch";
import { ChevronLeft, Maximize2, Minimize2, Pen } from "lucide-react";
import Modal from "../../components/Shared/Modal";
import { useNavigate } from "react-router-dom";
import CreatableSelect from "react-select/creatable";
import Button from "../../components/FormElements/Button";
import UVCGrid from "../../components/UVCGrid";
import UVCPriceTable from "../../components/UVCPricesTable";
import SupplierComponent from "../../components/SupplierComponent";
import UVCInfosTable from "../../components/UVCInfosTable";
import UVCSupplierTable from "../../components/UVCSupplierTable";

interface Product {
  GA_CODEARTICLE: string;
  GA_FERME: string;
  GA_FOURNPRINC: string;
  GA_HISTORIQUE: string[];
  GA_LIBCOMPL: string;
  GA_LIBELLE: string;
  GA_LIBREART1: number;
  GA_LIBREART2: number;
  GA_LIBREART3: number;
  GA_LIBREART4: number;
  family: any;
  subFamily: any;
  imgPath: string;
  uvcs: any[];
  brand: any;
  productCollection: any;
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
  const [isFullScreen, setIsFullScreen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModify, setIsModify] = useState(false);
  const [page, setPage] = useState("dimension");
  const [onglet, setOnglet] = useState("infos");
  const { data: product } = useFetch<Product[]>(
    `${process.env.REACT_APP_URL_DEV}/api/v1/product/${id}`
  );
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
    dimension_type: "Couleur/Taille",
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

  useEffect(() => {
    if (product) {
      const initialSizes = [
        ...new Set(product[0]?.uvcs.map((uvc) => uvc.TAILLE)),
      ];
      const initialColors = [
        ...new Set(product[0]?.uvcs.map((uvc) => uvc.COULEUR)),
      ];
      const initialGrid = initialColors.map((color) =>
        initialSizes.map(() => true)
      );
      setSizes(initialSizes);
      setColors(initialColors);
      setUvcGrid(initialGrid);
    }
  }, [product]);

  const toggleFullScreen = () => {
    setIsFullScreen((prevState) => !prevState);
    console.log("cliqued")
  };

  console.log(formData);

  return (
    <section className="w-full bg-gray-100 p-8 max-w-[2000px] mx-auto">
      <Modal
        show={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onClose={() => setIsModalOpen(false)}
        header="Fournisseurs"
      >
        <SupplierComponent />
      </Modal>
      <form>
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-2">
            <div onClick={() => navigate(-1)} className="cursor-pointer">
              <ChevronLeft />
            </div>
            <h1 className="text-[32px] font-[800]">Page produit</h1>
          </div>
          <div className="flex items-center justify-between">
            {product && (
              <h2 className="text-[25px]">{product[0]?.GA_LIBELLE}</h2>
            )}
            {!isModify ? (
              <Button blue size="small" onClick={() => setIsModify(true)}>
                {isModify ? "Annuler modification" : "Modifier"}
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button size="small" blue>
                  Valider
                </Button>
                <Button
                  size="small"
                  cancel
                  type="button"
                  onClick={() => setIsModify(false)}
                >
                  Annuler
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
              <div className="flex gap-7 mt-[50px] items-stretch">
                <div className="w-[60%]">
                  <h4 className="font-[700] mb-2">Identification</h4>
                  <div className="flex flex-col gap-3 bg-white shadow-md">
                    <div className="relative border border-gray-300 p-3 flex-1">
                      <div className="grid grid-cols-4 gap-2 py-2">
                        <span className="col-span-1 font-bold text-gray-700">
                          Référence :
                        </span>
                        <span className="col-span-3 text-gray-600 text-[14px]">
                          {product[0]?.GA_CODEARTICLE}
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-2 py-2">
                        <span className="col-span-1 font-bold text-gray-700">
                          Nom d'appel :
                        </span>
                        {!isModify ? (
                          <span className="col-span-3 text-gray-600 whitespace-nowrap text-[14px]">
                            N/A
                          </span>
                        ) : (
                          <input
                            type="text"
                            className="w-[300px] border rounded-md p-1 bg-gray-100 focus:outline-none focus:border-blue-500"
                          />
                        )}
                      </div>
                      <div className="grid grid-cols-4 gap-2 py-2">
                        <span className="col-span-1 font-bold text-gray-700">
                          Désignation longue :
                        </span>
                        {!isModify ? (
                          <span className="col-span-3 text-gray-600 whitespace-nowrap text-[14px]">
                            {product[0]?.GA_LIBELLE}
                          </span>
                        ) : (
                          <input
                            type="text"
                            className="w-[300px] border rounded-md p-1 bg-gray-100 focus:outline-none focus:border-blue-500"
                          />
                        )}
                      </div>
                      <div className="grid grid-cols-4 gap-2 py-2">
                        <span className="col-span-1 font-bold text-gray-700">
                          Désignation courte :
                        </span>
                        {!isModify ? (
                          <span className="col-span-3 text-gray-600 whitespace-nowrap text-[14px]">
                            {product[0]?.GA_LIBCOMPL}
                          </span>
                        ) : (
                          <input
                            type="text"
                            className="w-[300px] border rounded-md p-1 bg-gray-100 focus:outline-none focus:border-blue-500"
                          />
                        )}
                      </div>
                      <div className="grid grid-cols-4 gap-2 py-2">
                        <span className="col-span-1 font-bold text-gray-700">
                          Marque :
                        </span>
                        {!isModify ? (
                          <span className="col-span-3 text-gray-600 text-[14px]">
                            {product[0]?.brand
                              ? product[0]?.brand.YX_LIBELLE
                              : "N/A"}
                          </span>
                        ) : (
                          <input
                            type="text"
                            className="w-[300px] border rounded-md p-1 bg-gray-100 focus:outline-none focus:border-blue-500"
                          />
                        )}
                      </div>

                      <div className="grid grid-cols-4 gap-2 py-2">
                        <span className="col-span-1 font-bold text-gray-700">
                          Famille :
                        </span>
                        {!isModify ? (
                          <span className="col-span-3 text-gray-600 whitespace-nowrap text-[14px]">
                            {product[0]?.family
                              ? product[0]?.family.YX_LIBELLE
                              : "N/A"}
                          </span>
                        ) : (
                          <input
                            type="text"
                            className="w-[300px] border rounded-md p-1 bg-gray-100 focus:outline-none focus:border-blue-500"
                          />
                        )}
                      </div>
                      <div className="grid grid-cols-4 gap-2 py-2">
                        <span className="col-span-1 font-bold text-gray-700">
                          Sous-famille :
                        </span>
                        {!isModify ? (
                          <span className="col-span-3 text-gray-600 whitespace-nowrap text-[14px]">
                            {product[0]?.subFamily
                              ? product[0]?.subFamily.YX_LIBELLE
                              : "N/A"}
                          </span>
                        ) : (
                          <input
                            type="text"
                            className="w-[300px] border rounded-md p-1 bg-gray-100 focus:outline-none focus:border-blue-500"
                          />
                        )}
                      </div>
                      <div className="grid grid-cols-4 gap-2 py-2">
                        <span className="col-span-1 font-bold text-gray-700">
                          Sous-sous-famille :
                        </span>
                        {!isModify ? (
                          <span className="col-span-3 text-gray-600 text-[14px]">
                            N/A
                          </span>
                        ) : (
                          <input
                            type="text"
                            className="w-[300px] border rounded-md p-1 bg-gray-100 focus:outline-none focus:border-blue-500"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-[40%] flex flex-col gap-5">
                  <div className="relative w-full h-full flex-1">
                    <img
                      src="/img/logo_2.png"
                      alt="logo"
                      className="w-full h-full object-cover filter saturate-50 opacity-50"
                    />
                    <span className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-white text-xl font-bold bg-black bg-opacity-50 p-2 rounded rotate-[-20deg]">
                      Pas d'image
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-7 mt-[50px] items-stretch">
                {/* Fournisseur */}
                <div className="w-1/3 ">
                  <h4 className="font-[700] mb-2">Fournisseur principal</h4>
                  <div className="flex flex-col gap-3 bg-white shadow-md">
                    <div
                      className={`relative border border-gray-300 p-3 ${
                        isModify ? "h-[270px]" : "h-[230px]"
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
                        <span className="col-span-6 font-bold text-gray-700 text-[13px]">
                          Code :
                        </span>
                        {!isModify ? (
                          <span className="col-span-6 text-gray-600 whitespace-nowrap overflow-ellipsis overflow-hidden text-[14px]">
                            {product[0]?.GA_FOURNPRINC
                              ? product[0]?.GA_FOURNPRINC
                              : "N/A"}
                          </span>
                        ) : (
                          <input
                            type="text"
                            className="col-span-6 border rounded-md p-1 bg-gray-100 focus:outline-none focus:border-blue-500"
                          />
                        )}
                      </div>
                      <div className="grid grid-cols-12 gap-2 py-2">
                        <span className="col-span-6 font-bold text-gray-700 text-[13px]">
                          Ref. produit :
                        </span>
                        {!isModify ? (
                          <span className="col-span-6 text-gray-600 whitespace-nowrap overflow-ellipsis overflow-hidden text-[14px]">
                            N/A
                          </span>
                        ) : (
                          <input
                            type="text"
                            className="col-span-6 border rounded-md p-1 bg-gray-100 focus:outline-none focus:border-blue-500"
                          />
                        )}
                      </div>
                      <div className="grid grid-cols-12 gap-2 py-2">
                        <span className="col-span-6 font-bold text-gray-700 text-[13px]">
                          Multiple achat :
                        </span>
                        {!isModify ? (
                          <span className="col-span-6 text-gray-600 whitespace-nowrap overflow-ellipsis overflow-hidden text-[14px]">
                            N/A
                          </span>
                        ) : (
                          <input
                            type="text"
                            className="col-span-6 border rounded-md p-1 bg-gray-100 focus:outline-none focus:border-blue-500"
                          />
                        )}
                      </div>
                      <div className="grid grid-cols-12 gap-2 py-2">
                        <span className="col-span-6 font-bold text-gray-700 text-[13px]">
                          Origine :
                        </span>
                        {!isModify ? (
                          <span className="col-span-6 text-gray-600 whitespace-nowrap overflow-ellipsis overflow-hidden text-[14px]">
                            N/A
                          </span>
                        ) : (
                          <input
                            type="text"
                            className="col-span-6 border rounded-md p-1 bg-gray-100 focus:outline-none focus:border-blue-500"
                          />
                        )}
                      </div>
                      <div className="grid grid-cols-12 gap-2 py-2">
                        <span className="col-span-6 font-bold text-gray-700 text-[13px]">
                          Catégorie douanière :
                        </span>
                        {!isModify ? (
                          <span className="col-span-6 text-gray-600 whitespace-nowrap overflow-ellipsis overflow-hidden text-[14px]">
                            N/A
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
                  <h4 className="font-[700] mb-2">Caractéristiques produit</h4>
                  <div className="flex flex-col gap-3 bg-white shadow-md">
                    <div
                      className={`relative border border-gray-300 p-3 ${
                        isModify ? "h-[270px]" : "h-[230px]"
                      }`}
                    >
                      <div className="grid grid-cols-12 gap-2 py-2">
                        <span className="col-span-4 font-bold text-gray-700 text-[13px]">
                          Type :
                        </span>
                        {!isModify ? (
                          <span className="col-span-6 text-gray-600 whitespace-nowrap overflow-ellipsis overflow-hidden text-[14px]">
                            Marchandise
                          </span>
                        ) : (
                          <input
                            type="text"
                            className="col-span-6 border rounded-md p-1 bg-gray-100 focus:outline-none focus:border-blue-500"
                          />
                        )}
                      </div>
                      <div className="grid grid-cols-12 gap-2 py-2">
                        <span className="col-span-4 font-bold text-gray-700 text-[13px]">
                          Dimensions :
                        </span>
                        <span className="col-span-6 text-gray-600 whitespace-nowrap overflow-ellipsis overflow-hidden text-[14px]">
                          Couleur/Taille
                        </span>
                      </div>
                      <div className="grid grid-cols-12 gap-2 py-2">
                        <span className="col-span-4 font-bold text-gray-700 text-[13px]">
                          Collection :
                        </span>
                        {!isModify ? (
                          <span className="col-span-6 text-gray-600 whitespace-nowrap overflow-ellipsis overflow-hidden text-[14px]">
                            {product[0]?.productCollection
                              ? product[0]?.productCollection.YX_LIBELLE
                              : "N/A"}
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
                {/* Prix produit */}
                <div className="w-1/3">
                  <h4 className="font-[700] mb-2">Prix</h4>
                  <div className="flex flex-col gap-3 bg-white shadow-md">
                    <div
                      className={`relative border border-gray-300 p-3 ${
                        isModify ? "h-[270px]" : "h-[230px]"
                      }`}
                    >
                      <div className="grid grid-cols-12 gap-2 py-2">
                        <span className="col-span-6 font-bold text-gray-700 text-[13px]">
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
                        <span className="col-span-6 font-bold text-gray-700 text-[13px]">
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
                        <span className="col-span-6 font-bold text-gray-700 text-[13px]">
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
            <div className={`border-t-[1px] border-gray-300 px-5 py-2 overflow-y-auto ${isFullScreen ? "fixed right-0 top-0 h-full w-full z-[9999] bg-gray-100 h-[300px]" : "w-[70%]"}`}>
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
                  ? "fixed right-0 top-0 h-full w-full z-[9999] bg-gray-100"
                  : "w-[70%] h-[300px]"
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
              {onglet === "infos" && product && product.length > 0 && (
                <UVCInfosTable
                  uvcPrices={formData.dimension}
                  productReference={product[0].GA_CODEARTICLE || ""}
                  productBrand={product[0]?.brand.YX_LIBELLE || ""}
                />
              )}
              {onglet === "price" && product && product.length > 0 && (
                <UVCPriceTable
                  uvcPrices={formData.dimension}
                  productReference={product[0].GA_CODEARTICLE || ""}
                />
              )}
              {onglet === "supplier" && product && product.length > 0 && (
                <UVCSupplierTable
                  uvcPrices={formData.dimension}
                  productReference={product[0].GA_CODEARTICLE || ""}
                  productSupplier={product[0].GA_FOURNPRINC || ""}
                />
              )}
            </div>
          )}
        </div>
      </form>
    </section>
  );
}
