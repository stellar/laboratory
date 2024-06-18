"use client";

import { useEffect, useState } from "react";
import {
  Text,
  Card,
  Alert,
  Link,
  Select,
  Loader,
  Button,
  Icon,
} from "@stellar/design-system";
import { xdr as sdkXdr } from "@stellar/stellar-sdk";
import { useLatestTxn } from "@/query/useLatestTxn";
import { functions } from "lodash";
import * as StellarXdr from "@/helpers/StellarXdr";

import { Box } from "@/components/layout/Box";
import { SdsLink } from "@/components/SdsLink";
import { XdrPicker } from "@/components/FormElements/XdrPicker";
import { PrettyJson } from "@/components/PrettyJson";
import { Tabs } from "@/components/Tabs";

import { useIsXdrInit } from "@/hooks/useIsXdrInit";

import { useStore } from "@/store/useStore";

export default function ViewXdr() {
  const { xdr, network } = useStore();
  const { updateXdrBlob, updateXdrType, resetXdr } = xdr;

  const [activeTab, setActiveTab] = useState<string>("json");

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
  const isXdrData = Boolean(xdrJsonDecoded?.jsonString);

  const allXdrTypes = functions(sdkXdr).sort();

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

          <Select
            id="view-xdr-type"
            fieldSize="md"
            label="XDR type"
            value={xdr.type}
            onChange={(e) => {
              updateXdrType(e.target.value);
            }}
            error={xdrJsonDecoded?.error}
          >
            <option value="">Select XDR type</option>
            <optgroup label="Popular">
              <option value="TransactionEnvelope">TransactionEnvelope</option>
              <option value="TransactionResult">TransactionResult</option>
              <option value="TransactionMeta">TransactionMeta</option>
            </optgroup>
            <optgroup label="All">
              {allXdrTypes.map((type) => (
                <option value={type} key={`all-${type}`}>
                  {type}
                </option>
              ))}
            </optgroup>
          </Select>

          <>
            {!xdr.blob || !xdr.type ? (
              <Text as="div" size="sm">
                {!xdr.blob
                  ? "Enter a base-64 encoded XDR blob to decode."
                  : "Please select a XDR type"}
              </Text>
            ) : null}
          </>

          <Box gap="lg" direction="row" align="center" justify="space-between">
            <div>
              {isXdrData ? (
                <Tabs
                  tabs={[
                    { id: "json", label: "JSON" },
                    { id: "decoded", label: "Decoded XDR" },
                  ]}
                  activeTabId={activeTab}
                  onChange={(id) => {
                    setActiveTab(id);
                  }}
                />
              ) : null}
            </div>

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
            {activeTab === "json" && xdrJsonDecoded?.jsonString ? (
              <div className="PageBody__content PageBody__scrollable">
                <PrettyJson json={JSON.parse(xdrJsonDecoded.jsonString)} />
              </div>
            ) : null}

            {activeTab === "decoded" ? (
              <div className="PageBody__content PageBody__scrollable">
                TODO: Decoded XDR
              </div>
            ) : null}
          </>
        </Box>
      </Card>

      <Alert variant="primary" placement="inline">
        You can use use this tool to decode XDR into JSON and into
        human-readable format of XDR (decoded XDR).{" "}
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
