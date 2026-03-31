"use client";

import { useCallback, useEffect, useState } from "react";
import { Button, Icon, RadioButton, Text } from "@stellar/design-system";
import { authorizeEntry, Keypair, xdr } from "@stellar/stellar-sdk";

import { SignTransactionXdr } from "@/components/SignTransactionXdr";
import { Box } from "@/components/layout/Box";

import { AuthEntryItem } from "./AuthEntryItem";

import { validate } from "@/validate";

import "./styles.scss";

type SignMode = "all" | "individual";

/**
 * Signs auth entries with the provided secret keys via `authorizeEntry()`.
 * Returns signed entries for the given indices.
 */
const signAuthEntries = async ({
  authEntriesXdr,
  entryIndices,
  secretKeys,
  validUntilLedgerSeq,
  networkPassphrase,
}: {
  authEntriesXdr: string[];
  entryIndices: number[];
  secretKeys: string[];
  validUntilLedgerSeq: number;
  networkPassphrase: string;
}): Promise<{ index: number; signedEntryXdr: string }[]> => {
  const results: { index: number; signedEntryXdr: string }[] = [];

  for (const idx of entryIndices) {
    const entry = xdr.SorobanAuthorizationEntry.fromXDR(
      authEntriesXdr[idx],
      "base64",
    );

    // Only sign entries with address credentials — source account
    // credentials are authorized by the transaction envelope signature
    if (entry.credentials().switch().name === "sorobanCredentialsAddress") {
      let signed = entry;
      for (const secretKey of secretKeys) {
        if (secretKey && !validate.getSecretKeyError(secretKey)) {
          const keypair = Keypair.fromSecret(secretKey);
          signed = await authorizeEntry(
            signed,
            keypair,
            validUntilLedgerSeq,
            networkPassphrase,
          );
        }
      }
      results.push({ index: idx, signedEntryXdr: signed.toXDR("base64") });
    } else {
      // Pass through non-address entries as-is
      results.push({ index: idx, signedEntryXdr: authEntriesXdr[idx] });
    }
  }

  return results;
};

/**
 * Card component that orchestrates Soroban auth entry signing.
 *
 * Uses `SignTransactionXdr` with a `customSignFn` to call `authorizeEntry()`
 * instead of envelope signing, preserving the full signing UI (secret key,
 * wallet extension, hardware wallet tabs).
 *
 * - Collapsed: only shows header with entry count + "View auth entries"
 * - Expanded "Sign all": entry list + one shared signing area at the bottom
 * - Expanded "Sign individually": each entry has its own embedded signing area
 */
export const SorobanAuthSigningCard = ({
  authEntriesXdr,
  signedAuthEntriesXdr,
  builtXdr,
  validUntilLedgerSeq,
  networkPassphrase,
  onAuthEntrySigned,
  onAllEntriesSigned,
}: {
  authEntriesXdr: string[];
  signedAuthEntriesXdr: string[];
  /** The built transaction XDR — passed to SignTransactionXdr for display */
  builtXdr: string;
  /** Ledger sequence after which the auth entries expire */
  validUntilLedgerSeq: number;
  /** Network passphrase for signing */
  networkPassphrase: string;
  /** Called when a single entry is signed (index + signed XDR) */
  onAuthEntrySigned: (index: number, signedEntryXdr: string) => void;
  /** Called when all entries have been signed */
  onAllEntriesSigned: (signedEntries: string[]) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [signMode, setSignMode] = useState<SignMode>("all");

  const entryCount = authEntriesXdr.length;
  const signedCount = signedAuthEntriesXdr.filter(Boolean).length;
  const allSigned = signedCount === entryCount && entryCount > 0;

  // Trigger onAllEntriesSigned when individual signing completes all entries
  useEffect(() => {
    if (allSigned) {
      onAllEntriesSigned(signedAuthEntriesXdr);
    }
    // Only trigger when allSigned changes to true
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allSigned]);

  const unsignedIndices = authEntriesXdr
    .map((_, i) => i)
    .filter((i) => !signedAuthEntriesXdr[i]);

  /**
   * Custom sign function for "Sign all" mode. Called by SignTransactionXdr
   * instead of its default envelope signing logic.
   */
  const handleCustomSignAll = useCallback(
    async ({ secretKeys }: { secretKeys: string[] }) => {
      try {
        const results = await signAuthEntries({
          authEntriesXdr,
          entryIndices: unsignedIndices,
          secretKeys,
          validUntilLedgerSeq,
          networkPassphrase,
        });

        // Build the complete signed entries array
        const merged = [...signedAuthEntriesXdr];
        results.forEach(({ index, signedEntryXdr }) => {
          merged[index] = signedEntryXdr;
          onAuthEntrySigned(index, signedEntryXdr);
        });

        // If all are now signed, trigger assembly
        const willAllBeSigned = authEntriesXdr.every((_, i) => merged[i]);
        if (willAllBeSigned) {
          onAllEntriesSigned(merged);
        }

        const count = results.length;
        return {
          successMessage: `Signed ${count} auth ${count === 1 ? "entry" : "entries"}`,
          errorMessage: "",
        };
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        return { successMessage: "", errorMessage: msg };
      }
    },
    [
      authEntriesXdr,
      unsignedIndices,
      signedAuthEntriesXdr,
      validUntilLedgerSeq,
      networkPassphrase,
      onAuthEntrySigned,
      onAllEntriesSigned,
    ],
  );

  return (
    <div className="SorobanAuthSigning">
      {/* Header: title + "View auth entries" button */}
      <div
        className={`SorobanAuthSigning__header${isExpanded ? " SorobanAuthSigning__header--expanded" : ""}`}
      >
        <div className="SorobanAuthSigning__header-text">
          <Text
            as="div"
            size="sm"
            weight="medium"
            addlClassName="SorobanAuthSigning__header-title"
          >
            This transaction requires additional authorization signatures
          </Text>
          <Text as="div" size="sm">
            {`${entryCount} authorization ${entryCount === 1 ? "entry" : "entries"} detected`}
          </Text>
        </div>

        <Button
          size="sm"
          variant="tertiary"
          icon={isExpanded ? <Icon.ChevronUp /> : <Icon.ChevronDown />}
          iconPosition="right"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          View auth entries
        </Button>
      </div>

      {/* Body — only visible when expanded */}
      {isExpanded && (
        <div className="SorobanAuthSigning__body">
          {/* Sign mode radio */}
          <Box gap="md" direction="row">
            <RadioButton
              id="sign-mode-all"
              label="Sign all entries"
              fieldSize="sm"
              name="sign-mode"
              value="all"
              checked={signMode === "all"}
              onChange={() => setSignMode("all")}
            />
            <RadioButton
              id="sign-mode-individual"
              label="Sign individually"
              fieldSize="sm"
              name="sign-mode"
              value="individual"
              checked={signMode === "individual"}
              onChange={() => setSignMode("individual")}
            />
          </Box>

          {/* Entry list */}
          <Box gap="md">
            <div className="SorobanAuthSigning__entries">
              {authEntriesXdr.map((entryXdr, idx) => (
                <AuthEntryItem
                  key={`auth-entry-${idx}`}
                  index={idx}
                  entryXdr={entryXdr}
                  isSigned={Boolean(signedAuthEntriesXdr[idx])}
                  showSigningArea={signMode === "individual"}
                  builtXdr={builtXdr}
                  authEntriesXdr={authEntriesXdr}
                  validUntilLedgerSeq={validUntilLedgerSeq}
                  networkPassphrase={networkPassphrase}
                  onAuthSigned={onAuthEntrySigned}
                />
              ))}
            </div>

            {/* Shared signing area — only in "Sign all" mode */}
            {signMode === "all" && !allSigned && (
              <SignTransactionXdr
                id="auth-sign-all"
                title="Sign auth entries"
                xdrToSign={builtXdr}
                customSignFn={handleCustomSignAll}
                onDoneAction={() => {
                  // Success/error handled by customSignFn callbacks
                }}
              />
            )}
          </Box>
        </div>
      )}
    </div>
  );
};
