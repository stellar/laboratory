import { contract } from "@stellar/stellar-sdk";

interface FunctionSpec {
  name: string;
  doc: string;
  inputs: { name: string; type: string }[];
  outputs: { name: string; type: string }[];
}

export const parseContractSpec = (spec: contract.Spec): FunctionSpec[] =>
  spec.funcs().map((fn) => ({
    name: fn.name().toString(),
    doc: fn.doc().toString(),
    inputs: fn.inputs().map((input) => ({
      name: input.name().toString(),
      type: input.type().switch().name,
    })),
    outputs: fn.outputs().map((output) => ({
      name: output.switch().name,
      type: output.switch().name,
    })),
  }));
