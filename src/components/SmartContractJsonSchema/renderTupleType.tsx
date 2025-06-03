import { Card } from "@stellar/design-system";
import { JSONSchema7 } from "json-schema";

import { Box } from "@/components/layout/Box";
import { LabelHeading } from "@/components/LabelHeading";

import { JsonSchemaFormProps, SorobanInvokeValue } from "@/types/types";

export const renderTupleType = ({
  name,
  path,
  schema,
  onChange,
  parsedSorobanOperation,
  renderer,
}: {
  name: string;
  path: string[];
  schema: JSONSchema7;
  onChange: (value: SorobanInvokeValue) => void;
  parsedSorobanOperation: SorobanInvokeValue;
  renderer: (props: JsonSchemaFormProps) => React.ReactNode;
}) => {
  if (!parsedSorobanOperation.args[name]?.tag || !schema.properties?.values) {
    return null;
  }

  // from the schema, the tag is "values"
  const label = "values";

  return (
    <Box gap="md">
      <LabelHeading size="md" infoText={schema.description}>
        {parsedSorobanOperation.args[name]?.tag}
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
                // path: [...path, parsedSorobanOperation.args[name]?.tag, label],
                path: [...path, label],
                parsedSorobanOperation,
                onChange,
              })}
            </Box>
          </Card>
        </Box>
      </Card>
    </Box>
  );
};
