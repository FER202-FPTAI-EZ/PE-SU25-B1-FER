import { createContext, useContext, useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars -- dùng khi bỏ comment các dòng fetch bên dưới
import { instance } from "../lib/axios";

// Context giữ các bảng TRA CỨU dùng ở nhiều trang (ví dụ subjects, students...)
// Bảng chính của từng trang thì trang đó tự fetch theo đúng API đề ghi.
const AppContext = createContext();

const AppProvider = ({ children }) => {
    // ===== ĐỔI THEO ĐỀ: mỗi bảng tra cứu = 1 useState + 1 dòng fetch =====
    // Ví dụ (bỏ comment + đổi tên bảng):
    // const [subjects, setSubjects] = useState([]);
    // const [students, setStudents] = useState([]);
    const [items, setItems] = useState([]); // xóa dòng này khi đã có bảng thật

    // Gọi lại sau khi thêm / sửa / xóa ở các bảng này
    const reload = () => {
        // instance.get("/subjects").then((res) => setSubjects(res.data));
        // instance.get("/students").then((res) => setStudents(res.data));
    };

    useEffect(() => {
        reload();
    }, []);

    // Nhớ thêm tên bảng vào value để trang khác lấy được:
    // value={{ subjects, students, reload }}
    // Trang dùng: const { subjects, reload } = useAppContext();
    return (
        <AppContext.Provider value={{ items, setItems, reload }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);

export default AppProvider;
