import { isEmptyObject } from "@/helpers/isEmptyObject";
import { AnyObject } from "@/types/types";

/**
 * Sanitize an object by removing falsy values (including 0).
 */
export const sanitizeObject = <T extends AnyObject>(
  obj: T,
  noEmptyObj = false,
) => {
  return Object.keys(obj).reduce((res, param) => {
    const paramValue = obj[param];

    const emptyObj = noEmptyObj && isEmptyObject(paramValue);

    if (paramValue && !emptyObj) {
      return { ...res, [param]: paramValue };
    }

    return res;
  }, {} as T);
};
