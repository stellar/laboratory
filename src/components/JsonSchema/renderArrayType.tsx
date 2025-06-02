import type { JSONSchema7 } from "json-schema";

import { jsonSchema } from "@/helpers/jsonSchema";

import type {
  AnyObject,
  JsonSchemaFormProps,
  SorobanInvokeValue,
} from "@/types/types";
import { Box } from "../layout/Box";
import { LabelHeading } from "../LabelHeading";
import { Button, Card, Text } from "@stellar/design-system";

import { get } from "lodash";

// @TODO
// Tuple Type (scSpecTypeTuple)
//   if (jsonSchema.isTuple(schema)) {
//     return <div>isTuple</div>;
//   }

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
  const name = path.join("-");
  const invokeContractBaseProps = {
    contract_id: parsedSorobanOperation.contract_id,
    function_name: parsedSorobanOperation.function_name,
  };

  const schemaItems = jsonSchema.getSchemaItems(schema);

  const nestedArgsItems = get(parsedSorobanOperation.args, name) || [];

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
                    <LabelHeading size="lg">{nestedPathTitle}</LabelHeading>
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

      {!jsonSchema.isTuple(schema) ? (
        <Box gap="md" direction="row" align="center">
          <Button
            variant="secondary"
            size="md"
            onClick={() => {
              const template = getTemplate({ schemaItems });

              const args = parsedSorobanOperation.args?.[name] || [];
              args.push(template);

              console.log("[addItem] args: ", args);

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

const getTemplate = ({ schemaItems }: { schemaItems: JSONSchema7 }) => {
  let template: AnyObject = {};

  console.log("[addItem] schemaItems: ", schemaItems);

  // Map Type (scSpecTypeMap)
  if (schemaItems.type === "array" && schemaItems.items) {
    // {
    //   "items": {
    //     "type": "object",
    //     "properties": {
    //       "address": { "type": "string" },
    //       "amount": { "type": "string" },
    //       "request_type": { "type": "string" }
    //     }
    //   }
    // }
    // then the defaultTemplate will be:
    // {
    //   "address": {},
    //   "amount": {},
    //   "request_type": {}
    // }
  }

  return template;

  // Vec Type (scSpecTypeVec)
  // Array of simple element types
  //   if (schemaItems) {
  //     console.log("[schemaType array] schemaItems: ", schemaItems);

  //     return <div>Array</div>;
  //   }

  //   switch (schemaType) {
  //     case "tuple":
  //       return <div>Object</div>;
  //     case "map":
  //       return <div>Array</div>;
  //     default:
  //       return <div>Default</div>;
  //   }
};
