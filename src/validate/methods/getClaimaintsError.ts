import { isEmptyObject } from "@/helpers/isEmptyObject";
import { sanitizeObject } from "@/helpers/sanitizeObject";
import { sanitizeArray } from "@/helpers/sanitizeArray";
import { AnyObject } from "@/types/types";

import { getPublicKeyError } from "./getPublicKeyError";
import { getPositiveIntError } from "./getPositiveIntError";

export const getClaimaintsError = (val: AnyObject[]) => {
  if (!val || val.length === 0) {
    return false;
  }

  const invalid: (AnyObject | undefined)[] = [];

  val.forEach((claimant) => {
    const validate = {
      destination: claimant.destination
        ? getPublicKeyError(claimant.destination)
        : false,
      predicate:
        claimant.predicate && !isEmptyObject(claimant.predicate)
          ? validatePredicate(claimant.predicate)
          : false,
    };

    const sanitized = sanitizeObject(validate);

    invalid.push(isEmptyObject(sanitized) ? undefined : sanitized);
  });

  const sanitized = sanitizeArray(invalid);

  if (sanitized.length === 0) {
    return false;
  }

  return invalid.length > 0 ? invalid : false;
};

const validatePredicate = (predicate: AnyObject) => {
  const valid = validateEntry(predicate, {});

  return isEmptyObject(valid) ? undefined : valid;
};

const validateEntry = (
  entry: AnyObject,
  result: { [path: string]: string },
  parent?: string,
): AnyObject => {
  Object.entries(entry).forEach((entry) => {
    const [key, value] = entry;
    const path = parent ? `${parent}.${key}` : key;

    if (typeof value === "string") {
      const invalid = getPositiveIntError(value);

      if (invalid) {
        result[path] = invalid;
      }
    } else if (Array.isArray(value)) {
      value.forEach((v, idx) => validateEntry(v, result, `${path}[${idx}]`));
    } else if (typeof value === "object") {
      if (!isEmptyObject(value)) {
        validateEntry(value, result, path);
      }
    }
  });

  return result;
};
