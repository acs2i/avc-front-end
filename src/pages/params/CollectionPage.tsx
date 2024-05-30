import React, { useState, useEffect } from "react";
import Card from "../../components/Shared/Card";
import Button from "../../components/FormElements/Button";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useNavigate } from "react-router-dom";
import Spinner from "../../components/Shared/Spinner";
import ScrollToTop from "../../components/ScrollToTop";
import { Info } from "lucide-react";
import Modal from "../../components/Shared/Modal";
import { Divider } from "@mui/material";

interface Collection {
  _id: string;
  CODE: string;
  LIBELLE: string;
}

export default function CollectionPage() {
  const [searchValue, setSearchValue] = useState("");
  const [prevSearchValue, setPrevSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItem, setTotalItem] = useState(null);
  const limit = 20;
  const totalPages = Math.ceil((totalItem ?? 0) / limit);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

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

  return (
    <div className="relative">
      <Modal
        show={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onClose={() => setIsModalOpen(false)}
        header="Informations"
        icon="i"
      >
        <div className="px-7 mb-5">
          <p className="text-gray-800 text-xl">
            Ici vous trouverez la liste de toutes les collections enregistrées.
            Cliquez sur la collection que vous souhaitez modifier pour ouvrir le
            panneau de modification.
          </p>
        </div>
        <Divider />
        <div className="flex justify-end mt-7 px-7">
          <Button blue size="small" onClick={() => setIsModalOpen(false)}>
            J'ai compris
          </Button>
        </div>
      </Modal>
      <Card
        title="Paramétrer les collections"
        createTitle="Créer Une Collection"
        link="/parameters/collection/create"
      >
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
              id="label"
              className="block p-1.5 text-sm text-gray-900 border-2 border-gray-200 bg-gray-50 rounded-sm"
              placeholder="Rechercher par libellé"
            />
          </div>

          <div
            className="cursor-pointer text-gray-500"
            onClick={() => setIsModalOpen(true)}
          >
            <Info size={22} />
          </div>
        </div>
        {collections && collections.length > 0 && (
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
        <div className="relative overflow-x-auto">
          <div className="px-3 mb-2 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <h4 className="text-md">
                <span className="font-bold">{totalItem}</span> Collections
              </h4>
              {prevSearchValue && (
                <span className="text-xl italic">{`"${prevSearchValue}"`}</span>
              )}
            </div>
            <Button
              size="small"
              to="/parameters/collection/create"
              blue
            >
              Créer Une Collection
            </Button>
          </div>
          <table className="w-full text-left mt-7">
            <thead className="border-t text-sm text-gray-500">
              <tr>
                <th scope="col" className="px-6 py-4 w-1/2">
                  Code
                </th>
                <th scope="col" className="px-6 py-4 w-1/2">
                  Libellé
                </th>
              </tr>
            </thead>
            <tbody>
              {collections && collections.length > 0 ? (
                collections.map((collection) => (
                  <tr
                    key={collection._id}
                    className="bg-white cursor-pointer hover:bg-slate-200 capitalize text-xs text-gray-800 even:bg-slate-50 whitespace-nowrap border"
                    onClick={() =>
                      navigate(`/parameters/collection/${collection._id}`)
                    }
                  >
                    <td className="px-6 py-4">{collection.CODE}</td>
                    <td className="px-6 py-4">{collection.LIBELLE}</td>
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
