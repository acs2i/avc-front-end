import React, { useState } from "react";
import { Avatar } from "@mui/material";
import Input from "../../components/FormElements/Input";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { setLogin } from "../../store/authSlice";
import { VALIDATOR_REQUIRE } from "../../utils/validator";

interface FormData {
  username: string;
  password: string;
}

export default function LoginPage() {
  const [error, setError] = useState<string | null>("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        const data = await response.json();
        dispatch(
          setLogin({
            user: data.user,
            token: data.token,
          })
        );
        navigate("/");
      } else {
        const errorData = await response.json();
        setError(errorData.error);
      }
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    }
  };

  return (
    <div className="w-full h-full flex justify-center items-center overflow-hidden">
      <div className="flex flex-col w-full md:w-1/2 lg:w-1/2 xl:w-1/3 px-6 my-5 justify-center items-center bg-white rounded-lg">
        <div>
          <h1 className="text-4xl text-center mb-6">
            <img src="/img/logo.png" width="300" alt="Logo" />
          </h1>

          <form onSubmit={handleSubmit} className="mt-5">
            {error && (
              <div className="alert alert-warning mt-5" role="alert">
                <i className="fa-regular fa-triangle-exclamation"></i>
                {error}
              </div>
            )}
            <div className="form-group mb-4">
              <label className="form-label block mb-2">Email</label>
              <input
                className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm ${error ? 'border-red-600' : ''}`}
                type="text"
                placeholder="Email"
                value={formData.username}
                onChange={handleChange}
                id="username"
                name="email"
                autoComplete="username"
              />
              {error && <div className="text-red-600 mt-2">{error}</div>}
            </div>
            <div className="form-group mb-4">
              <div className="flex justify-between">
                <label className="form-label block mb-2">Mot de passe</label>
                <span className="text-sm text-muted cursor-pointer">Mot de passe oublié ?</span>
              </div>
              <input
                className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm ${error ? 'border-red-600' : ''}`}
                type="password"
                placeholder="Mot de passe"
                value={formData.password}
                onChange={handleChange}
                id="password"
                name="password"
                autoComplete="current-password"
              />
              {error && <div className="text-red-600 mt-2">{error}</div>}
            </div>
            <button type="submit" className="w-full bg-primary text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary mb-3 bg-green-900">
              Se connecter
            </button>
          </form>
        </div>
      </div>
      <div className="hidden md:block md:w-1/2 lg:w-1/2 xl:w-2/3">
        <div className="bg-cover h-full min-h-screen" style={{ backgroundImage: 'url(/img/background.png)' }}>
        </div>
      </div>
    </div>
  );
}