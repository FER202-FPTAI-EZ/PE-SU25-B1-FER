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
            <Button variant="link" style={{ color: "#c2410c", padding: 0, marginBottom: 12, textDecoration: "none", fontWeight: 600 }} onClick={() => navigate("/classes")}>
                ← Back to Classes
            </Button>

            {/* Class name + subject name */}
            <div style={{ background: "#fff", border: "1px solid #fde3c8", borderRadius: 8, padding: "14px 18px", marginBottom: 16 }}>
                <h4 style={{ color: "#7c2d12", fontWeight: 700, marginBottom: 4 }}>{cls?.className} — Attendance Summary</h4>
                <small style={{ color: "#6c757d" }}>
                    {subject?.code} — {subject?.name} | Lecturer: {cls?.lecturerName}
                </small>
            </div>

            {/* Summary stats */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 180, background: "#fff", border: "1px solid #fde3c8", borderRadius: 8, padding: "14px 18px", marginBottom: 16 }}>
                    <div style={{ fontSize: 12, textTransform: "uppercase", color: "#6b7280", fontWeight: 600 }}>Total Students</div>
                    <div style={{ fontSize: 26, fontWeight: 700 }}>{totalStudents}</div>
                </div>
                <div style={{ flex: 1, minWidth: 180, background: "#fff", border: "1px solid #fde3c8", borderRadius: 8, padding: "14px 18px", marginBottom: 16 }}>
                    <div style={{ fontSize: 12, textTransform: "uppercase", color: "#6b7280", fontWeight: 600 }}>Warning</div>
                    <div style={{ fontSize: 26, fontWeight: 700, color: "#dc2626" }}>{warningCount}</div>
                </div>
                <div style={{ flex: 1, minWidth: 180, background: "#fff", border: "1px solid #fde3c8", borderRadius: 8, padding: "14px 18px", marginBottom: 16 }}>
                    <div style={{ fontSize: 12, textTransform: "uppercase", color: "#6b7280", fontWeight: 600 }}>Average Rate</div>
                    <div style={{ fontSize: 26, fontWeight: 700, color: isWarning(averageRate) ? "#dc2626" : "#16a34a" }}>
                        {formatRate(averageRate)}
                    </div>
                </div>
            </div>

            {/* Warning filter + result count */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <Form.Check
                    type="checkbox"
                    id="warning-only"
                   
                    label="Show warning students only (<80%)"
                    checked={warningOnly}
                    onChange={(e) => setWarningOnly(e.target.checked)}
                />
                <small style={{ color: "#6c757d" }}>
                    Showing <b>{rows.length}</b> of {totalStudents} students
                </small>
            </div>

            {/* Table */}
            <Table style={{ verticalAlign: "middle" }}>
                <thead>
                    <tr style={{ "--bs-table-bg": "#7c2d12", "--bs-table-color": "#fff", fontSize: 12, textTransform: "uppercase" }}>
                        <th>No</th>
                        <th>Student Code</th>
                        <th>Full Name</th>
                        <th>Total Sessions</th>
                        <th>Present</th>
                        <th>Absent</th>
                        <th
                            onClick={toggleSort}
                            style={{ cursor: "pointer", color: sortOrder !== "none" ? "#fdba74" : "#fff" }}
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
                            <tr key={s.id} style={{ "--bs-table-bg": warning ? "#FFF5F5" : undefined }}>
                                <td>{index + 1}</td>
                                <td><b>{student.studentCode}</b></td>
                                <td>{student.fullName}</td>
                                <td>{s.totalSessions}</td>
                                <td style={{ color: "#16a34a" }}>{s.present}</td>
                                <td style={{ color: "#dc2626" }}>{s.absent}</td>
                                <td style={{ fontWeight: "bold", color: warning ? "#dc2626" : "#16a34a" }}>
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
