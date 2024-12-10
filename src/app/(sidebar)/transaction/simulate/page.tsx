"use client";

import { useEffect, useState } from "react";
import { Button, Input, Alert } from "@stellar/design-system";

import { Box } from "@/components/layout/Box";
import { XdrPicker } from "@/components/FormElements/XdrPicker";
import { PrettyJson } from "@/components/PrettyJson";
import { PageCard } from "@/components/layout/PageCard";

import { useStore } from "@/store/useStore";
import { useSimulateTx } from "@/query/useSimulateTx";
import { delayedAction } from "@/helpers/delayedAction";
import { getNetworkHeaders } from "@/helpers/getNetworkHeaders";
import { validate } from "@/validate";

export default function SimulateTransaction() {
  const { xdr, transaction, network } = useStore();
  const [xdrError, setXdrError] = useState("");
  const [instrLeewayError, setInstrLeewayError] = useState("");
  const { simulate, updateSimulateInstructionLeeway } = transaction;

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
      });

      if (simulate.triggerOnLaunch) {
        transaction.updateSimulateTriggerOnLaunch(false);
      }
    }
  };

  const resetResponse = () => {
    if (simulateTxData) {
      resetSimulateTx();
    }
  };

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

        <>
          {simulateTxData ? (
            <div
              data-testid="simulate-tx-response"
              className={`PageBody__content PageBody__scrollable ${simulateTxData?.result?.error ? "PageBody__content--error" : ""}`}
            >
              <PrettyJson json={simulateTxData} />
            </div>
          ) : null}
        </>
      </Box>
    </PageCard>
  );
}
