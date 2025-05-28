import { AnyObject } from "@/types/types";

export const setDeepValue = (
  obj: AnyObject,
  path: string,
  val: any,
): AnyObject => {
  const keys = parsePath(path);
  console.log("setDeepValue - input:", { obj, path, val, keys });

  function helper(current: any, idx: number): any {
    const key = keys[idx];

    // If it's the last key, set the value
    if (idx === keys.length - 1) {
      if (Array.isArray(current)) {
        const newArr = [...current];
        newArr[key as number] = val;
        return newArr;
      }
      return { ...current, [key]: val };
    }

    const nextKey = keys[idx + 1];

    if (Array.isArray(current)) {
      const index = key as number;
      // Create a new array with the same length as current, preserving existing values
      const newArr = [...current];
      // Only create new structure if the index doesn't exist or is undefined
      if (!newArr[index]) {
        newArr[index] = typeof nextKey === "number" ? [] : {};
      }
      const nextVal = helper(newArr[index], idx + 1);
      newArr[index] = nextVal;
      return newArr;
    }

    return {
      ...current,
      [key]: helper(
        current?.[key] ?? (typeof nextKey === "number" ? [] : {}),
        idx + 1,
      ),
    };
  }

  return helper(obj, 0);
};

export const getNestedItemLabel = (path: string): string => {
  console.log("[getNestedItemLabel] path: ", path);
  const keys = parsePath(path);
  // keys = [0];
  // keys = [
  //   "addresses",
  //   0,
  // ];
  console.log("[getNestedItemLabel] keys: ", keys);
  return keys[keys.length - 1] ? keys[keys.length - 1].toString() : "";
};

const parsePath = (path: string): (string | number)[] => {
  return path.split(".").map((key) => {
    const parsed = Number(key);

    return isNaN(parsed) ? key : parsed;
  });
};
