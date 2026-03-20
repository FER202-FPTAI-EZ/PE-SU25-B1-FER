import { Button, Card, Col, Container, Form, Row } from "react-bootstrap"
import { useAppContext } from "../../provider/AppProvider"
import { useState } from "react"
import StudentForm from "./StudentForm"
import { instance } from "../../lib/axios"

const HomePage = () => {
    const { courses, setCourses } = useAppContext()
    const [selectedDepartment, setSelectedDepartment] = useState("all")
    const [selectedCourse, setSelectedCourse] = useState(null)
    const [isSubmitted, setIsSubmitted] = useState(false)

    const departments = new Set(courses.map(c => c.department))
    const filteredCourses = courses.filter(c => selectedDepartment === "all" || selectedDepartment === c.department)

    const getAverageGrade = (course) => {
        const totalGrade = course?.enrollments?.reduce((sum, e) => sum + e.grade, 0)
        const avg = totalGrade / course?.enrollments?.length
        return avg
    }

    const handleAddStudent = async (studentData) => {
        try {
            const newCourse = {
                ...selectedCourse,
                enrollments: [
                    ...(selectedCourse.enrollments || []),
                    studentData
                ]
            }
            await instance.put(`/courses/${selectedCourse.id}`, newCourse)
            setCourses(courses.map(c => c.id === selectedCourse.id ? newCourse : c))
            setIsSubmitted(true)
        } catch (error) {
            alert("Failed to enroll student: " + error.message)
        }
    }

    return (
        <Container>
            <h1>Courses Management System</h1>
            <div style={{
                marginBottom: "20px",
                display: "flex",
                justifyContent: "space-between"
            }}>
                <Form.Select aria-label="Default select example" style={{
                    maxWidth: "300px"
                }}
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                >
                    <option value={"all"}>-- Select all departments --</option>
                    {
                        Array.from(departments).map(d => <option key={d} value={d}>{d}</option>)
                    }
                </Form.Select>

                <Button variant="primary" href="/report" style={{ marginLeft: "10px" }}>
                    View Enrollment Report
                </Button>
            </div>
            <Row>
                <Col xs={8}>
                    <Row>
                        {
                            filteredCourses?.map(c => (
                                <Col key={c.id} xs={4}>
                                    <Card style={{ width: '18rem', marginBottom: "20px" }}>
                                        <Card.Body>
                                            <Card.Title>{c.title}</Card.Title>
                                            <Card.Text>
                                                Instructor: {c.instructor} <br />
                                                Duration: {c.duration} <br />
                                                Average Grade: {getAverageGrade(c)?.toFixed(2)}
                                            </Card.Text>
                                            <Button variant="primary"
                                                onClick={() => {
                                                    setSelectedCourse(c)
                                                    setIsSubmitted(false)
                                                }}
                                            >Enroll Now</Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))
                        }
                    </Row>
                </Col>

                <Col xs={4}>
                    {
                        selectedCourse && (
                            <Card style={{ width: '100%' }}>
                                <Card.Body>
                                    <Card.Text>
                                        CourseID: {selectedCourse.id} <br />
                                        Title: {selectedCourse.title} <br />
                                        Department : {selectedCourse.department} <br />
                                    </Card.Text>
                                    {
                                        isSubmitted ? <h2 style={{
                                            color: "green"
                                        }}>
                                            Student enrolled successfully!
                                        </h2> : (

                                            <StudentForm course={selectedCourse} onSubmit={handleAddStudent} />
                                        )
                                    }
                                </Card.Body>
                            </Card>
                        )
                    }
                </Col>
            </Row>
        </Container>
    )
}

export default HomePage
