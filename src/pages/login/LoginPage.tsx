import React, { useState } from "react";
import { Avatar } from "@mui/material";
import Input from "../../components/FormElements/Input";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { setLogin } from "../../store/store";
import { VALIDATOR_REQUIRE } from "../../utils/validator";

interface FormData {
  username: string;
  password: string;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_URL_DEV}/api/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        dispatch(
          setLogin({
            user: data.user,
            token: data.token,
          })
        );
        navigate("/")
      } else {
        console.error("Erreur lors de la connexion");
      }
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    }
  };

  return (
    <div className="w-full h-screen flex justify-center">
      <form className="h-[500px]  w-[400px] bg-white rounded-lg px-5 shadow-lg mt-[200px]" onSubmit={handleSubmit}>
        <div className="py-5 flex flex-col items-center justify-center gap-3">
          <div className="relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <Avatar src="img/logo.png" alt="logo AVC" />
          </div>
          <h1 className="text-4xl text-gray-600">Connexion</h1>
        </div>
        <div
          className="mt-5 h-[250px] flex flex-col justify-between"
        >
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
              orange
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
              orange
            />
            <div className="w-full flex justify-end cursor-pointer text-[12px] text-blue-500">
              <Link to="/">Mot de passe oublié ?</Link>
            </div>
          </div>
          <div className="w-full mt-5">
            <button type="submit" className="w-full bg-gradient-to-r from-orange-600 to-orange-400 text-white font-bold py-2 rounded-3xl hover:brightness-125">
              Valider
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
