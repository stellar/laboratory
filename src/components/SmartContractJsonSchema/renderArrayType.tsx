import type { JSONSchema7 } from "json-schema";
import { Button, Card, Text } from "@stellar/design-system";
import { get } from "lodash";

import { jsonSchema } from "@/helpers/jsonSchema";

import { Box } from "@/components/layout/Box";
import { LabelHeading } from "@/components/LabelHeading";

import type {
  AnyObject,
  JsonSchemaFormProps,
  SorobanInvokeValue,
} from "@/types/types";

export const renderArrayType = ({
  schema,
  path,
  parsedSorobanOperation,
  renderer,
  onChange,
}: {
  schema: JSONSchema7;
  path: string[];
  parsedSorobanOperation: SorobanInvokeValue;
  renderer: (props: JsonSchemaFormProps) => React.ReactNode;
  onChange: (value: SorobanInvokeValue) => void;
}) => {
  const name = path.join(".");
  const invokeContractBaseProps = {
    contract_id: parsedSorobanOperation.contract_id,
    function_name: parsedSorobanOperation.function_name,
  };

  const schemaItems = jsonSchema.getSchemaItems(schema);

  const nestedArgsItems = get(parsedSorobanOperation.args, name) || [];

  const disableAddButton =
    jsonSchema.isTuple(schema) ||
    schemaItems.maxItems === nestedArgsItems.length;

  if (jsonSchema.isTuple(schema)) {
    return schemaItems.map((item: JSONSchema7, index: number) => {
      // will render primitive/array/all the types
      const nestedPath = [name, index].join(".");

      return renderer({
        name: nestedPath,
        schema: item,
        path: [nestedPath],
        parsedSorobanOperation,
        onChange,
      });
    });
  }

  return (
    <Box gap="md" key={`${name}`}>
      <LabelHeading size="md" infoText={schema.description}>
        {name}
      </LabelHeading>

      {schema.description ? (
        <Text as="div" size="xs">
          {schema.description}
        </Text>
      ) : null}

      {nestedArgsItems.length > 0 &&
        nestedArgsItems.map((args: any, index: number) => {
          const nestedPathTitle = [name, index].join(".");

          return (
            <Box gap="md" key={`${name}-${index}`}>
              <Card>
                <Box gap="md" key={`${name}-${index}`}>
                  {/* Map Type (scSpecTypeMap) */}
                  {jsonSchema.isSchemaObject(schema.items) &&
                  schema.items.type === "object" ? (
                    // <LabelHeading size="lg">{nestedPathTitle}sss</LabelHeading>

                    Object.keys(args).map((arg) => {
                      const nestedPath = [index, arg].join(".");

                      return renderer({
                        name: nestedPathTitle,
                        schema: schemaItems?.[arg] as JSONSchema7,
                        path: [...path, nestedPath],
                        parsedSorobanOperation,
                        onChange,
                      });
                    })
                  ) : (
                    <Box gap="md">
                      {/* Vec Type (scSpecTypeVec) */}
                      {/* REMOVED: <LabelHeading size="lg">{nestedPathTitle}</LabelHeading> */}
                      {renderer({
                        name: nestedPathTitle,
                        schema: schemaItems,
                        path: [nestedPathTitle],
                        parsedSorobanOperation,
                        onChange,
                      })}
                    </Box>
                  )}
                </Box>
              </Card>
            </Box>
          );
        })}

      {!disableAddButton ? (
        <Box gap="md" direction="row" align="center">
          <Button
            variant="secondary"
            size="md"
            onClick={() => {
              const template = getTemplate({ schema });

              const args = parsedSorobanOperation.args?.[name] || [];
              args.push(template);

              onChange({
                ...invokeContractBaseProps,
                args: {
                  ...parsedSorobanOperation.args,
                  [name]: args,
                },
              });
            }}
            type="button"
          >
            Add {name}
          </Button>
        </Box>
      ) : null}
    </Box>
  );
};

const getTemplate = ({ schema }: { schema: JSONSchema7 }) => {
  let template: AnyObject = {};

  const schemaItems = jsonSchema.getSchemaItems(schema);

  if (
    jsonSchema.isSchemaObject(schema.items) &&
    schema.items.type === "object"
  ) {
    template = Object.keys(schemaItems || {}).reduce(
      (acc: Record<string, string | AnyObject>, key) => {
        // Good example:
        // CDVQVKOY2YSXS2IC7KN6MNASSHPAO7UN2UR2ON4OI2SKMFJNVAMDX6DP
        // submit function with object args
        if (key === "additionalProperties") {
          return acc;
        }

        acc[key] = {};
        return acc;
      },
      {},
    );
  }

  return template;
};
