import React, { useState, useEffect } from "react";
import Card from "../../components/Shared/Card";
import Button from "../../components/FormElements/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, SquarePen } from "lucide-react";
import { Tooltip } from "@mui/material";
import Spinner from "../../components/Shared/Spinner";
import ScrollToTop from '../../components/ScrollToTop';


type DataType = "DI1" | "DI2";
interface Dimension {
  _id: string;
  GDI_DIMORLI: string;
  GDI_LIBELLE: string;
  GDI_TYPEDIM: DataType;
}

export default function DimensionPage() {
  const [searchValue, setSearchValue] = useState("");
  const [prevSearchValue, setPrevSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItem, setTotalItem] = useState(null);
  const limit = 20;
  const totalPages = Math.ceil((totalItem ?? 0) / limit);
  const [dimensions, setDimensions] = useState<Dimension[]>([]);
  const navigate = useNavigate();

  const typeLabels: { [key in DataType]: string } = {
    DI1: "Couleur",
    DI2: "Taille",
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };

  useEffect(() => {
    fetchDimensions();
  }, [currentPage]);

  const fetchDimensions = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/dimension?page=${currentPage}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      setDimensions(data.data);
      setTotalItem(data.total);
      console.log(data);
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/dimension/search?value=${searchValue}&page=${currentPage}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setDimensions(data);
      setTotalItem(data.length);
      setPrevSearchValue(searchValue);
      setIsLoading(false);
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    }
  };

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="relative">
      <div
        className="flex items-center gap-2 mb-3 cursor-pointer"
        onClick={() => navigate("/parameters")}
      >
        <ArrowLeft />
        <span>retour</span>
      </div>
      <Card title="Paramétrer les collections">
        <div className="flex items-center gap-4 p-7">
          <div className="relative shadow-md flex-1">
            <input
              type="text"
              id="search"
              className="block p-2.5 w-full text-sm text-gray-900 border-2 border-gray-200 bg-gray-50 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Rechercher une classification"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            {!isLoading ? (
              <button
                type="submit"
                className="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-green-800 rounded-e-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
                onClick={handleSearch}
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
            ) : (
              <div className="absolute top-0 end-0 h-full rounded-e-lg">
                <CircularProgress />
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Button size="small" blue>
              Créer une collection
            </Button>
          </div>
        </div>
        {dimensions && dimensions.length > 0 && (
          <div className="flex justify-center p-7">
            <Stack spacing={2}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
              />
            </Stack>
          </div>
        )}
        <div className="overflow-x-auto bg-white">
          <div className="px-3 mb-2 flex items-center gap-2">
            <h4 className="text-xl">
              <span className="font-bold">{totalItem}</span> Dimensions
            </h4>
            {prevSearchValue && (
              <span className="text-xl italic">{`"${prevSearchValue}"`}</span>
            )}
          </div>
          <table className="w-full text-left">
            <thead className="bg-blue-50 text-md text-gray-500 border ">
              <tr>
                <th scope="col" className="px-6 py-4 w-1/3">
                  Code
                </th>
                <th scope="col" className="px-6 py-4 w-1/3">
                  Libellé
                </th>
                <th scope="col" className="px-6 py-4 w-1/3">
                  Type
                </th>
              </tr>
            </thead>
            <tbody>
              {dimensions && dimensions.length > 0 ? (
                dimensions.map((dimension) => (
                  <tr
                    key={dimension._id}
                    className="bg-white cursor-pointer hover:bg-slate-200 capitalize text-sm text-gray-400 even:bg-slate-50 whitespace-nowrap font-bold"
                    onClick={() => navigate(`/parameters/dimension/${dimension._id}`)}
                  >
                    <td className="px-6 py-4">{dimension.GDI_DIMORLI}</td>
                    <td className="px-6 py-4">{dimension.GDI_LIBELLE}</td>
                    <td className="px-6 py-4">
                      {dimension.GDI_TYPEDIM in typeLabels
                        ? typeLabels[dimension.GDI_TYPEDIM]
                        : "Type inconnu"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-7 text-center">
                    {totalItem === null ? (
                      <div className="flex justify-center overflow-hidden p-[30px]">
                        <Spinner />
                      </div>
                    ) : (
                      "Aucun Résultat"
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
      {totalItem !== null && totalItem > 10 && (
        <ScrollToTop scrollThreshold={300} />
      )}
    </div>
  );
}