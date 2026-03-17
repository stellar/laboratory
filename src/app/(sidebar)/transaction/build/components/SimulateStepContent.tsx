"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Icon,
  Input,
  Select,
  Text,
} from "@stellar/design-system";
import {
  rpc as StellarRpc,
  TransactionBuilder,
  xdr,
} from "@stellar/stellar-sdk";

import { useBuildFlowStore } from "@/store/createTransactionFlowStore";
import { useStore } from "@/store/useStore";

import { useSimulateTx } from "@/query/useSimulateTx";

import { XdrPicker } from "@/components/FormElements/XdrPicker";
import { Box } from "@/components/layout/Box";
import { PageCard } from "@/components/layout/PageCard";
import { CodeEditor } from "@/components/CodeEditor";
import { PageHeader } from "@/components/layout/PageHeader";
import { XdrFormat } from "@/components/XdrFormat";

import { getNetworkHeaders } from "@/helpers/getNetworkHeaders";

import { validate } from "@/validate";

import { trackEvent, TrackingEvent } from "@/metrics/tracking";

import { AuthModeType, XdrFormatType } from "@/types/types";
import { SdsLink } from "@/components/SdsLink";

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
    setAuthEntriesXdr,
    setAssembledXdr,
    setSimulationReadOnly,
  } = useBuildFlowStore();

  const [instrLeewayError, setInstrLeewayError] = useState("");
  const [isResourcesExpanded, setIsResourcesExpanded] = useState(false);
  const [xdrFormat, setXdrFormat] = useState<XdrFormatType | string>("json");
  const [authMode, selectAuthMode] = useState<AuthModeType | string>("");

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

      try {
        const result = responseData?.result;
        const results = result?.results as
          | Array<{ auth?: string[] }>
          | undefined;

        if (Array.isArray(results)) {
          for (const r of results) {
            if (Array.isArray(r.auth)) {
              authEntries.push(...r.auth);
            }
          }
        }
      } catch {
        // If parsing fails, return empty — no auth entries detected
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

        const authEntries = extractAuthEntries(responseData);
        if (authEntries.length > 0) return false;

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
    [extractAuthEntries],
  );

  /**
   * Attempts to assemble the transaction using the simulation result.
   * This attaches resource data and (if present) signed auth entries to produce
   * the final XDR for the Sign step.
   */
  const assembleTransaction = useCallback(
    (responseData: SimulationResponse) => {
      try {
        if (!builtXdr || !network.passphrase) return;

        // Build a simulated response object for the SDK's assembleTransaction
        const simResponse =
          responseData.result as StellarRpc.Api.SimulateTransactionResponse;

        const transaction = TransactionBuilder.fromXDR(
          builtXdr,
          network.passphrase,
        );

        const assembled = StellarRpc.assembleTransaction(
          transaction,
          simResponse,
        ).build();

        setAssembledXdr(assembled.toXDR());
      } catch (e) {
        console.warn("Failed to assemble transaction:", e);
      }
    },
    [builtXdr, network.passphrase, setAssembledXdr],
  );

  /**
   * Run the simulation against the RPC endpoint.
   */
  const onSimulate = async () => {
    if (!network.rpcUrl || !builtXdr) return;

    trackEvent(TrackingEvent.TRANSACTION_SIMULATE);

    try {
      const result = await simulateTx({
        rpcUrl: network.rpcUrl,
        transactionXdr: builtXdr,
        instructionLeeway: simulate.instructionLeeway,
        headers: getNetworkHeaders(network, "rpc"),
        xdrFormat: xdrFormat as XdrFormatType,
        authMode: simulate.authMode,
      });

      if (result) {
        // Store the full simulation result JSON
        setSimulationResult(JSON.stringify(result, null, 2));

        // Check for errors in the response
        const hasError = Boolean(result?.error || result?.result?.error);

        if (!hasError) {
          // Extract and store auth entries
          const authEntries = extractAuthEntries(result);
          if (authEntries.length > 0) {
            setAuthEntriesXdr(authEntries);
          }

          // Check if read-only
          const isReadOnly = checkIsReadOnly(result);
          setSimulationReadOnly(isReadOnly);

          // If no auth entries need signing, assemble immediately
          if (authEntries.length === 0) {
            assembleTransaction(result);
          }
        }
      }
    } catch {
      // Error is captured by React Query's error state
    }
  };

  /**
   * Parse resource usage from the simulation result for display.
   */
  const getResourceInfo = (): {
    cpuInsns?: string;
    memBytes?: string;
    minResourceFee?: string;
  } | null => {
    try {
      if (!simulateTxData?.result) return null;

      const result = simulateTxData.result;
      return {
        cpuInsns: result.cost?.cpuInsns,
        memBytes: result.cost?.memBytes,
        minResourceFee: result.minResourceFee,
      };
    } catch {
      return null;
    }
  };

  const hasSimulationResult = Boolean(simulateTxData);
  const hasError = Boolean(
    simulateTxError || simulateTxData?.error || simulateTxData?.result?.error,
  );
  const isSimulationSuccess = hasSimulationResult && !hasError;
  const authEntries = simulateTxData ? extractAuthEntries(simulateTxData) : [];
  const hasAuthEntries = authEntries.length > 0;
  const resourceInfo = getResourceInfo();

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

          {/* Xdr format selector */}
          <XdrFormat
            selectedFormat={simulate.xdrFormat}
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
              { id: "record_allow_nonroot", label: "Record (allow non-root)" },
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
              Simulate transaction
            </Button>
          </Box>
        </Box>
      </PageCard>

      {/* Simulation error */}
      {hasError && (
        <Alert variant="error" placement="inline" title="Simulation failed">
          {getErrorMessage()}
        </Alert>
      )}

      {/* Simulation success */}
      {isSimulationSuccess && (
        <Box gap="md">
          {/* Success alert */}
          <Alert
            variant="success"
            placement="inline"
            title="Transaction simulation successful"
            icon={<Icon.CheckCircle />}
          >
            {hasAuthEntries
              ? `${authEntries.length} authorization ${authEntries.length === 1 ? "entry" : "entries"} detected. Auth entries must be signed before the transaction can be submitted.`
              : simulate.isSimulationReadOnly
                ? "This is a read-only transaction. No signatures required."
                : ""}
          </Alert>

          {/* Simulation result JSON viewer */}
          <div data-testid="simulate-step-response">
            <CodeEditor
              title="Simulation Result"
              value={
                simulate.simulationResultJson ||
                JSON.stringify(simulateTxData, null, 2)
              }
              selectedLanguage="json"
            />
          </div>

          {/* Resource usage and fees (collapsible) */}
          {resourceInfo && (
            <Card>
              <Box gap="sm">
                <Box
                  gap="sm"
                  direction="row"
                  align="center"
                  justify="space-between"
                  addlClassName="SimulateStepContent__resource-toggle"
                >
                  <Text as="div" size="sm" weight="medium">
                    Resource usage and fees
                  </Text>
                  <Button
                    size="sm"
                    variant="tertiary"
                    icon={
                      isResourcesExpanded ? (
                        <Icon.ChevronUp />
                      ) : (
                        <Icon.ChevronDown />
                      )
                    }
                    onClick={() => setIsResourcesExpanded(!isResourcesExpanded)}
                  >
                    {isResourcesExpanded ? "Hide" : "View"}
                  </Button>
                </Box>

                {isResourcesExpanded && (
                  <Box gap="xs">
                    {resourceInfo.minResourceFee && (
                      <Box gap="xs" direction="row" justify="space-between">
                        <Text as="div" size="xs">
                          Min resource fee
                        </Text>
                        <Text as="div" size="xs" weight="medium">
                          {resourceInfo.minResourceFee} stroops
                        </Text>
                      </Box>
                    )}
                    {resourceInfo.cpuInsns && (
                      <Box gap="xs" direction="row" justify="space-between">
                        <Text as="div" size="xs">
                          CPU instructions
                        </Text>
                        <Text as="div" size="xs" weight="medium">
                          {resourceInfo.cpuInsns}
                        </Text>
                      </Box>
                    )}
                    {resourceInfo.memBytes && (
                      <Box gap="xs" direction="row" justify="space-between">
                        <Text as="div" size="xs">
                          Memory bytes
                        </Text>
                        <Text as="div" size="xs" weight="medium">
                          {resourceInfo.memBytes}
                        </Text>
                      </Box>
                    )}
                  </Box>
                )}
              </Box>
            </Card>
          )}

          {/* Auth entries info */}
          {hasAuthEntries && (
            <Card>
              <Box gap="md">
                <Alert
                  variant="primary"
                  placement="inline"
                  title={`${authEntries.length} authorization ${authEntries.length === 1 ? "entry" : "entries"} detected`}
                >
                  These auth entries must be signed before the transaction
                  envelope can be assembled and submitted. Auth signing will be
                  available in a future update.
                </Alert>

                {/* Auth entry list */}
                <Box gap="sm">
                  {authEntries.map((entry, index) => (
                    <AuthEntryPreview
                      key={`auth-entry-${index}`}
                      index={index}
                      entryXdr={entry}
                    />
                  ))}
                </Box>
              </Box>
            </Card>
          )}
        </Box>
      )}
    </Box>
  );
};

/**
 * Displays a preview of a single auth entry in the simulation results.
 *
 * @param index - The entry index (0-based)
 * @param entryXdr - The base64-encoded SorobanAuthorizationEntry XDR
 */
const AuthEntryPreview = ({
  index,
  entryXdr,
}: {
  index: number;
  entryXdr: string;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const info: {
    credentialsType: string;
    contractId?: string;
    functionName?: string;
  } = { credentialsType: "unknown" };

  try {
    const entry = xdr.SorobanAuthorizationEntry.fromXDR(entryXdr, "base64");
    const credentials = entry.credentials();

    if (
      credentials.switch().name === "sorobanCredentialsSourceAccount" ||
      credentials.switch().value === 0
    ) {
      info.credentialsType = "Source Account";
    } else {
      info.credentialsType = "Address";

      try {
        const rootInvocation = entry.rootInvocation();
        const contractFn = rootInvocation.function();

        if (
          contractFn.switch().name === "sorobanAuthorizedFunctionTypeContractFn"
        ) {
          const invokeContract = contractFn.contractFn();
          const contractIdBuf = invokeContract.contractAddress().contractId();
          info.contractId = Array.from(contractIdBuf as unknown as Uint8Array)
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");
          info.functionName = invokeContract.functionName().toString();
        }
      } catch {
        // Parsing inner details may fail for complex entries
      }
    }
  } catch {
    // If XDR parsing fails, show raw entry
  }

  return (
    <Card variant="secondary">
      <Box gap="sm">
        <Box
          gap="sm"
          direction="row"
          align="center"
          justify="space-between"
          wrap="wrap"
        >
          <Box gap="sm" direction="row" align="center">
            <Text as="div" size="sm" weight="medium">
              {`Entry #${index + 1}`}
            </Text>
            <Text
              as="span"
              size="xs"
              addlClassName="SimulateStepContent__badge SimulateStepContent__badge--unsigned"
            >
              Unsigned
            </Text>
          </Box>
          <Button
            size="sm"
            variant="tertiary"
            icon={isExpanded ? <Icon.ChevronUp /> : <Icon.ChevronDown />}
            onClick={() => setIsExpanded(!isExpanded)}
          />
        </Box>

        {isExpanded && (
          <Box gap="xs">
            <Box gap="xs" direction="row" justify="space-between">
              <Text as="div" size="xs">
                Credentials type
              </Text>
              <Text as="div" size="xs" weight="medium">
                {info.credentialsType}
              </Text>
            </Box>
            {info.contractId && (
              <Box gap="xs" direction="row" justify="space-between">
                <Text as="div" size="xs">
                  Contract ID
                </Text>
                <Text as="div" size="xs" weight="medium">
                  {`${info.contractId.substring(0, 8)}...${info.contractId.substring(info.contractId.length - 8)}`}
                </Text>
              </Box>
            )}
            {info.functionName && (
              <Box gap="xs" direction="row" justify="space-between">
                <Text as="div" size="xs">
                  Function
                </Text>
                <Text as="div" size="xs" weight="medium">
                  {info.functionName}
                </Text>
              </Box>
            )}
            <Box gap="xs">
              <Text as="div" size="xs" weight="medium">
                Raw XDR
              </Text>
              <Text as="div" size="xs">
                {`${entryXdr.substring(0, 80)}...`}
              </Text>
            </Box>
          </Box>
        )}
      </Box>
    </Card>
  );
};
