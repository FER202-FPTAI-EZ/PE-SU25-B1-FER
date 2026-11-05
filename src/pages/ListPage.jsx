import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Badge, Button, Form, Table } from "react-bootstrap";
import { instance } from "../lib/axios";
import { useAppContext } from "../provider/AppProvider";
import { countWhere, getField } from "../utils/helpers";

// MẪU TRANG DANH SÁCH: bảng + dropdown + radio (lưu trên URL) + ô tìm kiếm + nút
const ListPage = () => {
    const navigate = useNavigate();

    // ---------- 1. DATA ----------
    // Bảng chính: trang tự fetch. Bảng tra cứu: lấy từ AppProvider.
    const { subjects } = useAppContext();
    const [items, setItems] = useState([]);

    useEffect(() => {
        instance.get(`/classes`).then((res) => setItems(res.data));
    }, []);

    // ---------- 2. STATE CỦA BỘ LỌC ----------
    const [subjectId, setSubjectId] = useState("all"); // dropdown
    const [keyword, setKeyword] = useState("");        // TÙY CHỌN: ô tìm kiếm

    // Radio lưu trên URL: /classes?status=OPEN -> mở link là radio tự được chọn
    const [searchParams, setSearchParams] = useSearchParams();
    const status = searchParams.get("status") || "ALL";
    const changeStatus = (value) =>
        value === "ALL" ? setSearchParams({}) : setSearchParams({ status: value });

    // ---------- 3. HELPER ----------
    // ĐỔI: tên field trong đề
    const subjectName = (id) => getField(subjects, id, "name");
    const enrolledCount = (item) => countWhere(item.enrollments, (e) => e.status === "enrolled");

    // TÙY CHỌN: xóa
    const handleDelete = async (item) => {
        if (!window.confirm(`Delete ${item.className}?`)) return;
        await instance.delete(`/classes/${item.id}`);
        setItems(items.filter((i) => i.id !== item.id));
    };

    // ---------- 4. LỌC ----------
    const rows = items.filter((item) => {
        const okSubject = subjectId === "all" || item.subjectId === subjectId;
        const okStatus = status === "ALL" || item.status === status;
        const okKeyword = item.className.toLowerCase().includes(keyword.trim().toLowerCase());
        return okSubject && okStatus && okKeyword;
    });

    // ---------- 5. RENDER ----------
    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                    <h3 style={{ color: "#7c2d12", fontWeight: 700 }}>Class List</h3>
                    <p style={{ color: "#6b7280", fontSize: 14 }}>Manage and view attendance by class</p>
                </div>
                {/* TÙY CHỌN: nút thêm mới */}
                <Button style={{ background: "#c2410c", borderColor: "#c2410c" }} onClick={() => navigate(`/classes/new`)}>
                    <i className="bi bi-plus-lg"></i> Add
                </Button>
            </div>

            {/* Bộ lọc */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", background: "#fff", border: "1px solid #fde3c8", borderRadius: 8, padding: "14px 18px", marginBottom: 16 }}>
                <Form.Label style={{ marginBottom: 0 }}>Subject:</Form.Label>
                <Form.Select style={{ maxWidth: 240 }} value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value)}>
                    <option value="all">All Subjects</option>
                    {subjects.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                </Form.Select>

                <Form.Label style={{ marginBottom: 0, marginLeft: 16 }}>Status:</Form.Label>
                {["ALL", "OPEN", "CLOSED"].map((value) => (
                    <Form.Check key={value} inline type="radio" name="status"
                        id={`status-${value}`}
                        label={value === "ALL" ? "All" : value}
                        checked={status === value}
                        onChange={() => changeStatus(value)} />
                ))}

                {/* TÙY CHỌN: tìm kiếm theo tên */}
                <Form.Control style={{ maxWidth: 200, marginLeft: "auto" }}
                    placeholder="Search name..." value={keyword}
                    onChange={(e) => setKeyword(e.target.value)} />
            </div>

            {/* Số kết quả */}
            <p style={{ fontSize: 13, color: "#6b7280" }}>
                Showing <b>{rows.length}</b> of {items.length} classes
                {subjectId !== "all" && <> for <b>{subjectName(subjectId)}</b></>}
                {status !== "ALL" && <> with status <b>{status}</b></>}
            </p>

            {/* Bảng — ĐỔI: cột theo đề */}
            <Table hover style={{ verticalAlign: "middle" }}>
                <thead>
                    <tr style={{ "--bs-table-bg": "#7c2d12", "--bs-table-color": "#fff", fontSize: 12, textTransform: "uppercase" }}>
                        <th>No</th>
                        <th>Class Name</th>
                        <th>Subject Name</th>
                        <th>Lecturer</th>
                        <th>Enrolled Students</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.length === 0 && (
                        <tr><td colSpan={7} style={{ textAlign: "center", color: "#6c757d" }}>No data</td></tr>
                    )}
                    {rows.map((item, index) => (
                        <tr key={item.id}>
                            <td>{index + 1}</td>
                            <td><b>{item.className}</b></td>
                            <td>{subjectName(item.subjectId)}</td>
                            <td>{item.lecturerName}</td>
                            <td>{enrolledCount(item)}</td>
                            <td>
                                <Badge bg={item.status === "OPEN" ? "success" : "danger"}>
                                    {item.status}
                                </Badge>
                            </td>
                            <td style={{ whiteSpace: "nowrap" }}>
                                <Button size="sm" style={{ background: "#c2410c", borderColor: "#c2410c", marginRight: 4 }}
                                    onClick={() => navigate(`/classes/${item.id}/attendance-summary`)}>
                                    View Attendance Summary
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default ListPage;
