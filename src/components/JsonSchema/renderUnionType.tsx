import {
  AnyObject,
  JsonSchemaFormProps,
  SorobanInvokeValue,
} from "@/types/types";
import { JSONSchema7 } from "json-schema";
import { Box } from "../layout/Box";
import { LabelHeading } from "../LabelHeading";
import { Card } from "@stellar/design-system";

export const renderUnionType = ({
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

  //   console.log("[renderUnionType] schema: ", schema);
  //   console.log("[renderUnionType] path: ", path);
  //   console.log("[renderUnionType] name: ", name);

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
                path: [path.join(".")],
                parsedSorobanOperation,
                onChange,
              })}

              {/* <JsonSchemaFormRenderer
                name={label}
                path={path}
                schema={schema.properties.values as JSONSchema7}
                onChange={onChange}
                requiredFields={schema.required}
                setFormError={setFormError}
                formError={formError}
                parsedSorobanOperation={parsedSorobanOperation}
              /> */}
            </Box>
          </Card>
        </Box>
      </Card>
    </Box>
  );
};
