import React, {useState} from "react";
import Input from "@/src/components/FormElements/Input";

export default function LoginPage() {

  
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <form className="w-[500px]">
        <h1>Connexion</h1>
        <div>
            <Input />
        </div>
      </form>
    </div>
  );
}
