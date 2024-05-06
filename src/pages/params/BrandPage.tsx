import React, { useState, useEffect } from "react";
import Card from "../../components/Shared/Card";
import Button from "../../components/FormElements/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, SquarePen } from "lucide-react";
import Spinner from "../../components/Shared/Spinner";
import { Tooltip } from "@mui/material";
import ScrollToTop from "../../components/ScrollToTop";

interface Collection {
  _id: string;
  YX_CODE: string;
  YX_LIBELLE: string;
}

export default function BrandPage() {
  const [searchValue, setSearchValue] = useState("");
  const [prevSearchValue, setPrevSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItem, setTotalItem] = useState(null);
  const limit = 20;
  const totalPages = Math.ceil((totalItem ?? 0) / limit);
  const [brands, setBrands] = useState<Collection[]>([]);
  const navigate = useNavigate();

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };

  useEffect(() => {
    fetchBrands();
  }, [currentPage]);

  const fetchBrands = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/brand?page=${currentPage}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      setBrands(data.data);
      setTotalItem(data.total);
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
        `${process.env.REACT_APP_URL_DEV}/api/v1/brand/search?value=${searchValue}&page=${currentPage}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      setBrands(data);
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
      <Card title="Paramétrer les marques">
        <div className="flex items-center justify-center gap-4 p-7">
          <div className="flex items-center gap-4">
            <label className="w-[60px] text-sm font-bold">Code :</label>
            <input
              type="text"
              id="code"
              className="block p-1.5 text-sm text-gray-900 border-2 border-gray-200 bg-gray-50 rounded-sm"
              placeholder="Rechercher par code"
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-[60px] text-sm font-bold">Libellé :</label>
            <input
              type="text"
              id="code"
              className="block p-1.5 text-sm text-gray-900 border-2 border-gray-200 bg-gray-50 rounded-sm"
              placeholder="Rechercher par libellé"
            />
          </div>
          <div className="flex items-center gap-3">
            <Button size="small" green to="/parameters/brand/create">
              Créer une marque
            </Button>
          </div>
        </div>
        {brands && brands.length > 0 && (
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
              <span className="font-bold">{totalItem}</span> Marques
            </h4>
            {prevSearchValue && (
              <span className="text-xl italic">{`"${prevSearchValue}"`}</span>
            )}
          </div>
          <table className="w-full text-left">
            <thead className="bg-blue-50 text-md text-gray-500">
              <tr>
                <th scope="col" className="px-6 py-4 w-1/3">
                  Code
                </th>
                <th scope="col" className="px-6 py-4 w-1/3">
                  Libellé
                </th>
              </tr>
            </thead>
            <tbody>
              {brands && brands.length > 0 ? (
                brands.map((brand) => (
                  <tr
                    key={brand._id}
                    className="bg-white cursor-pointer hover:bg-slate-200 capitalize text-sm text-gray-400 even:bg-slate-50 whitespace-nowrap font-bold border"
                    onClick={() => navigate(`/parameters/brand/${brand._id}`)}
                  >
                    <td className="px-6 py-4">{brand.YX_CODE}</td>
                    <td className="px-6 py-4">{brand.YX_LIBELLE}</td>
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
