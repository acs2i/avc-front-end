import React, { useState, useEffect, useMemo } from "react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Spinner from "../../components/Shared/Spinner";
import { SortProvider, useSortContext, SortHeader } from "../../components/SortContext";

type DataType = "DI1" | "DI2";

interface Dimension {
  _id: string;
  code: string;
  label: string;
  type: string;
  status: string;
  creator_id: any;
  additional_fields?: any;
}

interface DimensionPageProps {
  onSelectDimension: (dimension: Dimension) => void;
  shouldRefetch: boolean;
  highlightedDimensionId: string | null;
  resetHighlightedDimensionId: () => void;
}

const DIMENSION_LIST_ID = 'dimension-list';

const DimensionPageContent: React.FC<DimensionPageProps> = ({
  onSelectDimension,
  shouldRefetch,
  highlightedDimensionId,
  resetHighlightedDimensionId,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItem, setTotalItem] = useState<number | null>(null);
  const [dimensions, setDimensions] = useState<Dimension[]>([]);
  const { getSortState } = useSortContext();
  const sortState = getSortState(DIMENSION_LIST_ID);

  const limit = 20;
  const totalPages = Math.ceil((totalItem ?? 0) / limit);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };

  const fetchDimensions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/dimension?page=${currentPage}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      setDimensions(data.data);
      setTotalItem(data.total);
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (highlightedDimensionId) {
      const timer = setTimeout(resetHighlightedDimensionId, 3000);
      return () => clearTimeout(timer);
    }
  }, [highlightedDimensionId, resetHighlightedDimensionId]);

  useEffect(() => {
    fetchDimensions();
  }, [shouldRefetch, currentPage]);

  const sortedDimensions = useMemo(() => {
    if (!sortState.column) return dimensions;

    return [...dimensions].sort((a, b) => {
      const aValue = a[sortState.column as keyof Dimension];
      const bValue = b[sortState.column as keyof Dimension];
      
      if (sortState.column === 'code') {
        // Tri numérique pour le code
        const aNum = parseInt(aValue, 10);
        const bNum = parseInt(bValue, 10);
        return sortState.direction === 'asc' ? aNum - bNum : bNum - aNum;
      } else if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortState.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return 0;
    });
  }, [dimensions, sortState]);

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
            <th scope="col" className="px-6 py-4 w-1/3">
              {/* <SortHeader listId={DIMENSION_LIST_ID} column="type" label="Type" /> */}
            </th>
            <th scope="col" className="px-6 py-4 w-1/3">
              {/* <SortHeader listId={DIMENSION_LIST_ID} column="code" label="Code" /> */}
            </th>
            <th scope="col" className="px-6 py-4 w-[300px]">
              {/* <SortHeader listId={DIMENSION_LIST_ID} column="label" label="Libellé" /> */}
            </th>
            <th scope="col" className="px-6 py-4 w-[50px]">
              {/* <SortHeader listId={DIMENSION_LIST_ID} column="status" label="Statut" /> */}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedDimensions.length > 0 ? (
            sortedDimensions.map((dimension) => (
              <tr
                key={dimension._id}
                className={`border-y-[1px] border-gray-200 cursor-pointer hover:bg-slate-200 capitalize text-[12px] text-gray-800 whitespace-nowrap ${
                  dimension._id === highlightedDimensionId
                    ? "bg-orange-300 text-white"
                    : ""
                }`}
                onClick={() => onSelectDimension(dimension)}
              >
                <td className={`px-6 py-2 ${
                  dimension._id === highlightedDimensionId ? "text-white" : ""
                }`}>
                  {dimension.type}
                </td>
                <td className="px-6 py-2">{dimension.code}</td>
                <td className="px-6 py-2">{dimension.label}</td>
                <td className="px-6 py-2 uppercase text-[10px]">
                  {dimension.status === "A" ? (
                    <div className="text-center bg-green-200 text-green-600 border border-green-400 py-1 rounded-md max-w-[50px]">
                      <span>Actif</span>
                    </div>
                  ) : (
                    <div className="text-center bg-gray-200 text-gray-600 border border-gray-400 py-1 rounded-md max-w-[60px]">
                      <span>Inactif</span>
                    </div>
                  )}
                </td>
                {dimension._id === highlightedDimensionId && (
                  <td className="px-6 py-2">Nouveau</td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="px-6 py-7 text-center">
                Aucun Résultat
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="px-4 py-2 flex justify-between items-center">
        <h4 className="text-sm whitespace-nowrap">
          <span className="font-bold">{totalItem}</span> Dimensions
        </h4>
        {dimensions.length > 0 && (
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

const DimensionPage: React.FC<DimensionPageProps> = (props) => (
  <SortProvider>
    <DimensionPageContent {...props} />
  </SortProvider>
);

export default DimensionPage;