"use client";

import { useCallback, useState } from "react";
import { Badge, Icon, IconButton, Text } from "@stellar/design-system";
import { authorizeEntry, Keypair, xdr } from "@stellar/stellar-sdk";

import { Box } from "@/components/layout/Box";
import { CodeEditor } from "@/components/CodeEditor";
import { SignTransactionXdr } from "@/components/SignTransactionXdr";

import { decodeXdr } from "@/helpers/decodeXdr";
import { prettifyJsonString } from "@/helpers/prettifyJsonString";
import { useIsXdrInit } from "@/hooks/useIsXdrInit";

import { validate } from "@/validate";

/**
 * A single auth entry row: "Entry #N" + Unsigned/Signed badge + chevron.
 *
 * Chevron expands to show the decoded auth entry JSON (via StellarXdr WASM
 * decode, same approach as XDR viewer/diff pages). When `showSigningArea` is
 * true ("Sign individually" mode), the expanded view includes an embedded
 * `SignTransactionXdr` with `customSignFn` for auth-entry-specific signing.
 */
export const AuthEntryItem = ({
  index,
  entryXdr,
  isSigned,
  showSigningArea,
  builtXdr,
  authEntriesXdr,
  validUntilLedgerSeq,
  networkPassphrase,
  onAuthSigned,
}: {
  index: number;
  entryXdr: string;
  isSigned: boolean;
  showSigningArea: boolean;
  /** The built transaction XDR — passed to SignTransactionXdr */
  builtXdr: string;
  /** All auth entry XDR strings */
  authEntriesXdr: string[];
  /** Ledger sequence after which the auth entry expires */
  validUntilLedgerSeq: number;
  /** Network passphrase for signing */
  networkPassphrase: string;
  /** Called when this entry is signed (index + signed XDR) */
  onAuthSigned: (index: number, signedEntryXdr: string) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isXdrInit = useIsXdrInit();

  // Decode the auth entry XDR to JSON for display
  const decoded = isExpanded
    ? decodeXdr({
        xdrType: "SorobanAuthorizationEntry",
        xdrBlob: entryXdr,
        isReady: isXdrInit,
      })
    : null;

  const decodedJson = decoded?.jsonString
    ? prettifyJsonString(decoded.jsonString)
    : "";

  /**
   * Custom sign function for this specific entry. Called by
   * SignTransactionXdr instead of its default envelope signing.
   */
  const handleCustomSign = useCallback(
    async ({ secretKeys }: { secretKeys: string[] }) => {
      try {
        const entry = xdr.SorobanAuthorizationEntry.fromXDR(
          authEntriesXdr[index],
          "base64",
        );

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
          onAuthSigned(index, signed.toXDR("base64"));
        } else {
          onAuthSigned(index, authEntriesXdr[index]);
        }

        return {
          successMessage: `Signed entry #${index + 1}`,
          errorMessage: "",
        };
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        return { successMessage: "", errorMessage: msg };
      }
    },
    [authEntriesXdr, index, validUntilLedgerSeq, networkPassphrase, onAuthSigned],
  );

  return (
    <div
      className="SorobanAuthSigning__entry"
      data-is-expanded={isExpanded || undefined}
    >
      <div
        className="SorobanAuthSigning__entry-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Box gap="sm" direction="row" align="center">
          <Text as="span" size="xs" weight="bold">
            {`Entry #${index + 1}`}
          </Text>
          <Badge variant={isSigned ? "success" : "tertiary"} size="sm">
            {isSigned ? "Signed" : "Unsigned"}
          </Badge>
        </Box>
        <IconButton
          altText="chevron"
          icon={isExpanded ? <Icon.ChevronUp /> : <Icon.ChevronDown />}
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
        />
      </div>

      {isExpanded && (
        <Box gap="sm">
          <div className="SorobanAuthSigning__entry-details">
            {decodedJson ? (
              <CodeEditor
                value={decodedJson}
                selectedLanguage="json"
                maxHeightInRem="20"
              />
            ) : decoded?.error ? (
              <Text as="div" size="xs">
                {decoded.error}
              </Text>
            ) : (
              <Text as="div" size="xs">
                Decoding...
              </Text>
            )}
          </div>
          {/* Per-entry signing area — only in "Sign individually" mode */}
          {showSigningArea && !isSigned && (
            <SignTransactionXdr
              id={`auth-sign-entry-${index}`}
              title={`Sign entry #${index + 1}`}
              xdrToSign={builtXdr}
              customSignFn={handleCustomSign}
              onDoneAction={() => {
                // Success/error handled by customSignFn callback
              }}
            />
          )}
        </Box>
      )}
    </div>
  );
};
