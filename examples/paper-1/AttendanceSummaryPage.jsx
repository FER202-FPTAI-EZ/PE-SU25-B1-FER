// VÍ DỤ: lời giải paper-1. Copy vào src/pages/ và sửa đường dẫn import ("../lib/axios") nếu muốn chạy.
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Badge, Button, Form, Table } from "react-bootstrap";
import { instance } from "../../lib/axios";

// Q2 — Attendance Summary Page  (http://localhost:3000/classes/:id/attendance-summary)
const WARNING_RATE = 80; // rate < 80 = warning

const AttendanceSummaryPage = () => {
    const { id } = useParams();   // class id from the URL
    const navigate = useNavigate();

    // ---------- 1. DATA FROM API ----------
    const [cls, setCls] = useState(null);
    const [subject, setSubject] = useState(null);
    const [summaries, setSummaries] = useState([]);
    const [students, setStudents] = useState([]);

    useEffect(() => {
        // GET /classes/:id  -> then GET /subjects/:subjectId
        instance.get(`/classes/${id}`).then((res) => {
            setCls(res.data);
            instance.get(`/subjects/${res.data.subjectId}`).then((r) => setSubject(r.data));
        });
        // GET /attendanceSummaries?classId=xxx
        instance.get(`/attendanceSummaries?classId=${id}`).then((res) => setSummaries(res.data));
        // GET /students
        instance.get("/students").then((res) => setStudents(res.data));
    }, [id]);

    // ---------- 2. UI STATE ----------
    const [sortOrder, setSortOrder] = useState("none"); // "none" | "asc" | "desc"
    const [warningOnly, setWarningOnly] = useState(false);

    // Click header: none -> asc -> desc -> none
    const toggleSort = () => {
        if (sortOrder === "none") setSortOrder("asc");
        else if (sortOrder === "asc") setSortOrder("desc");
        else setSortOrder("none");
    };
    const sortIcon = sortOrder === "asc" ? "↑" : sortOrder === "desc" ? "↓" : "↕";

    // ---------- 3. HELPERS ----------
    const getStudent = (studentId) => students.find((s) => s.id === studentId) || {};
    const isWarning = (rate) => rate < WARNING_RATE;
    const formatRate = (rate) => Number(rate).toFixed(1) + "%"; // 90 -> "90.0%"

    // ---------- 4. SUMMARY STATS (all students of the class) ----------
    const totalStudents = summaries.length;
    const warningCount = summaries.filter((s) => isWarning(s.attendanceRate)).length;
    const averageRate = totalStudents === 0
        ? 0
        : summaries.reduce((sum, s) => sum + s.attendanceRate, 0) / totalStudents;

    // ---------- 5. FILTER + SORT ----------
    let rows = summaries.filter((s) => !warningOnly || isWarning(s.attendanceRate));
    if (sortOrder === "asc") rows = [...rows].sort((a, b) => a.attendanceRate - b.attendanceRate);
    if (sortOrder === "desc") rows = [...rows].sort((a, b) => b.attendanceRate - a.attendanceRate);

    // ---------- 6. RENDER ----------
    return (
        <div>
            <Button variant="link" className="back-link" onClick={() => navigate("/classes")}>
                ← Back to Classes
            </Button>

            {/* Class name + subject name */}
            <div className="info-card">
                <h4 className="page-title mb-1">{cls?.className} — Attendance Summary</h4>
                <small className="text-muted">
                    {subject?.code} — {subject?.name} | Lecturer: {cls?.lecturerName}
                </small>
            </div>

            {/* Summary stats */}
            <div className="stat-row">
                <div className="stat-card">
                    <div className="stat-label">Total Students</div>
                    <div className="stat-value">{totalStudents}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Warning</div>
                    <div className="stat-value text-red">{warningCount}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Average Rate</div>
                    <div className={`stat-value ${isWarning(averageRate) ? "text-red" : "text-green"}`}>
                        {formatRate(averageRate)}
                    </div>
                </div>
            </div>

            {/* Warning filter + result count */}
            <div className="d-flex justify-content-between align-items-center mb-2">
                <Form.Check
                    type="checkbox"
                    id="warning-only"
                    className="warning-check"
                    label="Show warning students only (<80%)"
                    checked={warningOnly}
                    onChange={(e) => setWarningOnly(e.target.checked)}
                />
                <small className="text-muted">
                    Showing <b>{rows.length}</b> of {totalStudents} students
                </small>
            </div>

            {/* Table */}
            <Table className="app-table">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Student Code</th>
                        <th>Full Name</th>
                        <th>Total Sessions</th>
                        <th>Present</th>
                        <th>Absent</th>
                        <th
                            onClick={toggleSort}
                            style={{ cursor: "pointer" }}
                            className={sortOrder !== "none" ? "sort-active" : ""}
                        >
                            Att. Rate {sortIcon}
                        </th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((s, index) => {
                        const student = getStudent(s.studentId);
                        const warning = isWarning(s.attendanceRate);
                        return (
                            // Whole row light red (#FFF5F5) when rate < 80
                            <tr key={s.id} className={warning ? "row-warning" : ""}>
                                <td>{index + 1}</td>
                                <td><b>{student.studentCode}</b></td>
                                <td>{student.fullName}</td>
                                <td>{s.totalSessions}</td>
                                <td className="text-green">{s.present}</td>
                                <td className="text-red">{s.absent}</td>
                                <td className={warning ? "text-red fw-bold" : "text-green fw-bold"}>
                                    {formatRate(s.attendanceRate)}
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

export default AttendanceSummaryPage;
