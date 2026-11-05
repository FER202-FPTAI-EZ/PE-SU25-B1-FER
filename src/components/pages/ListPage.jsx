import { Badge, Button, Form, Table } from "react-bootstrap";
import { useAppContext } from "../../provider/AppProvider";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const ListPage = () => {
    const navigate = useNavigate()
    const { classes, subjects } = useAppContext()
    const [searchParams, setSearchParams] = useSearchParams()

    const [selectedSubject, setSelectedSubject] = useState("ALL")


    const subjectName = (subjectId) => {
        const subject = subjects.find(s => s.id === subjectId);
        return subject ? subject.name : ""
    }

    const enrolledCount = (item) => {
        const enrolledStudents = item?.enrollments?.filter(e => e.status === "enrolled")
        return enrolledStudents ? enrolledStudents.length : 0
    }

    const rows = classes?.filter(item => {
        const subjectMatch = selectedSubject === "ALL" || item.subjectId === selectedSubject;
        const statusMatch = searchParams.get("status") === "ALL" || !searchParams.get("status") || item.status === searchParams.get("status");
        return subjectMatch && statusMatch;
    })

    return <div>
        <h2>Class List</h2>
        <p>Manage...</p>

        <div style={{
            display: "flex",
            alignItems: "center",
            border: "1px solid #ccc",
            padding: 8,
            borderRadius: 4,
        }}>
            <div style={{
                display: "flex", alignItems: "center", gap: 8
            }}>
                <Form.Label style={{ marginBottom: 0 }}>
                    Subject:
                </Form.Label>
                <Form.Select style={{ width: 400, fontSize: 14 }} size="sm"
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                >
                    <option value="ALL">All Subjects</option>
                    {subjects?.map((subject) => (
                        <option key={subject.id} value={subject.id}>{subject.name}</option>
                    ))}
                </Form.Select>
            </div>
            <div style={{
                display: "flex", alignItems: "center", gap: 8
            }}>
                <Form.Label style={{ marginBottom: 0, marginLeft: 16 }}>Status:</Form.Label>
                {["ALL", "OPEN", "CLOSED"].map((value) => (
                    <Form.Check key={value} inline type="radio" name="status"
                        id={`status-${value}`}
                        label={value === "ALL" ? "All" : value}
                        checked={searchParams.get("status") === value || (value === "ALL" && !searchParams.get("status"))}
                        onChange={() => {
                            setSearchParams({
                                status: value === "ALL" ? "" : value
                            })
                        }} />
                ))}
            </div>
        </div>


        <div style={{ margin: "8px 0" }}>
            Show of <span style={{ fontWeight: 700, color: "#c2410c" }}>4</span> of <span style={{ fontWeight: 700, color: "#c2410c" }}>4</span> classes
        </div>

        <div>
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
                    {rows?.map((item, index) => (
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
                                    onClick={() => navigate(`/classes/${item.id}/attendance-summary`)}
                                >
                                    View Attendance Summary
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>


    </div>
}

export default ListPage;