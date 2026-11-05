import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Badge, Button, Form, Table } from "react-bootstrap";
import { instance } from "../lib/axios";
import { useAppContext } from "../provider/AppProvider";
import { average, countWhere, findById, nextSort, sortByField, sortIcon, toPercent } from "../utils/helpers";

// MẪU TRANG CHI TIẾT: lấy id từ URL + thẻ thống kê + sort 3 trạng thái + checkbox lọc
const DetailPage = () => {
    const { id } = useParams(); // /classes/:id/attendance-summary
    const navigate = useNavigate();

    // ---------- 1. DATA ----------
    const { students } = useAppContext();     // bảng tra cứu dùng chung
    const [item, setItem] = useState(null);   // 1 lớp
    const [subject, setSubject] = useState(null);
    const [rowsData, setRowsData] = useState([]);

    useEffect(() => {
        // GET /classes/:id, rồi GET /subjects/:subjectId
        instance.get(`/classes/${id}`).then((res) => {
            setItem(res.data);
            instance.get(`/subjects/${res.data.subjectId}`).then((r) => setSubject(r.data));
        });
        // GET /attendanceSummaries?classId=xxx
        instance.get("/attendanceSummaries", { params: { classId: id } })
            .then((res) => setRowsData(res.data));
    }, [id]);

    // ---------- 2. STATE ----------
    const [sortOrder, setSortOrder] = useState("none");
    const [warningOnly, setWarningOnly] = useState(false);

    // ---------- 3. HELPER ----------
    const isWarning = (rate) => rate < 80; // dưới 80% là "Warning"
    const student = (studentId) => findById(students, studentId) || {};

    // ---------- 4. THỐNG KÊ (tính trên TẤT CẢ dòng) + LỌC + SORT ----------
    const total = rowsData.length;
    const warningCount = countWhere(rowsData, (r) => isWarning(r.attendanceRate));
    const avgRate = average(rowsData, "attendanceRate");

    const filtered = rowsData.filter((r) => !warningOnly || isWarning(r.attendanceRate));
    const rows = sortByField(filtered, "attendanceRate", sortOrder);

    // ---------- 5. RENDER ----------
    if (!item) return <p>Loading...</p>;

    return (
        <div>
            <Button variant="link" style={{ color: "#c2410c", padding: 0, marginBottom: 12, textDecoration: "none", fontWeight: 600 }} onClick={() => navigate("/classes")}>
                ← Back to Classes
            </Button>

            <div style={{ background: "#fff", border: "1px solid #fde3c8", borderRadius: 8, padding: "14px 18px", marginBottom: 16 }}>
                <h4 style={{ color: "#7c2d12", fontWeight: 700, marginBottom: 4 }}>{item.className} — Attendance Summary</h4>
                <small style={{ color: "#6c757d" }}>
                    {subject?.code} — {subject?.name} | Lecturer: {item.lecturerName}
                </small>
            </div>

            {/* Thẻ thống kê — ĐỔI: số thẻ / nội dung */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 180, background: "#fff", border: "1px solid #fde3c8", borderRadius: 8, padding: "14px 18px", marginBottom: 16 }}>
                    <div style={{ fontSize: 12, textTransform: "uppercase", color: "#6b7280", fontWeight: 600 }}>Total Students</div>
                    <div style={{ fontSize: 26, fontWeight: 700 }}>{total}</div>
                </div>
                <div style={{ flex: 1, minWidth: 180, background: "#fff", border: "1px solid #fde3c8", borderRadius: 8, padding: "14px 18px", marginBottom: 16 }}>
                    <div style={{ fontSize: 12, textTransform: "uppercase", color: "#6b7280", fontWeight: 600 }}>Warning</div>
                    <div style={{ fontSize: 26, fontWeight: 700, color: "#dc2626" }}>{warningCount}</div>
                </div>
                <div style={{ flex: 1, minWidth: 180, background: "#fff", border: "1px solid #fde3c8", borderRadius: 8, padding: "14px 18px", marginBottom: 16 }}>
                    <div style={{ fontSize: 12, textTransform: "uppercase", color: "#6b7280", fontWeight: 600 }}>Average Rate</div>
                    <div style={{ fontSize: 26, fontWeight: 700, color: isWarning(avgRate) ? "#dc2626" : "#16a34a" }}>
                        {toPercent(avgRate)}
                    </div>
                </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <Form.Check type="checkbox" id="warning-only"
                    label="Show warning students only (<80%)"
                    checked={warningOnly}
                    onChange={(e) => setWarningOnly(e.target.checked)} />
                <small style={{ color: "#6c757d" }}>
                    Showing <b>{rows.length}</b> of {total} students
                </small>
            </div>

            <Table style={{ verticalAlign: "middle" }}>
                <thead>
                    <tr style={{ "--bs-table-bg": "#7c2d12", "--bs-table-color": "#fff", fontSize: 12, textTransform: "uppercase" }}>
                        <th>No</th>
                        <th>Student Code</th>
                        <th>Full Name</th>
                        <th>Total Sessions</th>
                        <th>Present</th>
                        <th>Absent</th>
                        {/* Bấm để sort; header đổi màu khi đang sort */}
                        <th role="button"
                            style={{ cursor: "pointer", color: sortOrder !== "none" ? "#fdba74" : "#fff" }}
                            onClick={() => setSortOrder(nextSort(sortOrder))}>
                            Att. Rate {sortIcon(sortOrder)}
                        </th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((r, index) => {
                        const warning = isWarning(r.attendanceRate);
                        return (
                            <tr key={r.id} style={{ "--bs-table-bg": warning ? "#FFF5F5" : undefined }}>
                                <td>{index + 1}</td>
                                <td><b>{student(r.studentId).studentCode}</b></td>
                                <td>{student(r.studentId).fullName}</td>
                                <td>{r.totalSessions}</td>
                                <td style={{ color: "#16a34a" }}>{r.present}</td>
                                <td style={{ color: "#dc2626" }}>{r.absent}</td>
                                <td style={{ fontWeight: "bold", color: warning ? "#dc2626" : "#16a34a" }}>
                                    {toPercent(r.attendanceRate)}
                                </td>
                                <td>
                                    <Badge bg={warning ? "danger" : "success"}>
                                        {warning ? "Warning" : "OK"}
                                    </Badge>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
        </div>
    );
};

export default DetailPage;
