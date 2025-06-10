import { JSONSchema7 } from "json-schema";
import { get } from "lodash";
import { Select } from "@stellar/design-system";

import { Box } from "@/components/layout/Box";

import { jsonSchema } from "@/helpers/jsonSchema";

import { JsonSchemaFormProps, SorobanInvokeValue } from "@/types/types";
import { renderTupleType } from "./renderTupleType";

export const renderOneOf = ({
  name,
  schema,
  path,
  parsedSorobanOperation,
  renderer,
  onChange,
}: {
  name: string;
  schema: JSONSchema7;
  path: string[];
  parsedSorobanOperation: SorobanInvokeValue;
  renderer: (props: JsonSchemaFormProps) => React.ReactNode;
  onChange: (value: SorobanInvokeValue) => void;
}) => {
  if (!schema?.oneOf) {
    return null;
  }

  const invokeContractBaseProps = {
    contract_id: parsedSorobanOperation.contract_id,
    function_name: parsedSorobanOperation.function_name,
  };

  const keyName = Object.keys(parsedSorobanOperation.args)[0];

  let tagName;

  if (path.length > 1) {
    tagName = get(parsedSorobanOperation.args[keyName], path.join("."))?.tag;
  } else {
    tagName = parsedSorobanOperation.args[keyName]?.tag;
  }

  const selectedSchema = schema.oneOf.find(
    (oneOf) => jsonSchema.isSchemaObject(oneOf) && oneOf?.title === tagName,
  );

  const onSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const pathSegments = path[0].split(".");

    if (pathSegments.length > 1) {
      const keyName = Object.keys(parsedSorobanOperation.args)[0];

      const updatedPath =
        keyName === pathSegments[0]
          ? pathSegments.slice(1).join(".")
          : pathSegments.join(".");

      const updatedTupleList = jsonSchema.setDeepValue(
        parsedSorobanOperation.args[keyName],
        updatedPath,
        {
          tag: e.target.value,
          // values: [],
        },
      );

      onChange({
        ...invokeContractBaseProps,
        args: {
          ...parsedSorobanOperation.args,
          [keyName]: updatedTupleList,
        },
      });
    } else {
      onChange({
        ...invokeContractBaseProps,
        args: {
          ...parsedSorobanOperation.args,
          [name]: {
            tag: e.target.value,
            values: [],
          },
        },
      });
    }
  };

  return (
    <Box gap="md">
      <Select
        id="json-schema-form-renderer-one-of"
        fieldSize="md"
        label={name}
        value={get(parsedSorobanOperation.args, path.join("."))?.tag}
        onChange={onSelectChange}
      >
        {/* title is the tag */}
        <option value="">Select</option>

        {schema.oneOf.map((oneOf, index) => {
          if (typeof oneOf === "boolean") return null;

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
          })
        : null}
    </Box>
  );
};
