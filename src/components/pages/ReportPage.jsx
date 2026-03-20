import { Container, Table } from "react-bootstrap"
import { useAppContext } from "../../provider/AppProvider"
import DateFormat from "./DateFormat"

const ReportPage = () => {
    const { courses } = useAppContext()

    return (
        <Container>
            <h1 style={{
                marginBottom: "20px"
            }}>Report Page</h1>
            <Table bordered size="sm">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Course Name</th>
                        <th>Student</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        courses?.map(c => (
                            <tr key={c.id}>
                                <td>{c.id}</td>
                                <td>{c.title}</td>
                                <td style={{
                                    padding: 0
                                }}>
                                    <Table bordered size="sm" style={{
                                        marginBottom: 0
                                    }}>
                                        <thead>
                                            <tr>
                                                <th>Student Name</th>
                                                <th>Registration Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                c.enrollments?.map(e => (
                                                    <tr key={e.id}>
                                                        <td>{e.studentName}</td>
                                                        <td >
                                                            <DateFormat d={e.date} />
                                                        </td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </Table>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </Table>
        </Container>
    )
}

export default ReportPage
