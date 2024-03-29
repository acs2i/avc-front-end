import { Avatar } from "@mui/material";
import Input from "../../components/FormElements/Input";
import { Link } from "react-router-dom";
import React from "react";

export default function LoginPage() {
  return (
    <div className="w-full h-screen flex justify-center">
      <form className="h-[500px]  w-[400px] bg-white rounded-lg px-5 shadow-lg mt-[200px]">
        <div className="py-5 flex flex-col items-center justify-center gap-3">
          <Avatar src="img/logo.png" alt="logo AVC"/>
          <h1 className="text-[30px] font-bold">Connexion</h1>
        </div>
        <div className="mt-5 h-[250px] flex flex-col justify-between">
          <div className="flex flex-col">
            <Input
              element="input"
              id="username"
              type="text"
              placeholder="Entrez votre identifiant"
              label="Identifiant"
            />
            <Input
              element="input"
              id="password"
              type="text"
              placeholder="Entrez votre mot de passe"
              label="Mot de passe"
            />
            <div className="w-full flex justify-end cursor-pointer text-[12px]">
              <Link to="/">Mot de passe oublié ?</Link>
            </div>
          </div>
          <div className="w-full mt-5">
            <button className="w-full bg-gradient-to-r from-orange-600 to-orange-400 text-white font-bold py-2 rounded-3xl hover:brightness-125">
              Valider
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
