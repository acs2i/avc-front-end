import Header from "../../components/Header";
import Card from "../../components/Card";
import React from "react";


export default function CreateProduct() {
  return (
    <div>
      <Header titlePage="Création Produit" />
      <Card title="Créez votre produit" subtitle="">
        <form className="flex flex-col gap-8">
          <div className="gap-5 grid grid-cols-2 grid-template-columns: [label] 1fr [select] 2fr;">
            <div className="flex items-center gap-4">
              <label
                className="text-sm font-medium text-gray-900 whitespace-nowrap"
                style={{ gridColumn: "label", minWidth: "120px" }}
              >
                Nom du produit :{" "}
              </label>
              <input
                type="text"
                placeholder="Entrez le nom du produit"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-green-500 focus:outline-none w-full p-2.5"
              />
            </div>

            <div className="flex items-center gap-4">
              <label
                className="text-sm font-medium text-gray-900 whitespace-nowrap"
                style={{ gridColumn: "label", minWidth: "120px" }}
              >
                Famille :{" "}
              </label>
              <select
                name="familly"
                id="familly"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-green-500 focus:outline-none w-full p-2.5"
                style={{ gridColumn: "select" }}
              >
                <option value="">Choissisir une famille</option>
                <option value="famille">Famille</option>
              </select>
            </div>

            <div className="flex items-center gap-4">
              <label
                className="text-sm font-medium text-gray-900 whitespace-nowrap"
                style={{ gridColumn: "label", minWidth: "120px" }}
              >
                Sous-Famille :{" "}
              </label>
              <select
                name="subfamilly"
                id="subfamilly"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-green-500 focus:outline-none w-full p-2.5"
                style={{ gridColumn: "select" }}
              >
                <option value="">Choissisir une Sous-famille</option>
                <option value="famille">Sous famille</option>
              </select>
            </div>

            <div className="flex items-center gap-4">
              <label
                className="text-sm font-medium text-gray-900 whitespace-nowrap"
                style={{ gridColumn: "label", minWidth: "120px" }}
              >
                Marque :{" "}
              </label>
              <select
                name="subfamilly"
                id="subfamilly"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-green-500 focus:outline-none w-full p-2.5"
                style={{ gridColumn: "select" }}
              >
                <option value="">Choissisir une Marque</option>
                <option value="famille">Marque</option>
              </select>
            </div>

            <div className="flex items-center gap-4">
              <label
                className="text-sm font-medium text-gray-900 whitespace-nowrap"
                style={{ gridColumn: "label", minWidth: "120px" }}
              >
                Collection :{" "}
              </label>
              <select
                name="subfamilly"
                id="subfamilly"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-green-500 focus:outline-none w-full p-2.5"
                style={{ gridColumn: "select" }}
              >
                <option value="">Choissisir une Collection</option>
                <option value="famille">Collection</option>
              </select>
            </div>

            <div className="flex items-center gap-4">
              <label
                className="text-sm font-medium text-gray-900 whitespace-nowrap"
                style={{ gridColumn: "label", minWidth: "120px" }}
              >
                Couleur :{" "}
              </label>
              <select
                name="subfamilly"
                id="subfamilly"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-green-500 focus:outline-none w-full p-2.5"
                style={{ gridColumn: "select" }}
              >
                <option value="">Choissisir une Couleur</option>
                <option value="famille">Couleur</option>
              </select>
            </div>

            <div className="flex items-center gap-4">
              <label
                className="text-sm font-medium text-gray-900 whitespace-nowrap"
                style={{ gridColumn: "label", minWidth: "120px" }}
              >
                Taille :{" "}
              </label>
              <select
                name="subfamilly"
                id="subfamilly"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-green-500 focus:outline-none w-full p-2.5"
                style={{ gridColumn: "select" }}
              >
                <option value="">Choissisir une Taille</option>
                <option value="famille">Taille</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:brightness-125">
              Valider
            </button>
            <button className="bg-red-600 text-white font-bold py-2 px-4 rounded-md hover:brightness-125">
              Annuler
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
