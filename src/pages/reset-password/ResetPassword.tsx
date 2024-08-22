import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  // Récupérer le token à partir de l'URL
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  const handleChangeNewPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
    setError(null);
    setMessage(null);
  };

  const handleChangeConfirmPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    setError(null);
    setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/auth/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, newPassword }),
        }
      );

      if (response.ok) {
        setMessage("Votre mot de passe a été réinitialisé avec succès.");
        setTimeout(() => {
          navigate("/login");
        }, 3000); // Redirige vers la page de connexion après 3 secondes
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Une erreur est survenue.");
      }
    } catch (error) {
      console.error("Erreur lors de la réinitialisation du mot de passe", error);
      setError("Une erreur est survenue lors de la réinitialisation du mot de passe.");
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
            {message && (
              <div className="alert alert-success mt-5" role="alert">
                <i className="fa-regular fa-check-circle"></i> {message}
              </div>
            )}
            {error && (
              <div className="alert alert-warning mt-5" role="alert">
                <i className="fa-regular fa-triangle-exclamation"></i> {error}
              </div>
            )}
            <div className="form-group mb-4">
              <label className="form-label block mb-2">Nouveau mot de passe</label>
              <input
                className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm ${error ? 'border-red-600' : ''}`}
                type="password"
                placeholder="Nouveau mot de passe"
                value={newPassword}
                onChange={handleChangeNewPassword}
                required
              />
            </div>
            <div className="form-group mb-4">
              <label className="form-label block mb-2">Confirmez le mot de passe</label>
              <input
                className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm ${error ? 'border-red-600' : ''}`}
                type="password"
                placeholder="Confirmez le mot de passe"
                value={confirmPassword}
                onChange={handleChangeConfirmPassword}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary mb-3 bg-green-900"
            >
              Réinitialiser le mot de passe
            </button>
          </form>
          <Link to="/login" className="text-sm text-muted mt-3 block text-center">
            Retour à la connexion
          </Link>
        </div>
      </div>
      <div className="hidden md:block md:w-1/2 lg:w-1/2 xl:w-2/3">
        <div className="bg-cover h-full min-h-screen" style={{ backgroundImage: 'url(/img/background.png)' }}></div>
      </div>
    </div>
  );
}
