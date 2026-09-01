// Jest globals (describe, expect, it) are available globally
import { scValToNative, xdr } from "@stellar/stellar-sdk";

import {
  getTxnToSimulate,
  isEmptyArgValue,
  normalizeOptionalArgs,
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
  // add_reward(to_add: Address, to_remove: Option<Address>), matching the
  // dereferenced schema properties the invoke form always passes along
  const addRewardArgSchemas: any = {
    to_add: { type: "Address" },
    to_remove: { type: "Address" },
  };

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
      addRewardArgSchemas,
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
      addRewardArgSchemas,
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
      addRewardArgSchemas,
    );

    expect(error).toBe("");

    const invokeArgs = getInvokeArgs(builtXdr);

    expect(invokeArgs).toHaveLength(2);
    expect(invokeArgs[0].type).toBe("scvVoid");
    expect(invokeArgs[1].type).toBe("scvVoid");
  });

  it("passes ScVoid (None) for an optional union the user returned to the blank option", () => {
    const value: SorobanInvokeValue = {
      contract_id: CONTRACT_ID,
      function_name: "set_mode",
      args: {
        mode: { tag: "" },
      },
    };

    const { xdr: builtXdr, error } = getTxnToSimulate(
      value,
      txnParams,
      operation,
      NETWORK_PASSPHRASE,
      ["mode"],
      [],
      { mode: { oneOf: [] } as any },
    );

    expect(error).toBe("");

    const invokeArgs = getInvokeArgs(builtXdr);

    expect(invokeArgs).toHaveLength(1);
    expect(invokeArgs[0].type).toBe("scvVoid");
  });

  it("passes an empty Vec (Some([])) for an optional array the user emptied out", () => {
    const value: SorobanInvokeValue = {
      contract_id: CONTRACT_ID,
      function_name: "set_items",
      args: {
        items: [],
      },
    };

    const { xdr: builtXdr, error } = getTxnToSimulate(
      value,
      txnParams,
      operation,
      NETWORK_PASSPHRASE,
      ["items"],
      [],
      { items: { type: "array", items: { type: "U32" } } as any },
    );

    expect(error).toBe("");

    const invokeArgs = getInvokeArgs(builtXdr);

    expect(invokeArgs).toHaveLength(1);
    expect(invokeArgs[0].type).toBe("scvVec");
    expect(scValToNative(invokeArgs[0])).toEqual([]);
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
      addRewardArgSchemas,
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

  it("treats a union/enum selection returned to the blank option as empty", () => {
    expect(isEmptyArgValue({ tag: "" })).toBe(true);
    expect(isEmptyArgValue({ enum: "" })).toBe(true);
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

// Dereferenced schema for a struct with a nested optional field:
// struct Config { admin: Address, fee_bps: Option<u32> }
const configSchema: any = {
  type: "object",
  description: "Contract configuration",
  properties: {
    admin: { type: "Address" },
    fee_bps: { type: "U32" },
  },
  required: ["admin"],
  additionalProperties: false,
};

describe("getTxnToSimulate with nested Option<T> struct fields", () => {
  // set_config(config: Config, note: Option<Symbol>)
  const argSchemas = {
    config: configSchema,
    note: { type: "ScSymbol" } as any,
  };
  const argOrder = ["config", "note"];
  const requiredArgs = ["config"];

  const buildAndGetArgs = (args: SorobanInvokeValue["args"]) => {
    const value: SorobanInvokeValue = {
      contract_id: CONTRACT_ID,
      function_name: "set_config",
      args,
    };

    return getTxnToSimulate(
      value,
      txnParams,
      operation,
      NETWORK_PASSPHRASE,
      argOrder,
      requiredArgs,
      argSchemas,
    );
  };

  it("encodes an unfilled nested optional struct field as ScVoid", () => {
    const { xdr: builtXdr, error } = buildAndGetArgs({
      config: { admin: { value: SOURCE_ACCOUNT, type: "address" } },
    });

    expect(error).toBe("");

    const invokeArgs = getInvokeArgs(builtXdr);

    expect(invokeArgs).toHaveLength(2);
    expect(scValToNative(invokeArgs[0])).toEqual({
      admin: SOURCE_ACCOUNT,
      fee_bps: null,
    });
    expect(invokeArgs[1].type).toBe("scvVoid");
  });

  it("encodes a cleared nested optional struct field as ScVoid", () => {
    const { xdr: builtXdr, error } = buildAndGetArgs({
      config: {
        admin: { value: SOURCE_ACCOUNT, type: "address" },
        fee_bps: { value: "", type: "u32" },
      },
    });

    expect(error).toBe("");

    const invokeArgs = getInvokeArgs(builtXdr);

    expect(scValToNative(invokeArgs[0])).toEqual({
      admin: SOURCE_ACCOUNT,
      fee_bps: null,
    });
  });

  it("keeps a filled nested optional struct field", () => {
    const { xdr: builtXdr, error } = buildAndGetArgs({
      config: {
        admin: { value: SOURCE_ACCOUNT, type: "address" },
        fee_bps: { value: "25", type: "u32" },
      },
      note: { value: "hello", type: "symbol" },
    });

    expect(error).toBe("");

    const invokeArgs = getInvokeArgs(builtXdr);

    expect(scValToNative(invokeArgs[0])).toEqual({
      admin: SOURCE_ACCOUNT,
      fee_bps: 25,
    });
    expect(scValToNative(invokeArgs[1])).toBe("hello");
  });
});

describe("normalizeOptionalArgs", () => {
  it("fills an unset optional struct field with null", () => {
    const normalized = normalizeOptionalArgs(
      { admin: { value: SOURCE_ACCOUNT, type: "address" } },
      configSchema,
    );

    expect(normalized).toEqual({
      admin: { value: SOURCE_ACCOUNT, type: "address" },
      fee_bps: null,
    });
  });

  it("fills a cleared optional struct field with null", () => {
    const normalized = normalizeOptionalArgs(
      {
        admin: { value: SOURCE_ACCOUNT, type: "address" },
        fee_bps: { value: "", type: "u32" },
      },
      configSchema,
    );

    expect(normalized.fee_bps).toBeNull();
  });

  it("does not fill missing required fields", () => {
    const normalized = normalizeOptionalArgs({}, configSchema);

    expect(normalized).toEqual({ fee_bps: null });
  });

  it("recurses into nested structs", () => {
    const nestedSchema: any = {
      type: "object",
      properties: {
        inner: configSchema,
      },
      required: ["inner"],
    };

    const normalized = normalizeOptionalArgs(
      { inner: { admin: { value: SOURCE_ACCOUNT, type: "address" } } },
      nestedSchema,
    );

    // configSchema's optional field (fee_bps) is normalized one level down
    expect(normalized).toEqual({
      inner: {
        admin: { value: SOURCE_ACCOUNT, type: "address" },
        fee_bps: null,
      },
    });
  });

  it("normalizes each item of a Vec of structs", () => {
    const vecSchema: any = {
      type: "array",
      items: configSchema,
    };

    const normalized = normalizeOptionalArgs(
      [
        { admin: { value: SOURCE_ACCOUNT, type: "address" } },
        {
          admin: { value: SOURCE_ACCOUNT, type: "address" },
          fee_bps: { value: "5", type: "u32" },
        },
      ],
      vecSchema,
    );

    expect(normalized[0].fee_bps).toBeNull();
    expect(normalized[1].fee_bps).toEqual({ value: "5", type: "u32" });
  });

  it("leaves union selections and primitive leaves untouched", () => {
    const unionValue = { tag: "Some" };
    const primitiveValue = { value: "7", type: "u32" };

    expect(normalizeOptionalArgs(unionValue, configSchema)).toBe(unionValue);
    expect(normalizeOptionalArgs(primitiveValue, configSchema)).toBe(
      primitiveValue,
    );
  });

  it("passes values through when there is no schema", () => {
    const value = { admin: { value: SOURCE_ACCOUNT, type: "address" } };

    expect(normalizeOptionalArgs(value, undefined)).toBe(value);
  });
});
