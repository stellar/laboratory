import { formatTimestamp } from "@/helpers/formatTimestamp";

export function Time({ timestamp }: { timestamp: number }) {
  timestamp = timestamp * 1000;
  const date = new Date(timestamp);
  return <time title={date.toISOString()}>{formatTimestamp(timestamp)}</time>;
}
