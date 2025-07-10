import { Button, Card } from "react-bootstrap";
import { useAppContext } from "../provider/AppProvider";
import ReviewForm from "./ReviewForm";

const Right = () => {
  const { productDetail } = useAppContext();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "end",
        height: "100%",
      }}
    >
      <Button as="a" href="/reviews" variant="success">
        Show Review List
      </Button>
      <Card
        style={{
          marginTop: "20px",
          width: "100%",
          height: "100%",
        }}
      >
        <h5
          style={{
            padding: "0 30px",
          }}
        >
          Reviews details:
        </h5>
        {productDetail ? (
          <div style={{ padding: "0 50px" }}>
            <p>ProductId: {productDetail.id}</p>
            <p>Title: {productDetail.title}</p>
            <p>Category: {productDetail.category}</p>
            <p
              style={{
                borderBottom: "1px solid #ccc",
                paddingBottom: "10px",
              }}
            >
              Price: {productDetail.price}
            </p>
            <ReviewForm />
          </div>
        ) : (
          <p
            style={{
              padding: "0 30px",
              color: "red",
            }}
          >
            Select a product to Review!
          </p>
        )}
      </Card>
    </div>
  );
};

export default Right;
