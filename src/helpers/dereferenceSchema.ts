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
  const resolveSchemaRef = (schema: any, fullSchema: JSONSchema7) => {
    // primitive: { '$ref': '#/definitions/Address' }
    // array: { type: 'array', items: { '$ref': '#/definitions/Request' } }

    if (!schema.$ref) {
      return schema;
    }

    if (schema.$ref) {
      const refPath = schema.$ref.replace("#/definitions/", "");
      const refPathDef = fullSchema?.definitions?.[refPath] as JSONSchema7;

      // properties indicates that there is an array of objects
      // we need to recursively dereference properties
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
  };

  const dereferenceSchemaProps = (funcArgs: any) => {
    const resolvedProps: Record<string, any> = {};

    if (funcArgs.properties) {
      Object.entries(funcArgs.properties).forEach(([key, schema]) => {
        // `schema` can be either JSONSchema7Definition or false
        // parse the schema if it's an object

        if (typeof schema === "object" && schema !== null) {
          if ("$ref" in schema) {
            resolvedProps[key] = resolveSchemaRef(schema, fullSchema);
          }

          if ("items" in schema) {
            if (Array.isArray(schema.items)) {
              const items = schema.items.map((item) =>
                resolveSchemaRef(item, fullSchema),
              );
              resolvedProps[key] = {
                items: items,
                type: "array",
              };
            } else {
              resolvedProps[key] = {
                items: resolveSchemaRef(schema.items, fullSchema),
                type: "array",
              };
            }
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
