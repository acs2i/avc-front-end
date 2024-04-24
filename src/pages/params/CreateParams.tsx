import React from "react";
import Input from "../../components/FormElements/Input";
import Card from "../../components/Shared/Card";

function CreateParams() {
  return (
    <div>
      <Card title="Création grilles de tailles">
        <form className="w-[80%] mx-auto py-4">
          <div className="gap-5 grid grid-cols-2 grid-template-columns: [label] 1fr [select] 2fr;">
            <div>
              <Input
                element="input"
                id="name"
                label="Libéllé de la grille :"
                value=""
                validators={[]}
                placeholder="Ajouter le libéllé"
                gray
              />
              <Input
                element="select"
                id="size"
                label="Les tailles choisies :"
                value=""
                validators={[]}
                placeholder="Choissisez vos taillees"
                gray
              />
            </div>
            <div className="border-[1px] border-gray-300 "></div>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default CreateParams;
