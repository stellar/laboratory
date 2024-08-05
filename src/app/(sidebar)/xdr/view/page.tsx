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
import { useLatestTxn } from "@/query/useLatestTxn";
import * as StellarXdr from "@/helpers/StellarXdr";

import { Box } from "@/components/layout/Box";
import { SdsLink } from "@/components/SdsLink";
import { XdrPicker } from "@/components/FormElements/XdrPicker";
import { PrettyJson } from "@/components/PrettyJson";
import { XdrTypeSelect } from "@/components/XdrTypeSelect";

import { useIsXdrInit } from "@/hooks/useIsXdrInit";
import { useStore } from "@/store/useStore";
import { trackEvent, TrackingEvent } from "@/metrics/tracking";

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

  useEffect(() => {
    if (isLatestTxnSuccess && latestTxn) {
      updateXdrBlob(latestTxn);
      updateXdrType("TransactionEnvelope");
    }
  }, [isLatestTxnSuccess, latestTxn, updateXdrBlob, updateXdrType]);

  const isFetchingLatestTxn = isLatestTxnFetching || isLatestTxnLoading;

  const xdrDecodeJson = () => {
    if (!(isXdrInit && xdr.blob && xdr.type)) {
      return null;
    }

    try {
      const xdrJson = StellarXdr.decode(xdr.type, xdr.blob);

      trackEvent(TrackingEvent.XDR_TO_JSON_SUCCESS, {
        network: network.id,
        xdrType: xdr.type,
      });

      return {
        jsonString: xdrJson,
        error: "",
      };
    } catch (e) {
      trackEvent(TrackingEvent.XDR_TO_JSON_ERROR, {
        network: network.id,
        xdrType: xdr.type,
      });

      return {
        jsonString: "",
        error: `Unable to decode input as ${xdr.type}: ${e}`,
      };
    }
  };

  const xdrJsonDecoded = xdrDecodeJson();

  const prettifyJsonString = (jsonString: string): string => {
    try {
      const parsedJson = JSON.parse(jsonString);
      return JSON.stringify(parsedJson, null, 2);
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
            label="Transaction XDR"
            value={xdr.blob}
            hasCopyButton
            note={
              <>
                Input a base-64 encoded XDR blob,{" "}
                <Link
                  onClick={() => {
                    fetchLatestTxn();
                    trackEvent(TrackingEvent.XDR_TO_JSON_FETCH_XDR, {
                      network: network.id,
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
            {xdrJsonDecoded?.jsonString ? (
              <Box gap="lg">
                <div className="PageBody__content PageBody__scrollable">
                  <PrettyJson json={JSON.parse(xdrJsonDecoded.jsonString)} />
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
