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

interface GridPageProps {
  onSelectGrid: (grid: Grid) => void;
  shouldRefetch: boolean;
  highlightedGridId: string | null;
  resetHighlightedGridId: () => void;
}


export default function GridPage({ onSelectGrid, shouldRefetch, highlightedGridId, resetHighlightedGridId  }: GridPageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [grids, setGrids] = useState<Grid[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 20;
  const [totalItem, setTotalItem] = useState(null);
  const totalPages = Math.ceil((totalItem ?? 0) / limit);
  const [prevSearchValue, setPrevSearchValue] = useState("");
  const [expandedGrid, setExpandedGrid] = useState<Grid | null>(null);
  const N = 10;

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

  useEffect(() => {
    if (highlightedGridId) {
      const timer = setTimeout(() => {
        resetHighlightedGridId();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [highlightedGridId, resetHighlightedGridId]);

  useEffect(() => {
    fetchGrids();
  }, [shouldRefetch]);

  const handleViewMore = (grid: Grid) => {
    setExpandedGrid(grid);
  };

  const extractNumbers = (str: string) => {
    return str.replace(/^\D+\s*/, '');
  };

  return (
       <div className="relative overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-y-[1px] border-gray-200 text-sm font-[800] text-gray-700">
            <tr>
              <th scope="col" className="px-6 py-2 w-1/3">
                Type
              </th>
              <th scope="col" className="px-6 py-2 w-1/3">
                Libellé
              </th>
              <th scope="col" className="px-6 py-2 w-1/3">
                Dimensions
              </th>
            </tr>
          </thead>
          <tbody>
            {grids && grids.length > 0
              ? grids.map((grid) => (
                  <tr
                    key={grid._id}
                    className={`border-y-[1px] border-gray-200 cursor-pointer hover:bg-slate-200 capitalize text-[12px] text-gray-800 whitespace-nowrap ${
                      grid._id === highlightedGridId
                        ? "bg-orange-500 text-white"
                        : ""
                    }`}
                    onClick={() => onSelectGrid(grid)}
                  >
                    <td className="px-6 py-2">{grid.TYPE}</td>
                    <td className="px-6 py-2">{grid.LIBELLE}</td>
                    <td className="px-6 py-2">
                      <div className="grid grid-cols-10 gap-1">
                        {grid.DIMENSIONS.slice(0, N).map((item, index) => (
                          <span
                            key={index}
                            className="text-[10px]"
                          >
                            {extractNumbers(item)}
                            {index < grid.DIMENSIONS.length - 1 && ' ~ '}
                          </span>
                        ))}
                      </div>
                      {grid.DIMENSIONS.length > N && (
                        <>
                          {expandedGrid != grid && (
                            <button
                              onClick={() => handleViewMore(grid)}
                              className="text-blue-600 text-[8px]"
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
                                    className="text-[10px] rounded-[5px]"
                                  >
                                     {extractNumbers(item)}
                                  </span>
                                ))}
                              </div>
                              <button
                                onClick={() => setExpandedGrid(null)}
                                className="text-blue-600 text-[8px]"
                              >
                                Voir moins
                              </button>
                            </div>
                          </Collapse>
                        </>
                      )}
                    </td>
                    {grid._id === highlightedGridId && <td className="px-6 py-2">Nouveau</td>}
                  </tr>
                ))
              : ""}
          </tbody>
        </table>
        <div className="px-4 py-2 flex flex-col gap-2">
          <div className="w-full flex justify-between items-center">
            <div className="flex items-center">
              <h4 className="text-sm whitespace-nowrap">
                <span className="font-bold">{totalItem}</span> Dimensions
              </h4>
              {prevSearchValue && (
                <span className="text-sm italic ml-2">{`"${prevSearchValue}"`}</span>
              )}
            </div>
            <div className="flex justify-end w-full">
              {grids && grids.length > 0 && (
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
