import {
  Address,
  Contract,
  Operation,
  TransactionBuilder,
  xdr,
  Account,
  Memo,
  SorobanDataBuilder,
  Transaction,
  BASE_FEE,
  nativeToScVal,
} from "@stellar/stellar-sdk";

import { TransactionBuildParams } from "@/store/createStore";
import { SorobanInvokeValue, SorobanOpType, TxnOperation } from "@/types/types";

export const isSorobanOperationType = (operationType: string) =>
  [
    "extend_footprint_ttl",
    "extendFootprintTtl",
    "restore_footprint",
    "restoreFootprint",
    "invoke_contract_function",
    "invokeContractFunction",
    "invoke_host_function",
    "invokeHostFunction",
  ].includes(operationType);

// https://developers.stellar.org/docs/learn/glossary#ledgerkey
// https://developers.stellar.org/docs/build/guides/archival/restore-data-js
// Setup contract data xdr that will be used to build Soroban Transaction Data
// Used for Soroban Operation "restore_footprint" and "extend_footprint_ttl"
// "invoke_contract_function" uses the returned soroban transaction data from simulateTransaction
export const getContractDataXDR = ({
  contractAddress,
  dataKey,
  durability,
}: {
  contractAddress: string;
  dataKey: string;
  durability: string;
}) => {
  const contract: Contract = new Contract(contractAddress);
  const address: Address = Address.fromString(contract.contractId());
  const xdrBinary = Buffer.from(dataKey, "base64");

  const getXdrDurability = (durability: string) => {
    switch (durability) {
      case "persistent":
        return xdr.ContractDataDurability.persistent();
      // https://developers.stellar.org/docs/build/guides/storage/choosing-the-right-storage#temporary-storage
      // TTL for the temporary data can be extended; however,
      // it is unsafe to rely on the extensions to preserve data since
      // there is always a risk of losing temporary data
      case "temporary":
        return xdr.ContractDataDurability.temporary();
      default:
        return xdr.ContractDataDurability.persistent();
    }
  };

  return xdr.LedgerKey.contractData(
    new xdr.LedgerKeyContractData({
      contract: address.toScAddress(),
      key: xdr.ScVal.fromXDR(xdrBinary),
      durability: getXdrDurability(durability),
    }),
  );
};

export const getSorobanTxData = ({
  contractDataXdr,
  operationType,
  fee,
}: {
  contractDataXdr: xdr.LedgerKey;
  operationType: SorobanOpType;
  fee: string;
}): xdr.SorobanTransactionData | undefined => {
  switch (operationType) {
    case "extend_footprint_ttl":
      return buildSorobanData({
        readOnlyXdrLedgerKey: [contractDataXdr],
        resourceFee: fee,
      });
    case "restore_footprint":
      return buildSorobanData({
        readWriteXdrLedgerKey: [contractDataXdr],
        resourceFee: fee,
      });
    default:
      return undefined;
  }
};

export const buildTxWithSorobanData = ({
  sorobanData,
  params,
  sorobanOp,
  networkPassphrase,
}: {
  sorobanData?: xdr.SorobanTransactionData | string;
  params: TransactionBuildParams;
  sorobanOp: TxnOperation;
  networkPassphrase: string;
}): Transaction => {
  // decrement seq number by 1 because TransactionBuilder.build()
  // will increment the seq number by 1 automatically
  const txSeq = (BigInt(params.seq_num) - BigInt(1)).toString();
  const account = new Account(params.source_account, txSeq);

  // https://developers.stellar.org/docs/learn/fundamentals/fees-resource-limits-metering
  const totalTxFee = BigInt(params.fee) + BigInt(sorobanOp.params.resource_fee);

  const getMemoValue = (memoType: string, memoValue: string) => {
    switch (memoType) {
      case "text":
        return Memo.text(memoValue);
      case "id":
        return Memo.id(memoValue);
      case "hash":
        return Memo.hash(memoValue);
      case "return":
        return Memo.return(memoValue);
      default:
        return Memo.none();
    }
  };

  const getTimeboundsValue = (timebounds: {
    min_time: string;
    max_time: string;
  }) => {
    return {
      minTime: timebounds.min_time,
      maxTime: timebounds.max_time,
    };
  };

  const getSorobanOp = (operationType: string) => {
    switch (operationType) {
      case "extend_footprint_ttl":
        return Operation.extendFootprintTtl({
          extendTo: Number(sorobanOp.params.extend_ttl_to),
          source: sorobanOp.source_account,
        });
      case "restore_footprint":
        return Operation.restoreFootprint({});
      case "invoke_contract_function":
        return Operation.invokeContractFunction({
          contract: sorobanOp.params.contract_id,
          function: sorobanOp.params.function_name,
          args: sorobanOp.params.args,
          auth: sorobanOp.params.auth,
          source: sorobanOp.source_account,
        });
      default:
        throw new Error(`Unsupported Soroban operation type: ${operationType}`);
    }
  };

  const transaction = new TransactionBuilder(account, {
    fee: totalTxFee.toString(),
    timebounds: getTimeboundsValue(params.cond.time),
  });

  if (Object.keys(params.memo).length > 0) {
    const [type, val] = Object.entries(params.memo)[0];
    transaction.addMemo(getMemoValue(type, val));
  }

  return transaction
    .setNetworkPassphrase(networkPassphrase)
    .setSorobanData(sorobanData || "")
    .addOperation(getSorobanOp(sorobanOp.operation_type))
    .build();
};

/* 
  get a transaction xdr with Soroban data to simulate with
*/
export const getTxWithSorobanData = ({
  operation,
  txnParams,
  networkPassphrase,
}: {
  operation: TxnOperation;
  txnParams: TransactionBuildParams;
  networkPassphrase: string;
}): { xdr: string; error?: string } => {
  try {
    // For restore_footprint: use pre-built XDR from contractDataLedgerKey
    // For extend_footprint_ttl: build XDR from contract address, key, and durability
    // @TODO extend_footprint_ttl should also use contractDataLedgerKey
    const contractDataXdr =
      operation.operation_type === "restore_footprint"
        ? xdr.LedgerKey.fromXDR(
            operation.params.contractDataLedgerKey,
            "base64",
          )
        : getContractDataXDR({
            contractAddress: operation.params.contract,
            dataKey: operation.params.key_xdr,
            durability: operation.params.durability,
          });

    const sorobanData = getSorobanTxData({
      contractDataXdr,
      operationType: operation.operation_type as SorobanOpType,
      fee: operation.params.resource_fee,
    });

    if (sorobanData) {
      const sorobanTx = buildTxWithSorobanData({
        sorobanData,
        params: txnParams,
        sorobanOp: operation,
        networkPassphrase: networkPassphrase,
      });

      const sorobanTxXdrString = sorobanTx.toXDR();

      return { xdr: sorobanTxXdrString, error: undefined };
    } else {
      throw new Error("Failed to build Soroban transaction data");
    }
  } catch (e) {
    return { xdr: "", error: `${e}` };
  }
};

export const getTxnToSimulate = (
  value: SorobanInvokeValue,
  txnParams: TransactionBuildParams,
  operation: TxnOperation,
  networkPassphrase: string,
): { xdr: string; error: string } => {
  try {
    const argsToScVals = getScValsFromArgs(value.args, []);
    const builtXdr = buildTxWithSorobanData({
      params: txnParams,
      sorobanOp: {
        ...operation,
        params: {
          ...operation.params,
          contract_id: value.contract_id,
          function_name: value.function_name,
          args: argsToScVals,
          resource_fee: BASE_FEE, // bogus resource fee for simulation purpose
        },
      },
      networkPassphrase,
    });

    return { xdr: builtXdr.toXDR(), error: "" };
  } catch (e: any) {
    return { xdr: "", error: e.message };
  }
};

const isMap = (arg: any) => {
  try {
    return (
      Array.isArray(arg) &&
      arg.every((obj: any) => {
        // Check if object has exactly two keys: "0" and "1"
        const keys = Object.keys(obj);
        if (keys.length !== 2 || !keys.includes("0") || !keys.includes("1")) {
          return false;
        }

        // Check if "0" key has value and type
        if (
          !obj["0"] ||
          typeof obj["0"] !== "object" ||
          !("value" in obj["0"]) ||
          !("type" in obj["0"])
        ) {
          return false;
        }

        // "1" can be either a simple value with type, or a complex value (array, enum, etc)
        return true;
      })
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e: any) {
    return false;
  }
};

const getScValFromArg = (arg: any, scVals: xdr.ScVal[]): xdr.ScVal => {
  // Handle array of arrays with numeric objects
  if (Array.isArray(arg) && arg.length > 0) {
    const arrayScVals = arg.map((subArray) => {
      if (Array.isArray(subArray) && isMap(subArray)) {
        const { mapVal, mapType } = convertObjectToMap(subArray);

        if (Object.keys(mapVal).length > 1) {
          const items = Object.keys(mapVal);

          const mapScValOne = nativeToScVal(mapVal[items[0]], {
            type: mapType[items[0]],
          });

          scVals.push(mapScValOne);

          const mapScValTwo = nativeToScVal(mapVal[items[1]], {
            type: mapType[items[1]],
          });

          scVals.push(mapScValTwo);
        }

        return nativeToScVal(mapVal, { type: mapType });
      }
      return getScValFromArg(subArray, scVals);
    });

    return xdr.ScVal.scvVec(arrayScVals);
  }

  return getScValsFromArgs([arg], scVals || [])[0];
};

const convertValuesToScVals = (
  values: any[],
  scVals: xdr.ScVal[],
): xdr.ScVal[] => {
  return values.map((v) => {
    return getScValFromArg(v, scVals);
  });
};

const convertEnumToScVal = (obj: Record<string, any>, scVals?: xdr.ScVal[]) => {
  // Tuple Case
  if (obj.tag && obj.values) {
    const tagVal = nativeToScVal(obj.tag, { type: "symbol" });
    const valuesVal = convertValuesToScVals(obj.values, scVals || []);
    const tupleScValsVec = xdr.ScVal.scvVec([tagVal, ...valuesVal]);

    return tupleScValsVec;
  }

  // Enum Integer Variant Case
  if (obj.enum) {
    return nativeToScVal(obj.enum, { type: "u32" });
  }

  if (!obj.tag) {
    // If no tag is present, we assume it's a primitive value
    return getScValFromArg(obj, scVals || []);
  }

  // Enum Case Unit Case
  const tagVec = [obj.tag];
  return nativeToScVal(tagVec, { type: "symbol" });
};

const convertObjectToScVal = (obj: Record<string, any>): xdr.ScVal => {
  const convertedValue: Record<string, any> = {};
  const typeHints: Record<string, any> = {};
  // obj input example:
  //  {
  //    "address": {
  //      "value": "CDVQVKOY2YSXS2IC7KN6MNASSHPAO7UN2UR2ON4OI2SKMFJNVAMDX6DP",
  //      "type": "Address"
  //    },
  //    "amount": {
  //      "value": "2",
  //      "type": "I128"
  //    },
  //    "request_type": {
  //      "value": "4",
  //      "type": "U32"
  //    }
  //  }

  //  for an array of objects, `nativeToScVal` expects the following type for `val`:
  //  https://stellar.github.io/js-stellar-sdk/global.html#nativeToScVal
  //  {
  //     "address": "CDVQVKOY2YSXS2IC7KN6MNASSHPAO7UN2UR2ON4OI2SKMFJNVAMDX6DP",
  //     "amount": "2",
  //     "request_type": "2"
  //  }
  //  for `type`, it expects the following type:
  //   {
  //     "address": [
  //       "symbol", // matching the key type
  //       "address" // matching the value type
  //     ],
  //     "amount": [
  //       "symbol", // matching the key type
  //       "i128" // matching the value type
  //     ],
  //     "request_type": [
  //       "symbol", // matching the key type
  //       "u32" // matching the value type
  //     ]
  //  }

  for (const key in obj) {
    if (obj[key].type === "bool") {
      convertedValue[key] = obj[key].value === "true" ? true : false;
      typeHints[key] = ["symbol"];
    } else {
      convertedValue[key] = obj[key].value;
      typeHints[key] = ["symbol", obj[key].type];
    }
  }

  return nativeToScVal(convertedValue, { type: typeHints });
};

const convertObjectToMap = (
  mapArray: any,
): { mapVal: Record<string, any>; mapType: Record<string, any> } => {
  const mapVal = mapArray.reduce((acc: any, pair: any) => {
    if (Array.isArray(pair["1"])) {
      const valueScVal = getScValFromArg(pair["1"], []);
      acc[pair["0"].value] = valueScVal;
    } else {
      acc[pair["0"].value] = pair["1"].value === "true" ? true : false;
    }
    return acc;
  }, {});

  const mapType = mapArray.reduce((acc: any, pair: any) => {
    acc[pair["0"].value] = [pair["0"].type, pair["1"].type];
    return acc;
  }, {});

  return { mapVal, mapType };
};

// Helper function to detect if string is base64 or hex
const detectBytesEncoding = (value: string): "base64" | "hex" => {
  const hexRegex = /^[0-9a-fA-F]+$/;
  const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;

  if (hexRegex.test(value) && value.length % 2 === 0) {
    return "hex";
  }

  if (base64Regex.test(value) && value.length % 4 === 0) {
    try {
      const decoded = Buffer.from(value, "base64");
      return decoded.toString("base64").replace(/=+$/, "") ===
        value.replace(/=+$/, "")
        ? "base64"
        : "hex";
    } catch {
      return "hex";
    }
  }

  return "base64";
};

const convertTupleToScVal = (tupleArray: any) => {
  const tupleScVals = tupleArray.map((v: { value: any; type: any }) => {
    if (v.type === "bool") {
      const boolValue = v.value === "true" ? true : false;
      return nativeToScVal(boolValue);
    }
    if (v.type === "bytes") {
      const encoding = detectBytesEncoding(v.value);
      return nativeToScVal(new Uint8Array(Buffer.from(v.value, encoding)));
    }
    return nativeToScVal(v.value, { type: v.type });
  });

  // JS SDK's nativeToScval doesn't support an array of different types
  // so we need to use xdr.ScVal.scvVec
  return xdr.ScVal.scvVec(tupleScVals);
};

const getScValFromPrimitive = (v: any) => {
  if (v.type === "bool") {
    const boolValue = v.value === "true" ? true : false;
    return nativeToScVal(boolValue);
  }
  if (v.type === "bytes") {
    const encoding = detectBytesEncoding(v.value);
    return nativeToScVal(new Uint8Array(Buffer.from(v.value, encoding)));
  }
  return nativeToScVal(v.value, { type: v.type });
};

export const getScValsFromArgs = (
  args: SorobanInvokeValue["args"],
  scVals: xdr.ScVal[] = [],
): xdr.ScVal[] => {
  // Primitive Case
  if (Object.values(args).every((v: any) => v.type && v.value)) {
    const primitiveScVals = Object.values(args).map((v) => {
      return getScValFromPrimitive(v);
    });

    return primitiveScVals;
  }

  // Enum (Void and Complex One Like Tuple) Case
  if (Object.values(args).some((v) => v.tag || v.enum)) {
    // Check if we have mixed primitive and enum arguments
    const hasEnums = Object.values(args).some((v) => v.tag || v.enum);
    const hasPrimitives = Object.values(args).some((v) => v.type && v.value);

    if (hasEnums && hasPrimitives) {
      // Handle mixed case - return separate arguments
      const mixedScVals = Object.values(args).map((v) => {
        if (v.tag || v.enum) {
          return convertEnumToScVal(v, scVals);
        } else if (v.type && v.value) {
          return getScValFromPrimitive(v);
        }
        return v;
      });

      return mixedScVals;
    }

    // Handle pure enum case
    const enumScVals = Object.values(args).map((v) => {
      return convertEnumToScVal(v, scVals);
    });

    return enumScVals;
  }

  for (const argKey in args) {
    const argValue = args[argKey];

    // Check if it's an array of map objects
    if (Array.isArray(argValue)) {
      // Map Case
      if (isMap(argValue)) {
        const { mapVal, mapType } = convertObjectToMap(argValue);
        const mapScVal = nativeToScVal(mapVal, { type: mapType });
        scVals.push(mapScVal);
        return scVals;
      }

      // Vec Case #1: array of objects or complicated tuple case
      if (argValue.some((v) => typeof Object.values(v)[0] === "object")) {
        const arrayScVals = argValue.map((v) => {
          if (v.tag) {
            return convertEnumToScVal(v, scVals);
          }
          return convertObjectToScVal(v);
        });

        const tupleScValsVec = xdr.ScVal.scvVec(arrayScVals);

        scVals.push(tupleScValsVec);
        return scVals;
      }

      // Vec Case #2: array of primitives
      const isVecArray = argValue.every((v) => {
        return v.type === argValue[0].type;
      });

      if (isVecArray) {
        const arrayScVals = argValue.reduce((acc, v) => {
          if (v.type === "bool") {
            acc.push(v.value === "true" ? true : false);
          } else if (v.type === "bytes") {
            const encoding = detectBytesEncoding(v.value);
            acc.push(new Uint8Array(Buffer.from(v.value, encoding)));
          } else {
            acc.push(v.value);
          }
          return acc;
        }, []);

        const scVal = nativeToScVal(arrayScVals, {
          type: argValue[0].type,
        });

        scVals.push(scVal);
        return scVals;
      }

      // Tuple Case
      const isTupleArray = argValue.every((v: any) => v.type && v.value);
      if (isTupleArray) {
        const tupleScValsVec = convertTupleToScVal(argValue);

        scVals.push(tupleScValsVec);
        return scVals;
      }
    }

    // Object Case
    if (Object.values(argValue).every((v: any) => v.type && v.value)) {
      const convertedObj = convertObjectToScVal(argValue);
      scVals.push(nativeToScVal(convertedObj));
      return scVals;
    }

    if (argValue.type && argValue.value) {
      scVals.push(getScValFromPrimitive(argValue));
    }
  }

  return scVals;
};

// supports building xdr.SorobanTransactionData that
// will be included in TransactionBuilder.setSorobanData()
// used in "extend_footprint_ttl" and "restore_footprint" operation
// https://stellar.github.io/js-stellar-sdk/SorobanDataBuilder.html
const buildSorobanData = ({
  readOnlyXdrLedgerKey = [],
  readWriteXdrLedgerKey = [],
  resourceFee,
  //   instructions
  //   ReadableByteStreamController,
}: {
  readOnlyXdrLedgerKey?: xdr.LedgerKey[];
  readWriteXdrLedgerKey?: xdr.LedgerKey[];
  resourceFee: string;
}) => {
  return new SorobanDataBuilder()
    .setReadOnly(readOnlyXdrLedgerKey)
    .setReadWrite(readWriteXdrLedgerKey)
    .setResourceFee(resourceFee)
    .build();
};

export const convertSpecTypeToScValType = (type: string) => {
  switch (type) {
    case "Address":
      return "address";
    case "U32":
      return "u32";
    case "U64":
      return "u64";
    case "U128":
      return "u128";
    case "U256":
      return "u256";
    case "I32":
      return "i32";
    case "I64":
      return "i64";
    case "I128":
      return "i128";
    case "I256":
      return "i256";
    case "ScString":
      return "string";
    case "ScSymbol":
      return "symbol";
    case "DataUrl":
      return "bytes";
    case "Bool":
      return "bool";
    default:
      return type;
  }
};
