import React, { useState, useEffect, useMemo } from "react";
import { Pagination, Stack } from "@mui/material";
import Spinner from "../../components/Shared/Spinner";
import { SortProvider, useSortContext, SortHeader } from "../../components/SortContext";

interface Block {
  _id: string;
  code: number;
  label: string;
  status: string;
  creator_id: any;
}

interface BlockPageProps {
  onSelectBlock: (block: Block) => void;
  shouldRefetch: boolean;
  highlightedUserFieldId: string | null;
  resetHighlightedUserFieldId: () => void;
}

const BLOCK_LIST_ID = 'block-list'; // Identifiant unique pour la liste des blocages

const BlockPageContent: React.FC<BlockPageProps> = ({
  onSelectBlock,
  shouldRefetch,
  highlightedUserFieldId,
  resetHighlightedUserFieldId,
}) => {
  const [allBlocks, setAllBlocks] = useState<Block[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { getSortState } = useSortContext();
  const sortState = getSortState(BLOCK_LIST_ID);

  const limit = 20;

  const fetchBlocks = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/block`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await response.json();
      setAllBlocks(data.data);
    } catch (error) {
      console.error("Error fetching blocks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlocks();
  }, [shouldRefetch]);

  useEffect(() => {
    if (highlightedUserFieldId) {
      const timer = setTimeout(resetHighlightedUserFieldId, 3000);
      return () => clearTimeout(timer);
    }
  }, [highlightedUserFieldId, resetHighlightedUserFieldId]);

  const sortedBlocks = useMemo(() => {
    if (!sortState.column) return allBlocks;

    return [...allBlocks].sort((a, b) => {
      if (sortState.column === 'code') {
        return sortState.direction === 'asc' ? a.code - b.code : b.code - a.code;
      } else if (sortState.column === 'label' || sortState.column === 'status') {
        const aValue = a[sortState.column].toLowerCase();
        const bValue = b[sortState.column].toLowerCase();
        return sortState.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      return 0;
    });
  }, [allBlocks, sortState]);

  const paginatedBlocks = useMemo(() => {
    const startIndex = (currentPage - 1) * limit;
    const endIndex = startIndex + limit;
    return sortedBlocks.slice(startIndex, endIndex);
  }, [sortedBlocks, currentPage]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

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
              {/* <SortHeader listId={BLOCK_LIST_ID} column="code" label="Code" /> */}
            </th>
            <th scope="col" className="px-6 py-4 w-[300px]">
              {/* <SortHeader listId={BLOCK_LIST_ID} column="label" label="Libellé" /> */}
            </th>
            <th scope="col" className="px-6 py-4 w-[50px]">
              {/* <SortHeader listId={BLOCK_LIST_ID} column="status" label="Statut" /> */}
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedBlocks.length > 0 ? (
            paginatedBlocks.map((block) => (
              <tr
                key={block._id}
                className={`border-y-[1px] border-gray-200 cursor-pointer hover:bg-slate-200 capitalize text-[12px] text-gray-800 whitespace-nowrap ${
                  block._id === highlightedUserFieldId ? "bg-orange-300 text-white" : ""
                }`}
                onClick={() => onSelectBlock(block)}
              >
                <td className="px-6 py-2"> {block.code < 10 ? `0${block.code}` : block.code}</td>
                <td className="px-6 py-2">{block.label}</td>
                <td className="px-6 py-2 uppercase text-[10px]">
                  {block.status === "A" ? (
                    <div className="text-center bg-green-200 text-green-600 border border-green-400 py-1 rounded-md max-w-[50px]">
                      <span>Actif</span>
                    </div>
                  ) : (
                    <div className="text-center bg-gray-200 text-gray-600 border border-gray-400 py-1 rounded-md max-w-[60px]">
                      <span>Inactif</span>
                    </div>
                  )}
                </td>
                {block._id === highlightedUserFieldId && (
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
          <span className="font-bold">{allBlocks.length}</span> Blocages
        </h4>
        {allBlocks.length > 0 && (
          <Stack spacing={2}>
            <Pagination
              count={Math.ceil(allBlocks.length / limit)}
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

const BlockPage: React.FC<BlockPageProps> = (props) => (
  <SortProvider>
    <BlockPageContent {...props} />
  </SortProvider>
);

export default BlockPage;