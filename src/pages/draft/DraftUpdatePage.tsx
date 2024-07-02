import Button from "../../components/FormElements/Button";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Modal from "../../components/Shared/Modal";
import { ChevronLeft, Pen } from "lucide-react";
import { LINKS_Product } from "../../utils/index";

interface Draft {
  _id: string;
  creator_id: any;
  description_ref: string;
  reference: string;
  designation_longue: string;
  designation_courte: string;
  supplier_name: string;
  supplier_ref: string;
  family: string[];
  subFamily: string[];
  subSubFamily: string[];
  dimension_type: string;
  dimension: string[];
  brand: string;
  ref_collection: string;
  composition: string;
  description_brouillon: string;
  status: number;
  createdAt: any;
}

export default function DraftUpdatePage() {
  const token = useSelector((state: any) => state.auth.token);
  const location = useLocation();
  const [isSend, setisSned] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState("dimension");
  const navigate = useNavigate();
  const [draft, setDraft] = useState<Draft>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModify, setIsModify] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    fetchDraft();
  }, []);

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
    } finally {
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

  return (
    <>
      <section className="w-full bg-gray-100 h-screen p-8">
        <Modal
          show={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          onClose={() => setIsModalOpen(false)}
          header="Fournisseurs"
        ></Modal>
        <form>
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2">
              <div onClick={() => navigate(-1)} className="cursor-pointer">
                <ChevronLeft />
              </div>
              <h1 className="text-[32px] font-[800]">Page produit</h1>
            </div>
            <div className="flex items-center justify-between">
              {draft && (
                <h2 className="text-[25px]">{draft.designation_longue}</h2>
              )}
              {!isModify ? (
                <div className="flex items-center gap-2">
                  <button
                    className="text-blue-500 font-[600]"
                    onClick={() => setIsModify(true)}
                    type="button"
                  >
                    {isModify ? "Annuler modification" : "Modifier"}
                  </button>
                  <Button
                    size="small"
                    blue={isSend}
                    disabled={!isSend}
                    onClick={handleSend}
                  >
                    Transmettre
                  </Button>
                </div>
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
            {draft && (
              <>
                {/* Indentification */}
                <div className="flex gap-7 mt-[50px] items-stretch">
                  <div className="w-[70%] flex flex-col gap-3 bg-white">
                    <div className="relative border border-gray-300 p-3 flex-1">
                      <div className="absolute top-[-15px] bg-gradient-to-b from-gray-100 from-40% to-white px-2">
                        <span className="text-[13px] italic">
                          Identification
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-2 py-2">
                        <span className="col-span-1 font-bold text-gray-700">
                          Référence :
                        </span>
                        <span className="col-span-3 text-gray-600 text-[14px]">
                          {draft.reference}
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
                            {draft.designation_longue}
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
                            {draft.designation_courte}
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
                            {draft?.brand ? draft?.brand : "N/A"}
                          </span>
                        ) : (
                          <input
                            type="text"
                            className="w-[300px] border rounded-md p-1 bg-gray-100 focus:outline-none focus:border-blue-500"
                          />
                        )}
                      </div>

                      <div className="mt-[30px] grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="col-span-full">
                          <h5 className="text-[20px] font-[700]">
                            Classification
                          </h5>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          <span className="col-span-1 font-bold text-gray-700">
                            Famille :
                          </span>
                          {!isModify ? (
                            <span className="col-span-3 text-gray-600 whitespace-nowrap text-[14px]">
                              {draft?.family ? draft?.family : "N/A"}
                            </span>
                          ) : (
                            <input
                              type="text"
                              className="w-[300px] border rounded-md p-1 bg-gray-100 focus:outline-none focus:border-blue-500"
                            />
                          )}
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          <span className="col-span-1 font-bold text-gray-700">
                            Sous-famille :
                          </span>
                          {!isModify ? (
                            <span className="col-span-3 text-gray-600 whitespace-nowrap text-[14px]">
                              {draft?.subFamily ? draft?.subFamily : "N/A"}
                            </span>
                          ) : (
                            <input
                              type="text"
                              className="w-[300px] border rounded-md p-1 bg-gray-100 focus:outline-none focus:border-blue-500"
                            />
                          )}
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          <span className="col-span-1 font-bold text-gray-700">
                            Ss-famille :
                          </span>
                          {!isModify ? (
                            <span className="col-span-3 text-gray-600 text-[14px]">
                              {draft?.subSubFamily
                                ? draft?.subSubFamily
                                : "N/A"}
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
                  <div className="w-[30%] flex flex-col gap-5">
                    <div className="w-full h-full flex-1">
                      <img
                        src="/img/logo_2.png"
                        alt="logo"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Fournisseur */}
                <div className="flex gap-7 mt-[50px]">
                  <div className="w-[50%] flex flex-col gap-3 bg-white">
                    <div
                      className={`relative border border-gray-300 p-3 ${
                        isModify ? "h-[270px]" : "h-[230px]"
                      }`}
                    >
                      <div
                        className="absolute right-[10px] cursor-pointer text-gray-600"
                        onClick={() => setIsModalOpen(true)}
                      >
                        <Pen size={17} />
                      </div>
                      <div className="absolute top-[-15px] bg-gradient-to-b from-gray-100 from-40% to-white px-2">
                        <span className="text-[13px] italic">
                          Founisseur principal
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-2 py-2">
                        <span className="col-span-1 font-bold text-gray-700">
                          Code :
                        </span>
                        {!isModify ? (
                          <span className="col-span-3 text-gray-600 whitespace-nowrap text-[14px]">
                            {draft?.supplier_ref ? draft?.supplier_ref : "N/A"}
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
                          Ref. produit :
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
                          Multiple achat :
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
                          Origine :
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
                          Catégorie devise :
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
                    </div>
                  </div>

                  {/* Caractéristiques produit */}
                  <div className="w-[50%] flex flex-col gap-3 bg-white">
                    <div
                      className={`relative border border-gray-300 p-3 ${
                        isModify ? "h-[270px]" : "h-[230px]"
                      }`}
                    >
                      <div className="absolute top-[-15px] bg-gradient-to-b from-gray-100 from-40% to-white px-2">
                        <span className="text-[13px] italic">
                          Caractéristiques produit
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-2 py-2">
                        <span className="col-span-1 font-bold text-gray-700">
                          Type :
                        </span>
                        {!isModify ? (
                          <span className="col-span-3 text-gray-600 whitespace-nowrap text-[14px]">
                            Marchandise
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
                          Dimensions :
                        </span>
                        <span className="col-span-3 text-gray-600 whitespace-nowrap text-[14px]">
                          {draft.dimension_type}
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-2 py-2">
                        <span className="col-span-1 font-bold text-gray-700">
                          Collection :
                        </span>
                        {!isModify ? (
                          <span className="col-span-3 text-gray-600 whitespace-nowrap text-[14px]">
                            {draft?.ref_collection
                              ? draft.ref_collection
                              : "N/A"}
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
              </>
            )}
          </div>
        </form>

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
        </div>
      </section>
    </>
  );
}
