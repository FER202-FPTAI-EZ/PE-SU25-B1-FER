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
            <div className="d-flex justify-content-between align-items-start">
                <div>
                    <h3 className="page-title">Class List</h3>
                    <p className="page-subtitle">Manage and view attendance by class</p>
                </div>
                {/* TÙY CHỌN: nút thêm mới */}
                <Button className="btn-orange" onClick={() => navigate(`/classes/new`)}>
                    <i className="bi bi-plus-lg"></i> Add
                </Button>
            </div>

            {/* Bộ lọc */}
            <div className="filter-card">
                <Form.Label className="mb-0">Subject:</Form.Label>
                <Form.Select style={{ maxWidth: 240 }} value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value)}>
                    <option value="all">All Subjects</option>
                    {subjects.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                </Form.Select>

                <Form.Label className="mb-0 ms-3">Status:</Form.Label>
                {["ALL", "OPEN", "CLOSED"].map((value) => (
                    <Form.Check key={value} inline type="radio" name="status"
                        id={`status-${value}`}
                        label={value === "ALL" ? "All" : value}
                        checked={status === value}
                        onChange={() => changeStatus(value)} />
                ))}

                {/* TÙY CHỌN: tìm kiếm theo tên */}
                <Form.Control style={{ maxWidth: 200 }} className="ms-auto"
                    placeholder="Search name..." value={keyword}
                    onChange={(e) => setKeyword(e.target.value)} />
            </div>

            {/* Số kết quả */}
            <p className="result-count">
                Showing <b>{rows.length}</b> of {items.length} classes
                {subjectId !== "all" && <> for <b>{subjectName(subjectId)}</b></>}
                {status !== "ALL" && <> with status <b>{status}</b></>}
            </p>

            {/* Bảng — ĐỔI: cột theo đề */}
            <Table hover className="app-table">
                <thead>
                    <tr>
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
                        <tr><td colSpan={7} className="text-center text-muted">No data</td></tr>
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
                            <td className="text-nowrap">
                                <Button size="sm" className="btn-orange me-1"
                                    onClick={() => navigate(`/classes/${item.id}/attendance-summary`)}>
                                    View Attendance Summary
                                </Button>
                                {/* TÙY CHỌN: sửa / xóa */}
                                <Button size="sm" variant="outline-secondary" className="me-1"
                                    onClick={() => navigate(`/classes/${item.id}/edit`)}>
                                    <i className="bi bi-pencil"></i>
                                </Button>
                                <Button size="sm" variant="outline-danger"
                                    onClick={() => handleDelete(item)}>
                                    <i className="bi bi-trash"></i>
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
