import React, { useState } from "react";
import Input from "../../components/FormElements/Input";
import { useNavigate } from "react-router-dom";
import { VALIDATOR_REQUIRE } from "../../utils/validator";
import useNotify from "../../utils/hooks/useToast";
import Card from "../../components/Shared/Card";
import { CircularProgress } from "@mui/material";
import Button from "../../components/FormElements/Button";

interface FormData {
  username: string;
  email: string;
  password: string;
  authorization: string;
  comment: string;
}

export default function CreateUserPage() {
  const [error, setError] = useState<string | null>("");
  const { notifySuccess, notifyError } = useNotify();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
    authorization: "",
    comment: "",
  });

  const authorizationOptions = [
    { value: "admin", name: "Admin", label: "Admin" },
    { value: "user", name: "User", label: "User" },
    { value: "guest", name: "Guest", label: "Guest" },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        setTimeout(() => {
          notifySuccess("Utilisateur créé avec succès !");
          setIsLoading(false);
          navigate("/admin");
        }, 1000);
      } else {
        notifyError("Erreur lors de la création !");
      }
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    }
  };

  return (
    <div className="relative">
      <Card title="Création d'utilisateur" createTitle="" link="">
        <div className="mt-7 mb-7">
          <form
            className="flex flex-col gap-4 w-[70%] mx-auto"
            onSubmit={handleSubmit}
          >
            <div className="flex items-center gap-3 h-[70px]">
              <div className="h-2/3 w-[8px] bg-[#01972B]"></div>
              <h4 className="text-3xl text-gray-600">
                <span className="font-bold text-gray-700">Formulaire</span> de
                création
              </h4>
            </div>
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
                <Input
                  element="input"
                  id="password"
                  type="password"
                  placeholder="Entrez votre mot de passe"
                  label="Mot de passe"
                  value={formData.password}
                  onChange={handleChange}
                  validators={[VALIDATOR_REQUIRE()]}
                  required
                  create
                />
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
              </div>
              {!isLoading ? (<div className="w-full mt-5 flex items-center gap-2">
                <Button size="small" cancel type="button" to="/admin">
                  Annuler
                </Button>
                <Button size="small" green type="submit">
                  Valider
                </Button>
              </div>) : (<div className="mt-3">
                <CircularProgress/>
              </div>)}
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}
