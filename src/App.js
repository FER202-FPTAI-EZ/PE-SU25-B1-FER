import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppProvider from "./provider/AppProvider";
import HomePage from "./components/pages/HomePage";
import ProductReviews from "./components/pages/ProductReviews";

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/reviews" element={<ProductReviews />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
