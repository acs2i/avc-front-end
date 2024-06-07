import React, { useEffect } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import Home from "./pages/Home";
import SingleProductPage from "./pages/product/SingleProductPage";
import Sidebar from "./components/Navigation/Sidebar";
import LoginPage from "./pages/login/LoginPage";
import Navbar from "./components/Navigation/Navbar";
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
import CreateGroupPage from "./pages/panel-admin/CreateGroup";
import CreatedGroupPage from "./pages/panel-admin/CreatedGroup";
import CalendarPage from "./pages/calendar/CalendarPage";

// Composant PrivateRoute
const PrivateRoute = ({ isAuth } : any) => {
  return isAuth ? <Outlet /> : <Navigate to="/login" />;
};

function App() {
  const location = useLocation();
  const excludedPaths = ["/login"];
  const isAuth = Boolean(useSelector((state: any) => state.auth.token));

  useEffect(() => {
    window.scrollTo({
      top: 0,
    });
  }, [location.pathname]);

  const shouldShowNavbar = !excludedPaths.some((path) =>
    path.startsWith("*")
      ? location.pathname.startsWith(path.slice(1))
      : location.pathname === path
  );

  return (
    <>
      {shouldShowNavbar && <Sidebar />}
      {shouldShowNavbar && <Navbar />}
      <div className={isAuth ? "ml-[250px] mt-[60px]" : ""}>
        <Routes>
          {/* Routes publiques */}
          <Route path="/login" element={<LoginPage />} />

          {/* Routes privées */}
          <Route element={<PrivateRoute isAuth={isAuth} />}>
            <Route path="/" element={<Home />} />
            <Route path="/product/edit" element={<CreateProductPage />} />
            <Route path="/parameters" element={<ParamsMenuPage />} />
            <Route path="/product" element={<ProductList />} />
            <Route path="/product/:id" element={<SingleProductPage />} />
            <Route path="/suppliers/suppliers-list" element={<SuppliersPage />} />
            <Route path="/draft" element={<DraftPage />} />
            <Route path="/in-progress" element={<InProgressPage />} />
            <Route path="/done" element={<DonePage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin/create-user" element={<CreateUserPage />} />
            <Route path="/admin/create-group" element={<CreateGroupPage />} />
            <Route path="/admin/created-group" element={<CreatedGroupPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
          </Route>
          <Route path="*" element={<Navigate to={isAuth ? "/" : "/login"} />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
