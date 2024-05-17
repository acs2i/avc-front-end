import Card from "../../components/Shared/Card";
import React, { useEffect, useState } from "react";
import { Collapse, Pagination, Stack} from "@mui/material";
import Button from "../../components/FormElements/Button";
import Spinner from "@/src/components/Shared/Spinner";

interface Grid {
  _id: string;
  TYPE: string;
  LIBELLE: string;
  DIMENSIONS: string[];
}

export default function GridPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [grids, setGrids] = useState<Grid[]>([]);;
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 20;
  const [totalItem, setTotalItem] = useState(null);
  const totalPages = Math.ceil((totalItem ?? 0) / limit);
  const [prevSearchValue, setPrevSearchValue] = useState("");
  const [expandedGrid, setExpandedGrid] = useState<Grid | null>(null);
  const N = 3;

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
      <Card title="Toutes les grilles de dimensions" createTitle="Créer Une Grille de Dimension" link="/parameters/grid/create">
        <div className="p-7">
          <div className="relative flex flex-wrap items-center justify-center gap-5 text-gray-600">
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
        </div>
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
        <div className="relative overflow-x-auto bg-white">
          <div className="px-3 mb-2 flex items-center gap-2">
            <h4 className="text-md">
              <span className="font-bold">{totalItem}</span> Grilles
            </h4>
            {prevSearchValue && (
              <span className="text-xl italic">{`"${prevSearchValue}"`}</span>
            )}
          </div>
          <table className="w-full text-left">
            <thead className="bg-gray-200 text-sm text-gray-500">
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
                      className="bg-white cursor-pointer hover:bg-slate-200 capitalize text-xs text-gray-400 even:bg-slate-50 whitespace-nowrap font-bold border"
                    >
                      <td className="px-6 py-4">{grid.TYPE}</td>
                      <td className="px-6 py-4">{grid.LIBELLE}</td>
                      <td className="px-6 py-4">
                        <div className="grid grid-cols-3 gap-1">
                          {grid.DIMENSIONS.slice(0, N).map((item, index) => (
                            <span
                              key={index}
                              className="bg-gray-400 text-white p-2 text-center"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                        {grid.DIMENSIONS.length > N && (
                          <>
                            {expandedGrid != grid && <button
                              onClick={() => handleViewMore(grid)}
                              className="text-blue-600 text-xs"
                            >
                              Voir plus
                            </button>}
                            <Collapse in={expandedGrid === grid}>
                              <div className="mt-1">
                                <div className="grid grid-cols-3 gap-1">
                                  {grid.DIMENSIONS.slice(N).map(
                                    (item, index) => (
                                      <span
                                        key={index}
                                        className="bg-gray-400 text-white p-2 text-center"
                                      >
                                        {item}
                                      </span>
                                    )
                                  )}
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
      </Card>
    </div>
  );
}
