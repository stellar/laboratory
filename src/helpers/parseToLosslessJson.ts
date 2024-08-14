import { parse, isNumber } from "lossless-json";
import { AnyObject } from "@/types/types";

export const parseToLosslessJson = (stringObj: string) => {
  return parse(stringObj, null, (value) => {
    if (isNumber(value)) {
      return BigInt(value);
    }

    return value;
  }) as AnyObject;
};
