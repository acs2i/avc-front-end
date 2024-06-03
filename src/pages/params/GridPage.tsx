import Card from "../../components/Shared/Card";
import React, { useEffect, useState } from "react";
import { Collapse, Pagination, Stack } from "@mui/material";
import Button from "../../components/FormElements/Button";
import Spinner from "@/src/components/Shared/Spinner";
import { Plus } from "lucide-react";
import Header from "../../components/Navigation/Header";

interface Grid {
  _id: string;
  TYPE: string;
  LIBELLE: string;
  DIMENSIONS: string[];
}

export default function GridPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [grids, setGrids] = useState<Grid[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 20;
  const [totalItem, setTotalItem] = useState(null);
  const totalPages = Math.ceil((totalItem ?? 0) / limit);
  const [prevSearchValue, setPrevSearchValue] = useState("");
  const [expandedGrid, setExpandedGrid] = useState<Grid | null>(null);
  const N = 5;

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };

  useEffect(() => {
    fetchGrids();
  }, [currentPage]);

  const fetchGrids = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/grid?page=${currentPage}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      setGrids(data.data);
      setTotalItem(data.total);
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewMore = (grid: Grid) => {
    setExpandedGrid(grid);
  };

  return (
    <div>
      <Header
        title="Liste des grilles de dimensions"
        link="/parameters/grid/create"
        btnTitle="Créer une grille"
        placeholder="Rechercher une grille"
      >
        <div className="flex items-center gap-4 py-4">
          <div className="flex items-center gap-4">
            <label className="w-[60px] text-sm font-bold">type :</label>
            <input
              type="text"
              id="TYPE"
              className="block p-1.5 text-sm text-gray-900 border-2 border-gray-200 bg-gray-50 rounded-sm"
              placeholder="Rechercher un code"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="w-[100px] text-sm font-bold">Libellé :</label>
            <input
              type="text"
              id="LIBELLE"
              className="block p-1.5 text-sm text-gray-900 border-2 border-gray-200 bg-gray-50 rounded-sm"
              placeholder="Rechercher un code"
            />
          </div>
        </div>
      </Header>

      <div className="relative overflow-x-auto bg-white">
        <div className="px-3 py-7 flex flex-col gap-2">
          <div className="w-full flex justify-between items-center">
            <div className="flex items-center">
              <h4 className="text-md whitespace-nowrap">
                <span className="font-bold">{totalItem}</span> Produits
              </h4>
              {prevSearchValue && (
                <span className="text-xl italic ml-2">{`"${prevSearchValue}"`}</span>
              )}
            </div>
            <div className="flex justify-center w-full">
              {grids && grids.length > 0 && (
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
            </div>
          </div>
        </div>
        <table className="w-full text-left mt-7">
          <thead className="border-t text-sm text-gray-500">
            <tr>
              <th scope="col" className="px-6 py-4 w-1/3">
                Type
              </th>
              <th scope="col" className="px-6 py-4 w-1/3">
                Libellé
              </th>
              <th scope="col" className="px-6 py-4 w-1/3">
                Dimensions
              </th>
            </tr>
          </thead>
          <tbody>
            {grids && grids.length > 0
              ? grids.map((grid) => (
                  <tr
                    key={grid._id}
                    className="bg-white cursor-pointer hover:bg-slate-200 capitalize text-xs text-gray-800 even:bg-slate-50 whitespace-nowrap border"
                  >
                    <td className="px-6 py-4">{grid.TYPE}</td>
                    <td className="px-6 py-4">{grid.LIBELLE}</td>
                    <td className="px-6 py-4">
                      <div className="grid grid-cols-5 gap-1">
                        {grid.DIMENSIONS.slice(0, N).map((item, index) => (
                          <span
                            key={index}
                            className="bg-orange-100 text-orange-500 border border-orange-500 p-1 text-center text-[10px] rounded-[5px]"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                      {grid.DIMENSIONS.length > N && (
                        <>
                          {expandedGrid != grid && (
                            <button
                              onClick={() => handleViewMore(grid)}
                              className="text-blue-600 text-xs"
                            >
                              Voir plus
                            </button>
                          )}
                          <Collapse in={expandedGrid === grid}>
                            <div className="mt-1">
                              <div className="grid grid-cols-5 gap-1">
                                {grid.DIMENSIONS.slice(N).map((item, index) => (
                                  <span
                                    key={index}
                                    className="bg-orange-100 text-orange-500 border border-orange-500 p-1 text-center text-[10px] rounded-[5px]"
                                  >
                                    {item}
                                  </span>
                                ))}
                              </div>
                              <button
                                onClick={() => setExpandedGrid(null)}
                                className="text-blue-600 text-xs"
                              >
                                Voir moins
                              </button>
                            </div>
                          </Collapse>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              : ""}
          </tbody>
        </table>
      </div>
    </div>
  );
}
