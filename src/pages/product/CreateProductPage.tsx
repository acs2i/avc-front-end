import React, { useState } from "react";
import { MoveLeft, Plus, X } from "lucide-react";
import { Link } from "react-router-dom";
import Card from "../../components/Card";
import Button from "../../components/FormElements/Button";
import { LINKCARD_EDIT} from "../../utils/index";
import { LinkCard } from "@/type";
import { Divider } from "@mui/material";


export default function CreateProductPage() {
  const [page, setPage] = useState("addProduct");

  return (
    <div className="mt-7">
      <Link
        to="/product"
        className="flex items-center justify-start gap-3 mb-5 font-bold text-gray-600"
      >
        <MoveLeft />
        <span>Retour</span>
      </Link>
      <Card title="Panel d'ajout">
        <div className="mt-4 mb-[50px]">
          <div className="flex items-center gap-7">
            {LINKCARD_EDIT.map((link: LinkCard) => (
              <>
                <button
                  className={`font-bold text-gray-600 ${
                    page === link.page ? "text-green-700" : ""
                  } ${page === link.page ? "animate-bounce" : ""}`}
                  onClick={() => setPage(link.page)}
                >
                  {link.name}
                </button>
                <div className="w-[1px] h-[20px] bg-gray-300"></div>
              </>
            ))}
          </div>
          <div className="mt-6">
            <Divider />
          </div>
        </div>

        {page === "addProduct" && (
          <div className="mt-7 mb-7">
            <form className="flex flex-col gap-4 w-[60%] mx-auto">
              <h4 className="text-center text-3xl text-gray-600 mb-5">
                <span className="font-bold text-gray-700">Ajout</span> d'un
                produit
              </h4>
              <div className="gap-5 grid grid-cols-1 grid-template-columns: [label] 1fr [select] 2fr;">
                <div className="flex flex-col gap-3">
                  <label className="text-sm font-medium text-gray-900 whitespace-nowrap">
                    Référence :
                  </label>
                  <input
                    type="text"
                    placeholder="Entrez la référence du produit"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-green-500 focus:outline-none w-full p-2.5"
                  />
                </div>
              </div>
              <div className="gap-5 grid grid-cols-2 grid-template-columns: [label] 1fr [select] 2fr;">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-3 w-full">
                    <label className="text-sm font-medium text-gray-900 whitespace-nowrap">
                      Famille :
                    </label>
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
                      Sous-famille :
                    </label>
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
                      Marque :
                    </label>
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
                      Collection :
                    </label>
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
              </div>

              <div className="flex gap-2 mt-3">
                <Button size="small" green>
                  <Plus />
                  Ajouter
                </Button>
                <Button size="small" danger>
                  <X />
                  Annuler
                </Button>
              </div>
            </form>
          </div>
        )}

        {page === "addFamilly" && (
          <div className="mt-7 mb-7">
            <form className="flex flex-col gap-4 w-[60%] mx-auto">
              <h4 className="text-center text-3xl text-gray-600 mb-5">
                <span className="font-bold text-gray-700">Ajout</span> d'une
                famille
              </h4>
              <div className="gap-5 grid grid-cols-1 grid-template-columns: [label] 1fr [select] 2fr;">
                <div className="flex flex-col gap-3">
                  <label className="text-sm font-medium text-gray-900 whitespace-nowrap">
                    Nom de la famille :
                  </label>
                  <input
                    type="text"
                    placeholder="Entrez le nom de la famille"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-green-500 focus:outline-none w-full p-2.5"
                  />
                </div>
              </div>

              <div className="flex gap-2 mt-7">
                <Button size="small" green>
                  <Plus />
                  Ajouter
                </Button>
                <Button size="small" danger>
                  <X />
                  Annuler
                </Button>
              </div>
            </form>
          </div>
        )}

        {page === "addSubFamilly" && (
          <div className="mt-7 mb-7">
            <form className="flex flex-col gap-4 w-[60%] mx-auto">
              <h4 className="text-center text-3xl text-gray-600 mb-5">
                <span className="font-bold text-gray-700">Ajout</span> d'une
                sous-famille
              </h4>
              <div className="gap-5 grid grid-cols-1 grid-template-columns: [label] 1fr [select] 2fr;">
                <div className="flex flex-col gap-3">
                  <label className="text-sm font-medium text-gray-900 whitespace-nowrap">
                    Nom de la sous-famille :
                  </label>
                  <input
                    type="text"
                    placeholder="Entrez le nom de la famille"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-green-500 focus:outline-none w-full p-2.5"
                  />
                </div>
              </div>
              <div className="gap-5 grid grid-cols-1 grid-template-columns: [label] 1fr [select] 2fr;">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-3 w-full">
                    <label className="text-sm font-medium text-gray-900 whitespace-nowrap">
                      Lien avec une famille :
                    </label>
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
              </div>

              <div className="flex gap-2 mt-7">
                <Button size="small" green>
                  <Plus />
                  Ajouter
                </Button>
                <Button size="small" danger>
                  <X />
                  Annuler
                </Button>
              </div>
            </form>
          </div>
        )}

        {page === "addSubSubFamilly" && (
          <div className="mt-7 mb-7">
            <form className="flex flex-col gap-4 w-[60%] mx-auto">
              <h4 className="text-center text-3xl text-gray-600 mb-5">
                <span className="font-bold text-gray-700">Ajout</span> d'une
                sous-sous-famille
              </h4>
              <div className="gap-5 grid grid-cols-1 grid-template-columns: [label] 1fr [select] 2fr;">
                <div className="flex flex-col gap-3">
                  <label className="text-sm font-medium text-gray-900 whitespace-nowrap">
                    Nom de la sous-sous-famille :
                  </label>
                  <input
                    type="text"
                    placeholder="Entrez le nom de la famille"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-green-500 focus:outline-none w-full p-2.5"
                  />
                </div>
              </div>
              <div className="gap-5 grid grid-cols-1 grid-template-columns: [label] 1fr [select] 2fr;">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-3 w-full">
                    <label className="text-sm font-medium text-gray-900 whitespace-nowrap">
                      Lien avec une sous-famille :
                    </label>
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
              </div>

              <div className="flex gap-2 mt-7">
                <Button size="small" green>
                  <Plus />
                  Ajouter
                </Button>
                <Button size="small" danger>
                  <X />
                  Annuler
                </Button>
              </div>
            </form>
          </div>
        )}
      </Card>
    </div>
  );
}
