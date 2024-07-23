import React, { useState, useEffect } from "react";
import Card from "../../components/Shared/Card";
import Button from "../../components/FormElements/Button";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useNavigate } from "react-router-dom";
import Spinner from "../../components/Shared/Spinner";
import ScrollToTop from "../../components/ScrollToTop";
import { ChevronsUpDown, Info, Plus } from "lucide-react";
import Modal from "../../components/Shared/Modal";
import { Divider } from "@mui/material";
import Header from "../../components/Navigation/Header";

interface Collection {
  _id: string;
  code: string;
  label: string;
  status: string;
  creator_id: any;
  additional_fields?: any;
}

interface CollectionPageProps {
  onSelectCollection: (collection: Collection) => void;
  shouldRefetch: boolean;
  highlightedCollectionId: string | null;
  resetHighlightedCollectionId: () => void;
}

export default function CollectionPage({
  onSelectCollection,
  shouldRefetch,
  highlightedCollectionId,
  resetHighlightedCollectionId,
}: CollectionPageProps) {
  const [searchValue, setSearchValue] = useState("");
  const [prevSearchValue, setPrevSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItem, setTotalItem] = useState(null);
  const limit = 20;
  const totalPages = Math.ceil((totalItem ?? 0) / limit);
  const [collections, setCollections] = useState<Collection[]>([]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };

  useEffect(() => {
    fetchCollections();
  }, [currentPage]);

  const fetchCollections = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/collection?page=${currentPage}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      setCollections(data.data);
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
        `${process.env.REACT_APP_URL_DEV}/api/v1/collection/search?value=${searchValue}&page=${currentPage}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      setCollections(data);
      setTotalItem(data.length);
      setPrevSearchValue(searchValue);
      setIsLoading(false);
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    }
  };

  useEffect(() => {
    if (highlightedCollectionId) {
      const timer = setTimeout(() => {
        resetHighlightedCollectionId();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [highlightedCollectionId, resetHighlightedCollectionId]);

  useEffect(() => {
    fetchCollections();
  }, [shouldRefetch]);

  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-left">
        <thead className="border-y-[1px] border-gray-200 text-sm font-[800] text-gray-700 uppercase">
          <tr>
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
                <span className="leading-3">status</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {collections && collections.length > 0 ? (
            collections.map((collection) => (
              <tr
                key={collection._id}
                className={`border-y-[1px] border-gray-200 cursor-pointer hover:bg-slate-200 capitalize text-[12px] text-gray-800 whitespace-nowrap ${
                  collection._id === highlightedCollectionId
                    ? "bg-orange-500 text-white"
                    : ""
                }`}
                onClick={() => onSelectCollection(collection)}
              >
                <td className="px-6 py-2">{collection.code}</td>
                <td className="px-6 py-2 ">{collection.label}</td>
                <td className="px-6 py-2 uppercase">
                  {collection.status === "A" ? (
                    <div className="text-center bg-green-200 text-green-600 border border-green-400  py-1 rounded-md max-w-[60px]">
                      <span>Actif</span>
                    </div>
                  ) : (
                    <div className="text-center bg-gray-200 text-gray-600 border border-gray-400  py-1 rounded-md max-w-[60px]">
                      <span>Innactif</span>
                    </div>
                  )}
                </td>
                {collection._id === highlightedCollectionId && (
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
              <span className="font-bold">{totalItem}</span> Collections
            </h4>
            {prevSearchValue && (
              <span className="text-sm italic ml-2">{`"${prevSearchValue}"`}</span>
            )}
          </div>
          <div className="flex justify-end w-full">
            {collections && collections.length > 0 && (
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
