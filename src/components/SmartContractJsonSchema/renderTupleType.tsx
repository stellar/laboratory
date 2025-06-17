import { Card } from "@stellar/design-system";
import { JSONSchema7 } from "json-schema";

import { Box } from "@/components/layout/Box";
import { LabelHeading } from "@/components/LabelHeading";

import {
  AnyObject,
  JsonSchemaFormProps,
  SorobanInvokeValue,
} from "@/types/types";
import { get } from "lodash";

export const renderTupleType = ({
  path,
  schema,
  onChange,
  parsedSorobanOperation,
  renderer,
  formError,
  setFormError,
}: {
  path: string[];
  schema: JSONSchema7;
  onChange: (value: SorobanInvokeValue) => void;
  parsedSorobanOperation: SorobanInvokeValue;
  renderer: (props: JsonSchemaFormProps) => React.ReactNode;
  formError: AnyObject;
  setFormError: (error: AnyObject) => void;
}) => {
  const getKeyName = get(parsedSorobanOperation.args, path.join("."));

  if (!getKeyName?.tag || !schema.properties?.values) {
    return null;
  }

  // from the schema, the tag is "values"
  const label = "values";

  return (
    <Box gap="md">
      <LabelHeading size="md" infoText={schema.description}>
        {getKeyName?.tag}
      </LabelHeading>

      <Card>
        <Box gap="md">
          <LabelHeading size="md" infoText={schema.description}>
            {label}
          </LabelHeading>
          <Card>
            <Box gap="md">
              {renderer({
                name: label,
                schema: schema?.properties?.values as JSONSchema7,
                path: [...path, label],
                parsedSorobanOperation,
                onChange,
                formError,
                setFormError,
              })}
            </Box>
          </Card>
        </Box>
      </Card>
    </Box>
  );
};
