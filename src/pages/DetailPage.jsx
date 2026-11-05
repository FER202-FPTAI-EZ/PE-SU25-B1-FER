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
            <Button variant="link" className="back-link" onClick={() => navigate("/classes")}>
                ← Back to Classes
            </Button>

            <div className="info-card">
                <h4 className="page-title mb-1">{item.className} — Attendance Summary</h4>
                <small className="text-muted">
                    {subject?.code} — {subject?.name} | Lecturer: {item.lecturerName}
                </small>
            </div>

            {/* Thẻ thống kê — ĐỔI: số thẻ / nội dung */}
            <div className="stat-row">
                <div className="stat-card">
                    <div className="stat-label">Total Students</div>
                    <div className="stat-value">{total}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Warning</div>
                    <div className="stat-value text-red">{warningCount}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Average Rate</div>
                    <div className={`stat-value ${isWarning(avgRate) ? "text-red" : "text-green"}`}>
                        {toPercent(avgRate)}
                    </div>
                </div>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-2">
                <Form.Check type="checkbox" id="warning-only" className="orange-check"
                    label="Show warning students only (<80%)"
                    checked={warningOnly}
                    onChange={(e) => setWarningOnly(e.target.checked)} />
                <small className="text-muted">
                    Showing <b>{rows.length}</b> of {total} students
                </small>
            </div>

            <Table className="app-table">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Student Code</th>
                        <th>Full Name</th>
                        <th>Total Sessions</th>
                        <th>Present</th>
                        <th>Absent</th>
                        {/* Bấm để sort; header đổi màu khi đang sort */}
                        <th role="button"
                            className={sortOrder !== "none" ? "sort-active" : ""}
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
                            <tr key={r.id} className={warning ? "row-warning" : ""}>
                                <td>{index + 1}</td>
                                <td><b>{student(r.studentId).studentCode}</b></td>
                                <td>{student(r.studentId).fullName}</td>
                                <td>{r.totalSessions}</td>
                                <td className="text-green">{r.present}</td>
                                <td className="text-red">{r.absent}</td>
                                <td className={`fw-bold ${warning ? "text-red" : "text-green"}`}>
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
