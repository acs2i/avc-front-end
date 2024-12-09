import React, { useState, useEffect } from "react";
import Input from "../../components/FormElements/Input";
import { useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronLeft, ChevronUp, Plus, Trash } from "lucide-react";
import FormSection from "../../components/Formulaires/FormSection";
import CreatableSelect from "react-select/creatable";
import { ActionMeta, SingleValue } from "react-select";
import Button from "../../components/FormElements/Button";
import useNotify from "../../utils/hooks/useToast";
import { CircularProgress } from "@mui/material";
import BrandSection from "../../components/Formulaires/BrandSection";
import ContactSection from "../../components/Formulaires/ContactSection";
import ConditionSection from "../../components/Formulaires/ConditionsSection";
import DynamicField from "../../components/FormElements/DynamicField";
import Modal from "../../components/Shared/Modal";
import ContactFormComponent from "../../components/ContactFormComponent";
import { useBrands } from "../../utils/hooks/useBrands";
import { useUsers } from "../../utils/hooks/useUsers";
import { useFamily } from "../../utils/hooks/useFamily";
import GestionFormComponent from "../../components/GestionFormComponent";
import { useIsoCode } from "../../utils/hooks/useIsoCode";
import IsoCodeSection from "../../components/Formulaires/IsoCodeSection";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";

interface Contact {
  firstname: string;
  lastname: string;
  function: string;
  phone: string;
  mobile: string;
  email: string;
}

interface Buyer {
  family: string[];
  user: string;
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
  address1: string;
  address2: string;
  address3: string;
  city: string;
  postal: string;
  country: string;
  currency: string;
  discount: string;
  brand_id: string[];
  contacts: Contact[];
  admin: string;
  buyers: Buyer[];
  additional_fields: any[];
  status: string;
}

interface CustomField {
  field_name: string;
  field_type: string;
  options?: string[];
  default_value?: string;
  value?: string;
}

interface DefaultValue {
  label: string;
  value: string;
  field_type: string;
  id: string;
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

const customStyles = {
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isFocused ? "#d1e7fd" : "white",
    color: state.isFocused ? "#0d6efd" : "black",
    cursor: "pointer",
  }),
  control: (provided: any) => ({
    ...provided,
    borderColor: "#ced4da",
    "&:hover": {
      borderColor: "#0d6efd",
    },
  }),
  menu: (provided: any) => ({
    ...provided,
    zIndex: 9999,
  }),
};

const reorderContacts = (
  list: Contact[],
  startIndex: number,
  endIndex: number
) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};




export default function CreateSupplierPage() {
  const navigate = useNavigate();
  const creatorId = useSelector((state: any) => state.auth.user);
  const token = useSelector((state: any) => state.auth.token);
  const [adminOptions, setAdminOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const limit = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [additionalFields, setAdditionalFields] = useState([
    { name: "", value: "" },
  ]);
  const [admin, setAdmin] = useState("");
  const [buyers, setBuyers] = useState<Buyer[]>([{ family: [], user: "" }]);
  const [searchInputs, setSearchInputs] = useState<{ [key: string]: string }>(
    {}
  );
  const [contactModalIsOpen, setContactModalIsOpen] = useState(false);
  const [gestionModalIsOpen, setGestionModalIsOpen] = useState(false);
  const [userOptions, setUserOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [userFields, setUserFields] = useState<UserField[]>([]);
  const { notifySuccess, notifyError } = useNotify();
  const [isLoading, setIsLoading] = useState(false);
  const [adminSearchInput, setAdminSearchInput] = useState("");
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
    address1: "",
    address2: "",
    address3: "",
    city: "",
    postal: "",
    country: "",
    currency: "",
    discount: "",
    brand_id: [],
    contacts: [],
    admin: "",
    buyers: [],
    additional_fields: [],
    status: "A",
  });
  const [newContact, setNewContact] = useState<Contact>({
    firstname: "",
    lastname: "",
    function: "",
    phone: "",
    mobile: "",
    email: "",
  });
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);

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
    inputValueUser,
    optionsUser,
    users,
    handleChangeUser,
    removeUserField,
    addUserField,
    handleInputChangeUser,
  } = useUsers("", 10);

  const {
    inputValueFamily,
    optionsFamily,
    selectedFamily,
    setOptionsFamily,
    handleInputChangeFamily,
    handleChangeFamily,
  } = useFamily("", 10);

  const {
    inputValueIsoCode,
    optionsIsoCode,
    isoCodes,
    handleInputChangeIsoCode,
    handleChangeIsoCode,
  } = useIsoCode("", 10);

  useEffect(() => {
    setUserOptions(optionsUser);
  }, [optionsUser]);

  const handleSearchInputChange = (inputValue: string, field: string) => {
    setSearchInputs((prev) => ({
      ...prev,
      [field]: inputValue,
    }));

    handleInputChangeUser(inputValue);
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

  const handleDragEnd = (result: DropResult) => {
    if (
      !result.destination ||
      result.destination.index === result.source.index
    ) {
      return;
    }

    const updatedContacts = reorderContacts(
      selectedContacts,
      result.source.index,
      result.destination.index
    );

    setSelectedContacts(updatedContacts);
    setFormData((prevFormData) => ({
      ...prevFormData,
      contacts: updatedContacts,
    }));
  };

  // Fonction qui fetch tout les champs utilisateurs
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

  // Fonction qui met a jour les champs utilisateurs à jour
  const handleFieldChange = (
    label: string,
    field_type: string,
    id: string,
    newValue: string
  ) => {
    setFieldValues((prevValues) => ({
      ...prevValues,
      [id]: newValue,
    }));
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

  // Fonction qui récupère les données du contact
  const handleContactChange = (field: keyof Contact, value: string) => {
    setNewContact((prevContact) => {
      const updatedContact = { ...prevContact, [field]: value };
      console.log("Updated Contact:", updatedContact); // Pour le débogage
      return updatedContact;
    });
  };

  // Fonction qui récupère les données du du numero de téléphone
  const handlePhoneChange = (value: string | undefined) => {
    setFormData({
      ...formData,
      phone: value || "",
    });
  };

  // Fonction qui récupère les données de tout les autres champs
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

  const handleAdminChange = (value: string) => {
    setAdmin(value); // Met à jour l'état local `admin`
    setFormData((prevFormData) => ({
      ...prevFormData,
      admin: value,
    }));
  };

  const handleUserSearchInput = (inputValue: string, index: number) => {
    handleInputChangeUser(inputValue); // Effectue une recherche d'utilisateur avec l'input
  };

  // Ajoute un nouvel acheteur
  const addBuyer = () => {
    setBuyers((prev) => [...prev, { family: [], user: "" } as Buyer]); // family comme tableau vide
    setFormData((prevFormData) => ({
      ...prevFormData,
      buyers: [...prevFormData.buyers, { family: [], user: "" } as Buyer], // family comme tableau vide
    }));
  };

  // Fonction de soumission du formulaire
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

  // Use Effect pour ajouter l'id des marques choisies dans le formData
  useEffect(() => {
    const selectedBrandIds = brands.map((brand) => brand?._id || "");
    setFormData((prevFormData) => ({
      ...prevFormData,
      brand_id: selectedBrandIds,
    }));
  }, [brands]);

  // Use Effect pour fetcher les "UserFields" au montage du composant
  useEffect(() => {
    fetchField();
  }, []);

  useEffect(() => {
    if (userFields.length > 0) {
      const defaultValues: DefaultValue[] = [];
  
      userFields
        .filter((field) => field.apply_to === "Fournisseur")
        .forEach((field) => {
          field.additional_fields.forEach((customField, index) => {
            if (customField.default_value) {
              defaultValues.push({
                label: field.label,
                value: customField.default_value,
                field_type: customField.field_type,
                id: `${field._id}-${index}`,
              });
  
              // Met à jour directement `fieldValues` pour afficher les valeurs par défaut
              setFieldValues((prevFieldValues) => ({
                ...prevFieldValues,
                [`${field._id}-${index}`]: customField.default_value,
              }));
            }
          });
        });
  
      // Ajoutez les valeurs par défaut dans formData.additional_fields
      setFormData((prevFormData) => ({
        ...prevFormData,
        additional_fields: [
          ...prevFormData.additional_fields.filter(
            (field) => !defaultValues.some((df) => df.label === field.label)
          ),
          ...defaultValues,
        ],
      }));
    }
  }, [userFields]);

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
          familyOptions={optionsFamily}
          handleFamilySearchInput={handleInputChangeFamily}
          handleInputChangeUser={handleInputChangeUser} // Ajout ici
        />
      </Modal>
      <section className="w-full bg-slate-50 p-7">
        <div className="max-w-[2024px] mx-auto">
          <form onSubmit={handleSubmit} className="mb-[400px]">
            <div className="flex justify-between">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <div onClick={() => navigate(-1)} className="cursor-pointer">
                    <ChevronLeft />
                  </div>
                  <h3 className="text-[32px] font-[800] text-gray-800">
                    Créer <span className="font-[200]">un fournisseur</span>
                  </h3>
                </div>
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
                    <Button
                      size="small"
                      cancel
                      type="button"
                      onClick={() => navigate(-1)}
                    >
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
                    maxLength={9}
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
                  id="address1"
                  label="Adresse 1 :"
                  value={formData.address1}
                  onChange={handleChange}
                  validators={[]}
                  placeholder="14 rue mon adresse"
                  create
                  gray
                />
                <Input
                  element="input"
                  id="address2"
                  label="Adresse 2 :"
                  value={formData.address2}
                  onChange={handleChange}
                  validators={[]}
                  placeholder="Complément d'adresse"
                  create
                  gray
                />
                <Input
                  element="input"
                  id="address3"
                  label="Adresse 3 :"
                  value={formData.address3}
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
                  id="city"
                  label="Ville :"
                  value={formData.city}
                  onChange={handleChange}
                  validators={[]}
                  placeholder="Ajouter la ville"
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
              </FormSection>
            </div>

            <div className="flex gap-4 mt-[30px]">
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
                  addBrand
                  displayTrash
                />
              </FormSection>
              <FormSection title="Contacts">
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="contacts">
                    {(provided) => (
                      <div
                        className="flex flex-col gap-2 mt-3"
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                      >
                        {selectedContacts.length > 0 ? (
                          <>
                            {selectedContacts.map((contact, index) => (
                              <Draggable
                                key={`contact-${index}`}
                                draggableId={`contact-${index}`}
                                index={index}
                              >
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`text-center rounded-md cursor-move hover:brightness-125 shadow-md p-3 ${
                                      index === 0
                                        ? "bg-gradient-to-r from-cyan-600 to-cyan-800 text-white"
                                        : "bg-slate-300 text-gray-500"
                                    }`}
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="text-[20px] font-bold">
                                        {contact.firstname} {contact.lastname}
                                      </span>
                                      {index === 0 && (
                                        <span className="text-xs text-white bg-cyan-800 px-2 py-1 rounded border border-white">
                                          Contact Principal
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </>
                        ) : (
                          <p className="text-gray-400 font-bold text-xs">
                            Aucun contact enregistré pour ce fournisseur
                          </p>
                        )}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>

                <div
                  className="flex flex-col items-center justify-center p-[20px] text-orange-400 hover:text-orange-300 cursor-pointer"
                  onClick={() => setContactModalIsOpen(true)}
                >
                  <div className="flex items-center gap-2 text-[12px] mt-3">
                    <Plus size={30} />
                  </div>
                  <p className="font-[700]">Ajouter un contact</p>
                </div>
              </FormSection>

              <FormSection title="Gestionnaires">
                <div className="mt-2 flex flex-col">
                  {formData.admin && (
                    <p className="text-[13px]">
                      Assistant(e) :{" "}
                      <span className="capitalize font-bold">
                        {formData.admin}
                      </span>
                    </p>
                  )}

                  {/* Acheteurs */}
                  {formData.buyers && formData.buyers.length > 0 && (
                    <div className="mt-4 overflow-x-auto">
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
                          {formData.buyers.map((buyer, index) => (
                            <tr key={index} className="hover:bg-gray-100">
                              <td className="py-2 px-4 border-b">
                                <span className="capitalize font-bold">
                                  {buyer.user || "N/A"}
                                </span>
                              </td>
                              <td className="py-2 px-4 border-b">
                                <span className="capitalize font-bold">
                                  {buyer.family?.join(" | ") || "N/A"}{" "}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                <div
                  className="flex flex-col items-center justify-center p-[20px] text-orange-400 hover:text-orange-300 cursor-pointer"
                  onClick={() => setGestionModalIsOpen(true)}
                >
                  <div className="flex items-center gap-2 text-[12px] mt-3">
                    <Plus size={30} />
                  </div>
                  <p className="font-[700]">Ajouter un(e) gestionnaire</p>
                </div>
              </FormSection>
            </div>

            <div className="flex gap-4 mt-[30px]">
              <FormSection title="Champs utilisateurs">
                <div className="mt-3">
                  {userFields
                    .filter((field) => field.apply_to === "Fournisseur")
                    .map((field) => (
                      <div key={field._id} className="mb-6">
                        {/* Affichage du label au niveau supérieur */}
                        <h3 className="text-md font-semibold text-gray-800 mb-1">
                          {field.label}
                        </h3>
                        {field.additional_fields.map((customField, index) => (
                          <div key={`${field._id}-${index}`} className="mb-4">
                            <DynamicField
                              id={`${field._id}-${index}`}
                              name={customField.field_name}
                              fieldType={customField.field_type}
                              value={
                                fieldValues[`${field._id}-${index}`] ||
                                customField.default_value || // Préremplir avec default_value si aucune valeur
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
                        ))}
                      </div>
                    ))}
                </div>
              </FormSection>
            </div>

            {/* Boutons de soumission */}
            {!isLoading ? (
              <div className="mt-[50px] flex gap-2">
                <button
                  className="w-full bg-[#9FA6B2] text-white py-2 rounded-md font-[600] hover:bg-[#bac3d4] hover:text-white shadow-md"
                  type="button"
                  onClick={() => navigate(-1)}
                >
                  Annuler
                </button>
                <button
                  className="w-full bg-[#3B71CA] text-white py-2 rounded-md font-[600] hover:bg-sky-500 shadow-md"
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
    </>
  );
}
