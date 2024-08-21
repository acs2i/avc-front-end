import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { LINKS_Params } from "../../utils/index";
import { Settings2 } from "lucide-react";
import ClassificationsPage from "./ClassificationsPage";
import DimensionPage from "./DimensionPage";
import GridPage from "./GridPage";
import CollectionPage from "./CollectionPage";
import BrandPage from "./BrandPage";
import ClassificationUpdatePage from "./ClassificationUpdatePage";
import DimensionUpdatePage from "./DimensionUpdatePage";
import CollectionUpdatePage from "./CollectionUpdatePage";
import BrandUpdatePage from "./BrandUpdatePage";
import ClassificationCreatePage from "./ClassificationCreatePage";
import DimensionCreateItemPage from "./DimensionCreateItemPage";
import CollectionCreatePage from "./CollectionCreatePage";
import BrandCreatePage from "./BrandCreatePage";
import GridCreatePage from "./GridCreatePage";
import UserFieldCreatePage from "./UserFieldCreatePage";
import UserFieldPage from "./UserFieldPage";

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

interface Dimension {
  _id: string;
  code: string;
  label: string;
  type: string;
  status: string;
  creator_id: any;
  additional_fields?: any;
}

interface Collection {
  _id: string;
  code: string;
  label: string;
  status: string;
  creator_id: any;
  additional_fields?: any;
}

interface Brand {
  _id: string;
  code: string;
  label: string;
  status: string;
  creator_id: any;
  additional_fields?: any;
}


interface UserField {
  _id: string;
  code: string;
  label: string;
  apply_to: string;
  status: string;
  creator_id: any;
  additional_fields?: any;
}

interface Grid {
  _id: string;
  label: string;
  type: string;
  dimensions: string[];
}

function ParamsMenuPage() {
  const location = useLocation();
  const [page, setPage] = useState("classe");
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const [selectedFamily, setSelectedFamily] = useState<Tag | null>(null);
  const [selectedGrid, setSelectedGrid] = useState<Grid | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [selectedCollection, setSelectedCollection] =
    useState<Collection | null>(null);
  const [selectedDimension, setSelectedDimension] = useState<Dimension | null>(
    null
  );
  const [isCreatePanelOpen, setIsCreatePanelOpen] = useState(false);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

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
    <section className="w-full min-h-screen bg-slate-50 p-7 flex flex-col relative overflow-hidden">
      <div className="flex items-center gap-3 mb-4">
        <Settings2 size={20}/>
        <h3 className="text-[25px] font-[800]">Création <span className="font-[200]">et modification des paramètres</span></h3>
      </div>
      <div className="h-[70px] mb-3 flex items-center gap-4 w-full relative z-10">
        <div className="w-[300px]">
          <button
            onClick={handleOpenCreatePanel}
            className="bg-blue-500 text-white text-[12px] font-[700] w-full py-2 rounded-md"
            type="button"
          >
            Créer {page === "classe" && "une classification"}
            {page === "dimension" && "une dimension"}
            {page === "grid" && "une grille"}
            {page === "collection" && "une collection"}
            {page === "brand" && "une marque"}
            {page === "field" && "un champs utilisateur"}
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
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
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
      <div className="flex gap-4 flex-grow relative z-10 overflow-hidden">
        <div className="w-[300px] h-full border-t-[1px] border-gray-300 flex flex-col overflow-auto">
          {LINKS_Params.map((link) => (
            <div
              key={link.page}
              className={`relative border-r-[1px] border-b-[1px] border-gray-300 py-3 flex items-center gap-3 cursor-pointer ${
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
          ))}
        </div>
        <div className="w-full flex gap-7 overflow-auto">
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
            {page === "field" && (
              <UserFieldPage
              onSelectUserField={setSelectedBrand}
                shouldRefetch={shouldRefetch}
                highlightedUserFieldId={highlightedId}
                resetHighlightedUserFieldId={resetHighlightedId}
              />
            )}
          </div>

          {/* Partie mise à jour composant */}
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
              <BrandUpdatePage
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
              {page === "field" && (
                <UserFieldCreatePage
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
