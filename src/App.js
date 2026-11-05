import { BrowserRouter, Navigate, NavLink, Route, Routes } from "react-router-dom";
import AppProvider from "./provider/AppProvider";
import ListPage from "./pages/ListPage";
import DetailPage from "./pages/DetailPage";
import FormPage from "./pages/FormPage";

function App() {
    return (
        <AppProvider>
            <BrowserRouter>
                {/* ===== ĐỔI THEO ĐỀ: tên app + các link trên header ===== */}
                <nav className="app-header">
                    <span className="app-brand">Attendance System</span>
                    <NavLink to="/classes" className="app-tab">Classes</NavLink>
                </nav>

                <main className="app-main">
                    {/* ===== ĐỔI THEO ĐỀ: copy-paste URL từ đề, KHÔNG tự gõ ===== */}
                    <Routes>
                        <Route path="/" element={<Navigate to="/classes" replace />} />

                        <Route path="/classes" element={<ListPage />} />
                        <Route path="/classes/:id/attendance-summary" element={<DetailPage />} />

                        {/* TÙY CHỌN: thêm / sửa dùng chung 1 trang */}
                        <Route path="/classes/new" element={<FormPage />} />
                        <Route path="/classes/:id/edit" element={<FormPage />} />

                        <Route path="*" element={<h4>Page not found</h4>} />
                    </Routes>
                </main>
            </BrowserRouter>
        </AppProvider>
    );
}

export default App;
