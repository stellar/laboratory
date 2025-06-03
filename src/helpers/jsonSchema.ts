import type { JSONSchema7 } from "json-schema";

import type { AnyObject, ScValPrimitiveType } from "@/types/types";
import { set } from "lodash";

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
const setDeepValue = (obj: AnyObject, path: string, val: any): AnyObject => {
  const newObj = JSON.parse(JSON.stringify(obj));
  return set(newObj, path, val);
};

const isTaggedUnion = (schema: JSONSchema7): boolean => {
  return Boolean(
    schema.properties?.tag &&
      schema.properties?.values &&
      schema.required?.includes("tag") &&
      schema.required?.includes("values"),
  );
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
  getNestedItemLabel,
  getSchemaType,
  getSchemaItems,
  getSchemaProperty,
  isTuple,
  isTaggedUnion,
  hasAnyValidationPassed,
  deleteNestedItemError,
};
