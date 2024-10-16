import React, { useState, useEffect } from "react";
import Card from "../../components/Shared/Card";
import Button from "../../components/FormElements/Button";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useNavigate } from "react-router-dom";
import Spinner from "../../components/Shared/Spinner";
import ScrollToTop from "../../components/ScrollToTop";
import Modal from "../../components/Shared/Modal";
import { Divider } from "@mui/material";
import { ChevronsUpDown, Info, Plus } from "lucide-react";
import Header from "../../components/Navigation/Header";

type DataType = "DI1" | "DI2";

interface Dimension {
  _id: string;
  code: string;
  label: string;
  type: string;
  status: string;
  creator_id: any;
  additional_fields?: any;
}

interface DimensionPageProps {
  onSelectDimension: (dimension: Dimension) => void;
  shouldRefetch: boolean;
  highlightedDimensionId: string | null;
  resetHighlightedDimensionId: () => void;
}

export default function DimensionPage({
  onSelectDimension,
  shouldRefetch,
  highlightedDimensionId,
  resetHighlightedDimensionId,
}: DimensionPageProps) {
  const [prevSearchValue, setPrevSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItem, setTotalItem] = useState(null);
  const limit = 20;
  const totalPages = Math.ceil((totalItem ?? 0) / limit);
  const [dimensions, setDimensions] = useState<Dimension[]>([]);

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
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (highlightedDimensionId) {
      const timer = setTimeout(() => {
        resetHighlightedDimensionId();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [highlightedDimensionId, resetHighlightedDimensionId]);

  useEffect(() => {
    fetchDimensions();
  }, [shouldRefetch]);

  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-left">
        <thead className="border-y-[1px] border-gray-200 text-sm font-[800] text-gray-700 uppercase">
          <tr>
            <th scope="col" className="px-6 py-4 w-1/3">
              <div className="flex items-center">
                <span>type</span>
                <div className="cursor-pointer">
                  <ChevronsUpDown size={13} />
                </div>
              </div>
            </th>
            <th scope="col" className="px-6 py-4 w-1/3">
              <div className="flex items-center">
                <span>Code</span>
                <div className="cursor-pointer">
                  <ChevronsUpDown size={13} />
                </div>
              </div>
            </th>
            <th scope="col" className="px-6 py-4 w-[300px]">
              <div className="flex items-center">
                <span>libellé</span>
                <div className="cursor-pointer">
                  <ChevronsUpDown size={13} />
                </div>
              </div>
            </th>
            <th scope="col" className="px-6 py-4 w-[50px]">
              <div className="flex items-center">
                <span className="leading-3">statut</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {dimensions && dimensions.length > 0 ? (
            dimensions.map((dimension) => (
              <tr
                key={dimension._id}
                className={`border-y-[1px] border-gray-200 cursor-pointer hover:bg-slate-200 capitalize text-[12px] text-gray-800 whitespace-nowrap ${
                  dimension._id === highlightedDimensionId
                    ? "bg-orange-300 text-white"
                    : ""
                }`}
                onClick={() => onSelectDimension(dimension)}
              >
                <td
                  className={`px-6 py-2 ${
                    dimension._id === highlightedDimensionId ? "text-white" : ""
                  }`}
                >
                  {dimension.type}
                </td>
                <td className="px-6 py-2">{dimension.code}</td>
                <td className="px-6 py-2">{dimension.label}</td>
                <td className="px-6 py-2 uppercase text-[10px]">
                  {dimension.status === "A" ? (
                    <div className="text-center bg-green-200 text-green-600 border border-green-400  py-1 rounded-md max-w-[50px]">
                      <span>Actif</span>
                    </div>
                  ) : (
                    <div className="text-center bg-gray-200 text-gray-600 border border-gray-400  py-1 rounded-md max-w-[60px]">
                      <span>Inactif</span>
                    </div>
                  )}
                </td>
                {dimension._id === highlightedDimensionId && (
                  <td className="px-6 py-2">Nouveau</td>
                )}
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
              <span className="text-xl italic ml-2">{`"${prevSearchValue}"`}</span>
            )}
          </div>
          <div className="flex justify-end w-full">
            {dimensions && dimensions.length > 0 && (
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
