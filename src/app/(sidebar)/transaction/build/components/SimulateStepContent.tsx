"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Icon,
  Link,
  Input,
  Select,
} from "@stellar/design-system";
import { xdr } from "@stellar/stellar-sdk";

import { useBuildFlowStore } from "@/store/createTransactionFlowStore";
import { useStore } from "@/store/useStore";

import { useSimulateTx } from "@/query/useSimulateTx";

import { XdrPicker } from "@/components/FormElements/XdrPicker";
import { Box } from "@/components/layout/Box";
import { PageCard } from "@/components/layout/PageCard";
import { CodeEditor } from "@/components/CodeEditor";
import { PageHeader } from "@/components/layout/PageHeader";
import { XdrFormat } from "@/components/XdrFormat";
import { SdsLink } from "@/components/SdsLink";
import { ExpandBox } from "@/components/ExpandBox";
import { SorobanAuthSigningCard } from "@/components/SorobanAuthSigning";

import { getNetworkHeaders } from "@/helpers/getNetworkHeaders";

import { validate } from "@/validate";

import { trackEvent, TrackingEvent } from "@/metrics/tracking";

import { AuthModeType, XdrFormatType } from "@/types/types";

import {
  SimulationResourceTable,
  getSimulationResourceInfo,
} from "./SimulationResourceTable";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SimulationResponse = Record<string, any>;

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
export const SimulateStepContent = () => {
  const { network } = useStore();
  const {
    build,
    simulate,
    setSimulateInstructionLeeway,
    setSimulationResult,
    setSimulationReadOnly,
    setAuthEntriesXdr,
    setSignedAuthEntriesXdr,
  } = useBuildFlowStore();

  const [instrLeewayError, setInstrLeewayError] = useState("");
  const [isResourcesExpanded, setIsResourcesExpanded] = useState(false);
  const [xdrFormat, setXdrFormat] = useState<XdrFormatType | string>("json");
  const [authMode, selectAuthMode] = useState<AuthModeType | string>("");
  const [simulationDisplay, setSimulationDisplayResult] = useState<string>("");

  // Derive the built XDR from whichever operation type was used
  const builtXdr = build.soroban.xdr || build.classic.xdr;

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
   * Extracts auth entries from the simulation response.
   * Auth entries live in result.results[].auth[] in the RPC response.
   */
  const extractAuthEntries = useCallback(
    (responseData: SimulationResponse): string[] => {
      const authEntries: string[] = [];
      const results = responseData?.result?.results as
        | Array<{ auth?: string[] }>
        | undefined;

      if (Array.isArray(results)) {
        for (const r of results) {
          if (Array.isArray(r.auth)) {
            authEntries.push(...r.auth);
          }
        }
      }

      return authEntries;
    },
    [],
  );

  /**
   * Determines if the simulation result indicates a read-only transaction
   * (no auth entries and no write footprint).
   */
  const checkIsReadOnly = useCallback(
    (responseData: SimulationResponse): boolean => {
      try {
        const result = responseData?.result;

        if (!result) return false;

        // Check if there's a transaction data with no write footprint
        const transactionData = result?.transactionData as string | undefined;
        if (transactionData) {
          const sorobanData = xdr.SorobanTransactionData.fromXDR(
            transactionData,
            "base64",
          );
          const writeKeys = sorobanData
            .resources()
            .footprint()
            .readWrite().length;
          return writeKeys === 0;
        }

        return false;
      } catch {
        return false;
      }
    },
    [],
  );

  /**
   * Run the simulation against the RPC endpoint.
   */
  const onSimulate = async () => {
    if (!network.rpcUrl || !builtXdr) return;

    trackEvent(TrackingEvent.TRANSACTION_SIMULATE);

    try {
      const [simJsonResponse, simBase64Response] = await Promise.all([
        xdrFormat === "json"
          ? simulateTx({
              rpcUrl: network.rpcUrl,
              transactionXdr: builtXdr,
              headers: getNetworkHeaders(network, "rpc"),
              xdrFormat: "json",
              // authMode: simulate.authMode,
            })
          : null,
        simulateTx({
          rpcUrl: network.rpcUrl,
          transactionXdr: builtXdr,
          headers: getNetworkHeaders(network, "rpc"),
          xdrFormat: "base64",
          // authMode: simulate.authMode,
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
  const authEntries = simulateTxData ? extractAuthEntries(simulateTxData) : [];
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
              console.log({ format });
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
          <Select
            id="ledger-key-type"
            fieldSize="md"
            label="Auth mode"
            value={authMode}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              resetSimulateTx();

              const selectedVal = e.target.value;
              selectAuthMode(selectedVal);
            }}
            note={
              <>
                This simulation shows which signatures are required. It doesn’t
                validate signatures or calculate final fees.{" "}
                {
                  <SdsLink href="https://developers.stellar.org/docs/learn/fundamentals/contract-development/contract-interactions/transaction-simulation#authorization">
                    Learn more
                  </SdsLink>
                }
                .
              </>
            }
          >
            <option value="">Select a key</option>

            {[
              { id: "record", label: "Record" },
              { id: "enforce", label: "Enforce" },
              { id: "record-allow-nonroot", label: "Record (allow non-root)" },
            ].map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </Select>

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
                    View resources and fees from simulation
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
                onAuthSigned={({ signedXdr }) => {
                  // TODO: Replace with authorizeEntry() logic — SignTransactionXdr
                  // signs the transaction envelope, but auth entries need
                  // authorizeEntry() from @stellar/stellar-sdk to sign each
                  // SorobanAuthorizationEntry individually.
                  if (signedXdr) {
                    setSignedAuthEntriesXdr(authEntries);
                  }
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
        This transaction contains <strong>authorization entries</strong> that
        need to be validated before submitting.
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
