export const formatNumber = (num: number | bigint) =>
  new Intl.NumberFormat("en-US").format(num);
