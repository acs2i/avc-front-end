import React, { useState, useEffect } from "react";
import Input from "../../components/FormElements/Input";
import { useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";
import { CircleSlash2, Plus, Trash, X } from "lucide-react";
import CreatableSelect from "react-select/creatable";
import { SingleValue } from "react-select";
import Button from "../../components/FormElements/Button";
import useNotify from "../../utils/hooks/useToast";
import { CircularProgress, Collapse } from "@mui/material";
import FormSection from "../../components/Formulaires/FormSection";
import BrandSection from "../../components/Formulaires/BrandSection";
import DynamicField from "../../components/FormElements/DynamicField";

interface BrandId {
  _id: string;
  label: string;
}

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

interface Supplier {
  creator_id: any;
  code: string;
  company_name: string;
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
  brand_id: BrandId[];
  contacts: Contact[];
  conditions: Condition[];
  additional_fields: any[];
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
  brand_id: any[];
  additional_fields: any[];
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
  const [supplier, setSupplier] = useState<Supplier>();
  const creatorId = useSelector((state: any) => state.auth.user);
  const token = useSelector((state: any) => state.auth.token);
  const limit = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [inputValueBrand, setInputValueBrand] = useState("");
  const [isModify, setIsModify] = useState(false);
  const [optionsBrand, setOptionsBrand] = useState<BrandOption[]>([]);
  const [userFields, setUserFields] = useState<UserField[]>([]);
  const [fieldValues, setFieldValues] = useState<{ [key: string]: any }>({});
  const [selectedOptionBrand, setSelectedOptionBrand] =
    useState<SingleValue<BrandOption> | null>(null);
  const [brandLabel, setBrandLabel] = useState("");
  const [brands, setBrands] = useState<SingleValue<BrandOption>[]>([]);
  const { notifySuccess, notifyError } = useNotify();
  const [isLoading, setIsLoading] = useState(false);
  const [addFieldIsVisible, setaddFieldIsVisible] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    creator_id: creatorId._id,
    code: supplier?.code || "",
    company_name: supplier?.company_name || "",
    phone: supplier?.phone || "",
    email: supplier?.email || "",
    web_url: supplier?.web_url || "",
    siret: supplier?.siret || "",
    tva: supplier?.tva || "",
    address_1: supplier?.address_1 || "",
    address_2: supplier?.address_2 || "",
    address_3: supplier?.address_3 || "",
    city: supplier?.city || "",
    postal: supplier?.postal || "",
    country: supplier?.country || "",
    currency: supplier?.currency || "",
    additional_fields: [],
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

  useEffect(() => {
    if (supplier) {
      setFormData({
        creator_id: creatorId._id,
        code: supplier.code || "",
        company_name: supplier.company_name || "",
        phone: supplier.phone || "",
        email: supplier.email || "",
        web_url: supplier.web_url || "",
        siret: supplier.siret || "",
        tva: supplier.tva || "",
        address_1: supplier.address_1 || "",
        address_2: supplier.address_2 || "",
        address_3: supplier.address_3 || "",
        city: supplier.city || "",
        postal: supplier.postal || "",
        country: supplier.country || "",
        currency: supplier.currency || "",
        brand_id: supplier.brand_id.map((brand) => brand._id),
        additional_fields: [],
        contacts: supplier.contacts || [
          {
            firstname: "",
            lastname: "",
            function: "",
            phone: "",
            mobile: "",
            email: "",
          },
        ],
        conditions: supplier.conditions || [
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
    }
  }, [supplier, creatorId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

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
        notifySuccess("Fournisseur modifié avec succès !");
        window.location.reload();
        setIsLoading(false);
      } else {
        notifyError("Erreur lors de la modification !");
      }
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  const handleChangeBrand = (
    selectedOption: SingleValue<BrandOption>,
    index: number
  ) => {
    if (!selectedOption || !selectedOption._id) {
      console.error("Invalid brand selection");
      return;
    }

    setBrands((prevBrands) => {
      const updatedBrands = [...prevBrands];
      updatedBrands[index] = selectedOption;
      return updatedBrands;
    });

    setFormData((prevFormData) => {
      const updatedBrandIds = [...prevFormData.brand_id];
      updatedBrandIds[index] = selectedOption._id;
      return {
        ...prevFormData,
        brand_id: updatedBrandIds,
      };
    });
  };

  const addBrandField = () => {
    setBrands((prevBrands) => [...prevBrands, null]);

    setFormData((prevFormData) => {
      const newBrandIdArray = [...prevFormData.brand_id];

      return {
        ...prevFormData,
        brand_id: newBrandIdArray,
      };
    });
  };

  const removeBrandField = (index: number) => {
    setBrands((prevBrands) => prevBrands.filter((_, i) => i !== index));
    setFormData((prevFormData) => ({
      ...prevFormData,
      brand_id: brands
        .filter((_, i) => i !== index)
        .map((brand) => brand?._id || ""),
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

  const handleFieldChange = (
    label: string,
    field_type: string, // Ajout du type de champ
    id: string,
    newValue: string
  ) => {
    // Mettre à jour fieldValues pour le contrôle local
    setFieldValues((prevValues) => ({
      ...prevValues,
      [id]: newValue, // Met à jour l'état local du champ
    }));

    // Mettre à jour formData.additional_fields pour avoir un tableau d'objets
    setFormData((prevFormData) => {
      const updatedAdditionalFields = [...prevFormData.additional_fields];

      // Vérifier si un champ avec ce label existe déjà
      const fieldIndex = updatedAdditionalFields.findIndex(
        (field) => field.label === label
      );

      if (fieldIndex !== -1) {
        // Mettre à jour la valeur et le type si le champ existe
        updatedAdditionalFields[fieldIndex].value = newValue;
        updatedAdditionalFields[fieldIndex].field_type = field_type;
      } else {
        // Ajouter un nouveau champ s'il n'existe pas encore
        updatedAdditionalFields.push({ label, value: newValue, field_type });
      }

      return {
        ...prevFormData,
        additional_fields: updatedAdditionalFields,
      };
    });
  };

  useEffect(() => {
    fetchField();
  }, []);

  console.log(formData);
  return (
    <section className="w-full bg-slate-50 p-7">
      <div className="max-w-[2024px] mx-auto">
        <form className="mb-[400px]" onSubmit={handleSubmit}>
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
                      {isModify ? "Annuler la modification" : "Modifier"}
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

            <FormSection
              title="Identification"
              size={`${!isModify ? "h-[400px]" : "h-[500px]"}`}
            >
              <div className="mt-3">
                {isModify ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <Input
                      element="input"
                      id="code"
                      label="Code fournisseur :"
                      value={formData.code}
                      onChange={handleChange}
                      validators={[]}
                      placeholder={supplier?.code}
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
                      placeholder={supplier?.company_name}
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
                      placeholder={supplier?.siret}
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
                      placeholder={supplier?.tva}
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
                      <span className="font-bold text-gray-700">Siret :</span>
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
                      <span className="font-bold text-gray-700">Email :</span>
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
                      value={formData.web_url}
                      onChange={handleChange}
                      validators={[]}
                      placeholder={supplier?.web_url}
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
                      placeholder={supplier?.email}
                      create
                      gray
                    />
                    <Input
                      element="phone"
                      id="phone"
                      label="Téléphone :"
                      value={formData.phone}
                      onChange={handleChange}
                      validators={[]}
                      placeholder={supplier?.phone}
                      create
                      gray
                    />
                  </>
                )}
              </div>
            </FormSection>
            <FormSection
              title="Adresse"
              size={`${!isModify ? "h-[400px]" : "h-[500px]"}`}
            >
              <div className="mt-3">
                {isModify ? (
                  <>
                    <Input
                      element="input"
                      id="address_1"
                      label="Adresse 1 :"
                      value={formData.address_1}
                      onChange={handleChange}
                      validators={[]}
                      placeholder={supplier?.address_1}
                      gray
                    />
                    <Input
                      element="input"
                      id="address_2"
                      label="Adresse 2 :"
                      value={formData.address_2}
                      onChange={handleChange}
                      validators={[]}
                      placeholder={supplier?.address_2}
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
                      placeholder={supplier?.address_3}
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
                      placeholder={supplier?.city}
                      create
                      gray
                    />
                    <Input
                      element="input"
                      id="postal"
                      label="Code postal :"
                      value=""
                      onChange={handleChange}
                      validators={[]}
                      placeholder={supplier?.postal}
                      create
                      gray
                    />
                    <Input
                      element="input"
                      id="country"
                      label="Pays :"
                      value=""
                      onChange={handleChange}
                      validators={[]}
                      placeholder={supplier?.country}
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
                      <span className="font-bold text-gray-700">Ville :</span>
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
                      <span className="font-bold text-gray-700">Pays :</span>
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
          <div className="flex gap-4 mt-[30px]">
            {/* Partie tarifs */}

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
                          id="firstname"
                          label="Prénom :"
                          value={contact.firstname}
                          onChange={handleContactChange(index)}
                          validators={[]}
                          placeholder={
                            supplier?.contacts &&
                            supplier.contacts[index]?.firstname
                              ? supplier.contacts[index].firstname
                              : ""
                          }
                          create
                          gray
                        />
                        <Input
                          element="input"
                          id="lastname"
                          label="Nom :"
                          value={contact.lastname}
                          onChange={handleContactChange(index)}
                          validators={[]}
                          placeholder={
                            supplier?.contacts &&
                            supplier.contacts[index]?.lastname
                              ? supplier.contacts[index].lastname
                              : ""
                          }
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
                        placeholder={
                          supplier?.contacts &&
                          supplier.contacts[index]?.function
                            ? supplier.contacts[index].function
                            : ""
                        }
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
                          placeholder={
                            supplier?.contacts &&
                            supplier.contacts[index]?.phone
                              ? supplier.contacts[index].phone
                              : ""
                          }
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
                          placeholder={
                            supplier?.contacts &&
                            supplier.contacts[index]?.mobile
                              ? supplier.contacts[index].mobile
                              : ""
                          }
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
                        placeholder={
                          supplier?.contacts && supplier.contacts[index]?.email
                            ? supplier.contacts[index].email
                            : ""
                        }
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
                    onClick={() => addContactField()}
                    className="flex items-center gap-2 text-[12px] text-orange-500 mt-3"
                  >
                    <Plus size={17} />
                    Ajouter un contact
                  </button>
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
            <FormSection title="Marques">
              <div className="mt-3">
                {isModify && (
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
                )}

                {/* Afficher les marques ajoutées */}
                {supplier?.brand_id.map((brand, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 mt-2 bg-gray-600 justify-center py-3 relative rounded-md"
                  >
                    <span className="font-[600] text-white capitalize">
                      {brand?.label}
                    </span>
                    <button
                      type="button"
                      className="text-white hover:text-gray-300 absolute right-[13px]"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </FormSection>
          </div>
          <div className="mt-[30px] w-[50%]">
            {!isModify &&
              supplier &&
              supplier?.additional_fields.length > 0 && (
                <FormSection title="Champs additionnels">
                  <div>
                    {userFields
                      .filter((field) => field.apply_to === "Fournisseur")
                      .map((field: any, index: number) => {
                        const supplierField = supplier.additional_fields.find(
                          (supField: any) => supField.label === field.label
                        );

                        return (
                          <div
                            key={index}
                            className="grid grid-cols-12 gap-2 py-2"
                          >
                            <span className="col-span-6 font-[700] text-slate-500 text-[13px]">
                              {field.label} :
                            </span>

                            <span className="col-span-6 text-gray-600 whitespace-nowrap overflow-ellipsis overflow-hidden text-[14px]">
                              {supplierField?.value || "Non renseigné"}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </FormSection>
              )}
            {isModify && (
              <FormSection title="Champs additionnels">
                <div>
                  {userFields && userFields.length > 0 && (
                    <div className="mt-3">
                      {userFields
                        .filter((field) => field.apply_to === "Fournisseur")
                        .map((field) => (
                          <div key={field._id} className="mb-6">
                            <h3 className="text-md font-semibold text-gray-800 mb-1">
                              {field.label}
                            </h3>
                            {field.additional_fields.map(
                              (customField, index) => (
                                <div
                                  key={`${field._id}-${index}`}
                                  className="mb-4"
                                >
                                  <DynamicField
                                    id={`${field._id}-${index}`}
                                    name={customField.field_name}
                                    fieldType={customField.field_type}
                                    value={
                                      fieldValues[`${field._id}-${index}`] || ""
                                    }
                                    onChange={(e) =>
                                      handleFieldChange(
                                        field.label,
                                        customField.field_type,
                                        `${field._id}-${index}`,
                                        e.target.value
                                      )
                                    }
                                    options={customField.options}
                                  />
                                </div>
                              )
                            )}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </FormSection>
            )}
          </div>
          {!isLoading ? (
            <div className="mt-[50px] flex gap-2">
              {isModify && (
                <>
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
                </>
              )}
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
