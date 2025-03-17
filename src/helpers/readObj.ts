import { AnyObject } from "@/types/types";
import { xdr } from "@stellar/stellar-sdk";

export const readObj = (args: AnyObject, input: xdr.ScSpecFunctionInputV0) => {
  let inputName = input.name().toString();
  let entry = Object.entries(args).find(([name, _]) => name === inputName);
  if (!entry) {
    throw new Error(`Missing field ${inputName}`);
  }
  return entry[1];
};
