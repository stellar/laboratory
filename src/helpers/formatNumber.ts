export const formatNumber = (num: number) =>
  new Intl.NumberFormat("en-US").format(num);
