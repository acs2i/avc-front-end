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

export default function CreateSupplierPage() {
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

  const currencies = [
    { value: "EUR", label: "Euro (EUR)", name: "EUR" },
    { value: "USD", label: "United States Dollar (USD)", name: "USD" },
    { value: "GBP", label: "British Pound (GBP)", name: "GBP" },
    { value: "JPY", label: "Japanese Yen (JPY)", name: "JPY" },
  ];

  const handleChangeBrand = (
    selectedOption: SingleValue<BrandOption>,
    index: number
  ) => {
    const updatedBrands = [...brands];
    updatedBrands[index] = selectedOption;
    setBrands(updatedBrands);
    setFormData((prevFormData) => ({
      ...prevFormData,
      brand_id: updatedBrands.map((brand) => brand?._id || ""),
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
          value: brand.label,
          label: brand.label,
          _id: brand._id,
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
        value: brand.label,
        label: brand.label,
        _id: brand._id,
      }));

      setOptionsBrand(optionsBrand);
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handlePhoneChange = (value: string | undefined) => {
    setFormData({
      ...formData,
      phone: value || "",
    });
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

  const handleConditionChange =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const { id, value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        conditions: prevData.conditions.map((condition, i) =>
          i === index ? { ...condition, [id]: value } : condition
        ),
      }));
    };

  const addBrandField = () => {
    setBrands([...brands, null]);
  };

  const removeBrandField = (index: number) => {
    if (brands.length === 1) return; // Ne pas permettre de supprimer si un seul champ
    const updatedBrands = brands.filter((_, i) => i !== index);
    setBrands(updatedBrands);
    setFormData((prevFormData) => ({
      ...prevFormData,
      brands: updatedBrands.map((brand) => brand?.value || ""),
    }));
  };

  const addField = () => {
    setAdditionalFields([...additionalFields, { name: "", value: "" }]);
  };

  const removeField = (index: any) => {
    const updatedFields = additionalFields.filter((_, i) => i !== index);
    setAdditionalFields(updatedFields);
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/supplier`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        setTimeout(() => {
          notifySuccess("Brouillon créé !");
          setIsLoading(false);
          navigate("/suppliers/suppliers-list");
        }, 1000);
      } else {
        notifyError("Erreur lors de la création !");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Erreur lors de la requête", error);
      setIsLoading(false);
    }
  };

  console.log(formData);
  return (
    <section className="w-full bg-slate-50 p-7">
      <div className="max-w-[2024px] mx-auto">
        <form onSubmit={handleSubmit} className="mb-[400px]">
          <div className="flex justify-between">
            <div>
              <h3 className="text-[32px] font-[800] text-gray-800">
                Créer <span className="font-[200]">un fournisseur</span>
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
                    Créer le fournisseur
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
              <div className="border border-gray-300 h-[450px] p-3 rounded-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <Input
                    element="input"
                    id="code"
                    label="Code fournisseur :"
                    value={formData.code}
                    onChange={handleChange}
                    validators={[]}
                    placeholder="Ajouter le code fournisseur"
                    create
                    gray
                  />
                  <Input
                    element="input"
                    id="company_name"
                    label="Raison sociale :"
                    value={formData.company_name}
                    onChange={handleChange}
                    validators={[]}
                    placeholder="Ajouter la raison sociale"
                    create
                    gray
                  />
                  <Input
                    element="input"
                    id="siret"
                    label="Siret :"
                    value={formData.siret}
                    onChange={handleChange}
                    validators={[]}
                    placeholder="Entrer le numéro SIRET (14 chiffres)"
                    create
                    gray
                  />
                  <Input
                    element="input"
                    id="tva"
                    label="N°TVA intracom :"
                    value={formData.tva}
                    onChange={handleChange}
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
                  value={formData.web_url}
                  onChange={handleChange}
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
                  value={formData.email}
                  onChange={handleChange}
                  validators={[]}
                  placeholder="ex: email@email.fr"
                  create
                  gray
                />
                <Input
                  element="phone"
                  id="phone"
                  label="Téléphone :"
                  value={formData.phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
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
              <div className="border border-gray-300 h-[450px] p-3 rounded-md">
                <Input
                  element="input"
                  id="address_1"
                  label="Adresse 1 :"
                  value={formData.address_1}
                  onChange={handleChange}
                  validators={[]}
                  placeholder="14 rue mon adresse"
                  create
                  gray
                />
                <Input
                  element="input"
                  id="address_2"
                  label="Adresse 2 :"
                  value={formData.address_2}
                  onChange={handleChange}
                  validators={[]}
                  placeholder="Complément d'adresse"
                  create
                  gray
                />
                <Input
                  element="input"
                  id="address_3"
                  label="Adresse 3 :"
                  value={formData.address_3}
                  onChange={handleChange}
                  validators={[]}
                  placeholder="Complément d'adresse"
                  create
                  gray
                />

                <Input
                  element="input"
                  id="postal"
                  label="Code postal :"
                  value={formData.postal}
                  onChange={handleChange}
                  validators={[]}
                  placeholder="75019"
                  create
                  gray
                />
                <Input
                  element="input"
                  id="country"
                  label="Pays :"
                  value={formData.country}
                  onChange={handleChange}
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
              {/* Partie contacts */}
              <h4 className="absolute top-[-12px] left-[20px] px-2 text-[17px] text-gray-600 bg-slate-50 font-[400]">
                Contacts
              </h4>
              {formData.contacts.map((contact, index) => (
                <div
                  className="border border-gray-300 p-3 rounded-md"
                  key={index}
                >
                  <div className="mt-5 flex items-center gap-2">
                    <span className="italic text-gray-600 text-[12px] font-[700]">Contact {index + 1}</span>
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
              <button
                type="button"
                onClick={addContactField}
                className="flex items-center gap-2 text-[12px] text-orange-400 mt-1"
              >
                <Plus size={17} />
                Ajouter un contact
              </button>
              {/* Partie tarifs */}
              <div className="relative w-full flex flex-col gap-3 mt-[50px]">
                <h4 className="absolute top-[-12px] left-[20px] px-2 text-[17px] text-gray-600 bg-slate-50 font-[400]">
                  Tarifs & conditions
                </h4>

                <div className="border border-gray-300 p-3 rounded-md">
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      element="input"
                      id="tarif"
                      label="Tarif :"
                      value={formData.conditions[0].tarif}
                      onChange={handleConditionChange(0)}
                      validators={[]}
                      placeholder="Tapez un tarif"
                      create
                      gray
                    />
                    <Input
                      element="select"
                      id="currency"
                      label="Devise :"
                      value={formData.conditions[0].currency}
                      onChange={handleConditionChange(0)}
                      validators={[]}
                      options={currencies}
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
                          <input
                            type="radio"
                            id="rfa"
                            name="rfa"
                            value="oui"
                            checked={formData.conditions[0].rfa === "oui"}
                            onChange={handleConditionChange(0)}
                          />
                          <label htmlFor="rfa-oui">Oui</label>
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            id="rfa"
                            name="rfa"
                            value="non"
                            checked={formData.conditions[0].rfa === "non"}
                            onChange={handleConditionChange(0)}
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
                            checked={formData.conditions[0].net_price === "oui"}
                            onChange={handleConditionChange(0)}
                          />
                          <label htmlFor="price-oui">Oui</label>
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            id="net_price"
                            name="price-net"
                            value="non"
                            checked={formData.conditions[0].net_price === "non"}
                            onChange={handleConditionChange(0)}
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
                            checked={formData.conditions[0].labeling === "oui"}
                            onChange={handleConditionChange(0)}
                          />
                          <label htmlFor="tag-oui">Oui</label>
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            id="labeling"
                            name="tag"
                            value="non"
                            checked={formData.conditions[0].labeling === "non"}
                            onChange={handleConditionChange(0)}
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
                          checked={
                            formData.conditions[0].paiement_condition ===
                            "45 jours fin du mois"
                          }
                          onChange={handleConditionChange(0)}
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
                          checked={
                            formData.conditions[0].paiement_condition ===
                            "10 jours réception facture avec escompte supplémentaire"
                          }
                          onChange={handleConditionChange(0)}
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
                          checked={
                            formData.conditions[0].paiement_condition ===
                            "60 jours date facture"
                          }
                          onChange={handleConditionChange(0)}
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
                      value={formData.conditions[0].franco}
                      onChange={handleConditionChange(0)}
                      validators={[]}
                      placeholder="Ex: 500 EUR, 1000 USD..."
                      create
                      gray
                    />
                    <Input
                      element="input"
                      id="validate_tarif"
                      label="Validité des tarifs :"
                      value={formData.conditions[0].validate_tarif}
                      onChange={handleConditionChange(0)}
                      validators={[]}
                      placeholder="Ex: 6 mois, 1 mois..."
                      create
                      gray
                    />
                    <Input
                      element="input"
                      id="budget"
                      label="Budget marketing :"
                      value={formData.conditions[0].budget}
                      onChange={handleConditionChange(0)}
                      validators={[]}
                      placeholder="Ex: 5000 EUR par an"
                      create
                      gray
                    />
                  </div>
                </div>
              </div>
              {/* Partie infos additionelles */}
              <div className="relative w-full flex flex-col gap-3 mt-[50px]">
                <h4 className="absolute top-[-12px] left-[20px] px-2 text-[17px] text-gray-600 bg-slate-50 font-[400]">
                  Informations additionelles
                </h4>

                <div className="border border-gray-300 p-3">
                  <div className="py-[5px] w-[90%] mx-auto">
                    {additionalFields.map((field, index) => (
                      <div
                        key={index}
                        className="relative grid grid-cols-2 gap-2"
                      >
                        <Input
                          element="input"
                          id={`name-${index}`}
                          label="Nom du champ :"
                          value={field.name}
                          validators={[]}
                          placeholder=""
                          create
                          gray
                        />
                        <Input
                          element="input"
                          id={`value-${index}`}
                          label="Valeur du champ :"
                          value={field.value}
                          validators={[]}
                          placeholder=""
                          create
                          gray
                        />
                        <button
                          type="button"
                          onClick={() => removeField(index)}
                          className="absolute top-[50%] translate-y-[50%] right-[-25px] text-red-500 hover:text-red-300"
                        >
                          <Trash size={15} />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addField}
                      className="flex items-center gap-2 text-[12px] text-orange-400 mt-3"
                    >
                      <Plus size={17} />
                      Ajouter un champ
                    </button>
                  </div>
                </div>
              </div>
              {/* Partie buttons */}
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
                  Créer le fournisseur
                </button>
              </div>
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
                      onChange={(option) => handleChangeBrand(option, index)}
                      onInputChange={handleInputChangeBrand}
                      inputValue={inputValueBrand}
                      options={optionsBrand}
                      placeholder="Selectionner une marque"
                      styles={customStyles}
                      className="block text-sm py-1 w-full rounded-lg text-gray-500 border border-gray-200 focus:outline-none focus:ring-0 focus:border-gray-200 peer capitalize"
                    />
                    <button
                      type="button"
                      onClick={() => removeBrandField(index)}
                      className="text-red-500 hover:text-red-300"
                    >
                      <Trash size={20} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addBrandField}
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
