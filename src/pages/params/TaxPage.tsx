import React, { useState, useEffect, useMemo } from "react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Spinner from "../../components/Shared/Spinner";
import { SortProvider, useSortContext, SortHeader } from "../../components/SortContext";

interface Tax {
  _id: string;
  code: string;
  label: string;
  rate: string;
  status: string;
  creator_id: any;
}

interface TaxPageProps {
  onSelectTax: (tax: Tax) => void;
  shouldRefetch: boolean;
  highlightedUserFieldId: string | null;
  resetHighlightedUserFieldId: () => void;
}

const TAX_LIST_ID = 'tax-list';

const TaxPageContent: React.FC<TaxPageProps> = ({
  onSelectTax,
  shouldRefetch,
  highlightedUserFieldId,
  resetHighlightedUserFieldId,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItem, setTotalItem] = useState<number | null>(null);
  const [taxes, setTaxes] = useState<Tax[]>([]);
  const { getSortState } = useSortContext();
  const sortState = getSortState(TAX_LIST_ID);

  const limit = 20;
  const totalPages = Math.ceil((totalItem ?? 0) / limit);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };

  const fetchTaxes = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/tax`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      setTaxes(data.data);
      setTotalItem(data.total);
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (highlightedUserFieldId) {
      const timer = setTimeout(resetHighlightedUserFieldId, 3000);
      return () => clearTimeout(timer);
    }
  }, [highlightedUserFieldId, resetHighlightedUserFieldId]);

  useEffect(() => {
    fetchTaxes();
  }, [shouldRefetch]);

  const sortedTaxes = useMemo(() => {
    if (!sortState.column) return taxes;

    return [...taxes].sort((a, b) => {
      const aValue = a[sortState.column as keyof Tax];
      const bValue = b[sortState.column as keyof Tax];
      
      if (sortState.column === 'code') {
        // Tri numérique pour le code
        const aNum = parseInt(aValue, 10);
        const bNum = parseInt(bValue, 10);
        return sortState.direction === 'asc' ? aNum - bNum : bNum - aNum;
      } else if (sortState.column === 'rate') {
        return sortState.direction === 'asc'
          ? parseFloat(aValue) - parseFloat(bValue)
          : parseFloat(bValue) - parseFloat(aValue);
      } else if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortState.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return 0;
    });
  }, [taxes, sortState]);

  if (isLoading) {
    return (
      <div className="flex justify-center overflow-hidden p-[30px]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="border-y-[1px] border-gray-200 text-sm font-[800] text-gray-700 uppercase">
          <tr>
            <th scope="col" className="px-6 py-4 w-1/3">
              <SortHeader listId={TAX_LIST_ID} column="code" label="Code" />
            </th>
            <th scope="col" className="px-6 py-4 w-[300px]">
              <SortHeader listId={TAX_LIST_ID} column="label" label="Libellé" />
            </th>
            <th scope="col" className="px-6 py-4 w-[300px]">
              <SortHeader listId={TAX_LIST_ID} column="rate" label="Taux" />
            </th>
            <th scope="col" className="px-6 py-4 w-[50px]">
              <SortHeader listId={TAX_LIST_ID} column="status" label="Statut" />
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedTaxes.length > 0 ? (
            sortedTaxes.map((tax) => (
              <tr
                key={tax._id}
                className={`border-y-[1px] border-gray-200 cursor-pointer hover:bg-slate-200 capitalize text-[12px] text-gray-800 whitespace-nowrap ${
                  tax._id === highlightedUserFieldId
                    ? "bg-orange-300 text-white"
                    : ""
                }`}
                onClick={() => onSelectTax(tax)}
              >
                <td className="px-6 py-2">{tax.code}</td>
                <td className="px-6 py-2">{tax.label}</td>
                <td className="px-6 py-2">{tax.rate} %</td>
                <td className="px-6 py-2 uppercase text-[10px]">
                  {tax.status === "A" ? (
                    <div className="text-center bg-green-200 text-green-600 border border-green-400 py-1 rounded-md max-w-[50px]">
                      <span>Actif</span>
                    </div>
                  ) : (
                    <div className="text-center bg-gray-200 text-gray-600 border border-gray-400 py-1 rounded-md max-w-[60px]">
                      <span>Inactif</span>
                    </div>
                  )}
                </td>
                {tax._id === highlightedUserFieldId && (
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
          <span className="font-bold">{totalItem}</span> Taxes
        </h4>
        {taxes.length > 0 && (
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

const TaxPage: React.FC<TaxPageProps> = (props) => (
  <SortProvider>
    <TaxPageContent {...props} />
  </SortProvider>
);

export default TaxPage;