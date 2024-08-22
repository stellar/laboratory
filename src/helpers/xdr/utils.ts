// XDR helpers from js-stellar-base
import { xdr } from "@stellar/stellar-sdk";
import BigNumber from "bignumber.js";
import { best_r } from "./fraction";

const ONE = 10000000;

function toXDRAmount(value: string) {
  // Using BigNumber to handle decimal point values
  return BigInt(new BigNumber(value).times(ONE).toString());
}

function fromXDRAmount(value: string) {
  return new BigNumber(value).div(ONE).toFixed(7);
}

function toXDRPrice(price: string) {
  const approx = best_r(price);

  return {
    n: parseInt(approx[0].toString(), 10),
    d: parseInt(approx[1].toString(), 10),
  };
}

function fromXDRPrice(price: xdr.Price) {
  const n = new BigNumber(price.n());
  return n.div(new BigNumber(price.d())).toString();
}

export const xdrUtils = {
  toAmount: toXDRAmount,
  fromAmount: fromXDRAmount,
  toPrice: toXDRPrice,
  fromPrice: fromXDRPrice,
};
