import React, { useState, useEffect } from "react";
import Card from "../../components/Shared/Card";
import Button from "../../components/FormElements/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronsUpDown, Info, Plus, SquarePen } from "lucide-react";
import Spinner from "../../components/Shared/Spinner";
import { Divider, Tooltip } from "@mui/material";
import ScrollToTop from "../../components/ScrollToTop";
import Modal from "../../components/Shared/Modal";
import Header from "../../components/Navigation/Header";



interface Tax {
  _id: string;
  code: string;
  label: string;
  rate: string;
  status: string;
  creator_id: any;

}


interface UserFieldPageProps {
  onSelectTax: (tax: Tax) => void;
  shouldRefetch: boolean;
  highlightedUserFieldId: string | null;
  resetHighlightedUserFieldId: () => void;
}

export default function TaxPage({
    onSelectTax,
    shouldRefetch,
    highlightedUserFieldId,
    resetHighlightedUserFieldId,
  }: UserFieldPageProps) {
    const [searchValue, setSearchValue] = useState("");
    const [prevSearchValue, setPrevSearchValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItem, setTotalItem] = useState(null);
    const limit = 20;
    const totalPages = Math.ceil((totalItem ?? 0) / limit);
    const [taxs, setTaxs] = useState<Tax[]>([]);
    const navigate = useNavigate();
  
    const handlePageChange = (
      event: React.ChangeEvent<unknown>,
      value: number
    ) => {
      setCurrentPage(value);
    };
  
   
    const fetchTax = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_URL_DEV}/api/v1/tax`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
  
        const data = await response.json();
        setTaxs(data.data);
        setTotalItem(data.total);
      } catch (error) {
        console.error("Erreur lors de la requête", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    useEffect(() => {
      if (highlightedUserFieldId) {
        const timer = setTimeout(() => {
          resetHighlightedUserFieldId();
        }, 3000);
  
        return () => clearTimeout(timer);
      }
    }, [highlightedUserFieldId, resetHighlightedUserFieldId]);
  
    useEffect(() => {
      fetchTax();
    }, [shouldRefetch]);
  
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-y-[1px] border-gray-200 text-sm font-[800] text-gray-700 uppercase">
            <tr>
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
                  <span>Libellé</span>
                  <div className="cursor-pointer">
                    <ChevronsUpDown size={13} />
                  </div>
                </div>
              </th>
              <th scope="col" className="px-6 py-4 w-[300px]">
                <div className="flex items-center">
                  <span>Taux</span>
                  <div className="cursor-pointer">
                    <ChevronsUpDown size={13} />
                  </div>
                </div>
              </th>
              <th scope="col" className="px-6 py-4 w-[50px]">
                <div className="flex items-center">
                  <span className="leading-3">status</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {taxs && taxs.length > 0 ? (
              taxs.map((tax) => (
                <tr
                  key={tax._id}
                  className={`border-y-[1px] border-gray-200 cursor-pointer hover:bg-slate-200 capitalize text-[12px] text-gray-800 whitespace-nowrap ${
                    tax._id === highlightedUserFieldId
                      ? "bg-orange-300 text-white"
                      : ""
                  }`}
                  onClick={() => onSelectTax(tax)}
                >
                  <td className="px-6 py-2">{tax.code}</td>
                  <td className="px-6 py-2">{tax.label}</td>
                  <td className="px-6 py-2">{tax.rate} %</td>
                  <td className="px-6 py-2 uppercase text-[10px]">
                    {tax.status === "A" ? (
                      <div className="text-center bg-green-200 text-green-600 border border-green-400  py-1 rounded-md max-w-[50px]">
                        <span>Actif</span>
                      </div>
                    ) : (
                      <div className="text-center bg-gray-200 text-gray-600 border border-gray-400  py-1 rounded-md max-w-[60px]">
                        <span>Inactif</span>
                      </div>
                    )}
                  </td>
                  {tax._id === highlightedUserFieldId && (
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
                <span className="font-bold">{totalItem}</span> Taxes
              </h4>
              {prevSearchValue && (
                <span className="text-md italic ml-2">{`"${prevSearchValue}"`}</span>
              )}
            </div>
            <div className="flex justify-end w-full">
              {taxs && taxs.length > 0 && (
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
  
