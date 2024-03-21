import { AnyObject } from "@/types/types";

export const sanitizeObject = <T extends AnyObject>(obj: T) => {
  return Object.keys(obj).reduce((res, param) => {
    const paramValue = obj[param];

    if (paramValue) {
      return { ...res, [param]: paramValue };
    }

    return res;
  }, {} as T);
};
