import { JSONSchema7 } from "json-schema";
import { get } from "lodash";
import { Select } from "@stellar/design-system";

import { Box } from "@/components/layout/Box";

import { jsonSchema } from "@/helpers/jsonSchema";

import {
  AnyObject,
  JsonSchemaFormProps,
  SorobanInvokeValue,
} from "@/types/types";
import { renderTupleType } from "./renderTupleType";

// oneOf is used for union and enum types
// https://github.com/stellar/js-stellar-sdk/blob/master/src/contract/spec.ts
export const renderOneOf = ({
  name,
  schema,
  path,
  parsedSorobanOperation,
  renderer,
  onChange,
  formError,
  setFormError,
}: {
  name: string;
  schema: JSONSchema7;
  path: string[];
  parsedSorobanOperation: SorobanInvokeValue;
  renderer: (props: JsonSchemaFormProps) => React.ReactNode;
  onChange: (value: SorobanInvokeValue) => void;
  formError: AnyObject;
  setFormError: (error: AnyObject) => void;
}) => {
  if (!schema?.oneOf) {
    return null;
  }

  const invokeContractBaseProps = {
    contract_id: parsedSorobanOperation.contract_id,
    function_name: parsedSorobanOperation.function_name,
  };

  // Use path[0] as keyName, fallback to first key from args if path is empty
  const keyName = path[0] || Object.keys(parsedSorobanOperation.args || {})[0];

  let tagName;

  if (path.length > 1) {
    // When path is nested, get the tag from the nested path within keyName
    // e.g., path = ["config", "fee_config"] -> get args.config.fee_config.tag
    const nestedPath = path.slice(1).join(".");
    tagName = get(parsedSorobanOperation.args?.[keyName], nestedPath)?.tag;
  } else {
    // When path is single level, get tag directly from keyName
    tagName = parsedSorobanOperation.args?.[keyName]?.tag;
  }

  const selectedSchema = schema.oneOf.find(
    (oneOf) => jsonSchema.isSchemaObject(oneOf) && oneOf?.title === tagName,
  );

  const onSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    isEnumType: boolean,
  ) => {
    // Use path[0] as keyName, fallback to first key from args if path is empty
    const keyName =
      path[0] || Object.keys(parsedSorobanOperation.args || {})[0];

    // Path is always an array format like ["config", "fee_config"] or ["config", "0", "fee_config"]
    if (path.length > 1 && path[0] === keyName) {
      // Path is nested within the keyName object
      // e.g., path = ["config", "fee_config"] -> updatedPath = "fee_config"
      // e.g., path = ["config", "0", "fee_config"] -> updatedPath = "0.fee_config"
      const updatedPath = path.slice(1).join(".");

      // Ensure args[keyName] exists before setting deep value
      const currentArgs = parsedSorobanOperation.args || {};
      const currentKeyValue = currentArgs[keyName] || {};

      const updatedTupleList = jsonSchema.setDeepValue(
        currentKeyValue,
        updatedPath,
        {
          tag: e.target.value,
        },
      );

      onChange({
        ...invokeContractBaseProps,
        args: {
          ...currentArgs,
          [keyName]: updatedTupleList,
        },
      });
    } else {
      // Single level path or no path, set at root level
      // If args is empty and we have a path, initialize with path[0]
      const currentArgs = parsedSorobanOperation.args || {};
      const initialArgs =
        Object.keys(currentArgs).length === 0 && path.length > 0
          ? { [path[0]]: {} }
          : currentArgs;

      onChange({
        ...invokeContractBaseProps,
        args: {
          ...initialArgs,
          [name]: {
            [isEnumType ? "enum" : "tag"]: e.target.value,
          },
        },
      });
    }
  };

  return (
    <Box gap="md" key={`${path.join(".")}`}>
      <Select
        id="json-schema-form-renderer-one-of"
        fieldSize="md"
        label={name}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
          const isEnumType = schema?.oneOf?.find(
            (oneOf) =>
              jsonSchema.isSchemaObject(oneOf) && oneOf?.enum !== undefined,
          );

          onSelectChange(e, !!isEnumType);
        }}
      >
        <option value="">Select</option>

        {schema.oneOf.map((oneOf, index) => {
          if (typeof oneOf === "boolean") return null;

          if (oneOf.enum && oneOf.enum.length > 0) {
            const val = oneOf.enum[0]?.toString();

            return (
              <option value={val} key={`${oneOf.title}`}>
                {oneOf.title} = {val}
              </option>
            );
          }

          return (
            <option
              id={oneOf?.title}
              value={oneOf?.title}
              key={`${oneOf?.title}-${index}`}
            >
              {oneOf?.title}
            </option>
          );
        })}
      </Select>

      {selectedSchema &&
      jsonSchema.isSchemaObject(selectedSchema) &&
      jsonSchema.isTaggedUnion(selectedSchema as JSONSchema7)
        ? renderTupleType({
            path,
            schema: selectedSchema as JSONSchema7,
            onChange,
            parsedSorobanOperation,
            renderer,
            formError,
            setFormError,
          })
        : null}
    </Box>
  );
};
