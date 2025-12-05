export const formatLargeNumber = (num: number): string => {
  if (num < 1000) {
    return `${num}`;
  }

  const k = num / 1000;
  if (k < 1000) {
    const formatted = k.toFixed(k < 10 ? 2 : k < 100 ? 1 : 0);
    return `${formatted.replace(/\.0+$/, "")} K`;
  }

  const m = k / 1000;
  if (m < 1000) {
    const formatted = m.toFixed(m < 10 ? 2 : m < 100 ? 1 : 0);
    return `${formatted.replace(/\.0+$/, "")} M`;
  }

  const b = m / 1000;
  const formatted = b.toFixed(b < 10 ? 2 : b < 100 ? 1 : 0);
  return `${formatted.replace(/\.0+$/, "")} B`;
};
