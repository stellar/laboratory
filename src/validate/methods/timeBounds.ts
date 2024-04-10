import { positiveInt } from "./positiveInt";

export const timeBounds = ({
  min,
  max,
}: {
  min: string;
  max: string;
}): { min: string | false; max: string | false } => {
  return { min: positiveInt(min), max: positiveInt(max) };
};
