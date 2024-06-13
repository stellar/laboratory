"use client";

import { useState } from "react";
import { Button, Card, Text } from "@stellar/design-system";
import { Horizon, TransactionBuilder } from "@stellar/stellar-sdk";

import { useStore } from "@/store/useStore";

import * as StellarXdr from "@/helpers/StellarXdr";

import { useIsXdrInit } from "@/hooks/useIsXdrInit";

import { TransactionResponse, useSubmitTx } from "@/query/useSubmitTx";

import { Box } from "@/components/layout/Box";
import { PrettyJson } from "@/components/PrettyJson";
import { Tabs } from "@/components/Tabs";
import { XdrPicker } from "@/components/FormElements/XdrPicker";
import { ValidationResponseCard } from "@/components/ValidationResponseCard";
import { ErrorResponse } from "./components/ErrorResponse";

export default function SubmitTransaction() {
  const { network, transaction } = useStore();
  const { updateXdrBlob, submit } = transaction;

  const { xdrBlob } = submit;

  const isXdrInit = useIsXdrInit();

  const [activeTab, setActiveTab] = useState<string>("json");
  const [txErr, setTxErr] = useState<any | null>(null);
  const [txResponse, setTxResponse] = useState<TransactionResponse | null>(
    null,
  );

  const submitTx = useSubmitTx();

  const onSubmit = () => {
    const transaction = TransactionBuilder.fromXDR(xdrBlob, network.passphrase);

    const server = new Horizon.Server(network.horizonUrl, {
      appName: "Laboratory",
    });

    submitTx.mutate(
      { transaction, server },
      {
        onSuccess: (res) => setTxResponse(res),
        onError: (res) => setTxErr(res),
      },
    );
  };

  const xdrDecodeJson = () => {
    const xdrType = "TransactionEnvelope";

    if (!(isXdrInit && xdrBlob)) {
      return null;
    }

    try {
      const xdrJson = StellarXdr.decode(xdrType, xdrBlob);

      return {
        jsonString: xdrJson,
        error: "",
      };
    } catch (e) {
      return {
        jsonString: "",
        error: `Unable to decode input as TransactionEnvelope`,
      };
    }
  };

  const xdrJsonDecoded = xdrDecodeJson();
  const isXdrData = Boolean(xdrJsonDecoded?.jsonString);

  return (
    <Box gap="md">
      <div className="PageHeader">
        <Text size="md" as="h1" weight="medium">
          Submit Transaction
        </Text>
      </div>
      <Card>
        <div className="SignTx__xdr">
          <XdrPicker
            id="submit-tx-xdr"
            label="Input a base-64 encoded TransactionEnvelope:"
            value={xdrBlob}
            error={xdrJsonDecoded?.error || ""}
            onChange={(e) => {
              updateXdrBlob(e.target.value);
            }}
            note="Enter a base-64 encoded XDR blob to decode."
            hasCopyButton
          />

          <div className="SignTx__CTA">
            <Button
              disabled={!xdrBlob || Boolean(xdrJsonDecoded?.error)}
              isLoading={submitTx.status === "pending"}
              size="md"
              variant={"secondary"}
              onClick={onSubmit}
            >
              Submit transaction
            </Button>
          </div>

          <Box gap="lg" direction="row" align="center" justify="end">
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
        </div>
      </Card>
      <>
        {submitTx.status === "success" && txResponse ? (
          <ValidationResponseCard
            variant="success"
            title="Transaction submitted!"
            subtitle={`Transaction succeeded with ${txResponse.operation_count} operation(s)`}
            response={
              <Box gap="xs">
                <div>
                  <div>Hash:</div>
                  <div>{txResponse.hash}</div>
                </div>
                <div>
                  <div>Ledger number:</div>
                  <div>{txResponse.ledger}</div>
                </div>
                <div>
                  <div>Paging token:</div>
                  <div>{txResponse.paging_token}</div>
                </div>
                <div>
                  <div>Result XDR:</div>
                  <div>{txResponse.result_xdr}</div>
                </div>
                <div>
                  <div>Result Meta XDR:</div>
                  <div>{txResponse.result_meta_xdr}</div>
                </div>
                <div>
                  <div>Fee Meta XDR:</div>
                  <div>{txResponse.fee_meta_xdr}</div>
                </div>
              </Box>
            }
            // @TODO: the current lab doesn't support displaying stellar.expert
            // To confirm with Charles
            // note={<></>}
            // footerLeftEl={
            //   <Button
            //     size="md"
            //     variant="tertiary"
            //     onClick={() => {
            //       alert("TODO: handle sign transaction flow");
            //     }}
            //   >
            //     View on stellar.expert
            //   </Button>
            // }
          />
        ) : null}
      </>
      <>
        {submitTx.status === "error" && txErr ? (
          <ErrorResponse error={txErr} />
        ) : null}
      </>
    </Box>
  );
}
