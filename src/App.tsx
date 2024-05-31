import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SingleProductPage from "./pages/product/SingleProductPage";
import Sidebar from "./components/Navigation/Sidebar";
import PageContainer from "./components/Shared/PageContainer";
import SectionContainer from "./components/Shared/SectionContainer";
import LoginPage from "./pages/login/LoginPage";
import { useLocation } from "react-router-dom";
import Navbar from "./components/Navigation/Navbar";
import { LINKS } from "./utils";
import { useSelector } from "react-redux";
import SuppliersPage from "./pages/suppliers/SuppliersPage";
import CreateProductPage from "./pages/product/CreateProductPage";
import ParamsMenuPage from "./pages/params/ParamsMenuPage";
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
import InProgressPage from "./pages/draft/InProgressPage";
import GridPage from "./pages/params/GridPage";
import GridCreatePage from "./pages/params/GridCreatePage";
import DonePage from "./pages/draft/DonePage";
import AdminPage from "./pages/panel-admin/AdminPage";
import CreateUserPage from "./pages/panel-admin/CreateUser";
import ProductList from "./pages/product/ProductList";
import { Navigate, Outlet } from "react-router-dom";

function App() {
  const location = useLocation();
  const excludedPaths = ["/login"];
  const isAuth = Boolean(useSelector((state: any) => state.auth.token));

  console.log(isAuth);

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

  const PrivateRoute = () => {
    const isAuth = Boolean(useSelector((state: any) => state.auth.token));

    return isAuth ? <Outlet /> : <Navigate to="/login" />;
  };

  return (
    <>
  
        {shouldShowNavbar && <Sidebar />}
        {shouldShowNavbar && <Navbar />}
        <div className="ml-[250px] mt-[60px]">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<PrivateRoute />}>
              <Route
                path="/"
                element={isAuth ? <Home /> : <Navigate to="/login" />}
              />
              <Route path="/product/edit" element={<CreateProductPage />} />
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
              <Route
                path="/parameters/grid/create"
                element={<GridCreatePage />}
              />
              <Route path="/parameters/brand" element={<BrandPage />} />
              <Route
                path="/parameters/brand/:id"
                element={<BrandUpdatePage />}
              />
              <Route
                path="/parameters/brand/create"
                element={<BrandCreatePage />}
              />
              <Route path="/product" element={<ProductList />} />
              <Route path="/product/:id" element={<SingleProductPage />} />
              <Route
                path="/suppliers/suppliers-list"
                element={<SuppliersPage />}
              />
              <Route path="/draft" element={<DraftPage />} />
              <Route path="/in-progress" element={<InProgressPage />} />
              <Route path="/done" element={<DonePage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/admin/create-user" element={<CreateUserPage />} />
            </Route>
          </Routes>
        </div>
  
    </>
  );
}

export default App;
