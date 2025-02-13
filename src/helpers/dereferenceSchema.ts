import type { JSONSchema7Definition } from "json-schema";

// PRIMITIVE DEFINITIONS
// https://github.com/stellar/js-stellar-sdk/blob/38115a16ed3fbc5d868ae8b1ab3042cf8a0c3399/src/contract/spec.ts#L99
type PrimitiveType =
  | "U32"
  | "I32"
  | "U64"
  | "I64"
  | "U128"
  | "I128"
  | "U256"
  | "I256";

type XdrSpecialType = "Address" | "ScString" | "ScSymbol" | "DataUrl";
type CustomXdrSpecType = PrimitiveType | XdrSpecialType;

export type DereferencedSchema = {
  properties: Record<
    string,
    JSONSchema7Definition & { specType?: CustomXdrSpecType }
  >;
  required: string[];
  additionalProperties: boolean;
};
/**
 * dereferences the schema for the given method name
 * @param fullSchema - the full schema
 * @param methodName - the method name
 * @returns the dereferenced schema
 */
export const getDereferenceSchema = (
  fullSchema: any,
  methodName: string,
): DereferencedSchema => {
  // Get the method schema
  const methodSchema = fullSchema.definitions[methodName];
  if (!methodSchema) {
    throw new Error(`Method ${methodName} not found in schema`);
  }

  // Get the args properties and required fields implemented under `argsAndRequired`
  // https://github.com/stellar/js-stellar-sdk/blob/38115a16ed3fbc5d868ae8b1ab3042cf8a0c3399/src/contract/spec.ts
  const argsProperties = methodSchema.properties.args.properties;
  const requiredFields = methodSchema.properties.args.required;

  // Helper function to resolve $ref
  function resolveRef(refPath: string): JSONSchema7Definition {
    return fullSchema.definitions[refPath];
  }

  // Process properties and resolve all $refs
  const properties: Record<
    string,
    JSONSchema7Definition & { specType?: CustomXdrSpecType }
  > = {};

  Object.entries(argsProperties).forEach(([key, value]: [string, any]) => {
    if (value.$ref) {
      const refPath = value.$ref.replace("#/definitions/", "");

      // refPath type is like `#/$defs/U32`
      // there are cases when array type is passed
      //       {
      //     "type": "array",
      //     "items": [
      //         {
      //             "$ref": "#/definitions/Address"
      //         },
      //         {
      //             "$ref": "#/definitions/Address"
      //         },
      //         {
      //             "$ref": "#/definitions/Address"
      //         },
      //         {
      //             "$ref": "#/definitions/Address"
      //         },
      //         {
      //             "type": "array",
      //             "items": {
      //                 "$ref": "#/definitions/Address"
      //             }
      //         }
      //     ],
      //     "minItems": 5,
      //     "maxItems": 5
      // }
      // or
      //   {
      //     "type": "array",
      //     "items": {
      //         "$ref": "#/definitions/Address"
      //     }
      // }
      properties[key] = resolveRef(refPath);
      properties[key].specType = refPath;
    } else {
      properties[key] = value;
    }
  });

  return {
    properties,
    required: requiredFields,
    additionalProperties: false,
  };
};
