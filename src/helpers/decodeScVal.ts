import { scValToNative, xdr } from "@stellar/stellar-sdk";

export const decodeScVal = (xdrString: string) => {
  try {
    const scv = xdr.ScVal.fromXDR(xdrString, "base64");
    return scValToNative(scv);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return null;
  }
};
