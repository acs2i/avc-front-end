import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SingleProductPage from "./pages/product/SingleProductPage";
import Sidebar from "./components/Sidebar";
import PageContainer from "./components/PageContainer";
import SectionContainer from "./components/SectionContainer";
import LoginPage from "./pages/login/LoginPage";
import { useLocation } from "react-router-dom";
import CreateProductPage from "./pages/product/CreateProductPage";
import Header from "./components/Header";

function App() {
  const location = useLocation();
  const excludedPaths = ["/login"];

  const shouldShowNavbar = !excludedPaths.some((path) =>
    path.startsWith("*")
      ? location.pathname.startsWith(path.slice(1))
      : location.pathname === path
  );

  return (
    <>
      <div className="flex">
        {shouldShowNavbar && <Sidebar />}
        <SectionContainer>
          <PageContainer>
            <Header titlePage="rrrrr"/>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/product/create-product"
                element={<CreateProductPage />}
              />
              <Route path="/product/:id" element={<SingleProductPage />} />
              <Route path="/login" element={<LoginPage />} />
            </Routes>
          </PageContainer>
        </SectionContainer>
      </div>
    </>
  );
}

export default App;
