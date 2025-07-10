import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { instance } from "../lib/axios";
import { useAppContext } from "../provider/AppProvider";

const ReviewForm = () => {
  const { productDetail, setProducts } = useAppContext();

  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [error, setError] = useState({
    name: "",
    comment: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async () => {
    setError({
      name: name ? "" : "Name is required",
      comment: comment ? "" : "Comment is required",
    });

    if (!name || !comment) return;

    const newProduct = {
      ...productDetail,
      reviews: [
        ...productDetail.reviews,
        {
          reviewerName: name,
          comment,
          rating: parseInt(rating),
          date: new Date().toISOString(),
        },
      ],
    };
    await instance.put(`/products/${productDetail.id}`, newProduct);

    setProducts((prev) =>
      prev.map((product) =>
        product.id === productDetail.id ? newProduct : product
      )
    );

    setName("");
    setComment("");
    setRating(5);
    setIsSubmitted(true);
  };

  useEffect(() => {
    setIsSubmitted(false);
    setName("");
    setComment("");
    setRating(5);
  }, [productDetail]);

  if (isSubmitted)
    return (
      <h1
        style={{
          textAlign: "center",
          color: "green",
        }}
      >
        Thanks for your review!
      </h1>
    );

  return (
    <div>
      <h5>Add a new Review</h5>
      <Form.Group style={{ marginBottom: "15px" }}>
        <Form.Label>Reviewer Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter Reviewer's name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {error.name && <div style={{ color: "red" }}>{error.name}</div>}
      </Form.Group>
      <Form.Group style={{ marginBottom: "15px" }}>
        <Form.Label>Comment</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Enter comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        {error.comment && <div style={{ color: "red" }}>{error.comment}</div>}
      </Form.Group>
      <Form.Group style={{ marginBottom: "15px" }}>
        <Form.Label>Rating</Form.Label>
        {[1, 2, 3, 4, 5].map((star) => (
          <div style={{ display: "inline-block", margin: "0 10px" }} key={star}>
            <input
              type="radio"
              name="rating"
              value={star}
              id={`star-${star}`}
              checked={rating === star}
              onChange={() => setRating(star)}
            />
            <label htmlFor={`star-${star}`}>{star}</label>
          </div>
        ))}
      </Form.Group>
      <Button
        variant="warning"
        style={{
          fontWeight: "bold",
        }}
        onClick={handleSubmit}
      >
        Send Review
      </Button>
    </div>
  );
};

export default ReviewForm;
