export const formatAmount = (amount: number | bigint, precision?: number) => {
  const formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: precision || 1,
    maximumFractionDigits: precision || 7,
  });

  return formatter.format(amount);
};
