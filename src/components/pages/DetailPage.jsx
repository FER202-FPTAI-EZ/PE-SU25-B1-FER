import { Form, Table } from "react-bootstrap"
import { useAppContext } from "../../provider/AppProvider"
import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { instance } from "../../lib/axios"

const DetailPage = () => {
    const navigate = useNavigate()
    const { classId } = useParams()
    const { students } = useAppContext()
    const [classItem, setClassItem] = useState(null)
    const [subject, setSubject] = useState(null)
    const [attendanceSummary, setAttendanceSummary] = useState(null)
    const [checkStatus, setCheckStatus] = useState(false)

    useEffect(() => {
        instance.get(`/classes/${classId}`).then((res) => {
            setClassItem(res.data)
            if (res?.data?.subjectId) {
                instance.get(`/subjects/${res?.data?.subjectId}`).then((res) => setSubject(res.data));
            }
        });

        instance.get(`/attendanceSummaries?classId=${classId}`).then((res) => {
            setAttendanceSummary(res.data)
        });
    }, [])
    const studentAttendance = (studentId) => {
        return attendanceSummary?.find(a => a.studentId === studentId);
    }

    const rows = students?.filter(item => {
        const classMatch = classItem?.enrollments?.some(e => e.studentId === item.id && e.status === "enrolled");
        const matchFilter = !checkStatus || (checkStatus && studentAttendance(item.id)?.attendanceRate < 80);
        return classMatch && matchFilter;
    })

    const averageAttendanceRate = () => {
        if (!attendanceSummary || attendanceSummary.length === 0) return 0;
        const totalRate = attendanceSummary.reduce((sum, a) => sum + (a.attendanceRate || 0), 0);
        return totalRate / attendanceSummary.length;
    }


    return <div>
        <button onClick={() => navigate("/classes")}>
            Back to Classes
        </button>
        <div style={{
            border: "1px solid #ccc",
            padding: 16,
            margin: "16px 0",
            borderRadius: 4,
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
        }}>
            <h4>{classItem?.className} - Attendance Summary</h4>
            <p>{subject?.code} - {subject?.name} | Lecturer: {classItem?.lecturerName}</p>
        </div>

        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <div style={{
                border: "1px solid #ccc",
                padding: 16,
                borderRadius: 4,
                width: "30vw",
            }}>
                <p>TOTAL STUDENTS</p>
                <h4>{rows?.length || 0}</h4>
            </div>
            <div style={{
                border: "1px solid #ccc",
                padding: 16,
                borderRadius: 4,
                width: "30vw",
            }}>
                <p>WARNING</p>
                <h4>
                    {attendanceSummary?.filter(a => a.warning).length || 0}
                </h4>
            </div>
            <div style={{
                border: "1px solid #ccc",
                padding: 16,
                borderRadius: 4,
                width: "30vw",
            }}>
                <p>AVERAGE RATE</p>
                <h4>
                    {averageAttendanceRate().toFixed(1)}%
                </h4>
            </div>
        </div>

        <div style={{ margin: "8px 0", padding: 8, border: "1px solid #ccc", borderRadius: 4, maxWidth: 400 }}>
            <Form.Check inline name="warning"
                type="checkbox"
                checked={checkStatus}
                onChange={(e) => setCheckStatus(e.target.checked)}
            />
            <Form.Label>warning... (less than 80%)</Form.Label>
        </div>

        <div>
            <Table hover style={{ verticalAlign: "middle" }}>
                <thead>
                    <tr style={{ "--bs-table-bg": "#7c2d12", "--bs-table-color": "#fff", fontSize: 12, textTransform: "uppercase" }}>
                        <th>No</th>
                        <th>Student Code</th>
                        <th>FullName</th>
                        <th>Sessions</th>
                        <th>Present</th>
                        <th>Absent</th>
                        <th>Att.Rate</th>
                    </tr>
                </thead>
                <tbody>
                    {rows?.map((item, index) => (
                        <tr key={item.id}
                            style={{ "--bs-table-bg": studentAttendance(item.id)?.warning ? "rgba(255, 0, 0, 0.1)" : "transparent" }}
                        >
                            <td>{index + 1}</td>

                            <td><b>{item.studentCode}</b></td>
                            <td>{item.fullName}</td>
                            <td>{
                                studentAttendance(item.id)?.totalSessions || 0
                            }</td>
                            <td>{
                                studentAttendance(item.id)?.present || 0
                            }</td>
                            <td>{
                                studentAttendance(item.id)?.absent || 0
                            }</td>
                            <td>{
                                studentAttendance(item.id)?.attendanceRate?.toFixed(1) || 0
                            }%</td>

                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    </div>
}

export default DetailPage