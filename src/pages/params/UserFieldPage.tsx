import React, { useState, useEffect, useMemo } from "react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Spinner from "../../components/Shared/Spinner";
import { SortProvider, useSortContext, SortHeader } from "../../components/SortContext";

interface CustomField {
  field_name: string;
  field_type: string;
  options?: string[];
  value?: string;
}

interface Field {
  _id: string;
  code: string;
  label: string;
  status: string;
  apply_to: string;
  creator_id: any;
  additional_fields: CustomField[];
}

interface UserFieldPageProps {
  onSelectUserField: (userField: Field) => void;
  shouldRefetch: boolean;
  highlightedUserFieldId: string | null;
  resetHighlightedUserFieldId: () => void;
}

const USER_FIELD_LIST_ID = 'user-field-list';

const UserFieldPageContent: React.FC<UserFieldPageProps> = ({
  onSelectUserField,
  shouldRefetch,
  highlightedUserFieldId,
  resetHighlightedUserFieldId,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItem, setTotalItem] = useState<number | null>(null);
  const [userFields, setUserFields] = useState<Field[]>([]);
  const { getSortState } = useSortContext();
  const sortState = getSortState(USER_FIELD_LIST_ID);

  const limit = 20;
  const totalPages = Math.ceil((totalItem ?? 0) / limit);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };

  const fetchField = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/user-field`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      setUserFields(data.data);
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
    fetchField();
  }, [shouldRefetch]);

  const sortedUserFields = useMemo(() => {
    if (!sortState.column) return userFields;

    return [...userFields].sort((a, b) => {
      const aValue = a[sortState.column as keyof Field];
      const bValue = b[sortState.column as keyof Field];
      
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
  }, [userFields, sortState]);

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
              {/* <SortHeader listId={USER_FIELD_LIST_ID} column="code" label="Code" /> */}
            </th>
            <th scope="col" className="px-6 py-4 w-[300px]">
              {/* <SortHeader listId={USER_FIELD_LIST_ID} column="label" label="Libellé" /> */}
            </th>
            <th scope="col" className="px-6 py-4 w-[300px]">
              {/* <SortHeader listId={USER_FIELD_LIST_ID} column="apply_to" label="Associé à" /> */}
            </th>
            <th scope="col" className="px-6 py-4 w-[50px]">
              {/* <SortHeader listId={USER_FIELD_LIST_ID} column="status" label="Statut" /> */}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedUserFields.length > 0 ? (
            sortedUserFields.map((userField) => (
              <tr
                key={userField._id}
                className={`border-y-[1px] border-gray-200 cursor-pointer hover:bg-slate-200 capitalize text-[12px] text-gray-800 whitespace-nowrap ${
                  userField._id === highlightedUserFieldId
                    ? "bg-orange-300 text-white"
                    : ""
                }`}
                onClick={() => onSelectUserField(userField)}
              >
                <td className="px-6 py-2">{userField.code}</td>
                <td className="px-6 py-2">{userField.label}</td>
                <td className="px-6 py-2">{userField.apply_to}</td>
                <td className="px-6 py-2 uppercase text-[10px]">
                  {userField.status === "A" ? (
                    <div className="text-center bg-green-200 text-green-600 border border-green-400 py-1 rounded-md max-w-[50px]">
                      <span>Actif</span>
                    </div>
                  ) : (
                    <div className="text-center bg-gray-200 text-gray-600 border border-gray-400 py-1 rounded-md max-w-[60px]">
                      <span>Inactif</span>
                    </div>
                  )}
                </td>
                {userField._id === highlightedUserFieldId && (
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
          <span className="font-bold">{totalItem}</span> Champs utilisateur
        </h4>
        {userFields.length > 0 && (
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

const UserFieldPage: React.FC<UserFieldPageProps> = (props) => (
  <SortProvider>
    <UserFieldPageContent {...props} />
  </SortProvider>
);

export default UserFieldPage;