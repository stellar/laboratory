import { contract, nativeToScVal, ScInt, xdr } from "@stellar/stellar-sdk";

import { isSpecTypeNumber } from "@/helpers/isSpecTypeNumber";
import { readObj } from "@/helpers/readObj";

import { SorobanInvokeValue } from "@/types/types";

// Used in the JsonSchemaForm component:
// To convert the string value to ScVal
// based on its function name and spec
export const getScValsFromSpec = (
  function_name: string,
  spec: contract.Spec,
  value: SorobanInvokeValue,
) => {
  let fn = spec.getFunc(function_name);

  return fn.inputs().map((input: xdr.ScSpecFunctionInputV0) => {
    const rawInputValue = readObj(value.args, input);
    const { name: inputFieldType } = input.type().switch();

    console.log("inputFieldType :", inputFieldType);

    if (isSpecTypeNumber(input.type().switch())) {
      const parsedIntValue = new ScInt(rawInputValue);
      // without the following check, nativeToScVal makes it
      // a U64 / I64 instead of a U32 / I32
      if (inputFieldType === xdr.ScSpecType.scSpecTypeU32().name) {
        return xdr.ScVal.scvU32(Number(rawInputValue));
      }

      if (inputFieldType === xdr.ScSpecType.scSpecTypeI32().name) {
        return xdr.ScVal.scvI32(Number(rawInputValue));
      }

      if (inputFieldType === xdr.ScSpecType.scSpecTypeU64().name) {
        return parsedIntValue.toU64();
      }

      if (inputFieldType === xdr.ScSpecType.scSpecTypeI64().name) {
        return parsedIntValue.toI64();
      }

      if (inputFieldType === xdr.ScSpecType.scSpecTypeI128().name) {
        return parsedIntValue.toI128();
      }

      if (inputFieldType === xdr.ScSpecType.scSpecTypeU128().name) {
        return parsedIntValue.toU128();
      }

      return nativeToScVal(parsedIntValue, { type: inputFieldType });
    }

    if (inputFieldType === xdr.ScSpecType.scSpecTypeAddress().name) {
      return nativeToScVal(rawInputValue, {
        type: "address",
      });
    }

    console.log("value.args :", value.args);
    console.log("input.type().switch() :", input.type().switch());
    console.log("[rawInputValue] rawInputValue :", rawInputValue);
    // the below is how funcArgsToScVals is implemented
    // we need to customize a bit since the saved number value is a string
    // https://stellar.github.io/js-soroban-client/ContractSpec.html#funcArgsToScVals
    return nativeToScVal(rawInputValue, {
      type: inputFieldType,
    });
  });
};
