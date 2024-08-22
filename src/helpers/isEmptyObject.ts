import { AnyObject } from "@/types/types";

export const isEmptyObject = (obj: AnyObject) => {
  return Object.keys(obj).length === 0;
};
