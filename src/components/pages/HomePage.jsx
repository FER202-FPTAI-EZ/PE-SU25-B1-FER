import { Col, Row } from "react-bootstrap";
import Left from "../Left";

function HomePage() {
  return (
    <div
      style={{
        padding: "0 100px",
      }}
    >
      <h1
        style={{
          textAlign: "center",
        }}
      >
        Products Review System
      </h1>
      <Row>
        <Col sm={7}>
          <Left />
        </Col>
        <Col sm={5}></Col>
      </Row>
    </div>
  );
}

export default HomePage;
