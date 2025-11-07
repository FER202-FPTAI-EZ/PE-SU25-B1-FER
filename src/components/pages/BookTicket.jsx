import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
} from "react-bootstrap";
import { instance } from "../../lib/axios";

const BookTicket = () => {
  const [movies, setMovies] = useState(null);
  const [showtimes, setShowtimes] = useState(null);
  const [theaters, setTheaters] = useState(null);
  const [userId, setUserId] = useState("");
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [selectedShowtimeId, setSelectedShowtimeId] = useState(null);
  const [tickets, setTickets] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);

  const fetchMovies = async () => {
    await instance.get("/movies").then(({ data }) => {
      setMovies(data);
    });
  };

  const fetchShowtimesByMovieId = async (movieId) => {
    await instance.get(`/showtimes?movieId=${movieId}`).then(({ data }) => {
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

  const fetchTickets = async () => {
    if (!selectedShowtimeId) return;

    await instance
      .get(`/tickets?showtimeId=${selectedShowtimeId}`)
      .then(({ data }) => {
        setTickets(data);
      });
  };

  useEffect(() => {
    fetchMovies();
    fetchTheaters();
    fetchTickets();
  }, []);

  useEffect(() => {
    if (selectedMovieId) {
      fetchShowtimesByMovieId(selectedMovieId);
    }
  }, [selectedMovieId]);

  const getShowtimeTitle = (showtime) => {
    return `${theaters[showtime.theaterId]} - ${
      showtime.room
    } - ${getDateFormated(showtime.startTime)}`;
  };

  const getDateFormated = (d) => {
    const date = new Date(d);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");

    const formattedDate = `${month}/${day}/${year} ${hour}:${minute}`;
    return formattedDate;
  };

  const isAvailableSeat = (showtimeId) => {
    const showtime = showtimes.find((st) => st.id === showtimeId);
    return !showtime?.seats?.every((seat) => seat.status === "booked");
  };

  const handleSubmit = async () => {
    if (!userId || !selectedShowtimeId || selectedSeats.length === 0) return;

    const totalPrice = selectedSeats.reduce((acc, seat) => {
      return acc + seat.price - seat.discount;
    }, 0);

    const payload = {
      userId,
      showtimeId: selectedShowtimeId,
      seats: selectedSeats,
      totalPrice,
      bookingTime: new Date().toISOString(),
    };

    await instance.post("/tickets", payload);
    await instance.patch(`/showtimes/${selectedShowtimeId}`, {
      seats: showtimes
        .find((st) => st.id === selectedShowtimeId)
        .seats.map((seat) => {
          const selectedSeat = selectedSeats.find(
            (s) => s.seatNumber === seat.seatNumber
          );
          return {
            ...seat,
            status: selectedSeat ? "booked" : seat.status,
          };
        }),
    });

    await fetchShowtimesByMovieId(selectedMovieId);
  };

  useEffect(() => {
    console.log({ selectedSeats });
  }, [selectedSeats]);

  return (
    <Container>
      <h1
        style={{
          textAlign: "center",
        }}
      >
        Book a Ticket
      </h1>

      <Card
        style={{
          marginTop: "20px",
        }}
      >
        <Card.Body>
          <Row>
            <Col md={6} style={{}}>
              <label>User ID</label>
              <Form.Control
                type="text"
                placeholder="Enter user Id (e.g., id)"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
            </Col>
            <Col md={6}>
              <label>Select Movie</label>
              <Form.Select
                value={selectedMovieId}
                onChange={(e) => {
                  if (e.target.value !== "none") {
                    setSelectedMovieId(e.target.value);
                  }
                }}
              >
                <option value={"none"}>Choose a movie</option>
                {movies?.map((movie) => (
                  <option key={movie.id} value={movie.id}>
                    {movie.title}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>
          {selectedMovieId && (
            <Row>
              <Col md={12} style={{ marginTop: "10px" }}>
                <label>Select Showtime</label>
                <Form.Select
                  value={selectedShowtimeId}
                  onChange={(e) => {
                    if (e.target.value !== "none") {
                      setSelectedShowtimeId(e.target.value);
                    }
                  }}
                >
                  <option value={"none"}>Choose a showtime</option>
                  {showtimes?.map((st) => (
                    <option key={st.id} value={st.id}>
                      {getShowtimeTitle(st)}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Row>
          )}
          {selectedShowtimeId && (
            <Row>
              {!isAvailableSeat(selectedShowtimeId) ? (
                <Alert variant="warning" style={{ marginTop: "10px" }}>
                  No seats available for the selected showtime.
                </Alert>
              ) : (
                <Row style={{ marginTop: "10px" }}>
                  {showtimes
                    ?.find((st) => st.id === selectedShowtimeId)
                    .seats.filter((seat) => seat.status === "available")
                    .map((seat) => (
                      <Col md={6} key={seat.seatNumber}>
                        <Form.Check
                          type="checkbox"
                          label={`${seat.seatNumber}`}
                          value={seat.seatNumber}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedSeats([
                                ...selectedSeats,
                                {
                                  seatNumber: seat.seatNumber,
                                  price: 0,
                                  type: null,
                                  discount: 0,
                                },
                              ]);
                            } else {
                              setSelectedSeats(
                                selectedSeats.filter(
                                  (s) => s.seatNumber !== seat.seatNumber
                                )
                              );
                            }
                          }}
                        />
                        {selectedSeats.find(
                          (s) => s.seatNumber === seat.seatNumber
                        ) && (
                          <div>
                            <Form.Select
                              onChange={(e) => {
                                const seatType = e.target.value;
                                const price = seatType === "adult" ? 12 : 8;

                                setSelectedSeats(
                                  selectedSeats.map((s) => {
                                    if (s.seatNumber === seat.seatNumber) {
                                      return { ...s, type: seatType, price };
                                    }
                                    return s;
                                  })
                                );
                              }}
                            >
                              <option value={"none"}>Choose a seat type</option>
                              <option value={"adult"}>Adult ($12)</option>
                              <option value={"child"}>Child ($8)</option>
                            </Form.Select>
                            <Form.Control
                              type="number"
                              style={{ marginTop: "5px" }}
                              defaultValue={0}
                              onChange={(e) => {
                                setSelectedSeats(
                                  selectedSeats.map((s) => {
                                    if (s.seatNumber === seat.seatNumber) {
                                      return {
                                        ...s,
                                        discount: Number(e.target.value),
                                      };
                                    }
                                    return s;
                                  })
                                );
                              }}
                            />
                          </div>
                        )}
                      </Col>
                    ))}
                </Row>
              )}
            </Row>
          )}
          <Row>
            <Col md={6} style={{ marginTop: "10px" }}>
              <Button onClick={handleSubmit}>Book Ticket</Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default BookTicket;
