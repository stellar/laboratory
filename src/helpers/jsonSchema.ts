import type { JSONSchema7 } from "json-schema";

import type { AnyObject, ScValPrimitiveType } from "@/types/types";

/**
 * For a path like 'requests.1.request_type':
 *
 * obj = {
 *   requests: [
 *     { address: "", amount: "", request_type: "" },
 *     { address: "", amount: "", request_type: "" }
 *   ]
 * }
 *
 * path = "requests.1.request_type"
 * val = e.target.value
 *
 * This will update the value of requests[1].request_type
 */
// const setDeepValue = (obj: AnyObject, path: string, val: any): AnyObject => {
//     const newObj = JSON.parse(JSON.stringify(obj));
//     return set(newObj, path, val);
// }

const isTaggedUnion = (schema: JSONSchema7): boolean => {
  return Boolean(
    schema.properties?.tag &&
      schema.properties?.values &&
      schema.required?.includes("tag") &&
      schema.required?.includes("values"),
  );
};

const setDeepValue = (obj: AnyObject, path: string, val: any): AnyObject => {
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

const getNestedItemLabel = (path: string): string => {
  const keys = parsePath(path);

  return keys[keys.length - 1] ? keys[keys.length - 1].toString() : "";
};

const parsePath = (path: string): (string | number)[] =>
  path.split(".").map((key) => {
    const parsed = Number(key);

    return isNaN(parsed) ? key : parsed;
  });

const getSchemaType = (prop: any) => {
  if (!prop) return undefined;

  if (prop.$ref) {
    return prop.$ref.replace("#/definitions/", "");
  }

  if (prop.oneOf) {
    return "oneOf";
  }

  return prop.type;
};

const isSchemaObject = (schema: any): schema is JSONSchema7 =>
  schema && typeof schema === "object" && !Array.isArray(schema);

const getSchemaItems = (schema: any) => {
  if (schema.items && typeof schema.items !== "boolean") {
    if (schema.items.properties) {
      return schema.items.properties;
    }
    return schema.items;
  }
  return {};
};

const getSchemaProperty = (
  schema: any,
  key: string,
): JSONSchema7 | undefined => {
  if (!isSchemaObject(schema) || !schema.properties) return undefined;
  const prop = schema.properties[key];
  return isSchemaObject(prop) ? prop : undefined;
};

// const getStoredNestedItems = (parsedSorobanOperation: any, path: string) => {
//   const rootKeyName = Object.keys(parsedSorobanOperation.args)[0];
//   return get(parsedSorobanOperation.args[rootKeyName], path.join(".")) || [];
// };

const isTuple = (schema: any) => {
  return schema.type === "array" && Array.isArray(schema.items);
};

const hasAnyValidationPassed = (errors: (string | false)[]): boolean =>
  errors.some((error) => error === false);

const deleteNestedItemError = (
  nestedKey: string[],
  formError: AnyObject,
  nameIndex: string,
) => {
  const newFormError = { ...formError };

  for (const item of nestedKey) {
    const deletedPath = [nameIndex, item].join(".");
    delete newFormError[deletedPath];
  }

  return newFormError;
};

export const jsonSchema = {
  setDeepValue,
  isSchemaObject,
  //   getStoredNestedItems,
  getNestedItemLabel,
  getSchemaType,
  getSchemaItems,
  getSchemaProperty,
  isTuple,
  isTaggedUnion,
  hasAnyValidationPassed,
  deleteNestedItemError,
};
