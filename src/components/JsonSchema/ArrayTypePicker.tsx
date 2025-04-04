import type { JSONSchema7 } from "json-schema";

import { Box } from "@/components/layout/Box";
import { Button, Card, Icon } from "@stellar/design-system";

import React from "react";
import { arrayItem } from "@/helpers/arrayItem";

const createEmptyArrayItem = (propSchema: JSONSchema7) => {
  const defaultItem: any = {};
  if (propSchema.properties) {
    for (const [key, prop] of Object.entries(propSchema.properties)) {
      if (typeof prop === "object" && prop !== null) {
        switch (prop.type) {
          case "array":
            defaultItem[key] = createEmptyArrayItem(prop as JSONSchema7);
            break;
          default:
            defaultItem[key] = "";
        }
      }
    }
  }

  return defaultItem;
};

export const ArrayTypePicker = ({
  valueKey,
  prop,
  value,
  onChange,
  renderComponent,
}: {
  valueKey: string;
  prop: JSONSchema7;
  value: any;
  onChange: (key: string, newVal: any) => void;
  renderComponent: (
    key: string,
    prop: any,
    handleChange: (key: string, newVal: any) => void,
    index?: number,
  ) => React.ReactElement;
}) => {
  console.log("[ArrayTypePicker] value: ", value);

  const hasNestedItems =
    Array.isArray(value.args[valueKey]) && value.args[valueKey].length > 0;

  const renderArrayFields = () => {
    if (!prop.properties || !Array.isArray(value.args[valueKey])) {
      return null;
    }

    const handleNestedChange = (key: string, newVal: any, index?: number) => {
      // Needs to handle nested object value

      console.log("valueKey: ", valueKey);
      console.log("value.args: ", value.args);
      console.log("value.args[valueKey]: ", value.args[valueKey]);
      console.log("value.args: ", value.args);

      const selectedArg = value.args[valueKey];
    };

    return (
      <Box gap="md">
        {hasNestedItems
          ? value.args[valueKey].map((_item: any, index: number) => (
              <Card key={index}>
                <Box gap="md">
                  <>
                    {prop.properties
                      ? Object.entries(prop.properties).map(
                          ([propKey, propValue]) => (
                            <Box gap="md" key={`${propKey}-${index}`}>
                              {renderComponent(
                                propKey,
                                propValue,
                                handleNestedChange,
                                index,
                              )}
                            </Box>
                          ),
                        )
                      : null}

                    <Box gap="sm" direction="row" align="center" justify="left">
                      <Button
                        size="md"
                        variant="tertiary"
                        icon={<Icon.Trash01 />}
                        type="button"
                        onClick={() => {
                          onChange(
                            valueKey,
                            arrayItem.delete(value.args[valueKey], index),
                          );
                        }}
                      ></Button>
                    </Box>
                  </>
                </Box>
              </Card>
            ))
          : null}
      </Box>
    );
  };

  return (
    <Box gap="md">
      <>{renderArrayFields()}</>

      <Card>
        <Button
          variant="secondary"
          size="md"
          onClick={() => {
            const newItem = createEmptyArrayItem(prop);

            if (!value.args[valueKey]) {
              onChange(valueKey, [newItem]);
            } else {
              onChange(valueKey, arrayItem.add(value.args[valueKey], newItem));
            }
          }}
          type="button"
        >
          Add {valueKey}
        </Button>
      </Card>
    </Box>
  );
};
