import React, { useEffect, useState, useMemo } from "react";
import { Collapse, Pagination, Stack } from "@mui/material";
import Spinner from "../../components/Shared/Spinner";
import { SortProvider, useSortContext, SortHeader } from "../../components/SortContext";

interface Grid {
  _id: string;
  label: string;
  code: string;
  type: string;
  dimensions: string[];
  status: string;
}

interface GridPageProps {
  onSelectGrid: (grid: Grid) => void;
  shouldRefetch: boolean;
  highlightedGridId: string | null;
  resetHighlightedGridId: () => void;
}

const GRID_LIST_ID = 'grid-list';

const GridPageContent: React.FC<GridPageProps> = ({
  onSelectGrid,
  shouldRefetch,
  highlightedGridId,
  resetHighlightedGridId,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [grids, setGrids] = useState<Grid[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 20;
  const [totalItem, setTotalItem] = useState<number | null>(null);
  const totalPages = Math.ceil((totalItem ?? 0) / limit);
  const [expandedGrid, setExpandedGrid] = useState<Grid | null>(null);
  const N = 10;

  const { getSortState } = useSortContext();
  const sortState = getSortState(GRID_LIST_ID);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };

  const fetchGrids = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/dimension-grid?page=${currentPage}&limit=${limit}`,
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
      const timer = setTimeout(resetHighlightedGridId, 3000);
      return () => clearTimeout(timer);
    }
  }, [highlightedGridId, resetHighlightedGridId]);

  useEffect(() => {
    fetchGrids();
  }, [shouldRefetch, currentPage]);

  const handleViewMore = (grid: Grid) => {
    setExpandedGrid(grid);
  };

  const extractNumbers = (str: string) => {
    return str.replace(/^\D+\s*/, "");
  };

  const sortedGrids = useMemo(() => {
    if (!sortState.column) return grids;
  
    return [...grids].sort((a, b) => {
      const aValue = a[sortState.column as keyof Grid];
      const bValue = b[sortState.column as keyof Grid];
      
      if (sortState.column === 'code') {
        // Assurez-vous que aValue et bValue sont des chaînes avant de les convertir en nombres
        const aNum = typeof aValue === 'string' ? parseInt(aValue, 10) : 0;
        const bNum = typeof bValue === 'string' ? parseInt(bValue, 10) : 0;
        return sortState.direction === 'asc' ? aNum - bNum : bNum - aNum;
      } else if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortState.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else if (Array.isArray(aValue) && Array.isArray(bValue)) {
        // Si les valeurs sont des tableaux, comparez leur première valeur (ou une chaîne vide si le tableau est vide)
        const aString = aValue[0] || '';
        const bString = bValue[0] || '';
        return sortState.direction === 'asc'
          ? aString.localeCompare(bString)
          : bString.localeCompare(aString);
      }
      
      // Si les types ne correspondent pas ou ne sont pas gérables, ne pas modifier l'ordre
      return 0;
    });
  }, [grids, sortState]);

  if (isLoading) {
    return (
      <div className="flex justify-center overflow-hidden p-[30px]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-left">
        <thead className="border-y-[1px] border-gray-200 text-sm font-[800] text-gray-700 uppercase">
          <tr>
            <th scope="col" className="px-6 py-4 w-[50px]">
              {/* <SortHeader listId={GRID_LIST_ID} column="type" label="Type" /> */}
            </th>
            <th scope="col" className="px-6 py-4 w-[50px]">
              {/* <SortHeader listId={GRID_LIST_ID} column="code" label="Code" /> */}
            </th>
            <th scope="col" className="px-6 py-4 w-[50px]">
              {/* <SortHeader listId={GRID_LIST_ID} column="label" label="Libellé" /> */}
            </th>
            <th scope="col" className="px-6 py-4w-[100px]">
              <span>Dimensions</span>
            </th>
            <th scope="col" className="px-6 py-4 w-[50px]">
              <span>Statut</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedGrids.length > 0
            ? sortedGrids.map((grid) => (
                <tr
                  key={grid._id}
                  className={`border-y-[1px] border-gray-200 cursor-pointer hover:bg-slate-200 capitalize text-[12px] text-gray-800 whitespace-nowrap ${
                    grid._id === highlightedGridId
                      ? "bg-orange-500 text-white"
                      : ""
                  }`}
                  onClick={() => onSelectGrid(grid)}
                >
                  <td className="px-6 py-2">{grid.type}</td>
                  <td className="px-6 py-2">{grid.code}</td>
                  <td className="px-6 py-2">{grid.label}</td>
                  <td className="px-6 py-2">
                    <div className="grid grid-cols-10 gap-1">
                      {grid.dimensions.slice(0, N).map((item, index) => (
                        <span key={index} className="text-[10px]">
                          {extractNumbers(item)}
                          {index < grid.dimensions.length - 1 && " ~ "}
                        </span>
                      ))}
                    </div>
                    {grid.dimensions.length > N && (
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
                              {grid.dimensions.slice(N).map((item, index) => (
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
                  <td className="px-6 py-2 uppercase text-[10px]">
                    {grid.status === "A" ? (
                      <div className="text-center bg-green-200 text-green-600 border border-green-400  py-1 rounded-md max-w-[50px]">
                        <span>Actif</span>
                      </div>
                    ) : (
                      <div className="text-center bg-gray-200 text-gray-600 border border-gray-400  py-1 rounded-md max-w-[60px]">
                        <span>Inactif</span>
                      </div>
                    )}
                  </td>
                  {grid._id === highlightedGridId && (
                    <td className="px-6 py-2">Nouveau</td>
                  )}
                </tr>
              ))
            : (
              <tr>
                <td colSpan={5} className="px-6 py-7 text-center">
                  Aucun Résultat
                </td>
              </tr>
            )}
        </tbody>
      </table>
      <div className="px-4 py-2 flex justify-between items-center">
        <h4 className="text-sm whitespace-nowrap">
          <span className="font-bold">{totalItem}</span> Grilles
        </h4>
        {grids.length > 0 && (
          <Stack spacing={2}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              size="small"
            />
          </Stack>
        )}
      </div>
    </div>
  );
};

const GridPage: React.FC<GridPageProps> = (props) => (
  <SortProvider>
    <GridPageContent {...props} />
  </SortProvider>
);

export default GridPage;