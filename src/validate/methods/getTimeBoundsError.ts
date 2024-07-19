import { getPositiveIntError } from "./getPositiveIntError";
import { sanitizeObject } from "@/helpers/sanitizeObject";
import { isEmptyObject } from "@/helpers/isEmptyObject";
import { TimeBoundsValue } from "@/types/types";

export const getTimeBoundsError = ({ min_time, max_time }: TimeBoundsValue) => {
  const validated = sanitizeObject({
    min_time: min_time
      ? getPositiveIntError(min_time.toString())
      : (false as const),
    max_time: max_time
      ? getPositiveIntError(max_time.toString())
      : (false as const),
  });

  return isEmptyObject(validated) ? false : validated;
};
