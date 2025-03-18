import { contract, nativeToScVal, xdr } from "@stellar/stellar-sdk";

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
    if (isSpecTypeNumber(input.type().switch())) {
      const rawValue = readObj(value.args, input);

      // without the following check, nativeToScVal makes it
      // a U64 / I64 instead of a U32 / I32
      if (input.type().switch().name === xdr.ScSpecType.scSpecTypeU32().name) {
        return xdr.ScVal.scvU32(Number(rawValue));
      }

      if (input.type().switch().name === xdr.ScSpecType.scSpecTypeI32().name) {
        return xdr.ScVal.scvI32(Number(rawValue));
      }

      const parsedValue = BigInt(rawValue);

      return nativeToScVal(parsedValue, { type: input.type() });
    }

    // the below is how funcArgsToScVals is implemented
    // we need to customize a bit since the saved number value is a string
    // https://stellar.github.io/js-soroban-client/ContractSpec.html#funcArgsToScVals
    return nativeToScVal(readObj(value.args, input), {
      type: "address",
    });
  });
};
