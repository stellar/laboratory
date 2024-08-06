"use client";

import { Button, Card, Text } from "@stellar/design-system";
import { SorobanRpc } from "@stellar/stellar-sdk";

import { useStore } from "@/store/useStore";

import * as StellarXdr from "@/helpers/StellarXdr";

import { useIsXdrInit } from "@/hooks/useIsXdrInit";

import { useSubmitRpcTx } from "@/query/useSubmitRpcTx";

import { Box } from "@/components/layout/Box";
import { PrettyJson } from "@/components/PrettyJson";
import { XdrPicker } from "@/components/FormElements/XdrPicker";
import { ValidationResponseCard } from "@/components/ValidationResponseCard";
import { TxResponse } from "@/components/TxResponse";

import { RpcErrorResponse } from "./components/ErrorResponse";

export default function SubmitTransaction() {
  const { network, xdr } = useStore();
  const { blob, updateXdrBlob } = xdr;

  const isXdrInit = useIsXdrInit();

  const {
    data: submitRpcResponse,
    mutateAsync: submitRpc,
    error: submitRpcError,
    isPending: isSubmitRpcPending,
    isSuccess: isSubmitRpcSuccess,
  } = useSubmitRpcTx();

  const rpcServer = network.rpcUrl
    ? new SorobanRpc.Server(network.rpcUrl)
    : null;

  const onSubmitRpc = () => {
    if (!rpcServer) {
      return;
    }

    submitRpc({
      rpcServer,
      transactionXdr: blob,
      networkPassphrase: network.passphrase,
    });
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
        <Box gap="lg">
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
              disabled={!network.rpcUrl || !blob || Boolean(xdrJson?.error)}
              isLoading={isSubmitRpcPending}
              size="md"
              variant={"secondary"}
              onClick={onSubmitRpc}
            >
              Submit transaction
            </Button>
          </div>

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
        {isSubmitRpcSuccess && submitRpcResponse ? (
          <ValidationResponseCard
            variant="success"
            title="Transaction submitted!"
            subtitle={`Transaction succeeded with ${submitRpcResponse.operationCount} operation(s)`}
            response={
              <Box gap="xs">
                <TxResponse label="Hash:" value={submitRpcResponse.hash} />
                <TxResponse
                  label="Ledger number:"
                  value={submitRpcResponse.result.ledger}
                />
                <TxResponse
                  label="Envelope XDR:"
                  value={submitRpcResponse.result.envelopeXdr
                    .toXDR("base64")
                    .toString()}
                />
                <TxResponse
                  label="Result XDR:"
                  value={submitRpcResponse.result.resultXdr
                    .toXDR("base64")
                    .toString()}
                />
                <TxResponse
                  label="Result Meta XDR:"
                  value={submitRpcResponse.result.resultMetaXdr
                    .toXDR("base64")
                    .toString()}
                />
                <TxResponse label="Fee:" value={submitRpcResponse.fee} />
              </Box>
            }
          />
        ) : null}
      </>
      <>{submitRpcError ? <RpcErrorResponse error={submitRpcError} /> : null}</>
    </Box>
  );
}
