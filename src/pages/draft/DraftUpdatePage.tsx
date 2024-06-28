import { ChevronLeft } from "lucide-react";
import Button from "../../components/FormElements/Button";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

interface Draft {
  _id: string;
  creator_id: any;
  description_ref: string;
  reference: string;
  designation_longue: string;
  designation_courte: string;
  supplier_name: string;
  supplier_ref: string;
  family: string[];
  subFamily: string[];
  dimension_type: string;
  dimension: string[];
  brand: string;
  ref_collection: string;
  composition: string;
  description_brouillon: string;
  status: number;
  createdAt: any;
}

export default function DraftUpdatePage() {
  const token = useSelector((state: any) => state.auth.token);
  const [isSend, setisSned] = useState(true);
  const [error, setError] = useState("")
  const navigate = useNavigate();
  const [draft, setDraft] = useState<Draft>();
  const { id } = useParams();

  useEffect(() => {
    fetchDraft();
  }, []);

  const fetchDraft = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/draft/draft/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      setDraft(data);
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    } finally {
    }
  };

  const handleSend = async () => {
    if (!draft) return;
  
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/draft/draft/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: 1 }),
        }
      );
  
      if (response.ok) {
        const updatedDraft = await response.json();
        setDraft(updatedDraft);
        navigate(-1)
      } else {
        setError("Erreur lors de la transmission du brouillon");
      }
    } catch (error) {
      console.error("Erreur lors de la requête", error);
      setError("Erreur lors de la transmission du brouillon");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/draft/draft/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        navigate(-1)
      } else {
        setError("Erreur lors de la suppresion du brouillon")
      }
    } catch (error) {
      setError("Erreur lors de la suppression du brouillon");
    } 
  };

  return (
    <section className="h-screen bg-gray-100 p-8">
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div onClick={() => navigate(-1)} className="cursor-pointer">
              <ChevronLeft />
            </div>
            <h1 className="text-[32px] font-[800]">
              Vérification avant validation
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button size="small" blue={isSend} disabled={!isSend} onClick={handleSend}>
              Transmettre
            </Button>
            <Button size="small" inverseBlue>
              Compléter
            </Button>
            <Button size="small" danger onClick={handleDelete}>
              Supprimer
            </Button>
          </div>
        </div>
        {draft && (
          <div className="flex items-center gap-3">
            <h2 className="text-[25px] capitalize">
              {draft.designation_longue}
            </h2>
            <button className="text-blue-600 text-[12px]">Modifier</button>
          </div>
        )}
      </div>
      <div className="mt-7 w-3/4">
        {draft && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="flex items-center text-[16px] font-[600] gap-2">
                <span className="font-bold text-gray-700">Référence :</span>
                <span className="text-gray-600">{draft.reference}</span>
              </div>

              <div className="flex items-center text-[16px] font-[600] gap-2">
                <span className="font-bold text-gray-700">
                  Désignation longue :
                </span>
                <span className="text-gray-600">
                  {draft.designation_longue}
                </span>
              </div>

              <div className="flex items-center text-[16px] font-[600] gap-2">
                <span className="font-bold text-gray-700">
                  Désignation courte :
                </span>
                <span className="text-gray-600">
                  {draft.designation_courte}
                </span>
              </div>

              <div className="flex items-center text-[16px] font-[600] gap-2">
                <span className="font-bold text-gray-700">
                  Fournisseur principal :
                </span>
                <span className="text-gray-600">{draft.supplier_name}</span>
              </div>

              <div className="flex items-center text-[16px] font-[600] gap-2">
                <span className="font-bold text-gray-700">Dimensions :</span>
                <span className="text-gray-600">Couleur/Taille</span>
              </div>

              <div className="flex items-center text-[16px] font-[600] gap-2">
                <span className="font-bold text-gray-700">Marque :</span>
                <span className="text-gray-600">
                  {draft.brand ? draft.brand : "N/A"}
                </span>
              </div>

              <div className="flex items-center text-[16px] font-[600] gap-2">
                <span className="font-bold text-gray-700">Collection :</span>
                <span className="text-gray-600">
                  {draft?.ref_collection ? draft?.ref_collection : "N/A"}
                </span>
              </div>

              <div className="flex items-center text-[16px] font-[600] gap-2">
                <span className="font-bold text-gray-700">Famille :</span>
                <span className="text-gray-600">
                  {draft?.family ? draft.family : "N/A"}
                </span>
              </div>

              <div className="flex items-center text-[16px] font-[600] gap-2">
                <span className="font-bold text-gray-700">Sous-famille :</span>
                <span className="text-gray-600">
                  {draft.subFamily ? draft.subFamily : "N/A"}
                </span>
              </div>

              <div className="flex items-center text-[16px] font-[600] gap-2">
                <span className="font-bold text-gray-700">
                  Sous-sous-famille :
                </span>
                <span className="text-gray-600">N/A</span>
              </div>

              <div className="flex items-center text-[16px] font-[600] gap-2">
                <span className="font-bold text-gray-700">
                  Conditionement :
                </span>
                <span className="text-gray-600">N/A</span>
              </div>

              <div className="flex items-center text-[16px] font-[600] gap-2">
                <span className="font-bold text-gray-700">
                  Origine de fabrication :
                </span>
                <span className="text-gray-600">N/A</span>
              </div>

              <div className="flex items-center text-[16px] font-[600] gap-2">
                <span className="font-bold text-gray-700">Mesure :</span>
                <span className="text-gray-600">PCE - Pièce</span>
              </div>

              <div className="flex items-center text-[16px] font-[600] gap-2">
                <span className="font-bold text-gray-700">Vente :</span>
                <span className="text-gray-600">UNI - Unité</span>
              </div>

              <div className="flex items-center text-[16px] font-[600] gap-2">
                <span className="font-bold text-gray-700">Packaging :</span>
                <span className="text-gray-600">Standard</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
