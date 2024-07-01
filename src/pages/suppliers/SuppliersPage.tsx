import ScrollToTop from "../../components/ScrollToTop";
import React, { useState, useEffect } from "react";
import Card from "../../components/Shared/Card";
import Button from "../../components/FormElements/Button";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useNavigate } from "react-router-dom";
import Spinner from "../../components/Shared/Spinner";
import { Plus } from "lucide-react";
import Header from "../../components/Navigation/Header";

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
    <section>
      <Header
        title="Liste des fournisseurs"
        link="/parameters/dimension/create/item"
        btnTitle="Créer un fournisseur"
        placeholder="Rechercher un fournisseur"
        height="250px"
      >
        <div className="flex items-center gap-4 py-4">
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
      </Header>
      <div className="relative overflow-x-auto bg-white">
        
        <table className="w-full text-left">
          <thead className="border-y-[1px] border-gray-200 text-sm text-gray-500">
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
            {suppliers && suppliers.length > 0 ? (
              suppliers.map((supplier) => (
                <tr
                  key={supplier._id}
                  className="border-y-[1px] border-gray-200 bg-white cursor-pointer hover:bg-slate-200 capitalize text-[12px] text-gray-800 whitespace-nowrap"
                  onClick={() =>
                    navigate(`/parameters/dimension/${supplier._id}`)
                  }
                >
                  <td className="px-6 py-2">{supplier.T_TIERS}</td>
                  <td className="px-6 py-2">{supplier.T_LIBELLE}</td>
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
                <span className="font-bold">{totalItem}</span> Fournisseurs
              </h4>
              {prevSearchValue && (
                <span className="text-sm italic ml-2">{`"${prevSearchValue}"`}</span>
              )}
            </div>
            <div className="flex justify-end w-full">
              {suppliers && suppliers.length > 0 && (
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
    </section>
  );
}
