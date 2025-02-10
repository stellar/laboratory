import { useState } from "react";
import { Select } from "@stellar/design-system";
import { contract, xdr } from "@stellar/stellar-sdk";

import { Box } from "@/components/layout/Box";
import { JsonSchemaForm } from "@/components/JsonSchemaForm";

import { AnyObject } from "@/types/types";
import { RJSFSchema } from "@rjsf/utils";

// testing
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";

const getResultType = (selectedValue: string, spec: AnyObject) => {
  // returns xdr.ScSpecEntry

  let fn = spec.findEntry(selectedValue).value();

  if (!(fn instanceof xdr.ScSpecFunctionV0)) {
    throw new Error("Not a function");
  }

  if (fn.outputs().length === 0) {
    return xdr.ScSpecTypeDef.scSpecTypeVoid();
  }
  return fn.outputs()[0];
};

export const ContractMethodSelectPicker = ({
  methods,
  spec,
  id,
}: {
  methods: string[];
  spec: contract.Spec;
  id: string;
}) => {
  const [selectedValue, setSelectedValue] = useState<string>("");
  const [funcSpec, setFuncSpec] = useState<RJSFSchema | undefined>(undefined);

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedValue(e.target.value);

    let type = getResultType(e.target.value, spec);

    // https://stellar.github.io/js-stellar-sdk/module-contract.Spec.html#jsonSchema
    // The schema provided will be a reference to the function schema
    const selectedFuncSchema = spec.jsonSchema(e.target.value);
    const normalSchema = spec.jsonSchema();

    console.log("getResultType type: ", type);
    console.log("jsonSchema func: ", selectedFuncSchema);
    console.log("just a normal spec: ", normalSchema);

    setFuncSpec(selectedFuncSchema);

    console.log("funcSpec: ", funcSpec);

    // setFormData({}); // Reset form data when method changes
  };

  return (
    <Box gap="md">
      <Select
        fieldSize="md"
        label="Select a function method"
        id={id}
        value={selectedValue}
        onChange={onChange}
      >
        {methods.map((method) => (
          <option key={method} value={method}>
            {method}
          </option>
        ))}
      </Select>
      {/* // @TODO // Render func args */}
      <>
        {funcSpec ? (
          <>
            <JsonSchemaForm schema={funcSpec} name={selectedValue} />
            <Form schema={funcSpec} validator={validator} />;
          </>
        ) : null}
      </>
    </Box>
  );
};
