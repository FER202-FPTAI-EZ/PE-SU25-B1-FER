import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./components/pages/HomePage";
import MovieList from "./components/pages/MovieList";
import BookTicket from "./components/pages/BookTicket";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route index path="/movies-showtimes" element={<MovieList />} />
        <Route index path="/booking" element={<BookTicket />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
