import React, { useState, useEffect } from "react";
import Input from "../../components/FormElements/Input";
import { useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { useLocation, useNavigate } from "react-router-dom";
import { ImageUp, Upload } from "lucide-react";
import Button from "../../components/FormElements/Button";
import useNotify from "../../utils/hooks/useToast";
import { CircularProgress, Divider } from "@mui/material";

export default function DraftImportPage() {
  const creatorId = useSelector((state: any) => state.auth.user);
  const token = useSelector((state: any) => state.auth.token);
  const { notifySuccess, notifyError } = useNotify();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <section className="w-full bg-slate-50 p-7 min-h-screen">
        <div className="max-w-[2024px] mx-auto">
          <form className="mb-[400px]">
            <div className="flex justify-between">
              <div>
                <h3 className="text-[32px] font-[800] text-gray-800">
                  Importer <span className="font-[200]">des articles</span>
                </h3>
                {creatorId && (
                  <p className="text-[17px] text-gray-600 italic">
                    Importation faite par{" "}
                    <span className="font-[600]">{creatorId.username}</span>
                  </p>
                )}
              </div>
              {!isLoading ? (
                <div className="flex items-center justify-between gap-3 mt-[50px]">
                  <div className="flex gap-3">
                    <Button size="small" cancel type="button">
                      Annuler
                    </Button>
                    <Button size="small" blue type="submit">
                      Valider l'importation
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="mt-3">
                  <CircularProgress />
                </div>
              )}
            </div>

            <div className="flex flex-col-reverse lg:flex-row gap-7 mt-[50px] items-stretch">
              <div className="w-full h-[400px] flex flex-col gap-5 border-[5px] border-dashed border-slate-300 rounded-lg hover:bg-white hover:bg-opacity-75 transition ease-in-out delay-150 duration-300 cursor-pointer">
                <div className="w-full h-full flex justify-center items-center rounded-md">
                  <div className="flex flex-col items-center text-center gap-5">
                    <div className="w-[120px]">
                      <img src="/img/upload.png" alt="icone" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="text-gray-600 text-[25px]">
                        Glissez déposez votre fichier ici
                      </p>
                      <span className="text-gray-600 text-[15px]">ou</span>
                      <button className="border-[3px] border-blue-400 rounded-full hover:font-bold py-1 hover:bg-gradient-to-r from-cyan-500 to-blue-500 hover:text-white transition-all">
                        Téléchargez le depuis votre ordinateur
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
