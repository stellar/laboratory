// Jest globals (describe, expect, it) are available globally
import { xdr } from "@stellar/stellar-sdk";

import {
  getTxnToSimulate,
  isEmptyArgValue,
} from "../../src/helpers/sorobanUtils";

import type { TransactionBuildParams } from "../../src/store/createStore";
import type { SorobanInvokeValue, TxnOperation } from "../../src/types/types";

const NETWORK_PASSPHRASE = "Test SDF Network ; September 2015";
const SOURCE_ACCOUNT =
  "GBPIMUEJFYS7RT23QO2ACH2JMKGXLXZI4E5ACBSQMF32RKZ5H3SVNL5F";
const CONTRACT_ID = "CBHQGTSBJWA54K67RSG3JPXSZY5IXIZ4FSLJM4PQ33FA3FYCU5YZV7MZ";

const txnParams: TransactionBuildParams = {
  source_account: SOURCE_ACCOUNT,
  fee: "100",
  seq_num: "1",
  cond: {
    time: {
      min_time: "0",
      max_time: "0",
    },
  },
  memo: {},
};

const operation: TxnOperation = {
  operation_type: "invoke_contract_function",
  params: {},
};

const getInvokeArgs = (builtXdr: string): xdr.ScVal[] => {
  const envelope = xdr.expectUnionVariant(
    xdr.TransactionEnvelope.fromXdr(builtXdr, "base64"),
    "envelopeTypeTx",
  );
  const opBody = xdr.expectUnionVariant(
    envelope.v1.tx.operations[0].body,
    "invokeHostFunction",
  );

  return xdr.expectUnionVariant(
    opBody.invokeHostFunctionOp.hostFunction,
    "hostFunctionTypeInvokeContract",
  ).invokeContract.args;
};

describe("getTxnToSimulate with Option<T> arguments", () => {
  it("passes ScVoid (None) for an unfilled optional argument", () => {
    const value: SorobanInvokeValue = {
      contract_id: CONTRACT_ID,
      function_name: "add_reward",
      args: {
        to_add: { value: SOURCE_ACCOUNT, type: "address" },
      },
    };

    const { xdr: builtXdr, error } = getTxnToSimulate(
      value,
      txnParams,
      operation,
      NETWORK_PASSPHRASE,
      ["to_add", "to_remove"],
      ["to_add"],
    );

    expect(error).toBe("");

    const invokeArgs = getInvokeArgs(builtXdr);

    expect(invokeArgs).toHaveLength(2);
    expect(invokeArgs[0].type).toBe("scvAddress");
    expect(invokeArgs[1].type).toBe("scvVoid");
  });

  it("passes ScVoid (None) for an optional argument the user cleared out", () => {
    const value: SorobanInvokeValue = {
      contract_id: CONTRACT_ID,
      function_name: "add_reward",
      args: {
        to_add: { value: SOURCE_ACCOUNT, type: "address" },
        to_remove: { value: "", type: "address" },
      },
    };

    const { xdr: builtXdr, error } = getTxnToSimulate(
      value,
      txnParams,
      operation,
      NETWORK_PASSPHRASE,
      ["to_add", "to_remove"],
      ["to_add"],
    );

    expect(error).toBe("");

    const invokeArgs = getInvokeArgs(builtXdr);

    expect(invokeArgs).toHaveLength(2);
    expect(invokeArgs[1].type).toBe("scvVoid");
  });

  it("passes ScVoid (None) when all optional arguments are unfilled", () => {
    const value: SorobanInvokeValue = {
      contract_id: CONTRACT_ID,
      function_name: "add_reward",
      args: {},
    };

    const { xdr: builtXdr, error } = getTxnToSimulate(
      value,
      txnParams,
      operation,
      NETWORK_PASSPHRASE,
      ["to_add", "to_remove"],
      [],
    );

    expect(error).toBe("");

    const invokeArgs = getInvokeArgs(builtXdr);

    expect(invokeArgs).toHaveLength(2);
    expect(invokeArgs[0].type).toBe("scvVoid");
    expect(invokeArgs[1].type).toBe("scvVoid");
  });

  it("returns an error for an unfilled required argument", () => {
    const value: SorobanInvokeValue = {
      contract_id: CONTRACT_ID,
      function_name: "add_reward",
      args: {
        to_remove: { value: SOURCE_ACCOUNT, type: "address" },
      },
    };

    const { xdr: builtXdr, error } = getTxnToSimulate(
      value,
      txnParams,
      operation,
      NETWORK_PASSPHRASE,
      ["to_add", "to_remove"],
      ["to_add"],
    );

    expect(builtXdr).toBe("");
    expect(error).toBe("Missing required argument: to_add");
  });
});

describe("isEmptyArgValue", () => {
  it("treats missing values as empty", () => {
    expect(isEmptyArgValue(undefined)).toBe(true);
    expect(isEmptyArgValue(null)).toBe(true);
    expect(isEmptyArgValue("")).toBe(true);
    expect(isEmptyArgValue({})).toBe(true);
    expect(isEmptyArgValue({ value: "", type: "address" })).toBe(true);
  });

  it("treats filled values as not empty", () => {
    expect(isEmptyArgValue({ value: "0", type: "u32" })).toBe(false);
    expect(isEmptyArgValue({ value: "false", type: "bool" })).toBe(false);
    expect(isEmptyArgValue({ tag: "Some" })).toBe(false);
    expect(isEmptyArgValue({ enum: "1" })).toBe(false);
    expect(isEmptyArgValue([])).toBe(false);
    expect(isEmptyArgValue([{ value: "1", type: "u32" }])).toBe(false);
  });
});
