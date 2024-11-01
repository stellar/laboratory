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
  CopyText,
} from "@stellar/design-system";
import { useQueryClient } from "@tanstack/react-query";
import { stringify } from "lossless-json";

import { useLatestTxn } from "@/query/useLatestTxn";
import * as StellarXdr from "@/helpers/StellarXdr";
import { XDR_TYPE_TRANSACTION_ENVELOPE } from "@/constants/settings";

import { Box } from "@/components/layout/Box";
import { SdsLink } from "@/components/SdsLink";
import { XdrPicker } from "@/components/FormElements/XdrPicker";
import { XdrTypeSelect } from "@/components/XdrTypeSelect";
import { PrettyJsonTransaction } from "@/components/PrettyJsonTransaction";
import { TransactionHashReadOnlyField } from "@/components/TransactionHashReadOnlyField";

import { parseToLosslessJson } from "@/helpers/parseToLosslessJson";
import { useIsXdrInit } from "@/hooks/useIsXdrInit";
import { useStore } from "@/store/useStore";
import { delayedAction } from "@/helpers/delayedAction";

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
  } = useLatestTxn(network.horizonUrl);

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
        error: `Unable to decode input as ${xdr.type}: ${e}`,
      };
    }
  };

  const xdrJsonDecoded = xdrDecodeJson();

  const prettifyJsonString = (jsonString: string): string => {
    try {
      const parsedJson = parseToLosslessJson(jsonString);
      return stringify(parsedJson, null, 2) || "";
    } catch (e) {
      return jsonString;
    }
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
                <div className="PageBody__content PageBody__scrollable">
                  <PrettyJsonTransaction
                    json={parseToLosslessJson(xdrJsonDecoded.jsonString)}
                    xdr={xdr.blob}
                  />
                </div>

                <Box gap="md" direction="row" justify="end">
                  <CopyText
                    textToCopy={prettifyJsonString(xdrJsonDecoded.jsonString)}
                  >
                    <Button
                      size="md"
                      variant="tertiary"
                      icon={<Icon.Copy01 />}
                      iconPosition="left"
                    >
                      Copy JSON
                    </Button>
                  </CopyText>
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
