import React, { useState, useEffect } from "react";
import Card from "../../components/Shared/Card";
import Button from "../../components/FormElements/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { Link, useNavigate } from "react-router-dom";
import { ChevronsUpDown, Info, Plus } from "lucide-react";
import Spinner from "../../components/Shared/Spinner";
import { Divider } from "@mui/material";
import ScrollToTop from "../../components/ScrollToTop";
import Modal from "../../components/Shared/Modal";
import Header from "../../components/Navigation/Header";

type DataType = "LA1" | "LA2" | "LA3";

interface Tag {
  _id: string;
  code: string;
  name: string;
  level: string;
  tag_grouping_id: any[];
  status: string;
  additional_fields?: any;
  creator_id: string;
}

interface ClassificationsPageProps {
  onSelectFamily: (family: Tag) => void;
  shouldRefetch: boolean;
  highlightedFamilyId: string | null;
  resetHighlightedFamilyId: () => void;
}

function ClassificationsPage({
  onSelectFamily,
  shouldRefetch,
  highlightedFamilyId,
  resetHighlightedFamilyId,
}: ClassificationsPageProps) {
  const [typeValue, setTypeValue] = useState("");
  const [codeValue, setCodeValue] = useState("");
  const [labelValue, setLabelValue] = useState("");
  const [prevSearchValue, setPrevSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItem, setTotalItem] = useState(null);
  const limit = 20;
  const totalPages = Math.ceil((totalItem ?? 0) / limit);
  const [families, setFamilies] = useState<Tag[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const typeLabels: { [key in DataType]: string } = {
    LA1: "Famille",
    LA2: "Sous-famille",
    LA3: "Sous-sous-famille",
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };

  const resetSearch = () => {
    setTypeValue("");
    setCodeValue("");
    setLabelValue("");
    setPrevSearchValue("");
    setCurrentPage(1);
  };

  useEffect(() => {
    if (!typeValue && !codeValue && !labelValue) {
      fetchFamily();
    } else {
      handleSearch();
    }
  }, [typeValue, codeValue, labelValue, currentPage]);

  const fetchFamily = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/tag?page=${currentPage}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      setFamilies(data.data);
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
        `${process.env.REACT_APP_URL_DEV}/api/v1/tag?page=${currentPage}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      console.log(data);
      setFamilies(data.data);
      setTotalItem(data.total);
      setPrevSearchValue(typeValue);
      setIsLoading(false);
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    }
  };

  useEffect(() => {
    if (highlightedFamilyId) {
      const timer = setTimeout(() => {
        resetHighlightedFamilyId();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [highlightedFamilyId, resetHighlightedFamilyId]);

  useEffect(() => {
    fetchFamily();
  }, [shouldRefetch]);

  return (
    <div className="relative overflow-x-auto w-full">
      <table className="w-full text-left">
        <thead className="border-y-[1px] border-gray-200 text-sm font-[800] text-gray-700 uppercase">
          <tr>
            <th scope="col" className="px-6 py-4 w-1/3">
              <div className="flex items-center">
                <span className="leading-3">Niveau</span>
                <div className="cursor-pointer">
                  <ChevronsUpDown size={13} />
                </div>
              </div>
            </th>
            <th scope="col" className="px-6 py-4 w-1/3">
              <div className="flex items-center">
                <span className="leading-3">Code</span>
                <div className="cursor-pointer">
                  <ChevronsUpDown size={13} />
                </div>
              </div>
            </th>
            <th scope="col" className="px-6 py-4 w-[300px]">
              <div className="flex items-center">
                <span className="leading-3">Libellé</span>
                <div className="cursor-pointer">
                  <ChevronsUpDown size={13} />
                </div>
              </div>
            </th>
            <th scope="col" className="px-6 py-4 w-[50px]">
              <div className="flex items-center">
                <span className="leading-3">Status</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {families && families.length > 0 ? (
            families.map((family) => (
              <tr
                key={family._id}
                className={`border-y-[1px] border-gray-200 cursor-pointer hover:bg-slate-200 capitalize text-[12px] text-gray-800 whitespace-nowrap ${
                  family._id === highlightedFamilyId
                    ? "bg-orange-300 text-white"
                    : ""
                }`}
                onClick={() => onSelectFamily(family)}
              >
                <td
                  className={`px-6 py-2 flex items-center gap-2 ${
                    family._id === highlightedFamilyId ? "text-white" : ""
                  } `}
                >
                  {family.level}
                </td>
                <td className="px-6 py-2">{family.code}</td>
                <td className="px-6 py-2">{family.name}</td>
                <td className="px-6 py-2 uppercase">
                    {family.status === "A" ? (
                      <div className="text-center bg-green-200 text-green-600 border border-green-400  py-1 rounded-md max-w-[60px]">
                        <span>Actif</span>
                      </div>
                    ) : (
                      <div className="text-center bg-gray-200 text-gray-600 border border-gray-400  py-1 rounded-md max-w-[60px]">
                        <span>Innactif</span>
                      </div>
                    )}
                  </td>
                {family._id === highlightedFamilyId && (
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
            <h4 className="text-xs whitespace-nowrap">
              <span className="font-bold">{totalItem}</span> Classifications
            </h4>
            {prevSearchValue && (
              <span className="text-xs italic ml-2">{`"${prevSearchValue}"`}</span>
            )}
          </div>
          <div className="flex justify-end w-full">
            {families && families.length > 0 && (
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

export default ClassificationsPage;
