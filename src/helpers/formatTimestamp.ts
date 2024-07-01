export const formatTimestamp = (timestamp: number) => {
  const date = new Date(timestamp);
  const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "utc",
    timeZoneName: "short",
  });

  return dateTimeFormatter.format(date);
};
