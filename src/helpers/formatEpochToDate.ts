export const formatEpochToDate = (
  epoch: number,
  format: "short" | "long" = "long",
) => {
  try {
    const date = new Date(epoch * 1000);

    const dateOptions: Intl.DateTimeFormatOptions =
      format === "short"
        ? {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
          }
        : { weekday: "short", month: "short", day: "numeric", year: "numeric" };

    const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
      ...dateOptions,
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hourCycle: "h24",
      timeZone: "utc",
      timeZoneName: "short",
    });

    return dateTimeFormatter.format(date);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return null;
  }
};
