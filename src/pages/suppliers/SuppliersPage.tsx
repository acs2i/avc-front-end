import ScrollToTop from "../../components/ScrollToTop";
import React, { useState, useEffect } from "react";
import Card from "../../components/Shared/Card";
import Button from "../../components/FormElements/Button";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useNavigate } from "react-router-dom";
import Spinner from "../../components/Shared/Spinner";
import { Plus } from "lucide-react";

interface Suppliers {
  _id: string;
  T_TIERS: string;
  T_LIBELLE: string;
  T_JURIDIQUE: string;
}

export default function SuppliersPage() {
  const [prevSearchValue, setPrevSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItem, setTotalItem] = useState(null);
  const limit = 20;
  const totalPages = Math.ceil((totalItem ?? 0) / limit);
  const [suppliers, setSuppliers] = useState<Suppliers[]>([]);
  const navigate = useNavigate();

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };

  useEffect(() => {
    fetchSuppliers();
  }, [currentPage]);

  const fetchSuppliers = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/supplier?page=${currentPage}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      setSuppliers(data.data);
      setTotalItem(data.total);
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <Card
        title="Paramétrer les dimensions"
        createTitle="Créer un founisseur"
        link=""
      >
        <div className="flex items-center justify-center gap-4 p-7">
          <div className="flex items-center gap-4">
            <label className="w-[60px] text-sm font-bold">Libellé :</label>
            <input
              type="text"
              id="GDI_LIBELLE"
              className="block p-1.5 text-sm text-gray-900 border-2 border-gray-200 bg-gray-50 rounded-sm"
              placeholder="Rechercher par libellé"
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-[60px] text-sm font-bold">Code :</label>
            <input
              type="text"
              id="GDI_DIMORLI"
              className="block p-1.5 text-sm text-gray-900 border-2 border-gray-200 bg-gray-50 rounded-sm"
              placeholder="Rechercher par code"
            />
          </div>
        </div>
        {suppliers && suppliers.length > 0 && (
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
        <div className="relative overflow-x-auto bg-white">
          <div className="px-3 mb-2 flex items-center justify-between gap-2">
            <h4 className="text-md">
              <span className="font-bold">{totalItem}</span> Fournisseurs
            </h4>
            {prevSearchValue && (
              <span className="text-xl italic">{`"${prevSearchValue}"`}</span>
            )}
            <div>
              <Button size="small" blue>
                <Plus size={15}/>
                Créer un fournisseur
              </Button>
            </div>
          </div>
          <table className="w-full text-left mt-7">
            <thead className="border-t text-sm text-gray-500">
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
              {suppliers && suppliers.length > 0 ? (
                suppliers.map((supplier) => (
                  <tr
                    key={supplier._id}
                    className="bg-white cursor-pointer hover:bg-slate-200 capitalize text-xs text-gray-800 even:bg-slate-50 whitespace-nowrap border"
                    onClick={() =>
                      navigate(`/parameters/dimension/${supplier._id}`)
                    }
                  >
                    <td className="px-6 py-4">{supplier.T_TIERS}</td>
                    <td className="px-6 py-4">{supplier.T_LIBELLE}</td>
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
