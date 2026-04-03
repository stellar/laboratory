"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Icon,
  Link,
  Input,
  Text,
} from "@stellar/design-system";
import {
  TransactionBuilder,
  xdr,
  rpc as StellarRpc,
} from "@stellar/stellar-sdk";

import { useBuildFlowStore } from "@/store/createTransactionFlowStore";
import { useStore } from "@/store/useStore";

import { useSimulateTx } from "@/query/useSimulateTx";

import { AuthModePicker } from "@/components/FormElements/AuthModePicker";
import { XdrPicker } from "@/components/FormElements/XdrPicker";
import { Box } from "@/components/layout/Box";
import { PageCard } from "@/components/layout/PageCard";
import { CodeEditor } from "@/components/CodeEditor";
import { PageHeader } from "@/components/layout/PageHeader";
import { XdrFormat } from "@/components/XdrFormat";
import { SdsLink } from "@/components/SdsLink";
import { ExpandBox } from "@/components/ExpandBox";
import { SorobanAuthSigningCard } from "@/components/SorobanAuthSigning";
import { TransactionStepName } from "@/components/TransactionStepper";

import { getNetworkHeaders } from "@/helpers/getNetworkHeaders";
import { checkIsReadOnly } from "@/helpers/sorobanUtils";
import { extractAuthEntries } from "@/helpers/sorobanAuthUtils";

import { validate } from "@/validate";

import { trackEvent, TrackingEvent } from "@/metrics/tracking";

import { AuthModeType, XdrFormatType } from "@/types/types";

import {
  SimulationResourceTable,
  getSimulationResourceInfo,
} from "./SimulationResourceTable";

/**
 * Simulate step content for the single-page transaction flow (Soroban only).
 *
 * Reads the built XDR from the flow store, runs simulateTransaction via RPC,
 * and stores the result. When auth entries are detected, shows them and
 * (eventually) enables auth signing before assembly.
 *
 * @example
 * {activeStep === "simulate" && <SimulateStepContent />}
 */
export const SimulateStepContent = ({
  steps,
}: {
  steps: TransactionStepName[];
}) => {
  const { network } = useStore();
  const {
    build,
    simulate,
    setSimulateInstructionLeeway,
    setSimulationResult,
    setSimulationReadOnly,
    setAuthEntriesXdr,
    setSignedAuthEntriesXdr,
    setAssembledXdr,
    resetDownstreamState,
  } = useBuildFlowStore();

  const [instrLeewayError, setInstrLeewayError] = useState("");
  const [isResourcesExpanded, setIsResourcesExpanded] = useState(false);
  const [xdrFormat, setXdrFormat] = useState<XdrFormatType | string>("json");
  const [authMode, selectAuthMode] = useState<AuthModeType | string>("");
  const [simulationDisplay, setSimulationDisplayResult] = useState<string>("");
  const [validUntilLedgerSeq, setValidUntilLedgerSeq] = useState(0);

  // Derive the built XDR from whichever operation type was used
  const builtXdr = build.soroban.xdr || build.classic.xdr;

  /**
   * After all auth entries are signed, assemble the transaction with the
   * signed auth entries and store the assembled XDR for the Sign step.
   */
  const assembleWithSignedAuth = useCallback(
    (signedEntries: string[]) => {
      if (!simulate.simulationResultJson || !builtXdr || !network.passphrase) {
        return;
      }

      try {
        // Parse the original transaction
        const rawTx = TransactionBuilder.fromXDR(builtXdr, network.passphrase);

        // Parse the stored simulation result
        const rawResponse = JSON.parse(simulate.simulationResultJson);
        const parsedSim = StellarRpc.parseRawSimulation(rawResponse.result);

        // Assemble with resources and fees from simulation
        const assembled = StellarRpc.assembleTransaction(
          rawTx,
          parsedSim,
        ).build();

        // Replace auth entries on the assembled transaction with signed versions
        const envelope = assembled.toEnvelope();
        const ops = envelope.v1().tx().operations();

        for (const op of ops) {
          if (op.body().switch() === xdr.OperationType.invokeHostFunction()) {
            const ihf = op.body().invokeHostFunctionOp();
            const signedAuth = signedEntries.map((entryBase64) =>
              xdr.SorobanAuthorizationEntry.fromXDR(entryBase64, "base64"),
            );
            ihf.auth(signedAuth);
          }
        }

        const finalXdr = envelope.toXDR("base64");
        setAssembledXdr(finalXdr);
        setSignedAuthEntriesXdr(signedEntries);
      } catch (e) {
        console.error("Assembly with signed auth entries failed:", e);
      }
    },
    [
      simulate.simulationResultJson,
      builtXdr,
      network.passphrase,
      setAssembledXdr,
      setSignedAuthEntriesXdr,
    ],
  );

  const {
    mutateAsync: simulateTx,
    data: simulateTxData,
    error: simulateTxError,
    isPending: isSimulateTxPending,
    reset: resetSimulateTx,
  } = useSimulateTx();

  // Validate instruction leeway
  useEffect(() => {
    if (simulate.instructionLeeway) {
      const validationError = validate.getPositiveIntError(
        simulate.instructionLeeway,
      );
      setInstrLeewayError(validationError || "");
    } else {
      setInstrLeewayError("");
    }
  }, [simulate.instructionLeeway]);

  const isActionDisabled =
    !network.rpcUrl || !builtXdr || Boolean(instrLeewayError);

  /**
   * Run the simulation against the RPC endpoint.
   */
  const onSimulate = async () => {
    if (!network.rpcUrl || !builtXdr) return;

    // Reset sign/validate/submit state and stepper completed marks
    resetDownstreamState("sign", steps);

    trackEvent(TrackingEvent.TRANSACTION_SIMULATE);

    try {
      const [simJsonResponse, simBase64Response] = await Promise.all([
        xdrFormat === "json"
          ? simulateTx({
              rpcUrl: network.rpcUrl,
              transactionXdr: builtXdr,
              headers: getNetworkHeaders(network, "rpc"),
              xdrFormat: "json",
              authMode: simulate.authMode,
            })
          : null,
        simulateTx({
          rpcUrl: network.rpcUrl,
          transactionXdr: builtXdr,
          headers: getNetworkHeaders(network, "rpc"),
          xdrFormat: "base64",
          authMode: simulate.authMode,
        }),
      ]);

      if (xdrFormat === "json" && simJsonResponse) {
        setSimulationDisplayResult(JSON.stringify(simJsonResponse, null, 2));
      } else if (simBase64Response) {
        setSimulationDisplayResult(JSON.stringify(simBase64Response, null, 2));
      }

      if (simBase64Response) {
        setSimulationResult(JSON.stringify(simBase64Response, null, 2));
        // Check for errors in the response
        const hasError = Boolean(
          simBase64Response?.error || simBase64Response?.result?.error,
        );

        if (!hasError) {
          // Check if read-only
          const isReadOnly = checkIsReadOnly(simBase64Response);
          setSimulationReadOnly(isReadOnly);

          // Compute validUntilLedgerSeq from latestLedger in response
          const latestLedger = Number(
            simBase64Response?.result?.latestLedger ?? 0,
          );
          if (latestLedger > 0) {
            // ~42 minutes buffer at 5 seconds per ledger
            setValidUntilLedgerSeq(latestLedger + 500);
          }

          // Extract and store auth entries
          const entries = extractAuthEntries(simBase64Response);

          if (entries.length > 0) {
            setAuthEntriesXdr(entries);
          }
        }
      }
    } catch {
      // Error is captured by React Query's error state
    }
  };

  const hasSimulationResult = Boolean(simulateTxData);
  const hasError = Boolean(
    simulateTxError || simulateTxData?.error || simulateTxData?.result?.error,
  );
  const isSimulationSuccess = hasSimulationResult && !hasError;
  const authEntries = simulate.authEntriesXdr || [];
  const hasAuthEntries = authEntries.length > 0;
  const resourceInfo = getSimulationResourceInfo(simulateTxData);

  const getErrorMessage = (): string => {
    if (simulateTxError) {
      const err = simulateTxError as unknown;
      return typeof err === "object" &&
        err !== null &&
        "result" in (err as Record<string, unknown>)
        ? String((err as Record<string, unknown>).result)
        : String(simulateTxError);
    }
    if (simulateTxData?.error) {
      return String(simulateTxData.error);
    }
    if (simulateTxData?.result?.error) {
      return String(simulateTxData.result.error);
    }
    return "Unknown simulation error";
  };

  return (
    <Box gap="md">
      <PageHeader heading="Simulate transaction" as="h1" />
      <PageCard>
        {!network.rpcUrl ? (
          <Alert variant="warning" placement="inline" title="Attention">
            RPC URL is required to simulate a transaction. You can add it in the
            network settings in the upper right corner.
          </Alert>
        ) : null}

        <Box gap="lg">
          <XdrPicker
            id="view-xdr-blob"
            label="Base64 encoded XDR"
            value={builtXdr}
            disabled
            hasCopyButton
          />

          <XdrFormat
            selectedFormat={xdrFormat || "json"}
            onChange={(format) => {
              setXdrFormat(format);

              if (hasSimulationResult) {
                resetSimulateTx();
              }
            }}
          />

          {/* Instruction leeway */}
          <Input
            id="simulate-instruction-leeway"
            fieldSize="md"
            label="Instruction leeway"
            labelSuffix="optional"
            value={simulate.instructionLeeway || ""}
            onChange={(e) => {
              setSimulateInstructionLeeway(e.target.value || undefined);

              if (hasSimulationResult) {
                resetSimulateTx();
              }
            }}
            error={instrLeewayError}
          />

          {/* Auth mode selector */}
          <AuthModePicker
            id="simulate-auth-mode"
            value={authMode}
            onChange={(mode) => {
              resetSimulateTx();
              selectAuthMode(mode);
            }}
            note={
              <>
                This simulation shows which signatures are required. It doesn’t
                validate signatures or calculate final fees.{" "}
                <SdsLink href="https://developers.stellar.org/docs/learn/fundamentals/contract-development/contract-interactions/transaction-simulation#authorization">
                  Learn more
                </SdsLink>
                .
              </>
            }
          />

          {/* Simulate button */}
          <Box gap="md" direction="row">
            <Button
              disabled={Boolean(isActionDisabled)}
              isLoading={isSimulateTxPending}
              size="md"
              variant="secondary"
              onClick={onSimulate}
            >
              Simulate
            </Button>
          </Box>
        </Box>
      </PageCard>

      {renderAlert({
        isReadOnly: Boolean(simulate.isSimulationReadOnly),
        isSimulationSuccess,
        hasAuthEntries,
        hasError,
        errorMessage: hasError ? getErrorMessage() : "",
      })}

      {/* Simulation success */}
      {isSimulationSuccess && (
        <Card>
          <Box gap="md">
            {/* Simulation result JSON viewer */}
            <div data-testid="simulate-step-response">
              <CodeEditor
                title="Simulation Result"
                value={simulationDisplay}
                selectedLanguage="json"
                maxHeightInRem="20"
              />
            </div>

            {/* Resource usage and fees (collapsible) */}
            {resourceInfo && (
              <Box gap="sm">
                <div
                  className="SimulateStepContent__expand-toggle"
                  onClick={() => setIsResourcesExpanded(!isResourcesExpanded)}
                  data-is-expanded={isResourcesExpanded}
                >
                  <Link size="sm" icon={<Icon.ChevronDown />}>
                    View resource usage and fees (simulated)
                  </Link>
                </div>

                <ExpandBox isExpanded={isResourcesExpanded} offsetTop="sm">
                  <SimulationResourceTable resourceInfo={resourceInfo} />
                </ExpandBox>
              </Box>
            )}

            {/* Auth entry signing card */}
            {hasAuthEntries && (
              <SorobanAuthSigningCard
                authEntriesXdr={authEntries}
                signedAuthEntriesXdr={simulate.signedAuthEntriesXdr || []}
                builtXdr={builtXdr}
                validUntilLedgerSeq={validUntilLedgerSeq}
                networkPassphrase={network.passphrase}
                onAuthEntrySigned={(index, signedEntryXdr) => {
                  const updated = [...(simulate.signedAuthEntriesXdr || [])];
                  updated[index] = signedEntryXdr;
                  setSignedAuthEntriesXdr(updated);
                }}
                onAllEntriesSigned={(signedEntries) => {
                  assembleWithSignedAuth(signedEntries);
                }}
              />
            )}
          </Box>
        </Card>
      )}
    </Box>
  );
};

const renderAlert = ({
  isReadOnly,
  isSimulationSuccess,
  hasAuthEntries,
  hasError,
  errorMessage,
}: {
  isReadOnly: boolean;
  isSimulationSuccess: boolean;
  hasAuthEntries: boolean;
  hasError: boolean;
  errorMessage: string;
}) => {
  if (isReadOnly && isSimulationSuccess) {
    return (
      <Alert
        variant="warning"
        placement="inline"
        title="This transaction is read only."
        icon={<Icon.CheckCircle />}
      >
        Read-only transactions don’t modify the ledger, and submitting to the
        network will still incur a fee.
      </Alert>
    );
  }

  if (isSimulationSuccess && !hasAuthEntries) {
    return (
      <Alert
        variant="success"
        placement="inline"
        title="Transaction simulation successful"
        icon={<Icon.CheckCircle />}
      >
        Simulation completed successfully.
      </Alert>
    );
  }

  if (hasAuthEntries && isSimulationSuccess) {
    return (
      <Alert
        variant="success"
        placement="inline"
        title="Transaction simulation successful"
        icon={<Icon.CheckCircle />}
      >
        This transaction contains{" "}
        <Text as="span" weight="semi-bold" size="sm">
          authorization entries
        </Text>{" "}
        that need to be validated before submitting.
      </Alert>
    );
  }

  if (hasError) {
    return (
      <Alert variant="error" placement="inline" title="Simulation failed">
        {errorMessage}
      </Alert>
    );
  }

  return null;
};
