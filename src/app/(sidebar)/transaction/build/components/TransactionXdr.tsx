"use client";

import { useEffect, useState } from "react";
import { Button } from "@stellar/design-system";
import { stringify } from "lossless-json";
import { StrKey, TransactionBuilder } from "@stellar/stellar-sdk";
import * as StellarXdr from "@/helpers/StellarXdr";

import { SdsLink } from "@/components/SdsLink";
import { ValidationResponseCard } from "@/components/ValidationResponseCard";
import { Box } from "@/components/layout/Box";

import { isEmptyObject } from "@/helpers/isEmptyObject";
import { xdrUtils } from "@/helpers/xdr/utils";
import { optionsFlagDetails } from "@/helpers/optionsFlagDetails";

import { useStore } from "@/store/useStore";
import { Routes } from "@/constants/routes";
import {
  OPERATION_CLEAR_FLAGS,
  OPERATION_SET_FLAGS,
} from "@/constants/settings";

import {
  AnyObject,
  AssetObjectValue,
  AssetPoolShareObjectValue,
  KeysOfUnion,
  OptionFlag,
  OptionSigner,
  TxnOperation,
} from "@/types/types";

const MAX_INT64 = "9223372036854775807";

export const TransactionXdr = () => {
  const { transaction, network } = useStore();
  const {
    params: txnParams,
    operations: txnOperations,
    isValid,
  } = transaction.build;

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Stellar XDR init
    const init = async () => {
      await StellarXdr.init();
      setIsReady(true);
    };

    init();
  }, []);

  if (!(isReady && isValid.params && isValid.operations)) {
    return null;
  }

  const txnJsonToXdr = () => {
    try {
      // TODO: remove this formatter once Stellar XDR supports strings for numbers.
      // Format values to meet XDR requirements
      const prepTxnParams = Object.entries(txnParams).reduce((res, param) => {
        const key = param[0] as KeysOfUnion<typeof txnParams>;
        // Casting to any type for simplicity
        const value = param[1] as any;

        let val;

        switch (key) {
          case "seq_num":
            val = BigInt(value);
            break;
          case "fee":
            val = BigInt(value) * BigInt(txnOperations.length);
            break;
          case "cond":
            // eslint-disable-next-line no-case-declarations
            const minTime = value?.time?.min_time;
            // eslint-disable-next-line no-case-declarations
            const maxTime = value?.time?.max_time;

            val = {
              time: {
                min_time: minTime ? BigInt(minTime) : 0,
                max_time: maxTime ? BigInt(maxTime) : 0,
              },
            };
            break;
          case "memo":
            // eslint-disable-next-line no-case-declarations
            const memoId = value?.id;

            if (memoId) {
              val = { id: BigInt(memoId) };
            } else {
              val =
                typeof value === "object" && isEmptyObject(value)
                  ? "none"
                  : value;
            }

            break;
          default:
            val = value;
        }

        return { ...res, [key]: val };
      }, {});

      const formatAssetValue = (
        asset: AssetObjectValue | AssetPoolShareObjectValue,
      ): any => {
        let formattedAsset;

        if (asset.type === "native") {
          formattedAsset = "native";
        } else if (
          asset.type &&
          ["credit_alphanum4", "credit_alphanum12"].includes(asset.type)
        ) {
          const assetValue = asset as AssetObjectValue;

          formattedAsset = {
            [asset.type]: {
              asset_code: assetValue.code,
              issuer: assetValue.issuer,
            },
          };
        } else if (asset.type === "liquidity_pool_shares") {
          const assetPoolShareValue = asset as AssetPoolShareObjectValue;

          formattedAsset = {
            pool_share: {
              liquidity_pool_constant_product: {
                asset_a: formatAssetValue(assetPoolShareValue.asset_a),
                asset_b: formatAssetValue(assetPoolShareValue.asset_b),
                fee: 30,
              },
            },
          };
        }

        return formattedAsset;
      };

      const formatAssetMultiValue = (assets: AssetObjectValue[]) => {
        return assets.reduce((res, cur) => {
          if (cur.type === "native") {
            return [...res, "native"];
          } else if (
            cur.type &&
            ["credit_alphanum4", "credit_alphanum12"].includes(cur.type)
          ) {
            return [
              ...res,
              {
                [cur.type]: {
                  asset_code: cur.code,
                  issuer: cur.issuer,
                },
              },
            ];
          }

          return res;
        }, [] as any[]);
      };

      const flagTotal = (val: string[], operations: OptionFlag[]) => {
        const total = optionsFlagDetails(operations, val).total;

        return total > 0 ? BigInt(total) : null;
      };

      const formatSignerValue = (val: OptionSigner | undefined) => {
        if (!val) {
          return null;
        }

        const weight = val?.weight ? BigInt(val.weight) : "";
        let key: string | any = "";

        switch (val.type) {
          case "ed25519PublicKey":
            key = val.key || "";
            break;
          case "sha256Hash":
            key = StrKey.encodeSha256Hash(Buffer.from(val.key || "", "hex"));
            break;
          case "preAuthTx":
            key = StrKey.encodePreAuthTx(Buffer.from(val.key || "", "hex"));
            break;
          default:
          // do nothing
        }

        return { key, weight };
      };

      const formatLimit = (val: string) => {
        if (val === MAX_INT64) {
          return BigInt(val);
        }

        return xdrUtils.toAmount(val);
      };

      const getXdrVal = (key: string, val: any) => {
        switch (key) {
          // Amount
          case "amount":
          case "buy_amount":
          case "starting_balance":
          case "send_amount":
          case "dest_min":
          case "send_max":
          case "dest_amount":
            return xdrUtils.toAmount(val);
          // Asset
          case "asset":
          case "send_asset":
          case "dest_asset":
          case "buying":
          case "selling":
            return formatAssetValue(val);
          // Number
          case "bump_to":
          case "offer_id":
          case "master_weight":
          case "low_threshold":
          case "med_threshold":
          case "high_threshold":
            return BigInt(val);
          // Price
          case "price":
            return xdrUtils.toPrice(val);
          case "data_value":
            return Buffer.from(val).toString("hex");
          case "balance_id":
            return {
              claimable_balance_id_type_v0: val.replace(/^(00000000)/, ""),
            };
          // Path
          case "path":
            return formatAssetMultiValue(val);
          // Flags
          case "clear_flags":
            return flagTotal(val, OPERATION_CLEAR_FLAGS);
          case "set_flags":
            return flagTotal(val, OPERATION_SET_FLAGS);
          // Signer
          case "signer":
            return formatSignerValue(val);
          // Trust line
          case "line":
            return formatAssetValue(val);
          case "limit":
            return formatLimit(val);
          default:
            return val;
        }
      };

      const parseOpParams = ({
        opType,
        params,
      }: {
        opType: string;
        params: AnyObject;
      }) => {
        if (opType === "account_merge") {
          return Object.values(params)[0];
        }

        return Object.entries(params).reduce((res, [key, val]) => {
          res[key] = getXdrVal(key, val);

          return res;
        }, {} as AnyObject);
      };

      const renderTxnBody = (txnOp: TxnOperation) => {
        const op = { ...txnOp };

        if (op.operation_type === "end_sponsoring_future_reserves") {
          return "end_sponsoring_future_reserves";
        }

        if (
          ["path_payment_strict_send", "path_payment_strict_receive"].includes(
            op.operation_type,
          )
        ) {
          if (!op.params.path) {
            op.params = { ...op.params, path: [] };
          }
        }

        if (op.operation_type === "change_trust") {
          return {
            [op.operation_type]: parseOpParams({
              opType: op.operation_type,
              params: { ...op.params, limit: op.params.limit ?? MAX_INT64 },
            }),
          };
        }

        if (op.operation_type === "allow_trust") {
          return {
            [op.operation_type]: {
              trustor: op.params.trustor,
              asset: op.params.assetCode,
              authorize: BigInt(op.params.authorize),
            },
          };
        }

        return {
          [op.operation_type]: parseOpParams({
            opType: op.operation_type,
            params: op.params,
          }),
        };
      };

      const prepTxnOps = txnOperations.map((op) => ({
        source_account: op.source_account || null,
        body: renderTxnBody(op),
      }));

      const txnJson = {
        tx: {
          tx: {
            ...prepTxnParams,
            operations: prepTxnOps,
            ext: "v0",
          },
          signatures: [],
        },
      };

      // TODO: Temp fix until Stellar XDR supports strings for big numbers
      // const jsonString = JSON.stringify(txnJson);
      const jsonString = stringify(txnJson);

      return {
        xdr: StellarXdr.encode("TransactionEnvelope", jsonString || ""),
      };
    } catch (e) {
      return { error: `${e}` };
    }
  };

  const txnXdr = txnJsonToXdr();

  if (txnXdr.error) {
    return (
      <ValidationResponseCard
        variant="error"
        title="Transaction Envelope XDR Error:"
        response={txnXdr.error}
      />
    );
  }

  if (txnXdr.xdr) {
    try {
      const txnHash = TransactionBuilder.fromXDR(txnXdr.xdr, network.passphrase)
        .hash()
        .toString("hex");

      return (
        <ValidationResponseCard
          variant="success"
          title="Success! Transaction Envelope XDR:"
          response={
            <Box gap="xs">
              <div>
                <div>Network Passphrase:</div>
                <div>{network.passphrase}</div>
              </div>
              <div>
                <div>Hash:</div>
                <div>{txnHash}</div>
              </div>
              <div>
                <div>XDR:</div>
                <div>{txnXdr.xdr}</div>
              </div>
            </Box>
          }
          note={
            <>
              In order for the transaction to make it into the ledger, a
              transaction must be successfully signed and submitted to the
              network. The laboratory provides the{" "}
              <SdsLink href={Routes.SIGN_TRANSACTION}>
                Transaction Signer
              </SdsLink>{" "}
              for signing a transaction, and the{" "}
              <SdsLink href={Routes.SUBMIT_TRANSACTION}>
                Post Transaction endpoint
              </SdsLink>{" "}
              for submitting one to the network.
            </>
          }
          footerLeftEl={
            <>
              <Button
                size="md"
                variant="secondary"
                onClick={() => {
                  alert("TODO: handle sign transaction flow");
                }}
              >
                Sign in Transaction Signer
              </Button>
              <Button
                size="md"
                variant="tertiary"
                onClick={() => {
                  alert("TODO: handle view in xdr flow");
                }}
              >
                View in XDR viewer
              </Button>
            </>
          }
        />
      );
    } catch (e: any) {
      return (
        <ValidationResponseCard
          variant="error"
          title="Transaction Error:"
          response={e.toString()}
        />
      );
    }
  }

  return null;
};
