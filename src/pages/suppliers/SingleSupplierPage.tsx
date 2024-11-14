import React, { useState, useEffect } from "react";
import Input from "../../components/FormElements/Input";
import { useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";
import {
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  CircleSlash2,
  File,
  Plus,
  Trash,
  X,
} from "lucide-react";
import CreatableSelect from "react-select/creatable";
import { SingleValue } from "react-select";
import Button from "../../components/FormElements/Button";
import useNotify from "../../utils/hooks/useToast";
import { CircularProgress, Collapse } from "@mui/material";
import FormSection from "../../components/Formulaires/FormSection";
import BrandSection from "../../components/Formulaires/BrandSection";
import DynamicField from "../../components/FormElements/DynamicField";
import Modal from "../../components/Shared/Modal";
import ContactFormComponent from "../../components/ContactFormComponent";
import { useCollections } from "../../utils/hooks/useCollection";
import CollectionSection from "../../components/Formulaires/CollectionSection";
import { formatDate } from "../../utils/func/formatDate";
import GestionFormComponent from "../../components/GestionFormComponent";
import { useBrands } from "../../utils/hooks/useBrands";
import { useUsers } from "../../utils/hooks/useUsers";
import { useFamily } from "../../utils/hooks/useFamily";
import { useIsoCode } from "../../utils/hooks/useIsoCode";
import IsoCodeSection from "../../components/Formulaires/IsoCodeSection";

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

interface Buyer {
  family: string[];
  user: string;
}

interface Supplier {
  _id: any;
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
  admin: string;
  buyers: Buyer[];
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

interface Commerciale {
  supplier_id: any;
  season: string;
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
  admin: string;
  buyers: Buyer[];
  conditions: Condition[];
  createdAt: any;
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
  admin: string;
  buyers: Buyer[];
  conditions: Condition[];
  status: string;
}

interface FormDataCondition {
  supplier_id: any;
  season: string;
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
  admin: string;
  buyers: Buyer[];
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
  menuPortal: (provided: any) => ({
    ...provided,
    zIndex: 1000,
  }),
};

export default function SingleSupplierPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [supplier, setSupplier] = useState<Supplier>();
  const [conditions, setConditions] = useState<Commerciale[]>([]);
  const [supplierId, setSupplierId] = useState(supplier?._id);
  const creatorId = useSelector((state: any) => state.auth.user);
  const token = useSelector((state: any) => state.auth.token);
  const [contactModalIsOpen, setContactModalIsOpen] = useState(false);
  const [conditionModalIsOpen, setConditionModalIsOpen] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);
  const [gestionModalIsOpen, setGestionModalIsOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [newContact, setNewContact] = useState<Contact>({
    firstname: "",
    lastname: "",
    function: "",
    phone: "",
    mobile: "",
    email: "",
  });
  const limit = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [isModify, setIsModify] = useState(false);
  const [admin, setAdmin] = useState("");
  const [buyers, setBuyers] = useState<Buyer[]>([{ family: [], user: "" }]);
  const [userOptions, setUserOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [searchInputs, setSearchInputs] = useState<{ [key: string]: string }>(
    {}
  );
  const [userFields, setUserFields] = useState<UserField[]>([]);
  const [fieldValues, setFieldValues] = useState<{ [key: string]: any }>({});
  const [selectedOptionBrand, setSelectedOptionBrand] =
    useState<SingleValue<BrandOption> | null>(null);
  const [brandLabel, setBrandLabel] = useState("");
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
    brand_id: supplier?.brand_id || [],
    admin: "",
    buyers: supplier?.buyers || [],
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
    status: "",
  });
  const [formDataCondition, setFormDataCondition] = useState<FormDataCondition>(
    {
      supplier_id: supplier?._id || "",
      season: "",
      code: supplier?.code || "",
      company_name: supplier?.company_name || "",
      siret: supplier?.siret || "",
      tva: supplier?.tva || "",
      web_url: supplier?.web_url || "",
      email: supplier?.email || "",
      phone: supplier?.phone || "",
      address_1: supplier?.address_1 || "",
      address_2: supplier?.address_2 || "",
      address_3: supplier?.address_3 || "",
      city: supplier?.city || "",
      postal: supplier?.postal || "",
      country: supplier?.country || "",
      currency: supplier?.currency || "",
      contacts: supplier?.contacts || [],
      brand_id: supplier?.brand_id.map((brand) => brand._id) || [],
      additional_fields: supplier?.additional_fields || [],
      admin: supplier?.admin || "",
      buyers: supplier?.buyers || [],
      conditions: supplier?.conditions || [],
    }
  );

  console.log(formData);

  const {
    inputValueUser,
    optionsUser,
    users,
    handleChangeUser,
    removeUserField,
    addUserField,
    handleInputChangeUser,
  } = useUsers("", 10);

  const {
    inputValueIsoCode,
    optionsIsoCode,
    isoCodes,
    handleInputChangeIsoCode,
    handleChangeIsoCode,
  } = useIsoCode("", 10);

  const isCreate = true;
  const {
    inputValueBrand,
    optionsBrand,
    brands,
    handleInputChangeBrand,
    handleChangeBrand,
    addBrandField,
    removeBrandField,
  } = useBrands("", 10, isCreate);

  const {
    inputValueFamily,
    optionsFamily,
    selectedFamily,
    setOptionsFamily,
    handleInputChangeFamily,
    handleChangeFamily,
  } = useFamily("", 10);

  useEffect(() => {
    setUserOptions(optionsUser);
  }, [optionsUser]);

  const {
    inputValueCollection,
    optionsCollection,
    selectedCollection,
    handleInputChangeCollection,
    handleChangeCollection,
  } = useCollections("", 10);

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
      setFormData((prevFormData) => ({
        ...prevFormData,
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
        admin: supplier.admin || "",
        buyers: supplier.buyers || [],
        brand_id: supplier.brand_id.map((brand) => brand._id) || [],
        additional_fields: supplier.additional_fields || [],
        contacts: supplier.contacts || [],
        conditions: supplier.conditions || [],
        status: supplier.status || "",
      }));
    }
  }, [supplier, creatorId]);

  useEffect(() => {
    if (selectedCollection) {
      setFormDataCondition((prev) => ({
        ...prev,
        season: selectedCollection.value || "",
      }));
    }
  }, [selectedCollection]);

  const updateFormDataCondition = () => {
    setFormDataCondition((prev) => ({
      ...prev,
      supplier_id: supplier?._id || "",
      season: formDataCondition.season,
      ...formData,
    }));
  };

  useEffect(() => {
    if (formData) {
      updateFormDataCondition();
    }
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleCountryChange = (
    selectedOption: { value: string; label: string } | null
  ) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      country: selectedOption ? selectedOption.value : "",
    }));
  };

  const handleContactChange = (field: keyof Contact, value: string) => {
    setNewContact((prevContact) => {
      const updatedContact = { ...prevContact, [field]: value };
      console.log("Updated Contact:", updatedContact);
      return updatedContact;
    });
  };

  useEffect(() => {
    const selectedBrandIds = brands.map((brand) => brand?._id || "");
    setFormData((prevFormData) => ({
      ...prevFormData,
      brand_id: selectedBrandIds,
    }));
  }, [brands]);

  const updateStatus = async (newStatus: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/supplier/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (response.ok) {
        notifySuccess("Statut du fournisseur mis à jour avec succès !");

        // Mettez à jour à la fois formData et supplier pour refléter le nouveau statut
        setFormData((prevFormData) => ({
          ...prevFormData,
          status: newStatus,
        }));

        setSupplier((prevSupplier) =>
          prevSupplier ? { ...prevSupplier, status: newStatus } : undefined
        );
      } else {
        notifyError("Erreur lors de la mise à jour du statut !");
      }
    } catch (error) {
      console.error("Erreur de requête :", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Assurez-vous que le bouton est contrôlé par supplier.status, pas seulement par formData
  <Button
    blue
    size="small"
    type="button"
    onClick={(e) => {
      e.preventDefault();
      setIsModify(true);
    }}
    disabled={supplier?.status === "I"}
  >
    {isModify ? "Annuler la modification" : "Modifier"}
  </Button>;

  const handleStatusChange = () => {
    const newStatus = formData.status === "A" ? "I" : "A";
    updateStatus(newStatus);
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
    field_type: string,
    id: string,
    newValue: string
  ) => {
    // Mettre à jour `fieldValues`
    setFieldValues((prevValues) => ({
      ...prevValues,
      [id]: newValue,
    }));

    // Mettre à jour `formData.additional_fields`
    setFormData((prevFormData) => {
      const updatedAdditionalFields = [...prevFormData.additional_fields];
      const fieldIndex = updatedAdditionalFields.findIndex(
        (field) => field.label === label
      );

      if (fieldIndex !== -1) {
        updatedAdditionalFields[fieldIndex].value = newValue;
        updatedAdditionalFields[fieldIndex].field_type = field_type;
      } else {
        updatedAdditionalFields.push({ label, value: newValue, field_type });
      }

      return {
        ...prevFormData,
        additional_fields: updatedAdditionalFields,
      };
    });
  };

  // Fonction qui ajoute un contact
  const addContact = (newContact: Contact) => {
    console.log("Adding contact:", newContact);
    setFormData((prevFormData) => {
      const updatedFormData = {
        ...prevFormData,
        contacts: [...prevFormData.contacts, newContact],
      };
      console.log("Updated FormData:", updatedFormData);
      return updatedFormData;
    });

    setSelectedContacts((prevContacts) => [...prevContacts, newContact]);

    setNewContact({
      firstname: "",
      lastname: "",
      function: "",
      phone: "",
      mobile: "",
      email: "",
    });

    setContactModalIsOpen(false);
  };

  const handleSearchInputChange = (inputValue: string, field: string) => {
    setSearchInputs((prev) => ({
      ...prev,
      [field]: inputValue,
    }));

    handleInputChangeUser(inputValue);
  };

  const handleAdminChange = (value: string) => {
    setAdmin(value); // Met à jour l'état local `admin`
    setFormData((prevFormData) => ({
      ...prevFormData,
      admin: value,
    }));
  };

  const handleBuyerChange = (
    index: number,
    field: keyof Buyer,
    value: string | string[] // Champ pouvant être soit un tableau de chaînes soit une chaîne unique
  ) => {
    const updatedBuyers = [...buyers];

    // Vérifier le type de champ attendu et assigner en conséquence
    if (field === "family" && Array.isArray(value)) {
      // Si c'est "family", on attend un tableau de chaînes
      updatedBuyers[index][field] = value as string[];
    } else if (field === "user" && typeof value === "string") {
      // Si c'est "user", on attend une chaîne unique
      updatedBuyers[index][field] = value as string;
    }

    setBuyers(updatedBuyers);
    setFormData((prevFormData) => ({
      ...prevFormData,
      buyers: updatedBuyers,
    }));
  };

  const addBuyer = () => {
    setBuyers((prev) => [...prev, { family: [], user: "" } as Buyer]);
    setFormData((prevFormData) => ({
      ...prevFormData,
      buyers: [...prevFormData.buyers, { family: [], user: "" } as Buyer],
    }));
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

  const handleCreateCondition = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/condition`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formDataCondition),
        }
      );
      if (response.ok) {
        notifySuccess("Condition commerciale crée avec succès !");
        window.location.reload();
        setIsLoading(false);
      } else {
        notifyError("Erreur lors de la création !");
      }
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  const fetchCondition = async () => {
    if (!supplier || !supplier._id) {
      console.error("ID du fournisseur non disponible");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/condition/${supplier._id}`,
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
        setConditions(result || []);
        console.log("Conditions après setConditions:", conditions);
      } else {
        console.error("Erreur lors de la requête");
      }
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    }
  };

  useEffect(() => {
    if (isModify && supplier && supplier.buyers) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        buyers: supplier.buyers,
      }));
    }
  }, [isModify, supplier]);

  useEffect(() => {
    fetchField();
  }, []);

  useEffect(() => {
    if (supplier) {
      fetchCondition();
    }
  }, [supplier]);

  console.log(formData);
  return (
    <>
      <Modal
        show={contactModalIsOpen}
        onCancel={() => setContactModalIsOpen(false)}
        onClose={() => setContactModalIsOpen(false)}
        header="Ajouter un contact"
      >
        <ContactFormComponent
          contact={newContact}
          handleContactChange={handleContactChange}
          addContact={addContact}
          onCloseModal={() => setContactModalIsOpen(false)}
        />
      </Modal>
      <Modal
        show={conditionModalIsOpen}
        onCancel={() => setConditionModalIsOpen(false)}
        onClose={() => setConditionModalIsOpen(false)}
        header="Ajouter une condition commerciale"
      >
        <div className="px-3">
          <label className="text-sm font-medium text-gray-600">Saison</label>
          <CollectionSection
            collection={selectedCollection}
            optionsCollection={optionsCollection}
            handleChangeCollection={handleChangeCollection}
            handleInputChangeCollection={handleInputChangeCollection}
            inputValueCollection={inputValueCollection}
            customStyles={customStyles}
          />
          <div className="mt-3">
            <Button blue size="100" onClick={handleCreateCondition}>
              Générer la condition commerciale
            </Button>
          </div>
        </div>
      </Modal>
      <Modal
        show={gestionModalIsOpen}
        onCancel={() => setGestionModalIsOpen(false)}
        onClose={() => setGestionModalIsOpen(false)}
        header="Ajouter un(e) gestionnaire"
      >
        <GestionFormComponent
          admin={admin}
          buyers={buyers}
          adminOptions={userOptions}
          setAdminSearchInput={(input) =>
            handleSearchInputChange(input, "admin")
          }
          handleAdminChange={handleAdminChange}
          handleBuyerChange={(index, field, value) =>
            handleBuyerChange(index, field, value)
          }
          addBuyer={addBuyer}
          onCloseModal={() => setGestionModalIsOpen(false)}
          userOptions={userOptions}
          handleUserSearchInput={(input, index) =>
            handleSearchInputChange(input, `buyer-${index}`)
          }
          // Ajoutez ces props pour la recherche de familles
          familyOptions={optionsFamily}
          handleFamilySearchInput={handleInputChangeFamily}
        />
      </Modal>
      <section className="w-full bg-slate-50 p-7 min-h-screen">
        <div className="max-w-[2024px] mx-auto">
          <form className="mb-[400px]" onSubmit={handleSubmit}>
            <div className="flex justify-between">
              <div>
                {!isModify ? (
                  <div className="flex items-center gap-2">
                    <div
                      onClick={() => navigate(-1)}
                      className="cursor-pointer"
                    >
                      <ChevronLeft />
                    </div>
                    <h1 className="text-[32px] font-[800]">
                      Fournisseur{" "}
                      <span className="font-[300]">
                        : {supplier?.company_name}
                      </span>
                    </h1>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div
                      onClick={() => navigate(-1)}
                      className="cursor-pointer"
                    >
                      <ChevronLeft />
                    </div>
                    <h1 className="text-[32px] font-[800]">
                      Modification{" "}
                      <span className="font-[300]">
                        du fournisseur : {supplier?.company_name}
                      </span>
                    </h1>
                  </div>
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
                      <div
                        onClick={(e) => {
                          e.preventDefault();
                          handleStatusChange();
                        }}
                        className={`cursor-pointer text-[13px] ${
                          formData.status === "A"
                            ? "text-red-800"
                            : "text-green-600"
                        } font-semibold`}
                      >
                        <span>
                          {formData.status === "A"
                            ? "Désactiver le fournisseur"
                            : "Réactiver le fournisseur"}
                        </span>
                      </div>
                      <Button
                        blue
                        size="small"
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setIsModify(true);
                        }}
                        disabled={supplier?.status === "I"}
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
                      <IsoCodeSection
                        isoCode={isoCodes}
                        optionsIsoCode={optionsIsoCode}
                        handleChangeIsoCode={(selectedOption) => {
                          handleChangeIsoCode(selectedOption, 0);
                          handleCountryChange(selectedOption);
                        }}
                        handleInputChangeIsoCode={handleInputChangeIsoCode}
                        inputValueIsoCode={inputValueIsoCode}
                        customStyles={customStyles}
                      />
                    </>
                  ) : (
                    <>
                      <div className="mt-3 flex items-center gap-3">
                        <span className="font-bold text-gray-700">
                          Adresse 1 :
                        </span>
                        {supplier?.address_1 ? (
                          <p className="font-[600] text-slate-500">
                            {supplier?.address_1}
                          </p>
                        ) : (
                          <div className="font-[600] text-slate-500">
                            <CircleSlash2 size={13} />
                          </div>
                        )}
                      </div>
                      <div className="mt-3 flex items-center gap-3">
                        <span className="font-bold text-gray-700">
                          Adresse 2 :
                        </span>
                        {supplier?.address_2 ? (
                          <p className="font-[600] text-slate-500">
                            {supplier?.address_2}
                          </p>
                        ) : (
                          <div className="font-[600] text-slate-500">
                            <CircleSlash2 size={13} />
                          </div>
                        )}
                      </div>
                      <div className="mt-3 flex items-center gap-3">
                        <span className="font-bold text-gray-700">
                          Adresse 3 :
                        </span>
                        {supplier?.address_3 ? (
                          <p className="font-[600] text-slate-500">
                            {supplier?.address_3}
                          </p>
                        ) : (
                          <div className="font-[600] text-slate-500">
                            <CircleSlash2 size={13} />
                          </div>
                        )}
                      </div>
                      <div className="mt-3 flex items-center gap-3">
                        <span className="font-bold text-gray-700">Ville :</span>
                        {supplier?.city ? (
                          <p className="font-[600] text-slate-500">
                            {supplier?.city}
                          </p>
                        ) : (
                          <div className="font-[600] text-slate-500">
                            <CircleSlash2 size={13} />
                          </div>
                        )}
                      </div>
                      <div className="mt-3 flex items-center gap-3">
                        <span className="font-bold text-gray-700">
                          Code postal :
                        </span>
                        {supplier?.postal ? (
                          <p className="font-[600] text-slate-500">
                            {supplier?.postal}
                          </p>
                        ) : (
                          <div className="font-[600] text-slate-500">
                            <CircleSlash2 size={13} />
                          </div>
                        )}
                      </div>
                      <div className="mt-3 flex items-center gap-3">
                        <span className="font-bold text-gray-700">Pays :</span>
                        {supplier?.country ? (
                          <p className="font-[600] text-slate-500">
                            {supplier?.country}
                          </p>
                        ) : (
                          <div className="font-[600] text-slate-500">
                            <CircleSlash2 size={13} />
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </FormSection>
            </div>
            <div className="flex gap-4 mt-[30px]">
              <FormSection title="Marques">
                <div className="mt-3">
                  {isModify ? (
                    <BrandSection
                      brands={brands}
                      optionsBrand={optionsBrand}
                      handleChangeBrand={handleChangeBrand}
                      removeBrandField={removeBrandField}
                      addBrandField={addBrandField}
                      handleInputChangeBrand={handleInputChangeBrand}
                      inputValueBrand={inputValueBrand}
                      customStyles={customStyles}
                      addBrand
                      displayTrash
                    />
                  ) : supplier?.brand_id && supplier?.brand_id.length > 0 ? (
                    <div>
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
                  ) : (
                    <div>
                      <p className="text-gray-400 font-bold text-xs">
                        Aucune marque associée à ce fournisseur
                      </p>
                    </div>
                  )}
                </div>
              </FormSection>
              <FormSection title="Contacts">
                <div className="flex flex-col gap-2 mt-3">
                  {/* Combinez les contacts enregistrés et les contacts sélectionnés */}
                  {(supplier?.contacts && supplier.contacts.length > 0) ||
                  (selectedContacts && selectedContacts.length > 0) ? (
                    <>
                      {/* Affichez les contacts enregistrés */}
                      {supplier?.contacts &&
                        supplier.contacts.length > 0 &&
                        supplier.contacts.map((contact, index) => (
                          <div
                            key={`stored-${index}`}
                            className="text-center rounded-md cursor-pointer hover:brightness-125 shadow-md bg-slate-400"
                          >
                            <span className="text-[20px] text-white font-bold">
                              {contact.firstname} {contact.lastname}
                            </span>
                          </div>
                        ))}

                      {/* Affichez les contacts sélectionnés */}
                      {selectedContacts &&
                        selectedContacts.length > 0 &&
                        selectedContacts.map((contact, index) => (
                          <div
                            key={`selected-${index}`}
                            className="text-center rounded-md cursor-pointer hover:brightness-125 shadow-md bg-slate-400"
                          >
                            <span className="text-[20px] text-white font-bold">
                              {contact.firstname} {contact.lastname}
                            </span>
                          </div>
                        ))}
                    </>
                  ) : !isModify ? (
                    <p className="text-gray-400 font-bold text-xs">
                      Aucun contact enregistré pour ce fournisseur
                    </p>
                  ) : null}
                </div>

                {/* Afficher le bouton "Ajouter un contact" seulement en mode modification */}
                {isModify && (
                  <div
                    className="flex flex-col items-center justify-center p-[20px] text-orange-400 hover:text-orange-300 cursor-pointer"
                    onClick={() => setContactModalIsOpen(true)}
                  >
                    <div className="flex items-center gap-2 text-[12px] mt-3">
                      <Plus size={30} />
                    </div>
                    <p className="font-[700]">Ajouter un contact</p>
                  </div>
                )}
              </FormSection>

              <FormSection title="Gestionnaires">
                <div className="mt-2 flex flex-col">
                  {/* Affichage de l'assistant(e) pour `supplier` et `formData` */}
                  {supplier?.admin && (
                    <p className="text-[13px]">
                      Assistant(e) actuel(le) :{" "}
                      <span className="capitalize font-bold">
                        {supplier.admin}
                      </span>
                    </p>
                  )}
                  {formData?.admin && formData.admin !== supplier?.admin && (
                    <p className="text-[13px]">
                      Assistant(e) modifié(e) :{" "}
                      <span className="capitalize font-bold">
                        {formData.admin}
                      </span>
                    </p>
                  )}

                  {/* Affichage des acheteurs pour `supplier` */}
                  {supplier?.buyers && supplier.buyers.length > 0 && (
                    <div className="mt-4 overflow-x-auto">
                      <p className="text-gray-600 font-semibold mb-2">
                        Acheteurs actuels :
                      </p>
                      <table className="min-w-full bg-white border border-gray-300">
                        <thead>
                          <tr className="bg-gray-200 text-gray-700">
                            <th className="py-2 px-4 border-b text-left font-semibold">
                              Acheteur
                            </th>
                            <th className="py-2 px-4 border-b text-left font-semibold">
                              Famille
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {supplier.buyers.map((buyer, index) => (
                            <tr key={index} className="hover:bg-gray-100">
                              <td className="py-2 px-4 border-b">
                                <span className="capitalize font-bold">
                                  {buyer.user || "N/A"}
                                </span>
                              </td>
                              <td className="py-2 px-4 border-b">
                                <span className="capitalize font-bold">
                                  {buyer.family?.join(" | ") || "N/A"}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Bouton pour ajouter un(e) gestionnaire en mode modification */}
                  {isModify && (
                    <div
                      className="flex flex-col items-center justify-center p-[20px] text-orange-400 hover:text-orange-300 cursor-pointer"
                      onClick={() => setGestionModalIsOpen(true)}
                    >
                      <div className="flex items-center gap-2 text-[12px] mt-3">
                        <Plus size={30} />
                      </div>
                      <p className="font-[700]">Ajouter un(e) gestionnaire</p>
                    </div>
                  )}
                </div>
              </FormSection>
            </div>
            <div className="mt-[30px]">
              {!isModify && (
                <FormSection title="Champs utilisateur">
                  <div>
                    {userFields
                      .filter((field) => field.apply_to === "Fournisseur")
                      .map((field: any, index: number) => {
                        const supplierField = supplier?.additional_fields.find(
                          (supField: any) => supField.label === field.label
                        );

                        return (
                          <div
                            key={index}
                            className="grid grid-cols-12 gap-2 py-2"
                          >
                            <span className="col-span-3 font-[700] text-slate-500 text-[13px]">
                              {field.label} :
                            </span>

                            <span className="col-span-3 text-gray-600 whitespace-nowrap overflow-ellipsis overflow-hidden text-[14px]">
                              {supplierField?.value || "Non renseigné"}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </FormSection>
              )}
              {isModify && (
                <FormSection title="Champs utilisateur">
                  <div>
                    {userFields && userFields.length > 0 && (
                      <div className="mt-3">
                        {userFields
                          .filter((field) => field.apply_to === "Fournisseur")
                          .map((field) => {
                            // Récupérer la valeur de `supplier` pour chaque champ utilisateur
                            const supplierField =
                              supplier?.additional_fields.find(
                                (supField: any) =>
                                  supField.label === field.label
                              );

                            return (
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
                                          fieldValues[
                                            `${field._id}-${index}`
                                          ] ||
                                          supplierField?.value ||
                                          ""
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
                            );
                          })}
                      </div>
                    )}
                  </div>
                </FormSection>
              )}
            </div>
            <div className="mt-[30px]">
              {!isModify && (
                <FormSection title="Conditions commerciales">
                  <div>
                    {conditions && conditions.length > 0 ? (
                      conditions.map((condition, index) => {
                        return (
                          <div
                            key={index}
                            className="mb-2 border rounded-md bg-gray-50"
                          >
                            <div
                              className="p-2 flex justify-between items-center cursor-pointer"
                              onClick={() => setOpen(!open)}
                            >
                              <div className="flex items-center gap-2">
                                <p className="font-bold text-lg">
                                  Saison :{" "}
                                  <span className="font-light">
                                    {condition.season}
                                  </span>
                                </p>
                                <p className="text-[12px] font-[600]">
                                  Crée le :{" "}
                                  <span className="text-blue-500">
                                    {formatDate(condition.createdAt)}
                                  </span>
                                </p>
                              </div>
                              <div className="text-gray-500">
                                <File size={18} />
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-gray-500">
                        Aucune condition commerciale n'a été enregistrée
                      </p>
                    )}
                  </div>
                </FormSection>
              )}
              {isModify && (
                <div
                  className="mt-3"
                  onClick={() => setConditionModalIsOpen(true)}
                >
                  <Button blue size="small" type="button">
                    Ajouter une condition commerciale
                  </Button>
                </div>
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
    </>
  );
}
