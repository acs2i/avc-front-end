import React, { useState, useEffect } from "react";
import Card from "../../components/Shared/Card";
import Button from "../../components/FormElements/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Info, SquarePen } from "lucide-react";
import Spinner from "../../components/Shared/Spinner";
import { Divider, Tooltip } from "@mui/material";
import ScrollToTop from "../../components/ScrollToTop";
import Modal from "../../components/Shared/Modal";

type DataType = "LA1" | "LA2" | "LA3";

interface Family {
  _id: string;
  YX_CODE: string;
  YX_TYPE: DataType;
  YX_LIBELLE: string;
}

function ClassificationsPage() {
  const [typeValue, setTypeValue] = useState("");
  const [codeValue, setCodeValue] = useState("");
  const [labelValue, setLabelValue] = useState("");
  const [prevSearchValue, setPrevSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItem, setTotalItem] = useState(null);
  const limit = 20;
  const totalPages = Math.ceil((totalItem ?? 0) / limit);
  const [families, setFamilies] = useState<Family[]>([]);
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
        `${process.env.REACT_APP_URL_DEV}/api/v1/family?page=${currentPage}&limit=${limit}`,
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
        `${process.env.REACT_APP_URL_DEV}/api/v1/family/search?YX_TYPE=${typeValue}&YX_CODE=${codeValue}&YX_LIBELLE=${labelValue}&page=${currentPage}&limit=${limit}`,
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
      setPrevSearchValue(typeValue);
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
            Ici vous trouverez la liste de toutes les classes enregistrées.
            Cliquez sur la classe que vous souhaitez modifier pour ouvrir le
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
        title="Paramétrer les classifications"
        createTitle="Créer une Classe"
        link="/parameters/classification/create"
      >
        <div className="flex items-center justify-center gap-4 p-7">
          <div className="flex items-center gap-4">
            <label className="w-[90px] text-sm font-bold">Niveau :</label>
            <select
              name="pets"
              id="level"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5"
              onChange={(e) => setTypeValue(e.target.value)}
            >
              <option value="">Choisir un niveau</option>
              <option value="LA1">Famille</option>
              <option value="LA2">Sous-famille</option>
              <option value="LA3">Sous-sous-famille</option>
            </select>
          </div>
          <div className="flex items-center gap-4">
            <label className="w-[60px] text-sm font-bold">Code :</label>
            <input
              type="text"
              id="code"
              className="block p-1.5 text-sm text-gray-900 border-2 border-gray-200 bg-gray-50 rounded-sm"
              placeholder="Rechercher par code"
              value={codeValue}
              onChange={(e) => setCodeValue(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-[60px] text-sm font-bold">Libellé :</label>
            <input
              type="text"
              id="label"
              className="block p-1.5 text-sm text-gray-900 border-2 border-gray-200 bg-gray-50 rounded-sm"
              placeholder="Rechercher par libellé"
              value={labelValue}
              onChange={(e) => setLabelValue(e.target.value)}
            />
          </div>
          <div
            className="cursor-pointer text-gray-500"
            onClick={() => setIsModalOpen(true)}
          >
            <Info size={22} />
          </div>
        </div>

        {families && families.length > 0 && (
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
          <div className="px-3 mb-2 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <h4 className="text-md">
                <span className="font-bold">{totalItem}</span> Resultats
              </h4>
            </div>
            <Button
              type="submit"
              size="small"
              to="/parameters/classification/create"
              green
            >
              Créer une Classe
            </Button>
          </div>
          <table className="w-full text-left">
            <thead className="bg-gray-200 text-sm text-gray-500">
              <tr>
                <th scope="col" className="px-6 py-4 w-1/3">
                  Niveau
                </th>
                <th scope="col" className="px-6 py-4 w-1/3">
                  Code
                </th>
                <th scope="col" className="px-6 py-4 w-1/3">
                  Libellé
                </th>
              </tr>
            </thead>
            <tbody>
              {families && families.length > 0 ? (
                families.map((family) => (
                  <tr
                    key={family._id}
                    className="bg-white cursor-pointer hover:bg-slate-200 capitalize text-xs text-gray-800 even:bg-slate-50 whitespace-nowrap border"
                    onClick={() =>
                      navigate(`/parameters/classification/${family._id}`)
                    }
                  >
                    <td className="px-6 py-4 flex items-center gap-2">
                      {typeLabels[family.YX_TYPE]}
                    </td>
                    <td className="px-6 py-4">{family.YX_CODE}</td>
                    <td className="px-6 py-4">{family.YX_LIBELLE}</td>
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

export default ClassificationsPage;
