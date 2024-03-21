export const shortenStellarAddress = (address: string, size: number = 8) => {
  const slice = Math.ceil(size / 2);

  return `${address.substring(0, slice)}…${address.substring(
    address.length - slice,
  )}`;
};
