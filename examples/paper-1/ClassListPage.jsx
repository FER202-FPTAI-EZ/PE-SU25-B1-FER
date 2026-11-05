// VÍ DỤ: lời giải paper-1. Copy vào src/pages/ và sửa đường dẫn import ("../lib/axios") nếu muốn chạy.
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Badge, Button, Form, Table } from "react-bootstrap";
import { instance } from "../../lib/axios";

// Q1 — Class List Page  (http://localhost:3000/classes)
const ClassListPage = () => {
    const navigate = useNavigate();

    // ---------- 1. DATA FROM API ----------
    const [classes, setClasses] = useState([]);
    const [subjects, setSubjects] = useState([]);

    useEffect(() => {
        // GET http://localhost:9999/classes
        instance.get("/classes").then((res) => setClasses(res.data));
        // GET http://localhost:9999/subjects
        instance.get("/subjects").then((res) => setSubjects(res.data));
    }, []);

    // ---------- 2. FILTER VALUES ----------
    // Subject dropdown: "all" or a subject id
    const [subjectId, setSubjectId] = useState("all");

    // Status radio is stored in the URL: /classes?status=OPEN
    // so opening that URL pre-selects the radio automatically.
    const [searchParams, setSearchParams] = useSearchParams();
    const status = searchParams.get("status") || "ALL";

    const changeStatus = (value) => {
        if (value === "ALL") setSearchParams({});          // -> /classes
        else setSearchParams({ status: value });            // -> /classes?status=OPEN
    };

    // ---------- 3. HELPERS ----------
    // Subject name from subjectId (no hard-coded names)
    const getSubjectName = (id) => {
        const subject = subjects.find((s) => s.id === id);
        return subject ? subject.name : "";
    };

    // Count only enrollments with status "enrolled"
    const countEnrolled = (cls) =>
        (cls.enrollments || []).filter((e) => e.status === "enrolled").length;

    // ---------- 4. APPLY FILTERS ----------
    const filteredClasses = classes.filter((c) => {
        const matchSubject = subjectId === "all" || c.subjectId === subjectId;
        const matchStatus = status === "ALL" || c.status === status;
        return matchSubject && matchStatus;
    });

    // ---------- 5. RENDER ----------
    return (
        <div>
            <h3 style={{ color: "#7c2d12", fontWeight: 700 }}>Class List</h3>
            <p style={{ color: "#6b7280", fontSize: 14 }}>Manage and view attendance by class</p>

            {/* Filter card */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", background: "#fff", border: "1px solid #fde3c8", borderRadius: 8, padding: "14px 18px", marginBottom: 16 }}>
                <Form.Label style={{ marginBottom: 0 }}>Subject:</Form.Label>
                <Form.Select
                    style={{ maxWidth: 260 }}
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value)}
                >
                    <option value="all">All Subjects</option>
                    {subjects.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                </Form.Select>

                <Form.Label style={{ marginBottom: 0, marginLeft: 16 }}>Status:</Form.Label>
                {["ALL", "OPEN", "CLOSED"].map((value) => (
                    <Form.Check
                        key={value}
                        inline
                        type="radio"
                        name="status"
                        id={`status-${value}`}
                        label={value === "ALL" ? "All" : value}
                        checked={status === value}
                        onChange={() => changeStatus(value)}
                    />
                ))}
            </div>

            {/* Result count */}
            <p style={{ fontSize: 13, color: "#6b7280" }}>
                Showing <b>{filteredClasses.length}</b> of {classes.length} classes
                {subjectId !== "all" && <> for <b>{getSubjectName(subjectId)}</b></>}
                {status !== "ALL" && <> with status <b>{status}</b></>}
            </p>

            {/* Table */}
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
                    {filteredClasses.map((c, index) => (
                        <tr key={c.id}>
                            <td>{index + 1}</td>
                            <td><b>{c.className}</b></td>
                            <td>{getSubjectName(c.subjectId)}</td>
                            <td>{c.lecturerName}</td>
                            <td>{countEnrolled(c)}</td>
                            <td>
                                {/* OPEN = green, CLOSED = red */}
                                <Badge bg={c.status === "OPEN" ? "success" : "danger"}>
                                    {c.status}
                                </Badge>
                            </td>
                            <td>
                                <Button
                                    size="sm"
                                    style={{ background: "#c2410c", borderColor: "#c2410c" }}
                                    onClick={() => navigate(`/classes/${c.id}/attendance-summary`)}
                                >
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

export default ClassListPage;
