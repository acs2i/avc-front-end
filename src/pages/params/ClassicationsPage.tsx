import React, { useState, useEffect } from "react";
import Card from "../../components/Shared/Card";
import Button from "../../components/FormElements/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

type DataType = "LA1" | "LA2" | "LA3";

interface Family {
  _id: string;
  YX_CODE: string;
  YX_TYPE: DataType;
  YX_LIBELLE: string;
}

function ClassicationsPage() {
  const [isModify, setIsModify] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [families, setFamilies] = useState<Family[]>([]);
  const navigate = useNavigate()

  const typeLabels: { [key in DataType]: string } = {
    LA1: "Famille",
    LA2: "Sous-famille",
    LA3: "Sous-sous-famille",
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/family?page=${1}&limit=${20}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      setFamilies(data);
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-3 cursor-pointer" onClick={() => navigate(-1)}>
        <ArrowLeft/>
        <span>retour</span>
      </div>
      <Card title="Paramétrer les classifications">
        <div className="flex items-center gap-4 p-7">
          <div className="relative shadow-md flex-1">
            <input
              type="search"
              id="search-dropdown"
              className="block p-2.5 w-full text-sm text-gray-900 border-2 border-gray-200 bg-gray-50 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Rechercher une classification"
            />
            <button
              type="submit"
              className="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-green-800 rounded-e-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
            >
              <svg
                className="w-4 h-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </button>
          </div>
          <div className="flex items-center gap-3">
            <Button
              size="small"
              blue
              onClick={() => setIsModify((prev) => !prev)}
            >
              {isModify ? "Arréter de modifier" : "Modifier"}
            </Button>
            <Button size="small" blue>
              Créer une classification
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto bg-white shadow-md">
          <table className="w-full text-left">
            <thead className="bg-blue-50 text-md text-gray-500">
              <tr>
                {isModify && (
                  <th scope="col" className="px-6 py-4">
                    #
                  </th>
                )}
                <th scope="col" className="px-6 py-4">
                  Code classification
                </th>
                <th scope="col" className="px-6 py-4">
                  Niveau
                </th>
                <th scope="col" className="px-6 py-4">
                  Libéllé
                </th>
              </tr>
            </thead>
            <tbody>
              {families && families.length > 0 ? (
                families.map((family) => (
                  <tr
                    key={family._id}
                    className="bg-white cursor-pointer hover:bg-slate-200 capitalize text-sm text-gray-400 even:bg-slate-50 whitespace-nowrap font-bold"
                  >
                    {isModify && (
                      <td className="px-6 py-4">
                        <input
                          id="default-checkbox"
                          type="checkbox"
                          value=""
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </td>
                    )}
                    <td className="px-6 py-4">{family.YX_CODE}</td>
                    <td className="px-6 py-4 flex items-center gap-2">
                      {typeLabels[family.YX_TYPE]}
                    </td>
                    <td className="px-6 py-4">{family.YX_LIBELLE}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-7 text-center">
                    <CircularProgress size={80} />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export default ClassicationsPage;
