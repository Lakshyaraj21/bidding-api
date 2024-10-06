export const convertToISO8601 = (dateTimeString) => {
  const [datePart, timePart] = dateTimeString.split(" ");
  const [year, month, day] = datePart.split("/");
  const [hours, minutes] = timePart.split(":");

  const isoDateTimeString = new Date(
    year,
    month - 1,
    day,
    hours,
    minutes,
  ).toISOString();
  return isoDateTimeString;
};
