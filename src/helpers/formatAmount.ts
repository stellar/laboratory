export const formatAmount = (amount: number) => {
  const formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 7,
  });

  return formatter.format(amount);
};
