"use client";

import { useState } from "react";
import {
  Alert,
  Button,
  Card,
  Icon,
  Link,
  Select,
} from "@stellar/design-system";

import { useBuildFlowStore } from "@/store/createTransactionFlowStore";
import { useStore } from "@/store/useStore";

import { useSimulateTx } from "@/query/useSimulateTx";

import { XdrPicker } from "@/components/FormElements/XdrPicker";
import { Box } from "@/components/layout/Box";
import { PageCard } from "@/components/layout/PageCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { CodeEditor } from "@/components/CodeEditor";
import { ExpandBox } from "@/components/ExpandBox";
import { SdsLink } from "@/components/SdsLink";

import { getNetworkHeaders } from "@/helpers/getNetworkHeaders";

import { trackEvent, TrackingEvent } from "@/metrics/tracking";

import { AuthModeType } from "@/types/types";

import {
  SimulationResourceTable,
  getSimulationResourceInfo,
} from "./SimulationResourceTable";

/**
 * Validate step content for the single-page transaction flow (Soroban only).
 *
 * Runs an enforce-mode re-simulation of the signed transaction to verify that
 * auth entry signatures are valid before submitting. On success, stores the
 * validated result so the user can proceed to submit.
 *
 * @see https://developers.stellar.org/docs/build/guides/transactions/signing-soroban-invocations#how-it-works-1
 * @see https://github.com/stellar/stellar-protocol/blob/master/core/cap-0071.md
 *
 * @example
 * {activeStep === "validate" && <ValidateStepContent />}
 */
export const ValidateStepContent = () => {
  const { network } = useStore();
  const {
    sign,
    validate,
    setValidateResult,
    setValidateAuthMode,
    setValidatedXdr,
  } = useBuildFlowStore();

  const [isResourcesExpanded, setIsResourcesExpanded] = useState(false);
  const [validationDisplay, setValidationDisplay] = useState<string>("");

  // The signed transaction envelope XDR from the Sign step
  const signedXdr = sign.signedXdr;

  const {
    mutateAsync: simulateTx,
    data: simulateTxData,
    error: simulateTxError,
    isPending: isSimulateTxPending,
    reset: resetSimulateTx,
  } = useSimulateTx();

  const authMode = validate?.authMode || "enforce";

  const isActionDisabled = !network.rpcUrl || !signedXdr;

  /**
   * Run enforce-mode re-simulation to validate auth entry signatures.
   */
  const onValidate = async () => {
    if (!network.rpcUrl || !signedXdr) return;

    try {
      const response = await simulateTx({
        rpcUrl: network.rpcUrl,
        transactionXdr: signedXdr,
        headers: getNetworkHeaders(network, "rpc"),
        xdrFormat: "base64",
        authMode,
      });

      if (response) {
        const resultJson = JSON.stringify(response, null, 2);
        setValidationDisplay(resultJson);
        setValidateResult(resultJson);

        const hasError = Boolean(response?.error || response?.result?.error);

        if (!hasError) {
          // Store the signed XDR as the validated XDR — enforce sim confirms
          // the auth signatures are valid and the transaction is ready to submit
          setValidatedXdr(signedXdr);
          trackEvent(TrackingEvent.TRANSACTION_VALIDATE_AUTH_ENFORCE_SUCCESS);
        } else {
          trackEvent(TrackingEvent.TRANSACTION_VALIDATE_AUTH_ENFORCE_FAILURE);
        }
      }
    } catch {
      trackEvent(TrackingEvent.TRANSACTION_VALIDATE_AUTH_ENFORCE_FAILURE);
    }
  };

  const hasValidationResult = Boolean(simulateTxData);
  const hasError = Boolean(
    simulateTxError || simulateTxData?.error || simulateTxData?.result?.error,
  );
  const isValidationSuccess = hasValidationResult && !hasError;
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
    return "Unknown validation error";
  };

  return (
    <Box gap="md">
      <PageHeader heading="Validate auth entries" as="h1" />

      <PageCard>
        {!network.rpcUrl ? (
          <Alert variant="warning" placement="inline" title="Attention">
            RPC URL is required to validate auth entries. You can add it in the
            network settings in the upper right corner.
          </Alert>
        ) : null}

        <Box gap="lg">
          <XdrPicker
            id="validate-xdr-blob"
            label="Signed transaction XDR"
            value={signedXdr}
            disabled
            hasCopyButton
          />

          {/* Auth mode selector */}
          <Select
            id="validate-auth-mode"
            fieldSize="md"
            label="Auth mode"
            value={authMode}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              resetSimulateTx();
              setValidateAuthMode(e.target.value as AuthModeType);
            }}
            note={
              <>
                Re-simulates the signed transaction to validate authorization
                entry signatures.{" "}
                {
                  <SdsLink href="https://developers.stellar.org/docs/build/guides/transactions/signing-soroban-invocations#how-it-works-1">
                    Learn more
                  </SdsLink>
                }
                .
              </>
            }
          >
            {[
              { id: "enforce", label: "Enforce" },
              { id: "record", label: "Record" },
              { id: "record-allow-nonroot", label: "Record (allow non-root)" },
            ].map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </Select>

          {/* Validate button */}
          <Box gap="md" direction="row">
            <Button
              disabled={Boolean(isActionDisabled)}
              isLoading={isSimulateTxPending}
              size="md"
              variant="secondary"
              onClick={() => {
                resetSimulateTx();
                onValidate();
              }}
            >
              Validate
            </Button>
          </Box>
        </Box>
      </PageCard>

      {/* Success alert */}
      {isValidationSuccess && (
        <Alert
          variant="success"
          placement="inline"
          title="Auth entries validated"
          icon={<Icon.CheckCircle />}
        >
          All authorization entry signatures are valid. The transaction is ready
          to submit.
        </Alert>
      )}

      {/* Error alert */}
      {hasError && (
        <Alert variant="error" placement="inline" title="Validation failed">
          {getErrorMessage()}
        </Alert>
      )}

      {/* Validation result */}
      {hasValidationResult && (
        <Card>
          <Box gap="md">
            <div data-testid="validate-step-response">
              <CodeEditor
                title="Validation Result"
                value={validationDisplay}
                selectedLanguage="json"
                maxHeightInRem="20"
              />
            </div>

            {/* Resource usage (collapsible) */}
            {resourceInfo && (
              <Box gap="sm">
                <div
                  className="SimulateStepContent__expand-toggle"
                  onClick={() => setIsResourcesExpanded(!isResourcesExpanded)}
                  data-is-expanded={isResourcesExpanded}
                >
                  <Link size="sm" icon={<Icon.ChevronDown />}>
                    View resources and fees from validation
                  </Link>
                </div>

                <ExpandBox isExpanded={isResourcesExpanded} offsetTop="sm">
                  <SimulationResourceTable resourceInfo={resourceInfo} />
                </ExpandBox>
              </Box>
            )}
          </Box>
        </Card>
      )}
    </Box>
  );
};
