import React, { useState, useEffect } from "react";
import Input from "../../components/FormElements/Input";
import { useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp, Plus, Trash } from "lucide-react";
import FormSection from "../../components/Formulaires/FormSection";
import CreatableSelect from "react-select/creatable";
import { ActionMeta, SingleValue } from "react-select";
import Button from "../../components/FormElements/Button";
import useNotify from "../../utils/hooks/useToast";
import { CircularProgress, Collapse } from "@mui/material";
import BrandSection from "../../components/Formulaires/BrandSection";
import ContactSection from "../../components/Formulaires/ContactSection";
import ConditionSection from "../../components/Formulaires/ConditionsSection";
import DynamicField from "../../components/FormElements/DynamicField";

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
  const [userFields, setUserFields] = useState<UserField[]>([]);
  const { notifySuccess, notifyError } = useNotify();
  const [isLoading, setIsLoading] = useState(false);
  const [addFieldIsVisible, setaddFieldIsVisible] = useState(false);
  const [fieldValues, setFieldValues] = useState<{ [key: string]: any }>({});
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
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFieldChange = (id: string, newValue: string) => {
    setFieldValues((prevValues) => ({
        ...prevValues,
        [id]: newValue,
    }));
};

  useEffect(() => {
    fetchField();
  }, []);

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
          notifySuccess("Fournisseur créé !");
          setIsLoading(false);
          navigate("/suppliers/suppliers-list");
        }, 100);
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
            <FormSection title="Identification" size="h-[550px]">
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
            </FormSection>

            <FormSection title="Adresse" size="h-[550px]">
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
                id="city"
                label="Ville :"
                value={formData.city}
                onChange={handleChange}
                validators={[]}
                placeholder="Ajouter la ville"
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
            </FormSection>
          </div>

          <div className="flex gap-4 mt-[30px]">
            <FormSection title="Contacts">
              {formData.contacts.map((contact, index) => (
                <ContactSection
                  key={index}
                  contact={contact}
                  index={index}
                  handleContactChange={handleContactChange}
                  removeContactField={removeContactField}
                />
              ))}
              <button
                type="button"
                onClick={addContactField}
                className="flex items-center gap-2 text-[12px] text-orange-400 mt-5"
              >
                <Plus size={17} />
                Ajouter un contact
              </button>
            </FormSection>

            <FormSection title="Marques">
              <BrandSection
                brands={brands}
                optionsBrand={optionsBrand}
                handleChangeBrand={handleChangeBrand}
                removeBrandField={removeBrandField}
                addBrandField={addBrandField}
                handleInputChangeBrand={handleInputChangeBrand}
                inputValueBrand={inputValueBrand}
                customStyles={customStyles}
              />
            </FormSection>
          </div>

          <div className="flex gap-4 mt-[30px]">
            <FormSection title="Tarifs & conditions">
              {formData.conditions.map((condition, index) => (
                <ConditionSection
                  key={index}
                  condition={condition}
                  index={index}
                  handleConditionChange={handleConditionChange}
                  currencies={currencies}
                />
              ))}
            </FormSection>
            {userFields && userFields.length > 0 && (
              <FormSection title="Champs additionnels">
                <div className="mt-3">
                  {userFields.filter((field) => field.apply_to === "Fournisseur").map((field) =>
                    field.additional_fields.map((customField, index) => (
                      <div key={`${field._id}-${index}`} className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {customField.field_name}
                        </label>
                        <DynamicField
                          id={`${field._id}-${index}`}
                          name={customField.field_name}
                          fieldType={customField.field_type}
                          value={fieldValues[`${field._id}-${index}`] || ""}
                          onChange={(e) =>
                            handleFieldChange(
                              `${field._id}-${index}`,
                              e.target.value
                            )
                          }
                          options={customField.options}
                        />
                      </div>
                    ))
                  )}
                </div>
              </FormSection>
            )}
          </div>

          {/* Boutons de soumission */}
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
                Créer le fournisseur
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
        </form>
      </div>
    </section>
  );
}
