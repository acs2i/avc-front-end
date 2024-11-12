import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { useLocation } from "react-router-dom";
import {
  ListOrdered,
  Ruler,
  Grid3X3,
  Shirt,
  Captions,
  RectangleEllipsis,
  HandCoins,
  ShieldBan,
  Flag,
  Plus,
  Settings2,
} from "lucide-react";
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
import { Collapse } from "@mui/material";
import debounce from "lodash/debounce";
import ClassificationCreatePage from "./ClassificationCreatePage";
import ClassificationUpdatePage from "./ClassificationUpdatePage";
import DimensionCreateItemPage from "./DimensionCreateItemPage";
import DimensionUpdatePage from "./DimensionUpdatePage";
import GridCreatePage from "./GridCreatePage";
import CollectionCreatePage from "./CollectionCreatePage";
import CollectionUpdatePage from "./CollectionUpdatePage";
import useNotify from "../../utils/hooks/useToast";
import Modal from "./Modal";
import BrandCreatePage from "./BrandCreatePage";
import BrandUpdatePage from "./BrandUpdatePage";
import UserFieldUpdatePage from "./UserFieldUpdatePage";
import UserFieldCreatePage from "./UserFieldCreatePage";
import TaxCreatePage from "./TaxCreatePage";
import TaxUpdatePage from "./TaxUpdatePage";
import BlockUpdatePage from "./BlockUpdatePage";
import BlockCreatePage from "./BlockCreatePage";
import CountryUpdatePage from "./CountryUpdatePage";

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

interface BaseItem {
  _id: string;
  code?: string;
  label?: string;
  status?: string;
}

interface ClassificationItem extends BaseItem {
  level?: string;
  name?: string;
}

interface DimensionItem extends BaseItem {
  type?: string;
}

interface GridItem extends BaseItem {
  type?: string;
  dimensions?: string[];
  frn_labels?: string[];
}

interface UserFieldItem extends BaseItem {
  apply_to?: string;
}

interface TaxItem extends BaseItem {
  rate?: string;
}

interface CountryItem extends BaseItem {
  countryName?: string;
  alpha2Code?: string;
  alpha3Code?: string;
  numeric?: string;
}

type Item =
  | ClassificationItem
  | DimensionItem
  | GridItem
  | UserFieldItem
  | TaxItem
  | CountryItem;

interface SearchFields {
  code?: string;
  label?: string;
  status?: string;
  level?: string;
  type?: string;
  countryName?: string;
  alpha2Code?: string;
  alpha3Code?: string;
  numeric?: string;
  applyTo?: string;
  rate?: string;
}

function ParamsMenuPageContent() {
  const location = useLocation();
  const pageStorage = localStorage.getItem(LAST_PAGE_KEY);
  const [page, setPage] = useState<PageTypeValue>(
    (pageStorage as PageTypeValue) || PAGE_TYPES.CLASSIFICATIONS
  );
  const [isLoading, setIsLoading] = useState(false);
  const { notifySuccess, notifyError } = useNotify();
  const [searchParams, setSearchParams] = useState<SearchFields | null>(null);
  const [totalItem, setTotalItem] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [items, setItems] = useState<Item[]>([]);
  const { getSortState, setSortState } = useSortContext();
  const sortState = useMemo(() => getSortState(page), [getSortState, page]);
  const [expandedGrid, setExpandedGrid] = useState<GridItem | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const [searchFields, setSearchFields] = useState<SearchFields>({
    code: "",
    label: "",
    status: "A",
    level: "",
    type: "",
    countryName: "",
    alpha2Code: "",
    alpha3Code: "",
    numeric: "",
    applyTo: "",
    rate: "",
  });

  const limit = itemsPerPage;
  const totalPages = Math.ceil((totalItem ?? 0) / limit);

  const handleItemsPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newLimit = parseInt(event.target.value, 10);
    setItemsPerPage(newLimit);
    setCurrentPage(1); // Réinitialiser à la première page lors du changement de limite
    // Recharger les données avec la nouvelle limite
    if (searchParams) {
      searchItems(searchParams);
    } else {
      fetchItems();
    }
  };

  const getApiEndpoint = useCallback(() => {
    const endpoints: Record<PageTypeValue, string> = {
      [PAGE_TYPES.CLASSIFICATIONS]: "tag",
      [PAGE_TYPES.DIMENSIONS]: "dimension",
      [PAGE_TYPES.GRIDS]: "dimension-grid",
      [PAGE_TYPES.COLLECTIONS]: "collection",
      [PAGE_TYPES.BRANDS]: "brand",
      [PAGE_TYPES.USER_FIELDS]: "user-field",
      [PAGE_TYPES.TAXES]: "tax",
      [PAGE_TYPES.BLOCKS]: "block",
      [PAGE_TYPES.COUNTRIES]: "iso-code",
    };
    return endpoints[page] || "";
  }, [page]);

  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    try {
      const endpoint = getApiEndpoint();
      let url = `${process.env.REACT_APP_URL_DEV}/api/v1/${endpoint}/search/?page=${currentPage}&limit=${limit}`;
      
      if (searchFields.status && searchFields.status !== "all" && endpoint !== "iso-code") {
        console.log(searchFields.status)
        url += `&status=${searchFields.status}`;
      } else {
        url = `${process.env.REACT_APP_URL_DEV}/api/v1/${endpoint}/?page=${currentPage}&limit=${limit}`;
      }
      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
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
    async (params: SearchFields) => {
      setIsLoading(true);
      try {
        const endpoint = getApiEndpoint();
        const queryParams = new URLSearchParams(
          params as Record<string, string>
        );
        if (queryParams?.toString().includes("all")) {
          let url = `${
            process.env.REACT_APP_URL_DEV
          }/api/v1/${endpoint}/?page=${currentPage}&limit=${limit}`;
          const response = await fetch(url, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });
          const result = await response.json();
          setItems(result.data || []);
          setTotalItem(result.total);
        } else {
          let url = `${
            process.env.REACT_APP_URL_DEV
          }/api/v1/${endpoint}/search?page=${currentPage}&limit=${limit}&${queryParams?.toString()}`;
          const response = await fetch(url, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });
          const result = await response.json();
          setItems(result.data || []);
          setTotalItem(result.total);
        }
        
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
          if (value) {
            acc[key as keyof SearchFields] = value;
          }
          return acc;
        },
        {} as SearchFields
      );

      if (Object.keys(params).length === 0) {
        setSearchParams(null);
      } else {
        setSearchParams(params);
      }
      setCurrentPage(1);
    }, 300),
    [searchFields]
  );

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [formData, setFormData] = useState<any>({});

  const handleCreateClick = () => {
    setFormData({});
    setIsCreateModalOpen(true);
  };

  const handleCreateClose = () => {
    setIsCreateModalOpen(false);
    fetchItems(); // Refresh the list after creation
  };

  const handleRowClick = (item: Item) => {
    setSelectedItem(item);
    setFormData(item);
    setIsUpdateModalOpen(true);
  };

  const handleUpdateClose = () => {
    setIsUpdateModalOpen(false);
    setSelectedItem(null);
    fetchItems(); // Refresh the list after update
  };

  const modalRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        if (isCreateModalOpen) {
          setIsCreateModalOpen(false);
        }
        if (isUpdateModalOpen) {
          setIsUpdateModalOpen(false);
        }
      }
    },
    [isCreateModalOpen, isUpdateModalOpen]
  );

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      handleClickOutside(event);
    };

    if (isCreateModalOpen || isUpdateModalOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isCreateModalOpen, isUpdateModalOpen, handleClickOutside]);

  const [highlightedItemId, setHighlightedItemId] = useState<string | null>(
    null
  );

  const handleCreate = (newFieldId: string) => {
    setHighlightedItemId(newFieldId);
    fetchItems();
    handleCreateClose();
  };

  const handleUpdateSuccess = (updatedItemId: string) => {
    setHighlightedItemId(updatedItemId);
    setIsUpdateModalOpen(false);
    fetchItems();
  };

  useEffect(() => {
    if (highlightedItemId) {
      const timer = setTimeout(() => {
        setHighlightedItemId(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [highlightedItemId]);

  const renderCreateModal = () => {
    const commonProps = {
      onClose: () => setIsCreateModalOpen(false),
      formData,
      setFormData,
      onCreate: handleCreate,
    };

    switch (page) {
      case PAGE_TYPES.CLASSIFICATIONS:
        return <ClassificationCreatePage {...commonProps} />;
      case PAGE_TYPES.DIMENSIONS:
        return <DimensionCreateItemPage {...commonProps} />;
      case PAGE_TYPES.GRIDS:
        return <GridCreatePage {...commonProps} />;
      case PAGE_TYPES.COLLECTIONS:
        return <CollectionCreatePage {...commonProps} />;
      case PAGE_TYPES.BRANDS:
        return <BrandCreatePage {...commonProps} />;
      case PAGE_TYPES.USER_FIELDS:
        return <UserFieldCreatePage {...commonProps} />;
      case PAGE_TYPES.TAXES:
        return <TaxCreatePage {...commonProps} />;
      case PAGE_TYPES.BLOCKS:
        return <BlockCreatePage {...commonProps} />;
      case PAGE_TYPES.COUNTRIES:
        return null;
      // Add cases for other parameter types
      default:
        return null;
    }
  };

  const renderUpdateModal = () => {
    if (!selectedItem) return null;

    const commonProps = {
      onClose: () => setIsUpdateModalOpen(false),
      formData,
      setFormData,
    };

    switch (page) {
      case PAGE_TYPES.CLASSIFICATIONS:
        return (
          <ClassificationUpdatePage
            selectedFamily={selectedItem as any}
            onClose={() => setIsUpdateModalOpen(false)}
            onUpdateSuccess={handleUpdateSuccess}
          />
        );
      case PAGE_TYPES.DIMENSIONS:
        return (
          <DimensionUpdatePage
            selectedDimension={selectedItem as any}
            onClose={() => setIsUpdateModalOpen(false)}
            onUpdateSuccess={handleUpdateSuccess}
          />
        );
      case PAGE_TYPES.COLLECTIONS:
        return (
          <CollectionUpdatePage
            selectedCollection={selectedItem as any}
            onClose={() => setIsUpdateModalOpen(false)}
            onUpdateSuccess={handleUpdateSuccess}
          />
        );
      case PAGE_TYPES.BRANDS:
        return (
          <BrandUpdatePage
            selectedBrand={selectedItem as any}
            onClose={() => setIsUpdateModalOpen(false)}
            onUpdateSuccess={handleUpdateSuccess}
          />
        );
      case PAGE_TYPES.USER_FIELDS:
        return (
          <UserFieldUpdatePage
            selectedField={selectedItem as any}
            onClose={() => setIsUpdateModalOpen(false)}
            onUpdateSuccess={handleUpdateSuccess}
          />
        );
      case PAGE_TYPES.TAXES:
        return (
          <TaxUpdatePage
            selectedTax={selectedItem as any}
            onClose={() => setIsUpdateModalOpen(false)}
            onUpdateSuccess={handleUpdateSuccess}
          />
        );
      case PAGE_TYPES.BLOCKS:
        return (
          <BlockUpdatePage
            selectedBlock={selectedItem as any}
            onClose={() => setIsUpdateModalOpen(false)}
            onUpdateSuccess={handleUpdateSuccess}
          />
        );
      default:
        return null;
    }
  };

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
      status: "A",
      level: "",
      type: "",
      countryName: "",
      alpha2Code: "",
      alpha3Code: "",
      numeric: "",
      applyTo: "",
      rate: "",
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
      const aValue = a[sortState.column as keyof Item];
      const bValue = b[sortState.column as keyof Item];
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

  const renderSearchFields = () => {
    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        handleSearch();
      }
    };

    const commonFields = (
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
    );

    const specificFieldsPrimary: Record<PageTypeValue, JSX.Element> = {
      [PAGE_TYPES.CLASSIFICATIONS]: (
        <div className="flex flex-col">
          <label className="text-sm font-bold mb-1">Niveau :</label>
          <input
            type="text"
            className="p-2 text-sm text-gray-900 border-2 border-gray-200 bg-gray-50 rounded-md focus:outline-none focus:ring-blue-500 transition-all focus:border-[2px] focus:border-blue-500 focus:shadow-[0_0px_0px_5px_rgba(44,130,201,0.2)]"
            placeholder="Rechercher par niveau"
            value={searchFields.level}
            onChange={(e) =>
              setSearchFields({ ...searchFields, level: e.target.value })
            }
            onKeyPress={handleKeyPress}
            autoComplete="off"
          />
        </div>
      ),
      [PAGE_TYPES.DIMENSIONS]: (
        <div className="flex flex-col">
          <label className="text-sm font-bold mb-1">Type :</label>
          <input
            type="text"
            className="p-2 text-sm text-gray-900 border-2 border-gray-200 bg-gray-50 rounded-md focus:outline-none focus:ring-blue-500 transition-all focus:border-[2px] focus:border-blue-500 focus:shadow-[0_0px_0px_5px_rgba(44,130,201,0.2)]"
            placeholder="Rechercher par type"
            value={searchFields.type}
            onChange={(e) =>
              setSearchFields({ ...searchFields, type: e.target.value })
            }
            onKeyPress={handleKeyPress}
            autoComplete="off"
          />
        </div>
      ),
      [PAGE_TYPES.GRIDS]: (
        <div className="flex flex-col">
          <label className="text-sm font-bold mb-1">Type :</label>
          <input
            type="text"
            className="p-2 text-sm text-gray-900 border-2 border-gray-200 bg-gray-50 rounded-md focus:outline-none focus:ring-blue-500 transition-all focus:border-[2px] focus:border-blue-500 focus:shadow-[0_0px_0px_5px_rgba(44,130,201,0.2)]"
            placeholder="Rechercher par type"
            value={searchFields.type}
            onChange={(e) =>
              setSearchFields({ ...searchFields, type: e.target.value })
            }
            onKeyPress={handleKeyPress}
            autoComplete="off"
          />
        </div>
      ),
      [PAGE_TYPES.COLLECTIONS]: <></>,
      [PAGE_TYPES.BRANDS]: <></>,
      [PAGE_TYPES.USER_FIELDS]: <></>,
      [PAGE_TYPES.TAXES]: <></>,
      [PAGE_TYPES.BLOCKS]: <></>,
      [PAGE_TYPES.COUNTRIES]: <></>,
    };

    const specificFields: Record<PageTypeValue, JSX.Element> = {
      [PAGE_TYPES.CLASSIFICATIONS]: <></>,
      [PAGE_TYPES.DIMENSIONS]: <></>,

      [PAGE_TYPES.GRIDS]: <></>,
      [PAGE_TYPES.COLLECTIONS]: <></>,
      [PAGE_TYPES.BRANDS]: <></>,
      [PAGE_TYPES.USER_FIELDS]: (
        <div className="flex flex-col">
          <label className="text-sm font-bold mb-1">Associé à :</label>
          <input
            type="text"
            className="p-2 text-sm text-gray-900 border-2 border-gray-200 bg-gray-50 rounded-md focus:outline-none focus:ring-blue-500 transition-all focus:border-[2px] focus:border-blue-500 focus:shadow-[0_0px_0px_5px_rgba(44,130,201,0.2)]"
            placeholder="Rechercher par association"
            value={searchFields.applyTo}
            onChange={(e) =>
              setSearchFields({ ...searchFields, applyTo: e.target.value })
            }
            onKeyPress={handleKeyPress}
            autoComplete="off"
          />
        </div>
      ),
      [PAGE_TYPES.TAXES]: (
        <div className="flex flex-col">
          <label className="text-sm font-bold mb-1">Taux :</label>
          <input
            type="text"
            className="p-2 text-sm text-gray-900 border-2 border-gray-200 bg-gray-50 rounded-md focus:outline-none focus:ring-blue-500 transition-all focus:border-[2px] focus:border-blue-500 focus:shadow-[0_0px_0px_5px_rgba(44,130,201,0.2)]"
            placeholder="Rechercher par taux"
            value={searchFields.rate}
            onChange={(e) =>
              setSearchFields({ ...searchFields, rate: e.target.value })
            }
            onKeyPress={handleKeyPress}
            autoComplete="off"
          />
        </div>
      ),
      [PAGE_TYPES.BLOCKS]: <></>,
      [PAGE_TYPES.COUNTRIES]: (
        <>
          <div className="flex flex-col">
            <label className="text-sm font-bold mb-1">Pays :</label>
            <input
              type="text"
              className="p-2 text-sm text-gray-900 border-2 border-gray-200 bg-gray-50 rounded-md focus:outline-none focus:ring-blue-500 transition-all focus:border-[2px] focus:border-blue-500 focus:shadow-[0_0px_0px_5px_rgba(44,130,201,0.2)]"
              placeholder="Rechercher par pays"
              value={searchFields.countryName}
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
              value={searchFields.alpha2Code}
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
              value={searchFields.alpha3Code}
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
              value={searchFields.numeric}
              onChange={(e) =>
                setSearchFields({ ...searchFields, numeric: e.target.value })
              }
              onKeyPress={handleKeyPress}
              autoComplete="off"
            />
          </div>
        </>
      ),
    };

    return (
      <div className="relative grid grid-cols-3 gap-6 text-gray-600">
        {specificFieldsPrimary[page]}
        {page !== PAGE_TYPES.COUNTRIES && commonFields}
        {specificFields[page]}
      </div>
    );
  };

  const renderTableHeaders = () => {
    const headers: Record<PageTypeValue, { id: string; label: string }[]> = {
      [PAGE_TYPES.CLASSIFICATIONS]: [
        { id: "level", label: "Niveau" },
        { id: "code", label: "Code" },
        { id: "name", label: "Libellé" },
        { id: "status", label: "Statut" },
      ],
      [PAGE_TYPES.DIMENSIONS]: [
        { id: "type", label: "Type" },
        { id: "code", label: "Code" },
        { id: "label", label: "Libellé" },
        { id: "status", label: "Statut" },
      ],
      [PAGE_TYPES.GRIDS]: [
        { id: "type", label: "Type" },
        { id: "code", label: "Code" },
        { id: "label", label: "Libellé" },
        { id: "dimensions", label: "Dimensions" },
        { id: "status", label: "Statut" },
      ],
      [PAGE_TYPES.COLLECTIONS]: [
        { id: "code", label: "Code" },
        { id: "label", label: "Libellé" },
        { id: "status", label: "Statut" },
      ],
      [PAGE_TYPES.BRANDS]: [
        { id: "code", label: "Code" },
        { id: "label", label: "Libellé" },
        { id: "status", label: "Statut" },
      ],
      [PAGE_TYPES.USER_FIELDS]: [
        { id: "code", label: "Code" },
        { id: "label", label: "Libellé" },
        { id: "apply_to", label: "Associé à" },
        { id: "status", label: "Statut" },
      ],
      [PAGE_TYPES.TAXES]: [
        { id: "code", label: "Code" },
        { id: "label", label: "Libellé" },
        { id: "rate", label: "Taux" },
        { id: "status", label: "Statut" },
      ],
      [PAGE_TYPES.BLOCKS]: [
        { id: "code", label: "Code" },
        { id: "label", label: "Libellé" },
        { id: "status", label: "Statut" },
      ],
      [PAGE_TYPES.COUNTRIES]: [
        { id: "countryName", label: "Pays" },
        { id: "alpha2Code", label: "Code Alpha-2" },
        { id: "alpha3Code", label: "Code Alpha-3" },
        { id: "numeric", label: "Code Numérique" },
      ],
    };

    return (
      <tr>
        {headers[page]?.map((header) => (
          <th key={header.id} scope="col" className="px-6 py-3">
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
    const N = 5; // Nombre de dimensions à afficher initialement

    const handleViewMore = (grid: GridItem) => {
      setExpandedGrid(grid);
    };

    const extractNumbers = (item: string) => {
      return item.replace(/\D/g, "");
    };

    const renderStatus = (status: string | undefined) => {
      return status === "A" ? (
        <div className="text-center bg-green-200 text-green-600 border border-green-400 py-1 rounded-md max-w-[50px]">
          <span>Actif</span>
        </div>
      ) : (
        <div className="text-center bg-gray-200 text-gray-600 border border-gray-400 py-1 rounded-md max-w-[60px]">
          <span>Inactif</span>
        </div>
      );
    };

    return sortedItems?.map((item: Item) => (
      <tr
        key={item._id}
        className={`border-y-[1px] border-gray-200 cursor-pointer hover:bg-slate-200 capitalize text-[12px] text-gray-800 whitespace-nowrap ${
          item._id === highlightedItemId ? "bg-orange-300 text-white" : ""
        }`}
        onClick={() => handleRowClick(item)}
      >
        {(() => {
          switch (page) {
            case PAGE_TYPES.CLASSIFICATIONS:
              return (
                <>
                  <td className="px-6 py-2">
                    {(item as ClassificationItem).level}
                  </td>
                  <td className="px-6 py-2">{item.code}</td>
                  <td className="px-6 py-2">
                    {(item as ClassificationItem).name}
                  </td>
                  <td className="px-6 py-2">{renderStatus(item.status)}</td>
                </>
              );
            case PAGE_TYPES.DIMENSIONS:
              return (
                <>
                  <td className="px-6 py-2">{(item as DimensionItem).type}</td>
                  <td className="px-6 py-2">{item.code}</td>
                  <td className="px-6 py-2">{item.label}</td>
                  <td className="px-6 py-2">{renderStatus(item.status)}</td>
                </>
              );
            case PAGE_TYPES.GRIDS:
              const gridItem = item as GridItem;
              return (
                <>
                  <td className="px-6 py-2">{gridItem.type}</td>
                  <td className="px-6 py-2">{gridItem.code}</td>
                  <td className="px-6 py-2">
                    {gridItem.frn_labels &&
                      gridItem.frn_labels
                        .slice(0, N)
                        .map((dim: string, index: number) => (
                          <span
                            key={index}
                            className="text-[10px] rounded-[5px] mr-1"
                          >
                            {dim}
                          </span>
                        ))}
                    {gridItem.frn_labels && gridItem.frn_labels.length > N && (
                      <>
                        {expandedGrid !== gridItem && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewMore(gridItem);
                            }}
                            className="text-blue-600 text-[8px]"
                          >
                            Voir plus
                          </button>
                        )}
                        <Collapse in={expandedGrid === gridItem}>
                          <div className="mt-1">
                            <div className="grid grid-cols-5 gap-1">
                              {gridItem.frn_labels &&
                                gridItem.frn_labels
                                  .slice(N)
                                  .map((dim: string, index: number) => (
                                    <span
                                      key={index}
                                      className="text-[10px] rounded-[5px]"
                                    >
                                      {dim}
                                    </span>
                                  ))}
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedGrid(null);
                              }}
                              className="text-blue-600 text-[8px]"
                            >
                              Voir moins
                            </button>
                          </div>
                        </Collapse>
                      </>
                    )}
                  </td>
                  <td className="px-6 py-2">
                    {gridItem.dimensions &&
                      gridItem.dimensions
                        .slice(0, N)
                        .map((dim: string, index: number) => (
                          <span
                            key={index}
                            className="text-[10px] rounded-[5px] mr-1"
                          >
                            {extractNumbers(dim)}
                          </span>
                        ))}
                    {gridItem.dimensions && gridItem.dimensions.length > N && (
                      <>
                        {expandedGrid !== gridItem && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewMore(gridItem);
                            }}
                            className="text-blue-600 text-[8px]"
                          >
                            Voir plus
                          </button>
                        )}
                        <Collapse in={expandedGrid === gridItem}>
                          <div className="mt-1">
                            <div className="grid grid-cols-5 gap-1">
                              {gridItem.dimensions &&
                                gridItem.dimensions
                                  .slice(N)
                                  .map((dim: string, index: number) => (
                                    <span
                                      key={index}
                                      className="text-[10px] rounded-[5px]"
                                    >
                                      {extractNumbers(dim)}
                                    </span>
                                  ))}
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedGrid(null);
                              }}
                              className="text-blue-600 text-[8px]"
                            >
                              Voir moins
                            </button>
                          </div>
                        </Collapse>
                      </>
                    )}
                  </td>
                  <td className="px-6 py-2">{renderStatus(gridItem.status)}</td>
                </>
              );
            case PAGE_TYPES.COLLECTIONS:
            case PAGE_TYPES.BRANDS:
            case PAGE_TYPES.BLOCKS:
              return (
                <>
                  <td className="px-6 py-2">{item.code}</td>
                  <td className="px-6 py-2">{item.label}</td>
                  <td className="px-6 py-2">{renderStatus(item.status)}</td>
                </>
              );
            case PAGE_TYPES.USER_FIELDS:
              return (
                <>
                  <td className="px-6 py-2">{item.code}</td>
                  <td className="px-6 py-2">{item.label}</td>
                  <td className="px-6 py-2">
                    {(item as UserFieldItem).apply_to}
                  </td>
                  <td className="px-6 py-2">{renderStatus(item.status)}</td>
                </>
              );
            case PAGE_TYPES.TAXES:
              return (
                <>
                  <td className="px-6 py-2">{item.code}</td>
                  <td className="px-6 py-2">{item.label}</td>
                  <td className="px-6 py-2">{(item as TaxItem).rate}</td>
                  <td className="px-6 py-2">{renderStatus(item.status)}</td>
                </>
              );
            case PAGE_TYPES.COUNTRIES:
              const countryItem = item as CountryItem;
              return (
                <>
                  <td className="px-6 py-2">{countryItem.countryName}</td>
                  <td className="px-6 py-2">{countryItem.alpha2Code}</td>
                  <td className="px-6 py-2">{countryItem.alpha3Code}</td>
                  <td className="px-6 py-2">{countryItem.numeric}</td>
                </>
              );
            default:
              return null;
          }
        })()}
      </tr>
    ));
  };

  const translate = (key: string) => {
    switch (key) {
      case PAGE_TYPES.CLASSIFICATIONS:
        return "Classifications";
      case PAGE_TYPES.DIMENSIONS:
        return "Dimensions";
      case PAGE_TYPES.GRIDS:
        return "Grille de dimensions";
      case PAGE_TYPES.COLLECTIONS:
        return "Collections";
      case PAGE_TYPES.BRANDS:
        return "Marques";
      case PAGE_TYPES.USER_FIELDS:
        return "Champs utilisateur";
      case PAGE_TYPES.TAXES:
        return "Taxes";
      case PAGE_TYPES.BLOCKS:
        return "Blocages";
      case PAGE_TYPES.COUNTRIES:
        return "Code pays";
      default:
        return null;
    }
  };

  function getIconForPageType(pageType: string) {
    switch (pageType) {
      case "classe":
        return ListOrdered;
      case "dimension":
        return Ruler;
      case "grid":
        return Grid3X3;
      case "collection":
        return Shirt;
      case "brand":
        return Captions;
      case "field":
        return RectangleEllipsis;
      case "tax":
        return HandCoins;
      case "block":
        return ShieldBan;
      case "country":
        return Flag;
      default:
        return Settings2; // Icône par défaut
    }
  }

  return (
    <section className="w-full min-h-screen bg-slate-50 flex flex-col relative overflow-hidden">
      <Header
        title="Paramètres"
        light="de l'application"
        link={`/${page}/create`}
        btnTitle={`Créer un ${page}`}
        placeholder={`Rechercher un ${page}`}
        height="450px"
      >
        {renderSearchFields()}
        {page && page !== "country" && (
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
                onChange={() =>
                  setSearchFields({ ...searchFields, status: "A" })
                }
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
                onChange={() =>
                  setSearchFields({ ...searchFields, status: "I" })
                }
              />
              <label
                htmlFor="inactif"
                className="text-[14px] font-bold text-gray-600"
              >
                Inactifs
              </label>
            </div>
          </div>
        )}
        <div className="flex items-center justify-between w-full mt-3">
          <Button type="button" size="small" blue onClick={handleSearch}>
            Lancer la Recherche
          </Button>
          {page && page !== "country" && (
            <Button
              type="button"
              size="small"
              green
              onClick={handleCreateClick}
            >
              <Plus size={16} />
              Créer
            </Button>
          )}
        </div>
      </Header>

      <div className="flex gap-4 flex-grow relative z-10 overflow-hidden">
        <div className="w-[300px] ml-4 h-full border-t-[1px] border-gray-300 flex flex-col overflow-auto">
          {Object.entries(PAGE_TYPES)?.map(([key, value]) => {
            const icon = getIconForPageType(value);
            return (
              <div
                key={value}
                className={`relative border-r-[1px] border-b-[1px] border-gray-300 py-3 flex items-center gap-3 cursor-pointer ${
                  page === value ? "text-blue-500" : "text-gray-500"
                } hover:text-blue-500`}
                onClick={() => handlePageTypeChange(value)}
              >
                {React.createElement(icon, {
                  size: page === value ? 20 : 15,
                })}
                <span className="text-xs font-[600]">{translate(value)}</span>
                {page === value && (
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

        <div className="w-full overflow-x-auto flex flex-col">
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-y-[1px] border-gray-200 text-sm font-[800] text-gray-700 uppercase">
                {renderTableHeaders()}
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={Object.keys(PAGE_TYPES).length}
                      className="text-center py-3"
                    >
                      <Spinner />
                    </td>
                  </tr>
                ) : sortedItems.length > 0 ? (
                  renderTableRows()
                ) : (
                  <tr>
                    <td
                      colSpan={Object.keys(PAGE_TYPES).length}
                      className="text-center py-3"
                    >
                      Aucun Résultat
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="fixed z-50 bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-md">
        <div className="max-w-[2000px] mx-auto px-4 py-2 flex justify-between items-center">
          <h4 className="text-sm whitespace-nowrap">
            <span className="font-bold">{totalItem}</span> {translate(page)}
          </h4>
          <div className="flex items-center gap-4">
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
            <div className="flex items-center gap-2">
              <label
                htmlFor="itemsPerPage"
                className="text-sm font-medium text-gray-700"
              >
                Éléments par page :
              </label>
              <select
                id="itemsPerPage"
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="500">500</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      >
        {renderCreateModal()}
      </Modal>

      <Modal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
      >
        {renderUpdateModal()}
      </Modal>
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
