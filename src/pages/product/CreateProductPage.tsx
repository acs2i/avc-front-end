import { Pen } from "lucide-react";
import Card from "../../components/Card";
import React, { useState } from "react";
import { Tooltip } from "@mui/material";
import { LINKCARD } from "../../utils/index";
import { LinkCard } from "@/type";

export default function CreateProductPage() {
  const [page, setPage] = useState("progress");

  return (
    <div>
      <div>
        <button>Créer produit</button>
      </div>
      <Card title="Créez votre produit">
        <div className="flex items-center gap-7 mt-4">
          {LINKCARD.map((link: LinkCard) => (
            <button
              className={`font-bold text-gray-600 ${
                page === link.page ? "text-green-700" : ""
              }`}
              onClick={() => setPage(link.page)}
            >
              {link.name}
            </button>
          ))}
        </div>

        {page === "progress" && (
          <div className="mt-7">
            <h1>Hello from progress</h1>
          </div>
        )}

        {page === "valided" && (
          <div className="mt-7">
            <h1>Hello from valided</h1>
          </div>
        )}
        {/* <form className="flex flex-col gap-4 w-[80%] mx-auto">
          <div className="gap-5 grid grid-cols-1 grid-template-columns: [label] 1fr [select] 2fr;">
            <div className="flex flex-col gap-3">
              <label className="text-sm font-medium text-gray-900 whitespace-nowrap">
                Nom du produit :
              </label>
              <input
                type="text"
                placeholder="Entrez le nom du produit"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-green-500 focus:outline-none w-full p-2.5"
              />
            </div>
          </div>
          <div className="gap-5 grid grid-cols-2 grid-template-columns: [label] 1fr [select] 2fr;">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3 w-full">
                <label className="text-sm font-medium text-gray-900 whitespace-nowrap">
                  Famille
                </label>

                <div className="cursor-pointer">
                  <span className="text-blue-500 text-[12px] hover:text-blue-400">Ajouter une famille</span>
                </div>
              </div>
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

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3 w-full">
                <label className="text-sm font-medium text-gray-900 whitespace-nowrap">
                  Sous-famille
                </label>
                <div className="cursor-pointer">
                  <span className="text-blue-500 text-[12px] hover:text-blue-400">Ajouter une sous-famille</span>
                </div>
              </div>
              <select
                name="familly"
                id="familly"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-green-500 focus:outline-none w-full p-2.5"
                style={{ gridColumn: "select" }}
              >
                <option value="">Choissisir une sous-famille</option>
                <option value="famille">Sous-famille</option>
              </select>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3 w-full">
                <label className="text-sm font-medium text-gray-900 whitespace-nowrap">
                  Marque
                </label>
                <div className="cursor-pointer">
                  <span className="text-blue-500 text-[12px] hover:text-blue-400">Créer une marque</span>
                </div>
              </div>
              <select
                name="familly"
                id="familly"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-green-500 focus:outline-none w-full p-2.5"
                style={{ gridColumn: "select" }}
              >
                <option value="">Choissisir une marque</option>
                <option value="famille">Marque</option>
              </select>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3 w-full">
                <label className="text-sm font-medium text-gray-900 whitespace-nowrap">
                  Collection
                </label>
                <div className="cursor-pointer">
                  <span className="text-blue-500 text-[12px] hover:text-blue-400">Créer une collection</span>
                </div>
              </div>
              <select
                name="familly"
                id="familly"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-green-500 focus:outline-none w-full p-2.5"
                style={{ gridColumn: "select" }}
              >
                <option value="">Choissisir une collection</option>
                <option value="famille">Collection</option>
              </select>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3 w-full">
                <label className="text-sm font-medium text-gray-900 whitespace-nowrap">
                  Taille
                </label>
                <div className="cursor-pointer">
                  <span className="text-blue-500 text-[12px] hover:text-blue-400">Créer une taille</span>
                </div>
              </div>
              <select
                name="familly"
                id="familly"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-green-500 focus:outline-none w-full p-2.5"
                style={{ gridColumn: "select" }}
              >
                <option value="">Choissisir une taille</option>
                <option value="famille">Taille</option>
              </select>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3 w-full">
                <label className="text-sm font-medium text-gray-900 whitespace-nowrap">
                  Couleur
                </label>
                <div className="cursor-pointer">
                  <span className="text-blue-500 text-[12px] hover:text-blue-400">Créer une couleur</span>
                </div>
              </div>
              <select
                name="familly"
                id="familly"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-green-500 focus:outline-none w-full p-2.5"
                style={{ gridColumn: "select" }}
              >
                <option value="">Choissisir une couleur</option>
                <option value="famille">Couleur</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2 mt-7">
            <button className="bg-green-600 text-white font-bold h-[35px] px-3 rounded-md hover:brightness-125 text-[12px]">
              Valider
            </button>
            <button className="bg-red-600 text-white font-bold h-[35px] px-3 rounded-md hover:brightness-125 text-[12px]">
              Annuler
            </button>
          </div>
        </form> */}
      </Card>
    </div>
  );
}
