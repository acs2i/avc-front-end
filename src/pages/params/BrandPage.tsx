import React, { useState, useEffect, useMemo } from "react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Spinner from "../../components/Shared/Spinner";
import { SortProvider, useSortContext, SortHeader } from "../../components/SortContext";

interface Brand {
  _id: string;
  code: string;
  label: string;
  status: string;
  creator_id: any;
  additional_fields?: any;
}

interface BrandPageProps {
  onSelectBrand: (brand: Brand) => void;
  shouldRefetch: boolean;
  highlightedBrandId: string | null;
  resetHighlightedBrandId: () => void;
}

const BRAND_LIST_ID = 'brand-list';

const BrandPageContent: React.FC<BrandPageProps> = ({
  onSelectBrand,
  shouldRefetch,
  highlightedBrandId,
  resetHighlightedBrandId,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItem, setTotalItem] = useState<number | null>(null);
  const [brands, setBrands] = useState<Brand[]>([]);
  const { getSortState } = useSortContext();
  const sortState = getSortState(BRAND_LIST_ID);

  const limit = 20;
  const totalPages = Math.ceil((totalItem ?? 0) / limit);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };

  const fetchBrands = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/brand?page=${currentPage}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      setBrands(data.data);
      setTotalItem(data.total);
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (highlightedBrandId) {
      const timer = setTimeout(resetHighlightedBrandId, 3000);
      return () => clearTimeout(timer);
    }
  }, [highlightedBrandId, resetHighlightedBrandId]);

  useEffect(() => {
    fetchBrands();
  }, [shouldRefetch, currentPage]);

  const sortedBrands = useMemo(() => {
    if (!sortState.column) return brands;

    return [...brands].sort((a, b) => {
      const aValue = a[sortState.column as keyof Brand];
      const bValue = b[sortState.column as keyof Brand];
      
      if (sortState.column === 'code') {
        // Tri numérique pour le code si possible, sinon tri alphabétique
        const aNum = parseInt(aValue, 10);
        const bNum = parseInt(bValue, 10);
        if (!isNaN(aNum) && !isNaN(bNum)) {
          return sortState.direction === 'asc' ? aNum - bNum : bNum - aNum;
        }
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortState.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return 0;
    });
  }, [brands, sortState]);

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
              {/* <SortHeader listId={BRAND_LIST_ID} column="code" label="Code" /> */}
            </th>
            <th scope="col" className="px-6 py-4 w-[300px]">
              {/* <SortHeader listId={BRAND_LIST_ID} column="label" label="Libellé" /> */}
            </th>
            <th scope="col" className="px-6 py-4 w-[50px]">
              {/* <SortHeader listId={BRAND_LIST_ID} column="status" label="Statut" /> */}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedBrands.length > 0 ? (
            sortedBrands.map((brand) => (
              <tr
                key={brand._id}
                className={`border-y-[1px] border-gray-200 cursor-pointer hover:bg-slate-200 capitalize text-[12px] text-gray-800 whitespace-nowrap ${
                  brand._id === highlightedBrandId
                    ? "bg-orange-300 text-white"
                    : ""
                }`}
                onClick={() => onSelectBrand(brand)}
              >
                <td className="px-6 py-2">{brand.code}</td>
                <td className="px-6 py-2">{brand.label}</td>
                <td className="px-6 py-2 uppercase text-[10px]">
                  {brand.status === "A" ? (
                    <div className="text-center bg-green-200 text-green-600 border border-green-400 py-1 rounded-md max-w-[50px]">
                      <span>Actif</span>
                    </div>
                  ) : (
                    <div className="text-center bg-gray-200 text-gray-600 border border-gray-400 py-1 rounded-md max-w-[60px]">
                      <span>Inactif</span>
                    </div>
                  )}
                </td>
                {brand._id === highlightedBrandId && (
                  <td className="px-6 py-2">Nouveau</td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="px-6 py-7 text-center">
                Aucun Résultat
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="px-4 py-2 flex justify-between items-center">
        <h4 className="text-sm whitespace-nowrap">
          <span className="font-bold">{totalItem}</span> Marques
        </h4>
        {brands.length > 0 && (
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

const BrandPage: React.FC<BrandPageProps> = (props) => (
  <SortProvider>
    <BrandPageContent {...props} />
  </SortProvider>
);

export default BrandPage;