import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { LINKS_Params } from "../../utils/index";
import { Settings2 } from "lucide-react";
import Header from "../../components/Navigation/Header";
import Button from "../../components/FormElements/Button";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Spinner from "../../components/Shared/Spinner";
import {
  SortProvider,
  useSortContext,
  SortHeader,
} from "../../components/SortContext";
import debounce from "lodash/debounce";

const LAST_PAGE_KEY = "lastSelectedParamsPage";

const PAGE_TYPES = {
  CLASSIFICATIONS: "classe",
  DIMENSIONS: "dimension",
  GRIDS: "grid",
  COLLECTIONS: "collection",
  BRANDS: "brand",
  USER_FIELDS: "field",
  TAXES: "tax",
  BLOCKS: "block",
  COUNTRIES: "country",
} as const;

type PageTypeValue = (typeof PAGE_TYPES)[keyof typeof PAGE_TYPES];

interface LinkParam {
  name: string;
  link: string;
  icon: React.ComponentType<{ size?: number }>;
  page: string;
}

interface SearchFields {
  code?: string;
  label?: string;
  status?: string;
  level?: string;
  countryName?: string;
  alpha2Code?: string;
  alpha3Code?: string;
  numeric?: string;
}

function ParamsMenuPageContent() {
  const location = useLocation();
  const [page, setPage] = useState<PageTypeValue>(PAGE_TYPES.CLASSIFICATIONS);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams, setSearchParams] = useState<any>(null);
  const [totalItem, setTotalItem] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [items, setItems] = useState<any[]>([]);
  const { getSortState, setSortState } = useSortContext();
  const sortState = useMemo(() => getSortState(page), [getSortState, page]);

  const [searchFields, setSearchFields] = useState<SearchFields>({
    code: "",
    label: "",
    status: "all",
    level: "",
    countryName: "",
    alpha2Code: "",
    alpha3Code: "",
    numeric: "",
  });

  const limit = 20;
  const totalPages = Math.ceil((totalItem ?? 0) / limit);

  const getApiEndpoint = useCallback(() => {
    switch (page) {
      case PAGE_TYPES.CLASSIFICATIONS:
        return "tag";
      case PAGE_TYPES.DIMENSIONS:
        return "dimension";
      case PAGE_TYPES.GRIDS:
        return "dimension-grid";
      case PAGE_TYPES.COLLECTIONS:
        return "collection";
      case PAGE_TYPES.BRANDS:
        return "brand";
      case PAGE_TYPES.USER_FIELDS:
        return "user-field";
      case PAGE_TYPES.TAXES:
        return "tax";
      case PAGE_TYPES.BLOCKS:
        return "block";
      case PAGE_TYPES.COUNTRIES:
        return "iso-code";
      default:
        return "";
    }
  }, [page]);

  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    try {
      const endpoint = getApiEndpoint();
      const url = `${process.env.REACT_APP_URL_DEV}/api/v1/${endpoint}?page=${currentPage}&limit=${limit}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setItems(result.data || []);
      setTotalItem(result.total);
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    } finally {
      setIsLoading(false);
    }
  }, [getApiEndpoint, currentPage, limit]);

  const searchItems = useCallback(
    async (params: any) => {
      setIsLoading(true);
      try {
        const endpoint = getApiEndpoint();
        const queryParams = new URLSearchParams(params);
        const url = `${
          process.env.REACT_APP_URL_DEV
        }/api/v1/${endpoint}/search?page=${currentPage}&limit=${limit}&${queryParams.toString()}`;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const result = await response.json();
        setItems(result.data || []);
        setTotalItem(result.total);
      } catch (error) {
        console.error("Erreur lors de la requête", error);
      } finally {
        setIsLoading(false);
      }
    },
    [getApiEndpoint, currentPage, limit]
  );

  useEffect(() => {
    const savedPage = localStorage.getItem(LAST_PAGE_KEY);
    if (
      savedPage &&
      Object.values(PAGE_TYPES).includes(savedPage as PageTypeValue)
    ) {
      setPage(savedPage as PageTypeValue);
    }
  }, []);

  useEffect(() => {
    if (searchParams) {
      searchItems(searchParams);
    } else {
      fetchItems();
    }
  }, [searchParams, fetchItems, searchItems]);

  const handleSearch = useCallback(
    debounce(() => {
      const params = Object.entries(searchFields).reduce(
        (acc, [key, value]) => {
          if (value && value !== "all") {
            acc[key] = value;
          }
          return acc;
        },
        {} as any
      );

      if (Object.keys(params).length === 0) {
        setSearchParams(null);
        setCurrentPage(1);
      } else {
        setSearchParams(params);
        setCurrentPage(1);
      }
    }, 300),
    [searchFields]
  );

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };

  const handlePageTypeChange = useCallback((newPage: PageTypeValue) => {
    setPage(newPage);
    localStorage.setItem(LAST_PAGE_KEY, newPage);
    setSearchFields({
      code: "",
      label: "",
      alpha2Code: "",
      alpha3Code: "",
      numeric: "",
      countryName: "",
      status: "all",
      level: "",
    });
    setSearchParams(null);
    setCurrentPage(1);
  }, []);

  const handleSortChange = useCallback(
    (column: string) => {
      setSortState(page, {
        column,
        direction:
          sortState.column === column && sortState.direction === "asc"
            ? "desc"
            : "asc",
      });
    },
    [page, sortState, setSortState]
  );

  const sortedItems = useMemo(() => {
    if (!Array.isArray(items) || !sortState.column) return items;
    return [...items].sort((a, b) => {
      const aValue = a[sortState.column as keyof typeof a];
      const bValue = b[sortState.column as keyof typeof b];
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return sortState.direction === "asc" ? -1 : 1;
      if (bValue == null) return sortState.direction === "asc" ? 1 : -1;
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortState.direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      return sortState.direction === "asc"
        ? aValue < bValue
          ? -1
          : 1
        : bValue < aValue
        ? -1
        : 1;
    });
  }, [items, sortState]);

  const pageTypeToLinkMap = useMemo(() => {
    return LINKS_Params.reduce((acc, link) => {
      const pageType = Object.entries(PAGE_TYPES).find(
        ([key, value]) => value.toLowerCase() === link.page.toLowerCase()
      );
      if (pageType) {
        acc[pageType[1]] = link;
      }
      return acc;
    }, {} as Record<PageTypeValue, LinkParam>);
  }, []);

  const renderSearchFields = () => {
    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        handleSearch();
      }
    };
  
    return (
      <div className="relative grid grid-cols-3 gap-6 text-gray-600">
        {page !== PAGE_TYPES.COUNTRIES && (
          <>
            <div className="flex flex-col">
              <label className="text-sm font-bold mb-1">Code :</label>
              <input
                type="text"
                className="p-2 text-sm text-gray-900 border-2 border-gray-200 bg-gray-50 rounded-md focus:outline-none focus:ring-blue-500 transition-all focus:border-[2px] focus:border-blue-500 focus:shadow-[0_0px_0px_5px_rgba(44,130,201,0.2)]"
                placeholder="Rechercher par code"
                value={searchFields.code}
                onChange={(e) =>
                  setSearchFields({ ...searchFields, code: e.target.value })
                }
                onKeyPress={handleKeyPress}
                autoComplete="off"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-bold mb-1">Libellé :</label>
              <input
                type="text"
                className="p-2 text-sm text-gray-900 border-2 border-gray-200 bg-gray-50 rounded-md focus:outline-none focus:ring-blue-500 transition-all focus:border-[2px] focus:border-blue-500 focus:shadow-[0_0px_0px_5px_rgba(44,130,201,0.2)]"
                placeholder="Rechercher par libellé"
                value={searchFields.label}
                onChange={(e) =>
                  setSearchFields({ ...searchFields, label: e.target.value })
                }
                onKeyPress={handleKeyPress}
                autoComplete="off"
              />
            </div>
          </>
        )}
      {page === PAGE_TYPES.CLASSIFICATIONS && (
        <div className="flex flex-col">
          <label className="text-sm font-bold mb-1">Niveau :</label>
          <input
            type="text"
            className="p-2 text-sm text-gray-900 border-2 border-gray-200 bg-gray-50 rounded-md focus:outline-none focus:ring-blue-500 transition-all focus:border-[2px] focus:border-blue-500 focus:shadow-[0_0px_0px_5px_rgba(44,130,201,0.2)]"
            placeholder="Rechercher par niveau"
            value={searchFields.level || ""}
            onChange={(e) =>
              setSearchFields({ ...searchFields, level: e.target.value })
            }
            onKeyPress={handleKeyPress}
            autoComplete="off"
          />
        </div>
      )}
      {page === PAGE_TYPES.COUNTRIES && (
        <>
          <div className="flex flex-col">
            <label className="text-sm font-bold mb-1">Pays :</label>
            <input
              type="text"
              className="p-2 text-sm text-gray-900 border-2 border-gray-200 bg-gray-50 rounded-md focus:outline-none focus:ring-blue-500 transition-all focus:border-[2px] focus:border-blue-500 focus:shadow-[0_0px_0px_5px_rgba(44,130,201,0.2)]"
              placeholder="Rechercher par pays"
              value={searchFields.countryName || ""}
              onChange={(e) =>
                setSearchFields({
                  ...searchFields,
                  countryName: e.target.value,
                })
              }
              onKeyPress={handleKeyPress}
              autoComplete="off"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-bold mb-1">Code iso-2 :</label>
            <input
              type="text"
              className="p-2 text-sm text-gray-900 border-2 border-gray-200 bg-gray-50 rounded-md focus:outline-none focus:ring-blue-500 transition-all focus:border-[2px] focus:border-blue-500 focus:shadow-[0_0px_0px_5px_rgba(44,130,201,0.2)]"
              placeholder="Rechercher par code iso-2"
              value={searchFields.alpha2Code || ""}
              onChange={(e) =>
                setSearchFields({ ...searchFields, alpha2Code: e.target.value })
              }
              onKeyPress={handleKeyPress}
              autoComplete="off"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-bold mb-1">Code iso-3 :</label>
            <input
              type="text"
              className="p-2 text-sm text-gray-900 border-2 border-gray-200 bg-gray-50 rounded-md focus:outline-none focus:ring-blue-500 transition-all focus:border-[2px] focus:border-blue-500 focus:shadow-[0_0px_0px_5px_rgba(44,130,201,0.2)]"
              placeholder="Rechercher par code iso-3"
              value={searchFields.alpha3Code || ""}
              onChange={(e) =>
                setSearchFields({ ...searchFields, alpha3Code: e.target.value })
              }
              onKeyPress={handleKeyPress}
              autoComplete="off"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-bold mb-1">Code iso-N :</label>
            <input
              type="text"
              className="p-2 text-sm text-gray-900 border-2 border-gray-200 bg-gray-50 rounded-md focus:outline-none focus:ring-blue-500 transition-all focus:border-[2px] focus:border-blue-500 focus:shadow-[0_0px_0px_5px_rgba(44,130,201,0.2)]"
              placeholder="Rechercher par code iso-N"
              value={searchFields.numeric || ""}
              onChange={(e) =>
                setSearchFields({ ...searchFields, numeric: e.target.value })
              }
              onKeyPress={handleKeyPress}
              autoComplete="off"
            />
          </div>
        </>
      )}
    </div>
  );
};

  const renderTableHeaders = () => {
    const commonHeaders = [
      { id: "code", label: "Code" },
      { id: "label", label: "Libellé" },
      { id: "status", label: "Statut" },
    ];

    const specificHeaders: Record<
      PageTypeValue,
      { id: string; label: string }[]
    > = {
      [PAGE_TYPES.CLASSIFICATIONS]: [{ id: "level", label: "Niveau" }],
      [PAGE_TYPES.DIMENSIONS]: [],
      [PAGE_TYPES.GRIDS]: [],
      [PAGE_TYPES.COLLECTIONS]: [],
      [PAGE_TYPES.BRANDS]: [],
      [PAGE_TYPES.USER_FIELDS]: [],
      [PAGE_TYPES.TAXES]: [],
      [PAGE_TYPES.BLOCKS]: [],
      [PAGE_TYPES.COUNTRIES]: [
        { id: "countryName", label: "Pays" },
        { id: "alpha2Code", label: "Code Alpha-2" },
        { id: "alpha3Code", label: "Code Alpha-3" },
        { id: "numeric", label: "Code Numérique" },
      ],
    };

    const headers =
      page === "country"
        ? specificHeaders[page]
        : [...commonHeaders, ...specificHeaders[page]];

    return (
      <tr>
        {headers.map((header) => (
          <th key={header.id} scope="col" className="px-6 py-4">
            <SortHeader
              listId={page}
              column={header.id}
              label={header.label}
              onSort={handleSortChange}
            />
          </th>
        ))}
      </tr>
    );
  };

  const renderTableRows = () => {
    return sortedItems.map((item) => (
      <tr
        key={item._id}
        className="border-y-[1px] border-gray-200 cursor-pointer hover:bg-slate-200 capitalize text-[12px] text-gray-800 whitespace-nowrap"
        onClick={() => {
          /* Handle item selection */
        }}
      >
        {page === "country" ? (
          <>
            <td className="px-6 py-2">{item.countryName}</td>
            <td className="px-6 py-2">{item.alpha2Code}</td>
            <td className="px-6 py-2">{item.alpha3Code}</td>
            <td className="px-6 py-2">{item.numeric}</td>
          </>
        ) : (
          <>
            <td className="px-6 py-2">{item.code}</td>
            <td className="px-6 py-2">{item.label}</td>
            <td className="px-6 py-2 uppercase text-[10px]">
              {item.status === "A" ? (
                <div className="text-center bg-green-200 text-green-600 border border-green-400 py-1 rounded-md max-w-[50px]">
                  <span>Actif</span>
                </div>
              ) : (
                <div className="text-center bg-gray-200 text-gray-600 border border-gray-400 py-1 rounded-md max-w-[60px]">
                  <span>Inactif</span>
                </div>
              )}
            </td>
            {page === "classe" && <td className="px-6 py-2">{item.level}</td>}
          </>
        )}
      </tr>
    ));
  };

  return (
    <section className="w-full min-h-screen bg-slate-50 p-7 flex flex-col relative overflow-hidden">
      <Header
        title="Paramètres"
        light="de l'application"
        link={`/${page}/create`}
        btnTitle={`Créer un ${page}`}
        placeholder={`Rechercher un ${page}`}
        height="450px"
      >
        {renderSearchFields()}
        <div className="mt-3 flex items-center gap-2">
          <div className="flex items-center gap-2">
            <input
              type="radio"
              id="tous"
              name="status"
              value="all"
              checked={searchFields.status === "all"}
              onChange={() =>
                setSearchFields({ ...searchFields, status: "all" })
              }
            />
            <label
              htmlFor="tous"
              className="text-[14px] font-bold text-gray-600"
            >
              Tous
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="radio"
              id="actif"
              name="status"
              value="A"
              checked={searchFields.status === "A"}
              onChange={() => setSearchFields({ ...searchFields, status: "A" })}
            />
            <label
              htmlFor="actif"
              className="text-[14px] font-bold text-gray-600"
            >
              Actifs
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="radio"
              id="inactif"
              name="status"
              value="I"
              checked={searchFields.status === "I"}
              onChange={() => setSearchFields({ ...searchFields, status: "I" })}
            />
            <label
              htmlFor="inactif"
              className="text-[14px] font-bold text-gray-600"
            >
              Inactifs
            </label>
          </div>
        </div>
        <div className="flex items-center justify-between w-full mt-3">
          <Button type="button" size="small" blue onClick={handleSearch}>
            Lancer la Recherche
          </Button>
        </div>
      </Header>

      <div className="flex gap-4 flex-grow relative z-10 overflow-hidden">
        <div className="w-[300px] h-full border-t-[1px] border-gray-300 flex flex-col overflow-auto">
          {LINKS_Params.map((link) => {
            const pageType = Object.entries(PAGE_TYPES).find(
              ([key, value]) => value === link.page
            );
            if (!pageType) return null;

            return (
              <div
                key={link.page}
                className={`relative border-r-[1px] border-b-[1px] border-gray-300 py-3 flex items-center gap-3 cursor-pointer ${
                  page === link.page ? "text-blue-500" : "text-gray-500"
                } hover:text-blue-500`}
                onClick={() => handlePageTypeChange(link.page as PageTypeValue)}
              >
                {React.createElement(link.icon, {
                  size: page === link.page ? 20 : 15,
                })}
                <span className="text-xs font-[600]">{link.name}</span>
                {page === link.page && (
                  <>
                    <div
                      className="absolute right-0 top-1/2 transform -translate-y-1/2 rotate-180 w-5 h-5 bg-gray-200"
                      style={{ clipPath: "polygon(0 0, 100% 50%, 0 100%)" }}
                    ></div>
                    <div
                      className="absolute right-[-1px] top-1/2 transform -translate-y-1/2 rotate-180 w-4 h-4 bg-slate-50"
                      style={{ clipPath: "polygon(0 0, 100% 50%, 0 100%)" }}
                    ></div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-y-[1px] border-gray-200 text-sm font-[800] text-gray-700 uppercase">
              {renderTableHeaders()}
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={page === "country" ? 3 : 4}
                    className="text-center py-4"
                  >
                    <Spinner />
                  </td>
                </tr>
              ) : sortedItems.length > 0 ? (
                renderTableRows()
              ) : (
                <tr>
                  <td
                    colSpan={page === "country" ? 3 : 4}
                    className="text-center py-4"
                  >
                    Aucun Résultat
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="px-4 py-2 flex justify-between items-center">
            <h4 className="text-sm whitespace-nowrap">
              <span className="font-bold">{totalItem}</span> {page}
            </h4>
            {sortedItems.length > 0 && (
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
    </section>
  );
}

function ParamsMenuPage() {
  return (
    <SortProvider>
      <ParamsMenuPageContent />
    </SortProvider>
  );
}

export default ParamsMenuPage;
