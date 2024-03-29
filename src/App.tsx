import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SingleProductPage from "./pages/product/SingleProductPage";
import Sidebar from "./components/Sidebar";
import PageContainer from "./components/PageContainer";
import SectionContainer from "./components/SectionContainer";
import LoginPage from "./pages/login/LoginPage";
import { useLocation } from "react-router-dom";
import CreatedProductPage from "./pages/product/CreatedProductPage";
import CreateProductPage from "./pages/product/CreateProductpage";
import Header from "./components/Header";
import { LINKS } from "./utils";
import SuppliersListPage from "./pages/suppliers/SuppliersListPage";

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
        const linkPattern = new RegExp(`^${link.link.replace(/:id/, "\\d+")}$`);
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
                path="/product"
                element={<CreatedProductPage />}
              />
               <Route
                path="/product/create-product"
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
