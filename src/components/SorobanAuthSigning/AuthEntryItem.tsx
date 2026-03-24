"use client";

import { useState } from "react";
import { Button, Icon, Text } from "@stellar/design-system";

import { Box } from "@/components/layout/Box";
import { CodeEditor } from "@/components/CodeEditor";
import { SignTransactionXdr } from "@/components/SignTransactionXdr";

import { decodeXdr } from "@/helpers/decodeXdr";
import { useIsXdrInit } from "@/hooks/useIsXdrInit";
import { prettifyJsonString } from "@/helpers/prettifyJsonString";

/**
 * A single auth entry row: "Entry #N" + Unsigned/Signed badge + chevron.
 *
 * Chevron expands to show the decoded auth entry JSON (via StellarXdr WASM
 * decode, same approach as XDR viewer/diff pages). When `showSigningArea` is
 * true ("Sign individually" mode), the expanded view also includes an
 * embedded signing area for this specific entry.
 *
 * @example
 * <AuthEntryItem index={0} entryXdr="AAAAAA..." isSigned={false} showSigningArea={false} />
 */
export const AuthEntryItem = ({
  index,
  entryXdr,
  isSigned,
  showSigningArea,
  builtXdr,
  onAuthSigned,
}: {
  index: number;
  entryXdr: string;
  isSigned: boolean;
  showSigningArea: boolean;
  /** The built transaction XDR — passed to SignTransactionXdr for signing. */
  builtXdr: string;
  /** Called when this entry is signed in "Sign individually" mode. */
  onAuthSigned: (result: {
    signedXdr: string | null;
    successMessage: string | null;
    errorMessage: string | null;
  }) => void;
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

  return (
    <div
      className="SorobanAuthSigning__entry"
      data-is-expanded={isExpanded || undefined}
    >
      <div
        className="SorobanAuthSigning__entry-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="SorobanAuthSigning__entry-label">
          <Text as="span" size="sm" weight="medium">
            {`Entry #${index + 1}`}
          </Text>
          <span
            className="SorobanAuthSigning__badge"
            data-variant={isSigned ? "signed" : "unsigned"}
          >
            {isSigned ? "Signed" : "Unsigned"}
          </span>
        </div>
        <Button
          size="sm"
          variant="tertiary"
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
              onDoneAction={onAuthSigned}
            />
          )}
        </Box>
      )}
    </div>
  );
};
