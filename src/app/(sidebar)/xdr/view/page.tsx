"use client";

import { useEffect } from "react";
import {
  Text,
  Alert,
  Link,
  Loader,
  Button,
  Icon,
  Input,
} from "@stellar/design-system";
import { TransactionBuilder } from "@stellar/stellar-sdk";
import { useQueryClient } from "@tanstack/react-query";

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
import { PageCard } from "@/components/layout/PageCard";
import { JsonCodeWrapToggle } from "@/components/JsonCodeWrapToggle";

import * as StellarXdr from "@/helpers/StellarXdr";
import { parseToLosslessJson } from "@/helpers/parseToLosslessJson";
import { delayedAction } from "@/helpers/delayedAction";
import { getNetworkHeaders } from "@/helpers/getNetworkHeaders";
import { prettifyJsonString } from "@/helpers/prettifyJsonString";

import { useIsXdrInit } from "@/hooks/useIsXdrInit";
import { useCodeWrappedSetting } from "@/hooks/useCodeWrappedSetting";
import { useStore } from "@/store/useStore";

import { trackEvent, TrackingEvent } from "@/metrics/tracking";
import { AnyObject } from "@/types/types";

export default function ViewXdr() {
  const { xdr, network } = useStore();
  const { updateXdrBlob, updateXdrType, resetXdr } = xdr;

  const isXdrInit = useIsXdrInit();
  const [isCodeWrapped, setIsCodeWrapped] = useCodeWrappedSetting();

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

  const maybeStreamXdr = (
    xdrType: string,
    xdrString: string,
    originalError: any,
  ) => {
    try {
      const streamXdrJson = StellarXdr.decode_stream(xdrType, xdrString);

      trackEvent(TrackingEvent.XDR_TO_JSON_STREAM_SUCCESS, {
        xdrType: xdr.type,
      });

      return {
        jsonString: JSON.stringify(streamXdrJson),
        jsonArray: streamXdrJson.map((s) => parseToLosslessJson(s)),
        error: "",
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      trackEvent(TrackingEvent.XDR_FROM_JSON_ERROR, { xdrType: xdr.type });

      // If the stream fails, assume that the XDR is invalid and return the original error.
      return {
        jsonString: "",
        error: `Unable to decode input as ${xdrType}: ${originalError}. Select another XDR type.`,
      };
    }
  };

  const xdrDecodeJson = () => {
    if (!(isXdrInit && xdr.blob && xdr.type)) {
      return null;
    }

    try {
      const xdrJson = StellarXdr.decode(xdr.type, xdr.blob);

      trackEvent(TrackingEvent.XDR_TO_JSON_SUCCESS, { xdrType: xdr.type });

      return {
        jsonString: xdrJson,
        jsonArray: [parseToLosslessJson(xdrJson)],
        error: "",
      };
    } catch (e) {
      // It's possible that the XDR is a stream
      return maybeStreamXdr(xdr.type, xdr.blob, e);
    }
  };

  const xdrJsonDecoded = xdrDecodeJson();

  const txnFromXdr = () => {
    try {
      return xdrJsonDecoded?.jsonString
        ? TransactionBuilder.fromXDR(xdr.blob, network.passphrase)
        : null;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return null;
    }
  };

  const txn = txnFromXdr();

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
        <Box gap="sm" data-testid="view-xdr-claimable-balance-container">
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

  const renderJsonContent = ({
    jsonArray,
    xdr,
  }: {
    jsonArray: AnyObject[];
    xdr: string;
  }) => {
    if (jsonArray.length > 1) {
      return (
        <div className="PrettyJson PrettyJson__array">
          <div className="PrettyJson__inline">
            <span className="PrettyJson__bracket">[</span>
            <span className="PrettyJson__expandSize">{`${jsonArray.length} items`}</span>
          </div>
          {jsonArray.map((j, index) => (
            <>
              <PrettyJsonTransaction
                // Using index here because we can't get something unique from the JSON
                key={`pretty-json-${index}`}
                json={j}
                xdr={xdr}
                isCodeWrapped={isCodeWrapped}
              />
            </>
          ))}
          <span className="PrettyJson__bracket">]</span>
        </div>
      );
    }

    if (jsonArray.length === 1) {
      return (
        <PrettyJsonTransaction
          json={jsonArray[0]}
          xdr={xdr}
          isCodeWrapped={isCodeWrapped}
        />
      );
    }

    return null;
  };

  return (
    <Box gap="md">
      <PageCard heading="View XDR">
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
                        trackEvent(TrackingEvent.XDR_TO_JSON_FETCH_XDR);
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
                trackEvent(TrackingEvent.XDR_TO_JSON_CLEAR);
              }}
              disabled={!xdr.blob}
            >
              Clear XDR
            </Button>
          </Box>

          <>
            {xdrJsonDecoded?.jsonString && xdrJsonDecoded?.jsonArray ? (
              <Box gap="lg">
                <>{renderClaimableBalanceIds()}</>

                <div
                  className="PageBody__content PageBody__scrollable"
                  data-testid="view-xdr-render-json"
                >
                  {renderJsonContent({
                    jsonArray: xdrJsonDecoded.jsonArray,
                    xdr: xdr.blob,
                  })}
                </div>

                <Box
                  gap="md"
                  direction="row"
                  justify="space-between"
                  align="center"
                >
                  <JsonCodeWrapToggle
                    isChecked={isCodeWrapped}
                    onChange={(isChecked) => {
                      setIsCodeWrapped(isChecked);
                    }}
                  />

                  <CopyJsonPayloadButton
                    jsonString={prettifyJsonString(xdrJsonDecoded.jsonString)}
                  />
                </Box>
              </Box>
            ) : null}
          </>
        </Box>
      </PageCard>

      <Alert variant="primary" placement="inline">
        <div>
          You can use use this tool to decode XDR into JSON.{" "}
          <SdsLink href="https://developers.stellar.org/docs/encyclopedia/xdr">
            XDR (External Data Representation)
          </SdsLink>{" "}
          is a standardized data format that the Stellar network uses to encode
          data. The XDR ⇄ JSON tool helps you convert Stellar XDR blobs into a
          human-readable JSON format, and vice versa.
        </div>

        <div>
          To learn more about converting between XDR and JSON, including
          libraries for JavaScript (npm), Go, and Rust, check out the{" "}
          <SdsLink href="https://developers.stellar.org/docs/learn/encyclopedia/data-format/xdr-json">
            XDR ⇄ JSON guide
          </SdsLink>{" "}
          on the Stellar Developer Docs. To see the XDR ⇄ JSON conversion
          specification, please see{" "}
          <SdsLink href="https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0051.md">
            SEP-51 XDR-JSON
          </SdsLink>
          .
        </div>
      </Alert>
    </Box>
  );
}
