import { Button, Card, Col, FormSelect, ListGroup, Row } from "react-bootstrap";
import { useAppContext } from "../provider/AppProvider";
import { useState } from "react";

const calculateAverageRate = (reviews) => {
  const total = reviews.reduce((acc, review) => acc + review.rating, 0);
  return (total / reviews.length).toFixed(1);
};

const Left = () => {
  const { products } = useAppContext();
  const [chosenCategory, setChosenCategory] = useState("all");

  if (!products) return;

  const filteredProducts = products.filter(
    (product) => chosenCategory === "all" || product.category === chosenCategory
  );

  return (
    <div>
      <FormSelect
        style={{
          width: "300px",
        }}
        defaultValue={"all"}
        onChange={(e) => setChosenCategory(e.target.value)}
      >
        <option value="all">All</option>
        <option value="fragrances">Fragrances</option>
        <option value="beauty">Beauty</option>
      </FormSelect>
      <Row
        style={{
          marginTop: "20px",
          rowGap: "20px",
        }}
      >
        {filteredProducts?.map((product, index) => (
          <Col sm={4} key={index}>
            <Card>
              <Card.Body>
                <h4>{product.title}</h4>
                <ListGroup variant="flush">
                  <ListGroup.Item>Price: {product.price}</ListGroup.Item>
                  <ListGroup.Item>Category: {product.category}</ListGroup.Item>
                  <ListGroup.Item
                    style={{
                      fontWeight: "bold",
                    }}
                  >
                    Average Rate: {calculateAverageRate(product.reviews)}
                  </ListGroup.Item>
                </ListGroup>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Button>Add New Review</Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Left;
