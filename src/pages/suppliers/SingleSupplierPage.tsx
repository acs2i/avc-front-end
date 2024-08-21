import React, { useState, useEffect } from "react";
import Input from "../../components/FormElements/Input";
import { useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp, Plus, Trash } from "lucide-react";
import CreatableSelect from "react-select/creatable";
import { ActionMeta, SingleValue } from "react-select";
import Button from "../../components/FormElements/Button";
import useNotify from "../../utils/hooks/useToast";
import { CircularProgress, Collapse } from "@mui/material";

interface Contact {
  firstname: string;
  lastname: string;
  function: string;
  phone: string;
  mobile: string;
  email: string;
}

interface Condition {
  tarif: string;
  currency: string;
  rfa: string;
  net_price: string;
  labeling: string;
  paiement_condition: string;
  franco: string;
  validate_tarif: string;
  budget: string;
}

interface FormData {
  creator_id: any;
  code: string;
  company_name: string;
  juridique: string;
  phone: string;
  email: string;
  web_url: string;
  siret: string;
  tva: string;
  address_1: string;
  address_2: string;
  address_3: string;
  city: string;
  postal: string;
  country: string;
  currency: string;
  discount: string;
  brand_id: string[];
  contacts: Contact[];
  conditions: Condition[];
}

type BrandOption = {
  _id: string;
  value: string;
  code: string;
  label: string;
};

const customStyles = {
  control: (provided: any) => ({
    ...provided,
    border: "none",
    boxShadow: "none",
    borderRadius: "10px",
    "&:hover": {
      border: "none",
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

export default function SingleSupplierPage() {
  const navigate = useNavigate();
  const creatorId = useSelector((state: any) => state.auth.user);
  const token = useSelector((state: any) => state.auth.token);
  const limit = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [additionalFields, setAdditionalFields] = useState([
    { name: "", value: "" },
  ]);
  const [inputValueBrand, setInputValueBrand] = useState("");
  const [optionsBrand, setOptionsBrand] = useState<BrandOption[]>([]);
  const [brands, setBrands] = useState<SingleValue<BrandOption>[]>([null]);
  const { notifySuccess, notifyError } = useNotify();
  const [isLoading, setIsLoading] = useState(false);
  const [addFieldIsVisible, setaddFieldIsVisible] = useState(false);

  return (
    <section className="w-full bg-slate-50 p-7">
      <div className="max-w-[2024px] mx-auto">
        <form className="mb-[400px]">
          <div className="flex justify-between">
            <div>
              <h3 className="text-[32px] font-[800] text-gray-800">
                Fournisseur <span className="font-[200]"></span>
              </h3>
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
                  <Button size="small" cancel type="button">
                    Annuler
                  </Button>
                  <Button size="small" blue type="submit">
                    Modifier le fournisseur
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mt-3">
                <CircularProgress />
              </div>
            )}
          </div>

          <div className="flex gap-4 mt-[80px]">
            <div className="relative w-[70%] flex flex-col gap-3">
              <h4 className="absolute top-[-12px] left-[20px] px-2 text-[17px] text-gray-600 bg-slate-50 font-[400]">
                Identification
              </h4>
              {/* Partie Infos */}
              <div className="border border-gray-300 h-[550px] p-3 rounded-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <Input
                    element="input"
                    id="code"
                    label="Code fournisseur :"
                    value=""
                    validators={[]}
                    placeholder="Ajouter le code fournisseur"
                    create
                    gray
                  />
                  <Input
                    element="input"
                    id="company_name"
                    label="Raison sociale :"
                    value=""
                    validators={[]}
                    placeholder="Ajouter la raison sociale"
                    create
                    gray
                  />
                  <Input
                    element="input"
                    id="siret"
                    label="Siret :"
                    value=""
                    validators={[]}
                    placeholder="Entrer le numéro SIRET (14 chiffres)"
                    create
                    gray
                  />
                  <Input
                    element="input"
                    id="tva"
                    label="N°TVA intracom :"
                    value=""
                    validators={[]}
                    placeholder="Ajouter le numero tva intracom"
                    create
                    gray
                  />
                </div>
                <Input
                  element="input"
                  id="web_url"
                  label="Site web :"
                  value=""
                  validators={[]}
                  placeholder="www.monsite.com"
                  create
                  gray
                />
                <Input
                  element="input"
                  type="email"
                  id="email"
                  label="Email :"
                  value=""
                  validators={[]}
                  placeholder="ex: email@email.fr"
                  create
                  gray
                />
                <Input
                  element="phone"
                  id="phone"
                  label="Téléphone :"
                  value=""
                  validators={[]}
                  placeholder="0142391456"
                  create
                  gray
                />
              </div>
            </div>
            <div className="relative w-[30%] flex flex-col gap-3">
              <h4 className="absolute top-[-12px] left-[20px] px-2 text-[17px] text-gray-600 bg-slate-50 font-[400]">
                Adresse
              </h4>
              {/* Partie adresse */}
              <div className="border border-gray-300 h-[550px] p-3 rounded-md">
                <Input
                  element="input"
                  id="address_1"
                  label="Adresse 1 :"
                  value=""
                  validators={[]}
                  placeholder="14 rue mon adresse"
                  create
                  gray
                />
                <Input
                  element="input"
                  id="address_2"
                  label="Adresse 2 :"
                  value=""
                  validators={[]}
                  placeholder="Complément d'adresse"
                  create
                  gray
                />
                <Input
                  element="input"
                  id="address_3"
                  label="Adresse 3 :"
                  value=""
                  validators={[]}
                  placeholder="Complément d'adresse"
                  create
                  gray
                />
                <Input
                  element="input"
                  id="city"
                  label="Ville :"
                  value=""
                  validators={[]}
                  placeholder="Ajouter la ville"
                  create
                  gray
                />
                <Input
                  element="input"
                  id="postal"
                  label="Code postal :"
                  value=""
                  validators={[]}
                  placeholder="75019"
                  create
                  gray
                />
                <Input
                  element="input"
                  id="country"
                  label="Pays :"
                  value=""
                  validators={[]}
                  placeholder="France"
                  create
                  gray
                />
              </div>
            </div>
          </div>
          <div className="flex gap-4 mt-[50px]">
            <div className="relative w-[70%] flex flex-col gap-3">
      
              {/* Partie tarifs */}
              <div className="relative w-full flex flex-col gap-3">
                <h4 className="absolute top-[-12px] left-[20px] px-2 text-[17px] text-gray-600 bg-slate-50 font-[400]">
                  Tarifs & conditions
                </h4>

                <div className="border border-gray-300 p-3 rounded-md">
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      element="input"
                      id="tarif"
                      label="Tarif :"
                      value=""
                      validators={[]}
                      placeholder="Tapez un tarif"
                      create
                      gray
                    />
                    <Input
                      element="select"
                      id="currency"
                      label="Devise :"
                      value=""
                      validators={[]}
                      placeholder="Choississez une devise"
                      create
                      gray
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-5">
                    <fieldset className="flex justify-center">
                      <legend className="text-sm font-medium text-gray-800 text-center">
                        RFA :
                      </legend>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <input type="radio" id="rfa" name="rfa" value="oui" />
                          <label htmlFor="rfa-oui">Oui</label>
                        </div>

                        <div className="flex items-center gap-2">
                          <input type="radio" id="rfa" name="rfa" value="non" />
                          <label htmlFor="rfa-non">Non</label>
                        </div>
                      </div>
                    </fieldset>
                    <fieldset className="flex justify-center">
                      <legend className="text-sm font-medium text-gray-800 text-center">
                        Prix nets :
                      </legend>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            id="net_price"
                            name="price-net"
                            value="oui"
                          />
                          <label htmlFor="price-oui">Oui</label>
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            id="net_price"
                            name="price-net"
                            value="non"
                          />
                          <label htmlFor="price-non">Non</label>
                        </div>
                      </div>
                    </fieldset>
                    <fieldset className="flex justify-center">
                      <legend className="text-sm font-medium text-gray-800 text-center">
                        Etiquetage :
                      </legend>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            id="labeling"
                            name="tag"
                            value="oui"
                           
                          />
                          <label htmlFor="tag-oui">Oui</label>
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            id="labeling"
                            name="tag"
                            value="non"
                           
                          />
                          <label htmlFor="tag-non">Non</label>
                        </div>
                      </div>
                    </fieldset>
                  </div>
                  <div className="text-center mt-[30px]">
                    <span className="text-sm font-medium text-gray-800">
                      Condition de paiement :
                    </span>
                    <div className="flex items-center justify-center gap-[30px] font-[600] text-gray-700 mt-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          id="paiement_condition"
                          name="paymentCondition"
                          value="45 jours fin du mois"
                         
                        />
                        <label htmlFor="payment-45j" className="text-[13px]">
                          45 jours fin du mois
                        </label>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          id="paiement_condition"
                          name="paymentCondition"
                          value="10 jours réception facture avec escompte supplémentaire"
                        
                        />
                        <label htmlFor="payment-10j" className="text-[13px]">
                          10 jours réception facture avec escompte
                          supplémentaire
                        </label>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          id="paiement_condition"
                          name="paymentCondition"
                          value="60 jours date facture"
                         
                        />
                        <label htmlFor="payment-60j" className="text-[13px]">
                          60 jours date facture
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    <Input
                      element="input"
                      id="franco"
                      label="Franco :"
                     
                      validators={[]}
                      placeholder="Ex: 500 EUR, 1000 USD..."
                      create
                      gray
                    />
                    <Input
                      element="input"
                      id="validate_tarif"
                      label="Validité des tarifs :"
                      
                      validators={[]}
                      placeholder="Ex: 6 mois, 1 mois..."
                      create
                      gray
                    />
                    <Input
                      element="input"
                      id="budget"
                      label="Budget marketing :"
                     
                      validators={[]}
                      placeholder="Ex: 5000 EUR par an"
                      create
                      gray
                    />
                  </div>
                </div>
              </div>
              {/* Partie buttons */}
              {!isLoading ? (
                <div className="mt-[50px] flex gap-2">
                  <button
                    className="w-full bg-gray-300 text-red-500 py-2 rounded-md font-[600] hover:bg-red-500 hover:text-white shadow-md"
                    type="button"
                  >
                    Annuler
                  </button>
                  <button
                    className="w-full bg-sky-600 text-white py-2 rounded-md font-[600] hover:bg-sky-500 shadow-md"
                    type="submit"
                  >
                    Modifier le fournisseur
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
            {/* Partie marques */}
            <div className="relative w-[30%] flex flex-col gap-3">
              <h4 className="absolute top-[-12px] left-[20px] px-2 text-[17px] text-gray-600 bg-slate-50 font-[400]">
                Marques
              </h4>
              <div className="border border-gray-300 p-3 rounded-md">
                {brands.map((brand, index) => (
                  <div key={index} className="flex items-center gap-2 mt-2">
                    <CreatableSelect<BrandOption>
                      value={brand}
                     
                      inputValue={inputValueBrand}
                      options={optionsBrand}
                      placeholder="Selectionner une marque"
                      styles={customStyles}
                      className="block text-sm py-1 w-full rounded-lg text-gray-500 border border-gray-200 focus:outline-none focus:ring-0 focus:border-gray-200 peer capitalize"
                    />
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-300"
                    >
                      <Trash size={20} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="flex items-center gap-2 text-[12px] text-orange-400 mt-3"
                >
                  <Plus size={17} />
                  Ajouter une marque
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
