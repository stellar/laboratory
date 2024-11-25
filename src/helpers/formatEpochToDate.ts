export const formatEpochToDate = (epoch: number) => {
  try {
    const date = new Date(epoch * 1000);
    const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hourCycle: "h24",
      timeZone: "utc",
      timeZoneName: "short",
    });

    return dateTimeFormatter.format(date);
  } catch (e) {
    return null;
  }
};
