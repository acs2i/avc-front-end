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
import { Info, Plus } from "lucide-react";
import Header from "../../components/Navigation/Header";

type DataType = "DI1" | "DI2";

interface Dimension {
  _id: string;
  GDI_DIMORLI: string;
  GDI_LIBELLE: string;
  GDI_TYPEDIM: DataType;
}

interface DimensionPageProps {
  onSelectDimension: (dimension: Dimension) => void;
  shouldRefetch: boolean;
}

export default function DimensionPage({ onSelectDimension, shouldRefetch }: DimensionPageProps) {
  const [prevSearchValue, setPrevSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItem, setTotalItem] = useState(null);
  const limit = 30;
  const totalPages = Math.ceil((totalItem ?? 0) / limit);
  const [dimensions, setDimensions] = useState<Dimension[]>([]);


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
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDimensions();
  }, [shouldRefetch]);

  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-left">
        <thead className="border-y-[1px] border-gray-200 text-sm font-[800] text-gray-700">
          <tr>
            <th scope="col" className="px-6 py-2 w-1/3">
              Type
            </th>
            <th scope="col" className="px-6 py-2 w-[10%]">
              Code
            </th>
            <th scope="col" className="px-6 py-2 w-1/3">
              Libellé
            </th>
          </tr>
        </thead>
        <tbody>
          {dimensions && dimensions.length > 0 ? (
            dimensions.map((dimension) => (
              <tr
                key={dimension._id}
                className="border-y-[1px] border-gray-200 cursor-pointer hover:bg-slate-200 capitalize text-[10px] text-gray-800 whitespace-nowrap"
                onClick={() => onSelectDimension(dimension)}
              >
                <td className="px-6 py-2 text-blue-600">
                  {dimension.GDI_TYPEDIM in typeLabels
                    ? typeLabels[dimension.GDI_TYPEDIM]
                    : "Type inconnu"}
                </td>
                <td className="px-6 py-2">{dimension.GDI_DIMORLI}</td>
                <td className="px-6 py-2">{dimension.GDI_LIBELLE}</td>
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
