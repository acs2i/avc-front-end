import React from "react";
import Input from "../components/FormElements/Input";

interface Contact {
  firstname: string;
  lastname: string;
  function: string;
  phone: string;
  mobile: string;
  email: string;
}

interface ContactFormComponentProps {
  contact: Contact;
  handleContactChange: (field: keyof Contact, value: string) => void;
  addContact: (contact: Contact) => void;
  onCloseModal: () => void;
}

const ContactFormComponent: React.FC<ContactFormComponentProps> = ({
  contact,
  handleContactChange,
  addContact,
  onCloseModal,
}) => {
  const handleAddContact = () => {
    console.log("Vérification des champs du nouveau contact : ", contact);
    addContact(contact);
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <h2 className="text-lg font-bold">Ajouter un contact</h2>
      <Input
        element="input"
        id="firstname"
        label="Prénom"
        value={contact.firstname}
        validators={[]}
        onChange={(e) => handleContactChange("firstname", e.target.value)}
        placeholder="Prénom"
      />
      <Input
        element="input"
        id="lastname"
        label="Nom"
        value={contact.lastname}
        validators={[]}
        onChange={(e) => handleContactChange("lastname", e.target.value)}
        placeholder="Nom"
      />
      <Input
        element="input"
        id="function"
        label="Fonction"
        value={contact.function}
        validators={[]}
        onChange={(e) => handleContactChange("function", e.target.value)}
        placeholder="Fonction"
      />
      <Input
        element="input"
        id="phone"
        label="Téléphone"
        value={contact.phone}
        validators={[]}
        onChange={(e) => handleContactChange("phone", e.target.value)}
        placeholder="Téléphone"
      />
      <Input
        element="input"
        id="mobile"
        label="Mobile"
        value={contact.mobile}
        validators={[]}
        onChange={(e) => handleContactChange("mobile", e.target.value)}
        placeholder="Mobile"
      />
      <Input
        element="input"
        id="email"
        label="Email"
        value={contact.email}
        validators={[]}
        onChange={(e) => handleContactChange("email", e.target.value)}
        placeholder="Email"
      />
      <div className="flex justify-end gap-2">
        <button
          type="button"
          className="px-4 py-2 bg-gray-500 text-white rounded"
          onClick={onCloseModal}
        >
          Annuler
        </button>
        <button
          type="button"
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={handleAddContact}
        >
          Ajouter
        </button>
      </div>
    </div>
  );
};

export default ContactFormComponent;