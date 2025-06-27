import { BigNumber } from "bignumber.js";

export const stroopsToLumens = (stroops: string) => {
  return new BigNumber(Number(stroops) / 1e7).toString();
};
