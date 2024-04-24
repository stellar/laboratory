import { positiveInt } from "./positiveInt";
import { sanitizeObject } from "@/helpers/sanitizeObject";
import { isEmptyObject } from "@/helpers/isEmptyObject";
import { TimeBoundsValue } from "@/types/types";

export const timeBounds = ({ min_time, max_time }: TimeBoundsValue) => {
  const validated = sanitizeObject({
    min_time: min_time ? positiveInt(min_time.toString()) : (false as const),
    max_time: max_time ? positiveInt(max_time.toString()) : (false as const),
  });

  return isEmptyObject(validated) ? false : validated;
};
