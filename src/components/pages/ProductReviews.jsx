import { useAppContext } from "../../provider/AppProvider";

const ProductReviews = () => {
  const { products } = useAppContext();

  return (
    <div
      style={{
        padding: "0 100px",
      }}
    >
      <h1>List of Reviews</h1>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">ProductID</th>
            <th scope="col">Title</th>
            <th scope="col">Reviews</th>
          </tr>
        </thead>
        <tbody>
          {products?.map((product) => (
            <tr key={product.id}>
              <td
                style={{
                  width: "100px",
                  verticalAlign: "middle",
                }}
              >
                {product.id}
              </td>
              <td
                style={{
                  width: "300px",
                  verticalAlign: "middle",
                }}
              >
                {/* {product.title} */}
                <img
                  style={{
                    width: "200px",
                  }}
                  src="https://random-image-pepebigotes.vercel.app/api/random-image"
                />
              </td>
              <td>
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Date</th>
                      <th scope="col">Reviewer</th>
                      <th scope="col">Comment</th>
                      <th scope="col">Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.reviews?.map((review) => (
                      <tr key={review.id}>
                        <td
                          style={{
                            width: "300px",
                          }}
                        >
                          {new Date(review.date).toLocaleDateString()}
                        </td>
                        <td
                          style={{
                            width: "300px",
                          }}
                        >
                          {review.reviewer}
                        </td>
                        <td>{review.comment}</td>
                        <td
                          style={{
                            width: "100px",
                          }}
                        >
                          {review.rating}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductReviews;
