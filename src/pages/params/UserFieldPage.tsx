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

interface CustomField {
  field_name: string;
  field_type: string;
  options?: string[];
  value?: string;
}

interface Field {
  _id: string;
  code: string;
  label: string;
  status: string;
  apply_to: string;
  creator_id: any;
  additional_fields: CustomField[];
}


interface UserFieldPageProps {
  onSelectUserField: (userField: Field) => void;
  shouldRefetch: boolean;
  highlightedUserFieldId: string | null;
  resetHighlightedUserFieldId: () => void;
}

export default function UserFieldPage({
    onSelectUserField,
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
    const [userFields, setUserFields] = useState<Field[]>([]);
    const navigate = useNavigate();
  
    const handlePageChange = (
      event: React.ChangeEvent<unknown>,
      value: number
    ) => {
      setCurrentPage(value);
    };
  
   
    const fetchField = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_URL_DEV}/api/v1/user-field`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
  
        const data = await response.json();
        setUserFields(data.data);
        console.log(userFields)
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
          `${process.env.REACT_APP_URL_DEV}/api/v1/user-field/search?value=${searchValue}&page=${currentPage}&limit=${limit}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
  
        const data = await response.json();
        setUserFields(data);
      
        setTotalItem(data.length);
        setPrevSearchValue(searchValue);
        setIsLoading(false);
      } catch (error) {
        console.error("Erreur lors de la requête", error);
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
      fetchField();
    }, [shouldRefetch]);
  
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-y-[1px] border-gray-200 text-sm font-[800] text-gray-700 uppercase">
            <tr>
              <th scope="col" className="px-6 py-4 w-1/3">
                <div className="flex items-center">
                  <span>Numéro</span>
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
                  <span>Associé à</span>
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
            {userFields && userFields.length > 0 ? (
              userFields.map((userField) => (
                <tr
                  key={userField._id}
                  className={`border-y-[1px] border-gray-200 cursor-pointer hover:bg-slate-200 capitalize text-[12px] text-gray-800 whitespace-nowrap ${
                    userField._id === highlightedUserFieldId
                      ? "bg-orange-300 text-white"
                      : ""
                  }`}
                  onClick={() => onSelectUserField(userField)}
                >
                  <td className="px-6 py-2">{userField.code}</td>
                  <td className="px-6 py-2">{userField.label}</td>
                  <td className="px-6 py-2">{userField.apply_to}</td>
                  <td className="px-6 py-2 uppercase text-[10px]">
                    {userField.status === "A" ? (
                      <div className="text-center bg-green-200 text-green-600 border border-green-400  py-1 rounded-md max-w-[50px]">
                        <span>Actif</span>
                      </div>
                    ) : (
                      <div className="text-center bg-gray-200 text-gray-600 border border-gray-400  py-1 rounded-md max-w-[60px]">
                        <span>Inactif</span>
                      </div>
                    )}
                  </td>
                  {userField._id === highlightedUserFieldId && (
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
                <span className="font-bold">{totalItem}</span> Champs utilisateur
              </h4>
              {prevSearchValue && (
                <span className="text-md italic ml-2">{`"${prevSearchValue}"`}</span>
              )}
            </div>
            <div className="flex justify-end w-full">
              {userFields && userFields.length > 0 && (
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
  
