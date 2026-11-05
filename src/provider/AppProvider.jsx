import { createContext, useContext, useEffect, useState } from "react";
import { instance } from "../lib/axios";

// Context giữ các bảng TRA CỨU dùng ở nhiều trang (subjects, students...)
// Bảng chính của từng trang thì trang đó tự fetch theo đúng API đề ghi.
const AppContext = createContext();

const AppProvider = ({ children }) => {
    const [subjects, setSubjects] = useState([]);
    const [students, setStudents] = useState([]);

    // Gọi lại sau khi thêm / sửa / xóa ở các bảng này
    const reload = () => {
        instance.get("/subjects").then((res) => setSubjects(res.data));
        instance.get("/students").then((res) => setStudents(res.data));
    };

    useEffect(() => {
        reload();
    }, []);

    // Trang nào cần: const { subjects, students, reload } = useAppContext()
    return (
        <AppContext.Provider value={{ subjects, students, reload }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);

export default AppProvider;
