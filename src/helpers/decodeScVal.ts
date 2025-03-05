import { scValToNative, xdr } from "@stellar/stellar-sdk";

export const decodeScVal = (xdrString: string) => {
  try {
    const scv = xdr.ScVal.fromXDR(xdrString, "base64");
    return scValToNative(scv);
  } catch (e) {
    return null;
  }
};
