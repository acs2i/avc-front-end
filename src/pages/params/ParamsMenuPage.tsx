import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LINKS_Params } from "../../utils/index";
import Card from "../../components/Shared/Card";
import { Info } from "lucide-react";
import Modal from "../../components/Shared/Modal";
import Button from "../../components/FormElements/Button";
import { Divider } from "@mui/material";
import ClassificationsPage from "./ClassificationsPage";
import DimensionPage from "./DimensionPage";
import GridPage from "./GridPage";
import CollectionPage from "./CollectionPage";
import BrandPage from "./BrandPage";
import ClassificationUpdatePage from "./ClassificationUpdatePage";
import DimensionUpdatePage from "./DimensionUpdatePage";
import CollectionUpdatePage from "./CollectionUpdatePage";
import BranchUpdatePage from "./BrandUpdatePage";
import ClassificationCreatePage from "./ClassificationCreatePage";
import DimensionCreateItemPage from "./DimensionCreateItemPage";
import CollectionCreatePage from "./CollectionCreatePage";
import BrandCreatePage from "./BrandCreatePage";
import GridCreatePage from "./GridCreatePage";

type DataType = "LA1" | "LA2" | "LA3";
type DataTypeDimension = "DI1" | "DI2";

interface Family {
  _id: string;
  YX_CODE: string;
  YX_TYPE: DataType;
  YX_LIBELLE: string;
}

interface Dimension {
  _id: string;
  GDI_DIMORLI: string;
  GDI_LIBELLE: string;
  GDI_TYPEDIM: DataTypeDimension;
}

interface Collection {
  _id: string;
  CODE: string;
  LIBELLE: string;
}

interface Brand {
  _id: string;
  YX_CODE: string;
  YX_LIBELLE: string;
}
interface Grid {
  _id: string;
  TYPE: string;
  LIBELLE: string;
  DIMENSIONS: string[];
}

function ParamsMenuPage() {
  const location = useLocation();
  const [page, setPage] = useState("classe");
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const [selectedFamily, setSelectedFamily] = useState<Family | null>(null);
  const [selectedGrid, setSelectedGrid] = useState<Grid | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [selectedCollection, setSelectedCollection] =
    useState<Collection | null>(null);
  const [selectedDimension, setSelectedDimension] = useState<Dimension | null>(
    null
  );
  const [isCreatePanelOpen, setIsCreatePanelOpen] = useState(false);
   const [highlightedId, setHighlightedId] = useState<string | null>(
    null
  );
  

  const handleRefetch = () => {
    setShouldRefetch((prev) => !prev);
  };

  const handleCloseClassification = () => {
    setSelectedFamily(null);
  };

  const handleCloseDimension = () => {
    setSelectedDimension(null);
  };

  const handleCloseCollection = () => {
    setSelectedCollection(null);
  };

  const handleCloseBrand = () => {
    setSelectedBrand(null);
  };

  const handleOpenCreatePanel = () => {
    setIsCreatePanelOpen(true);
  };

  const handleCloseCreatePanel = () => {
    setIsCreatePanelOpen(false);
  };
  const handleCreate = (newFamilyId: string) => {
    setHighlightedId(newFamilyId);
    setShouldRefetch((prev) => !prev);
  };

  const resetHighlightedId = () => {
    setHighlightedId(null);
  };

  useEffect(() => {
    setSelectedFamily(null);
    setSelectedDimension(null);
    setSelectedCollection(null);
    setSelectedBrand(null);
  }, [page]);


  return (
    <section className="w-full h-screen bg-gray-100 p-7 relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${"/img/background_forest.jpg"})`,
          opacity: 0.1,
          filter: "grayscale(100%)",
          zIndex: 1,
        }}
      ></div>
      <div className="h-[70px] mb-3 flex items-center gap-4 w-full relative z-10">
        <div className="w-[300px]">
          <button
            onClick={handleOpenCreatePanel}
            className="bg-blue-500 text-white text-[12px] font-[700] w-full py-2 rounded-md"
          >
            Créer une {page === "classe" && "classe"}
            {page === "dimension" && "dimension"}
            {page === "grid" && "grille"}
            {page === "collection" && "collection"}
            {page === "brand" && "marque"}
          </button>
        </div>
        <div className="relative w-full">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 cursor-pointer">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            id="default-search"
            className="block w-full px-[10px] py-[8px] ps-10 text-sm text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search..."
            required
          />
        </div>
      </div>
      <div className="flex gap-4 relative z-10">
        <div className="w-[300px] h-[400px] border-t-[1px] border-gray-300">
          {LINKS_Params.map((link) => (
            <div
              key={link.page}
              className={`border-r-[1px] border-b-[1px] border-gray-300 py-3 flex items-center gap-3 cursor-pointer ${
                page === link.page ? "text-blue-500" : "text-gray-500"
              } hover:text-blue-500`}
              onClick={() => setPage(link.page)}
            >
              {React.createElement(link.icon, {
                size: new RegExp(`^${link.link}(/.*)?$`).test(location.pathname)
                  ? 20
                  : 15,
              })}
              <span className="text-xs font-[600]">{link.name}</span>
            </div>
          ))}
        </div>
        <div className="w-full flex gap-7">
          <div className="w-full">
            {page === "classe" && (
              <ClassificationsPage
                onSelectFamily={setSelectedFamily}
                shouldRefetch={shouldRefetch}
                highlightedFamilyId={highlightedId}
                resetHighlightedFamilyId={resetHighlightedId}
              />
            )}
            {page === "dimension" && (
              <DimensionPage
                onSelectDimension={setSelectedDimension}
                shouldRefetch={shouldRefetch}
                highlightedDimensionId={highlightedId}
                resetHighlightedDimensionId={resetHighlightedId}
              />
            )}
            {page === "grid" && (
              <GridPage
                onSelectGrid={setSelectedGrid}
                shouldRefetch={shouldRefetch}
                highlightedGridId={highlightedId}
                resetHighlightedGridId={resetHighlightedId}
              />
            )}
            {page === "collection" && (
              <CollectionPage
                onSelectCollection={setSelectedCollection}
                shouldRefetch={shouldRefetch}
                highlightedCollectionId={highlightedId}
                resetHighlightedCollectionId={resetHighlightedId}
              />
            )}
            {page === "brand" && (
              <BrandPage
                onSelectBrand={setSelectedBrand}
                shouldRefetch={shouldRefetch}
                highlightedBrandId={highlightedId}
                resetHighlightedBrandId={resetHighlightedId}
              />
            )}
          </div>

          {/* Partie mise a jour composant */}
          {selectedFamily && (
            <div className="w-full bg-white rounded-lg border shadow-md">
              <ClassificationUpdatePage
                selectedFamily={selectedFamily}
                onClose={handleCloseClassification}
                onUpdate={handleRefetch}
              />
            </div>
          )}
          {selectedDimension && (
            <div className="w-full bg-white rounded-lg border shadow-md">
              <DimensionUpdatePage
                selectedDimension={selectedDimension}
                onClose={handleCloseDimension}
                onUpdate={handleRefetch}
              />
            </div>
          )}
          {selectedCollection && (
            <div className="w-full bg-white rounded-lg border shadow-md">
              <CollectionUpdatePage
                selectedCollection={selectedCollection}
                onClose={handleCloseCollection}
                onUpdate={handleRefetch}
              />
            </div>
          )}
          {selectedBrand && (
            <div className="w-full bg-white rounded-lg border shadow-md">
              <BranchUpdatePage
                selectedBrand={selectedBrand}
                onClose={handleCloseBrand}
                onUpdate={handleRefetch}
              />
            </div>
          )}

          {/* Partie création composant */}
          {isCreatePanelOpen && (
            <div className="w-full bg-white rounded-lg border shadow-md">
              {page === "classe" && (
                <ClassificationCreatePage
                  onClose={handleCloseCreatePanel}
                  onCreate={handleCreate}
                />
              )}
              {page === "dimension" && (
                <DimensionCreateItemPage
                  onClose={handleCloseCreatePanel}
                  onCreate={handleCreate}
                />
              )}
              {page === "grid" && (
                <GridCreatePage
                  onClose={handleCloseCreatePanel}
                  onCreate={handleCreate}
                />
              )}
              {page === "collection" && (
                <CollectionCreatePage
                  onClose={handleCloseCreatePanel}
                  onCreate={handleCreate}
                />
              )}
              {page === "brand" && (
                <BrandCreatePage
                  onClose={handleCloseCreatePanel}
                  onCreate={handleCreate}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default ParamsMenuPage;
