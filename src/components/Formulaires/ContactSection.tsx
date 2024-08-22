import React from "react";
import Input from "../FormElements/Input";
import { Trash } from "lucide-react";

interface ContactFieldProps {
  contact: any;
  index: number;
  handleContactChange: (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeContactField: (index: number) => void;
}

const ContactSection: React.FC<ContactFieldProps> = ({
  contact,
  index,
  handleContactChange,
  removeContactField,
}) => {
  return (
    <div>
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
  );
};

export default ContactSection;
