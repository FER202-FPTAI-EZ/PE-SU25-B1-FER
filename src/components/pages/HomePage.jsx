import { Col, Row } from "react-bootstrap";
import Left from "../Left";
import Right from "../Right";

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
        <Col sm={8}>
          <Left />
        </Col>
        <Col sm={4}>
          <Right />
        </Col>
      </Row>
    </div>
  );
}

export default HomePage;
