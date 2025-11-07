import { Col, Row } from "react-bootstrap";
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
        <Col sm={8}></Col>
        <Col sm={4}></Col>
      </Row>
    </div>
  );
}

export default HomePage;
