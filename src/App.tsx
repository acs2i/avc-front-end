import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SingleProductPage from "./pages/product/SingleProductPage";
import Sidebar from "./components/Shared/Sidebar";
import PageContainer from "./components/Shared/PageContainer";
import SectionContainer from "./components/Shared/SectionContainer";
import LoginPage from "./pages/login/LoginPage";
import { useLocation } from "react-router-dom";
import CreatedProductPage from "./pages/product/CreatedProductPage";
import Header from "./components/Shared/Header";
import { LINKS } from "./utils";
import SuppliersPage from "./pages/suppliers/SuppliersPage";
import CreateProductPage from "./pages/product/CreateProductPage";
import ParamsMenuPage from "./pages/params/ParamsMenuPage";
import ClassicationsPage from "./pages/params/ClassificationsPage";
import CollectionPage from "./pages/params/CollectionPage";
import ClassificationsPage from "./pages/params/ClassificationsPage";
import DimensionPage from "./pages/params/DimensionPage";
import BrandPage from "./pages/params/BrandPage";
import ClassificationUpdatePage from "./pages/params/ClassificationUpdatePage";
import CollectionUpdatePage from "./pages/params/CollectionUpdatePage";
import DimensionUpdatePage from "./pages/params/DimensionUpdatePage";
import ClassificationCreatePage from "./pages/params/ClassificationCreatePage";
import CollectionCreatePage from "./pages/params/CollectionCreatePage";
import BrandUpdatePage from "./pages/params/BrandUpdatePage";
import BrandCreatePage from "./pages/params/BrandCreatePage";
import DimensionCreateItemPage from "./pages/params/DimensionCreateItemPage";
import DraftPage from "./pages/draft/DraftPage";
import GridPage from "./pages/params/GridPage";
import GridCreatePage from "./pages/params/GridCreatePage";

function App() {
  const location = useLocation();
  const excludedPaths = ["/login"];

  useEffect(() => {
    window.scrollTo({
      top: 0,
      // behavior: 'smooth'
    });
  }, [location.pathname]);

  const shouldShowNavbar = !excludedPaths.some((path) =>
    path.startsWith("*")
      ? location.pathname.startsWith(path.slice(1))
      : location.pathname === path
  );

  const getPageTitle = () => {
    const currentPath = location.pathname;
    const link = LINKS.find((link) => {
      if (link.link.includes(":")) {
        // Vérifie si le lien contient un paramètre dynamique
        const linkPattern = new RegExp(`^${link.link.replace(/:id/, ".*")}$`);
        return linkPattern.test(currentPath);
      } else {
        return currentPath === link.link;
      }
    });
    return link ? link.name : "non trouvé";
  };

  return (
    <>
      <div className="flex realtive">
        {shouldShowNavbar && <Sidebar />}
        <SectionContainer>
          <PageContainer>
            {shouldShowNavbar && <Header titlePage={getPageTitle()} />}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/edit" element={<CreateProductPage />} />
              <Route path="/parameters" element={<ParamsMenuPage />} />
              <Route
                path="/parameters/classification"
                element={<ClassificationsPage />}
              />
              <Route
                path="/parameters/classification/:id"
                element={<ClassificationUpdatePage />}
              />
              <Route
                path="/parameters/classification/create"
                element={<ClassificationCreatePage />}
              />
              <Route
                path="/parameters/collection"
                element={<CollectionPage />}
              />
              <Route
                path="/parameters/collection/:id"
                element={<CollectionUpdatePage />}
              />
              <Route
                path="/parameters/collection/create"
                element={<CollectionCreatePage />}
              />
              <Route path="/parameters/dimension" element={<DimensionPage />} />
              <Route
                path="/parameters/dimension/:id"
                element={<DimensionUpdatePage />}
              />
              <Route
                path="/parameters/dimension/create/item"
                element={<DimensionCreateItemPage />}
              />
              <Route path="/parameters/grid" element={<GridPage />} />
              <Route path="/parameters/grid/create" element={<GridCreatePage />} />
              <Route path="/parameters/brand" element={<BrandPage />} />
              <Route
                path="/parameters/brand/:id"
                element={<BrandUpdatePage />}
              />
              <Route
                path="/parameters/brand/create"
                element={<BrandCreatePage />}
              />
              <Route path="/product/:id" element={<SingleProductPage />} />
              <Route
                path="/suppliers/suppliers-list"
                element={<SuppliersPage />}
              />
              <Route path="/draft" element={<DraftPage />} />
              <Route path="/login" element={<LoginPage />} />
            </Routes>
          </PageContainer>
        </SectionContainer>
      </div>
    </>
  );
}

export default App;
