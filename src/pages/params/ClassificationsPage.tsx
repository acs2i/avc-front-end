import React, { useState, useEffect, useMemo } from "react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Spinner from "../../components/Shared/Spinner";
import { SortProvider, useSortContext, SortHeader } from "../../components/SortContext";

type DataType = "LA1" | "LA2" | "LA3";

interface Tag {
  _id: string;
  code: string;
  name: string;
  level: string;
  tag_grouping_id: any[];
  status: string;
  additional_fields?: any;
  creator_id: string;
}

interface ClassificationsPageProps {
  onSelectFamily: (family: Tag) => void;
  shouldRefetch: boolean;
  highlightedFamilyId: string | null;
  resetHighlightedFamilyId: () => void;
}

const CLASSIFICATION_LIST_ID = 'classification-list';

const ClassificationsPageContent: React.FC<ClassificationsPageProps> = ({
  onSelectFamily,
  shouldRefetch,
  highlightedFamilyId,
  resetHighlightedFamilyId,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItem, setTotalItem] = useState<number | null>(null);
  const [families, setFamilies] = useState<Tag[]>([]);
  const { getSortState } = useSortContext();
  const sortState = getSortState(CLASSIFICATION_LIST_ID);

  const limit = 20;
  const totalPages = Math.ceil((totalItem ?? 0) / limit);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };

  const fetchFamily = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/tag?page=${currentPage}&limit=${limit}`,
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

  useEffect(() => {
    if (highlightedFamilyId) {
      const timer = setTimeout(resetHighlightedFamilyId, 3000);
      return () => clearTimeout(timer);
    }
  }, [highlightedFamilyId, resetHighlightedFamilyId]);

  useEffect(() => {
    fetchFamily();
  }, [shouldRefetch, currentPage]);

  const sortedFamilies = useMemo(() => {
    if (!sortState.column) return families;

    return [...families].sort((a, b) => {
      const aValue = a[sortState.column as keyof Tag];
      const bValue = b[sortState.column as keyof Tag];
      
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
  }, [families, sortState]);

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
              {/* <SortHeader listId={CLASSIFICATION_LIST_ID} column="level" label="Niveau" /> */}
            </th>
            <th scope="col" className="px-6 py-4 w-1/3">
              {/* <SortHeader listId={CLASSIFICATION_LIST_ID} column="code" label="Code" /> */}
            </th>
            <th scope="col" className="px-6 py-4 w-[300px]">
              {/* <SortHeader listId={CLASSIFICATION_LIST_ID} column="name" label="Libellé" /> */}
            </th>
            <th scope="col" className="px-6 py-4 w-[50px]">
              {/* <SortHeader listId={CLASSIFICATION_LIST_ID} column="status" label="Statut" /> */}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedFamilies.length > 0 ? (
            sortedFamilies.map((family) => (
              <tr
                key={family._id}
                className={`border-y-[1px] border-gray-200 cursor-pointer hover:bg-slate-200 capitalize text-[12px] text-gray-800 whitespace-nowrap ${
                  family._id === highlightedFamilyId
                    ? "bg-orange-300 text-white"
                    : ""
                }`}
                onClick={() => onSelectFamily(family)}
              >
                <td className={`px-6 py-2 flex items-center gap-2 ${
                  family._id === highlightedFamilyId ? "text-white" : ""
                }`}>
                  {family.level}
                </td>
                <td className="px-6 py-2">{family.code}</td>
                <td className="px-6 py-2">{family.name}</td>
                <td className="px-6 py-2 uppercase text-[10px]">
                  {family.status === "A" ? (
                    <div className="text-center bg-green-200 text-green-600 border border-green-400 py-1 rounded-md max-w-[50px]">
                      <span>Actif</span>
                    </div>
                  ) : (
                    <div className="text-center bg-gray-200 text-gray-600 border border-gray-400 py-1 rounded-md max-w-[60px]">
                      <span>Inactif</span>
                    </div>
                  )}
                </td>
                {family._id === highlightedFamilyId && (
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
        <h4 className="text-xs whitespace-nowrap">
          <span className="font-bold">{totalItem}</span> Classifications
        </h4>
        {families.length > 0 && (
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

const ClassificationsPage: React.FC<ClassificationsPageProps> = (props) => (
  <SortProvider>
    <ClassificationsPageContent {...props} />
  </SortProvider>
);

export default ClassificationsPage;