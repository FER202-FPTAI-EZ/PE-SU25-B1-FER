import { BrowserRouter, Navigate, NavLink, Route, Routes } from "react-router-dom";
import AppProvider from "./provider/AppProvider";
import ListPage from "./components/pages/ListPage";
import DetailPage from "./components/pages/DetailPage";
// Import trang khi tạo xong, ví dụ:
// import ListPage from "./pages/ListPage";
// import DetailPage from "./pages/DetailPage";
// import FormPage from "./pages/FormPage";

function App() {
    return (
        <AppProvider>
            <BrowserRouter>
                {/* Nền cả trang */}
                <div style={{ background: "#fff", minHeight: "100vh" }}>
                    {/* ===== ĐỔI THEO ĐỀ: tên app + các link trên header ===== */}
                    <nav style={{ display: "flex", alignItems: "center", gap: 24, padding: "12px 24px", background: "linear-gradient(90deg, #7c2d12, #c2410c)" }}>
                        <span style={{ color: "#fff", fontWeight: 700 }}>My App</span>
                        <NavLink to="/" style={{ color: "#fff", textDecoration: "none", fontSize: 14, padding: "4px 12px", borderRadius: 4, background: "rgba(255,255,255,0.2)" }}>
                            Home
                        </NavLink>
                    </nav>

                    <main style={{ margin: "0 auto", padding: "24px 16px" }}>
                        {/* ===== ĐỔI THEO ĐỀ: copy-paste URL từ đề, KHÔNG tự gõ ===== */}
                        <Routes>

                            <Route path="/" element={<Navigate to="/classes" replace />} />

                            <Route path="/classes" element={<ListPage />} />
                            <Route path="/classes/:classId/attendance-summary" element={<DetailPage />} />


                            {/* Trang danh sách:

                            Trang chi tiết, lấy id bằng useParams():
                            <Route path="/classes/:id/attendance-summary" element={<DetailPage />} />

                            Thêm / sửa dùng chung 1 trang:
                            <Route path="/classes/new" element={<FormPage />} />
                            <Route path="/classes/:id/edit" element={<FormPage />} /> */}


                            <Route path="*" element={<h4>Page not found</h4>} />
                        </Routes>
                    </main>
                </div>
            </BrowserRouter>
        </AppProvider>
    );
}

export default App;
