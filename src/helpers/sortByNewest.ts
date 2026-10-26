/**
 * Returns a copy of the saved items sorted by `timestamp`, most recent first.
 * Does not mutate the original array.
 */
export const sortByNewest = <T extends { timestamp: number }>(
  items: T[],
): T[] => [...items].sort((a, b) => b.timestamp - a.timestamp);
