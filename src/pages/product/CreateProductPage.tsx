import React, { useState, useEffect } from "react";
import Input from "../../components/FormElements/Input";
import { useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import Card from "../../components/Shared/Card";
import { ImageUp } from "lucide-react";

export default function CreateProductPage() {
  const user = useSelector((state: any) => state.auth.user);

  return (
    <section className="w-full h-screen bg-gray-100 p-7">
      <div>
        <h3 className="text-[32px] font-bold text-gray-800">
          Créer un article
        </h3>
        <p className="text-[17px] text-gray-600">Lorem ipsum dolor sit amet</p>
      </div>
      <form className="flex gap-7 mt-[50px]">
        <div className="w-[70%] flex flex-col gap-3">
          <div className="relative border p-3 ">
            <div className="absolute top-[-15px] bg-gray-100 px-2">
              <span className="text-[13px] italic">Identification</span>
            </div>
            <Input
              element="input"
              id="reference"
              label="Référence :"
              value=""
              validators={[]}
              placeholder="Ajouter la référence du produit"
              create
              required
              gray
            />
            <Input
              element="input"
              id="desLong"
              label="Désignation longue :"
              value=""
              validators={[]}
              placeholder="Ajouter la designation du produit"
              create
              required
              gray
            />
            <Input
              element="input"
              id="desLong"
              label="Désignation Courte :"
              value=""
              validators={[]}
              placeholder=""
              create
              required
              gray
            />
          </div>
          <div className="relative border p-3 ">
            <div className="absolute top-[-15px] bg-gray-100 px-2">
              <span className="text-[13px] italic">Fournisseur principal</span>
            </div>
            <Input
              element="input"
              id="supplier"
              label="Nom :"
              value=""
              validators={[]}
              placeholder="Ajouter la référence du produit"
              create
              required
              gray
            />
            <Input
              element="input"
              id="reference"
              label="Référence produit :"
              value=""
              validators={[]}
              placeholder="Ajouter la designation du produit"
              create
              required
              gray
            />
          </div>
          <div className="mt-3">
            <h3 className="text-[22px] font-bold text-gray-800">
              Ajouter une image
            </h3>
            <div className="w-full h-[250px] border border-dashed border-2 border-gray-300 mt-3 flex justify-center items-center">
              <div className="flex flex-col items-center">
                <p className="font-bold text-gray-600">
                  Glissez déposez votre image ici ou{" "}
                  <span className="text-blue-400">
                    téléchargez depuis votre ordinateur
                  </span>
                </p>
                <div className="text-gray-300">
                  <ImageUp size={70} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-[30%] flex flex-col gap-5">
          <Card title="Classification principale">
            <div className="flex flex-col gap-3">
              <Input
                element="select"
                id="family"
                label="Famille :"
                value=""
                validators={[]}
                placeholder="Selectionnez un famille"
                required
                gray
              />
              <Input
                element="select"
                id="family"
                label="Sous-famille :"
                value=""
                validators={[]}
                placeholder="Selectionnez une sous-famille"
                required
                gray
              />
            </div>
          </Card>
          <Card title="Caractéristiques du produit">
            <div className="flex flex-col gap-3">
              <Input
                element="select"
                id="dimension"
                label="Dimensions :"
                value=""
                validators={[]}
                placeholder="Selectionnez une dimension"
                required
                gray
              />
              <Input
                element="select"
                id="composition"
                label="Composition :"
                value=""
                validators={[]}
                placeholder="Selectionnez une composition"
                required
                gray
              />
              <Input
                element="select"
                id="collection"
                label="Collection :"
                value=""
                validators={[]}
                placeholder="Selectionnez une collection"
                required
                gray
              />
              <Input
                element="select"
                id="theme"
                label="Thème :"
                value=""
                validators={[]}
                placeholder="Selectionnez un thème"
                required
                gray
              />
            </div>
          </Card>
        </div>
      </form>
    </section>
  );
}
