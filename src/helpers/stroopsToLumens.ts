import { BigNumber } from "bignumber.js";

export const stroopsToLumens = (stroops: string) => {
  if (!stroops) {
    return "";
  }

  return new BigNumber(stroops).dividedBy(1e7).toFixed();
};
