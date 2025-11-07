import { useEffect, useState } from "react";
import { instance } from "../../lib/axios";
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Row,
  Table,
} from "react-bootstrap";
import DateFormat from "../DateFormat";

const MovieList = () => {
  const [movies, setMovies] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const fetchMovies = async () => {
    await instance.get("/movies").then(({ data }) => {
      setMovies(data);
    });
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    console.log({ movies });
  }, [movies]);

  return (
    <Container>
      <h1
        style={{
          textAlign: "center",
        }}
      >
        Movies
      </h1>
      <Row>
        {movies?.map((movie) => (
          <Col key={movie.id}>
            <Card>
              <Card.Body>
                <Card.Title>{movie.title}</Card.Title>
                <Card.Text>Duration: {movie.duration} minutes</Card.Text>
                <Card.Text>Director: {movie.details.director}</Card.Text>
                <Card.Text>Rating: {movie.details.rating.score}</Card.Text>
                <Button
                  variant="primary"
                  onClick={() => setSelectedMovie(movie)}
                >
                  View Showtimes
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      {selectedMovie && <ShowTimes movie={selectedMovie} />}
    </Container>
  );
};

const ShowTimes = ({ movie }) => {
  const [showtimes, setShowtimes] = useState(null);
  const [theaters, setTheaters] = useState(null);

  const fetchShowtimes = async () => {
    await instance.get(`/showtimes?movieId=${movie.id}`).then(({ data }) => {
      setShowtimes(data);
    });
  };

  const fetchTheaters = async () => {
    await instance.get(`/theaters`).then(({ data }) => {
      const theaterMap = data.reduce((acc, theater) => {
        acc[theater.id] = theater.name;
        return acc;
      }, {});

      setTheaters(theaterMap);
    });
  };

  useEffect(() => {
    fetchShowtimes();
    fetchTheaters();
  }, [movie]);

  if (!showtimes?.length) {
    return (
      <Alert variant="info" style={{ marginTop: "40px" }}>
        No showtimes found for this movie.
      </Alert>
    );
  }

  return (
    <div
      style={{
        marginTop: "40px",
      }}
    >
      <h3>Showtimes: {movie.title}</h3>
      <Table striped bordered>
        <thead>
          <tr>
            <th>Theater</th>
            <th>Start Time</th>
            <th>Room</th>
            <th>Available Seats</th>
          </tr>
        </thead>
        <tbody>
          {showtimes?.map((showtime) => (
            <tr key={showtime.id}>
              <td>{theaters?.[showtime.theaterId]}</td>
              <td>
                <DateFormat d={showtime.startTime} />
              </td>
              <td>{showtime.room}</td>
              <td>
                {showtime.seats.every((seat) => seat.status === "booked") ? (
                  <span>None</span>
                ) : (
                  showtime.seats
                    .filter((seat) => seat.status === "available")
                    .map((seat) => seat.seatNumber)
                    .join(", ")
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default MovieList;
