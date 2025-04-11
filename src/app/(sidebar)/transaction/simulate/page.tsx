"use client";

import { useEffect, useState } from "react";
import { Button, Input, Alert, Select } from "@stellar/design-system";

import { Box } from "@/components/layout/Box";
import { XdrPicker } from "@/components/FormElements/XdrPicker";
import { PrettyJson } from "@/components/PrettyJson";
import { PageCard } from "@/components/layout/PageCard";

import { rpc as StellarRpc, TransactionBuilder } from "@stellar/stellar-sdk";

import { useRouter } from "next/navigation";

import { useStore } from "@/store/useStore";
import { useSimulateTx } from "@/query/useSimulateTx";
import { delayedAction } from "@/helpers/delayedAction";
import { getNetworkHeaders } from "@/helpers/getNetworkHeaders";
import { validate } from "@/validate";
import { trackEvent, TrackingEvent } from "@/metrics/tracking";
import { Routes } from "@/constants/routes";

export default function SimulateTransaction() {
  const { xdr, transaction, network } = useStore();
  const [xdrError, setXdrError] = useState("");
  const [instrLeewayError, setInstrLeewayError] = useState("");
  const { simulate, updateSimulateInstructionLeeway } = transaction;

  const rpcServer = new StellarRpc.Server(network.rpcUrl);

  const router = useRouter();

  const {
    mutateAsync: simulateTx,
    data: simulateTxData,
    isPending: isSimulateTxPending,
    reset: resetSimulateTx,
  } = useSimulateTx();

  useEffect(() => {
    if (xdr.blob) {
      const validation = validate.getXdrError(xdr.blob);

      if (validation?.result === "error" && validation.message) {
        setXdrError(validation.message);
      } else {
        setXdrError("");
      }
    } else {
      setXdrError("");
    }
  }, [xdr.blob]);

  useEffect(() => {
    if (simulate.instructionLeeway) {
      const validationError = validate.getPositiveIntError(
        simulate.instructionLeeway,
      );

      if (validationError) {
        setInstrLeewayError(validationError);
      } else {
        setInstrLeewayError("");
      }
    } else {
      setInstrLeewayError("");
    }
  }, [simulate.instructionLeeway]);

  useEffect(() => {
    if (simulate.triggerOnLaunch) {
      delayedAction({
        action: () => {
          onSimulate();
        },
        delay: 200,
      });
    }
    // Do this only on page launch (used when Simulate button is clicked on
    // another page).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSimulate = () => {
    if (network.rpcUrl && xdr.blob) {
      simulateTx({
        rpcUrl: network.rpcUrl,
        transactionXdr: xdr.blob,
        instructionLeeway: simulate.instructionLeeway,
        headers: getNetworkHeaders(network, "rpc"),
        xdrFormat: xdr.format,
      });

      if (simulate.triggerOnLaunch) {
        transaction.updateSimulateTriggerOnLaunch(false);
      }

      trackEvent(TrackingEvent.TRANSACTION_SIMULATE);
    }
  };

  const assembleTransaction = async () => {
    try {
      const txn = TransactionBuilder.fromXDR(xdr.blob, network.passphrase);
      const preparedTx = await rpcServer.prepareTransaction(txn);

      transaction.updateSimulateAssembledTx(preparedTx.toXDR());

      delayedAction({
        action: () => {
          trackEvent(TrackingEvent.TRANSACTION_SIGN_SIMULATE);
          router.push(Routes.BUILD_TRANSACTION);
        },
        delay: 200,
      });

      return;
    } catch (e) {
      console.error("Error assembling transaction:", e);
      return null;
    }
  };

  const resetResponse = () => {
    if (simulateTxData) {
      resetSimulateTx();
    }
  };

  console.log("simulateTxData: ", simulateTxData);

  return (
    <PageCard heading="Simulate Transaction">
      {!network.rpcUrl ? (
        <Alert variant="warning" placement="inline" title="Attention">
          RPC URL is required to simulate a transaction. You can add it in the
          network settings in the upper right corner.
        </Alert>
      ) : null}

      <Box gap="lg">
        <XdrPicker
          id="simulate-tx-xdr"
          label="Input a base-64 encoded TransactionEnvelope"
          value={xdr.blob}
          error={xdrError}
          onChange={(e) => {
            xdr.updateXdrBlob(e.target.value);
            resetResponse();
          }}
          note="Enter a base-64 encoded XDR blob to decode."
          hasCopyButton
        />

        <Select
          id="simulate-tx-xdr-format"
          fieldSize="md"
          label="XDR Format"
          value={xdr.format}
          onChange={(e) => {
            xdr.updateXdrFormat(e.target.value);
          }}
        >
          <option id="base64" value="base64">
            base64
          </option>
          <option id="json" value="json">
            json
          </option>
        </Select>

        <Input
          id="simulate-tx-instr-leeway"
          fieldSize="md"
          label="Instruction Leeway"
          labelSuffix="optional"
          value={simulate.instructionLeeway}
          onChange={(e) => {
            updateSimulateInstructionLeeway(e.target.value || undefined);
            resetResponse();
          }}
          error={instrLeewayError}
        />

        <Box gap="sm" direction="row" align="center">
          <div className="SignTx__CTA">
            <Button
              disabled={Boolean(
                !network.rpcUrl || !xdr.blob || xdrError || instrLeewayError,
              )}
              isLoading={isSimulateTxPending}
              size="md"
              variant={"secondary"}
              onClick={onSimulate}
            >
              Simulate transaction
            </Button>
          </div>

          {transaction.build.soroban.operation.operation_type ===
            "invoke_contract_function" &&
          transaction.build.soroban.operation.params.invoke_contract ? (
            <div className="SignTx__CTA">
              <Button
                disabled={Boolean(
                  !network.rpcUrl ||
                    !xdr.blob ||
                    xdrError ||
                    instrLeewayError ||
                    !simulateTxData ||
                    simulateTxData?.result.error,
                )}
                isLoading={isSimulateTxPending}
                size="md"
                variant={"secondary"}
                onClick={assembleTransaction}
              >
                Use Simulated Output
              </Button>
            </div>
          ) : null}
        </Box>
        <>
          {simulateTxData ? (
            <div
              data-testid="simulate-tx-response"
              className={`PageBody__content PageBody__scrollable ${simulateTxData?.result.error ? "PageBody__content--error" : ""}`}
            >
              <PrettyJson json={simulateTxData} />
            </div>
          ) : null}
        </>
      </Box>
    </PageCard>
  );
}
