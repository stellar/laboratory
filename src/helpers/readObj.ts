import { AnyObject } from "@/types/types";
import { xdr } from "@stellar/stellar-sdk";

export const readObj = (args: AnyObject, input: xdr.ScSpecFunctionInputV0) => {
  const inputName = input.name().toString();
  const entry = Object.entries(args).find(([name]) => name === inputName);
  if (!entry) {
    throw new Error(`Missing field ${inputName}`);
  }
  return entry[1];
};
