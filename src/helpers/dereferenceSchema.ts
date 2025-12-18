// https://jsonforms.io/api/core/interfaces/jsonschema7.html
import type { JSONSchema7 } from "json-schema";
import type { DereferencedSchemaType } from "@/constants/jsonSchema";
import type { ScValPrimitiveType } from "@/types/types";

const resolveNestedSchema = (schema: any, fullSchema: JSONSchema7): any => {
  if (!schema) return schema;

  if (typeof schema !== "object") return schema;

  if (Array.isArray(schema)) {
    return schema.map((item) => resolveNestedSchema(item, fullSchema));
  }

  if (schema.$ref) {
    const refPath = schema.$ref.replace("#/definitions/", "");
    const refSchema = fullSchema?.definitions?.[refPath];

    if (!refSchema || typeof refSchema === "boolean") return schema;

    // we want to keep primitive types as is to use it in nativeToScVal function later
    const isScPrimitive = [
      "U32",
      "U64",
      "U128",
      "U256",
      "I32",
      "I64",
      "I128",
      "I256",
      "Address",
      "MuxedAddress",
      "ScString",
      "ScSymbol",
      "DataUrl",
      "Bool",
    ] as ScValPrimitiveType[];

    const finalSchema = isScPrimitive.includes(refPath)
      ? {
          type: refPath,
          description: refSchema?.description ?? "",
        }
      : resolveNestedSchema(refSchema, fullSchema);

    return finalSchema;
  }

  if (schema.enum) {
    return {
      ...schema,
      enum: schema.enum.map((item: any) =>
        resolveNestedSchema(item, fullSchema),
      ),
    };
  }

  if (schema.oneOf) {
    return {
      ...schema,
      oneOf: schema.oneOf.map((item: any) => {
        return resolveNestedSchema(item, fullSchema);
      }),
    };
  }

  if (schema.items) {
    return {
      ...schema,
      items: resolveNestedSchema(schema.items, fullSchema),
    };
  }

  if (schema.type === "boolean") {
    return {
      ...schema,
      type: "Bool",
    };
  }

  if (schema.properties) {
    const resolvedProps: Record<string, any> = {};
    Object.entries(schema.properties).forEach(([key, value]) => {
      resolvedProps[key] = resolveNestedSchema(value, fullSchema);
    });
    return {
      ...schema,
      properties: resolvedProps,
    };
  }

  // Return the schema as is if no special handling needed
  return schema.properties;
};

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
  const resolvedSchema = resolveNestedSchema(argsProperties, fullSchema);

  return {
    name: methodName,
    description: methodSchemaObj.description ?? "",
    properties: resolvedSchema.properties,
    required: requiredFields,
    argOrder: Object.keys(resolvedSchema.properties || {}),
    additionalProperties: methodSchemaObj.additionalProperties ?? false,
    type: "object",
  };
};
