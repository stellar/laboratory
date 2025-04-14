function formatDate(date: Date): string {
  const formatter = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour12: true,
    hour: "numeric",
    minute: "numeric",
  });
  return formatter.format(date);
}

export function Time({ timestamp }: { timestamp: number }) {
  const date = new Date(timestamp * 1000);
  return <time title={date.toISOString()}>{formatDate(date)}</time>;
}
