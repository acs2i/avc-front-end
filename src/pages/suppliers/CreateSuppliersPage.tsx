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

interface FormData {
  creator_id: any;
  code: string;
  social: string;
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
  tarif: string;
  tarif_validate: string;
  discount: string;
  rfa: string;
  price_net: string;
  tag: string;
  paymentCondition: string;
  franco: string;
  budget: string;
  brands: string[];
}

type BrandOption = {
  value: string;
  label: string;
  YX_CODE: string;
  YX_LIBELLE: string;
  _id: string;
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
  const [selectedOptionBrand, setSelectedOptionBrand] =
    useState<SingleValue<BrandOption> | null>(null);
  const [optionsBrand, setOptionsBrand] = useState<BrandOption[]>([]);
  const [brands, setBrands] = useState<SingleValue<BrandOption>[]>([null]); // État initial avec un élément
  const { notifySuccess, notifyError } = useNotify();
  const [isLoading, setIsLoading] = useState(false);
  const [addFieldIsVisible, setaddFieldIsVisible] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    creator_id: creatorId._id,
    code: "",
    social: "",
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
    tarif: "PAEU",
    tarif_validate: "",
    discount: "",
    rfa: "non",
    price_net: "non",
    tag: "non",
    paymentCondition: "45 jours fin du mois",
    franco: "",
    budget: "",
    brands: [""],
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
      brands: updatedBrands.map((brand) => brand?._id || ""),
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
          value: brand.YX_LIBELLE,
          label: brand.YX_LIBELLE,
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
        `${process.env.REACT_APP_URL_DEV}/api/v1/brand/search?YX_LIBELLE=${inputValueBrand}&page=${currentPage}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();

      const optionsBrand = data.data?.map((brand: BrandOption) => ({
        value: brand.YX_LIBELLE,
        label: brand.YX_LIBELLE,
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

  const handleRfaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      rfa: e.target.value,
    });
  };

  const handlePriceNetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      price_net: e.target.value,
    });
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      tag: e.target.value,
    });
  };

  const handlePaymentConditionChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      paymentCondition: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/draft`,
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
          navigate("/draft");
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
  console.log(formData);
  return (
    <section className="w-full bg-slate-50 p-7">
      <div className="max-w-[2024px] mx-auto">
        <form onSubmit={handleSubmit} className="mb-[400px]">
          <div className="flex justify-between">
            <div>
              <h3 className="text-[32px] font-[800] text-gray-800">
                Créer un fournisseur
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
                    Enregistrer
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
              <h4 className="absolute top-[-15px] left-[20px] px-2 text-[20px] text-gray-600 bg-slate-50 font-[700]">
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
                    id="social"
                    label="Raison sociale :"
                    value={formData.social}
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
              <h4 className="absolute top-[-15px] left-[20px] px-2 text-[20px] text-gray-600 bg-slate-50 font-[700]">
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
                  placeholder="14 rue mon adresse"
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
                  placeholder="14 rue mon adresse"
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
                  placeholder="75001"
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
              <h4 className="absolute top-[-15px] left-[20px] px-2 text-[20px] text-gray-600 bg-slate-50 font-[700]">
                Contacts
              </h4>
              {/* Partie contacts */}
              <div className="border border-gray-300 p-3 rounded-md">
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    element="input"
                    id="address_1"
                    label="Nom :"
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
                    label="Prénom :"
                    value={formData.address_2}
                    onChange={handleChange}
                    validators={[]}
                    placeholder="14 rue mon adresse"
                    create
                    gray
                  />
                </div>
                <Input
                  element="input"
                  id="address_2"
                  label="Fonction :"
                  value={formData.address_2}
                  onChange={handleChange}
                  validators={[]}
                  placeholder="14 rue mon adresse"
                  create
                  gray
                />
                <div className="grid grid-cols-2 gap-2">
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
                  <Input
                    element="input"
                    id="address_2"
                    label="Mobile :"
                    value={formData.address_2}
                    onChange={handleChange}
                    validators={[]}
                    placeholder="14 rue mon adresse"
                    create
                    gray
                  />
                </div>
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
              </div>
            </div>
            {/* Partie marques */}
            <div className="relative w-[30%] flex flex-col gap-3">
              <h4 className="absolute top-[-15px] left-[20px] px-2 text-[20px] text-gray-600 bg-slate-50 font-[700]">
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
                      required
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

          <div className="relative w-full flex flex-col gap-3  mt-[50px]">
            <h4 className="absolute top-[-15px] left-[20px] px-2 text-[20px] text-gray-600 bg-slate-50 font-[700]">
              Tarifs & conditions
            </h4>
            {/* Partie tarifs */}
            <div className="border border-gray-300 p-3 rounded-md">
              <div className="grid grid-cols-2 gap-2">
                <Input
                  element="input"
                  id="tarif"
                  label="Tarif :"
                  value={formData.tarif}
                  onChange={handleChange}
                  validators={[]}
                  placeholder="Renseignez le tarif du fournisseur"
                  create
                  gray
                />
                <Input
                  element="select"
                  id="currency"
                  label="Devise :"
                  value={formData.currency}
                  onChange={handleChange}
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
                        id="rfa-oui"
                        name="rfa"
                        value="oui"
                        checked={formData.rfa === "oui"}
                        onChange={handleRfaChange}
                      />
                      <label htmlFor="rfa-oui">Oui</label>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        id="rfa-non"
                        name="rfa"
                        value="non"
                        checked={formData.rfa === "non"}
                        onChange={handleRfaChange}
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
                        id="price-oui"
                        name="price-net"
                        value="oui"
                        checked={formData.price_net === "oui"}
                        onChange={handlePriceNetChange}
                      />
                      <label htmlFor="price-oui">Oui</label>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        id="price-non"
                        name="price-net"
                        value="non"
                        checked={formData.price_net === "non"}
                        onChange={handlePriceNetChange}
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
                        id="tag-oui"
                        name="tag"
                        value="oui"
                        checked={formData.tag === "oui"}
                        onChange={handleTagChange}
                      />
                      <label htmlFor="tag-oui">Oui</label>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        id="tag-non"
                        name="tag"
                        value="non"
                        checked={formData.tag === "non"}
                        onChange={handleTagChange}
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
                      id="payment-45j"
                      name="paymentCondition"
                      value="45 jours fin du mois"
                      checked={
                        formData.paymentCondition === "45 jours fin du mois"
                      }
                      onChange={handlePaymentConditionChange}
                    />
                    <label htmlFor="payment-45j" className="text-[13px]">
                      45 jours fin du mois
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="payment-10j"
                      name="paymentCondition"
                      value="10 jours réception facture avec escompte supplémentaire"
                      checked={
                        formData.paymentCondition ===
                        "10 jours réception facture avec escompte supplémentaire"
                      }
                      onChange={handlePaymentConditionChange}
                    />
                    <label htmlFor="payment-10j" className="text-[13px]">
                      10 jours réception facture avec escompte supplémentaire
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="payment-60j"
                      name="paymentCondition"
                      value="60 jours date facture"
                      checked={
                        formData.paymentCondition === "60 jours date facture"
                      }
                      onChange={handlePaymentConditionChange}
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
                  value={formData.franco}
                  onChange={handleChange}
                  validators={[]}
                  placeholder="Ex: 500 EUR, 1000 USD..."
                  create
                  gray
                />
                <Input
                  element="input"
                  id="tarif_validate"
                  label="Validité des tarifs :"
                  value={formData.tarif_validate}
                  onChange={handleChange}
                  validators={[]}
                  placeholder="Ex: 6 mois, 1 mois..."
                  create
                  gray
                />
                <Input
                  element="input"
                  id="budget"
                  label="Budget marketing :"
                  value={formData.budget}
                  onChange={handleChange}
                  validators={[]}
                  placeholder="Ex: 5000 EUR par an"
                  create
                  gray
                />
              </div>
            </div>
          </div>

          <div className="relative w-full flex flex-col gap-3 mt-[50px]">
            <h4 className="absolute top-[-15px] left-[20px] px-2 text-[20px] text-gray-600 bg-slate-50 font-[700]">
              Informations additionelles
            </h4>
            {/* Partie tarifs */}
            <div className="border border-gray-300 p-3">
              <div className="py-[5px] w-[90%] mx-auto">
                {additionalFields.map((field, index) => (
                  <div key={index} className="relative grid grid-cols-2 gap-2">
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
              {/* 
             
                <Input
                  element="textarea"
                  id="discount"
                  label="Remises applicables :"
                  value={formData.discount}
                  onChange={handleChange}
                  validators={[]}
                  placeholder="Indiquez les remises applicables (ex : 10% sur les commandes de plus de 100 unités)"
                  create
                  gray
                /> */}
            </div>
          </div>

          {/* Partie buttons */}
          <div className="mt-[50px] w-[50%] mx-auto">
            <button
              className="w-full bg-sky-600 text-white py-2 rounded-md font-[600] hover:bg-sky-500 shadow-md"
              type="submit"
            >
              Créer le fournisseur
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
