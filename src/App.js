import { BrowserRouter, Route, Routes } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import AppProvider from "./provider/AppProvider";
import HomePage from "./components/pages/HomePage";
import ReportPage from "./components/pages/ReportPage";

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/report" element={<ReportPage />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
