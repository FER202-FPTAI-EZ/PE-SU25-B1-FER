import { useState } from "react"
import { Button, Form } from "react-bootstrap"

const StudentForm = ({ course, onSubmit }) => {
    const [studentName, setStudentName] = useState("")
    const [studentEmail, setStudentEmail] = useState("")
    const [yearOfStudy, setYearOfStudy] = useState(1)

    const handleSubmit = (e) => {
        e.preventDefault()
        const studentData = {
            studentName,
            email: studentEmail,
            year: yearOfStudy,
            date: new Date().toISOString(),
        }
        onSubmit(studentData)
    }

    return (
        <form onSubmit={handleSubmit}>
            <h4>Student Form</h4>
            <div style={{
                marginBottom: "10px"
            }}>
                <label htmlFor="studentName">Student Name</label>
                <Form.Control
                    placeholder="Recipient's username"
                    aria-label="Recipient's username"
                    aria-describedby="basic-addon2"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    required
                />
            </div>
            <div style={{
                marginBottom: "10px"
            }}>
                <label htmlFor="studentEmail">Student Email</label>
                <Form.Control
                    placeholder="Student Email"
                    aria-label="Student Email"
                    aria-describedby="basic-addon2"
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    type="email"
                />
            </div>
            <div style={{
                marginBottom: "10px"
            }}>
                <label htmlFor="yearOfStudy">Year of Study</label>
                <Form.Control
                    placeholder="Year of Study"
                    aria-label="Year of Study"
                    aria-describedby="basic-addon2"
                    type="number"
                    min={1}
                    max={4}
                    value={yearOfStudy}
                    onChange={(e) => setYearOfStudy(e.target.value)}
                />
            </div>

            <Button type="submit" variant="primary"
            >
                Confirm Enrollment
            </Button>
        </form>
    )
}

export default StudentForm
