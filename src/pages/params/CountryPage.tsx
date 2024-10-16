import React, { useState, useEffect, useMemo } from "react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Spinner from "../../components/Shared/Spinner";
import { SortProvider, useSortContext, SortHeader } from "../../components/SortContext";

interface Country {
  _id: string;
  countryName: string;
  alpha2Code: string;
  alpha3Code: string;
  numeric: string;
  status: string;
  creator_id: any;
}

interface CountryPageProps {
  onSelectCountry: (country: Country) => void;
  shouldRefetch: boolean;
  highlightedUserFieldId: string | null;
  resetHighlightedUserFieldId: () => void;
}

const COUNTRY_LIST_ID = 'country-list'; // Identifiant unique pour la liste des pays

const CountryPageContent: React.FC<CountryPageProps> = ({
  onSelectCountry,
  shouldRefetch,
  highlightedUserFieldId,
  resetHighlightedUserFieldId,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItem, setTotalItem] = useState<number | null>(null);
  const [countries, setCountries] = useState<Country[]>([]);
  const { getSortState } = useSortContext();
  const sortState = getSortState(COUNTRY_LIST_ID);

  const limit = 20;
  const totalPages = Math.ceil((totalItem ?? 0) / limit);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };

  const fetchCountries = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/iso-code?page=${currentPage}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      setCountries(data.data);
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
    fetchCountries();
  }, [shouldRefetch, currentPage]);

  const sortedCountries = useMemo(() => {
    if (!sortState.column) return countries;

    return [...countries].sort((a, b) => {
      const aValue = a[sortState.column as keyof Country];
      const bValue = b[sortState.column as keyof Country];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortState.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return 0;
    });
  }, [countries, sortState]);

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
              <SortHeader listId={COUNTRY_LIST_ID} column="countryName" label="Libellé" />
            </th>
            <th scope="col" className="px-6 py-4 w-[300px]">
              <SortHeader listId={COUNTRY_LIST_ID} column="alpha2Code" label="Iso-2" />
            </th>
            <th scope="col" className="px-6 py-4 w-[300px]">
              <SortHeader listId={COUNTRY_LIST_ID} column="alpha3Code" label="Iso-3" />
            </th>
            <th scope="col" className="px-6 py-4 w-[50px]">
              <SortHeader listId={COUNTRY_LIST_ID} column="numeric" label="Iso-N" />
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedCountries.length > 0 ? (
            sortedCountries.map((country) => (
              <tr
                key={country._id}
                className={`border-y-[1px] border-gray-200 cursor-pointer hover:bg-slate-200 capitalize text-[12px] text-gray-800 whitespace-nowrap ${
                  country._id === highlightedUserFieldId
                    ? "bg-orange-300 text-white"
                    : ""
                }`}
                onClick={() => onSelectCountry(country)}
              >
                <td className="px-6 py-2">{country.countryName}</td>
                <td className="px-6 py-2">{country.alpha2Code}</td>
                <td className="px-6 py-2">{country.alpha3Code}</td>
                <td className="px-6 py-2">{country.numeric}</td>
                {country._id === highlightedUserFieldId && (
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
      <div className="px-4 py-2 flex flex-col gap-2">
        <div className="w-full flex justify-between items-center">
          <h4 className="text-sm whitespace-nowrap">
            <span className="font-bold">{totalItem}</span> Pays
          </h4>
          {countries.length > 0 && (
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
    </div>
  );
};

const CountryPage: React.FC<CountryPageProps> = (props) => (
  <SortProvider>
    <CountryPageContent {...props} />
  </SortProvider>
);

export default CountryPage;