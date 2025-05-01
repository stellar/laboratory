// https://jsonforms.io/api/core/interfaces/jsonschema7.html
import type { JSONSchema7 } from "json-schema";
import type { DereferencedSchemaType } from "@/constants/jsonSchema";

/**
 * dereferences the schema for the given method name
 * @param fullSchema - the full schema
 * @param methodName - the method name
 * @returns the dereferenced schema
 */
export const dereferenceSchema = (
  fullSchema: JSONSchema7,
  methodName: string,
): DereferencedSchemaType => {
  if (!fullSchema || !fullSchema.definitions) {
    throw new Error("Full schema is required");
  }
  // Get the method schema
  const methodSchema = fullSchema.definitions[methodName];

  if (!methodSchema || typeof methodSchema === "boolean") {
    throw new Error(`Method ${methodName} not found in schema`);
  }
  const methodSchemaObj = methodSchema as JSONSchema7;

  // Get the args properties and required fields implemented under `argsAndRequired`
  // https://github.com/stellar/js-stellar-sdk/blob/38115a16ed3fbc5d868ae8b1ab3042cf8a0c3399/src/contract/spec.ts
  const argsProperties = methodSchemaObj.properties?.args as JSONSchema7;
  const requiredFields = argsProperties?.required ?? [];

  // Good example contract: CDVQVKOY2YSXS2IC7KN6MNASSHPAO7UN2UR2ON4OI2SKMFJNVAMDX6DP
  // "submit", "queue_set_reserve" function
  const resolveRef = (val: any, fullSchema: JSONSchema7) => {
    // primitive: { '$ref': '#/definitions/Address' }
    // array: { type: 'array', items: { '$ref': '#/definitions/Request' } }

    const ref = val.$ref;

    if (ref) {
      // console.log("ref", ref);
      // would output something like
      // "Address"  if it's a primitive
      const refPath = ref.replace("#/definitions/", "");

      // console.log("refPath", refPath);

      const refPathDef = fullSchema?.definitions?.[refPath] as JSONSchema7;

      // console.log("refPathDef", refPathDef);

      //   {
      //     "type": "array",
      //     "items": {
      //         "$ref": "#/definitions/Request"
      //     }
      // }
      // ref: #/definitions/Request
      // refPath: Request
      // refPathDef: {
      //     "description": "A request a user makes against the pool",
      //     "properties": {
      //         "address": {
      //             "$ref": "#/definitions/Address"
      //         },
      //         "amount": {
      //             "$ref": "#/definitions/I128"
      //         },
      //         "request_type": {
      //             "$ref": "#/definitions/U32"
      //         },
      //         "additionalProperties": false
      //     },
      //     "required": [
      //         "address",
      //         "amount",
      //         "request_type"
      //     ],
      //     "type": "object"
      // }

      // value: {
      //     "type": "array",
      //     "items": {
      //         "$ref": "#/definitions/Address"
      //     }
      // }
      // ref: #/definitions/Address
      // refPath: Address
      // refPathDef: {
      //     "type": "string",
      //     "format": "address",
      //     "description": "Address can be a public key or contract id"
      // }

      // if the refPathDef has properties aka is an array
      // we need to recursively dereference the properties
      if (refPathDef?.properties) {
        return {
          properties: dereferenceSchemaProps(
            fullSchema?.definitions?.[refPath],
          ),
          type: refPathDef?.type,
          description: refPathDef?.description,
          required: refPathDef?.required,
          additionalProperties: refPathDef?.additionalProperties ?? false,
        };
      }

      return {
        type: refPath,
        description: refPathDef?.description ?? false,
      };
    }

    return val;
  };

  const dereferenceSchemaProps = (funcArgs: any) => {
    const resolvedProps: Record<string, any> = {};

    // console.log("funcArgs", funcArgs);
    if (funcArgs.properties) {
      Object.entries(funcArgs.properties).forEach(([key, value]) => {
        // `value` can be either JSONSchema7Definition or false
        // parse the value if it's an object

        if (typeof value === "object" && value !== null) {
          if ("$ref" in value) {
            resolvedProps[key] = resolveRef(value, fullSchema);
          }
          if ("items" in value) {
            // console.log(
            //   "resolveRef(value.items, fullSchema)",
            //   resolveRef(value.items, fullSchema),
            // );

            resolvedProps[key] = {
              items: resolveRef(value.items, fullSchema),
              type: "array",
            };

            // console.log("resolvedProps", resolvedProps);
          }
        }
      });
    }

    return resolvedProps;
  };

  return {
    name: methodName,
    description: methodSchemaObj.description ?? "",
    properties: dereferenceSchemaProps(argsProperties),
    required: requiredFields,
    additionalProperties: methodSchemaObj.additionalProperties ?? false,
    type: "object",
  };
};
