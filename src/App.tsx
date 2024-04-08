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
import SuppliersListPage from "./pages/suppliers/SuppliersListPage";
import CreateProductPage from "./pages/product/CreateProductPage";

function App() {
  const location = useLocation();
  const excludedPaths = ["/login"];

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
    return link ? link.name : "caca boom";
  };

  return (
    <>
      <div className="flex">
        {shouldShowNavbar && <Sidebar />}
        <SectionContainer>
          <PageContainer>
            {shouldShowNavbar && <Header titlePage={getPageTitle()} />}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/edit"
                element={<CreatedProductPage />}
              />
               <Route
                path="/edit/edit-product"
                element={<CreateProductPage />}
              />
              <Route path="/product/:id" element={<SingleProductPage />} />
              <Route path="/suppliers/suppliers-list" element={<SuppliersListPage />} />
              <Route path="/login" element={<LoginPage />} />
            </Routes>
          </PageContainer>
        </SectionContainer>
      </div>
    </>
  );
}

export default App;
