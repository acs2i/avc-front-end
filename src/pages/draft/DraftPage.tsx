import React, { useEffect, useState, useRef } from "react";
import { DRAFT_CATEGORY, LINKCARD_DRAFT } from "../../utils/index";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import Input from "../../components/FormElements/Input";
import { ChevronRight, ChevronsUpDown } from "lucide-react";
import truncateText from "../../utils/func/Formattext";
import Button from "../../components/FormElements/Button";

interface PriceItem {
  peau: number;
  tbeu_pb: number;
  tbeu_pmeu: number;
}

interface Price {
  tarif_id: any;
  currency: string;
  supplier_id: any;
  price: PriceItem[];
  store: string;
}

interface Uvc {
  code: string;
  dimensions: string[];
  prices: Price[];
  eans: string[];
  status: number;
  additional_fields: any;
}

interface Supplier {
  supplier_id: any;
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
  tag_ids: any[];
  suppliers: Supplier[];
  dimension_types: string[];
  brand_ids: any[];
  collection_ids: any[];
  imgPath: string;
  status: string;
  additional_fields: any;
  step: number;
  uvc: Uvc[];
  createdAt: Date;
  updatedAt: Date;
}

interface User {
  _id: any;
  username: string;
  email: string;
  authorization: string;
  comment: string;
}

interface EnrichedDraft extends Draft {
  brandName: string;
  supplierName: string;
  familyName: string;
  subFamilyName: string;
}

export default function DraftPage() {
  const user = useSelector((state: any) => state.auth.user._id);
  const token = useSelector((state: any) => state.auth.token);
  const [isMultipleValidate, setIsMultipleValidate] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedDrafts, setSelectedDrafts] = useState<string[]>([]);
  const [lastSelectedDraft, setLastSelectedDraft] =
    useState<EnrichedDraft | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const steps = [1, 2, 3];
  const [page, setPage] = useState("draft");
  const [onglet, setOnglet] = useState("created");
  const [drafts, setDrafts] = useState<EnrichedDraft[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [userId, setUserId] = useState(user);
  const [selectedUsername, setSelectedUsername] = useState("");
  const draftsEnriched = useRef(false);
  const navigate = useNavigate();
  const filteredDrafts = drafts.filter((draft) => draft.step === 1);
  const filteredInProgress = drafts.filter((draft) => draft.step === 2);
  const filteredDone = drafts.filter((draft) => draft.step === 3);
  const isValidObjectId = (id: string): boolean => {
    return /^[a-fA-F0-9]{24}$/.test(id);
  };
  const formatDate = (timestamp: any) => {
    return format(new Date(timestamp), "dd/MM/yyyy HH:mm:ss");
  };

  const handleStepClick = (step: number) => {
    setCurrentStep(step);
  };

  const toggleCheckboxVisibility = () => {
    setIsMultipleValidate(!isMultipleValidate);
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      // Ajoute tous les drafts filtrés à la sélection
      setSelectedDrafts(filteredDrafts.map((draft) => draft._id));
    } else {
      // Vide la sélection
      setSelectedDrafts([]);
    }
  };

  const handleDraftSelection = (id: string) => {
    setSelectedDrafts(
      (prevSelected) =>
        prevSelected.includes(id)
          ? prevSelected.filter((draftId) => draftId !== id) // Retire si déjà sélectionné
          : [...prevSelected, id] // Ajoute si non sélectionné
    );
  };

  const updateSelectedDrafts = async () => {
    try {
      const payload = {
        draftIds: selectedDrafts,
        updateData: { step: 2 }, // Mise à jour du champ `step` à 2
      };
      console.log("Payload envoyé:", payload); // Vérifie le contenu du payload

      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/draft/bulkUpdate`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        // Gère les erreurs côté serveur
        const errorResponse = await response.json();
        return; // Sortie précoce en cas d'erreur
      }

      const result = await response.json();
      setCurrentStep(2);
      setIsMultipleValidate(false);
      // Mettre à jour l'état local
      setDrafts((prevDrafts) =>
        prevDrafts.map((draft) =>
          selectedDrafts.includes(draft._id) ? { ...draft, step: 2 } : draft
        )
      );
      setSelectedDrafts([]); // Réinitialiser la sélection
      setSelectAll(false); // Désélectionner "Tout sélectionner"
    } catch (error) {
      console.error("Erreur lors de la mise à jour en masse :", error);
    }
  };

  useEffect(() => {
    setSelectAll(
      filteredDrafts.length > 0 &&
        selectedDrafts.length === filteredDrafts.length
    );
  }, [selectedDrafts, filteredDrafts]);

  useEffect(() => {
    fetchDraft();
  }, [userId]);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const user = users.find((user) => user._id === userId);
    if (user) {
      setSelectedUsername(user.username);
    }
  }, [userId, users]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/auth/all-users`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    }
  };

  const fetchDraft = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/draft/user/${userId}/enrichie`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur lors de la requête : ${response.statusText}`);
      }

      const data: EnrichedDraft[] = await response.json();
      setDrafts(data);
    } catch (error) {
      console.error(
        "Erreur lors de la requête pour récupérer les brouillons enrichis",
        error
      );
    }
  };

  const handleUserChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setUserId(event.target.value);
  };

  console.log(drafts)

  return (
    <section>
      {/* Partie Header */}
      <div className="w-full h-[320px] bg-slate-100 p-8 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${"/img/background_forest.jpg"})`,
            opacity: 0.05,
            filter: "grayscale(10%)",
            backgroundPosition: "center bottom -50px",
          }}
        ></div>
        <div className="relative z-10">
          <div className="w-full flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <React.Fragment key={index}>
                <div
                  onClick={() => handleStepClick(step)}
                  className={`relative w-[50px] h-[50px] rounded-full flex items-center justify-center cursor-pointer text-white transition-colors duration-300 ease-in-out ${
                    currentStep >= step ? "bg-[#3B71CA]" : "bg-gray-300"
                  }`}
                >
                  {currentStep === step && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="animate-ping absolute h-full w-full rounded-full bg-[#3B71CA] opacity-65"></span>
                    </span>
                  )}
                  <span className="text-lg font-bold z-10">{step}</span>
                </div>

                {index < steps.length - 1 && (
                  <div className="flex-1 h-[4px] bg-gray-300">
                    <div
                      className={`h-full transition-all duration-300 ease-in-out ${
                        currentStep > index + 1
                          ? "w-full bg-[#3B71CA]"
                          : "w-0 bg-[#3B71CA]"
                      }`}
                    ></div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="mt-7">
            {currentStep === 1 && (
              <h3 className="text-[32px] font-[800] text-gray-800 capitalize">
                à
                <span className="font-[200]">
                  {" "}
                  traiter ({filteredDrafts.length})
                </span>
              </h3>
            )}
            {currentStep === 2 && (
              <h3 className="text-[32px] font-[800] text-gray-800 capitalize">
                à
                <span className="font-[200]">
                  {" "}
                  valider ({filteredInProgress.length})
                </span>
              </h3>
            )}
            {currentStep === 3 && (
              <h3 className="text-[32px] font-[800] text-gray-800 capitalize">
                h
                <span className="font-[200]">
                  istorique des validations{" "}
                  <span className="text-[15px] lowercase">
                    (vous pouvez les retrouver dans la liste articles)
                  </span>{" "}
                  ({filteredDone.length})
                </span>
              </h3>
            )}
            <div className="flex items-center gap-7 mt-[20px]">
              {DRAFT_CATEGORY.map((link, i) => (
                <div
                  key={i}
                  className="cursor-pointer flex items-center gap-2"
                  onClick={() => setOnglet(link.page)}
                >
                  <button
                    className={`text-sm font-[600] ${
                      onglet === link.page ? "text-blue-600" : "text-gray-800"
                    }`}
                  >
                    {link.name}
                  </button>
                  <span className="text-[14px]">(2222)</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative flex items-center gap-3 mt-4">
            <label className="text-gray-700 font-semibold">Utilisateur :</label>
            <div className="relative w-[250px]">
              <select
                name="users"
                className="block w-full p-1 rounded-lg bg-white border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg capitalize"
                value={userId}
                onChange={handleUserChange}
              >
                {users.map((user) => (
                  <option
                    key={user._id}
                    value={user._id}
                    className="text-lg capitalize"
                  >
                    {user.username}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-3 flex gap-3">
            <Button blue size="small" onClick={toggleCheckboxVisibility}>
              Validation multiple
            </Button>
            <Button blue size="small" onClick={updateSelectedDrafts}>
              Validerla selection
            </Button>
          </div>
        </div>
      </div>
      {/* Partie Liste */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-y-[2px] border-slate-100 text-sm font-[900] text-black uppercase">
            <tr>
              {isMultipleValidate && (
                <td className="px-6 py-2 text-blue-500">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="peer relative h-5 w-5 cursor-pointer rounded border border-slate-300 shadow hover:shadow-md transition-all"
                  />
                </td>
              )}
              <th scope="col" className="px-6 py-4 w-[5%]">
                <div className="flex items-center">
                  <span className="leading-3">Référence</span>
                  <div className="cursor-pointer">
                    <ChevronsUpDown size={13} />
                  </div>
                </div>
              </th>
              <th scope="col" className="px-6 w-1/6">
                <div className="flex items-center">
                  <span>Libellé</span>
                  <div className="cursor-pointer">
                    <ChevronsUpDown size={13} />
                  </div>
                </div>
              </th>
              <th scope="col" className="px-6 w-[10%]">
                <div className="flex items-center">
                  <span>Marque</span>
                  <div className="cursor-pointer">
                    <ChevronsUpDown size={13} />
                  </div>
                </div>
              </th>
              <th scope="col" className="px-6 w-[10%]">
                <div className="flex items-center">
                  <span>Fournisseur</span>
                  <div className="cursor-pointer">
                    <ChevronsUpDown size={13} />
                  </div>
                </div>
              </th>
              <th scope="col" className="px-6 w-1/6">
                <div className="flex items-center">
                  <span>Famille</span>
                  <div className="cursor-pointer">
                    <ChevronsUpDown size={13} />
                  </div>
                </div>
              </th>
              <th scope="col" className="px-6 w-1/6">
                <div className="flex items-center">
                  <span>Sous-famille</span>
                  <div className="cursor-pointer">
                    <ChevronsUpDown size={13} />
                  </div>
                </div>
              </th>
              <th scope="col" className="px-6 w-[10%]">
                <div className="flex items-center">
                  <span>Date</span>
                  <div className="cursor-pointer">
                    <ChevronsUpDown size={13} />
                  </div>
                </div>
              </th>
            </tr>
          </thead>
          {currentStep === 1 && (
            <tbody>
              {filteredDrafts.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-2 text-center text-gray-500"
                  >
                    <span className="capitalize font-[800]">
                      {selectedUsername}
                    </span>{" "}
                    n'a pas de brouillon
                  </td>
                </tr>
              ) : (
                filteredDrafts.map((product, i) => (
                  <tr
                    key={i}
                    className="bg-white cursor-pointer hover:bg-slate-200 capitalize text-[12px] text-gray-800 even:bg-slate-50 whitespace-nowrap border"
                    onClick={() =>
                      !isMultipleValidate && navigate(`/draft/${product._id}`)
                    }
                  >
                    {isMultipleValidate && (
                      <td className="px-6 py-2 text-blue-500">
                        <input
                          type="checkbox"
                          checked={selectedDrafts.includes(product._id)}
                          onChange={() => handleDraftSelection(product._id)}
                          className="relative h-5 w-5 cursor-pointer rounded border border-slate-300 shadow hover:shadow-md transition-all"
                        />
                      </td>
                    )}
                    <td className="px-6 py-2 text-blue-500">
                      {product.reference}
                    </td>
                    <td className="px-6 py-2">
                      {truncateText(product.long_label, 20)}
                    </td>
                    <td className="px-6 py-2">{product.brandName}</td>
                    <td className="px-6 py-2">{product.supplierName}</td>
                    <td className="px-6 py-2">{product.familyName}</td>
                    <td className="px-6 py-2">{product.subFamilyName}</td>
                    <td className="px-6 py-2 text-blue-600">
                      {formatDate(product.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          )}
          {currentStep === 2 && (
            <tbody>
              {filteredInProgress.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    <span className="capitalize font-[800]">
                      {selectedUsername}
                    </span>{" "}
                    n'a pas de références à valider
                  </td>
                </tr>
              ) : (
                filteredInProgress.map((product, i) => (
                  <tr
                    key={i}
                    className="bg-white cursor-pointer hover:bg-slate-200 capitalize text-[12px] text-gray-800 even:bg-slate-50 whitespace-nowrap border"
                    onClick={() => navigate(`/draft/${product._id}`)}
                  >
                    <td className="px-6 py-2 text-blue-500">
                      {product.reference}
                    </td>
                    <td className="px-6 py-2">{product.long_label}</td>
                    <td className="px-6 py-2">{product.brandName}</td>
                    <td className="px-6 py-2">{product.supplierName}</td>
                    <td className="px-6 py-2">{product.familyName}</td>
                    <td className="px-6 py-2">{product.subFamilyName}</td>
                    <td className="px-6 py-2 text-blue-600">
                      {formatDate(product.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          )}
          {currentStep === 3 && (
            <tbody>
              {filteredDone.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    <span className="capitalize font-[800]">
                      {selectedUsername}
                    </span>{" "}
                    n'a pas d'historique
                  </td>
                </tr>
              ) : (
                filteredDone.map((product, i) => (
                  <tr
                    key={i}
                    className="bg-white cursor-pointer hover:bg-slate-200 capitalize text-[12px] text-gray-800 even:bg-slate-50 whitespace-nowrap border"
                    onClick={() => navigate(`/draft/${product._id}`)}
                  >
                    <td className="px-6 py-2 text-blue-500">
                      {product.reference}
                    </td>
                    <td className="px-6 py-2">{product.long_label}</td>
                    <td className="px-6 py-2">{product.brandName}</td>
                    <td className="px-6 py-2">{product.supplierName}</td>
                    <td className="px-6 py-2">{product.familyName}</td>
                    <td className="px-6 py-2">{product.subFamilyName}</td>
                    <td className="px-6 py-2 text-blue-600">
                      {formatDate(product.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          )}
        </table>
      </div>
    </section>
  );
}
