"use client";

import {
  FeeBumpTransaction,
  Transaction,
  TransactionBuilder,
} from "@stellar/stellar-sdk";
import { Alert } from "@stellar/design-system";

import { useImportFlowStore } from "@/store/createTransactionFlowStore";
import { useStore } from "@/store/useStore";

import { isSorobanOperationType } from "@/helpers/sorobanUtils";

import { validate } from "@/validate";
import { trackEvent, TrackingEvent } from "@/metrics/tracking";

import { FEE_BUMP_TX_FIELDS, TX_FIELDS } from "@/constants/signTransactionPage";

import { TransactionStepHeader } from "@/app/(sidebar)/transaction/components/TransactionStepHeader";
import { Signatures } from "@/app/(sidebar)/transaction/components/Signatures";
import { Box } from "@/components/layout/Box";
import { XdrPicker } from "@/components/FormElements/XdrPicker";
import { TextPicker } from "@/components/FormElements/TextPicker";
import { PageCard } from "@/components/layout/PageCard";

const MIN_LENGTH_FOR_FULL_WIDTH_FIELD = 30;

/**
 * Import step content for the single-page transaction flow.
 *
 * Accepts a transaction envelope XDR, parses it, and stores the parsed
 * transaction type and signature presence in the import flow store. When the
 * XDR parses successfully, renders a "Transaction overview" matching the
 * sign-page pattern so users can verify the transaction before advancing.
 *
 * @example
 * {activeStep === "import" && <ImportStepContent />}
 */
export const ImportStepContent = () => {
  const { network } = useStore();
  const {
    import: importState,
    setImportXdr,
    setImportParsedType,
    setImportHasSignatures,
    setImportParseError,
    resetAll,
  } = useImportFlowStore();

  const importXdr = importState?.importXdr ?? "";
  const parseError = importState?.parseError ?? null;
  const parsedTxType = importState?.parsedTxType ?? null;

  const parsedTx: Transaction | FeeBumpTransaction | null = (() => {
    if (!importXdr || parseError || !parsedTxType) return null;
    try {
      return TransactionBuilder.fromXDR(importXdr, network.passphrase) as
        | Transaction
        | FeeBumpTransaction;
    } catch {
      return null;
    }
  })();

  const onChange = (value: string) => {
    setImportXdr(value);

    if (!value) {
      setImportParseError(null);
      setImportParsedType(null);
      setImportHasSignatures(false);
      return;
    }

    trackEvent(TrackingEvent.TRANSACTION_IMPORT_XDR_PASTE);

    const xdrValidation = validate.getXdrError(value);

    if (xdrValidation?.result === "error") {
      setImportParseError(xdrValidation.message ?? "Invalid XDR");
      setImportParsedType(null);
      setImportHasSignatures(false);
      trackEvent(TrackingEvent.TRANSACTION_IMPORT_XDR_INVALID);
      return;
    }

    try {
      const tx = TransactionBuilder.fromXDR(value, network.passphrase) as
        | Transaction
        | FeeBumpTransaction;

      const operations =
        tx instanceof FeeBumpTransaction
          ? tx.innerTransaction.operations
          : tx.operations;

      const isSoroban = isSorobanOperationType(operations?.[0]?.type ?? "");

      setImportParsedType(isSoroban ? "soroban" : "classic");
      setImportHasSignatures(tx.signatures.length > 0);
      setImportParseError(null);
      trackEvent(TrackingEvent.TRANSACTION_IMPORT_XDR_VALID);
    } catch (e) {
      setImportParseError(
        e instanceof Error
          ? e.message
          : "Unable to parse transaction envelope XDR",
      );
      setImportParsedType(null);
      setImportHasSignatures(false);
      trackEvent(TrackingEvent.TRANSACTION_IMPORT_XDR_INVALID);
    }
  };

  // Build the overview field list, mirroring the sign page's Transaction
  // overview (constants/signTransactionPage.ts).
  const getOverviewFields = () => {
    if (!parsedTx) return null;

    const requiredFields = [
      { label: "Signing for", value: network.passphrase },
      { label: "Transaction envelope XDR", value: importXdr },
      { label: "Transaction hash", value: parsedTx.hash().toString("hex") },
    ];

    if (parsedTx instanceof FeeBumpTransaction) {
      return [...requiredFields, ...FEE_BUMP_TX_FIELDS(parsedTx)];
    }
    return [...requiredFields, ...TX_FIELDS(parsedTx)];
  };

  const overviewFields = getOverviewFields();
  const hasSignatures = Boolean(parsedTx?.signatures.length);

  return (
    <Box gap="md">
      <TransactionStepHeader
        heading="Import transaction"
        onClearAll={resetAll}
        xdr={importXdr}
        activeStep="import"
      />
      {importState?.importXdr && !importState?.parseError ? (
        <Alert
          variant="success"
          title="Transaction imported successfully."
          placement="inline"
        >
          Review the details and proceed to signing and submission.
        </Alert>
      ) : (
        <PageCard>
          <XdrPicker
            id="import-tx-xdr"
            label="Transaction envelope in XDR "
            value={importXdr}
            error={parseError ?? undefined}
            onChange={(e) => onChange(e.target.value)}
          />
        </PageCard>
      )}

      {overviewFields ? (
        <>
          <PageCard heading="Transaction overview" headingAs="h2">
            <div className="SignTx__FieldViewer">
              {overviewFields.map((field) => {
                const valueStr =
                  field.value === undefined || field.value === null
                    ? ""
                    : field.value.toString();
                const className =
                  valueStr.length >= MIN_LENGTH_FOR_FULL_WIDTH_FIELD
                    ? "full-width"
                    : "half-width";

                if (field.label.includes("XDR")) {
                  return (
                    <div className={className} key={field.label}>
                      <XdrPicker
                        readOnly
                        id={field.label}
                        label={field.label}
                        value={valueStr}
                      />
                    </div>
                  );
                }

                return (
                  <div className={className} key={field.label}>
                    <TextPicker
                      readOnly
                      id={field.label}
                      label={field.label}
                      value={valueStr}
                      copyButton={{
                        position: "right",
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </PageCard>

          {hasSignatures ? <Signatures tx={parsedTx} /> : null}
        </>
      ) : null}
    </Box>
  );
};
