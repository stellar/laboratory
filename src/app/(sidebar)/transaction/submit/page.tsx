"use client";

import { useState } from "react";
import { Button, Card, Icon, Text } from "@stellar/design-system";
import { SorobanRpc } from "@stellar/stellar-sdk";
import { useRouter } from "next/navigation";

import { useStore } from "@/store/useStore";

import * as StellarXdr from "@/helpers/StellarXdr";
import { delayedAction } from "@/helpers/delayedAction";
import { Routes } from "@/constants/routes";
import { XDR_TYPE_TRANSACTION_ENVELOPE } from "@/constants/settings";

import { useIsXdrInit } from "@/hooks/useIsXdrInit";

import { useSubmitRpcTx } from "@/query/useSubmitRpcTx";

import { Box } from "@/components/layout/Box";
import { PrettyJson } from "@/components/PrettyJson";
import { XdrPicker } from "@/components/FormElements/XdrPicker";
import { ValidationResponseCard } from "@/components/ValidationResponseCard";
import { TxResponse } from "@/components/TxResponse";
import { SaveTransactionModal } from "@/components/SaveTransactionModal";

import { RpcErrorResponse } from "./components/ErrorResponse";

export default function SubmitTransaction() {
  const { network, xdr, transaction } = useStore();
  const { blob, updateXdrBlob } = xdr;

  const isXdrInit = useIsXdrInit();
  const router = useRouter();

  const [isSaveTxnModalVisible, setIsSaveTxnModalVisible] = useState(false);

  const {
    data: submitRpcResponse,
    mutate: submitRpc,
    error: submitRpcError,
    isPending: isSubmitRpcPending,
    isSuccess: isSubmitRpcSuccess,
    reset: resetSubmitRpc,
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

  const onSimulateTx = () => {
    transaction.updateSimulateTriggerOnLaunch(true);

    // Adding delay to make sure the store will update
    delayedAction({
      action: () => {
        router.push(Routes.SIMULATE_TRANSACTION);
      },
      delay: 200,
    });
  };

  const onSaveTx = () => {
    setIsSaveTxnModalVisible(true);
  };

  const getXdrJson = () => {
    const xdrType = XDR_TYPE_TRANSACTION_ENVELOPE;

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

  const isSubmitDisabled = !network.rpcUrl || !blob || Boolean(xdrJson?.error);

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

              if (submitRpcError || submitRpcResponse) {
                resetSubmitRpc();
              }
            }}
            note="Enter a base-64 encoded XDR blob to decode."
            hasCopyButton
          />

          <Box gap="lg" direction="row" align="center" justify="space-between">
            <div>
              <Button
                disabled={isSubmitDisabled}
                isLoading={isSubmitRpcPending}
                size="md"
                variant={"secondary"}
                onClick={onSubmitRpc}
              >
                Submit transaction
              </Button>
            </div>

            <Box gap="sm" direction="row" align="center" justify="end">
              <Button
                disabled={isSubmitDisabled || isSubmitRpcPending}
                size="md"
                variant={"tertiary"}
                onClick={onSimulateTx}
              >
                Simulate transaction
              </Button>

              <Button
                disabled={isSubmitDisabled || isSubmitRpcPending}
                size="md"
                variant={"tertiary"}
                onClick={onSaveTx}
                icon={<Icon.Save01 />}
              >
                Save transaction
              </Button>
            </Box>
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

      <SaveTransactionModal
        type="save"
        page="submit"
        isVisible={isSaveTxnModalVisible}
        onClose={() => {
          setIsSaveTxnModalVisible(false);
        }}
        xdr={blob}
      />
    </Box>
  );
}
