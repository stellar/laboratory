import type { JSONSchema7 } from "json-schema";
import { Button, Card, Icon, Text } from "@stellar/design-system";
import { get } from "lodash";

import { jsonSchema } from "@/helpers/jsonSchema";

import { Box } from "@/components/layout/Box";
import { LabelHeading } from "@/components/LabelHeading";

import type {
  AnyObject,
  JsonSchemaFormProps,
  SorobanInvokeValue,
} from "@/types/types";
import { arrayItem } from "@/helpers/arrayItem";

export const renderArrayType = ({
  schema,
  path,
  parsedSorobanOperation,
  renderer,
  onChange,
  formError,
  setFormError,
}: {
  schema: JSONSchema7;
  path: string[];
  parsedSorobanOperation: SorobanInvokeValue;
  renderer: (props: JsonSchemaFormProps) => React.ReactNode;
  onChange: (value: SorobanInvokeValue) => void;
  formError: AnyObject;
  setFormError: (error: AnyObject) => void;
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
        // path: [...path, nestedPath],
        parsedSorobanOperation,
        onChange,
        formError,
        setFormError,
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
          const argHeader = [name, index].join("[").concat("]");

          return (
            <Box gap="md" key={`${name}-${index}`}>
              <Card>
                <Box gap="md" key={`${name}-${index}`}>
                  {/* Map Type (scSpecTypeMap) */}
                  {jsonSchema.isSchemaObject(schema.items) &&
                  schema.items.type === "object" ? (
                    <>
                      <LabelHeading size="lg">{argHeader}</LabelHeading>

                      {Object.keys(args).map((arg) => {
                        // will return the nested path for the item
                        // ex. requests.0.address
                        const nestedPath = [nestedPathTitle, arg].join(".");

                        return renderer({
                          name: nestedPath,
                          schema: schemaItems?.[arg] as JSONSchema7,
                          // path: [...path, nestedPath],
                          path: [nestedPath],
                          parsedSorobanOperation,
                          onChange,
                          formError,
                          setFormError,
                        });
                      })}
                    </>
                  ) : (
                    <Box gap="md">
                      {/* Vec Type (scSpecTypeVec) */}
                      {renderer({
                        name: nestedPathTitle,
                        schema: schemaItems,
                        path: [nestedPathTitle],
                        parsedSorobanOperation,
                        onChange,
                        formError,
                        setFormError,
                      })}
                    </Box>
                  )}

                  {/* delete button */}
                  <Box gap="sm" direction="row" align="center">
                    <Button
                      size="md"
                      variant="tertiary"
                      icon={<Icon.Trash01 />}
                      type="button"
                      onClick={() => {
                        const updatedList = arrayItem.delete(
                          get(parsedSorobanOperation.args, path.join(".")),
                          index,
                        );

                        const updatedArgs = jsonSchema.setDeepValue(
                          parsedSorobanOperation.args,
                          path.join("."),
                          updatedList,
                        );

                        onChange({
                          ...invokeContractBaseProps,
                          args: updatedArgs,
                        });
                      }}
                    ></Button>
                  </Box>
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

              const args =
                get(parsedSorobanOperation.args, path.join(".")) || [];
              args.push(template);

              const updatedList = jsonSchema.setDeepValue(
                parsedSorobanOperation.args,
                path.join("."),
                args,
              );

              onChange({
                ...invokeContractBaseProps,
                args: {
                  ...updatedList,
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
