import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Sidebar from "./components/Sidebar";
import PageContainer from "./components/PageContainer";
import SectionContainer from "./components/SectionContainer";

function App() {
  return (
    <div className="flex">
      <Sidebar />
      <SectionContainer>
        <PageContainer>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </PageContainer>
      </SectionContainer>
    </div>
  );
}

export default App;
