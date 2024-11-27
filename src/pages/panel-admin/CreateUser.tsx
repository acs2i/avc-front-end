import React, { useState } from "react";
import Input from "../../components/FormElements/Input";
import { useNavigate } from "react-router-dom";
import { VALIDATOR_REQUIRE } from "../../utils/validator";
import useNotify from "../../utils/hooks/useToast";
import Card from "../../components/Shared/Card";
import { CircularProgress } from "@mui/material";
import Button from "../../components/FormElements/Button";
import { Eye } from "lucide-react";

interface FormData {
  username: string;
  email: string;
  password: string;
  authorization: string;
  comment: string;
}

interface AdditionalField {
  key: string;
  value: string;
}

export default function CreateUserPage() {
  const [error, setError] = useState<string | null>("");
  const { notifySuccess, notifyError } = useNotify();
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "uknown",
    authorization: "",
    comment: "",
  });
  const [additionalFields, setAdditionalFields] = useState<AdditionalField[]>(
    []
  );

  const authorizationOptions = [
    { value: "admin", name: "Admin", label: "Admin" },
    { value: "user", name: "User", label: "User" },
    { value: "guest", name: "Guest", label: "Guest" },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setError("");
  };

  const handleAddField = () => {
    setAdditionalFields([...additionalFields, { key: "", value: "" }]);
  };

  const handleFieldChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const newFields = [...additionalFields];
    newFields[index] = { ...newFields[index], [name]: value };
    setAdditionalFields(newFields);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const dataToSend = { ...formData, additionalFields };
      console.log("Data to send:", dataToSend);
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...formData, additionalFields }),
        }
      );

      if (response.ok) {
        setTimeout(() => {
          
        
          const emailInitPass = formData.email;
          const response = fetch(
            `${process.env.REACT_APP_URL_DEV}/api/v1/auth/forgot-password`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ emailInitPass }),
            }
          );
          notifySuccess("Utilisateur créé avec succès !");
          setIsLoading(false);
          navigate("/admin");
      }, 2000);
      } else {
        notifyError("Erreur lors de la création !");
      }
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    }
  };

  return (
    <section className="w-full h-screen bg-gray-100 p-7">
      <div>
        <h3 className="text-[32px] font-[800] text-gray-800">
          Créer un utilisateur
        </h3>
      </div>
      <form className="flex flex-col gap-4 w-[70%]" onSubmit={handleSubmit}>
        <div className="mt-5 flex flex-col justify-between">
          <div className="flex flex-col">
            <Input
              element="input"
              id="username"
              type="text"
              placeholder="Entrez votre identifiant"
              label="Identifiant"
              value={formData.username}
              onChange={handleChange}
              validators={[VALIDATOR_REQUIRE()]}
              required
              create
            />

            <Input
              element="input"
              id="email"
              type="email"
              placeholder="Entrez votre email"
              label="Email"
              value={formData.email}
              onChange={handleChange}
              validators={[VALIDATOR_REQUIRE()]}
              required
              create
            />
            <div className="relative hidden">
              <div
                className="absolute right-[-30px] top-[45px] translate-y-[50%] text-gray-500 hover:text-gray-400 cursor-pointer"
                onMouseDown={() => setShowPass(true)}
                onMouseUp={() => setShowPass(false)}
                onMouseLeave={() => setShowPass(false)}
              >
                <Eye size={20} />
              </div>
              <Input
                element="input"
                id="password"
                type={!showPass ? "password" : "text"}
                placeholder="Entrez votre mot de passe"
                label="Mot de passe"
                value={formData.password}
                onChange={handleChange}
                validators={[VALIDATOR_REQUIRE()]}
                required
                create
              />
            </div>
            <Input
              element="select"
              id="authorization"
              placeholder="Choississez une niveau d'autorisation"
              label="Autorisation"
              value={formData.authorization}
              onChange={handleChange}
              validators={[VALIDATOR_REQUIRE()]}
              options={authorizationOptions}
              required
              create
            />
            <Input
              element="textarea"
              id="comment"
              type="text"
              placeholder="Laissez un commentaire"
              label="Commentaire (falcultatif)"
              value={formData.comment}
              onChange={handleChange}
              maxLength={250}
              validators={[]}
              create
            />
            {additionalFields.map((field, index) => (
              <div key={index} className="flex gap-2 mb-2 mt-2">
                <input
                  type="text"
                  name="key"
                  placeholder="Nom du nouveau champ"
                  value={field.key}
                  onChange={(e) => handleFieldChange(index, e)}
                  className="w-1/2 p-2 border border-gray-300 rounded"
                />
                <input
                  type="text"
                  name="value"
                  placeholder="Valeur du nouveau champ"
                  value={field.value}
                  onChange={(e) => handleFieldChange(index, e)}
                  className="w-1/2 p-2 border border-gray-300 rounded"
                />
              </div>
            ))}
            <Button type="button" onClick={handleAddField} size="small">
              Ajouter un champ +
            </Button>
          </div>
          {!isLoading ? (
            <div className="w-full mt-5 flex items-center gap-2">
              <Button size="small" cancel type="button" to="/admin">
                Annuler
              </Button>
              <Button size="small" blue type="submit">
                Création de l'utilisateur
              </Button>
            </div>
          ) : (
            <div className="mt-3">
              <CircularProgress />
            </div>
          )}
        </div>
      </form>
    </section>
  );
}
