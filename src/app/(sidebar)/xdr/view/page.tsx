"use client";

import { useEffect } from "react";
import {
  Text,
  Card,
  Alert,
  Link,
  Loader,
  Button,
  Icon,
  Input,
} from "@stellar/design-system";
import { TransactionBuilder } from "@stellar/stellar-sdk";
import { useQueryClient } from "@tanstack/react-query";
import { stringify } from "lossless-json";

import { useLatestTxn } from "@/query/useLatestTxn";
import { XDR_TYPE_TRANSACTION_ENVELOPE } from "@/constants/settings";

import { Box } from "@/components/layout/Box";
import { SdsLink } from "@/components/SdsLink";
import { XdrPicker } from "@/components/FormElements/XdrPicker";
import { XdrTypeSelect } from "@/components/XdrTypeSelect";
import { PrettyJsonTransaction } from "@/components/PrettyJsonTransaction";
import { TransactionHashReadOnlyField } from "@/components/TransactionHashReadOnlyField";
import { LabelHeading } from "@/components/LabelHeading";
import { CopyJsonPayloadButton } from "@/components/CopyJsonPayloadButton";

import * as StellarXdr from "@/helpers/StellarXdr";
import { parseToLosslessJson } from "@/helpers/parseToLosslessJson";
import { delayedAction } from "@/helpers/delayedAction";
import { getNetworkHeaders } from "@/helpers/getNetworkHeaders";
import { useIsXdrInit } from "@/hooks/useIsXdrInit";
import { useStore } from "@/store/useStore";

export default function ViewXdr() {
  const { xdr, network } = useStore();
  const { updateXdrBlob, updateXdrType, resetXdr } = xdr;

  const isXdrInit = useIsXdrInit();

  const {
    data: latestTxn,
    error: latestTxnError,
    isSuccess: isLatestTxnSuccess,
    isFetching: isLatestTxnFetching,
    isLoading: isLatestTxnLoading,
    refetch: fetchLatestTxn,
  } = useLatestTxn(network.horizonUrl, getNetworkHeaders(network, "horizon"));

  const queryClient = useQueryClient();

  useEffect(() => {
    if (isLatestTxnSuccess && latestTxn) {
      updateXdrBlob(latestTxn);
      updateXdrType(XDR_TYPE_TRANSACTION_ENVELOPE);
    }
  }, [isLatestTxnSuccess, latestTxn, updateXdrBlob, updateXdrType]);

  const isFetchingLatestTxn = isLatestTxnFetching || isLatestTxnLoading;

  const xdrDecodeJson = () => {
    if (!(isXdrInit && xdr.blob && xdr.type)) {
      return null;
    }

    try {
      const xdrJson = StellarXdr.decode(xdr.type, xdr.blob);

      return {
        jsonString: xdrJson,
        error: "",
      };
    } catch (e) {
      return {
        jsonString: "",
        error: `Unable to decode input as ${xdr.type}: ${e}. Select another XDR type.`,
      };
    }
  };

  const xdrJsonDecoded = xdrDecodeJson();

  const txnFromXdr = () => {
    try {
      return xdrJsonDecoded?.jsonString
        ? TransactionBuilder.fromXDR(xdr.blob, network.passphrase)
        : null;
    } catch (e) {
      return null;
    }
  };

  const txn = txnFromXdr();

  const prettifyJsonString = (jsonString: string): string => {
    try {
      const parsedJson = parseToLosslessJson(jsonString);
      return stringify(parsedJson, null, 2) || "";
    } catch (e) {
      return jsonString;
    }
  };

  const renderClaimableBalanceIds = () => {
    if (!txn) {
      return null;
    }

    const createClaimableBalanceIds = txn.operations.reduce(
      (res, curOp, curIdx) => {
        if (curOp.type === "createClaimableBalance") {
          return [
            ...res,
            { opIdx: curIdx, cbId: (txn as any).getClaimableBalanceId(curIdx) },
          ];
        }

        return res;
      },
      [] as { opIdx: number; cbId: string }[],
    );

    if (createClaimableBalanceIds.length > 0) {
      const labelText =
        createClaimableBalanceIds.length === 1
          ? "a Create Claimable Balance operation"
          : "Create Claimable Balance operations";

      const idText = createClaimableBalanceIds.length === 1 ? "ID" : "IDs";

      return (
        <Box gap="sm">
          <LabelHeading size="md">{`This transaction contains ${labelText} with the following ${idText}`}</LabelHeading>
          <>
            {createClaimableBalanceIds.map((op) => {
              const id = `view-xdr-ccb-op-${op.cbId}`;

              return (
                <Input
                  key={id}
                  id={id}
                  fieldSize="md"
                  value={op.cbId}
                  disabled
                  copyButton={{ position: "right" }}
                  leftElement={`Operation ${op.opIdx}`}
                />
              );
            })}
          </>
        </Box>
      );
    }

    return null;
  };

  return (
    <Box gap="md">
      <div className="PageHeader">
        <Text size="md" as="h1" weight="medium">
          View XDR
        </Text>
      </div>

      <Card>
        <Box gap="lg">
          <XdrPicker
            id="view-xdr-blob"
            label="Base-64 encoded XDR"
            value={xdr.blob}
            hasCopyButton
            note={
              <>
                Input a base-64 encoded XDR blob,{" "}
                <Link
                  onClick={() => {
                    if (latestTxn) {
                      // Reset query to clear old data
                      queryClient.resetQueries({
                        queryKey: ["xdr", "latestTxn"],
                        exact: true,
                      });
                      updateXdrBlob("");
                    }

                    delayedAction({
                      action: () => {
                        fetchLatestTxn();
                      },
                      delay: 500,
                    });
                  }}
                  isDisabled={isFetchingLatestTxn}
                  icon={isFetchingLatestTxn ? <Loader /> : null}
                >
                  or fetch the latest transaction to try it out.
                </Link>
              </>
            }
            onChange={(e) => {
              updateXdrBlob(e.target.value);
            }}
            error={latestTxnError?.toString()}
            disabled={isFetchingLatestTxn}
          />

          <TransactionHashReadOnlyField
            xdr={xdr.blob}
            networkPassphrase={network.passphrase}
          />

          <XdrTypeSelect error={xdrJsonDecoded?.error} />

          <>
            {!xdr.blob || !xdr.type ? (
              <Text as="div" size="sm">
                {!xdr.blob
                  ? "Enter a base-64 encoded XDR blob to decode."
                  : "Please select a XDR type"}
              </Text>
            ) : null}
          </>

          <Box gap="lg" direction="row" align="center" justify="end">
            <Button
              size="md"
              variant="error"
              icon={<Icon.RefreshCw01 />}
              onClick={() => {
                resetXdr();
              }}
              disabled={!xdr.blob}
            >
              Clear XDR
            </Button>
          </Box>

          <>
            {xdrJsonDecoded?.jsonString ? (
              <Box gap="lg">
                <>{renderClaimableBalanceIds()}</>

                <div className="PageBody__content PageBody__scrollable">
                  <PrettyJsonTransaction
                    json={parseToLosslessJson(xdrJsonDecoded.jsonString)}
                    xdr={xdr.blob}
                  />
                </div>

                <Box gap="md" direction="row" justify="end">
                  <CopyJsonPayloadButton
                    jsonString={prettifyJsonString(xdrJsonDecoded.jsonString)}
                  />
                </Box>
              </Box>
            ) : null}
          </>
        </Box>
      </Card>

      <Alert variant="primary" placement="inline">
        You can use use this tool to decode XDR into JSON.{" "}
        <SdsLink href="https://developers.stellar.org/docs/encyclopedia/xdr">
          External Data Representation
        </SdsLink>{" "}
        (XDR) is a standardized protocol that the Stellar network uses to encode
        data. The XDR Viewer is a tool that displays contents of a Stellar XDR
        blob in a human-readable format.
      </Alert>
    </Box>
  );
}
