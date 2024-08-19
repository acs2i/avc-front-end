import React, { useEffect } from "react";
import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Home from "./pages/Home";
import SingleProductPage from "./pages/product/SingleProductPage";
import Sidebar from "./components/Navigation/Sidebar";
import LoginPage from "./pages/login/LoginPage";
import Navbar from "./components/Navigation/Navbar";
import SuppliersList from "./pages/suppliers/SuppliersList";
import CreateProductPage from "./pages/product/CreateProductPage";
import ParamsMenuPage from "./pages/params/ParamsMenuPage";
import DraftPage from "./pages/draft/DraftPage";
import AdminPage from "./pages/panel-admin/AdminPage";
import CreateUserPage from "./pages/panel-admin/CreateUser";
import ProductList from "./pages/product/ProductList";
import ProfilePage from "./pages/user/ProfilePage";
import CreateGroupPage from "./pages/panel-admin/CreateGroup";
import CreatedGroupPage from "./pages/panel-admin/CreatedGroup";
import CalendarPage from "./pages/calendar/CalendarPage";
import ChatPage from "./pages/chat/ChatPage";
import Chat from "./components/Shared/Chat";
import DraftUpdatePage from "./pages/draft/DraftUpdatePage";
import CreateSupplierPage from "./pages/suppliers/CreateSuppliersPage";
import SingleSupplierPage from "./pages/suppliers/SingleSupplierPage";

// Types
interface PrivateRouteProps {
  isAuth: boolean;
}

// Composant PrivateRoute
const PrivateRoute: React.FC<PrivateRouteProps> = ({ isAuth }) => {
  const location = useLocation();
  return isAuth ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
};

// Composant PublicRoute pour gérer la redirection des utilisateurs authentifiés
const PublicRoute: React.FC<{ isAuth: boolean; children: any }> = ({ isAuth, children }) => {
  return isAuth ? <Navigate to="/" replace /> : children;
};

function App() {
  const location = useLocation();
  const excludedPaths = ["/login"];
  const excludedPathsChat = ["/chat", "/parameters"];
  const isAuth = useSelector((state: any) => state.auth.token);

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

  const shouldShowChat = !excludedPathsChat.some((path) =>
    path.startsWith("*")
      ? location.pathname.startsWith(path.slice(1))
      : location.pathname === path
  );

  return (
    <>
      {shouldShowNavbar && isAuth && <Sidebar />}
      {shouldShowNavbar && isAuth && <Navbar />}
      <div className={isAuth ? "ml-[50px] sm:ml-[80px] md:ml-[150px] lg:ml-[250px] mt-[60px]" : ""}>
        <Routes>
          {/* Routes publiques */}
          <Route
            path="/login"
            element={
              <PublicRoute isAuth={isAuth}>
                <LoginPage />
              </PublicRoute>
            }
          />

          {/* Routes privées */}
          <Route element={<PrivateRoute isAuth={isAuth} />}>
            <Route path="/" element={<Home />} />
            <Route path="/product/edit" element={<CreateProductPage />} />
            <Route path="/parameters" element={<ParamsMenuPage />} />
            <Route path="/product" element={<ProductList />} />
            <Route path="/product/:id" element={<SingleProductPage />} />
            <Route path="/suppliers/:id" element={<SingleSupplierPage />} />
            <Route path="/suppliers/suppliers-list" element={<SuppliersList />} />
            <Route path="/suppliers/create" element={<CreateSupplierPage />} />
            <Route path="/draft" element={<DraftPage />} />
            <Route path="/draft/:id" element={<DraftUpdatePage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin/create-user" element={<CreateUserPage />} />
            <Route path="/admin/create-group" element={<CreateGroupPage />} />
            <Route path="/admin/created-group" element={<CreatedGroupPage />} />
            <Route path="/user/profile/:userId" element={<ProfilePage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/chat" element={<ChatPage />} />
          </Route>
          <Route path="*" element={<Navigate to={isAuth ? "/" : "/login"} />} />
        </Routes>
        {/* {shouldShowNavbar && isAuth && shouldShowChat && <Chat />} */}
      </div>
    </>
  );
}

export default App;
