import { sanitizeObject } from "@/helpers/sanitizeObject";
import { positiveInt } from "./positiveInt";
import { isEmptyObject } from "@/helpers/isEmptyObject";

export const timeBounds = ({
  min_time,
  max_time,
}: {
  min_time: number | string | undefined;
  max_time: number | string | undefined;
}) => {
  const validated = sanitizeObject({
    min_time: min_time ? positiveInt(min_time.toString()) : (false as const),
    max_time: max_time ? positiveInt(max_time.toString()) : (false as const),
  });

  return isEmptyObject(validated) ? false : validated;
};
