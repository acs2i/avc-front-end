import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Sidebar from "./components/Sidebar";
import PageContainer from "./components/PageContainer";
import SectionContainer from "./components/SectionContainer";
import LoginPage from "./pages/login/LoginPage";
import { useLocation } from "react-router-dom";

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
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<LoginPage />} />
            </Routes>
          </PageContainer>
        </SectionContainer>
      </div>
    </>
  );
}

export default App;
