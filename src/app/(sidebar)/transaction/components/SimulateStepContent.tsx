"use client";

import { useEffect, useState } from "react";
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
import {
  extractAuthEntries,
  isAddressAuthEntry,
} from "@/helpers/sorobanAuthUtils";

import { validate } from "@/validate";

import { trackEvent, TrackingEvent } from "@/metrics/tracking";

import { AuthModeType, XdrFormatType } from "@/types/types";

import {
  SimulationResourceTable,
  getSimulationResourceInfo,
} from "./SimulationResourceTable";

/**
 * Shape of the simulate slice this component reads from.
 *
 * Mirrors the `simulate` slice on the transaction flow store so the build
 * and import flows can both pass their own slice in.
 */
export type SimulateStepSimulateState = {
  instructionLeeway?: string;
  authMode: AuthModeType;
  simulationResultJson?: string;
  authEntriesXdr?: string[];
  signedAuthEntriesXdr?: string[];
  assembledXdr?: string;
  isSimulationReadOnly?: boolean;
};

/**
 * Action callbacks the simulate step needs to mutate flow store state.
 */
export type SimulateStepActions = {
  setInstructionLeeway: (leeway: string | undefined) => void;
  setAuthMode: (mode: AuthModeType) => void;
  setSimulationResult: (json: string) => void;
  setSimulationReadOnly: (readOnly: boolean) => void;
  setAuthEntriesXdr: (entries: string[]) => void;
  setSignedAuthEntriesXdr: (entries: string[]) => void;
  setAssembledXdr: (xdr: string | undefined) => void;
  resetDownstreamState: (
    from: TransactionStepName,
    steps: TransactionStepName[],
  ) => void;
};

type SimulateStepContentProps = {
  /** Base-64 XDR to simulate (built or imported). */
  xdrToSimulate: string;
  /** True when the underlying op is invoke_contract_function — only that
   *  variant uses the auth-mode picker. */
  isInvokeContract: boolean;
  steps: TransactionStepName[];
  highestCompletedStep: TransactionStepName | null;
  simulate: SimulateStepSimulateState;
  actions: SimulateStepActions;
};

/**
 * Simulate step content shared by the build and import flows.
 *
 * Reads the to-be-simulated XDR from props, runs simulateTransaction via RPC,
 * and forwards results to the caller's store via `actions`. When auth entries
 * are detected, shows the auth-signing card and assembles the transaction
 * with signed entries; otherwise auto-assembles with simulation resources.
 *
 * @example
 * {activeStep === "simulate" && (
 *   <SimulateStepContent
 *     xdrToSimulate={builtXdr}
 *     isInvokeContract={isInvokeContract}
 *     steps={steps}
 *     highestCompletedStep={highestCompletedStep}
 *     simulate={simulate}
 *     actions={{ ... }}
 *   />
 * )}
 */
export const SimulateStepContent = ({
  xdrToSimulate,
  isInvokeContract,
  steps,
  highestCompletedStep,
  simulate,
  actions,
}: SimulateStepContentProps) => {
  const { network } = useStore();

  const [instrLeewayError, setInstrLeewayError] = useState("");
  const [assemblyWarning, setAssemblyWarning] = useState("");
  const [isResourcesExpanded, setIsResourcesExpanded] = useState(false);
  const [xdrFormat, setXdrFormat] = useState<XdrFormatType | string>("json");
  const [simulationDisplay, setSimulationDisplayResult] = useState<string>("");
  const [validUntilLedgerSeq, setValidUntilLedgerSeq] = useState(0);

  /**
   * After all auth entries are signed, assemble the transaction with the
   * signed auth entries and store the assembled XDR for the Sign step.
   */
  const assembleWithSignedAuth = (signedEntries: string[]) => {
    if (
      !simulate.simulationResultJson ||
      !xdrToSimulate ||
      !network.passphrase
    ) {
      return;
    }

    try {
      const rawTx = TransactionBuilder.fromXDR(
        xdrToSimulate,
        network.passphrase,
      );

      const rawResponse = JSON.parse(simulate.simulationResultJson);
      const parsedSim = StellarRpc.parseRawSimulation(rawResponse.result);

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
      actions.setAssembledXdr(finalXdr);
      actions.setSignedAuthEntriesXdr(signedEntries);
      trackEvent(TrackingEvent.SOROBAN_AUTH_ASSEMBLY_SUCCESS);
    } catch (e) {
      trackEvent(TrackingEvent.SOROBAN_AUTH_ASSEMBLY_ERROR, {
        error: String(e),
      });
    }
  };

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
    !network.rpcUrl || !xdrToSimulate || Boolean(instrLeewayError);

  // Show re-simulate warning when the user has previously completed this step
  const wasSimulatePreviouslyCompleted = (() => {
    if (!highestCompletedStep) return false;
    const simulateIndex = steps.indexOf("simulate");
    const hcIndex = steps.indexOf(highestCompletedStep);

    return hcIndex > simulateIndex;
  })();

  /**
   * Run the simulation against the RPC endpoint.
   */
  const onSimulate = async () => {
    if (!network.rpcUrl || !xdrToSimulate) return;

    // Clear previous assembly and auth state so stale data from the last
    // simulation can't leak through to downstream steps.
    actions.setAssembledXdr(undefined);
    actions.setAuthEntriesXdr([]);
    actions.setSignedAuthEntriesXdr([]);

    // Reset sign/validate/submit state and stepper completed marks
    actions.resetDownstreamState("sign", steps);
    setAssemblyWarning("");

    trackEvent(TrackingEvent.TRANSACTION_SIMULATE);

    try {
      const [simJsonResponse, simBase64Response] = await Promise.all([
        xdrFormat === "json"
          ? simulateTx({
              rpcUrl: network.rpcUrl,
              transactionXdr: xdrToSimulate,
              headers: getNetworkHeaders(network, "rpc"),
              xdrFormat: "json",
              ...(isInvokeContract ? { authMode: simulate.authMode } : {}),
            })
          : null,
        simulateTx({
          rpcUrl: network.rpcUrl,
          transactionXdr: xdrToSimulate,
          headers: getNetworkHeaders(network, "rpc"),
          xdrFormat: "base64",
          ...(isInvokeContract ? { authMode: simulate.authMode } : {}),
        }),
      ]);

      if (xdrFormat === "json" && simJsonResponse) {
        setSimulationDisplayResult(JSON.stringify(simJsonResponse, null, 2));
      } else if (simBase64Response) {
        setSimulationDisplayResult(JSON.stringify(simBase64Response, null, 2));
      }

      if (simBase64Response) {
        actions.setSimulationResult(JSON.stringify(simBase64Response, null, 2));
        const hasError = Boolean(
          simBase64Response?.error || simBase64Response?.result?.error,
        );

        if (!hasError) {
          const isReadOnly = checkIsReadOnly(simBase64Response);
          actions.setSimulationReadOnly(isReadOnly);

          const latestLedger = Number(
            simBase64Response?.result?.latestLedger ?? 0,
          );
          if (latestLedger > 0) {
            // ~42 minutes buffer at 5 seconds per ledger
            setValidUntilLedgerSeq(latestLedger + 500);
          }

          const entries = extractAuthEntries(simBase64Response);

          if (entries.length > 0) {
            trackEvent(TrackingEvent.SOROBAN_AUTH_ENTRIES_DETECTED, {
              entryCount: entries.length,
            });
          }

          // Source account credential entries are authorized by the
          // transaction envelope signature — pre-populate them as
          // already signed so only address entries require user action.
          const preSignedEntries: string[] = [];

          for (let i = 0; i < entries.length; i++) {
            const entry = xdr.SorobanAuthorizationEntry.fromXDR(
              entries[i],
              "base64",
            );
            if (!isAddressAuthEntry(entry)) {
              preSignedEntries[i] = entries[i];
            }
          }

          const hasAddressEntries =
            entries.length > preSignedEntries.filter(Boolean).length;

          if (hasAddressEntries) {
            actions.setAuthEntriesXdr(entries);
            actions.setSignedAuthEntriesXdr(preSignedEntries);
          } else {
            // No address credential entries — auto-assemble the
            // transaction with simulation resources (fees, sorobanData)
            // so the Sign step receives a complete XDR ready for signing.
            try {
              const rawTx = TransactionBuilder.fromXDR(
                xdrToSimulate,
                network.passphrase,
              );
              const parsedSim = StellarRpc.parseRawSimulation(
                simBase64Response.result,
              );
              const assembled = StellarRpc.assembleTransaction(
                rawTx,
                parsedSim,
              ).build();
              actions.setAssembledXdr(assembled.toXDR());
            } catch (e) {
              trackEvent(TrackingEvent.SOROBAN_AUTO_ASSEMBLY_ERROR, {
                error: String(e),
              });
              setAssemblyWarning(
                "Auto-assembly failed. Please try again later.",
              );
            }
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
            value={xdrToSimulate}
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
              actions.setInstructionLeeway(e.target.value || undefined);

              if (hasSimulationResult) {
                resetSimulateTx();
              }
            }}
            error={instrLeewayError}
          />

          {/* Auth mode selector — only relevant for InvokeHostFunction */}
          {isInvokeContract ? (
            <AuthModePicker
              id="simulate-auth-mode"
              value={simulate.authMode}
              onChange={(mode) => {
                resetSimulateTx();
                actions.setAuthMode(mode as AuthModeType);
              }}
              note={
                <>
                  “Record” is recommended for simulation. “Record” discovers
                  which authorization entries are required.
                  <SdsLink href="https://developers.stellar.org/docs/learn/fundamentals/contract-development/contract-interactions/transaction-simulation#authorization">
                    Learn more
                  </SdsLink>
                  .
                </>
              }
            />
          ) : null}

          {/* Simulate button */}
          <Box gap="md" direction="row" align="center">
            <Button
              disabled={Boolean(isActionDisabled)}
              isLoading={isSimulateTxPending}
              size="md"
              variant="secondary"
              onClick={onSimulate}
            >
              Simulate
            </Button>

            {wasSimulatePreviouslyCompleted && (
              <Text
                size="xs"
                as="span"
                addlClassName="SimulateStepContent__resimulate-note"
              >
                Re-simulating resets completed steps.
              </Text>
            )}
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

      {assemblyWarning ? (
        <Alert variant="warning" placement="inline" title="Assembly warning">
          {assemblyWarning}
        </Alert>
      ) : null}

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
                builtXdr={xdrToSimulate}
                validUntilLedgerSeq={validUntilLedgerSeq}
                networkPassphrase={network.passphrase}
                onAuthEntrySigned={(index, signedEntryXdr) => {
                  const updated = [...(simulate.signedAuthEntriesXdr || [])];
                  updated[index] = signedEntryXdr;
                  actions.setSignedAuthEntriesXdr(updated);
                }}
                onAllEntriesSigned={(signedEntries) => {
                  assembleWithSignedAuth(signedEntries);
                }}
              />
            )}

            {simulate.assembledXdr && (
              <Box gap="xxl">
                <Box gap="xs">
                  <Text
                    size="xs"
                    weight="medium"
                    as="div"
                    addlClassName="SignStepContent__label"
                  >
                    Simulated transaction (Base64 XDR)
                  </Text>

                  <div className="SignStepContent__xdrBox">
                    <Text
                      size="sm"
                      as="div"
                      addlClassName="SignStepContent__xdrText"
                    >
                      {simulate.assembledXdr}
                    </Text>
                  </div>
                </Box>
              </Box>
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
