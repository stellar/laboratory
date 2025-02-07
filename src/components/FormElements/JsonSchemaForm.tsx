import Form from "@rjsf/core";
import { RJSFSchema, getDefaultFormState, retrieveSchema } from "@rjsf/utils";
import validator from "@rjsf/validator-ajv8";

import $RefParser from "@apidevtools/json-schema-ref-parser";

import {
  Button,
  Card,
  Checkbox,
  Icon,
  Input,
  Label,
  Loader,
} from "@stellar/design-system";
import { useEffect } from "react";

export const JsonSchemaForm = ({
  schema,
  name,
}: {
  schema: RJSFSchema;
  name: string;
}) => {
  const test = async () => {
    try {
      const dereferencedSchema = await $RefParser.dereference(schema);

      console.log("dereferencedSchema: ", dereferencedSchema);
      console.log(
        "dereferencedSchema.definitions[name]: ",
        dereferencedSchema?.definitions?.[name],
      );
      // console.log("schema.definitions: ", schema.definitions);

      // let formSchema = schema;

      // if (schema.$ref) {
      //   const refKey = schema.$ref.replace("#/definitions/", "");
      //   console.log("refKey: ", refKey);
      //   if (schema.definitions && schema.definitions[refKey]) {
      //     formSchema = {
      //       ...schema.definitions[refKey],
      //       definitions: schema.definitions, // Include definitions for nested refs
      //     };

      //     console.log("formSchema: ", formSchema.properties.args);
      //   }
      // }
    } catch (e) {
      console.log("e: ", e);
    }
  };

  useEffect(() => {
    test();
  }, []);

  return <Form schema={schema} validator={validator} />;
};
