const DateFormat = ({ d }) => {
  const date = new Date(d);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");

  const formattedDate = `${month}/${day}/${year} ${hour}:${minute}`;
  return <div>{formattedDate}</div>;
};

export default DateFormat;
