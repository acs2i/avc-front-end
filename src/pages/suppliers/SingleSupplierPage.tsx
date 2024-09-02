import React, { useState, useEffect } from "react";
import Input from "../../components/FormElements/Input";
import { useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";
import {
  ChevronDown,
  ChevronUp,
  CircleSlash2,
  Plus,
  Trash,
} from "lucide-react";
import CreatableSelect from "react-select/creatable";
import { ActionMeta, SingleValue } from "react-select";
import Button from "../../components/FormElements/Button";
import useNotify from "../../utils/hooks/useToast";
import { CircularProgress, Collapse } from "@mui/material";
import FormSection from "../../components/Formulaires/FormSection";

interface BrandId {
  label: string;
}

interface Product {
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
  brand_id: BrandId[];
  contacts: Contact[];
  conditions: Condition[];
  status: string;
}

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
  const { id } = useParams();
  const [supplier, setSupplier] = useState<Product>();
  const creatorId = useSelector((state: any) => state.auth.user);
  const token = useSelector((state: any) => state.auth.token);
  const limit = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [inputValueBrand, setInputValueBrand] = useState("");
  const [isModify, setIsModify] = useState(false);
  const [optionsBrand, setOptionsBrand] = useState<BrandOption[]>([]);
  const [brands, setBrands] = useState<SingleValue<BrandOption>[]>([null]);
  const { notifySuccess, notifyError } = useNotify();
  const [isLoading, setIsLoading] = useState(false);
  const [addFieldIsVisible, setaddFieldIsVisible] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    creator_id: creatorId._id,
    code: "",
    company_name: "",
    juridique: "",
    phone: "",
    email: "",
    web_url: "",
    siret: "",
    tva: "",
    address_1: "",
    address_2: "",
    address_3: "",
    city: "",
    postal: "",
    country: "",
    currency: "",
    discount: "",
    brand_id: [],
    contacts: [
      {
        firstname: "",
        lastname: "",
        function: "",
        phone: "",
        mobile: "",
        email: "",
      },
    ],
    conditions: [
      {
        tarif: "",
        currency: "",
        rfa: "",
        net_price: "",
        labeling: "",
        paiement_condition: "",
        franco: "",
        validate_tarif: "",
        budget: "",
      },
    ],
  });

  const fetchSupplier = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/supplier/${id}`,
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
        setSupplier(result);
      } else {
        console.error("Erreur lors de la requête");
      }
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    }
  };

  useEffect(() => {
    fetchSupplier();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/supplier/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      if (response.ok) {
        setTimeout(() => {
          notifySuccess("Brand modifiée avec succès !");
          setIsLoading(false);
        }, 100);
      } else {
        notifyError("Erreur lors de la modif !");
      }
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  const handleContactChange =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const { id, value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        contacts: prevData.contacts.map((contact, i) =>
          i === index ? { ...contact, [id]: value } : contact
        ),
      }));
    };

  const addContactField = () => {
    setFormData((prevData) => ({
      ...prevData,
      contacts: [
        ...prevData.contacts,
        {
          firstname: "",
          lastname: "",
          function: "",
          phone: "",
          mobile: "",
          email: "",
        },
      ],
    }));
  };

  const removeContactField = (index: number) => {
    if (formData.contacts.length === 1) return;
    setFormData((prevData) => ({
      ...prevData,
      contacts: prevData.contacts.filter((_, i) => i !== index),
    }));
  };

  return (
    <section className="w-full bg-slate-50 p-7">
      <div className="max-w-[2024px] mx-auto">
        <form className="mb-[400px]">
          <div className="flex justify-between">
            <div>
              {!isModify ? (
                <h3 className="text-[32px] font-[800] text-gray-800">
                  Fournisseur{" "}
                  <span className="font-[200]">{supplier?.company_name} </span>
                </h3>
              ) : (
                <h3 className="text-[32px] font-[800] text-gray-800">
                  Modification
                  <span className="font-[200]">
                    {" "}
                    du fournisseur : {supplier?.company_name}{" "}
                  </span>
                </h3>
              )}
              {isModify && creatorId && (
                <p className="text-[17px] text-gray-600 italic">
                  Modification par{" "}
                  <span className="font-[600]">{creatorId.username}</span>
                </p>
              )}
            </div>
            {!isLoading ? (
              <div className="flex items-center justify-between gap-3 mt-[50px]">
                {!isModify ? (
                  <div className="flex items-center gap-2">
                    <Button
                      size="small"
                      type="button"
                      cancel
                      onClick={(e) => {
                        e.preventDefault();
                        // setIsModalOpenConfirm(true);
                      }}
                    >
                      {supplier?.status === "A"
                        ? "Désactiver le fournisseur"
                        : "Réactiver le fournisseur"}
                    </Button>
                    <Button
                      blue
                      size="small"
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsModify(true);
                      }}
                      disabled={supplier?.status === "D"}
                    >
                      {isModify
                        ? "Annuler modification"
                        : "Modifier le fournisseur"}
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
            ) : (
              <div className="mt-3">
                <CircularProgress />
              </div>
            )}
          </div>

          <div className="flex gap-4 mt-[80px]">
            {/* Partie Infos */}
            <div className="relative w-[70%] flex flex-col gap-3">
              <FormSection title="Identification" size={`${!isModify ? "h-[400px]" : "h-[500px]"}`}>
                <div className="mt-3">
                  {isModify ? (
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
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                      <div>
                        <span className="font-bold text-gray-700">
                          Code fournisseur :
                        </span>
                        <p className="font-[600] text-slate-500">
                          {supplier?.code}
                        </p>
                      </div>
                      <div>
                        <span className="font-bold text-gray-700">
                          Raison sociale :
                        </span>
                        <p className="font-[600] text-slate-500">
                          {supplier?.company_name}
                        </p>
                      </div>
                      <div>
                        <span className="font-bold text-gray-700">
                          Siret :
                        </span>
                        <p className="font-[600] text-slate-500">
                          {supplier?.siret}
                        </p>
                      </div>
                      <div>
                        <span className="font-bold text-gray-700">
                          N°TVA intracom :
                        </span>
                        <p className="font-[600] text-slate-500">
                          {supplier?.tva}
                        </p>
                      </div>
                      <div className="mt-3">
                        <span className="font-bold text-gray-700">
                          Site web :
                        </span>
                        <p className="font-[600] text-slate-500">
                          {supplier?.web_url}
                        </p>
                      </div>
                      <div className="mt-3">
                        <span className="font-bold text-gray-700">
                          Email :
                        </span>
                        <p className="font-[600] text-slate-500">
                          {supplier?.email}
                        </p>
                      </div>
                      <div className="mt-3">
                        <span className="font-bold text-gray-700">
                          Telephone :
                        </span>
                        <p className="font-[600] text-slate-500">
                          {supplier?.phone}
                        </p>
                      </div>
                    </div>
                  )}
                  {isModify && (
                    <>
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
                    </>
                  )}
                </div>
              </FormSection>
            </div>
            {/* Partie adresse */}
            <div className="relative w-[30%] flex flex-col gap-3">
              <FormSection title="Adresse" size={`${!isModify ? "h-[400px]" : "h-[500px]"}`}>
                <div className="mt-3">
                  {isModify ? (
                    <>
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
                    </>
                  ) : (
                    <>
                      <div className="mt-3">
                        <span className="font-bold text-gray-700">
                          Adresse 1 :
                        </span>
                        <p className="font-[600] text-slate-500">
                          {supplier?.address_1}
                        </p>
                      </div>
                      <div className="mt-3">
                        <span className="font-bold text-gray-700">
                          Adresse 2 :
                        </span>
                        <p className="font-[600] text-slate-500">
                          {supplier?.address_2}
                        </p>
                      </div>
                      <div className="mt-3">
                        <span className="font-bold text-gray-700">
                          Adresse 3 :
                        </span>
                        {supplier?.address_3 ? (
                          <p className="font-[600] text-slate-500">
                            {supplier?.address_3}
                          </p>
                        ) : (
                          <div className="font-[600] text-slate-500">
                            <CircleSlash2 size={15} />
                          </div>
                        )}
                      </div>
                      <div className="mt-3">
                        <span className="font-bold text-gray-700">
                          Ville :
                        </span>
                        <p className="font-[600] text-slate-500">
                          {supplier?.city}
                        </p>
                      </div>
                      <div className="mt-3">
                        <span className="font-bold text-gray-700">
                          Code postal :
                        </span>
                        <p className="font-[600] text-slate-500">
                          {supplier?.postal}
                        </p>
                      </div>
                      <div className="mt-3">
                        <span className="font-bold text-gray-700">
                          Pays :
                        </span>
                        {supplier?.country ? (
                          <p className="font-[600] text-slate-500">
                            {supplier?.country}
                          </p>
                        ) : (
                          <div className="text-slate-400">
                            <CircleSlash2 size={20} />
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </FormSection>
            </div>
          </div>
          <div className="flex gap-4 mt-[30px]">
            {/* Partie tarifs */}
            <div className="relative w-[70%] flex flex-col gap-3">
              <div className="relative w-full flex flex-col gap-3 mb-5">
                <FormSection title="Contatcts">
                  {isModify ? (
                    <div>
                      {formData.contacts.map((contact, index) => (
                        <div className="mt-3" key={index}>
                          <div className="mt-5 flex items-center gap-2">
                            <span className="italic text-gray-600 text-[12px] font-[700]">
                              Contact {index + 1}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <Input
                              element="input"
                              id="lastname"
                              label="Nom :"
                              value={contact.lastname}
                              onChange={handleContactChange(index)}
                              validators={[]}
                              placeholder="Nom"
                              create
                              gray
                            />
                            <Input
                              element="input"
                              id="firstname"
                              label="Prénom :"
                              value={contact.firstname}
                              onChange={handleContactChange(index)}
                              validators={[]}
                              placeholder="Prénom"
                              create
                              gray
                            />
                          </div>
                          <Input
                            element="input"
                            id="function"
                            label="Fonction :"
                            value={contact.function}
                            onChange={handleContactChange(index)}
                            validators={[]}
                            placeholder="Fonction"
                            create
                            gray
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <Input
                              element="input"
                              id="phone"
                              label="Téléphone :"
                              value={contact.phone}
                              onChange={handleContactChange(index)}
                              validators={[]}
                              placeholder="0142391456"
                              create
                              gray
                            />
                            <Input
                              element="input"
                              id="mobile"
                              label="Mobile :"
                              value={contact.mobile}
                              onChange={handleContactChange(index)}
                              validators={[]}
                              placeholder="Mobile"
                              create
                              gray
                            />
                          </div>
                          <Input
                            element="input"
                            type="email"
                            id="email"
                            label="Email :"
                            value={contact.email}
                            onChange={handleContactChange(index)}
                            validators={[]}
                            placeholder="ex: email@email.fr"
                            create
                            gray
                          />
                          <button
                            type="button"
                            onClick={() => removeContactField(index)}
                            className="flex items-center gap-2 text-[12px] text-red-500 mt-3"
                          >
                            <Trash size={17} />
                            Supprimer ce contact
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div>
                      {supplier?.contacts.map((contact, index) => (
                        <div className="mt-3" key={index}>
                          <div className="mb-3">
                            <div className="mt-5 flex items-center gap-2">
                              <span className="italic text-gray-600 text-[12px] font-[700]">
                                Contact {index + 1}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="mt-3">
                                <span className="font-bold text-gray-700">
                                  Prénom :
                                </span>
                                <p className="font-[600] text-slate-500">
                                  {contact?.firstname}
                                </p>
                              </div>
                              <div className="mt-3">
                                <span className="font-bold text-gray-700">
                                  Nom de famille :
                                </span>
                                <p className="font-[600] text-slate-500">
                                  {contact?.lastname}
                                </p>
                              </div>
                            </div>
                            <div className="mt-3">
                              <span className="font-bold text-gray-700">
                                Fonction :
                              </span>
                              <p className="font-[600] text-slate-500">
                                {contact?.function}
                              </p>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="mt-3">
                                <span className="font-bold text-gray-700">
                                  Téléphone :
                                </span>
                                <p className="font-[600] text-slate-500">
                                  {contact?.phone}
                                </p>
                              </div>
                              <div className="mt-3">
                                <span className="font-bold text-gray-700">
                                  Mobile :
                                </span>
                                <p className="font-[600] text-slate-500">
                                  {contact?.mobile}
                                </p>
                              </div>
                            </div>
                            <div className="mt-3">
                              <span className="font-bold text-gray-700">
                                Email :
                              </span>
                              <p className="font-[600] text-slate-500">
                                {contact?.email}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </FormSection>
              </div>
              {/* Partie tarifs */}
              <div className="relative w-full flex flex-col gap-3">
                <FormSection title="Tarifs & conditions">
                  <div className="mt-3">
                    {isModify ? (
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
                    ) : (
                      <div className="grid grid-cols-3 gap-2">
                        <div className="mt-3">
                          <span className="font-bold text-gray-700">
                            Tarif :
                          </span>
                          <p className="font-[600] text-slate-500">
                            {supplier?.conditions[0].tarif}
                          </p>
                        </div>

                        <div className="mt-3">
                          <span className="font-bold text-gray-700">
                            Devise :
                          </span>
                          <p className="font-[600] text-slate-500">
                            {supplier?.conditions[0].currency}
                          </p>
                        </div>
                      </div>
                    )}
                    {isModify ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-5">
                        <fieldset className="flex justify-center">
                          <legend className="text-sm font-medium text-gray-800 text-center">
                            RFA :
                          </legend>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <input
                                type="radio"
                                id="rfa"
                                name="rfa"
                                value="oui"
                              />
                              <label htmlFor="rfa-oui">Oui</label>
                            </div>

                            <div className="flex items-center gap-2">
                              <input
                                type="radio"
                                id="rfa"
                                name="rfa"
                                value="non"
                              />
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
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-5">
                        <div className="mt-3">
                          <span className="font-bold text-gray-700">
                            RFA :
                          </span>
                          <p className="font-[600] text-slate-500 capitalize">
                            {supplier?.conditions[0].rfa}
                          </p>
                        </div>
                        <div className="mt-3">
                          <span className="font-bold text-gray-700">
                            Prix nets :
                          </span>
                          <p className="font-[600] text-slate-500 capitalize">
                            {supplier?.conditions[0].net_price}
                          </p>
                        </div>
                        <div className="mt-3">
                          <span className="font-bold text-gray-700">
                            Prix nets :
                          </span>
                          <p className="font-[600] text-slate-500 capitalize">
                            {supplier?.conditions[0].net_price}
                          </p>
                        </div>
                      </div>
                    )}
                    {isModify ? (
                      <div className="text-center mt-[30px]">
                        <span className="font-bold text-gray-700">
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
                            <label
                              htmlFor="payment-45j"
                              className="text-[13px]"
                            >
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
                            <label
                              htmlFor="payment-10j"
                              className="text-[13px]"
                            >
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
                            <label
                              htmlFor="payment-60j"
                              className="text-[13px]"
                            >
                              60 jours date facture
                            </label>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-3">
                        <span className="font-bold text-gray-700">
                          Condition de paiement :
                        </span>
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-2 mt-2">
                          {supplier?.conditions[0].paiement_condition ? (
                            <p className="font-[600] text-slate-500 capitalize">
                              {supplier?.conditions[0].paiement_condition}
                            </p>
                          ) : (
                            <p className="text-xl font-bold text-slate-400">
                              N/C
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {isModify ? (
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
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-5">
                        <div>
                          <span className="font-bold text-gray-700">
                            Franco :
                          </span>
                          <p className="font-[600] text-slate-500 capitalize">
                            {supplier?.conditions[0].franco}
                          </p>
                        </div>
                        <div>
                          <span className="font-bold text-gray-700">
                            Validité des tarifs :
                          </span>
                          <p className="font-[600] text-slate-500 capitalize">
                            {supplier?.conditions[0].validate_tarif}
                          </p>
                        </div>
                        <div>
                          <span className="font-bold text-gray-700">
                            Budget marketing :
                          </span>
                          <p className="font-[600] text-slate-500 capitalize">
                            {supplier?.conditions[0].budget} €
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </FormSection>
              </div>
              {/* Partie buttons */}
              {!isLoading ? (
                <div className="mt-[50px] flex gap-2">
                  <button
                    className="w-full bg-[#9FA6B2] text-white py-2 rounded-md font-[600] hover:bg-[#bac3d4] hover:text-white shadow-md"
                    type="button"
                  >
                    Annuler
                  </button>
                  <button
                    className="w-full bg-[#3B71CA] text-white py-2 rounded-md font-[600] hover:bg-sky-500 shadow-md"
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
              <FormSection title="Marques">
                {isModify ? (
                  <div className="mt-3">
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
                ) : (
                  <div className="mt-3">
                    <div className="flex flex-col mt-2">
                      {supplier?.brand_id.map((brand, index) => (
                        <span className="font-[600] text-slate-500 capitalize">
                          {brand.label}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </FormSection>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
