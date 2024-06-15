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
import { XdrPicker } from "@/components/FormElements/XdrPicker";
import { ValidationResponseCard } from "@/components/ValidationResponseCard";
import { ErrorResponse } from "./components/ErrorResponse";

export default function SubmitTransaction() {
  const { network, xdr } = useStore();
  const { blob, updateXdrBlob } = xdr;

  const [txErr, setTxErr] = useState<any | null>(null);
  const [txResponse, setTxResponse] = useState<TransactionResponse | null>(
    null,
  );

  const isXdrInit = useIsXdrInit();
  const submitTx = useSubmitTx();

  const onSubmit = () => {
    const transaction = TransactionBuilder.fromXDR(blob, network.passphrase);

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

  const getXdrJson = () => {
    const xdrType = "TransactionEnvelope";

    if (!(isXdrInit && blob)) {
      return null;
    }

    try {
      const xdrJson = StellarXdr.decode(xdrType, blob);

      return {
        jsonString: xdrJson,
        error: "",
      };
    } catch (e) {
      return {
        jsonString: "",
        error: `Unable to decode input as ${xdrType}`,
      };
    }
  };

  const xdrJson = getXdrJson();

  return (
    <Box gap="md">
      <div className="PageHeader">
        <Text size="md" as="h1" weight="medium">
          Submit Transaction
        </Text>
      </div>
      <Card>
        <Box gap="md">
          <XdrPicker
            id="submit-tx-xdr"
            label="Input a base-64 encoded TransactionEnvelope:"
            value={blob}
            error={xdrJson?.error || ""}
            onChange={(e) => {
              updateXdrBlob(e.target.value);
            }}
            note="Enter a base-64 encoded XDR blob to decode."
            hasCopyButton
          />

          <div className="SignTx__CTA">
            <Button
              disabled={!blob || Boolean(xdrJson?.error)}
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
              {xdrJson?.jsonString ? (
                <div className="Tabs">
                  <div className="Tab" data-is-active="true">
                    JSON
                  </div>
                </div>
              ) : null}
            </div>
          </Box>

          <>
            {xdrJson?.jsonString ? (
              <div className="PageBody__content PageBody__scrollable">
                <PrettyJson json={JSON.parse(xdrJson.jsonString)} />
              </div>
            ) : null}
          </>
        </Box>
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
