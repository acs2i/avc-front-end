import React, { useState, useEffect } from "react";
import Card from "../../components/Shared/Card";
import Button from "../../components/FormElements/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Info, Plus, SquarePen } from "lucide-react";
import Spinner from "../../components/Shared/Spinner";
import { Divider, Tooltip } from "@mui/material";
import ScrollToTop from "../../components/ScrollToTop";
import Modal from "../../components/Shared/Modal";
import Header from "../../components/Navigation/Header";

interface Brand {
  _id: string;
  YX_CODE: string;
  YX_LIBELLE: string;
}

interface BrandPageProps {
  onSelectBrand: (brand: Brand) => void;
  shouldRefetch: boolean;
  highlightedBrandId: string | null;
  resetHighlightedBrandId: () => void;
}

export default function BrandPage({
  onSelectBrand,
  shouldRefetch,
  highlightedBrandId,
  resetHighlightedBrandId,
}: BrandPageProps) {
  const [searchValue, setSearchValue] = useState("");
  const [prevSearchValue, setPrevSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItem, setTotalItem] = useState(null);
  const limit = 30;
  const totalPages = Math.ceil((totalItem ?? 0) / limit);
  const [brands, setBrands] = useState<Brand[]>([]);
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

  useEffect(() => {
    if (highlightedBrandId) {
      const timer = setTimeout(() => {
        resetHighlightedBrandId();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [highlightedBrandId, resetHighlightedBrandId]);

  useEffect(() => {
    fetchBrands();
  }, [shouldRefetch]);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="border-y-[1px] border-gray-200 text-sm font-[800] text-gray-700">
          <tr>
            <th scope="col" className="px-6 py-2 w-1/3">
              Code
            </th>
            <th scope="col" className="px-6 py-2 w-1/3">
              Libellé
            </th>
          </tr>
        </thead>
        <tbody>
          {brands && brands.length > 0 ? (
            brands.map((brand) => (
              <tr
                key={brand._id}
                className={`border-y-[1px] border-gray-200 cursor-pointer hover:bg-slate-200 capitalize text-[10px] text-gray-800 whitespace-nowrap ${
                  brand._id === highlightedBrandId
                    ? "bg-orange-200 text-white"
                    : ""
                }`}
                onClick={() => onSelectBrand(brand)}
              >
                <td className="px-6 py-2">{brand.YX_CODE}</td>
                <td className="px-6 py-2">{brand.YX_LIBELLE}</td>
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
      <div className="px-4 py-2 flex flex-col gap-2">
        <div className="w-full flex justify-between items-center">
          <div className="flex items-center">
            <h4 className="text-sm whitespace-nowrap">
              <span className="font-bold">{totalItem}</span> Dimensions
            </h4>
            {prevSearchValue && (
              <span className="text-md italic ml-2">{`"${prevSearchValue}"`}</span>
            )}
          </div>
          <div className="flex justify-end w-full">
            {brands && brands.length > 0 && (
              <div className="flex justify-center">
                <Stack spacing={2}>
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    size="small"
                  />
                </Stack>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
